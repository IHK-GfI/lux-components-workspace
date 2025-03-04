# Update Guide 18

In diesem Update Guide wird beschrieben, wie man die LUX-Components aktualisieren kann. Es handelt sich um inkrementelle Updates. D.h. alle Updates müssen in der korrekten Reihenfolge (Beispiel: 18.0.0 -> 18.0.1 -> 18.1.0 -> 18.1.1 ->...) ausgeführt werden und es darf kein Update übersprungen werden, da jedes Update neben der Versionsaktualisierung in der `package.json` auch potenziell weitere wichtige Änderungen enthalten kann, die sonst fehlen würden.

- [Update Guide 18](#update-guide-18)
  - [Änderungen](#änderungen)
    - [Technische Änderungen](#technische-änderungen)
    - [Optische Änderungen](#optische-änderungen)
  - [Versionen](#versionen)
    - [Version 18.4.0](#version-1840)
    - [Version 18.3.0](#version-1830)
    - [Version 18.2.0](#version-1820)
    - [Version 18.1.0](#version-1810)
    - [Version 18.0.0](#version-1800)
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

- **Autocomplete**: Die Property _luxOptionMultiline_ wurde entfernt und ist jetzt der Standard. (Vereinheitlichung)
- **Tabs**: Die Property _luxTabAnimationActive_ entfernt. (Vereinheitlichung)
- **Chips**:
  - Die Property _luxMultiple_ wurde entfernt.
  - Die Property _luxSelected_ wurde entfernt.
  - Die Property _luxChipSelected_ wurde entfernt.
- **Slider**:
  - Die Property _luxShowThumbLabelAlways_ wurde entfernt. (Barrierefreiheit)
  - Die Property _luxVertical_ wurde entfernt. (Barrierefreiheit)
  - Die Property _luxInvert_ wurde entfernt. (Barrierefreiheit)
  - Die Property _luxTickInterval_ wurde entfernt. (Barrierefreiheit)
  - Die Property _luxInput_ und das Event _luxChange_ wurden von _MatSliderChange_ auf _number_ umgestellt.
- **Form-Control-Ids**: Die Ids werden nicht länger von 0 hochgezählt, stattdessen werden eindeutige UUIDs (z.B. _id="lux-form-control-262e9992-17a2-44cf-9fa0-ba239e3df36c"_) generiert. Damit wird verhindert, dass Auto-Fill-Vorschläge des Browsers zu falschen Feldern angezeigt werden. Die Ids können über die Property _luxId_ individuell gesetzt werden.
- **Abhängigkeiten**:
  In der aktuellen Version der _package.json_ werden keine festen Versionsnummern für Angular-Pakete mehr verwendet. Stattdessen werden nun die sogenannten Caret (^) und Tilde (~) Versionen eingesetzt. Diese ermöglichen eine flexiblere Verwaltung der Abhängigkeiten, indem sie automatische Updates innerhalb bestimmter Versionsbereiche erlauben. Die Caret-Version (^) aktualisiert automatisch auf die neueste Minor- und Patch-Version, während die Tilde-Version (~) nur auf die neueste Patch-Version innerhalb der spezifizierten Minor-Version aktualisiert. Dies hilft, die Kompatibilität und Stabilität der Anwendung zu gewährleisten, während gleichzeitig kleinere Updates und Bugfixes automatisch integriert werden.

  Vorteile und Nachteile der Verwendung von Caret (^) und Tilde (~) Versionen
  
  Vorteile:
  
  - Flexibilität: Automatische Updates innerhalb bestimmter Versionsbereiche ermöglichen es, kleinere Updates und Bugfixes ohne manuelle Anpassungen zu integrieren.
  - Kompatibilität: Durch die automatische Aktualisierung auf kompatible Versionen wird die Wahrscheinlichkeit von Konflikten und Inkompatibilitäten reduziert.
  - Sicherheit: Sicherheitsupdates können schneller und einfacher integriert werden, da sie oft als Patch-Versionen veröffentlicht werden.

  Nachteile:

  - Unvorhersehbare Änderungen: Automatische Updates können unerwartete Änderungen oder neue Bugs einführen, die die Anwendung beeinträchtigen könnten.
  - Testaufwand: Regelmäßige Tests sind notwendig, um sicherzustellen, dass die Anwendung nach einem Update weiterhin korrekt funktioniert.
  - Abhängigkeiten: Abhängigkeiten von Drittanbieter-Bibliotheken können ebenfalls automatisch aktualisiert werden, was zu unerwarteten Problemen führen kann.
  
  Zusammenhang mit der package-lock.json
  Die package-lock.json Datei spielt eine wichtige Rolle bei der Verwaltung von Abhängigkeiten in einem NPM-Projekt. Sie speichert die exakten Versionen aller installierten Pakete, einschließlich ihrer Abhängigkeiten. Dies gewährleistet, dass die gleiche Version der Abhängigkeiten bei jeder Installation verwendet wird, was zu einer konsistenten und reproduzierbaren Umgebung führt.

  Wenn in der package.json Datei Caret (^) und Tilde (~) Versionen verwendet werden, sorgt die package-lock.json Datei dafür, dass trotz der flexiblen Versionsangaben die tatsächlich installierten Versionen festgehalten werden. Dadurch wird sichergestellt, dass alle Entwickler im Team und auch die Produktionsumgebung exakt die gleichen Paketversionen verwenden, was die Stabilität und Vorhersagbarkeit der Anwendung erhöht.

### Optische Änderungen

Änderungen in diesem Abschnitt können nachfolgende Änderungen einer Benutzerdokumentation (z.B. Screenshots) beim Kunden bedingen. Hier ist vor der Umstellung der App ggf. eine frühzeitige Information der Kunden zwingend erforderlich!

- **allgemein**: Bei jedem Hauptrelease kann es bei den Components zu Verschiebungen, Größenänderungen, Abstandsänderungen,... kommen.
- **lux-toggle**: Die Toggles wurden vollständig umgestaltet.

## Versionen

In diesem Abschnitt wird beschrieben, wie man die LUX-Components aktualisieren kann. Alle Updates sind inkrementelle Updates. D.h. alle Updates müssen in der korrekten Reihenfolge ausgeführt werden und **_es darf kein Update übersprungen werden_**, da jedes Update, neben der Versionsaktualisierung in der `package.json`, auch potenziell weitere wichtige Änderungen enthalten kann, die sonst fehlen würden.

### Version 18.4.0

In diesem Abschnitt wird beschrieben, wie man die LUX-Components aktualisieren kann. Alle Updates sind inkrementelle Updates. D.h. alle Updates müssen in der korrekten Reihenfolge ausgeführt werden und **es darf kein Update übersprungen werden**, da jedes Update, neben der Versionsaktualisierung in der `package.json`, auch potenziell weitere wichtige Änderungen enthalten kann, die sonst fehlen würden.

- LUX-Components-Updater aktualisieren:
  - `npm update @ihk-gfi/lux-components-update`
- LUX-Components-Updater ausführen:
  - `ng generate @ihk-gfi/lux-components-update:update-18.4.0`
- Wenn Probleme beim Ausführen von `npm install` mit den Abhängigkeiten (z.B. `ng-build-plus`, `@angular-devkit/build-angular`,...) auftreten sollten, bitte einmal den `node_modules`-Ordner und die `package-lock.json`-Datei löschen und noch einmal `npm install` ausführen.
- Hinweis: Im [lux-Stepper-Large](lux‐stepper‐large-v18) gibt es die neue Property "luxA11YMode" um die Barrierefreiheit zu verbessern. Dies ist Standardmäßig aktiviert. Wenn das verhalten des Steppers sich nicht ändern soll, kann die Property auf False gesetzt werden.
- Fertig!

### Version 18.3.0

In diesem Abschnitt wird beschrieben, wie man die LUX-Components aktualisieren kann. Alle Updates sind inkrementelle Updates. D.h. alle Updates müssen in der korrekten Reihenfolge ausgeführt werden und **es darf kein Update übersprungen werden**, da jedes Update, neben der Versionsaktualisierung in der `package.json`, auch potenziell weitere wichtige Änderungen enthalten kann, die sonst fehlen würden.

- LUX-Components-Updater aktualisieren:
  - `npm update @ihk-gfi/lux-components-update`
- LUX-Components-Updater ausführen:
  - `ng generate @ihk-gfi/lux-components-update:update-18.3.0`
- Wenn Probleme beim Ausführen von `npm install` mit den Abhängigkeiten (z.B. `ng-build-plus`, `@angular-devkit/build-angular`,...) auftreten sollten, bitte einmal den `node_modules`-Ordner und die `package-lock.json`-Datei löschen und noch einmal `npm install` ausführen.
- Fertig!

### Version 18.2.0

In diesem Abschnitt wird beschrieben, wie man die LUX-Components aktualisieren kann. Alle Updates sind inkrementelle Updates. D.h. alle Updates müssen in der korrekten Reihenfolge ausgeführt werden und **es darf kein Update übersprungen werden**, da jedes Update, neben der Versionsaktualisierung in der `package.json`, auch potenziell weitere wichtige Änderungen enthalten kann, die sonst fehlen würden.

- LUX-Components-Updater aktualisieren:
  - `npm update @ihk-gfi/lux-components-update`
- LUX-Components-Updater ausführen:
  - `ng generate @ihk-gfi/lux-components-update:update-18.2.0`
- Wenn Probleme beim Ausführen von `npm install` mit den Abhängigkeiten (z.B. `ng-build-plus`, `@angular-devkit/build-angular`,...) auftreten sollten, bitte einmal den `node_modules`-Ordner und die `package-lock.json`-Datei löschen und noch einmal `npm install` ausführen.
- Fertig!

### Version 18.1.0

In diesem Abschnitt wird beschrieben, wie man die LUX-Components aktualisieren kann. Alle Updates sind inkrementelle Updates. D.h. alle Updates müssen in der korrekten Reihenfolge ausgeführt werden und **es darf kein Update übersprungen werden**, da jedes Update, neben der Versionsaktualisierung in der `package.json`, auch potenziell weitere wichtige Änderungen enthalten kann, die sonst fehlen würden.

- LUX-Components-Updater aktualisieren:
  - `npm update @ihk-gfi/lux-components-update`
- LUX-Components-Updater ausführen:
  - `ng generate @ihk-gfi/lux-components-update:update-18.1.0`
- Wenn Probleme beim Ausführen von `npm install` mit den Abhängigkeiten (z.B. `ng-build-plus`, `@angular-devkit/build-angular`,...) auftreten sollten, bitte einmal den `node_modules`-Ordner und die `package-lock.json`-Datei löschen und noch einmal `npm install` ausführen.
- Fertig!

### Version 18.0.0

#### Allgemein

Bitte zuerst die vollständige Anleitung lesen und danach mit dem Update beginnen. Das Update sollte auf einem separaten Branch durchgeführt werden und nicht direkt auf dem Develop-Branch.

#### Vor dem Update

1. **Den Abschnitt [Änderungen](#änderungen) lesen!**
1. LUX-Components auf die letzte Version `16.x.x` (siehe [Version 16.x.x](update-guide-v16)) aktualisieren.
1. Node auf 18, 20 oder 22 aktualisieren (siehe auch [Ergänzung für JAST-Projekte](#ergänzung-für-jast-projekte)).<br>
   Die Empfehlung ist Node 22.

#### Update

1. [MDC-Migration](https://v16.material.angular.io/guide/mdc-migration) durchführen, falls notwendig.
   1. `ng generate @angular/material:mdc-migration`
   1. Im Anschluss nach _// TODO(mdc-migration)_ suchen und die Probleme beheben.
   1. Häufig reicht es, wenn man in den SCSS-Dateien von _.mat_ auf _.mat-mdc_ umstellt. Trotzdem sollten alle Stellen ausreichend getestet werden. Wünschenswerte wäre es, wenn in der App keine Styles überschrieben würden.

1. `npm install -g @angular/cli@18`

1. Die Datei _package-lock.json_ löschen.

1. Angular auf die letzte 16 aktualisieren:

   `ng update @angular/core@16 @angular/cli@16 @angular/cdk@16 @angular/material@16 @angular-eslint/schematics@16 ngx-build-plus@16 --allow-dirty --force`

   _Der obige Befehl führt am Ende automatisiert ein `npm install` aus. Dabei können Abhängigkeitsfehler in die Console geloggt werden. Diese können aber ignoriert werden. Details siehe [Erklärung](#erklärung).

1. Die Abhängigkeit _ngx-cookie-service_ in der _package.json_ auf die Version _17.0.0_ setzen, aber **ohne** ein `npm install` auszuführen.

1. Angular auf 17 aktualisieren:

   `ng update @angular/core@17 --allow-dirty --force`

   `ng update @angular/cli@17 @angular/cdk@17 @angular/material@17 @angular-eslint/schematics@17 ngx-build-plus@17 --allow-dirty --force`

1. Die Datei _package-lock.json_ löschen.

1. Die Abhängigkeit _ngx-cookie-service_ in der _package.json_ auf die Version _18.0.0_ setzen, aber **ohne** ein `npm install` auszuführen.

1. Angular auf 18 aktualisieren:

   `ng update @angular/core@18 --allow-dirty --force`

   `ng update @angular/cli@18 @angular/cdk@18 @angular/material@18 @angular-eslint/schematics@18 ngx-build-plus@18 --allow-dirty --force`

    **Frage**: Select the migrations that you'd like to run (Press space to select, to toggle all, to invert selection, and enter to proceed)
❯◯ use-application-builder Migrate application projects to the new build system. (https://angular.dev/tools/cli/build-system-migration)

   **Antwort**: Leer lassen und mit Enter fortfahren.

1. LUX-Components-Updater aktualisieren:

   `npm install @ihk-gfi/lux-components-update@18 --save-dev --force`

1. Updater ausführen:

   `ng g @ihk-gfi/lux-components-update:update-18.0.0`

1. Die Datei _package-lock.json_ und den Ordner _node_modules_ löschen.

1. Abhängigkeiten aktualisieren:

   `npm install`

1. (Optional): Die deutschen Übersetzungen der LUX-Components im Projekt aktualisieren:

   `npm run xi18n`

1. (Optional): Die englischen Übersetzungen der LUX-Components im Projekt aktualisieren:

   `ng g @ihk-gfi/lux-components-update:update-en-messages`

1. Fertig!

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

- [Angular Update Guide von v16 nach v17](https://angular.dev/update-guide?v=16.0-17.0&l=1)
- [Angular Update Guide von v17 nach v18](https://angular.dev/update-guide?v=17.0-18.0&l=1)

#### Erklärung

Die Angular-Updater installieren immer die aktuellsten Versionen. D.h. wenn eine neue Angular-Version erscheint und der LUX-Components-Updater noch nicht angepasst wurde, dann kommt es dazu, dass der LUX-Components-Updater eine ältere Version installieren möchte. Das scheitert an der `package-lock.json`, weil dort die neueren Versionen bereits festgelegt sind. Aus diesem Grund wird hier die Option `--force` angegeben.
