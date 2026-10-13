// Bereitet ein Release vor bzw. schließt es ab (siehe Abschnitt "Release" im README).
//
// Aufruf:  npm run release:prepare -- <version> [--dry-run] [--no-fresh] [--skip-tests] [--container] [--skip-git-checks]
//                                          [--with-theme | --skip-theme]
//          npm run release:updater -- <version> [--dry-run] [--with-theme | --skip-theme]
//          npm run release:finish [-- --yes]
//
// prepare: Versionen anheben, Updater anlegen, Changelog- und Wiki-Entwurf schreiben, npm install, Smoketest.
//          Committet nichts.
// updater: Nur den Updater update-<version> anlegen (z.B. während der Entwicklung für eigene Migrationen).
// finish:  Prüft den Release-Commit und wartet auf alle CI-Workflows, die er auslöst. Nach einer Rückfrage merged
//          es develop nach main und legt das GitHub-Release an. Das Release startet die Workflows publish-*.yml.
//
// Release-Branches: develop (Release über main) oder ein Pflege-Branch v<major>.x, z.B. v21.x, auf dem direkt
// veröffentlicht wird (npm-Tag v<major>-lts, kein GitHub-"Latest"), siehe releaseLine in release-lib.js.
const { spawnSync } = require('child_process');
const fs = require('fs');
const os = require('os');
const path = require('path');
const readline = require('readline');
const lib = require('./release-lib');

const workspace = path.resolve(__dirname, '..');
const NPM_REGISTRY = 'https://registry.npmjs.org/';
const THEME_PACKAGE = '@ihk-gfi/lux-components-theme';
const ACTIONS_URL = 'https://github.com/IHK-GfI/lux-components-workspace/actions';

const files = {
  rootPackage: 'package.json',
  libPackage: 'projects/lux-components-lib/package.json',
  themePackage: 'projects/lux-components-theme/package.json',
  updaterPackage: 'projects/lux-components-update/package.json',
  demoApp: 'projects/demo-app/src/app/app.component.html',
  libChangelog: 'projects/lux-components-lib/CHANGELOG.md',
  themeChangelog: 'projects/lux-components-theme/CHANGELOG.md',
  // Der Update Guide hängt von der Hauptversion ab: lib.updateGuidePath(version)
  collection: 'projects/lux-components-update/collection.json',
  updates: 'projects/lux-components-update/src/updates',
  lockfile: 'package-lock.json'
};

// ---------------------------------------------------------------------------
// Hilfsfunktionen
// ---------------------------------------------------------------------------

class ReleaseError extends Error {}

function fail(message) {
  throw new ReleaseError(message);
}

function info(message) {
  console.log(message);
}

// Warnungen werden am Ende von prepare wiederholt, damit sie nicht unter der Ausgabe von npm verschwinden.
const warnings = [];

function warn(message) {
  warnings.push(message);
  info(`  Warnung: ${message}`);
}

function step(message) {
  // Fett, weiß auf cyanem Grund; ohne Terminal bzw. mit NO_COLOR bleibt es bei einfachem Text.
  const color = process.stdout.isTTY && !process.env.NO_COLOR;
  const line = `▶ ${message}`;
  const rule = '═'.repeat(Math.max(line.length + 2, 120));
  console.log(`\n\n${color ? `\x1b[36m${rule}\x1b[0m` : rule}`);
  console.log(color ? `\x1b[1;97;46m ${line} \x1b[0m` : ` ${line}`);
  console.log(color ? `\x1b[36m${rule}\x1b[0m` : rule);
}

/** Startet einen Prozess im Workspace. Bricht bei Fehler ab, außer allowFailure ist gesetzt. */
function run(command, args, { capture = true, allowFailure = false, env } = {}) {
  // npm ist unter Windows eine .cmd-Datei und lässt sich nur über die Shell starten. Die Shell bekommt
  // einen fertigen Befehl (die Argumente sind hier immer feste Werte ohne Leerzeichen).
  const shell = process.platform === 'win32' && command === 'npm';
  const result = spawnSync(shell ? [command, ...args].join(' ') : command, shell ? [] : args, {
    cwd: workspace,
    encoding: 'utf8',
    // z.B. "git show <tag>:package-lock.json" (über 500 KB) passt nicht in die voreingestellten 1 MB auf Dauer.
    maxBuffer: 64 * 1024 * 1024,
    stdio: capture ? 'pipe' : 'inherit',
    shell,
    env: env ? { ...process.env, ...env } : process.env
  });
  if (result.error) {
    if (allowFailure) {
      return { ok: false, stdout: '' };
    }
    fail(`"${command}" konnte nicht gestartet werden: ${result.error.message}`);
  }
  if (result.status !== 0 && !allowFailure) {
    fail(`"${command} ${args.join(' ')}" ist fehlgeschlagen (Exit-Code ${result.status}).\n${result.stderr ?? ''}`.trim());
  }
  // Nur am Ende kürzen: Bei "git status --porcelain" gehört ein führendes Leerzeichen zum Status.
  return { ok: result.status === 0, stdout: (result.stdout ?? '').trimEnd() };
}

const git = (...args) => run('git', args).stdout;

const tagExists = (tag) => run('git', ['rev-parse', '--verify', '--quiet', `refs/tags/${tag}`], { allowFailure: true }).ok;

/** Holt Tags und die angegebenen Branches einmal pro Lauf, damit die Prüfungen auf dem Stand von origin arbeiten. */
function fetchOrigin(...branches) {
  run('git', ['fetch', '--quiet', '--tags', 'origin', ...branches], { allowFailure: true });
}

/**
 * Release-Linie des aktuellen Branches (develop oder Pflege-Branch v<major>.x). Auf anderen Branches bricht das
 * Skript ab, außer allowOther ist gesetzt (Dry Run, --skip-git-checks): dann mit Warnung wie auf develop.
 */
function currentReleaseLine(allowOther) {
  const branch = git('branch', '--show-current');
  const line = lib.releaseLine(branch);
  if (line) {
    return line;
  }
  const message = `Aktueller Branch ist "${branch}", erwartet wird "develop" oder ein Pflege-Branch "v<major>.x".`;
  if (!allowOther) {
    fail(message);
  }
  warn(`${message} Es wird wie auf develop vorgegangen.`);
  return lib.releaseLine('develop');
}

/** Auf einem Pflege-Branch v<major>.x sind nur Versionen dieser Hauptversion erlaubt. */
function checkLineVersion(line, version) {
  if (line.major !== undefined && lib.parseVersion(version).major !== line.major) {
    fail(`Auf dem Pflege-Branch ${line.work} sind nur Versionen ${line.major}.x.y möglich, nicht ${version}.`);
  }
}

function describeLine(line) {
  const branches = line.work === line.target ? line.work : `${line.work} -> ${line.target}`;
  return `${branches}, npm-Tag ${line.npmTag}`;
}

/** Liest eine Textdatei mit LF-Zeilenenden und merkt sich das ursprüngliche Zeilenende (core.autocrlf). */
function readText(file) {
  const raw = fs.readFileSync(path.join(workspace, file), 'utf8');
  const crlf = (raw.match(/\r\n/g) ?? []).length;
  const lf = (raw.match(/\n/g) ?? []).length - crlf;
  return { text: raw.replace(/\r\n/g, '\n'), eol: crlf > lf ? '\r\n' : '\n' };
}

// Eine gemeinsame Eingabe für alle Rückfragen: Bei weitergeleitetem stdin liest readline alle Zeilen auf
// einmal, ein zweites Interface bekäme nur noch einen geschlossenen Stream. Deshalb werden Zeilen gepuffert.
let input;

function openInput() {
  if (!input) {
    input = { rl: readline.createInterface({ input: process.stdin }), lines: [], waiting: undefined, closed: false };
    input.rl.on('line', (line) => {
      const waiting = input.waiting;
      input.waiting = undefined;
      waiting ? waiting.resolve(line) : input.lines.push(line);
    });
    input.rl.on('close', () => {
      input.closed = true;
      input.waiting?.reject();
    });
  }
  return input;
}

function closeInput() {
  input?.rl.close();
}

function confirm(question, assumeYes) {
  if (assumeYes) {
    info(`${question} [j/N] j (--yes)`);
    return Promise.resolve(true);
  }
  const stdin = openInput();
  process.stdout.write(`${question} [j/N] `);
  return new Promise((resolve, reject) => {
    const answer = (line) => resolve(/^(j|ja|y|yes)$/i.test(line.trim()));
    // Ohne Terminal bzw. bei geschlossenem stdin kommt nie eine Antwort: abbrechen statt still zu enden.
    const closed = () => reject(new ReleaseError(`Keine Antwort auf "${question}" möglich (stdin ist geschlossen). Abgebrochen.`));
    if (stdin.lines.length > 0) {
      answer(stdin.lines.shift());
    } else if (stdin.closed) {
      closed();
    } else {
      stdin.waiting = { resolve: answer, reject: closed };
    }
  });
}

/** Sammelt alle Dateiänderungen und schreibt sie erst am Ende (bzw. gar nicht bei --dry-run). */
// Bereits erledigte Schritte (z.B. bei einem zweiten Lauf oder bei schon während der Entwicklung
// angelegtem Updater/Wiki-Abschnitt) werden übersprungen.
class Changes {
  constructor() {
    this.entries = [];
    this.skipped = [];
  }

  update(file, transform, skipReason = 'bereits aktuell') {
    const { text, eol } = readText(file);
    const updated = transform(text);
    if (updated === text) {
      this.skipped.push({ file, reason: skipReason });
      return;
    }
    this.entries.push({ file, text: updated, eol, isNew: false });
  }

  create(file, text) {
    if (fs.existsSync(path.join(workspace, file))) {
      this.skipped.push({ file, reason: 'existiert bereits' });
      return;
    }
    this.entries.push({ file, text, eol: '\n', isNew: true });
  }

  write() {
    for (const { file, text, eol } of this.entries) {
      const target = path.join(workspace, file);
      fs.mkdirSync(path.dirname(target), { recursive: true });
      fs.writeFileSync(target, eol === '\n' ? text : text.replace(/\n/g, eol));
    }
  }

  print() {
    for (const { file, isNew } of this.entries) {
      info(`  ${isNew ? 'neu         ' : 'geändert    '}  ${file}`);
    }
    for (const { file, reason } of this.skipped) {
      info(`  übersprungen  ${file} (${reason})`);
    }
  }
}

/** Ersetzt die Vorgängerversion durch die neue, außer die neue steht schon in der Datei. */
function bumpVersion(text, format, previous, version, file) {
  return text.includes(format(version)) ? text : replaceExactlyOnce(text, format(previous), format(version), file);
}

/** Setzt alle luxVersion="x.y.z" im Demo-Footer auf die neue Version und warnt bei unerwarteten alten Werten. */
function bumpDemoFooter(text, previous, version) {
  const pattern = /luxVersion="(\d+\.\d+\.\d+)"/g;
  const found = [...text.matchAll(pattern)].map((match) => match[1]);
  if (found.length === 0) {
    fail(`${files.demoApp}: Kein luxVersion="x.y.z" gefunden.`);
  }
  const unexpected = [...new Set(found.filter((value) => value !== previous && value !== version))];
  if (unexpected.length > 0) {
    warn(`${files.demoApp} stand auf luxVersion="${unexpected.join('", "')}" statt "${previous}", wird auf ${version} gesetzt.`);
  }
  return text.replace(pattern, `luxVersion="${version}"`);
}

/** Höchstes Release-Tag vX.Y.Z vor der neuen Version (funktioniert auch, wenn die Versionen schon angehoben sind). */
function previousReleaseVersion(version) {
  const versions = git('tag', '--list', 'v*', '--merged', 'HEAD')
    .split('\n')
    .map((tag) => tag.trim().replace(/^v/, ''))
    .filter((tag) => /^\d+\.\d+\.\d+$/.test(tag) && lib.compareVersions(tag, version) < 0)
    .sort(lib.compareVersions);
  if (versions.length === 0) {
    fail(`Kein Release-Tag vor ${version} gefunden (git fetch --tags?).`);
  }
  return versions[versions.length - 1];
}

function replaceExactlyOnce(text, search, replacement, file) {
  const count = text.split(search).length - 1;
  if (count !== 1) {
    fail(`${file}: "${search}" wurde ${count}-mal statt genau einmal gefunden.`);
  }
  return text.replace(search, replacement);
}

/** Commit-Betreffs seit dem letzten Release-Tag, optional auf einen Pfad beschränkt. */
function commitSubjects(fromTag, pathFilter) {
  const args = ['log', `${fromTag}..HEAD`, '--no-merges', '--format=%s'];
  if (pathFilter) {
    args.push('--', pathFilter);
  }
  return git(...args)
    .split('\n')
    .filter((line) => line.length > 0);
}

// ---------------------------------------------------------------------------
// prepare
// ---------------------------------------------------------------------------

/** Dateien, die prepare selbst schreibt. Änderungen daran stammen aus einem früheren Lauf und sind erlaubt. */
function isReleaseFile(file, version) {
  const managed = Object.entries(files)
    .filter(([key]) => key !== 'updates')
    .map(([, value]) => value);
  return managed.includes(file) || file === lib.updateGuidePath(version) || file.startsWith(`${files.updates}/${version}/`);
}

function checkGitState(version, line, warnOnly) {
  const problems = [];
  const changed = git('status', '--porcelain', '--untracked-files=all')
    .split('\n')
    .filter((line) => line.length > 0)
    // Format "XY pfad" bzw. "XY alt -> neu"; Pfade mit Sonderzeichen stehen in Anführungszeichen.
    .map((line) => line.slice(3).split(' -> ').pop().replace(/^"|"$/g, ''));
  const foreign = changed.filter((file) => !isReleaseFile(file, version));
  if (foreign.length > 0) {
    const list = foreign.slice(0, 5).join(', ') + (foreign.length > 5 ? ', ...' : '');
    problems.push(`Der Working Tree enthält uncommittete Änderungen außerhalb der Release-Dateien: ${list}`);
  } else if (changed.length > 0) {
    info(`  Hinweis: ${changed.length} Release-Datei(en) sind bereits geändert (früherer Lauf), sie werden weiterverwendet.`);
  }
  const upstream = run('git', ['rev-parse', '--verify', '--quiet', `origin/${line.work}`], { allowFailure: true }).stdout;
  if (upstream && upstream !== git('rev-parse', 'HEAD')) {
    problems.push(`HEAD entspricht nicht origin/${line.work} (erst pullen bzw. pushen).`);
  }

  for (const problem of problems) {
    if (warnOnly) {
      warn(problem);
    } else {
      fail(`${problem}\nMit --skip-git-checks lässt sich die Prüfung überspringen (nur zum Testen).`);
    }
  }
}

function checkThemeLinked() {
  const lock = JSON.parse(fs.readFileSync(path.join(workspace, files.lockfile), 'utf8'));
  const entry = lock.packages?.[`node_modules/${THEME_PACKAGE}`];
  if (!entry?.link) {
    fail(
      `${THEME_PACKAGE} wird in der package-lock.json nicht als Workspace-Link aufgelöst ` +
        `(resolved: ${entry?.resolved ?? '–'}). Version im Root und im Theme-Projekt prüfen.`
    );
  }
  info(`  ${THEME_PACKAGE} ist als Workspace-Link aufgelöst (${entry.resolved}).`);
}

function hasCommand(command) {
  return run(command, ['--version'], { allowFailure: true }).ok;
}

/**
 * Entscheidet, ob das Theme mit veröffentlicht wird: nur wenn sich seit dem letzten Release Dateien unter
 * projects/lux-components-theme geändert haben (--with-theme bzw. --skip-theme überschreiben das). Verglichen
 * wird der Inhalt, nicht die Commit-Betreffs, damit auch Änderungen aus Commits ohne Issue-Nummer zählen und
 * zurückgenommene Änderungen nicht.
 * Ohne Theme-Release bleiben Theme-Version und Theme-Abhängigkeit im Root unverändert (wie bei 21.3.1).
 */
function themeRelease(previousTag, version, flags) {
  const themeDir = 'projects/lux-components-theme';
  const before = JSON.parse(git('show', `${previousTag}:${files.themePackage}`)).version;
  const current = JSON.parse(readText(files.themePackage).text).version;
  const rootDependency = JSON.parse(readText(files.rootPackage).text).dependencies[THEME_PACKAGE];
  if (![before, version].includes(current) || rootDependency !== current) {
    fail(
      `Unerwartete Theme-Versionen: ${files.themePackage} hat ${current}, die Root-Abhängigkeit ${rootDependency} ` +
        `(erwartet: beide ${before} wie beim letzten Release oder ${version}).`
    );
  }

  // Verglichen wird mit der zuletzt veröffentlichten Theme-Version, damit Änderungen aus einem Release ohne
  // Theme (z.B. mit --skip-theme) beim nächsten Release wieder erkannt werden.
  const themeTag = tagExists(`v${before}`) ? `v${before}` : previousTag;
  // Nur committete Änderungen zählen (HEAD), nicht die von einem früheren prepare-Lauf geschriebenen Dateien.
  const changedFiles = git('diff', '--name-only', themeTag, 'HEAD', '--', themeDir)
    .split('\n')
    .filter((file) => file.length > 0);
  const subjects = commitSubjects(themeTag, themeDir);
  const entries = lib.collectIssueEntries(subjects);

  let withTheme;
  let reason;
  if (flags.withTheme) {
    [withTheme, reason] = [true, '--with-theme'];
  } else if (flags.skipTheme) {
    [withTheme, reason] = [false, '--skip-theme'];
  } else if (current === version) {
    [withTheme, reason] = [true, `das Theme steht bereits auf ${version}`];
  } else {
    [withTheme, reason] = [
      changedFiles.length > 0,
      changedFiles.length > 0 ? `${changedFiles.length} geänderte Datei(en) seit ${themeTag}` : `keine Änderungen seit ${themeTag}`
    ];
  }
  if (!withTheme && current === version) {
    fail(`Das Theme steht bereits auf ${version}. Mit --with-theme fortfahren oder die Theme-Version auf ${before} zurücksetzen.`);
  }

  info(`  Theme: ${withTheme ? `wird als ${version} veröffentlicht` : `bleibt auf ${before}, kein Theme-Release`} (${reason}).`);
  changedFiles.slice(0, 10).forEach((file) => info(`    - ${file}`));
  if (changedFiles.length > 10) {
    info(`    - ... und ${changedFiles.length - 10} weitere`);
  }
  if (withTheme && entries.length === 0) {
    info('  Hinweis: Keine Commits "Issue #N: ..." unter dem Theme, das Theme-CHANGELOG bekommt ein TODO. Betroffene Commits:');
    subjects.filter((subject) => !/^Release /.test(subject)).forEach((subject) => info(`    - ${subject}`));
  }

  if (!withTheme) {
    for (const change of themeBuildChanges(themeTag)) {
      info(`  Hinweis: ${change} seit ${themeTag}. Ändert das die gebauten Themes, --with-theme verwenden.`);
    }
  }
  return { withTheme, before, entries, themeTag };
}

// Die vorgefertigten Themes werden gegen diese Pakete aus den node_modules im Root gebaut.
const THEME_BUILD_DEPENDENCIES = ['@angular/material', '@angular/cdk'];

/**
 * Installierte Versionen (laut package-lock.json, nicht nur die Bereiche aus der package.json) der Pakete, gegen die
 * die Themes gebaut werden, die sich seit dem letzten Theme-Release geändert haben, z.B. "@angular/material 21.2.14 -> 21.3.0".
 */
function themeBuildChanges(themeTag) {
  const locked = (text) => {
    const lock = JSON.parse(text);
    return Object.fromEntries(THEME_BUILD_DEPENDENCIES.map((name) => [name, lock.packages?.[`node_modules/${name}`]?.version]));
  };
  const before = locked(git('show', `${themeTag}:${files.lockfile}`));
  const now = locked(fs.readFileSync(path.join(workspace, files.lockfile), 'utf8'));
  return THEME_BUILD_DEPENDENCIES.filter((name) => before[name] !== now[name]).map((name) => `${name} ${before[name]} -> ${now[name]}`);
}

/** Meldung, wenn ein vorhandener Updater nicht zur Theme-Entscheidung passt (sonst undefined). */
function updaterThemeMismatch(version, withTheme) {
  const indexFile = `${files.updates}/${version}/index.ts`;
  if (!fs.existsSync(path.join(workspace, indexFile))) {
    return undefined;
  }
  const updatesTheme = readText(indexFile).text.includes(`updateDep('${THEME_PACKAGE}', '${version}'`);
  if (updatesTheme === withTheme) {
    return undefined;
  }
  return (
    `${indexFile} ${updatesTheme ? 'hebt' : 'hebt nicht'} das Theme auf ${version} an, ` +
    `das Theme wird aber ${withTheme ? '' : 'nicht '}veröffentlicht. Bitte die Zeile ` +
    `updateDep('${THEME_PACKAGE}', '${version}', false) und den Test entsprechend anpassen.`
  );
}

/** Legt den Updater update-<version> an. Vorhandene Dateien und ein vorhandener collection.json-Eintrag bleiben unverändert. */
function addUpdater(changes, version, previous, theme) {
  const updateDir = `${files.updates}/${version}`;
  if (fs.existsSync(path.join(workspace, updateDir))) {
    info(`  Hinweis: ${updateDir} existiert bereits, vorhandene Dateien bleiben unverändert.`);
  }
  // Ein vorhandener Updater wird nie überschrieben (eigene Migrationen). Passt er nicht, warnt prepare, finish bricht ab.
  const mismatch = updaterThemeMismatch(version, theme.withTheme);
  if (mismatch) {
    warn(mismatch);
  }
  changes.create(`${updateDir}/index.ts`, lib.updaterIndexTs(version, theme.withTheme));
  changes.create(`${updateDir}/index.spec.ts`, lib.updaterSpecTs(version, previous, theme.withTheme, theme.before));
  changes.create(`${updateDir}/schema.json`, lib.updaterSchemaJson(version));
  changes.update(files.collection, (text) => lib.insertCollectionEntry(text, version), `"update-${version}" existiert bereits`);
}

/** Nur den Updater anlegen, z.B. während der Entwicklung, um eigene Migrationen zu ergänzen. */
function updater(version, flags) {
  lib.parseVersion(version);
  fetchOrigin();
  checkNotReleased(version);
  const previous = previousReleaseVersion(version);
  info(`Updater update-${version} anlegen (Vorgänger: ${previous})${flags.dryRun ? ' (Dry Run, es wird nichts geschrieben)' : ''}`);
  const theme = themeRelease(`v${previous}`, version, flags);

  const changes = new Changes();
  addUpdater(changes, version, previous, theme);

  step(flags.dryRun ? 'Folgende Dateien würden geschrieben' : 'Dateien schreiben');
  changes.print();
  if (!flags.dryRun) {
    changes.write();
    info(`\nFertig. Eigene Migrationen in ${files.updates}/${version}/index.ts ergänzen, testen mit: npm run test:updater`);
  }
}

/**
 * Schreibt den Changelog-Abschnitt der Version. Ein vorhandener Abschnitt (z.B. von PRs vorab befüllt) bleibt
 * erhalten, nur fehlende Issues werden ergänzt. Ohne Issues entsteht ein Abschnitt mit "- TODO" (finish lehnt ihn ab).
 */
function addChangelog(changes, file, version, entries) {
  const before = readText(file).text;
  const exists = lib.hasChangelogSection(before, version);
  changes.update(file, (text) => lib.mergeChangelogSection(text, version, entries));

  const after = changes.entries.find((entry) => entry.file === file)?.text ?? before;
  const notes = lib.extractReleaseNotes(after, version);
  info(`\n${file}${exists ? ' (vorhandener Abschnitt, fehlende Issues werden ergänzt)' : ''}:\n## Version ${version}\n\n${notes}`);
  if (lib.hasTodo(notes)) {
    warn(`${file}: Keine Commits "Issue #N: ..." gefunden, im Changelog steht ein TODO.`);
  }
}

/** Bricht ab, wenn es das Tag der Version schon gibt (z.B. versehentlich die zuletzt veröffentlichte Version). */
function checkNotReleased(version) {
  if (tagExists(`v${version}`)) {
    fail(`Version ${version} ist bereits veröffentlicht (Tag v${version} existiert).`);
  }
}

async function prepare(version, flags) {
  lib.parseVersion(version);
  const line = currentReleaseLine(flags.dryRun || flags.skipGitChecks);
  checkLineVersion(line, version);
  fetchOrigin(line.work);
  checkNotReleased(version);

  const previous = previousReleaseVersion(version);
  const previousTag = `v${previous}`;
  const current = JSON.parse(readText(files.rootPackage).text).version;
  if (current !== previous && current !== version) {
    fail(`Die package.json hat die Version ${current}, erwartet wird ${previous} (letztes Release) oder ${version}.`);
  }
  const updateGuide = lib.updateGuidePath(version);
  if (line.wiki && !fs.existsSync(path.join(workspace, updateGuide))) {
    fail(`${updateGuide} fehlt. Bei einer neuen Hauptversion bitte zuerst den Update Guide anlegen.`);
  }

  info(`Release ${previous} -> ${version} (${describeLine(line)})${flags.dryRun ? ' (Dry Run, es wird nichts geschrieben)' : ''}`);

  step('Git-Stand prüfen');
  checkGitState(version, line, flags.dryRun || flags.skipGitChecks);

  const changes = new Changes();

  step('Theme-Release prüfen');
  const theme = themeRelease(previousTag, version, flags);

  step('Versionen anheben');
  const packageVersion = (v) => `"version": "${v}"`;
  for (const file of [files.libPackage, files.updaterPackage]) {
    changes.update(file, (text) => bumpVersion(text, packageVersion, previous, version, file));
  }
  // Das Theme ist ein Workspace: Stimmt die Root-Abhängigkeit mit der Theme-Version überein, wird es lokal
  // verlinkt statt aus der Registry geladen. Deshalb werden beide nur gemeinsam angehoben.
  const themeDependency = (v) => `"${THEME_PACKAGE}": "${v}"`;
  if (theme.withTheme) {
    changes.update(files.themePackage, (text) => bumpVersion(text, packageVersion, theme.before, version, files.themePackage));
  }
  changes.update(files.rootPackage, (text) => {
    const bumped = bumpVersion(text, packageVersion, previous, version, files.rootPackage);
    return theme.withTheme ? bumpVersion(bumped, themeDependency, theme.before, version, files.rootPackage) : bumped;
  });
  changes.update(files.demoApp, (text) => bumpDemoFooter(text, previous, version));
  info(`  Bibliothek, Updater, Root, Demo-Footer: ${previous} -> ${version}`);
  info(`  Theme (Paket und Root-Abhängigkeit):    ${theme.withTheme ? `${theme.before} -> ${version}` : `${theme.before} (unverändert)`}`);

  step('Updater anlegen');
  addUpdater(changes, version, previous, theme);

  step(`Changelog-Entwurf aus "git log ${previousTag}..HEAD"`);
  const libEntries = lib.collectIssueEntries(commitSubjects(previousTag));
  addChangelog(changes, files.libChangelog, version, libEntries);
  if (theme.withTheme) {
    addChangelog(changes, files.themeChangelog, version, theme.entries);
  } else {
    changes.skipped.push({ file: files.themeChangelog, reason: 'kein Theme-Release' });
  }

  step('Wiki-Abschnitt anlegen');
  if (!line.wiki) {
    info(`  Übersprungen: Das Wiki wird zentral auf develop gepflegt (Abschnitt "### Version ${version}" dort nachtragen).`);
  } else {
    if (lib.hasWikiSection(readText(updateGuide).text, version)) {
      info(`  Hinweis: "### Version ${version}" existiert bereits im Update-Guide und bleibt unverändert.`);
    }
    changes.update(updateGuide, (text) => lib.insertWikiSection(text, version), `"### Version ${version}" existiert bereits`);
  }

  step(flags.dryRun ? 'Folgende Dateien würden geschrieben' : 'Dateien schreiben');
  changes.print();
  if (flags.dryRun) {
    info(
      `\nDry Run beendet. npm install und Smoketest wurden übersprungen.${warnings.length > 0 ? ` ${warnings.length} Warnung(en), siehe oben.` : ''}`
    );
    return;
  }
  changes.write();

  step(`npm install (Registry: ${NPM_REGISTRY})`);
  if (flags.fresh) {
    info('  node_modules und package-lock.json werden gelöscht...');
    fs.rmSync(path.join(workspace, 'node_modules'), { recursive: true, force: true, maxRetries: 3 });
    fs.rmSync(path.join(workspace, files.lockfile), { force: true });
  }
  // Die Umgebungsvariable überschreibt die Registry aus der .npmrc (z.B. Nexus) nur für diesen Aufruf.
  run('npm', ['install'], { capture: false, env: { npm_config_registry: NPM_REGISTRY } });
  checkThemeLinked();
  // Erst nach der Installation steht fest, welche Material-Version tatsächlich verwendet wird.
  if (!theme.withTheme) {
    for (const change of themeBuildChanges(theme.themeTag)) {
      warn(`${change} seit ${theme.themeTag}, das Theme wird aber nicht veröffentlicht. Ggf. mit --with-theme erneut ausführen.`);
    }
  }

  if (flags.skipTests) {
    info('\nSmoketest übersprungen (--skip-tests).');
  } else {
    step('npm run smoketest');
    run('npm', ['run', 'smoketest'], { capture: false });
  }

  if (flags.container) {
    step('Container-Image bauen und scannen');
    if (hasCommand('podman') && hasCommand('trivy')) {
      run('podman', ['build', '--no-cache', '--pull', '-t', 'lux-components-demo:local', '.'], { capture: false });
      run('trivy', ['image', 'lux-components-demo:local'], { capture: false });
    } else {
      info('  podman oder trivy ist nicht installiert, Schritt übersprungen.');
    }
  }

  if (warnings.length > 0) {
    info(`\nWarnungen (bitte vor dem Commit prüfen):`);
    warnings.forEach((message) => info(`  - ${message}`));
  }

  const guideStep = line.wiki
    ? `Ggf. Hinweise im Update Guide ergänzen: ${updateGuide}`
    : `Nach dem Release auf develop in ${updateGuide} den Abschnitt "### Version ${version}" nachtragen
     (siehe Vorlage unten); ins Wiki kommt er mit dem nächsten Release von main.`;
  info(`
Fertig. Nächste Schritte (siehe Abschnitt "Release" im README):
  1. Changelog-Einträge prüfen: ${files.libChangelog}${theme.withTheme ? ` und ${files.themeChangelog}` : ''}
  2. ${guideStep}
  3. Committen und pushen:  git add --all && git commit -m "Release v${version}" && git push
  4. Sobald die Actions zum Release-Commit (die Smoketests) grün sind:  npm run release:finish
     ${ACTIONS_URL}
  5. Die Publish-Workflows unter ${ACTIONS_URL} abwarten.`);
  if (!line.wiki) {
    info(`\nVorlage für ${updateGuide} (auf develop, auch im Inhaltsverzeichnis eintragen):\n\n${lib.wikiSection(version)}`);
  }
}

// ---------------------------------------------------------------------------
// finish
// ---------------------------------------------------------------------------

const WORKFLOWS_DIR = '.github/workflows';

/** Workflow-Läufe zum Commit, je Workflow-Datei nur der neueste (die API liefert die neuesten zuerst). */
function workflowRuns(sha) {
  const json = run('gh', ['api', `repos/{owner}/{repo}/actions/runs?head_sha=${sha}&per_page=100`]).stdout;
  const runs = new Map();
  for (const workflowRun of JSON.parse(json).workflow_runs) {
    const file = workflowRun.path.replace(/@.*$/, '');
    if (!runs.has(file)) {
      runs.set(file, { file, name: workflowRun.name, status: workflowRun.status, conclusion: workflowRun.conclusion });
    }
  }
  return [...runs.values()];
}

/**
 * Workflows, die der Push des Release-Commits auslösen muss. Die Smoketests laufen nur bei Änderungen in ihren
 * Pfaden, deshalb ergibt sich das aus den Dateien des Commits. Direkt nach dem Push fehlen sonst einzelne Läufe noch.
 */
function expectedWorkflows(sha) {
  const changed = git('diff-tree', '-r', '-z', '--no-commit-id', '--name-only', sha)
    .split('\0')
    .filter((file) => file.length > 0);
  return fs
    .readdirSync(path.join(workspace, WORKFLOWS_DIR))
    .filter((file) => /\.ya?ml$/.test(file))
    .map((file) => `${WORKFLOWS_DIR}/${file}`)
    .filter((file) => lib.triggeredByPush(readText(file).text, changed));
}

/**
 * Prüft vor dem Merge, dass die Release-Dateien zusammenpassen: sonst scheitern die Publish-Workflows erst,
 * nachdem main gepusht und das Tag angelegt ist.
 */
function checkReleaseFiles(version, line) {
  const problems = [];
  const versionOf = (file) => JSON.parse(readText(file).text).version;
  for (const file of [files.libPackage, files.updaterPackage]) {
    if (versionOf(file) !== version) {
      problems.push(`${file} hat die Version ${versionOf(file)} statt ${version}.`);
    }
  }
  const themeVersion = versionOf(files.themePackage);
  const themeDependency = JSON.parse(readText(files.rootPackage).text).dependencies[THEME_PACKAGE];
  if (themeDependency !== themeVersion) {
    problems.push(`Die Root-Abhängigkeit ${THEME_PACKAGE} ist ${themeDependency}, das Theme-Projekt hat ${themeVersion}.`);
  }
  if (!readText(files.collection).text.includes(`"update-${version}"`)) {
    problems.push(`${files.collection} enthält keinen Eintrag "update-${version}".`);
  }
  if (!fs.existsSync(path.join(workspace, files.updates, version, 'index.ts'))) {
    problems.push(`${files.updates}/${version}/index.ts fehlt.`);
  }
  const mismatch = updaterThemeMismatch(version, themeVersion === version);
  if (mismatch) {
    problems.push(mismatch);
  }
  const updateGuide = lib.updateGuidePath(version);
  if (line.wiki && (!fs.existsSync(path.join(workspace, updateGuide)) || !lib.hasWikiSection(readText(updateGuide).text, version))) {
    problems.push(`${updateGuide} enthält keinen Abschnitt "### Version ${version}".`);
  }
  const footer = [...readText(files.demoApp).text.matchAll(/luxVersion="([^"]*)"/g)].map((match) => match[1]);
  if (footer.length === 0 || footer.some((value) => value !== version)) {
    problems.push(`${files.demoApp}: luxVersion steht auf "${footer.join('", "')}" statt "${version}".`);
  }
  if (problems.length > 0) {
    fail(`Die Release-Dateien passen nicht zu ${version}:\n${problems.map((problem) => `  - ${problem}`).join('\n')}`);
  }
}

/** Bricht ab, solange in den Changelogs der Version noch der Platzhalter "- TODO" steht. */
function checkChangelogsComplete(version, notes) {
  if (lib.hasTodo(notes)) {
    fail(`${files.libChangelog}: Unter "## Version ${version}" steht noch "- TODO". Bitte die Einträge ergänzen.`);
  }
  // Theme-Release erkennt man an der angehobenen Theme-Version.
  if (JSON.parse(readText(files.themePackage).text).version === version) {
    const themeNotes = lib.extractReleaseNotes(readText(files.themeChangelog).text, version);
    if (lib.hasTodo(themeNotes)) {
      fail(`${files.themeChangelog}: Unter "## Version ${version}" steht noch "- TODO". Bitte die Einträge ergänzen.`);
    }
  }
}

/**
 * Bringt den Release-Branch (main) per Fast-Forward auf den Stand des Arbeits-Branches (develop) und pusht. Kein
 * Merge-Commit: So zeigt das Release-Tag auf einen Commit von develop, und das nächste prepare findet es über
 * "git tag --merged". Auf einem Pflege-Branch sind beide gleich, dann entfällt der Schritt.
 */
function mergeIntoTarget({ work, target }) {
  git('switch', target);
  let error;
  try {
    git('pull', '--ff-only');
    if (!run('git', ['merge', '--ff-only', work], { allowFailure: true }).ok) {
      fail(
        `${target} lässt sich nicht per Fast-Forward auf ${work} bringen (Commits nur auf ${target}?). Bitte manuell prüfen, es wurde nichts gepusht.`
      );
    }
    git('push');
  } catch (caught) {
    error = caught;
  }
  // Ein Fehler beim Zurückwechseln darf die eigentliche Ursache nicht verdecken.
  const back = run('git', ['switch', work], { allowFailure: true });
  if (error) {
    throw back.ok
      ? error
      : new ReleaseError(`${error.message}\nAchtung: Der Wechsel zurück auf ${work} ist fehlgeschlagen, der Checkout steht auf ${target}.`);
  }
  if (!back.ok) {
    fail(`${target} wurde gepusht, aber der Wechsel zurück auf ${work} ist fehlgeschlagen. Bitte "git switch ${work}" ausführen.`);
  }
}

async function finish(flags) {
  const version = JSON.parse(readText(files.rootPackage).text).version;
  const tag = `v${version}`;
  info(`Release ${tag} abschließen`);

  step('Release-Commit prüfen');
  const line = currentReleaseLine(false);
  info(`  ${describeLine(line)}`);
  checkLineVersion(line, version);
  if (git('status', '--porcelain') !== '') {
    fail('Der Working Tree enthält uncommittete Änderungen.');
  }
  const fetched = run('git', ['fetch', '--quiet', '--tags', 'origin', ...new Set([line.work, line.target])], { allowFailure: true });
  if (!fetched.ok) {
    fail(
      `Der Branch ${[...new Set([line.work, line.target])].join(' bzw. ')} konnte nicht von origin geholt werden (noch nicht gepusht?).`
    );
  }
  const sha = git('rev-parse', 'HEAD');
  if (sha !== git('rev-parse', `origin/${line.work}`)) {
    fail(`HEAD entspricht nicht origin/${line.work}. Bitte zuerst pushen bzw. pullen.`);
  }
  const subject = git('log', '-1', '--format=%s');
  if (subject !== `Release ${tag}`) {
    fail(`Der letzte Commit heißt "${subject}" statt "Release ${tag}".`);
  }
  checkNotReleased(version);
  checkReleaseFiles(version, line);
  const notes = lib.extractReleaseNotes(readText(files.libChangelog).text, version);
  checkChangelogsComplete(version, notes);

  step(`CI-Workflows von ${sha.slice(0, 8)} prüfen`);
  const runs = workflowRuns(sha);
  for (const workflowRun of runs) {
    info(`  ${(workflowRun.conclusion ?? workflowRun.status).padEnd(11)} ${workflowRun.name}`);
  }
  const expected = expectedWorkflows(sha);
  const missing = expected.filter((file) => !runs.some((workflowRun) => workflowRun.file === file));
  for (const file of missing) {
    info(`  ${'fehlt'.padEnd(11)} ${file}`);
  }
  const pending = runs.filter((workflowRun) => workflowRun.status !== 'completed');
  const failed = runs.filter(
    (workflowRun) => workflowRun.status === 'completed' && !['success', 'skipped', 'neutral'].includes(workflowRun.conclusion)
  );
  if (failed.length > 0) {
    fail('Mindestens ein Workflow ist fehlgeschlagen.');
  }
  if (pending.length > 0 || missing.length > 0) {
    // Direkt nach dem Push legt GitHub die Läufe oft erst an.
    fail('Es laufen noch Workflows bzw. sind noch nicht gestartet. Bitte warten und dann erneut ausführen.');
  }
  if (runs.length === 0) {
    // Sicherheitsnetz, falls sich die erwarteten Workflows nicht bestimmen ließen. Das darf --yes nicht stillschweigend übergehen.
    if (flags.yes) {
      fail('Für den Commit gibt es (noch) keine Workflow-Läufe. Bitte warten und erneut ausführen, oder ohne --yes bewusst bestätigen.');
    }
    if (!(await confirm('Für den Commit gibt es keine Workflow-Läufe. Trotzdem fortfahren?', false))) {
      fail('Abgebrochen.');
    }
  }

  step(`GitHub-Release ${tag} vorbereiten`);
  const notesFile = path.join(fs.mkdtempSync(path.join(os.tmpdir(), 'lux-release-')), `release-notes-${version}.md`);
  fs.writeFileSync(notesFile, notes);
  info(`\nRelease-Notes (${notesFile}):\n${notes}`);
  // Das Tag kommt auf den geprüften Commit, nicht auf den Branch: Pusht inzwischen jemand darauf, bleibt es dabei.
  // Ein Release aus einem Pflege-Branch wird nicht "Latest", das bleibt die aktuelle Hauptversion.
  const latest = line.latest ? '--latest' : '--latest=false';
  const create = ['release', 'create', tag, '--target', sha, '--title', tag, '--notes-file', notesFile, latest];
  const manual = `gh ${create.map((arg) => (arg === notesFile ? `"${arg}"` : arg)).join(' ')}`;

  // Eine Rückfrage vor allem, was nach außen wirkt: Danach wird nichts mehr abgebrochen, das halb gepusht ist.
  // Das Release kommt erst nach dem Push von main, weil release-check verlangt, dass das Tag schon auf main liegt.
  const merge = line.work !== line.target;
  const release = `GitHub-Release ${tag} auf ${sha.slice(0, 8)} veröffentlichen`;
  const question = merge
    ? `${line.work} nach ${line.target} mergen, ${line.target} pushen und ${release}? Damit starten die Publish-Workflows.`
    : `${release} (${line.target})? Damit starten die Publish-Workflows.`;
  if (!(await confirm(question, flags.yes))) {
    fail('Abgebrochen, es wurde nichts gepusht.');
  }

  if (merge) {
    step(`${line.work} nach ${line.target} mergen`);
    mergeIntoTarget(line);
  }

  step(`GitHub-Release ${tag} anlegen`);
  if (!run('gh', create, { capture: false, allowFailure: true }).ok) {
    fail(
      `${merge ? `${line.target} ist gepusht, aber das` : 'Das'} GitHub-Release konnte nicht angelegt werden. ` +
        `Bitte manuell nachholen (oder release:finish erneut ausführen):\n  ${manual}`
    );
  }

  info(`
Fertig. Das Release startet publish-theme, publish-components, publish-updater und publish-wiki.
Die Publish-Workflows unter ${ACTIONS_URL} abwarten.`);
  if (!line.wiki) {
    info(
      `Das Wiki bleibt bei einem Pflege-Release unverändert: Den Abschnitt "### Version ${version}" in ` +
        `${lib.updateGuidePath(version)} auf develop nachtragen, er erscheint mit dem nächsten Release von main.`
    );
  }
}

// ---------------------------------------------------------------------------
// main
// ---------------------------------------------------------------------------

// Erlaubte Optionen je Befehl. finish kennt z.B. keinen Dry Run: --dry-run dort still zu ignorieren, hieße zu veröffentlichen.
const COMMAND_OPTIONS = {
  prepare: ['--dry-run', '--no-fresh', '--skip-tests', '--container', '--skip-git-checks', '--with-theme', '--skip-theme'],
  updater: ['--dry-run', '--with-theme', '--skip-theme'],
  finish: ['--yes']
};

function parseArgs(argv) {
  const [command, ...rest] = argv;
  const positional = rest.filter((arg) => !arg.startsWith('--'));
  const options = new Set(rest.filter((arg) => arg.startsWith('--')));
  const allowed = COMMAND_OPTIONS[command] ?? [];
  // Ohne "--" vor den Optionen behält npm sie für sich (z.B. --dry-run als npm_config_dry_run) und das Skript
  // sieht sie nicht. Dann lieber abbrechen, als z.B. statt eines Dry Runs einen echten Lauf zu starten.
  // npm meldet so auch Einstellungen aus einer .npmrc. Ausgenommen ist --yes: Es steht dort oft für npx, und fehlt
  // es dem Skript, fragt finish nur nach.
  const known = [...new Set(Object.values(COMMAND_OPTIONS).flat())].filter((option) => option !== '--yes');
  const swallowed = process.env.npm_lifecycle_event
    ? known.filter((option) => process.env[`npm_config_${option.slice(2).replace(/^no-/, '').replace(/-/g, '_')}`] !== undefined)
    : [];
  for (const option of [...options, ...swallowed]) {
    if (!allowed.includes(option)) {
      fail(`Unbekannte Option ${option} für "${command}". Erlaubt: ${allowed.join(', ') || 'keine'}`);
    }
  }
  if (swallowed.length > 0) {
    fail(
      `npm hat die Option(en) ${swallowed.join(', ')} abgefangen. Optionen bitte nach "--" angeben, z.B.:\n` +
        `  npm run ${process.env.npm_lifecycle_event} -- ${[...positional, ...swallowed].join(' ')}\n` +
        `Steht die Option in einer .npmrc (npm config list), bitte dort entfernen.`
    );
  }
  if (options.has('--with-theme') && options.has('--skip-theme')) {
    fail('--with-theme und --skip-theme schließen sich aus.');
  }
  return {
    command,
    version: positional[0],
    flags: {
      dryRun: options.has('--dry-run'),
      fresh: !options.has('--no-fresh'),
      skipTests: options.has('--skip-tests'),
      container: options.has('--container'),
      skipGitChecks: options.has('--skip-git-checks'),
      yes: options.has('--yes'),
      withTheme: options.has('--with-theme'),
      skipTheme: options.has('--skip-theme')
    }
  };
}

async function main() {
  const { command, version, flags } = parseArgs(process.argv.slice(2));
  try {
    if (command === 'prepare' && version) {
      await prepare(version, flags);
    } else if (command === 'updater' && version) {
      updater(version, flags);
    } else if (command === 'finish') {
      await finish(flags);
    } else {
      fail('Aufruf: node scripts/release.js prepare <version> [Optionen] | updater <version> [Optionen] | finish [--yes]');
    }
  } finally {
    // Eine offene Eingabe (Rückfragen) hält den Prozess sonst am Leben.
    closeInput();
  }
}

main().catch((error) => {
  // release-lib meldet ungültige Eingaben und unerwartete Dateiinhalte mit einfachen Errors, dafür reicht die Meldung.
  // Bei echten Programmfehlern (TypeError usw.) hilft der Stacktrace.
  const expected = error instanceof ReleaseError || error.constructor === Error;
  console.error(`\n✖ ${expected ? error.message : error.stack}`);
  process.exit(1);
});
