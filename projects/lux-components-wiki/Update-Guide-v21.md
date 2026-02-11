# Update Guide 21

In diesem Update Guide wird beschrieben, wie man die LUX-Components aktualisieren kann. Es handelt sich um inkrementelle Updates. D.h. alle Updates müssen in der korrekten Reihenfolge (Beispiel: 21.0.0 -> 21.0.1 -> 21.1.0 -> 21.1.1 ->...) ausgeführt werden und es darf kein Update übersprungen werden, da jedes Update neben der Versionsaktualisierung in der `package.json` auch potenziell weitere wichtige Änderungen enthalten kann, die sonst fehlen würden.

- [Update Guide 21](#update-guide-21)
  - [Änderungen](#änderungen)
  - [Versionen](#versionen)
    - [Version 21.0.0](#version-2100)
      - [Allgemein](#allgemein)
      - [Vor dem Update](#vor-dem-update)
      - [Update](#update)
      - [Nach dem Update](#nach-dem-update)
      - [Troubleshooting](#troubleshooting)
      - [Ergänzung für JAST-Projekte](#ergänzung-für-jast-projekte)
      - [Weiterführende Verweise bei Interesse oder Problemen](#weiterführende-verweise-bei-interesse-oder-problemen)
      - [Erklärung](#erklärung)

## Änderungen

**Wichtig!** Bitte alle Änderungen in der [CHANGELOG.md](https://github.com/IHK-GfI/lux-components-workspace/blob/main/projects/lux-components-lib/CHANGELOG.md) durchlesen.

## Versionen

In diesem Abschnitt wird beschrieben, wie man die LUX-Components aktualisieren kann. Alle Updates sind inkrementelle Updates. D.h. alle Updates müssen in der korrekten Reihenfolge ausgeführt werden und **_es darf kein Update übersprungen werden_**, da jedes Update, neben der Versionsaktualisierung in der `package.json`, auch potenziell weitere wichtige Änderungen enthalten kann, die sonst fehlen würden.

### Version 21.0.0

#### Allgemein

Bitte zuerst die vollständige Anleitung lesen und danach mit dem Update beginnen. Das Update sollte auf einem separaten Branch durchgeführt werden und nicht direkt auf dem Develop-Branch.

#### Vor dem Update

1. **Wichtig!** Bitte alle Änderungen in der [CHANGELOG.md](https://github.com/IHK-GfI/lux-components-workspace/blob/main/projects/lux-components-lib/CHANGELOG.md) durchlesen.
1. LUX-Components auf die letzte Version `19.x.x` (siehe [Version 19.x.x](update-guide-v19)) aktualisieren.
1. Node auf 20, 22 oder 24 (empfohlen) aktualisieren (siehe auch [Ergänzung für JAST-Projekte](#ergänzung-für-jast-projekte)).<br>

#### Update

1. `npm install -g @angular/cli@20`

1. Die Datei _package-lock.json_ löschen.

1. Die Abhängigkeit _ngx-cookie-service_ in der _package.json_ auf die Version _20.0.0_ setzen, sowie  _typescript-eslint_ auf _^8.0.0_, aber **ohne** ein `npm install` auszuführen.

1. Angular auf 20 aktualisieren:

   `ng update @angular/core@20 @angular/cli@20 --allow-dirty --force`

   Es wird empfohlen die folgenden Optionen zu aktivieren:

   ```plain
   Select the migrations that you'd like to run
   ◉ [control-flow-migration] Converts the entire application to block control flow syntax.
   ◉ [router-current-navigation] Replaces usages of the deprecated Router.getCurrentNavigation method with the Router.currentNavigation signal.
   ```

   Sollte dies aus Zeitgründen unmöglich sein, kann dies zum späteren Zeitpunkt nachgeholt werden.

   `ng update @angular/cdk@20 @angular/material@20 --allow-dirty --force`

   `ng update angular-eslint@20 --allow-dirty --force`

1. Die Abhängigkeit _ngx-cookie-service_ in der _package.json_ auf die Version _21.0.0_ setzen, aber **ohne** ein `npm install` auszuführen.

1. Angular auf 21 aktualisieren:

   `ng update @angular/core@21 @angular/cli@21 --allow-dirty --force`

   Es wird empfohlen die folgenden Optionen zu aktivieren:

   ```plain
   Select the migrations that you'd like to run
   ❯◉ [use-application-builder] Migrate application projects to the new build system. (https://angular.dev/tools/cli/build-system-migration)

   Select the migrations that you'd like to run
   ❯◉ [router-current-navigation] Replaces usages of the deprecated Router.getCurrentNavigation method with the Router.currentNavigation signal.
   ```

   Sollte dies aus Zeitgründen unmöglich sein, kann dies zum späteren Zeitpunkt nachgeholt werden.

   `ng update @angular/cdk@21 @angular/material@21 --allow-dirty --force`

   `ng update angular-eslint@21 --allow-dirty --force`

1. LUX-Components-Updater aktualisieren:

   `npm install @ihk-gfi/lux-components-update@21 --save-dev --force`

   Die _NPM_-Fehler in der Console können ignoriert werden.

1. Updater ausführen:

   `ng g @ihk-gfi/lux-components-update:update-21.0.0`

1. Die Datei _package-lock.json_ und den Ordner _node_modules_ löschen.

1. Abhängigkeiten aktualisieren:

    `npm install`

1. Migration nach [Transloco](transloco-migrate-v21) abschließen.

1. Fertig!

#### Nach dem Update

- Falls es eigene Abhängigkeiten im Projekt gibt, die nicht über den LUX-Components-Updater aktualisiert wurden, sollten diese jetzt ebenfalls aktualisiert werden.
- Einen Smoketest (build, lint und test) ausführen:

  `npm run smoketest`

- Folgende optionale Schematics können ausgeführt werden:
  - `ng generate @angular/core:standalone-migration` (Umstellung auf die neuen Standalone-Components)
  - `ng generate @angular/core:inject-migration` (Umstellung auf die inject-Funktion, anstatt Konstruktor-Injektion)
  - `ng generate @angular/core:route-lazy-loading` (Umstellung der Route auf Lazy Loading)
  - `ng generate @angular/core:cleanup-unused-imports` (Importe aufräumen)
- Anwendung vollständig testen.
- Fertig!

#### Troubleshooting

- JAST-Projekte: Wenn die Fehlermeldung _java.lang.StackOverflowError_ im zentralen Build erscheint, könnte es daran liegen, dass das Skript _move-de-files.js_ die Dateien aus dem _de_-Ordner nicht in den Root-Ordner kopiert.
- Wenn der Fehler `Can't find stylesheet to import` beim Importieren von SCSS-Dateien aus dem `node_module`-Ordner auftritt, bitte den folgenden Abschnitt in der _angular.json_ unterhalb von `"styles": ["src/styles.scss"],` hinzufügen:

  ```json
  "stylePreprocessorOptions": {
     "includePaths": ["node_modules/"]
   }
  ```

- Falls beim Lint-Aufruf (`npm run lint`) der Fehler `1:1  error  Definition for rule 'jsdoc/newline-after-description' was not found  jsdoc/newline-after-description` auftritt, dann ändert den Wert `jsdoc/newline-after-description` zu `off` in der _.eslintrc.json_.
- Falls noch _entryComponents_ im Projekt vorhanden sind, können diese bedenkenlos gelöscht werden.
- Die Meldung `Could not find Angular Material core theme. Most Material...` in der Browser-Console kann ignoriert werden. Das Theme ist ausgelagert, funktioniert aber tadellos. Nur der Checker erkennt das leider nicht und schreibt diese Warnung in die Browser-Console raus.
- Sollte die Fehlermeldung `Error: PostCSS received undefined instead of CSS string` auftreten, dann gibt es einen leeren Styles-Eintrag (styles: [''] bzw. styles: [""]) in einer Komponente (im @Component-Block einer TypeScript-Datei). Einfach danach suchen und löschen.
- Die Meldung `Type '""' is not assignable to type 'LuxThemePalette'.` kann behoben werden, in dem man `''` durch `undefined` ersetzt. Der Leerstring ist kein gültiger Wert von `LuxThemePalette`.
- JAST-Projekte: Falls der zentrale Build mit der folgenden Fehlermeldung abbricht: `npm error /workspace/source/ui/node_modules/node-gyp-build-optional-packages/node-gyp-build.js`, bitte die Node-Version hochziehen und den Parameter _--no-optional_ entfernen (siehe [Ergänzung für JAST-Projekte](#ergänzung-für-jast-projekte)).

#### Ergänzung für JAST-Projekte

- Falls eine neue Node-Version installiert wurde, muss diese auch in die zentralen Builds eingetragen werden.<br>
  D.h. in der _pipeline.yaml_ muss z.B. von _node:18-alpine_ auf _node:22-alpine_ umgestellt werden.
- Bei der Umstellung auf eine neuere Node-Version sollte der Parameter _--no-optional_ aus der _pipeline.yaml_ entfernt werden.
- Bitte die _CSP_-Abschnitte in den Dateien _application-xxx.yml_ im _UI-Service_ anpassen.

#### Weiterführende Verweise bei Interesse oder Problemen

- [Angular Update Guide von v19 nach v20](https://angular.dev/update-guide?v=19.0-20.0&l=3)
- [Angular Update Guide von v20 nach v21](https://angular.dev/update-guide?v=20.0-21.0&l=3)
- [Angular application build system](https://angular.dev/tools/cli/build-system-migration)

#### Erklärung

Die Angular-Updater installieren immer die aktuellsten Versionen. D.h. wenn eine neue Angular-Version erscheint und der LUX-Components-Updater noch nicht angepasst wurde, dann kommt es dazu, dass der LUX-Components-Updater eine ältere Version installieren möchte. Das scheitert an der `package-lock.json`, weil dort die neueren Versionen bereits festgelegt sind. Aus diesem Grund wird hier die Option `--force` angegeben.
