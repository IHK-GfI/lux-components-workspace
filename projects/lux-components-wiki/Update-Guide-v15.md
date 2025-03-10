# Update Guide 15

In diesem Update Guide wird beschrieben, wie man die LUX-Components aktualisieren kann. Es handelt sich um inkrementelle Updates. D.h. alle Updates müssen in der korrekten Reihenfolge (Beispiel: 15.0.0 -> 15.0.1 -> 15.1.0 -> 15.1.1 ->...) ausgeführt werden und es darf kein Update übersprungen werden, da jedes Update neben der Versionsaktualisierung in der `package.json` auch potenziell weitere wichtige Änderungen enthalten kann, die sonst fehlen würden.

- [Update Guide 15](#update-guide-15)
  - [Wichtig](#wichtig)
    - [Das Theme `blue` wurde durch das Theme `authentic` ersetzt](#das-theme-blue-wurde-durch-das-theme-authentic-ersetzt)
    - [Font-Awesome- und Material-Icons werden durch LUX-Icons ersetzt](#font-awesome--und-material-icons-werden-durch-lux-icons-ersetzt)
  - [Versionen](#versionen)
    - [Version 15.5.1](#version-1551)
    - [Version 15.5.0](#version-1550)
    - [Version 15.4.0](#version-1540)
    - [Version 15.3.0](#version-1530)
    - [Version 15.2.0](#version-1520)
    - [Version 15.1.0](#version-1510)
    - [Version 15.0.0](#version-1500)
      - [Allgemein](#allgemein)
      - [Schnittstellenbrechende Änderungen](#schnittstellenbrechende-änderungen)
      - [Vor dem Update](#vor-dem-update)
      - [Update](#update)
      - [Nach dem Update](#nach-dem-update)
      - [Troubleshooting](#troubleshooting)
      - [Ergänzung für JAST-Projekte](#ergänzung-für-jast-projekte)
      - [Weiterführende Verweise bei Interesse oder Problemen](#weiterführende-verweise-bei-interesse-oder-problemen)
      - [Erklärung](#erklärung)

## Wichtig

### Das Theme `blue` wurde durch das Theme `authentic` ersetzt

Aktuell gibt es die folgenden Themes:

- `green`
- `authentic`

Ab dieser Version wird das `blue`-Theme durch das `authentic`-Theme ersetzt. D.h. im Rahmen dieser Version muss die eigene Anwendung auf das neue `authentic`-Theme umgestellt werden, es sei denn, die eigene Anwendung nutzt das `green`-Theme. Das `green`-Theme bleibt bestehen.

Für den Umstieg ist das Schematic `change-theme-to-authentic` erstellt worden. Das Schematic kann wie folgt ausgeführt werden:

```bash
ng g @ihk-gfi/lux-components-update:change-theme-to-authentic
```

Bitte den Umstieg auf einem eigenen Branch ausführen. Die Anwendung muss vollständig getestet werden. Im neuen Theme bekommen einige Komponenten den neuen Namenszusatz `ac` (z.B. `lux-input` wird zu `lux-input-ac`). Die Umbenennung wird von dem oben erwähnten Schematic ausgeführt. Achtung, sollten individuelle Styles existieren, welche die LUX-Components anderes stylen sollten (nicht empfohlen), dann müssen diese entsprechend manuell angepasst werden.

### Font-Awesome- und Material-Icons werden durch LUX-Icons ersetzt

Ab dieser Version werden nur noch die LUX-Icons unterstützt. Die LUX-Icons basieren auf den frei verfügbaren [Streamline Icons](https://www.streamlinehq.com/icons/streamline-mini-line). Zusätzlich wurden individuelle Icons erstellt, die das Iconset erweitern.

Für den Umstieg ist das Schematic `change-to-lux-icons` erstellt worden. Dieses Schematic wird automatisch ausgeführt, wenn man auf das neue `authentic`-Theme wechselt. Dieses Schematic kann von den Anwendungen verwendet werden, die auf dem `green`-Theme basieren.

Das Schematic kann wie folgt ausgeführt werden:

```bash
ng g @ihk-gfi/lux-components-update:change-to-lux-icons
```

Das Schematic enthält eine Liste mit FA- und Material-Icons und mappt diese automatisch auf die neuen LUX-Icons. Das Schematic sollte die meisten Icons automatisch ersetzen, erhebt aber keinen Anspruch auf Vollständigkeit. Die verbleiben Icons müssen manuell ersetzt werden. Die neue [Icon-Suche](https://lux-demo-dev.gfi.ihk.de/components-overview/example/icon-overview) in der LUX-Components-Demo könnte dabei eine Hilfe sein.

Bitte den Umstieg auf einem eigenen Branch ausführen. Die Anwendung muss vollständig getestet werden. Bei den neuen Icons handelt es sich um SVG-Icons und nicht länger um Font-Icons. D.h. in den SCSS-Styles müssen die individuellen Font-Size-Angaben durch Width-Angaben angepasst werden.

Durch die Verwendung der Streamline-Icons muss jede darauf basierende Anwendung einen entsprechenden Lizenzhinweis einbauen (siehe README.md).
In der Demo ist der Lizenzhinweis im Footer untergebracht. Aber jede Anwendung ist selbst zuständig und kann den Ort individuell festlegen, solange er den Regeln (siehe README.md) genügt.

## Versionen

In diesem Abschnitt wird beschrieben, wie man die LUX-Components aktualisieren kann. Alle Updates sind inkrementelle Updates. D.h. alle Updates müssen in der korrekten Reihenfolge ausgeführt werden und **_es darf kein Update übersprungen werden_**, da jedes Update, neben der Versionsaktualisierung in der `package.json`, auch potenziell weitere wichtige Änderungen enthalten kann, die sonst fehlen würden.

- [Version 15.5.1](#version-1551)
- [Version 15.5.0](#version-1550)
- [Version 15.4.0](#version-1540)
- [Version 15.3.0](#version-1530)
- [Version 15.2.0](#version-1520)
- [Version 15.1.0](#version-1510)
- [Version 15.0.0](#version-1500)

### Version 15.5.1

In diesem Abschnitt wird beschrieben, wie man die LUX-Components aktualisieren kann. Alle Updates sind inkrementelle Updates. D.h. alle Updates müssen in der korrekten Reihenfolge ausgeführt werden und **es darf kein Update übersprungen werden**, da jedes Update, neben der Versionsaktualisierung in der `package.json`, auch potenziell weitere wichtige Änderungen enthalten kann, die sonst fehlen würden.

- LUX-Components-Updater aktualisieren:
  - `npm update @ihk-gfi/lux-components-update`
- LUX-Components-Updater ausführen:
  - `ng generate @ihk-gfi/lux-components-update:update-15.5.1`
- Wenn Probleme beim Ausführen von `npm install` mit den Abhängigkeiten (z.B. `ng-build-plus`, `@angular-devkit/build-angular`,...) auftreten sollten, bitte einmal den `node_modules`-Ordner und die `package-lock.json`-Datei löschen und noch einmal `npm install` ausführen.
- Fertig!

### Version 15.5.0

In diesem Abschnitt wird beschrieben, wie man die LUX-Components aktualisieren kann. Alle Updates sind inkrementelle Updates. D.h. alle Updates müssen in der korrekten Reihenfolge ausgeführt werden und **es darf kein Update übersprungen werden**, da jedes Update, neben der Versionsaktualisierung in der `package.json`, auch potenziell weitere wichtige Änderungen enthalten kann, die sonst fehlen würden.

- LUX-Components-Updater aktualisieren:
  - `npm update @ihk-gfi/lux-components-update`
- LUX-Components-Updater ausführen:
  - `ng generate @ihk-gfi/lux-components-update:update-15.5.0`
- Wenn Probleme beim Ausführen von `npm install` mit den Abhängigkeiten (z.B. `ng-build-plus`, `@angular-devkit/build-angular`,...) auftreten sollten, bitte einmal den `node_modules`-Ordner und die `package-lock.json`-Datei löschen und noch einmal `npm install` ausführen.
- Fertig!

### Version 15.4.0

In diesem Abschnitt wird beschrieben, wie man die LUX-Components aktualisieren kann. Alle Updates sind inkrementelle Updates. D.h. alle Updates müssen in der korrekten Reihenfolge ausgeführt werden und **es darf kein Update übersprungen werden**, da jedes Update, neben der Versionsaktualisierung in der `package.json`, auch potenziell weitere wichtige Änderungen enthalten kann, die sonst fehlen würden.

- LUX-Components-Updater aktualisieren:
  - `npm update @ihk-gfi/lux-components-update`
- LUX-Components-Updater ausführen:
  - `ng generate @ihk-gfi/lux-components-update:update-15.4.0`
- Wenn Probleme beim Ausführen von `npm install` mit den Abhängigkeiten (z.B. `ng-build-plus`, `@angular-devkit/build-angular`,...) auftreten sollten, bitte einmal den `node_modules`-Ordner und die `package-lock.json`-Datei löschen und noch einmal `npm install` ausführen.
- Fertig!

### Version 15.3.0

In diesem Abschnitt wird beschrieben, wie man die LUX-Components aktualisieren kann. Alle Updates sind inkrementelle Updates. D.h. alle Updates müssen in der korrekten Reihenfolge ausgeführt werden und **es darf kein Update übersprungen werden**, da jedes Update, neben der Versionsaktualisierung in der `package.json`, auch potenziell weitere wichtige Änderungen enthalten kann, die sonst fehlen würden.

- LUX-Components-Updater aktualisieren:
  - `npm update @ihk-gfi/lux-components-update`
- LUX-Components-Updater ausführen:
  - `ng generate @ihk-gfi/lux-components-update:update-15.3.0`
- Wenn Probleme beim Ausführen von `npm install` mit den Abhängigkeiten (z.B. `ng-build-plus`, `@angular-devkit/build-angular`,...) auftreten sollten, bitte einmal den `node_modules`-Ordner und die `package-lock.json`-Datei löschen und noch einmal `npm install` ausführen.
- Fertig!

### Version 15.2.0

In diesem Abschnitt wird beschrieben, wie man die LUX-Components aktualisieren kann. Alle Updates sind inkrementelle Updates. D.h. alle Updates müssen in der korrekten Reihenfolge ausgeführt werden und **es darf kein Update übersprungen werden**, da jedes Update, neben der Versionsaktualisierung in der `package.json`, auch potenziell weitere wichtige Änderungen enthalten kann, die sonst fehlen würden.

- LUX-Components-Updater aktualisieren:
  - `npm update @ihk-gfi/lux-components-update`
- LUX-Components-Updater ausführen:
  - `ng generate @ihk-gfi/lux-components-update:update-15.2.0`
- Wenn Probleme beim Ausführen von `npm install` mit den Abhängigkeiten (z.B. `ng-build-plus`, `@angular-devkit/build-angular`,...) auftreten sollten, bitte einmal den `node_modules`-Ordner und die `package-lock.json`-Datei löschen und noch einmal `npm install` ausführen.
- Fertig!

### Version 15.1.0

In diesem Abschnitt wird beschrieben, wie man die LUX-Components aktualisieren kann. Alle Updates sind inkrementelle Updates. D.h. alle Updates müssen in der korrekten Reihenfolge ausgeführt werden und **es darf kein Update übersprungen werden**, da jedes Update, neben der Versionsaktualisierung in der `package.json`, auch potenziell weitere wichtige Änderungen enthalten kann, die sonst fehlen würden.

- LUX-Components-Updater aktualisieren:
  - `npm update @ihk-gfi/lux-components-update`
- LUX-Components-Updater ausführen:
  - `ng generate @ihk-gfi/lux-components-update:update-15.1.0`
- Wenn Probleme beim Ausführen von `npm install` mit den Abhängigkeiten (z.B. `ng-build-plus`, `@angular-devkit/build-angular`,...) auftreten sollten, bitte einmal den `node_modules`-Ordner und die `package-lock.json`-Datei löschen und noch einmal `npm install` ausführen.
- Fertig!

### Version 15.0.0

#### Allgemein

Bitte zuerst die vollständige Anleitung lesen und danach mit dem Update beginnen. Das Update sollte auf einem separaten Branch durchgeführt werden und nicht direkt auf dem Develop-Branch.

#### Schnittstellenbrechende Änderungen

- [Das Theme `blue` wurde durch das Theme `authentic` ersetzt](#das-theme-blue-wurde-durch-das-theme-authentic-ersetzt)
- [Font-Awesome- und Material-Icons werden durch LUX-Icons ersetzt](#font-awesome--und-material-icons-werden-durch-lux-icons-ersetzt)

#### Vor dem Update

1. **Den Abschnitt [Wichtig](#wichtig) lesen!**
   1. Vor dem Update muss vom `blue`-Theme auf das `authentic`-Theme gewechselt werden!
   2. Vor dem Update muss von den FA- und Material-Icons auf die LUX-Icons gewechselt werden!
2. LUX-Components auf die letzte Version `14.x.x` (siehe [Version 14.x.x](update-guide-14)) aktualisieren.
3. Node.js auf 14.x.x, 16.x.x oder 18.x.x (siehe [Angular-Doku](https://v15.angular.io/guide/versions#actively-supported-versions) - bitte ausschließlich LTS-Versionen verwenden) aktualisieren und ab sofort verwenden.

#### Update

1. Die Datei _package-lock.json_ löschen.

2. Angular auf die letzte 14 aktualisieren:

   `ng update @angular/core@14 @angular/cli@14 @angular/cdk@14 @angular/material@14 @angular-eslint/schematics@14 ngx-build-plus@14 --allow-dirty --force`

   _Der obige Befehl führt am Ende automatisiert ein `npm install` aus. Dabei können Abhängigkeitsfehler in die Console geloggt werden. Diese können aber ignoriert werden. Details siehe [Erklärung](#erklärung). Dies gilt bis Schritt 7. Ab Schritt 7 dürfen keine Abhängigkeitsfehler mehr auftreten._

3. Angular auf 15 aktualisieren:

   `ng update @angular/core@15 --allow-dirty --force`

   `ng update @angular/cli@15 @angular/cdk@15 @angular/material@15 @angular-eslint/schematics@15 ngx-build-plus@15 --allow-dirty --force`

4. LUX-Components-Updater aktualisieren:

   `npm install @ihk-gfi/lux-components-update@15 --save-dev --force`

5. Updater ausführen:

   `ng g @ihk-gfi/lux-components-update:update`

6. Die Datei _package-lock.json_ und den Ordner _node_modules_ löschen.

7. Abhängigkeiten aktualisieren:

   `npm install`

8. (Optional): Die deutschen Übersetzungen der LUX-Components im Projekt aktualisieren:

   `npm run xi18n`

9. (Optional): Die englischen Übersetzungen der LUX-Components im Projekt aktualisieren:

   `ng g @ihk-gfi/lux-components-update:update-en-messages`

10. Fertig!

#### Nach dem Update

- Falls es eigene Abhängigkeiten im Projekt gibt, die nicht über den LUX-Components-Updater aktualisiert wurden, sollten diese jetzt ebenfalls aktualisiert werden.
- Einen Smoketest (build, lint und test) ausführen:

  `npm run smoketest`

- Anwendung vollständig testen.
- Fertig!

#### Troubleshooting

- Authentic-Theme: Das `lux-side-nav-header-ac`-Tag kann ersatzlos aus der `app.component.html` gelöscht werden, falls es vom Updater übersehen wurde.
- Der `LuxMasterDetailMobileHelperService` kann gelöscht werden, falls dieser vom Updater übersehen wurde.
- Die Meldung `Error: Could not find HttpClient provider for use with Angular Material icons. Please include the HttpClientModule from @angular/common/http in your app imports.` kann behoben werden, in dem man entweder `HttpClientModule` oder `HttpClientTestingModule` (für Tests) importiert.
- Die Meldung `Could not find Angular Material core theme. Most Material...` in der Browser-Console kann ignoriert werden. Das Theme ist ausgelagert, funktioniert aber tadellos. Nur der Checker erkennt das leider nicht und schreibt diese Warnung in die Browser-Console raus.
- Sollte die Fehlermeldung `Error: PostCSS received undefined instead of CSS string` auftreten, dann gibt es einen leeren Styles-Eintrag (styles: [''] bzw. styles: [""]) in einer Komponente (im @Component-Block einer TypeScript-Datei). Einfach danach suchen und löschen.
- Die Meldung `Type '""' is not assignable to type 'LuxThemePalette'.` kann behoben werden, in dem man `''` durch `undefined` ersetzt. Der Leerstring ist kein gültiger Wert von `LuxThemePalette`.
- Authentic-Theme: Der Updater ersetzt ausschließlich die statischen Icons in den HTML-Templates. Sollten im Projekt dynamisch gebundene Icons verwendet werden, müssen diese manuell ersetzt werden. Der Updater loggt Warnungen in die Console, wenn Icons nicht ersetzt werden konnten. Tipp: In der LUX-Componentsdemo gibt es eine neue Iconsuche, die bei der Suche nach einem passenden Icon nützlich seien kann.

#### Ergänzung für JAST-Projekte

- Die neue Node-Version 16.x.x oder 18.x.x muss in die zentralen Jenkins-Builds eingetragen werden.

#### Weiterführende Verweise bei Interesse oder Problemen

- [Angular Update Guide](https://update.angular.io/?l=2&v=14.0-15.0)

#### Erklärung

Die Angular-Updater installieren immer die aktuellsten Versionen. D.h. wenn eine neue Angular-Version erscheint und der LUX-Components-Updater noch nicht angepasst wurde, dann kommt es dazu, dass der LUX-Components-Updater eine ältere Version installieren möchte. Das scheitert an der `package-lock.json`, weil dort die neueren Versionen bereits festgelegt sind. Aus diesem Grund wird hier die Option `--force` angegeben.
