# Update Guide 19

In diesem Update Guide wird beschrieben, wie man die LUX-Components aktualisieren kann. Es handelt sich um inkrementelle Updates. D.h. alle Updates müssen in der korrekten Reihenfolge (Beispiel: 19.0.0 -> 19.0.1 -> 19.1.0 -> 19.1.1 ->...) ausgeführt werden und es darf kein Update übersprungen werden, da jedes Update neben der Versionsaktualisierung in der `package.json` auch potenziell weitere wichtige Änderungen enthalten kann, die sonst fehlen würden.

- [Update Guide 19](#update-guide-19)
  - [Änderungen](#änderungen)
    - [Technische Änderungen](#technische-änderungen)
    - [Optische Änderungen](#optische-änderungen)
  - [Versionen](#versionen)
    - [Version 19.0.0](#version-1900)
      - [Allgemein](#allgemein)
      - [Vor dem Update](#vor-dem-update)
      - [Update](#update)
      - [Nach dem Update](#nach-dem-update)
      - [Troubleshooting](#troubleshooting)
      - [Ergänzung für JAST-Projekte](#ergänzung-für-jast-projekte)
      - [Weiterführende Verweise bei Interesse oder Problemen](#weiterführende-verweise-bei-interesse-oder-problemen)
      - [Erklärung](#erklärung)

## Änderungen

### Technische Änderungen

- ToDo

### Optische Änderungen

- ToDo

## Versionen

In diesem Abschnitt wird beschrieben, wie man die LUX-Components aktualisieren kann. Alle Updates sind inkrementelle Updates. D.h. alle Updates müssen in der korrekten Reihenfolge ausgeführt werden und **_es darf kein Update übersprungen werden_**, da jedes Update, neben der Versionsaktualisierung in der `package.json`, auch potenziell weitere wichtige Änderungen enthalten kann, die sonst fehlen würden.

### Version 19.0.0

#### Allgemein

Bitte zuerst die vollständige Anleitung lesen und danach mit dem Update beginnen. Das Update sollte auf einem separaten Branch durchgeführt werden und nicht direkt auf dem Develop-Branch.

#### Vor dem Update

1. **Den Abschnitt [Änderungen](#änderungen) lesen!**
1. LUX-Components auf die letzte Version `18.x.x` (siehe [Version 18.x.x](update-guide-v18)) aktualisieren.
1. Node auf 18, 20 oder 22 (empfohlen) aktualisieren (siehe auch [Ergänzung für JAST-Projekte](#ergänzung-für-jast-projekte)).<br>

#### Update

1. `npm install -g @angular/cli@19`

2. Die Datei _package-lock.json_ löschen.

3. Die Abhängigkeit _ngx-cookie-service_ in der _package.json_ auf die Version _19.0.0_ setzen, aber **ohne** ein `npm install` auszuführen.

4. Angular auf 19 aktualisieren:

   `ng update @angular/core@19 @angular/cli@19 --allow-dirty --force`

   _angular.json_: ngx-build-plus -> @angular-devkit/build-angular:

   `ng update @angular/cdk@19 @angular/material@19 @angular-eslint/schematics@19 --allow-dirty --force`

5. LUX-Components-Updater aktualisieren:

   `npm install @ihk-gfi/lux-components-update@19 --save-dev --force`

6. Updater ausführen:

   `ng g @ihk-gfi/lux-components-update:update-19.0.0`

7. Die Datei _package-lock.json_ und den Ordner _node_modules_ löschen.

8. Abhängigkeiten aktualisieren:

   `npm install`

9. (Optional): Die deutschen Übersetzungen der LUX-Components im Projekt aktualisieren:

   `npm run xi18n`

10. (Optional): Die englischen Übersetzungen der LUX-Components im Projekt aktualisieren:

   `ng g @ihk-gfi/lux-components-update:update-en-messages`

11. Fertig!

#### Nach dem Update

- Falls es eigene Abhängigkeiten im Projekt gibt, die nicht über den LUX-Components-Updater aktualisiert wurden, sollten diese jetzt ebenfalls aktualisiert werden.
- Einen Smoketest (build, lint und test) ausführen:

  `npm run smoketest`

- Anwendung vollständig testen.
- Fertig!

#### Troubleshooting

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

#### Weiterführende Verweise bei Interesse oder Problemen

- [Angular Update Guide von v18 nach v19](https://angular.dev/update-guide?v=18.0-19.0&l=3)
- [Angular application build system](https://angular.dev/tools/cli/build-system-migration)

#### Erklärung

Die Angular-Updater installieren immer die aktuellsten Versionen. D.h. wenn eine neue Angular-Version erscheint und der LUX-Components-Updater noch nicht angepasst wurde, dann kommt es dazu, dass der LUX-Components-Updater eine ältere Version installieren möchte. Das scheitert an der `package-lock.json`, weil dort die neueren Versionen bereits festgelegt sind. Aus diesem Grund wird hier die Option `--force` angegeben.
