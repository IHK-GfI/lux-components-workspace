# Theme

- [Theme](#theme)
  - [Installation](#installation)
  - [LUX-Theme](#lux-theme)
    - [Allgemeine CSS-Variablen](#allgemeine-css-variablen)
      - [CSS-Variablen-Beispiele](#css-variablen-beispiele)
    - [Allgemeine CSS-Klassen](#allgemeine-css-klassen)
      - [CSS-Klassen](#css-klassen)
    - [Code-Beispiele](#code-beispiele)
      - [CSS-Variable nutzen](#css-variable-nutzen)
      - [LUX-Card umstylen](#lux-card-umstylen)
      - [LUX-Button (rund) umstylen](#lux-button-rund-umstylen)
      - [LUX-Button (stroked) umstylen](#lux-button-stroked-umstylen)
      - [CSS-Klasse](#css-klasse)
  - [Lizenztext - Icons](#lizenztext---icons)
  - [Lizenztext - Fonts](#lizenztext---fonts)

Dieses Projekt enthält alle Themes der [LUX-Components](https://www.npmjs.com/package/@ihk-gfi/lux-components).

> **Hinweis:** Seit Version 20 basiert das Theme auf [Material Theme 3 (MDC)](https://m3.material.io/) und verwendet Design Tokens für eine moderne, flexible und konsistente Gestaltung. Die Farbpaletten und Variablen wurden überarbeitet. Migrationstipps siehe unten.

## Installation

```bash
npm install @ihk-gfi/lux-components-theme
```

## LUX-Theme

Ein LUX-Theme besteht immer aus unterschiedlichen Farbpaletten:

- `lux-palette_primary`
- `lux-palette_accent`
- `lux-palette_warn`
- `lux-palette_neutral`

Aus den Farbpaletten werden zahlreiche CSS-Variablen und CSS-Klassen abgeleitet.
Zusätzlich gibt es viele allgemeine CSS-Variablen und CSS-Klassen.
Alles zusammen bildet die Grundlage für das Theming eigener Komponenten auf Basis eines LUX-Themes.

### Allgemeine CSS-Variablen

Die verfügbaren CSS-Variablen stehen im jeweiligen Theme:

- `projects\lux-components-theme\src\${themeName}\_variables.scss`
- `projects\lux-components-theme\src\${themeName}\_variablesPreferContrast.scss`

#### CSS-Variablen-Beispiele

- --lux-theme-app-font-family (Schriftart)
- --lux-theme-custom-red (Hintergrundfarbe)
- --lux-theme-custom-on-red (Textfarbe)
- --lux-theme-accordion-header-color-neutral (Hintergrundfarbe)
- --lux-theme-accordion-header-color-on-neutral (Textfarbe)
- ...

### Allgemeine CSS-Klassen

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

#### CSS-Klassen

Zu jedem Eintrag (z.B. 0, 10, 20,...) der Farbpalette gibt es im LUX-Theme entsprechende CSS-Klassen.
Hier im Beispiel werden nur die CSS-Klassen des Eintrags 20 aufgeführt. Die Klassen der anderen Einträge
(0, 10, 20,...) sind analog aufgebaut.

- `lux-color-primary-20`
- `lux-bg-color-primary-20`
- `lux-border-color-primary-20`
- `lux-outline-color-primary-20`
- `lux-text-decoration-primary-color-20`
- `lux-column-rule-color-primary-20`
- `lux-color-accent-20`
- `lux-bg-color-accent`
- `lux-border-color-accent-20`
- `lux-outline-color-accent-20`
- `lux-text-decoration-accent-color-20`
- `lux-column-rule-color-accent-20`
- `lux-color-warn-20`
- `lux-bg-color-warn-20`
- `lux-border-color-warn-20`
- `lux-outline-color-warn-20`
- `lux-text-decoration-warn-color-20`
- `lux-column-rule-color-warn-20`
- ...

### Code-Beispiele

#### CSS-Variable nutzen

Beispiel:

HTML-Datei:

```html
<span class="highlight">Lorem ipsum</span>
```

SCSS-Datei:

```scss
span.highlight {
  background-color: var(--lux-theme-selected-bg-color);
}
```

#### LUX-Card umstylen

Beispiel:

HTML-Datei:

```html
<lux-card class="highlight" luxTitle="Lorem ipsum"></lux-card>
```

SCSS-Datei:

```scss
lux-card.highlight {
  --lux-theme-card-background-color: rgb(207, 211, 212);
  --lux-theme-card-padding: 4px;
  --lux-theme-card-shape: 16px;
  --lux-theme-card-title-text-size: 1rem;
  --lux-theme-card-title-text-weight: normal;
  --lux-theme-card-subtitle-text-size: 1rem;
  --lux-theme-card-subtitle-text-weight: normal;
  --lux-theme-card-subtitle-text-color: red;
}
```

#### LUX-Button (rund) umstylen

Beispiel:

HTML-Datei:

```html
<lux-button class="my-button" luxIconName="lux-save" [luxRounded]="true" [luxStroked]="true" luxLabel="Lorem ipsum"></lux-button>
```

SCSS-Datei:

```scss
lux-button.my-button {
  --lux-theme-button-rounded-stroked-container-height: 2rem;
  --lux-theme-button-rounded-stroked-text-size: 1rem;
}
```

#### LUX-Button (stroked) umstylen

Beispiel:

HTML-Datei:

```html
<lux-button class="my-button" luxLabel="Lorem ipsum" [luxStroked]="true" luxLabel="Lorem ipsum"></lux-button>
```

SCSS-Datei:

```scss
lux-button.my-button {
  --lux-theme-button-stroked-text-size: 1rem;
  --lux-theme-button-stroked-text-weight: normal;
  --lux-theme-button-stroked-container-height: 1.5rem;
  --lux-theme-button-stroked-container-shape: 4px;
}
```

#### CSS-Klasse

HTML-Datei:

```html
<div class="lux-color-accent-50 lux-bg-color-accent-30">Lorem ipsum</div>
```

## Lizenztext - Icons

In dieser Anwendung werden Streamline-Icons über das Github-Projekt "lux-components-icons-and-fonts" (https://github.com/IHK-GfI/lux-components-icons-and-fonts) der IHK-GfI mbH eingebunden. Die verwendeten Icons laufen unter der Lizenz CC-BY 4.0 (https://creativecommons.org/licenses/by/4.0/) und der Urheber ist „streamlinehq.com“ ("Streamline Icons Core Line free Copyright © by streamlinehq.com“).
Bezugsquelle: „[Core Line - Free – Free Icons Set - 1000 customizable PNGs, SVGs, PDFs (streamlinehq.com)](https://www.streamlinehq.com/icons/core-line-free)".
Die Lizensierungsinformationen „[CC BY 4.0“ sind zu finden unter „[Streamline Free License | Streamline Help center (intercom.help)](https://intercom.help/streamlinehq/en/articles/5354376-streamline-free-license)“.
Die Icons aus dem o.a. Iconset wurden durch die IHK-GfI mbH nicht verändert. Es wurden jedoch eigene Icons im selben Stil erstellt und unserer Sammlung unter gleicher Lizenz hinzugefügt.

## Lizenztext - Fonts

Diese Anwendung verwendet die Schriftarten "Source Sans Pro" designed by Paul D. Hunt (Lizensiert unter SIL 1.1 Open Font License / https://github.com/IHK-GfI/lux-components-icons-and-fonts/blob/master/assets/fonts/Source%20Sans%20Pro/SIL%20Open%20Font%20License%20V1.1.md) sowie "BloggerSans" (Lizenz: https://www.fontsquirrel.com/license/blogger-sans) created by Sergiy Tkachenko (Lizensiert unter Creative Commons 4.0 / https://creativecommons.org/licenses/by/4.0/).

> **Note:** Bei der Entwicklung einer Applikation auf Basis der LUX-Components sowie unter Nutzung der Schriftart "Source Sans Pro" ist zwingend die Lizenzdatei "SIL Open Font License V1.1.md" in die GUI der Applikation einzubinden. Bei Nutzung der Schriftart "BloggerSans" ist ein Verweis auf die Lizenz unter https://www.fontsquirrel.com/license/blogger-sans erforderlich.
