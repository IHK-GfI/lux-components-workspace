// Tests für scripts/release-lib.js.
// Aufruf: npm run test:release-scripts
const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const lib = require('./release-lib');

test('versionCode', () => {
  assert.equal(lib.versionCode('21.9.0'), '210900');
  assert.equal(lib.versionCode('21.10.0'), '211000');
  assert.equal(lib.versionCode('21.3.1'), '210301');
  assert.throws(() => lib.versionCode('21.10'), /Ungültige Version/);
  assert.throws(() => lib.versionCode('v21.10.0'), /Ungültige Version/);
});

test('compareVersions', () => {
  assert.ok(lib.compareVersions('21.10.0', '21.9.0') > 0);
  assert.ok(lib.compareVersions('21.9.1', '21.9.0') > 0);
  assert.ok(lib.compareVersions('22.0.0', '21.99.99') > 0);
  assert.equal(lib.compareVersions('21.9.0', '21.9.0'), 0);
});

test('collectIssueEntries: filtert, entfernt Reverts und sortiert nach Issue-Nummer', () => {
  // Reihenfolge wie "git log v21.9.0..HEAD" (neueste zuerst)
  const subjects = [
    'Build: Sicherheitsupdates eingespielt',
    'Issue #327: Lux-Badge: Farben an die Figma-Vorlage angleichen (#328)',
    'Issue #322: lux-leave-guard inkl. Global Blocking State bereitstellen (#330)',
    'Revert "Issue #329: Kontrastoptimierte Farben und Muted Colors für Progressbar"',
    'Issue #329: Kontrastoptimierte Farben und Muted Colors für Progressbar',
    'Release Theme v21.9.0',
    'Issue #315: lux-menu-item: luxLoading (Spinner) wie bei lux-button (#325)'
  ];

  assert.deepEqual(lib.collectIssueEntries(subjects), [
    'Issue #315: lux-menu-item: luxLoading (Spinner) wie bei lux-button (#325)',
    'Issue #322: lux-leave-guard inkl. Global Blocking State bereitstellen (#330)',
    'Issue #327: Lux-Badge: Farben an die Figma-Vorlage angleichen (#328)'
  ]);
});

test('collectIssueEntries: ein erneut eingespielter Commit nach einem Revert bleibt erhalten', () => {
  const subjects = [
    'Issue #329: Kontrastoptimierte Farben (#331)',
    'Revert "Issue #329: Kontrastoptimierte Farben"',
    'Issue #329: Kontrastoptimierte Farben'
  ];
  assert.deepEqual(lib.collectIssueEntries(subjects), ['Issue #329: Kontrastoptimierte Farben (#331)']);
});

test('collectIssueEntries: Revert eines Reverts spielt den Commit wieder ein, andere Einträge bleiben', () => {
  const subjects = ['Revert "Revert "Issue #5: A""', 'Issue #7: B', 'Revert "Issue #5: A"', 'Issue #5: A', 'Issue #1: ältester Eintrag'];
  assert.deepEqual(lib.collectIssueEntries(subjects), ['Issue #1: ältester Eintrag', 'Issue #5: A', 'Issue #7: B']);
});

test('collectIssueEntries: dreifacher Revert nimmt den Commit wieder zurück', () => {
  const subjects = ['Revert "Revert "Revert "Issue #5: A"""', 'Revert "Revert "Issue #5: A""', 'Revert "Issue #5: A"', 'Issue #5: A'];
  assert.deepEqual(lib.collectIssueEntries(subjects), []);
});

test('collectIssueEntries: squash-gemergte Reverts mit (#N) werden erkannt', () => {
  assert.deepEqual(lib.collectIssueEntries(['Revert "Issue #5: A (#10)" (#11)', 'Issue #5: A (#10)', 'Issue #6: B (#12)']), [
    'Issue #6: B (#12)'
  ]);
  assert.deepEqual(lib.unwrapReverts('Revert "Issue #5: A (#10)" (#11)'), { original: 'Issue #5: A (#10)', reverts: 1 });
  assert.deepEqual(lib.unwrapReverts('Issue #5: Revert "x"'), { original: 'Issue #5: Revert "x"', reverts: 0 });
});

test('collectIssueEntries: Reapply (Git ab 2.43) spielt den Commit wieder ein', () => {
  // So erzeugt "git revert" auf einen Revert die Betreffs (verifiziert mit Git 2.45).
  assert.deepEqual(lib.collectIssueEntries(['Reapply "Issue #5: A"', 'Revert "Issue #5: A"', 'Issue #5: A']), ['Issue #5: A']);
  assert.deepEqual(
    lib.collectIssueEntries(['Revert "Reapply "Issue #5: A""', 'Reapply "Issue #5: A"', 'Revert "Issue #5: A"', 'Issue #5: A']),
    []
  );
  assert.deepEqual(lib.unwrapReverts('Reapply "Issue #5: A" (#12)'), { original: 'Issue #5: A', reverts: 2 });
});

test('collectIssueEntries: Schreibweisen ohne "#" bzw. ":" werden vereinheitlicht', () => {
  const subjects = [
    'Issue 230 neue lux panel komponente (#299)',
    'Issue 7: Sieben',
    'Issue #8:Acht',
    'Issues aufgeräumt',
    'Issue: kein Nummer'
  ];
  assert.deepEqual(lib.collectIssueEntries(subjects), [
    'Issue #7: Sieben',
    'Issue #8: Acht',
    'Issue #230: neue lux panel komponente (#299)'
  ]);
});

test('collectIssueEntries: Revert ohne die PR-Nummer des ursprünglichen Commits wird zugeordnet', () => {
  assert.deepEqual(lib.collectIssueEntries(['Revert "Issue #5: A" (#11)', 'Issue #5: A (#10)', 'Issue #6: B']), ['Issue #6: B']);
  // Beim Wiedereinspielen bleibt der Text des ursprünglichen Commits (mit PR-Nummer) erhalten.
  assert.deepEqual(lib.collectIssueEntries(['Reapply "Issue #5: A"', 'Revert "Issue #5: A"', 'Issue #5: A (#10)']), ['Issue #5: A (#10)']);
});

test('collectIssueEntries: Kleinschreibung und Präfix wie beim commit-msg-Hook', () => {
  const subjects = ['issue #331: Fix X', 'Demo: Issue #12: Beispiel', 'Build: Abhängigkeiten für Issue 12 aktualisiert'];
  assert.deepEqual(lib.collectIssueEntries(subjects), ['Issue #12: Beispiel', 'Issue #331: Fix X']);
});

test('collectIssueEntries: Revert eines Commits vor dem letzten Release ergibt keinen Eintrag', () => {
  assert.deepEqual(lib.collectIssueEntries(['Revert "Issue #2: Alt"', 'Issue #3: Neu']), ['Issue #3: Neu']);
});

const changelog = `# Changelog

- [Changelog](#changelog)
  - [Version 21.9.0](#version-2190)
    - [Issues](#issues)
  - [Version 21.8.0](#version-2180)
    - [Issues](#issues)

## Version 21.9.0

### Issues

- Issue #38: Neue Komponente lux-chat

## Version 21.8.0

### Issues

- Issue #259: lux-select-ac
`;

test('mergeChangelogSection: fügt einen neuen Abschnitt oben ein und nummeriert die Anker durch', () => {
  const result = lib.mergeChangelogSection(changelog, '21.10.0', ['Issue #315: Spinner']);

  assert.equal(
    result,
    `# Changelog

- [Changelog](#changelog)
  - [Version 21.10.0](#version-21100)
    - [Issues](#issues)
  - [Version 21.9.0](#version-2190)
    - [Issues](#issues-1)
  - [Version 21.8.0](#version-2180)
    - [Issues](#issues-2)

## Version 21.10.0

### Issues

- Issue #315: Spinner

## Version 21.9.0

### Issues

- Issue #38: Neue Komponente lux-chat

## Version 21.8.0

### Issues

- Issue #259: lux-select-ac
`
  );
});

test('mergeChangelogSection: ergänzt fehlende Issues, vorhandene Einträge bleiben wörtlich erhalten', () => {
  const first = lib.mergeChangelogSection(changelog, '21.10.0', ['Issue #315: Spinner']);
  const curated = first.replace('- Issue #315: Spinner', '- Issue #315: Ausführlich von Hand beschrieben. Hinweis 1: ...');
  const second = lib.mergeChangelogSection(curated, '21.10.0', ['Issue #315: Spinner', 'Issue #327: Badge', 'Issue #200: Älter']);

  assert.equal(
    second,
    curated.replace(
      '- Issue #315: Ausführlich von Hand beschrieben. Hinweis 1: ...\n',
      '- Issue #200: Älter\n- Issue #315: Ausführlich von Hand beschrieben. Hinweis 1: ...\n- Issue #327: Badge\n'
    )
  );
  assert.equal(lib.mergeChangelogSection(second, '21.10.0', ['Issue #315: Spinner']), second, 'ein zweiter Lauf ändert nichts');
  assert.ok(lib.hasChangelogSection(second, '21.10.0'));
  assert.ok(!lib.hasChangelogSection(second, '21.11.0'));
});

test('mergeChangelogSection: ergänzt auch den letzten Abschnitt der Datei', () => {
  const result = lib.mergeChangelogSection(changelog, '21.8.0', ['Issue #1: Neu', 'Issue #259: anderer Text']);

  assert.ok(result.endsWith('## Version 21.8.0\n\n### Issues\n\n- Issue #1: Neu\n- Issue #259: lux-select-ac\n'));
  assert.ok(result.includes('- Issue #38: Neue Komponente lux-chat\n\n## Version 21.8.0'));
});

test('mergeChangelogSection: TODO entfällt, eingerückte Folgezeilen und andere Unterabschnitte bleiben', () => {
  const content = `# Changelog

- [Changelog](#changelog)

## Version 21.10.0

### Issues

- TODO

## Version 21.9.0

### Issues

- Issue #10: Zehn
  mit eingerückter Folgezeile

### Technische Änderungen

Text
`;
  const todo = lib.mergeChangelogSection(content, '21.10.0', ['Issue #5: Fünf']);
  assert.ok(todo.includes('## Version 21.10.0\n\n### Issues\n\n- Issue #5: Fünf\n\n## Version 21.9.0'));

  const nested = lib.mergeChangelogSection(content, '21.9.0', ['Issue #11: Elf']);
  assert.ok(nested.includes('- Issue #10: Zehn\n  mit eingerückter Folgezeile\n- Issue #11: Elf\n\n### Technische Änderungen\n\nText\n'));
});

test('mergeChangelogSection: mehrere Commits zu einem neuen Issue werden wie in einem neuen Abschnitt alle ergänzt', () => {
  const content = `# Changelog

- [Changelog](#changelog)

## Version 21.10.0

### Issues

- Issue #400: Von Hand gepflegt
`;
  const result = lib.mergeChangelogSection(content, '21.10.0', ['Issue #315: Teil 1', 'Issue #315: Teil 2', 'Issue #400: Commit-Betreff']);
  assert.ok(result.endsWith('### Issues\n\n- Issue #315: Teil 1\n- Issue #315: Teil 2\n- Issue #400: Von Hand gepflegt\n'));
});

test('mergeChangelogSection: ohne Einträge bekommt ein vorhandener Abschnitt ein TODO', () => {
  const content = `# Changelog

- [Changelog](#changelog)

## Version 2.0.0

### Breaking Changes

Text

## Version 1.0.0
`;
  const result = lib.mergeChangelogSection(content, '2.0.0', []);
  assert.equal(lib.extractReleaseNotes(result, '2.0.0'), '### Issues\n\n- TODO\n');
  assert.ok(lib.hasTodo(lib.extractReleaseNotes(result, '2.0.0')));
  assert.equal(lib.mergeChangelogSection(result, '2.0.0', []), result, 'ein zweiter Lauf ändert nichts');
});

test('mergeChangelogSection: fehlt "### Issues", wird es am Ende des Versionsabschnitts angelegt', () => {
  const content = `# Changelog

- [Changelog](#changelog)

## Version 21.10.0

### Breaking Changes

Text

## Version 21.9.0
`;
  const result = lib.mergeChangelogSection(content, '21.10.0', ['Issue #5: Fünf']);
  assert.ok(result.includes('### Breaking Changes\n\nText\n\n### Issues\n\n- Issue #5: Fünf\n\n## Version 21.9.0'));
});

test('changelogSection: ohne Einträge steht ein TODO im Abschnitt', () => {
  assert.equal(lib.changelogSection('21.10.0', []), '## Version 21.10.0\n\n### Issues\n\n- TODO\n');
});

test('slugify', () => {
  assert.equal(lib.slugify('Version 21.10.0'), 'version-21100');
  assert.equal(lib.slugify('Technische Änderungen'), 'technische-änderungen');
  assert.equal(
    lib.slugify('WICHTIG! - Die Einwilligung (Consent) muss ggf. ergänzt werden'),
    'wichtig---die-einwilligung-consent-muss-ggf-ergänzt-werden'
  );
});

test('extractReleaseNotes', () => {
  assert.equal(lib.extractReleaseNotes(changelog, '21.9.0'), '### Issues\n\n- Issue #38: Neue Komponente lux-chat\n');
  assert.equal(lib.extractReleaseNotes(changelog, '21.8.0'), '### Issues\n\n- Issue #259: lux-select-ac\n');
  assert.throws(() => lib.extractReleaseNotes(changelog, '21.10.0'), /fehlt der Abschnitt/);
});

test('extractReleaseNotes: liefert nur den Abschnitt "### Issues"', () => {
  const content = `## Version 19.0.0

### Technische Änderungen

#### Standalone

Text

### Issues

- Issue #1: Eins

### Allgemein

Mehr Text

## Version 18.0.0

### Issues

- Issue #0: Null
`;
  assert.equal(lib.extractReleaseNotes(content, '19.0.0'), '### Issues\n\n- Issue #1: Eins\n');
  assert.throws(() => lib.extractReleaseNotes('## Version 1.0.0\n\nText\n', '1.0.0'), /"### Issues"/);
});

test('hasTodo', () => {
  assert.ok(lib.hasTodo(lib.changelogSection('21.10.0', [])));
  assert.ok(!lib.hasTodo(lib.changelogSection('21.10.0', ['Issue #1: TODO-Liste'])));
});

test('insertWikiSection: Abschnitt und TOC-Eintrag', () => {
  const wiki = `# Update Guide 21

- [Update Guide 21](#update-guide-21)
  - [Versionen](#versionen)
    - [Version 21.9.0](#version-2190)

## Versionen

Intro

### Version 21.9.0

Text
`;
  const result = lib.insertWikiSection(wiki, '21.10.0');

  assert.match(result, /  - \[Versionen\]\(#versionen\)\n {4}- \[Version 21\.10\.0\]\(#version-21100\)\n {4}- \[Version 21\.9\.0\]/);
  assert.match(result, /Intro\n\n### Version 21\.10\.0\n\n[\s\S]*update-21\.10\.0`\n[\s\S]*- Fertig!\n\n### Version 21\.9\.0\n/);
  assert.ok(lib.hasWikiSection(result, '21.10.0'));
  assert.equal(lib.insertWikiSection(result, '21.10.0'), result, 'ein zweiter Lauf ändert nichts');
});

test('insertWikiSection: Leerzeile vor dem ersten TOC-Eintrag', () => {
  const wiki = `# Update Guide 21

- [Versionen](#versionen)

    - [Version 21.9.0](#version-2190)

## Versionen

### Version 21.9.0

Text
`;
  const result = lib.insertWikiSection(wiki, '21.10.0');

  assert.ok(result.includes('\n\n    - [Version 21.10.0](#version-21100)\n    - [Version 21.9.0](#version-2190)\n'));
  assert.equal(lib.insertWikiSection(result, '21.10.0'), result, 'ein zweiter Lauf ändert nichts');
});

test('insertWikiSection: ein vorhandener Abschnitt bleibt unverändert, ein fehlender TOC-Eintrag wird ergänzt', () => {
  const wiki = `# Update Guide 21

- [Update Guide 21](#update-guide-21)
  - [Versionen](#versionen)
    - [Version 21.9.0](#version-2190)

## Versionen

### Version 21.10.0

**Hinweis**: Während der Entwicklung geschrieben.

### Version 21.9.0

Text
`;
  const result = lib.insertWikiSection(wiki, '21.10.0');

  assert.equal(result, wiki.replace('    - [Version 21.9.0]', '    - [Version 21.10.0](#version-21100)\n    - [Version 21.9.0]'));
});

test('insertCollectionEntry', () => {
  const collection = `{
  "schematics": {
    "update-standalone-imports": {
      "factory": "x"
    },
    "update-21.9.0": {
      "factory": "y"
    }
  }
}
`;
  const result = lib.insertCollectionEntry(collection, '21.10.0');

  assert.match(result, /"factory": "x"\n {4}\},\n {4}"update-21\.10\.0": \{\n/);
  assert.match(result, /"factory": "\.\/src\/updates\/21\.10\.0\/index#update211000",/);
  assert.match(result, /"schema": "\.\/src\/updates\/21\.10\.0\/schema\.json"\n {4}\},\n {4}"update-21\.9\.0"/);
  assert.equal(lib.insertCollectionEntry(result, '21.10.0'), result, 'ein vorhandener Eintrag wird übersprungen');
});

test('Updater-Templates', () => {
  assert.match(lib.updaterIndexTs('21.10.0'), /export function update211000\(/);
  assert.match(lib.updaterIndexTs('21.10.0'), /updateDep\('@ihk-gfi\/lux-components-theme', '21\.10\.0', false\)/);
  assert.match(lib.updaterSpecTs('21.10.0', '21.9.0'), /"@ihk-gfi\/lux-components": "21\.9\.0"/);
  assert.match(lib.updaterSpecTs('21.10.0', '21.9.0'), /createSchematic\('update-21\.10\.0'/);
  assert.match(lib.updaterSchemaJson('21.10.0'), /"\$id": "luxupdate211000Schema"/);
});

test('Updater-Templates passen zum Vitest-Updater (chalk als Default-Import, async-Test ohne done)', () => {
  const index = lib.updaterIndexTs('22.1.0');
  const spec = lib.updaterSpecTs('22.1.0', '22.0.0');

  assert.match(index, /^import chalk from 'chalk';$/m);
  assert.match(spec, /^import \{ lastValueFrom \} from 'rxjs';$/m);
  assert.match(spec, /it\('Sollte die Abhängigkeiten aktualisieren', async \(\) => \{/);
  assert.match(spec, /await lastValueFrom\(callRule\(update220100\(testOptions\), appTree, context\)\);/);
  assert.doesNotMatch(spec, /done/);
  assert.match(spec, /"@angular\/common": "\^22\.0\.0"/);
  assert.doesNotMatch(spec, /\^21\.0\.0/);
});

test('Updater-Templates ohne Theme-Release', () => {
  const index = lib.updaterIndexTs('21.10.0', false);
  const spec = lib.updaterSpecTs('21.10.0', '21.9.0', false, '21.8.0');

  assert.match(index, /updateDep\('@ihk-gfi\/lux-components', '21\.10\.0', false\),\n {6}messageSuccessRule/);
  assert.doesNotMatch(index, /lux-components-theme/);
  assert.match(spec, /"@ihk-gfi\/lux-components": "21\.9\.0"/);
  assert.match(spec, /"@ihk-gfi\/lux-components-theme": "21\.8\.0"/);
  assert.match(spec, /expect\(getDep\(appTree, '@ihk-gfi\/lux-components-theme'\)\.version\)\.toEqual\('21\.8\.0'\);/);
  assert.doesNotMatch(spec, /lux-components-theme'\)\.version\)\.(not\.)?toEqual\('21\.10\.0'\)/);
});

test('releaseLine: develop wird über main veröffentlicht, Pflege-Branches v<major>.x direkt', () => {
  assert.deepEqual(lib.releaseLine('develop'), {
    work: 'develop',
    target: 'main',
    npmTag: 'latest',
    latest: true,
    wiki: true,
    major: undefined
  });
  assert.deepEqual(lib.releaseLine('v21.x'), {
    work: 'v21.x',
    target: 'v21.x',
    npmTag: 'v21-lts',
    latest: false,
    wiki: false,
    major: 21
  });
  assert.equal(lib.releaseLine('v22'), undefined, 'Entwicklungs-Branch, kein Release-Branch');
  assert.equal(lib.releaseLine('main'), undefined);
  assert.equal(lib.releaseLine('feature/x'), undefined);
  assert.equal(lib.releaseLine('v21.x-test'), undefined);
});

test('updateGuidePath: Update Guide je Hauptversion', () => {
  assert.equal(lib.updateGuidePath('21.10.0'), 'projects/lux-components-wiki/Update-Guide-v21.md');
  assert.equal(lib.updateGuidePath('22.0.0'), 'projects/lux-components-wiki/Update-Guide-v22.md');
});

test('pushPaths: Formen des push-Triggers', () => {
  const block = `name: x

on:
  push:
    paths:
      - 'projects/lux-components-lib/**' # Kommentar
      - "package.json"
      - scripts/release*.js
  workflow_dispatch:

jobs:
  test:
    runs-on: ubuntu-latest
`;
  assert.deepEqual(lib.pushPaths(block), ['projects/lux-components-lib/**', 'package.json', 'scripts/release*.js']);
  assert.deepEqual(lib.pushPaths(block.replace(/\n/g, '\r\n')), ['projects/lux-components-lib/**', 'package.json', 'scripts/release*.js']);
  assert.deepEqual(lib.pushPaths('on: push\njobs: {}\n'), []);
  assert.deepEqual(lib.pushPaths('on: [push, pull_request]\n'), []);
  assert.deepEqual(lib.pushPaths('on:\n  push:\n  workflow_dispatch:\n'), [], 'push ohne Filter');
  assert.equal(lib.pushPaths('on: workflow_dispatch\n'), undefined);
  assert.equal(lib.pushPaths('on:\n  release:\n    types: [published]\n'), undefined);
  assert.equal(lib.pushPaths('on:\n  push:\n    branches:\n      - main\n'), undefined, 'branches wird nicht ausgewertet');
  assert.equal(lib.pushPaths("on:\n  push:\n    paths: ['a/**']\n"), undefined, 'Inline-Liste wird nicht ausgewertet');
  assert.deepEqual(
    lib.pushPaths("on:\n  push:\n    paths:\n    - 'a/**'\n    - b.json\n  workflow_dispatch:\n"),
    ['a/**', 'b.json'],
    'Listeneinträge so weit eingerückt wie "paths:"'
  );
  assert.equal(lib.pushPaths('on:\n  push:\n    paths:\n  workflow_dispatch:\n'), undefined, '"paths:" ohne Einträge');
});

test('globToRegExp: Muster wie bei GitHub Actions', () => {
  assert.ok(lib.globToRegExp('projects/lux-components-lib/**').test('projects/lux-components-lib/src/a/b.ts'));
  assert.ok(!lib.globToRegExp('projects/lux-components-lib/**').test('projects/lux-components-libx/a.ts'));
  assert.ok(lib.globToRegExp('scripts/release*.js').test('scripts/release-lib.js'));
  assert.ok(!lib.globToRegExp('scripts/release*.js').test('scripts/sub/release.js'), '* passt nicht auf /');
  assert.ok(lib.globToRegExp('package.json').test('package.json'));
  assert.ok(!lib.globToRegExp('package.json').test('packageXjson'), '. ist kein Platzhalter');
  assert.ok(!lib.globToRegExp('package.json').test('projects/demo-app/package.json'));
  assert.ok(lib.globToRegExp('**/package.json').test('package.json'), '**/ passt auch auf die oberste Ebene');
  assert.ok(lib.globToRegExp('**/package.json').test('projects/demo-app/package.json'));
});

test('triggeredByPush: Pfadfilter und Negation', () => {
  const workflow = "on:\n  push:\n    paths:\n      - 'docs/**'\n      - '!docs/**/*.png'\n";
  assert.ok(lib.triggeredByPush(workflow, ['docs/a.md']));
  assert.ok(!lib.triggeredByPush(workflow, ['docs/img/a.png']), 'durch ! ausgenommen');
  assert.ok(lib.triggeredByPush(workflow, ['docs/img/a.png', 'docs/a.md']));
  assert.ok(!lib.triggeredByPush(workflow, ['src/a.ts']));
  assert.ok(lib.triggeredByPush('on: push\n', ['src/a.ts']), 'push ohne Filter');
  assert.ok(!lib.triggeredByPush('on: workflow_dispatch\n', ['src/a.ts']));
});

test('triggeredByPush: die echten Workflows bei einem Release-Commit', () => {
  const dir = path.join(__dirname, '..', '.github', 'workflows');
  const workflows = Object.fromEntries(
    fs
      .readdirSync(dir)
      .filter((file) => /\.ya?ml$/.test(file))
      .map((file) => [file, fs.readFileSync(path.join(dir, file), 'utf8')])
  );
  // Schützt davor, dass eine Formatänderung die Smoketests still aus der Prüfung von release:finish fallen lässt.
  for (const file of Object.keys(workflows).filter((name) => name.startsWith('smoketest-'))) {
    assert.ok(lib.pushPaths(workflows[file])?.length > 0, `${file}: Pfadfilter erwartet`);
  }
  for (const file of Object.keys(workflows).filter((name) => name.startsWith('publish-'))) {
    assert.equal(lib.pushPaths(workflows[file]), undefined, `${file}: kein push-Trigger erwartet`);
  }

  // Release ohne Theme: Versionen, Changelog, Updater, Demo-Footer, Wiki
  const changed = [
    'package.json',
    'package-lock.json',
    'projects/lux-components-lib/package.json',
    'projects/lux-components-lib/CHANGELOG.md',
    'projects/lux-components-update/package.json',
    'projects/lux-components-update/collection.json',
    'projects/lux-components-update/src/updates/21.10.0/index.ts',
    'projects/demo-app/src/app/app.component.html',
    'projects/lux-components-wiki/Update-Guide-v21.md'
  ];
  const expected = Object.keys(workflows).filter((file) => lib.triggeredByPush(workflows[file], changed));
  assert.deepEqual(expected.sort(), [
    'smoketest-components.yml',
    'smoketest-demo.yml',
    'smoketest-release-scripts.yml',
    'smoketest-updater.yml'
  ]);
  assert.ok(lib.triggeredByPush(workflows['smoketest-theme.yml'], [...changed, 'projects/lux-components-theme/package.json']));
});
