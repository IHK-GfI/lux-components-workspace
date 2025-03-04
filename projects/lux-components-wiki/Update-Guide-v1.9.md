# Update Guide 1.9

Im Update Guide wird beschrieben, wie man die LUX-Components auf eine neue Version aktualisieren kann.
Es handelt sich um inkrementelle Updates. D.h. alle Updates müssen in der korrekten Reihenfolge
ausgeführt werden.

## Update durchführen

1. Updater aktualisieren

   ```bash
   npm install @ihk-gfi/lux-components-update@0 --save-dev
   ```

1. Update auf die nächste Version durchführen.

   ```bash
   ng generate @ihk-gfi/lux-components-update:lux-version-x.y.z
   ```

1. Manuelle Schritte aus dem Update Guide ausführen!!!

## Versionen

- [Version 1.9.5](#version-195)
- [Version 1.9.4](#version-194)
- [Version 1.9.3](#version-193)
- [Version 1.9.2](#version-192)
- [Version 1.9.1](#version-191)
- [Version 1.9.0](#version-190)

### Version 1.9.5

#### Allgemein

- [Changelog 1.9.5](https://github.com/IHK-GfI/lux-components/releases/tag/1.9.5)

#### Automatische Schritte

- Aktualisierung aller LUX-Components- und Angular9-Abhängigkeiten.

#### Manuelle Schritte

- Keine

### Version 1.9.4

#### Allgemein

- [Changelog 1.9.4](https://github.com/IHK-GfI/lux-components/releases/tag/1.9.4)

#### Automatische Schritte

- Aktualisierung der package.json.

#### Manuelle Schritte

- Keine

### Version 1.9.3

#### Allgemein

- [Changelog 1.9.3](https://github.com/IHK-GfI/lux-components/releases/tag/1.9.3)

#### Automatische Schritte

- Aktualisierung der package.json.
- Aktualisierung des Themes.
- Einrichtung der Locale "de-DE" in der app.module.ts.

#### Manuelle Schritte

- Keine

### Version 1.9.2

#### Allgemein

- [Changelog 1.9.2](https://github.com/IHK-GfI/lux-components/releases/tag/1.9.2)

#### Automatische Schritte

- Aktualisierung der package.json.

#### Manuelle Schritte

- Keine

### Version 1.9.1

#### Allgemein

- [Changelog 1.9.1](https://github.com/IHK-GfI/lux-components/releases/tag/1.9.1)

#### Automatische Schritte

- Aktualisierung der package.json.

#### Manuelle Schritte

- Keine

### Version 1.9.0

#### Allgemein

- [Changelog 1.9.0](https://github.com/IHK-GfI/lux-components/releases/tag/1.9.0)
- Es empfiehlt sich einmal den vollständigen Abschnitt "Version 1.9.0" zu lesen, bevor man mit dem Update beginnt.
- @Input(), @Output etc innerhalb von Basisklassen werden nur noch erkannt, wenn die Basisklasse mit @Directive()
  oder @Component() annotiert ist.
- Die Hintergrundfarbe des Themes wurde angepasst.

#### Manuelle Schritte vor dem LUX-Components-Update

- Node.js auf 10.16.3 oder höher aktualisieren. Bitte eine LTS-Version verwenden.
- LUX-Components auf die letzte Version 1.8.x aktualisieren.
- Prüfen, ob die korrekte Abhängigkeit zone.js (0.9.1) in der package.json eingetragen ist.
  - Wenn nicht, bitte eintragen, `npm install` ausführen und die Änderungen commiten.
- Prüfen, ob die korrekte Abhängigkeit tslib "1.10.0" in der package.json eingetragen ist.
  - Wenn nicht, bitte eintragen, `npm install` ausführen und die Änderungen commiten.
- Prüfen, ob die Abhängigkeit @angular/http vorhanden ist.
  - Wenn ja muss die Abhängigkeit ersatzlos gelöscht werden. Sie ist jetzt ein Teil des @angular/common-Pakets.
    Die Importe werden automatisch durch die folgenden Update-Befehle auf @angular/common/http geändert.
- Angular auf die letzte Version 8.x.x aktualisieren.
  - `ng update @angular/core@8 @angular/cli@8`
- Angular auf die Version 9.x.x aktualisieren.
  - `ng update @angular/core@9 @angular/cli@9`
- LUX-Components auf die Version 1.9.0 aktualisieren.
  - `npm install @ihk-gfi/lux-components-update@0 --save-dev`
  - `ng generate @ihk-gfi/lux-components-update:lux-version-1.9.0`
- Jetzt manuell die Schritte aus dem Abschnitt "Manuelle Schritte nach dem LUX-Components-Update" ausführen.
- Einen Smoketest (build-aot, lint und test) ausführen.
  - `npm run smoketest`
- Fertig!

#### Automatische Schritte

- Aktualisierung der package.json.
- Anpassung der Imports von "@angular/http" nach "@angular/common/http".
- Aktivierung von Ivy.
- Deaktivierung der Lint-Regel "directive-class-suffix" (siehe Abschnitt Allgemein).

#### Manuelle Schritte nach dem LUX-Components-Update

- Die individuellen Dependencies sollten ebenfalls aktualisiert werden.

#### Ergänzung nur für JAST-Projekte

- In den Jenkins-Dateien die neue Node.js-Version eintragen.

#### Weiterführende Verweise bei Interesse oder Problemen

- [Angular Update Guide](https://update.angular.io/#8.0:9.0l3)
- [Updating to Angular version 9](https://angular.io/guide/updating-to-version-9)
- [New Breaking Changes](https://angular.io/guide/updating-to-version-9#new-breaking-changes)
- [Ivy compatibility guide](https://angular.io/guide/ivy-compatibility)
