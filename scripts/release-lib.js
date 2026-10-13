// Reine Hilfsfunktionen für scripts/release.js (ohne Dateisystem, Git oder Prozesse),
// damit sie mit "node --test" getestet werden können (siehe release-lib.test.js).

// ---------------------------------------------------------------------------
// Versionen
// ---------------------------------------------------------------------------

function parseVersion(version) {
  const match = /^(\d+)\.(\d+)\.(\d+)$/.exec(version ?? '');
  if (!match) {
    throw new Error(`Ungültige Version "${version}" (erwartet: Major.Minor.Patch, z.B. 21.10.0).`);
  }
  return { major: +match[1], minor: +match[2], patch: +match[3] };
}

function compareVersions(a, b) {
  const va = parseVersion(a);
  const vb = parseVersion(b);
  return va.major - vb.major || va.minor - vb.minor || va.patch - vb.patch;
}

/**
 * Release-Linie eines Branches:
 * - "develop": gearbeitet wird auf develop, veröffentlicht über main, npm-Tag "latest", GitHub-Release "Latest".
 * - Pflege-Branch "v<major>.x" (z.B. v21.x, wie früher v19.x): gearbeitet und veröffentlicht wird direkt auf dem
 *   Branch, npm-Tag "v<major>-lts", das GitHub-Release ist nicht "Latest", nur Versionen <major>.x.y.
 * wiki: Das Wiki (auch der Update Guide) wird für alle Hauptversionen zentral auf develop gepflegt und nur aus
 * Releases von main veröffentlicht. Auf einem Pflege-Branch fasst das Skript es deshalb nicht an.
 * Andere Branches sind keine Release-Branches (undefined).
 */
function releaseLine(branch) {
  if (branch === 'develop') {
    return { work: 'develop', target: 'main', npmTag: 'latest', latest: true, wiki: true, major: undefined };
  }
  const match = /^v(\d+)\.x$/.exec(branch ?? '');
  if (match) {
    return { work: branch, target: branch, npmTag: `v${match[1]}-lts`, latest: false, wiki: false, major: +match[1] };
  }
  return undefined;
}

/** Update Guide der Hauptversion, z.B. 21.10.0 -> projects/lux-components-wiki/Update-Guide-v21.md. */
function updateGuidePath(version) {
  return `projects/lux-components-wiki/Update-Guide-v${parseVersion(version).major}.md`;
}

/** Nummer für den Funktionsnamen im Updater, z.B. 21.10.0 -> "211000" (update211000). */
function versionCode(version) {
  const { major, minor, patch } = parseVersion(version);
  const pad = (n) => String(n).padStart(2, '0');
  return `${major}${pad(minor)}${pad(patch)}`;
}

// ---------------------------------------------------------------------------
// Changelog
// ---------------------------------------------------------------------------

/**
 * Führt einen (Revert-)Betreff auf den ursprünglichen Commit zurück und zählt die Rücknahmen:
 * 'Revert "X"' zählt 1, 'Reapply "X"' zählt 2 (so nennt Git ab 2.43 den Revert eines Reverts).
 * Ein angehängtes ' (#N)' von Squash-Merges wird ignoriert. Gerade Anzahl = Änderung ist enthalten.
 */
function unwrapReverts(subject) {
  let original = subject;
  let reverts = 0;
  for (let match; (match = /^(Revert|Reapply) "(.*)"(?: \(#\d+\))?$/.exec(original)); ) {
    original = match[2];
    reverts += match[1] === 'Revert' ? 1 : 2;
  }
  return { original, reverts };
}

/**
 * Ermittelt aus den Commit-Betreffs (git log, neueste zuerst) die Changelog-Einträge.
 * Übernommen werden Commits der Form "Issue #N: ..." (auch "issue N ..." oder mit Präfix wie "Demo: Issue #N: ...",
 * so lässt sie auch der commit-msg-Hook zu); die Einträge werden einheitlich als "Issue #N: ..." ausgegeben.
 * Ein Revert nimmt den Commit zurück, ein Reapply bzw. Revert des Reverts spielt ihn wieder ein usw. Zugeordnet
 * wird ohne angehängte PR-Nummer, weil Revert-PRs sie oft nicht übernehmen. Ergebnis: nach Issue-Nummer sortiert.
 */
function collectIssueEntries(subjects) {
  // Betreff ohne PR-Nummer -> nach dem letzten (Revert-)Commit enthalten? Text vom ursprünglichen Commit.
  const changes = new Map();
  for (const subject of [...subjects].reverse()) {
    const { original, reverts } = unwrapReverts(subject);
    const key = original.replace(/ \(#\d+\)$/, '');
    const text = reverts === 0 ? original : (changes.get(key)?.text ?? original);
    changes.set(key, { included: reverts % 2 === 0, text });
  }

  const entries = [];
  for (const { included, text } of changes.values()) {
    const match = /^(?:[\w-]+:\s*)?Issue #?(\d+)(?::\s*|\s+)(\S.*)$/i.exec(text);
    if (match && included) {
      entries.push({ issue: +match[1], text: `Issue #${match[1]}: ${match[2]}` });
    }
  }

  // Array.prototype.sort ist stabil: Commits zum selben Issue bleiben in zeitlicher Reihenfolge.
  return entries.sort((a, b) => a.issue - b.issue).map((entry) => entry.text);
}

/** true, wenn der Text noch den Platzhalter "- TODO" aus changelogSection enthält. */
function hasTodo(text) {
  return /^- TODO$/m.test(text);
}

function changelogSection(version, entries) {
  const lines = entries.length > 0 ? entries.map((entry) => `- ${entry}`) : ['- TODO'];
  return `## Version ${version}\n\n### Issues\n\n${lines.join('\n')}\n`;
}

/** Issue-Nummer eines Listeneintrags "- Issue #N: ..." (auch "- Issue N ..."), sonst undefined. */
function issueNumberOf(line) {
  const match = /^- Issue #?(\d+)\b/i.exec(line);
  return match ? +match[1] : undefined;
}

/**
 * Schreibt die Einträge in den Abschnitt "## Version <version>" und baut das Inhaltsverzeichnis neu auf.
 * Fehlt der Abschnitt, wird er vor dem bisher neuesten "## Version" angelegt. Gibt es ihn schon (z.B. von
 * PRs vorab mit ausführlichen Einträgen befüllt), bleibt alles Vorhandene wörtlich erhalten: Einträge zu Issues,
 * die unter "### Issues" noch nicht stehen, werden nach Issue-Nummer einsortiert (wie in einem neuen Abschnitt
 * alle Commits eines Issues); ein "- TODO" entfällt dann. Bleibt die Liste leer, steht dort "- TODO".
 */
function mergeChangelogSection(content, version, entries) {
  const lines = content.split('\n');
  const start = lines.indexOf(`## Version ${version}`);
  if (start < 0) {
    const index = content.search(/^## Version /m);
    if (index < 0) {
      throw new Error('Im CHANGELOG wurde kein Abschnitt "## Version ..." gefunden.');
    }
    return rebuildToc(content.slice(0, index) + changelogSection(version, entries) + '\n' + content.slice(index));
  }

  let end = lines.findIndex((line, i) => i > start && /^## /.test(line));
  if (end < 0) {
    end = lines.length;
  }
  let issuesStart = lines.findIndex((line, i) => i > start && i < end && line === '### Issues');
  if (issuesStart < 0) {
    // Ohne "### Issues" wird der Unterabschnitt am Ende des Versionsabschnitts angehängt.
    let insertAt = end;
    while (insertAt > start + 1 && lines[insertAt - 1] === '') {
      insertAt--;
    }
    lines.splice(insertAt, 0, '', '### Issues', '');
    issuesStart = insertAt + 1;
    end += 3;
  }
  let issuesEnd = lines.findIndex((line, i) => i > issuesStart && i < end && /^#{1,6} /.test(line));
  if (issuesEnd < 0) {
    issuesEnd = end;
  }

  const body = lines.slice(issuesStart + 1, issuesEnd);
  // Nur Issues, die schon vor diesem Lauf im Abschnitt standen, gelten als gepflegt und werden übersprungen.
  const curated = new Set(body.map(issueNumberOf).filter((issue) => issue !== undefined));
  for (const entry of entries) {
    const issue = issueNumberOf(`- ${entry}`);
    if (curated.has(issue)) {
      continue;
    }
    // Vor dem ersten Eintrag mit höherer Nummer einfügen, sonst hinter dem letzten Eintrag (inkl. eingerückter Folgezeilen).
    let position = body.findIndex((line) => (issueNumberOf(line) ?? -1) > issue);
    if (position < 0) {
      const last = body.findLastIndex((line) => /^- /.test(line));
      position = last < 0 ? 1 : last + 1;
      while (last >= 0 && position < body.length && /^\s+\S/.test(body[position])) {
        position++;
      }
    }
    body.splice(position, 0, `- ${entry}`);
  }
  const hasIssues = body.some((line) => issueNumberOf(line) !== undefined);
  const todo = body.indexOf('- TODO');
  if (hasIssues && todo >= 0) {
    body.splice(todo, 1);
  } else if (!body.some((line) => /^- /.test(line))) {
    // Ohne jeden Eintrag hält der Platzhalter finish auf, statt leere Release-Notes zu veröffentlichen.
    body.splice(body[0] === '' ? 1 : 0, 0, '- TODO');
  }
  if (body.length === 0 || body[body.length - 1] !== '') {
    body.push('');
  }
  if (body[0] !== '') {
    body.unshift('');
  }

  return rebuildToc([...lines.slice(0, issuesStart + 1), ...body, ...lines.slice(issuesEnd)].join('\n'));
}

function hasChangelogSection(content, version) {
  return content.split('\n').includes(`## Version ${version}`);
}

/** Anker wie GitHub bzw. "Markdown All in One": klein, Satzzeichen weg, Leerzeichen -> "-". */
function slugify(heading) {
  return heading
    .trim()
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s_-]/gu, '')
    .replace(/\s/g, '-');
}

/**
 * Erzeugt das Inhaltsverzeichnis (die Liste direkt nach der ersten Überschrift) aus allen
 * Überschriften neu. Gleiche Anker werden wie bei GitHub durchnummeriert (#issues, #issues-1, ...).
 */
function rebuildToc(content) {
  const lines = content.split('\n');

  const tocStart = lines.findIndex((line) => /^\s*- \[/.test(line));
  if (tocStart < 0) {
    throw new Error('Im CHANGELOG wurde kein Inhaltsverzeichnis gefunden.');
  }
  let tocEnd = tocStart;
  while (tocEnd < lines.length && /^\s*- \[/.test(lines[tocEnd])) {
    tocEnd++;
  }

  const counts = new Map();
  const toc = [];
  let inFence = false;
  for (const raw of lines) {
    const line = raw.replace(/\r$/, '');
    if (/^```/.test(line)) {
      inFence = !inFence;
    }
    const heading = !inFence && /^(#{1,6})\s+(.*)$/.exec(line);
    if (!heading) {
      continue;
    }
    const title = heading[2].trim();
    const slug = slugify(title);
    const count = counts.get(slug) ?? 0;
    counts.set(slug, count + 1);
    toc.push(`${'  '.repeat(heading[1].length - 1)}- [${title}](#${count === 0 ? slug : `${slug}-${count}`})`);
  }

  return [...lines.slice(0, tocStart), ...toc, ...lines.slice(tocEnd)].join('\n');
}

/** Liefert den Abschnitt "### Issues" (inkl. Überschrift) der angegebenen Version für die GitHub-Release-Notes. */
function extractReleaseNotes(changelog, version) {
  const lines = changelog.replace(/\r\n/g, '\n').split('\n');
  const versionStart = lines.indexOf(`## Version ${version}`);
  if (versionStart < 0) {
    throw new Error(`Im CHANGELOG fehlt der Abschnitt "## Version ${version}".`);
  }
  let versionEnd = lines.findIndex((line, i) => i > versionStart && /^## /.test(line));
  if (versionEnd < 0) {
    versionEnd = lines.length;
  }
  const start = lines.findIndex((line, i) => i > versionStart && i < versionEnd && line === '### Issues');
  if (start < 0) {
    throw new Error(`Im CHANGELOG fehlt unter "## Version ${version}" der Abschnitt "### Issues".`);
  }
  let end = lines.findIndex((line, i) => i > start && i < versionEnd && /^#{1,3} /.test(line));
  if (end < 0) {
    end = versionEnd;
  }
  return lines.slice(start, end).join('\n').trim() + '\n';
}

// ---------------------------------------------------------------------------
// Wiki (Update-Guide)
// ---------------------------------------------------------------------------

function wikiSection(version) {
  return `### Version ${version}

In diesem Abschnitt wird beschrieben, wie man die LUX-Components aktualisieren kann. Alle Updates sind inkrementelle Updates. D.h. alle Updates müssen in der korrekten Reihenfolge ausgeführt werden und **es darf kein Update übersprungen werden**, da jedes Update, neben der Versionsaktualisierung in der \`package.json\`, auch potenziell weitere wichtige Änderungen enthalten kann, die sonst fehlen würden.

- LUX-Components-Updater aktualisieren:
  - \`npm update @ihk-gfi/lux-components-update\`
- LUX-Components-Updater ausführen:
  - \`ng generate @ihk-gfi/lux-components-update:update-${version}\`
- Wenn Probleme beim Ausführen von \`npm install\` mit den Abhängigkeiten (z.B. \`@angular-devkit/build-angular\`,...) auftreten sollten, bitte einmal den \`node_modules\`-Ordner und die \`package-lock.json\`-Datei löschen und noch einmal \`npm install\` ausführen.
- Fertig!
`;
}

/**
 * Fügt den Versionsabschnitt vor dem bisher neuesten "### Version" ein und ergänzt das Inhaltsverzeichnis.
 * Ein schon vorhandener Abschnitt (z.B. während der Entwicklung mit Hinweisen angelegt) bleibt unverändert,
 * nur ein fehlender TOC-Eintrag wird ergänzt.
 */
function insertWikiSection(content, version) {
  const sectionIndex = content.search(/^### Version /m);
  // [ \t]* statt \s*, damit die Einrückung keine vorangehende Leerzeile mit erfasst.
  const tocMatch = /^([ \t]*)- \[Version [^\]]+\]\(#version-[^)]*\)$/m.exec(content);
  if (sectionIndex < 0 || !tocMatch) {
    throw new Error('Im Update-Guide wurde kein Abschnitt "### Version ..." bzw. kein passender TOC-Eintrag gefunden.');
  }
  const tocLine = `${tocMatch[1]}- [Version ${version}](#${slugify(`Version ${version}`)})\n`;
  const hasSection = hasWikiSection(content, version);
  const hasTocLine = content.split('\n').includes(tocLine.slice(0, -1));

  // Zuerst den Abschnitt einfügen (liegt hinter dem TOC), damit tocMatch.index gültig bleibt.
  const withSection = hasSection ? content : content.slice(0, sectionIndex) + wikiSection(version) + '\n' + content.slice(sectionIndex);
  return hasTocLine ? withSection : withSection.slice(0, tocMatch.index) + tocLine + withSection.slice(tocMatch.index);
}

function hasWikiSection(content, version) {
  return content.split('\n').includes(`### Version ${version}`);
}

// ---------------------------------------------------------------------------
// Updater (projects/lux-components-update)
// ---------------------------------------------------------------------------

/**
 * Updater-Vorlage. Ohne Theme-Release (withTheme = false) bleibt die Theme-Version der Anwendung
 * unverändert, wie z.B. bei 21.3.1.
 */
function updaterIndexTs(version, withTheme = true) {
  const themeLine = withTheme ? `\n      updateDep('@ihk-gfi/lux-components-theme', '${version}', false),` : '';
  return `import { chain, Rule, SchematicContext, Tree } from '@angular-devkit/schematics';
import * as chalk from 'chalk';
import { updateDep } from '../../update-dependencies/index';
import { Options } from '../../utility/types';
import { finish, messageInfoRule, messageSuccessRule } from '../../utility/util';

export function update${versionCode(version)}(options: Options, runNpmInstall = true): Rule {
  return (_tree: Tree, _context: SchematicContext) => {
    return chain([
      messageInfoRule(\`Die LUX-Components werden auf die Version ${version} aktualisiert...\`),
      messageInfoRule(\`Die Datei "package.json" wird angepasst...\`),
      updateDep('@ihk-gfi/lux-components', '${version}', false),${themeLine}
      messageSuccessRule(\`Die LUX-Components wurden auf die Version ${version} aktualisiert.\`),
      finish(runNpmInstall, \`\${chalk.yellowBright('Fertig!')}\`)
    ]);
  };
}
`;
}

/**
 * Test zur Updater-Vorlage. themeVersion ist die Theme-Version vor dem Update; ohne Theme-Release
 * prüft der Test, dass sie unverändert bleibt.
 */
function updaterSpecTs(version, previousVersion, withTheme = true, themeVersion = previousVersion) {
  const fn = `update${versionCode(version)}`;
  const themeExpectations = withTheme
    ? `expect(getDep(appTree, '@ihk-gfi/lux-components-theme').version).not.toEqual('${themeVersion}');
          expect(getDep(appTree, '@ihk-gfi/lux-components-theme').version).toEqual('${version}');`
    : `expect(getDep(appTree, '@ihk-gfi/lux-components-theme').version).toEqual('${themeVersion}');`;
  return `import { callRule, SchematicContext } from '@angular-devkit/schematics';
import { SchematicTestRunner, UnitTestTree } from '@angular-devkit/schematics/testing';
import * as path from 'path';
import { getDep } from '../../utility/dependencies';
import { appOptions, workspaceOptions } from '../../utility/test';
import { Options } from '../../utility/types';
import { UtilConfig } from '../../utility/util';
import { ${fn} } from './index';

describe('${fn}', () => {
  let appTree: UnitTestTree;
  let runner: SchematicTestRunner;
  let context: SchematicContext;

  const testOptions: Options = { project: '', path: '', verbose: false };

  beforeEach(async () => {
    const collectionPath = path.join(__dirname, '../../../collection.json');
    runner = new SchematicTestRunner('schematics', collectionPath);

    const collection = '@schematics/angular';
    appTree = await runner.runExternalSchematic(collection, 'workspace', workspaceOptions);
    appTree = await runner.runExternalSchematic(collection, 'application', appOptions, appTree);

    context = runner.engine.createContext(runner.engine.createSchematic('update-${version}', runner.engine.createCollection(collectionPath)));

    UtilConfig.defaultWaitMS = 0;

    testOptions.project = appOptions.name;
    testOptions.path = workspaceOptions.newProjectRoot + '/' + appOptions.name;
    testOptions.verbose = true;
  });

  describe('[Rule] ${fn}', () => {
    it('Sollte die Abhängigkeiten aktualisieren', (done) => {
      appTree.overwrite(
        '/package.json',
        \`
            {
              "name": "Lorem ipsum",
              "version": "0.0.32",
              "scripts": {
                "build": "tsc -p tsconfig.json",
                "test": "npm run build && jasmine src/**/*_spec.js"
              },
              "dependencies": {
                "@angular/animations": "^21.0.0",
                "@angular/cdk": "^21.0.0",
                "@angular/common": "^21.0.0",
                "@ihk-gfi/lux-components": "${previousVersion}",
                "@ihk-gfi/lux-components-theme": "${themeVersion}",
                "@angular/compiler": "^21.0.0",
                "@ihk-gfi/lux-components-icons-and-fonts": "1.11.0"
              },
              "devDependencies": {
                "@angular-devkit/build-angular": "^21.0.0",
                "@angular-eslint/builder": "^21.0.0",
                "@angular/cli": "^21.0.0",
              }
            }
        \`
      );

      callRule(${fn}(testOptions), appTree, context).subscribe(
        () => {
          expect(getDep(appTree, '@ihk-gfi/lux-components').version).not.toEqual('${previousVersion}');
          expect(getDep(appTree, '@ihk-gfi/lux-components').version).toEqual('${version}');

          ${themeExpectations}

          done();
        },
        (reason) => expect(reason).toBeUndefined()
      );
    });
  });
});
`;
}

function updaterSchemaJson(version) {
  return `{
  "$schema": "http://json-schema.org/schema",
  "$id": "luxupdate${versionCode(version)}Schema",
  "title": "Aktualisiert das LUX-Componentsprojekt",
  "type": "object",
  "description": "Aktualisiert das LUX-Componentsprojekt",
  "properties": {
    "project": {
      "type": "string",
      "description": "Der Projektname",
      "$default": {
        "$source": "projectName"
      }
    },
    "verbose": {
      "type": "boolean",
      "description": "Generiert mehr Logausgaben",
      "default": false
    }
  },
  "required": [],
  "additionalProperties": false
}
`;
}

/** Fügt "update-<version>" vor dem bisher neuesten "update-x.y.z"-Eintrag in die collection.json ein (falls noch nicht vorhanden). */
function insertCollectionEntry(content, version) {
  if (content.includes(`"update-${version}"`)) {
    return content;
  }
  const index = content.search(/^ {4}"update-\d+\.\d+\.\d+": \{/m);
  if (index < 0) {
    throw new Error('In der collection.json wurde kein Eintrag "update-x.y.z" gefunden.');
  }
  const entry = `    "update-${version}": {
      "description": "Aktualisiert das LUX-Componentsprojekt auf die Version ${version}",
      "factory": "./src/updates/${version}/index#update${versionCode(version)}",
      "schema": "./src/updates/${version}/schema.json"
    },
`;
  return content.slice(0, index) + entry + content.slice(index);
}

// ---------------------------------------------------------------------------
// Workflows (.github/workflows)
// ---------------------------------------------------------------------------

/**
 * Pfadfilter des push-Triggers eines Workflows. Gelesen wird nur, was die Workflows hier verwenden: "on: push",
 * "on: [push, ...]" und die Block-Form "on:" > "push:" > "paths:" > "- '...'" (ohne YAML-Bibliothek).
 * Ergebnis: [] = push ohne Filter, sonst die Muster; undefined = kein push-Trigger oder Filter, die hier nicht
 * ausgewertet werden (z.B. branches), dann lässt sich nicht vorhersagen, ob der Workflow läuft.
 */
function pushPaths(workflow) {
  const lines = workflow
    .replace(/\r\n/g, '\n')
    .split('\n')
    .map((line) => line.replace(/(^|\s)#.*$/, '').trimEnd())
    .filter((line) => line.trim() !== '');
  const indent = (i) => (i < 0 ? -1 : lines[i].length - lines[i].trimStart().length);
  // Direkte Unterschlüssel einer Zeile (-1 = oberste Ebene): Name -> Zeile und Wert hinter dem Doppelpunkt.
  const children = (parent) => {
    const keys = new Map();
    let childIndent;
    for (let i = parent + 1; i < lines.length && indent(i) > indent(parent); i++) {
      childIndent ??= indent(i);
      const match = indent(i) === childIndent && /^\s*["']?([\w-]+)["']?:(?:\s+(.*))?$/.exec(lines[i]);
      if (match) {
        keys.set(match[1], { line: i, value: match[2] ?? '' });
      }
    }
    return keys;
  };

  const on = children(-1).get('on');
  if (!on) {
    return undefined;
  }
  if (on.value) {
    const events = on.value.replace(/^\[|\]$/g, '').split(',');
    return events.some((event) => event.trim() === 'push') ? [] : undefined;
  }
  const push = children(on.line).get('push');
  if (!push || push.value) {
    return undefined;
  }
  const filters = children(push.line);
  if ([...filters.keys()].some((key) => key !== 'paths')) {
    return undefined;
  }
  const paths = filters.get('paths');
  if (!paths) {
    return [];
  }
  if (paths.value) {
    // Inline-Liste "paths: [...]"
    return undefined;
  }
  // Die Listeneinträge dürfen in YAML auch genauso weit eingerückt sein wie "paths:".
  const isItem = (i) => indent(i) > indent(paths.line) || (indent(i) === indent(paths.line) && /^\s*- /.test(lines[i]));
  const patterns = [];
  for (let i = paths.line + 1; i < lines.length && isItem(i); i++) {
    const item = /^\s*- (.*)$/.exec(lines[i]);
    if (!item) {
      return undefined;
    }
    patterns.push(item[1].replace(/^(['"])(.*)\1$/, '$2'));
  }
  // "paths:" ohne Einträge
  return patterns.length > 0 ? patterns : undefined;
}

/**
 * Muster wie in den Pfadfiltern von GitHub Actions: "**" passt auf beliebige Pfade, "*" auf alles außer "/".
 * "?", "+" und "[...]" wirken wie bei GitHub auf das vorangehende Zeichen bzw. als Zeichenklasse.
 */
function globToRegExp(glob) {
  let pattern = '';
  for (let i = 0; i < glob.length; i++) {
    if (glob.startsWith('**/', i)) {
      pattern += '(?:.*/)?';
      i += 2;
    } else if (glob.startsWith('**', i)) {
      pattern += '.*';
      i += 1;
    } else if (glob[i] === '*') {
      pattern += '[^/]*';
    } else {
      pattern += glob[i].replace(/[.^${}()|\\]/g, '\\$&');
    }
  }
  return new RegExp(`^${pattern}$`);
}

/**
 * true, wenn ein Push mit diesen geänderten Dateien den Workflow auslöst. Die Muster gelten der Reihe nach,
 * ein "!muster" nimmt passende Dateien wieder aus (wie bei GitHub).
 */
function triggeredByPush(workflow, changedFiles) {
  const patterns = pushPaths(workflow);
  if (patterns === undefined) {
    return false;
  }
  if (patterns.length === 0) {
    return true;
  }
  return changedFiles.some((file) => {
    let matched = false;
    for (const pattern of patterns) {
      const negated = pattern.startsWith('!');
      if (globToRegExp(negated ? pattern.slice(1) : pattern).test(file)) {
        matched = !negated;
      }
    }
    return matched;
  });
}

module.exports = {
  parseVersion,
  compareVersions,
  releaseLine,
  updateGuidePath,
  versionCode,
  collectIssueEntries,
  unwrapReverts,
  hasTodo,
  changelogSection,
  mergeChangelogSection,
  hasChangelogSection,
  slugify,
  rebuildToc,
  extractReleaseNotes,
  wikiSection,
  insertWikiSection,
  hasWikiSection,
  updaterIndexTs,
  updaterSpecTs,
  updaterSchemaJson,
  insertCollectionEntry,
  pushPaths,
  globToRegExp,
  triggeredByPush
};
