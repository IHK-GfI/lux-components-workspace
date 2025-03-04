# Update Guide 10

In diesem Update Guide wird beschrieben, wie man die LUX-Components auf eine neue Version aktualisieren kann.

## Versionen

- [Update Guide 10](#update-guide-10)
  - [Versionen](#versionen)
    - [Version 10.8.2](#version-1082)
    - [Version 10.8.1](#version-1081)
    - [Version 10.8.0](#version-1080)
    - [Version 10.7.0](#version-1070)
    - [Version 10.6.0](#version-1060)
    - [Version 10.5.0](#version-1050)
    - [Version 10.4.0](#version-1040)
    - [Version 10.3.0](#version-1030)
    - [Version 10.2.0](#version-1020)
    - [Version 10.1.0](#version-1010)
    - [Version 10.0.0](#version-1000)
      - [Allgemein](#allgemein)
      - [Vor dem Update](#vor-dem-update)
      - [Update](#update)
      - [Nach dem Update](#nach-dem-update)
      - [Ergänzung für JAST-Projekte](#ergänzung-für-jast-projekte)
      - [Weiterführende Verweise bei Interesse oder Problemen](#weiterführende-verweise-bei-interesse-oder-problemen)

### Version 10.8.2

- LUX-Components aktualisieren.
  - `npm install @ihk-gfi/lux-components@10.8.2 --save --save-exact`

### Version 10.8.1

- LUX-Components aktualisieren.
  - `npm install @ihk-gfi/lux-components@10.8.1 --save --save-exact`

### Version 10.8.0

- LUX-Components aktualisieren.
  - `npm install @ihk-gfi/lux-components@10.8.0 --save --save-exact`

### Version 10.7.0

- LUX-Components aktualisieren.
  - `npm install @ihk-gfi/lux-components@10.7.0 --save --save-exact`

### Version 10.6.0

- In der Datei `package.json` die Abhängigkeit `@ihk-gfi/lux-components` auf `10.6.0` setzen.
- In der Datei `package.json` prüfen, ob die optionale Abhängigkeit `dompurify` vorhanden ist.
  - Wenn nein, ist nichts zu tun.
  - Wenn ja, bitte die Version auf `2.0.17` setzen.
  - Details gibt es [hier](https://github.com/advisories/GHSA-63q7-h895-m982).
- LUX-Components aktualisieren.
  - `npm install`

### Version 10.5.0

- LUX-Components aktualisieren.
  - `npm install @ihk-gfi/lux-components@10.5.0 --save --save-exact`

### Version 10.4.0

Wichtige Anmerkung:
Dieses Update enthält ein überarbeitetes Theme in Bezug auf die UX und Barrierefreiheit.

Änderungen:

- Das fokussierte Element wird über einen sichtbaren Rahmen (Outline) hervorgehoben.
- Elemente, die blau hervorgehoben sind, sollten klickbar sein. Z.B. ist das Datepickericon jetzt blau.
- Texte (inklusive Überschriften) werden grundsätzlich in normaler dunkler Schriftfarbe dargestellt und nicht länger in Blau.
- Layoutelemente (z.B. LUX-Card) zeichnen ihren Titel als Überschrift aus.
- Die Themefarben (z.B. Badge, Chips, Snackbar, Icon,...) wurden angepasst, um einen höheren Kontrast (Barrierefreiheit) zu erreichen.
- In der neuen Datei "luxcommon.scss" sind Konstanten für die Verwendung in den eigenen SCSS-Dateien enthalten.
- Bitte NICHT das ganze Theme (z.B. @import '../../../../theming/luxtheme) in die eigenen SCSS-Dateien importieren!

Neue Theme-Konstante verwenden:

```scss
@import "../../../../theming/luxcommon";

my-item-class {
  color: $dark-primary-text;
}
```

Farbe aus der Theme-Palette verwenden:

```scss
@import "../../../../theming/luxcommon";

my-item-class {
  color: map-get($lux-palette_darkblue, 500);
}
```

- LUX-Components aktualisieren.
  - `npm install @ihk-gfi/lux-components@10.4.0 --save --save-exact`
  - `npm install @ihk-gfi/lux-components-update@10.2.0 --save`
  - `ng generate @ihk-gfi/lux-components-update:update-theme`

### Version 10.3.0

- LUX-Components aktualisieren.
  - `npm install @ihk-gfi/lux-components@10.3.0 --save --save-exact`

### Version 10.2.0

- LUX-Components aktualisieren.
  - `npm install @ihk-gfi/lux-components@10.2.0 --save --save-exact`

### Version 10.1.0

- LUX-Components aktualisieren.
  - `npm install @ihk-gfi/lux-components@10.1.0 --save --save-exact`

### Version 10.0.0

#### Allgemein

- [Changelog 10.0.0](https://github.com/IHK-GfI/lux-components/releases/tag/10.0.0)
- Bitten zuerst die vollständige Anleitung lesen und erst danach mit dem Update beginnen.

#### Vor dem Update

- Node.js auf 12.x.x oder höher aktualisieren. Bitte ausschließlich LTS-Version verwenden.
- LUX-Components auf die letzte Version 1.9.x aktualisieren.
- Angular auf die letzte Version 9.x.x aktualisieren.
  - `ng update @angular/core@9 @angular/cli@9`
- Angular auf die Version 10.x.x aktualisieren.
  - `ng update @angular/core@10 @angular/cli@10`
- LUX-Components-Updater aktualisieren.
  - `npm install @ihk-gfi/lux-components-update@10 --save-dev`

#### Update

- LUX-Components aktualisieren.
  - `ng generate @ihk-gfi/lux-components-update:update`
    - Der Updater...
      - ...richtet die LUX-Components 10.x.x im Projekt ein.
      - ...passt die Polyfills im Projekt an, wenn nötig.
      - ...aktualisiert die Locale-Einstellung im Projekt, wenn nötig.
      - ...aktualisiert alle Abhängigkeiten.
      - ...aktualisiert das LUX-Theme.

#### Nach dem Update

- Falls es weitere Abhängigkeiten im Projekt gibt, sollten diese ebenfalls aktualisiert werden.
- Einen Smoketest (build-aot, lint und test) ausführen.
  - `npm run smoketest`
- Fertig!

#### Ergänzung für JAST-Projekte

- In den Jenkins-Dateien die neue Node.js-Version eintragen.

#### Weiterführende Verweise bei Interesse oder Problemen

- [Angular Update Guide](https://update.angular.io/?l=3&v=9.1-10.0)
- [Updating to Angular version 10](https://angular.io/guide/updating-to-version-10)
- [Ivy compatibility guide](https://angular.io/guide/ivy-compatibility)
