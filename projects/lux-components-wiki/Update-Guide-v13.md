# Update Guide 13

In diesem Update Guide wird beschrieben, wie man die LUX-Components aktualisieren kann. Es handelt sich um inkrementelle Updates. D.h. alle Updates müssen in der korrekten Reihenfolge (Beispiel: 13.0.0 -> 13.0.1 -> 13.1.0 -> 13.1.1 ->...) ausgeführt werden und es darf kein Update übersprungen werden, da jedes Update neben der Versionsaktualisierung in der `package.json` auch potenziell weitere wichtige Änderungen enthalten kann, die sonst fehlen würden.

Die Major-Version einer LUX-Componentsversion (Beispiel: >13<.x.x) entspricht der verwendeten Angular-Version. D.h. die LUX-Components 11.x.x basieren auf Angular 11 und die LUX-Components 13.x.x basieren dementsprechend auf Angular 13. Aus Zeitgründen wurde Angular 12 übersprungen und deshalb gibt es auch keine LUX-Components 12.x.x.

- [Update Guide 13](#update-guide-13)
  - [Versionen](#versionen)
    - [Version 13.3.0](#version-1330)
    - [Version 13.2.0](#version-1320)
    - [Version 13.1.0](#version-1310)
    - [Version 13.0.0](#version-1300)
      - [Allgemein](#allgemein)
      - [Schnittstellenbrechende Änderungen](#schnittstellenbrechende-änderungen)
      - [Vor dem Update](#vor-dem-update)
      - [Update](#update)
      - [Nach dem Update](#nach-dem-update)
      - [Troubleshooting](#troubleshooting)
      - [Ergänzung für JAST-Projekte](#ergänzung-für-jast-projekte)
      - [Weiterführende Verweise bei Interesse oder Problemen](#weiterführende-verweise-bei-interesse-oder-problemen)
      - [Erklärung](#erklärung)

## Versionen

- [Version 13.3.0](#version-1330)
- [Version 13.2.0](#version-1320)
- [Version 13.1.0](#version-1310)
- [Version 13.0.0](#version-1300)

### Version 13.3.0

In diesem Abschnitt wird beschrieben, wie man die LUX-Components aktualisieren kann. Alle Updates sind inkrementelle Updates. D.h. alle Updates müssen in der korrekten Reihenfolge ausgeführt werden und **es darf kein Update übersprungen werden**, da jedes Update, neben der Versionsaktualisierung in der `package.json`, auch potenziell weitere wichtige Änderungen enthalten kann, die sonst fehlen würden.

- LUX-Components-Updater aktualisieren:
  - `npm update @ihk-gfi/lux-components-update`
- LUX-Components-Updater ausführen:
  - `ng generate @ihk-gfi/lux-components-update:update-13.3.0`
- Wenn Probleme beim Ausführen von `npm install` mit den Abhängigkeiten (z.B. `ng-build-plus`, `@angular-devkit/build-angular`,...) auftreten sollten, bitte einmal den `node_modules`-Ordner und die `package-lock.json`-Datei löschen und noch einmal `npm install` ausführen.
- Fertig!

### Version 13.2.0

In diesem Abschnitt wird beschrieben, wie man die LUX-Components aktualisieren kann. Alle Updates sind inkrementelle Updates. D.h. alle Updates müssen in der korrekten Reihenfolge ausgeführt werden und **es darf kein Update übersprungen werden**, da jedes Update, neben der Versionsaktualisierung in der `package.json`, auch potenziell weitere wichtige Änderungen enthalten kann, die sonst fehlen würden.

- LUX-Components-Updater aktualisieren:
  - `npm update @ihk-gfi/lux-components-update`
- LUX-Components-Updater ausführen:
  - `ng generate @ihk-gfi/lux-components-update:update-13.2.0`
- Wenn Probleme beim Ausführen von `npm install` mit den Abhängigkeiten (z.B. `ng-build-plus`, `@angular-devkit/build-angular`,...) auftreten sollten, bitte einmal den `node_modules`-Ordner und die `package-lock.json`-Datei löschen und noch einmal `npm install` ausführen.
- Fertig!

### Version 13.1.0

In diesem Abschnitt wird beschrieben, wie man die LUX-Components aktualisieren kann. Alle Updates sind inkrementelle Updates. D.h. alle Updates müssen in der korrekten Reihenfolge ausgeführt werden und **es darf kein Update übersprungen werden**, da jedes Update, neben der Versionsaktualisierung in der `package.json`, auch potenziell weitere wichtige Änderungen enthalten kann, die sonst fehlen würden.

- LUX-Components-Updater aktualisieren:
  - `npm update @ihk-gfi/lux-components-update`
- LUX-Components-Updater ausführen:
  - `ng generate @ihk-gfi/lux-components-update:update-13.1.0`
- Fertig!

### Version 13.0.0

#### Allgemein

Bitte zuerst die vollständige Anleitung lesen und erst danach mit dem Update beginnen.

Das Update sollte auf einem eigenen Branch durchgeführt werden und nicht direkt auf dem Develop-Branch.

#### Schnittstellenbrechende Änderungen

- IE11 wird nicht länger unterstützt.
- `luxSelected` der LUX-Table ist jetzt immer ein `Set<any>` und kein `any[]` mehr, da im Strict-Modus die Typen vom Getter, Setter und Outputevent identisch sein müssen. Ab dieser Version ist es daher einheitlich zum Set geworden. Sollte man weiterhin ein Array nutzen wollen, kann das Outputevent `luxSelectedAsArrayChange` verwendet werden.
- LUX-File-List: Die Property `luxSelectedFilesUseAlwaysArray` wurde entfernt.
- Die Property `luxIconAlignWithLabel` aus den Komponenten `lux-button` und `lux-icon` wurde entfernt.
- In der `tsconfig.json` in den LUX-Components wurde der Wert von `strictTemplates` auf `true`gesetzt. Aus diesem Grund wurden die folgenden Typen eingeführt:
  - LuxActionColorType
  - LuxBadgeColor
  - LuxBadgeSize
  - LuxBadgePosition
  - LuxChipsOrientation
  - LuxDatepickerStartViewType
  - LuxProgressModeType

#### Vor dem Update

1. LUX-Components auf die letzte Version `11.x.x` aktualisieren.
1. Node.js auf 16.x.x (bitte ausschließlich LTS-Versionen verwenden) aktualisieren und ab sofort verwenden.

#### Update

1. Die Datei `package-lock.json` löschen.
1. Angular auf 12 aktualisieren:

   `npx @angular/cli@12 update @angular/core@12 @angular/cli@12 @angular-eslint/schematics@12 @angular/material@12 ngx-build-plus@12 --allow-dirty --force`

   _Der obige Befehl führt am Ende automatisiert ein `npm install` aus. Dabei können Abhängigkeitsfehler in die Console geloggt werden. Diese können aber ignoriert werden. Details siehe [Erklärung](#erklärung). Dies gilt bis Schritt 7. Ab Schritt 7 dürfen keine Abhängigkeitsfehler mehr auftreten._

1. Angular auf 13 aktualisieren:

   `npx @angular/cli@13 update @angular/core@13 @angular/cli@13 @angular-eslint/schematics@13 @angular/material@13 ngx-build-plus@13 --allow-dirty --force`

1. LUX-Components-Updater aktualisieren:

   `npm install @ihk-gfi/lux-components-update@13 --save-dev --force`

1. Updater ausführen:

   `ng g @ihk-gfi/lux-components-update:update`

1. Abhängigkeiten aktualisieren:

   `npm install --force`

1. Noch einmal die Abhängigkeiten ohne die Option `--force` aktualisieren, um auszuschließen, dass echte Probleme dadurch die unterdrückt wurden:

   `npm install`

   Jetzt dürfen keine Abhängigkeitsfehler mehr in der Console geloggt werden!

1. Die deutschen Übersetzungen der LUX-Components im Projekt aktualisieren:

   `npm run xi18n`

1. Die englischen Übersetzungen der LUX-Components im Projekt aktualisieren:

   `ng g @ihk-gfi/lux-components-update:update-en-messages`

1. In den HTML-Templates nach dem Wert `@20c44b9d-45e1-447a-a141-1de0695c9c35@` suchen und diesen ersatzlos löschen.  
   Beispiel:

   ```html
   <lux-input luxLabel="@20c44b9d-45e1-447a-a141-1de0695c9c35@" ...></lux-input>
   ```

   Ersetzen durch:

   ```html
   <lux-input luxLabel="" ...></lux-input>
   ```

   oder

   ```html
   <lux-input ...></lux-input>
   ```

Hierbei handelt es sich um einen Fehler im Updater, der in gewissen Konstellationen auftritt.

1. Fertig!

#### Nach dem Update

- Falls es eigene Abhängigkeiten im Projekt gibt, die nicht über den LUX-Components-Updater aktualisiert werden, sollten diese jetzt ebenfalls aktualisiert werden.
- Einen Smoketest (build, lint und test) ausführen:

  `npm run smoketest`

- Anwendung manuell vollständig testen.
- Fertig!

#### Troubleshooting

- Die Meldung `Could not find Angular Material core theme. Most Material...` in der Browser-Console kann ignoriert werden. Das Theme ist ausgelagert, funktioniert aber tadellos. Nur der Checker erkennt das leider nicht und schreibt diese Warnung in die Browser-Console raus.
- Sollte die Fehlermeldung `Error: PostCSS received undefined instead of CSS string` auftreten, dann gibt es einen leeren Styles-Eintrag (styles: ['']) in einer Komponente (@Component in einer TypeScript-Datei). Einfach danach suchen und löschen.
- Die Klasse `LuxBackgroundColorsEnum` wird nicht gefunden. Die Klasse wurde zugunsten der folgenden [Typen](https://github.com/IHK-GfI/lux-components/blob/13.0.0/src/app/modules/lux-util/lux-colors.enum.ts) aufgegeben.

  Beispiel:

  ```typescript
  color: LuxBackgroundColorsEnum.red;
  ```

  Wird zu:

  ```typescript
  color: "red";
  ```

#### Ergänzung für JAST-Projekte

- Die neue Node-Version 16.x muss in die zentralen Jenkins-Builds eingetragen werden.

#### Weiterführende Verweise bei Interesse oder Problemen

- [Angular Update Guide](https://update.angular.io/?l=2&v=11.0-13.0)

#### Erklärung

Die Angular-Updater installieren immer die aktuellsten Versionen. D.h. wenn eine neue Angular-Version erscheint und der LUX-Components-Updater noch nicht angepasst wurde, dann kommt es dazu, dass der LUX-Components-Updater eine ältere Version installieren möchte. Das scheitert an der `package-lock.json`, weil dort die neueren Versionen bereits festgelegt sind. Aus diesem Grund wird hier die Option `--force` angegeben.
