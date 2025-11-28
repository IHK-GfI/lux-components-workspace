# Theme

- [Theme](#theme)
  - [Installation](#installation)
  - [LUX-Theme](#lux-theme)
    - [Allgemeine Css-Variablen](#allgemeine-css-variablen)
    - [Allgemeine Css-Klassen](#allgemeine-css-klassen)
    - [Beispiel einer Farbpalette](#beispiel-einer-farbpalette)
      - [Css-Variablen](#css-variablen)
      - [Css-Klassen](#css-klassen)
    - [Code-Beispiele](#code-beispiele)
      - [Css-Variable](#css-variable)
      - [Css-Klasse](#css-klasse)
- [Lizenzhinweis - Icons](#lizenzhinweis---icons)
- [Lizenzhinweis - Fonts](#lizenzhinweis---fonts)

## Installation

```bash
npm install @ihk-gfi/lux-components-theme
```

## LUX-Theme

Ein LUX-Theme besteht immer aus den drei Farbpaletten:

- `lux-palette_primary`
- `lux-palette_accent`
- `lux-palette_warn`

Aus den Farbpaletten werden eine Menge von Css-Variablen und Css-Klassen abgeleitet.
Zusätzlich gibt es eine Menge von allgemeinen Css-Variablen und Css-Klassen.
Alles zusammen bildet die Grundlage für das Theming der eigenen Komponenten auf Basis eines LUX-Themes.

### Allgemeine Css-Variablen

- `--lux-theme-app-header-bg`
- `--lux-theme-app-content-bg`
- `--lux-theme-app-footer-bg`
- `--lux-theme-app-data-bg`
- `--lux-theme-dark-primary-text`
- `--lux-theme-dark-secondary-text`
- `--lux-theme-dark-disabled-text`
- `--lux-theme-dark-dividers`
- `--lux-theme-dark-focused`
- `--lux-theme-light-primary-text`
- `--lux-theme-light-secondary-text`
- `--lux-theme-light-disabled-text`
- `--lux-theme-light-dividers`
- `--lux-theme-light-focused`
- `--lux-theme-form-border-color`
- `--lux-theme-form-control-font-size`
- `--lux-theme-form-control-buffer`
- `--lux-theme-button-height`
- `--lux-theme-button-fav-height`
- `--lux-theme-outline-color-bright`
- `--lux-theme-outline-color-dark`
- `--lux-theme-hover-color`
- `--lux-theme-hover-color-for-dark-background`
- `--lux-theme-selected-border-color`
- `--lux-theme-selected-bg-color`
- `--lux-theme-primary-color`
- `--lux-theme-accent-color`
- `--lux-theme-warn-color`
- `--lux-theme-component-bg-red`
- `--lux-theme-component-bg-green`
- `--lux-theme-component-bg-purple`
- `--lux-theme-component-bg-blue`
- `--lux-theme-component-bg-gray`
- `--lux-theme-component-bg-orange`
- `--lux-theme-component-bg-brown`
- `--lux-theme-component-bg-black`
- `--lux-theme-component-bg-white`
- `--lux-theme-component-bg-dark-red`
- `--lux-theme-component-bg-dark-green`
- `--lux-theme-component-bg-dark-purple`
- `--lux-theme-component-bg-dark-blue`
- `--lux-theme-component-bg-dark-gray`
- `--lux-theme-component-bg-dark-orange`
- `--lux-theme-component-bg-dark-brown`
- `--lux-theme-component-bg-dark-white`
- `--lux-theme-component-font-color-black`
- `--lux-theme-component-font-color-white`

### Allgemeine Css-Klassen

- `lux-app-header-bg`
- `lux-app-content-bg`
- `lux-app-footer-bg`
- `lux-app-data-bg`
- `lux-highlight-section`
- `lux-highlight-section-label`
- `lux-color-dark-primary-text`
- `lux-color-dark-secondary-text`
- `lux-color-dark-disabled-text`
- `lux-color-dark-focused`
- `lux-color-light-primary-text`
- `lux-color-light-secondary-text`
- `lux-color-light-disabled-text`
- `lux-color-light-focused`
- `lux-selected-bg`
- `lux-hover-bg`
- `lux-hover-dark-bg`
- `lux-color-dark-divider`
- `lux-color-light-divider`
- `lux-outline-color-light`
- `lux-outline-color-dark`
- `lux-outline-width`
- `lux-outline-style`
- `lux-outline-light`
- `lux-outline-dark`

### Beispiel einer Farbpalette

```
$lux-palette_primary: (
50 : #e7ebf0,
100 : #c6d1dc,
200 : #99aec2,
300 : #708daa,
400 : #527497,
500 : #335c85,
600 : #2e547d,
700 : #274a72,
800 : #204168,
900 : #143055,
A100 : #b5d5e8,
A200 : #4d9dca,
A400 : #0073b3,
A700 : #00569a,
contrast: (
50 : #000000,
100 : #000000,
200 : #000000,
300 : #000000,
400 : #000000,
500 : #ffffff,
600 : #ffffff,
700 : #ffffff,
800 : #ffffff,
900 : #ffffff,
A100 : #000000,
A200 : #000000,
A400 : #000000,
A700 : #000000,
)
);
```

#### Css-Variablen

- `--lux-theme-primary-50`
- `--lux-theme-primary-50-contrast`
- `--lux-theme-primary-100`
- `--lux-theme-primary-100-contrast`
- `--lux-theme-primary-200`
- `--lux-theme-primary-200-contrast`
- `--lux-theme-primary-300`
- `--lux-theme-primary-300-contrast`
- `--lux-theme-primary-400`
- `--lux-theme-primary-400-contrast`
- `--lux-theme-primary-500`
- `--lux-theme-primary-500-contrast`
- `--lux-theme-primary-600`
- `--lux-theme-primary-600-contrast`
- `--lux-theme-primary-700`
- `--lux-theme-primary-700-contrast`
- `--lux-theme-primary-800`
- `--lux-theme-primary-800-contrast`
- `--lux-theme-primary-900`
- `--lux-theme-primary-900-contrast`
- `--lux-theme-primary-a100`
- `--lux-theme-primary-a100-contrast`
- `--lux-theme-primary-a200`
- `--lux-theme-primary-a200-contrast`
- `--lux-theme-primary-a400`
- `--lux-theme-primary-a400-contrast`
- `--lux-theme-primary-a700`
- `--lux-theme-primary-a700-contrast`

#### Css-Klassen

Zu jedem Eintrag (z.B. 50, 100, 200,..., A100, A200,...) der Farbpalette gibt es im LUX-Theme entsprechende Css-Klassen.
Hier im Beispiel werden nur die Css-Klassen des Eintrags 50 aufgeführt. Die Klassen der anderen Einträge
(50, 100, 200,...) sind analog aufgebaut.

- `lux-color-primary-50`
- `lux-color-primary-50-contrast`
- `lux-bg-color-primary-50`
- `lux-bg-color-primary-50-contrast`
- `lux-border-color-primary-50`
- `lux-border-color-primary-50-contrast`
- `lux-outline-color-primary-50`
- `lux-outline-color-primary-50-contrast`
- `lux-text-decoration-primary-color-50`
- `lux-text-decoration-primary-color-50-contrast`
- `lux-column-rule-color-primary-50`
- `lux-column-rule-color-primary-50-contrast`
- `lux-color-accent-50`
- `lux-color-accent-50-contrast`
- `lux-bg-color-accent`
- `lux-bg-color-accent-50-contrast`
- `lux-border-color-accent-50`
- `lux-border-color-accent-50-contrast`
- `lux-outline-color-accent-50`
- `lux-outline-color-accent-50-contrast`
- `lux-text-decoration-accent-color-50`
- `lux-text-decoration-accent-color-50-contrast`
- `lux-column-rule-color-accent-50`
- `lux-column-rule-color-accent-50-contrast`
- `lux-color-warn-50`
- `lux-color-warn-50-contrast`
- `lux-bg-color-warn-50`
- `lux-bg-color-warn-50-contrast`
- `lux-border-color-warn-50`
- `lux-border-color-warn-50-contrast`
- `lux-outline-color-warn-50`
- `lux-outline-color-warn-50-contrast`
- `lux-text-decoration-warn-color-50`
- `lux-text-decoration-warn-color-50-contrast`
- `lux-column-rule-color-warn-50`
- `lux-column-rule-color-warn-50-contrast`

### Code-Beispiele

#### Css-Variable

Bespiel:

Html-Datei:

```
<lux-card class="highlight" luxTitle="Lorem ipsum"></lux-card>
```

Scss-Datei:

```
lux-card.highlight ::ng-deep .mat-mdc-card {
  color: var(--lux-theme-accent-400-contrast);
  background-color: var(--lux-theme-accent-400);
}
```

#### Css-Klasse

Html-Datei:

```html
<div class="lux-color-accent-50 lux-bg-color-accent-30">Lorem ipsum</div>
```

# Lizenzhinweis - Icons

Über das Github-Projekt https://github.com/IHK-GfI/lux-components-icons-and-fonts können statt der bisherigen Material- oder Font Awesome-Icons nun auch die "neuen" Streamline-Icons mit eingebunden werden, welche speziell für die Nutzung mit dem Theme-authentic ausgewählt wurden.
Die Streamline Icons laufen unter der Lizenz CC-BY 4.0 und der Urheber ist „streamlinehq.com“ ("Streamline Icons Core Line free Copyright © by streamlinehq.com“).
Bezugsquelle: „[Free Core Line – Free Icons Set - 1000 customizable PNGs, SVGs, PDFs (streamlinehq.com)](https://www.streamlinehq.com/icons/streamline-mini-line)“.
Die Lizenz „[CC BY 4.0“ ist zu finden unter „[Streamline Free License | Streamline Help center (intercom.help)](https://intercom.help/streamlinehq/en/articles/5354376-streamline-free-license)“.
Die Icons aus dem o.a. Iconset wurden durch die IHK-GfI mbH nicht verändert. Es wurden jedoch eigene Icons im selben Stil erstellt und unserer Sammlung unter gleicher Lizenz hinzugefügt.

# Lizenzhinweis - Fonts

Über das Github-Projekt https://github.com/IHK-GfI/lux-components-icons-and-fonts können statt der bisher vorgeschlagenen Fontfamilien wie z.B. Korb, Roboo, etc.) nun auch die Schriftarten "Source Sans Pro" designed by Paul D. Hunt (Lizensiert unter SIL 1.1 Open Font License) sowie "BloggerSans" created by Sergiy Tkachenko (Lizensiert unter Creative Commons 4.0) verwendet werden, welche speziell für die Nutzung mit dem Theme-authentic ausgewählt wurden.

> **Note:** Bei der Entwicklung einer Applikation auf Basis der LUX-Components sowie unter Nutzung der Schriftart "Source Sans Pro" ist zwingend die Lizenzdatei "SIL Open Font License V1.1.md" in die GUI der Applikation einzubinden. Bei Nutzung der Schriftart "BloggerSans" ist ein Verweis auf die Lizenz unter https://www.fontsquirrel.com/license/blogger-sans erforderlich.
