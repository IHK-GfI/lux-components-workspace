# Theme

- [Theme](#theme)
  - [Installation](#installation)
  - [CSS-Variablen](#css-variablen)
    - [Farbpaletten \& semantische Farben](#farbpaletten--semantische-farben)
    - [Design Tokens: Layout, Typografie \& Spacing](#design-tokens-layout-typografie--spacing)
    - [App-Grundlayout \& Zustände](#app-grundlayout--zustände)
    - [Formulare \& Eingaben](#formulare--eingaben)
    - [Navigation \& Struktur](#navigation--struktur)
    - [Buttons](#buttons)
    - [Container \& Inhalte](#container--inhalte)
    - [Feedback \& Hinweise](#feedback--hinweise)
    - [Sonstiges](#sonstiges)
  - [CSS-Klassen](#css-klassen)
    - [Textfarbe](#textfarbe)
    - [Hintergrundfarbe](#hintergrundfarbe)
    - [Rahmenfarbe](#rahmenfarbe)
    - [Outline-Farbe](#outline-farbe)
    - [Textdekorationsfarbe](#textdekorationsfarbe)
    - [Spaltentrennlinien-Farbe](#spaltentrennlinien-farbe)
    - [Sonstiges](#sonstiges-1)
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

## CSS-Variablen

### Farbpaletten & semantische Farben

| Variable                                     | Beschreibung                                                                     |
| -------------------------------------------- | -------------------------------------------------------------------------------- |
| `--lux-theme-primary-0`                      | Primärfarbpalette; Tonstufe 0 (sehr dunkel / 0%).                                |
| `--lux-theme-primary-10`                     | Primärfarbpalette; Tonstufe 10 (sehr dunkel).                                    |
| `--lux-theme-primary-20`                     | Primärfarbpalette; Tonstufe 20 (dunkel).                                         |
| `--lux-theme-primary-25`                     | Primärfarbpalette; Tonstufe 25 (dunkler Zwischenwert).                           |
| `--lux-theme-primary-30`                     | Primärfarbpalette; Tonstufe 30 (kräftig dunkel).                                 |
| `--lux-theme-primary-35`                     | Primärfarbpalette; Tonstufe 35 (dunkel-mittel).                                  |
| `--lux-theme-primary-40`                     | Primärfarbpalette; Tonstufe 40 (Basis-/Standardton).                             |
| `--lux-theme-primary-50`                     | Primärfarbpalette; Tonstufe 50 (mittlerer Ton).                                  |
| `--lux-theme-primary-60`                     | Primärfarbpalette; Tonstufe 60 (mittel-hell).                                    |
| `--lux-theme-primary-70`                     | Primärfarbpalette; Tonstufe 70 (hell).                                           |
| `--lux-theme-primary-80`                     | Primärfarbpalette; Tonstufe 80 (sehr hell).                                      |
| `--lux-theme-primary-90`                     | Primärfarbpalette; Tonstufe 90 (nahe Pastell).                                   |
| `--lux-theme-primary-95`                     | Primärfarbpalette; Tonstufe 95 (sehr blass).                                     |
| `--lux-theme-primary-98`                     | Primärfarbpalette; Tonstufe 98 (fast weiß).                                      |
| `--lux-theme-primary-99`                     | Primärfarbpalette; Tonstufe 99 (minimal getönt).                                 |
| `--lux-theme-primary-100`                    | Primärfarbpalette; Tonstufe 100 (weiß / 100%).                                   |
| `--lux-theme-accent-0`                       | Akzent-/Sekundärpalette; Tonstufe 0 (sehr dunkel / 0%).                          |
| `--lux-theme-accent-10`                      | Akzent-/Sekundärpalette; Tonstufe 10 (sehr dunkel).                              |
| `--lux-theme-accent-20`                      | Akzent-/Sekundärpalette; Tonstufe 20 (dunkel).                                   |
| `--lux-theme-accent-25`                      | Akzent-/Sekundärpalette; Tonstufe 25 (dunkler Zwischenwert).                     |
| `--lux-theme-accent-30`                      | Akzent-/Sekundärpalette; Tonstufe 30 (kräftig dunkel).                           |
| `--lux-theme-accent-35`                      | Akzent-/Sekundärpalette; Tonstufe 35 (dunkel-mittel).                            |
| `--lux-theme-accent-40`                      | Akzent-/Sekundärpalette; Tonstufe 40 (Basis-/Standardton).                       |
| `--lux-theme-accent-50`                      | Akzent-/Sekundärpalette; Tonstufe 50 (mittlerer Ton).                            |
| `--lux-theme-accent-60`                      | Akzent-/Sekundärpalette; Tonstufe 60 (mittel-hell).                              |
| `--lux-theme-accent-70`                      | Akzent-/Sekundärpalette; Tonstufe 70 (hell).                                     |
| `--lux-theme-accent-80`                      | Akzent-/Sekundärpalette; Tonstufe 80 (sehr hell).                                |
| `--lux-theme-accent-90`                      | Akzent-/Sekundärpalette; Tonstufe 90 (nahe Pastell).                             |
| `--lux-theme-accent-95`                      | Akzent-/Sekundärpalette; Tonstufe 95 (sehr blass).                               |
| `--lux-theme-accent-98`                      | Akzent-/Sekundärpalette; Tonstufe 98 (fast weiß).                                |
| `--lux-theme-accent-99`                      | Akzent-/Sekundärpalette; Tonstufe 99 (minimal getönt).                           |
| `--lux-theme-accent-100`                     | Akzent-/Sekundärpalette; Tonstufe 100 (weiß / 100%).                             |
| `--lux-theme-neutral-0`                      | Neutrale Graustufenpalette; Tonstufe 0 (sehr dunkel / 0%).                       |
| `--lux-theme-neutral-10`                     | Neutrale Graustufenpalette; Tonstufe 10 (sehr dunkel).                           |
| `--lux-theme-neutral-20`                     | Neutrale Graustufenpalette; Tonstufe 20 (dunkel).                                |
| `--lux-theme-neutral-25`                     | Neutrale Graustufenpalette; Tonstufe 25 (dunkler Zwischenwert).                  |
| `--lux-theme-neutral-30`                     | Neutrale Graustufenpalette; Tonstufe 30 (kräftig dunkel).                        |
| `--lux-theme-neutral-35`                     | Neutrale Graustufenpalette; Tonstufe 35 (dunkel-mittel).                         |
| `--lux-theme-neutral-40`                     | Neutrale Graustufenpalette; Tonstufe 40 (Basis-/Standardton).                    |
| `--lux-theme-neutral-50`                     | Neutrale Graustufenpalette; Tonstufe 50 (mittlerer Ton).                         |
| `--lux-theme-neutral-60`                     | Neutrale Graustufenpalette; Tonstufe 60 (mittel-hell).                           |
| `--lux-theme-neutral-70`                     | Neutrale Graustufenpalette; Tonstufe 70 (hell).                                  |
| `--lux-theme-neutral-80`                     | Neutrale Graustufenpalette; Tonstufe 80 (sehr hell).                             |
| `--lux-theme-neutral-90`                     | Neutrale Graustufenpalette; Tonstufe 90 (nahe Pastell).                          |
| `--lux-theme-neutral-95`                     | Neutrale Graustufenpalette; Tonstufe 95 (sehr blass).                            |
| `--lux-theme-neutral-98`                     | Neutrale Graustufenpalette; Tonstufe 98 (fast weiß).                             |
| `--lux-theme-neutral-99`                     | Neutrale Graustufenpalette; Tonstufe 99 (minimal getönt).                        |
| `--lux-theme-neutral-100`                    | Neutrale Graustufenpalette; Tonstufe 100 (weiß / 100%).                          |
| `--lux-theme-warn-0`                         | Warn-/Fehlerpalette; Tonstufe 0 (sehr dunkel / 0%).                              |
| `--lux-theme-warn-10`                        | Warn-/Fehlerpalette; Tonstufe 10 (sehr dunkel).                                  |
| `--lux-theme-warn-20`                        | Warn-/Fehlerpalette; Tonstufe 20 (dunkel).                                       |
| `--lux-theme-warn-25`                        | Warn-/Fehlerpalette; Tonstufe 25 (dunkler Zwischenwert).                         |
| `--lux-theme-warn-30`                        | Warn-/Fehlerpalette; Tonstufe 30 (kräftig dunkel).                               |
| `--lux-theme-warn-35`                        | Warn-/Fehlerpalette; Tonstufe 35 (dunkel-mittel).                                |
| `--lux-theme-warn-40`                        | Warn-/Fehlerpalette; Tonstufe 40 (Basis-/Standardton).                           |
| `--lux-theme-warn-50`                        | Warn-/Fehlerpalette; Tonstufe 50 (mittlerer Ton).                                |
| `--lux-theme-warn-60`                        | Warn-/Fehlerpalette; Tonstufe 60 (mittel-hell).                                  |
| `--lux-theme-warn-70`                        | Warn-/Fehlerpalette; Tonstufe 70 (hell).                                         |
| `--lux-theme-warn-80`                        | Warn-/Fehlerpalette; Tonstufe 80 (sehr hell).                                    |
| `--lux-theme-warn-90`                        | Warn-/Fehlerpalette; Tonstufe 90 (nahe Pastell).                                 |
| `--lux-theme-warn-95`                        | Warn-/Fehlerpalette; Tonstufe 95 (sehr blass).                                   |
| `--lux-theme-warn-98`                        | Warn-/Fehlerpalette; Tonstufe 98 (fast weiß).                                    |
| `--lux-theme-warn-99`                        | Warn-/Fehlerpalette; Tonstufe 99 (minimal getönt).                               |
| `--lux-theme-warn-100`                       | Warn-/Fehlerpalette; Tonstufe 100 (weiß / 100%).                                 |
| `--lux-theme-primary-color`                  | Primärfarbpalette; Tonstufe color (Skalenwert).                                  |
| `--lux-theme-accent-color`                   | Akzent-/Sekundärpalette; Tonstufe color (Skalenwert).                            |
| `--lux-theme-warn-color`                     | Warn-/Fehlerpalette; Tonstufe color (Skalenwert).                                |
| `--lux-theme-custom-purple`                  | Benutzerdefinierter Farbtoken „purple“.                                          |
| `--lux-theme-custom-on-purple`               | Text-/Vordergrundfarbe auf benutzerdefiniertem Farbton „purple“.                 |
| `--lux-theme-custom-pink`                    | Benutzerdefinierter Farbtoken „pink“.                                            |
| `--lux-theme-custom-on-pink`                 | Text-/Vordergrundfarbe auf benutzerdefiniertem Farbton „pink“.                   |
| `--lux-theme-custom-yellow`                  | Benutzerdefinierter Farbtoken „yellow“.                                          |
| `--lux-theme-custom-on-yellow`               | Text-/Vordergrundfarbe auf benutzerdefiniertem Farbton „yellow“.                 |
| `--lux-theme-custom-orange`                  | Benutzerdefinierter Farbtoken „orange“.                                          |
| `--lux-theme-custom-on-orange`               | Text-/Vordergrundfarbe auf benutzerdefiniertem Farbton „orange“.                 |
| `--lux-theme-custom-lightblue`               | Benutzerdefinierter Farbtoken „lightblue“.                                       |
| `--lux-theme-custom-on-lightblue`            | Text-/Vordergrundfarbe auf benutzerdefiniertem Farbton „lightblue“.              |
| `--lux-theme-custom-blue`                    | Benutzerdefinierter Farbtoken „blue“.                                            |
| `--lux-theme-custom-on-blue`                 | Text-/Vordergrundfarbe auf benutzerdefiniertem Farbton „blue“.                   |
| `--lux-theme-custom-green`                   | Benutzerdefinierter Farbtoken „green“.                                           |
| `--lux-theme-custom-on-green`                | Text-/Vordergrundfarbe auf benutzerdefiniertem Farbton „green“.                  |
| `--lux-theme-custom-red`                     | Benutzerdefinierter Farbtoken „red“.                                             |
| `--lux-theme-custom-on-red`                  | Text-/Vordergrundfarbe auf benutzerdefiniertem Farbton „red“.                    |
| `--lux-theme-custom-gray`                    | Benutzerdefinierter Farbtoken „gray“.                                            |
| `--lux-theme-custom-on-gray`                 | Text-/Vordergrundfarbe auf benutzerdefiniertem Farbton „gray“.                   |
| `--lux-theme-custom-black`                   | Benutzerdefinierter Farbtoken „black“.                                           |
| `--lux-theme-custom-on-black`                | Text-/Vordergrundfarbe auf benutzerdefiniertem Farbton „black“.                  |
| `--lux-theme-custom-white`                   | Benutzerdefinierter Farbtoken „white“.                                           |
| `--lux-theme-custom-on-white`                | Text-/Vordergrundfarbe auf benutzerdefiniertem Farbton „white“.                  |
| `--lux-theme-contrast-custom-purple`         | Kontrastoptimierter benutzerdefinierter Farbtoken „purple“.                      |
| `--lux-theme-contrast-custom-on-purple`      | Kontrastoptimierte Vordergrundfarbe für benutzerdefinierten Farbton „purple“.    |
| `--lux-theme-contrast-custom-pink`           | Kontrastoptimierter benutzerdefinierter Farbtoken „pink“.                        |
| `--lux-theme-contrast-custom-on-pink`        | Kontrastoptimierte Vordergrundfarbe für benutzerdefinierten Farbton „pink“.      |
| `--lux-theme-contrast-custom-yellow`         | Kontrastoptimierter benutzerdefinierter Farbtoken „yellow“.                      |
| `--lux-theme-contrast-custom-on-yellow`      | Kontrastoptimierte Vordergrundfarbe für benutzerdefinierten Farbton „yellow“.    |
| `--lux-theme-contrast-custom-orange`         | Kontrastoptimierter benutzerdefinierter Farbtoken „orange“.                      |
| `--lux-theme-contrast-custom-on-orange`      | Kontrastoptimierte Vordergrundfarbe für benutzerdefinierten Farbton „orange“.    |
| `--lux-theme-contrast-custom-lightblue`      | Kontrastoptimierter benutzerdefinierter Farbtoken „lightblue“.                   |
| `--lux-theme-contrast-custom-on-lightblue`   | Kontrastoptimierte Vordergrundfarbe für benutzerdefinierten Farbton „lightblue“. |
| `--lux-theme-contrast-custom-blue`           | Kontrastoptimierter benutzerdefinierter Farbtoken „blue“.                        |
| `--lux-theme-contrast-custom-on-blue`        | Kontrastoptimierte Vordergrundfarbe für benutzerdefinierten Farbton „blue“.      |
| `--lux-theme-contrast-custom-green`          | Kontrastoptimierter benutzerdefinierter Farbtoken „green“.                       |
| `--lux-theme-contrast-custom-on-green`       | Kontrastoptimierte Vordergrundfarbe für benutzerdefinierten Farbton „green“.     |
| `--lux-theme-contrast-custom-red`            | Kontrastoptimierter benutzerdefinierter Farbtoken „red“.                         |
| `--lux-theme-contrast-custom-on-red`         | Kontrastoptimierte Vordergrundfarbe für benutzerdefinierten Farbton „red“.       |
| `--lux-theme-contrast-custom-gray`           | Kontrastoptimierter benutzerdefinierter Farbtoken „gray“.                        |
| `--lux-theme-contrast-custom-on-gray`        | Kontrastoptimierte Vordergrundfarbe für benutzerdefinierten Farbton „gray“.      |
| `--lux-theme-contrast-custom-black`          | Kontrastoptimierter benutzerdefinierter Farbtoken „black“.                       |
| `--lux-theme-contrast-custom-on-black`       | Kontrastoptimierte Vordergrundfarbe für benutzerdefinierten Farbton „black“.     |
| `--lux-theme-contrast-custom-white`          | Kontrastoptimierter benutzerdefinierter Farbtoken „white“.                       |
| `--lux-theme-contrast-custom-on-white`       | Kontrastoptimierte Vordergrundfarbe für benutzerdefinierten Farbton „white“.     |
| `--lux-theme-component-bg-red`               | Hintergrundfarbe für Komponentenvariante „red“.                                  |
| `--lux-theme-component-bg-green`             | Hintergrundfarbe für Komponentenvariante „green“.                                |
| `--lux-theme-component-bg-purple`            | Hintergrundfarbe für Komponentenvariante „purple“.                               |
| `--lux-theme-component-bg-blue`              | Hintergrundfarbe für Komponentenvariante „blue“.                                 |
| `--lux-theme-component-bg-gray`              | Hintergrundfarbe für Komponentenvariante „gray“.                                 |
| `--lux-theme-component-bg-orange`            | Hintergrundfarbe für Komponentenvariante „orange“.                               |
| `--lux-theme-component-bg-black`             | Hintergrundfarbe für Komponentenvariante „black“.                                |
| `--lux-theme-component-bg-white`             | Hintergrundfarbe für Komponentenvariante „white“.                                |
| `--lux-theme-component-bg-yellow`            | Hintergrundfarbe für Komponentenvariante „yellow“.                               |
| `--lux-theme-component-bg-pink`              | Hintergrundfarbe für Komponentenvariante „pink“.                                 |
| `--lux-theme-component-bg-lightblue`         | Hintergrundfarbe für Komponentenvariante „lightblue“.                            |
| `--lux-theme-component-font-color-red`       | Schriftfarbe für Komponentenvariante „red“.                                      |
| `--lux-theme-component-font-color-green`     | Schriftfarbe für Komponentenvariante „green“.                                    |
| `--lux-theme-component-font-color-purple`    | Schriftfarbe für Komponentenvariante „purple“.                                   |
| `--lux-theme-component-font-color-blue`      | Schriftfarbe für Komponentenvariante „blue“.                                     |
| `--lux-theme-component-font-color-gray`      | Schriftfarbe für Komponentenvariante „gray“.                                     |
| `--lux-theme-component-font-color-orange`    | Schriftfarbe für Komponentenvariante „orange“.                                   |
| `--lux-theme-component-font-color-black`     | Schriftfarbe für Komponentenvariante „black“.                                    |
| `--lux-theme-component-font-color-white`     | Schriftfarbe für Komponentenvariante „white“.                                    |
| `--lux-theme-component-font-color-yellow`    | Schriftfarbe für Komponentenvariante „yellow“.                                   |
| `--lux-theme-component-font-color-pink`      | Schriftfarbe für Komponentenvariante „pink“.                                     |
| `--lux-theme-component-font-color-lightblue` | Schriftfarbe für Komponentenvariante „lightblue“.                                |

### Design Tokens: Layout, Typografie & Spacing

| Variable                        | Beschreibung                             |
| ------------------------------- | ---------------------------------------- |
| `--lux-theme-app-font-family`   | Standardschriftfamilie der Anwendung.    |
| `--lux-theme-app-headline-font` | Schriftfamilie für Überschriften.        |
| `--lux-theme-breakpoint-xs`     | Responsiver Breakpoint für Größe „xs“.   |
| `--lux-theme-breakpoint-sm`     | Responsiver Breakpoint für Größe „sm“.   |
| `--lux-theme-breakpoint-md`     | Responsiver Breakpoint für Größe „md“.   |
| `--lux-theme-breakpoint-lg`     | Responsiver Breakpoint für Größe „lg“.   |
| `--lux-theme-breakpoint-xl`     | Responsiver Breakpoint für Größe „xl“.   |
| `--lux-theme-radius-xs`         | Eckradius in Größe „xs“.                 |
| `--lux-theme-radius-sm`         | Eckradius in Größe „sm“.                 |
| `--lux-theme-radius-md`         | Eckradius in Größe „md“.                 |
| `--lux-theme-radius-lg`         | Eckradius in Größe „lg“.                 |
| `--lux-theme-radius-xl`         | Eckradius in Größe „xl“.                 |
| `--lux-theme-radius-xxl`        | Eckradius in Größe „xxl“.                |
| `--lux-theme-spacing-xxs`       | Abstands-/Spacing-Token in Größe „xxs“.  |
| `--lux-theme-spacing-xs`        | Abstands-/Spacing-Token in Größe „xs“.   |
| `--lux-theme-spacing-1-5`       | Abstands-/Spacing-Token in Größe „1-5“.  |
| `--lux-theme-spacing-sm`        | Abstands-/Spacing-Token in Größe „sm“.   |
| `--lux-theme-spacing-3`         | Abstands-/Spacing-Token in Größe „3“.    |
| `--lux-theme-spacing-md`        | Abstands-/Spacing-Token in Größe „md“.   |
| `--lux-theme-spacing-lg`        | Abstands-/Spacing-Token in Größe „lg“.   |
| `--lux-theme-spacing-xl`        | Abstands-/Spacing-Token in Größe „xl“.   |
| `--lux-theme-spacing-xxl`       | Abstands-/Spacing-Token in Größe „xxl“.  |
| `--lux-theme-spacing-xxxl`      | Abstands-/Spacing-Token in Größe „xxxl“. |
| `--lux-theme-font-size-xs`      | Schriftgrößen-Token in Größe „xs“.       |
| `--lux-theme-font-size-sm`      | Schriftgrößen-Token in Größe „sm“.       |
| `--lux-theme-font-size-md`      | Schriftgrößen-Token in Größe „md“.       |
| `--lux-theme-font-size-lg`      | Schriftgrößen-Token in Größe „lg“.       |
| `--lux-theme-font-size-xl`      | Schriftgrößen-Token in Größe „xl“.       |
| `--lux-theme-font-size-2xl`     | Schriftgrößen-Token in Größe „2xl“.      |

### App-Grundlayout & Zustände

| Variable                                      | Beschreibung                                                |
| --------------------------------------------- | ----------------------------------------------------------- |
| `--lux-theme-app-header-item-border-radius`   | Anwendungsweites App-Token für „header-item-border-radius“. |
| `--lux-theme-app-header-bg`                   | Anwendungsweites App-Token für „header-bg“.                 |
| `--lux-theme-app-content-bg`                  | Anwendungsweites App-Token für „content-bg“.                |
| `--lux-theme-app-footer-bg`                   | Anwendungsweites App-Token für „footer-bg“.                 |
| `--lux-theme-app-footer-border-color`         | Anwendungsweites App-Token für „footer-border-color“.       |
| `--lux-theme-app-data-bg`                     | Anwendungsweites App-Token für „data-bg“.                   |
| `--lux-theme-app-gradient`                    | Anwendungsweites App-Token für „gradient“.                  |
| `--lux-theme-app-gradient-reverse`            | Anwendungsweites App-Token für „gradient-reverse“.          |
| `--lux-theme-app-border-color`                | Anwendungsweites App-Token für „border-color“.              |
| `--lux-theme-app-border-radius`               | Anwendungsweites App-Token für „border-radius“.             |
| `--lux-theme-app-state-layer-color`           | Anwendungsweites App-Token für „state-layer-color“.         |
| `--lux-theme-hover-state-layer-opacity`       | Token für Hover-Zustände.                                   |
| `--lux-theme-outline-dark`                    | Token für Fokus-/Outline-Darstellung.                       |
| `--lux-theme-outline-bright`                  | Token für Fokus-/Outline-Darstellung.                       |
| `--lux-theme-outline-width`                   | Token für Fokus-/Outline-Darstellung.                       |
| `--lux-theme-outline-style`                   | Token für Fokus-/Outline-Darstellung.                       |
| `--lux-theme-outline-color-bright`            | Token für Fokus-/Outline-Darstellung.                       |
| `--lux-theme-outline-color-dark`              | Token für Fokus-/Outline-Darstellung.                       |
| `--lux-theme-hover-color`                     | Token für Hover-Zustände.                                   |
| `--lux-theme-on-hover-color`                  | Token für Hover-Zustände.                                   |
| `--lux-theme-hover-color-for-dark-background` | Token für Hover-Zustände.                                   |
| `--lux-theme-selected-border-color`           | Token für ausgewählten Zustand.                             |
| `--lux-theme-selected-bg-color`               | Token für ausgewählten Zustand.                             |
| `--lux-theme-on-selected-color`               | Token für ausgewählten Zustand.                             |

### Formulare & Eingaben

| Variable                                                      | Beschreibung                                                                         |
| ------------------------------------------------------------- | ------------------------------------------------------------------------------------ |
| `--lux-theme-form-border-width`                               | Formular-Token für „border-width“.                                                   |
| `--lux-theme-form-min-height`                                 | Formular-Token für „min-height“.                                                     |
| `--lux-theme-form-dense-min-height`                           | Formular-Token für „dense-min-height“.                                               |
| `--lux-theme-form-control-textarea-padding`                   | Formular-Token für „control-textarea-padding“.                                       |
| `--lux-theme-form-control-textarea-dense-padding`             | Formular-Token für „control-textarea-dense-padding“.                                 |
| `--lux-theme-form-control-label-margin`                       | Formular-Token für „control-label-margin“.                                           |
| `--lux-theme-form-control-error-margin`                       | Formular-Token für „control-error-margin“.                                           |
| `--lux-theme-form-border-color`                               | Formular-Token für „border-color“.                                                   |
| `--lux-theme-form-hover-border-color`                         | Formular-Token für „hover-border-color“.                                             |
| `--lux-theme-form-focus-border-color`                         | Formular-Token für „focus-border-color“.                                             |
| `--lux-theme-form-focus-box-shadow`                           | Formular-Token für „focus-box-shadow“.                                               |
| `--lux-theme-form-error-border-color`                         | Formular-Token für „error-border-color“.                                             |
| `--lux-theme-form-error-box-shadow`                           | Formular-Token für „error-box-shadow“.                                               |
| `--lux-theme-form-control-font-size`                          | Formular-Token für „control-font-size“.                                              |
| `--lux-theme-form-control-buffer`                             | Formular-Token für „control-buffer“.                                                 |
| `--lux-theme-form-error-msg-background`                       | Formular-Token für „error-msg-background“.                                           |
| `--lux-theme-form-autofill-background-color`                  | Formular-Token für „autofill-background-color“.                                      |
| `--lux-theme-form-readonly-color`                             | Formular-Token für „readonly-color“.                                                 |
| `--lux-theme-form-readonly-bg-color`                          | Formular-Token für „readonly-bg-color“.                                              |
| `--lux-theme-datepicker-icon-color`                           | Datepicker-Komponente; steuert „icon-color“.                                         |
| `--lux-theme-datepicker-panel-shape`                          | Datepicker-Komponente; steuert „panel-shape“.                                        |
| `--lux-theme-datepicker-panel-text-color`                     | Datepicker-Komponente; steuert „panel-text-color“.                                   |
| `--lux-theme-datepicker-panel-font-size`                      | Datepicker-Komponente; steuert „panel-font-size“.                                    |
| `--lux-theme-datepicker-panel-date-border-radius`             | Datepicker-Komponente; steuert „panel-date-border-radius“.                           |
| `--lux-theme-datepicker-panel-date-background-color`          | Datepicker-Komponente; steuert „panel-date-background-color“.                        |
| `--lux-theme-datepicker-panel-date-selected-color`            | Datepicker-Komponente; steuert „panel-date-selected-color“.                          |
| `--lux-theme-datepicker-panel-date-selected-background-color` | Datepicker-Komponente; steuert „panel-date-selected-background-color“.               |
| `--lux-theme-datepicker-panel-date-hover-background-color`    | Datepicker-Komponente; steuert „panel-date-hover-background-color“.                  |
| `--lux-theme-file-upload-padding`                             | File-Upload-Komponente; steuert „padding“.                                           |
| `--lux-theme-file-upload-background-image`                    | File-Upload-Komponente; steuert „background-image“.                                  |
| `--lux-theme-file-upload-item-container-border`               | File-Upload-Komponente; steuert „item-container-border“.                             |
| `--lux-theme-file-upload-item-disabled-container-border`      | File-Upload-Komponente; steuert „item-disabled-container-border“.                    |
| `--lux-theme-file-upload-item-background-color`               | File-Upload-Komponente; steuert „item-background-color“.                             |
| `--lux-theme-file-upload-item-margin`                         | File-Upload-Komponente; steuert „item-margin“.                                       |
| `--lux-theme-file-upload-item-padding`                        | File-Upload-Komponente; steuert „item-padding“.                                      |
| `--lux-theme-file-upload-item-border`                         | File-Upload-Komponente; steuert „item-border“.                                       |
| `--lux-theme-file-upload-item-border-bottom`                  | File-Upload-Komponente; steuert „item-border-bottom“.                                |
| `--lux-theme-file-upload-item-border-bottom-left-radius`      | File-Upload-Komponente; steuert „item-border-bottom-left-radius“.                    |
| `--lux-theme-file-upload-item-border-bottom-right-radius`     | File-Upload-Komponente; steuert „item-border-bottom-right-radius“.                   |
| `--lux-theme-file-upload-item-disabled-border`                | File-Upload-Komponente; steuert „item-disabled-border“.                              |
| `--lux-theme-file-upload-item-disabled-border-bottom`         | File-Upload-Komponente; steuert „item-disabled-border-bottom“.                       |
| `--lux-theme-lookup-invalid-option-text-color`                | Lookup-/Autocomplete-Komponente; steuert „invalid-option-text-color“.                |
| `--lux-theme-lookup-invalid-option-font-weight`               | Lookup-/Autocomplete-Komponente; steuert „invalid-option-font-weight“.               |
| `--lux-theme-panel-option-min-height`                         | Panel-/Optionslisten-Komponente; steuert „option-min-height“.                        |
| `--lux-theme-panel-option-padding`                            | Panel-/Optionslisten-Komponente; steuert „option-padding“.                           |
| `--lux-theme-panel-bg-color`                                  | Panel-/Optionslisten-Komponente; steuert „bg-color“.                                 |
| `--lux-theme-panel-option-label-text-size`                    | Panel-/Optionslisten-Komponente; steuert „option-label-text-size“.                   |
| `--lux-theme-panel-option-label-text-color`                   | Panel-/Optionslisten-Komponente; steuert „option-label-text-color“.                  |
| `--lux-theme-panel-option-selected-state-layer-color`         | Panel-/Optionslisten-Komponente; steuert „option-selected-state-layer-color“.        |
| `--lux-theme-panel-option-hover-state-layer-color`            | Panel-/Optionslisten-Komponente; steuert „option-hover-state-layer-color“.           |
| `--lux-theme-panel-option-focus-state-layer-color`            | Panel-/Optionslisten-Komponente; steuert „option-focus-state-layer-color“.           |
| `--lux-theme-panel-option-disabled-selected-checkmark-color`  | Panel-/Optionslisten-Komponente; steuert „option-disabled-selected-checkmark-color“. |
| `--lux-theme-panel-option-selected-checkmark-color`           | Panel-/Optionslisten-Komponente; steuert „option-selected-checkmark-color“.          |

### Navigation & Struktur

| Variable                                                               | Beschreibung                                                                    |
| ---------------------------------------------------------------------- | ------------------------------------------------------------------------------- |
| `--lux-theme-breadcrumb-hover-color`                                   | Breadcrumb-Komponente; steuert „hover-color“.                                   |
| `--lux-theme-menu-item-font-color`                                     | Menü-Komponente; steuert „item-font-color“.                                     |
| `--lux-theme-menu-item-subtitle-font-color`                            | Menü-Komponente; steuert „item-subtitle-font-color“.                            |
| `--lux-theme-menu-item-subtitle-font-size`                             | Menü-Komponente; steuert „item-subtitle-font-size“.                             |
| `--lux-theme-menu-panel-header-font-color`                             | Menü-Komponente; steuert „panel-header-font-color“.                             |
| `--lux-theme-menu-panel-header-font-weight`                            | Menü-Komponente; steuert „panel-header-font-weight“.                            |
| `--lux-theme-menu-panel-header-font-size`                              | Menü-Komponente; steuert „panel-header-font-size“.                              |
| `--lux-theme-menu-item-icon-size`                                      | Menü-Komponente; steuert „item-icon-size“.                                      |
| `--lux-theme-menu-item-icon-size-large`                                | Menü-Komponente; steuert „item-icon-size-large“.                                |
| `--lux-theme-menu-item-font-size`                                      | Menü-Komponente; steuert „item-font-size“.                                      |
| `--lux-theme-menu-button-item-font-size`                               | Menü-Komponente; steuert „button-item-font-size“.                               |
| `--lux-theme-menu-button-text-container-shape`                         | Menü-Komponente; steuert „button-text-container-shape“.                         |
| `--lux-theme-menu-container-height`                                    | Menü-Komponente; steuert „container-height“.                                    |
| `--lux-theme-menu-panel-option-min-height`                             | Menü-Komponente; steuert „panel-option-min-height“.                             |
| `--lux-theme-menu-panel-option-padding`                                | Menü-Komponente; steuert „panel-option-padding“.                                |
| `--lux-theme-stepper-large-nav-item-font-size`                         | Stepper-Komponente; steuert „large-nav-item-font-size“.                         |
| `--lux-theme-stepper-large-nav-item-font-weight`                       | Stepper-Komponente; steuert „large-nav-item-font-weight“.                       |
| `--lux-theme-stepper-large-nav-item-line-height`                       | Stepper-Komponente; steuert „large-nav-item-line-height“.                       |
| `--lux-theme-stepper-large-nav-item-completed-font-size`               | Stepper-Komponente; steuert „large-nav-item-completed-font-size“.               |
| `--lux-theme-stepper-large-nav-item-completed-font-weight`             | Stepper-Komponente; steuert „large-nav-item-completed-font-weight“.             |
| `--lux-theme-stepper-large-nav-item-completed-line-height`             | Stepper-Komponente; steuert „large-nav-item-completed-line-height“.             |
| `--lux-theme-stepper-large-nav-item-number-container-background-color` | Stepper-Komponente; steuert „large-nav-item-number-container-background-color“. |
| `--lux-theme-stepper-large-nav-item-number-container-width`            | Stepper-Komponente; steuert „large-nav-item-number-container-width“.            |
| `--lux-theme-stepper-large-nav-item-number-container-height`           | Stepper-Komponente; steuert „large-nav-item-number-container-height“.           |
| `--lux-theme-stepper-large-nav-item-number-container-padding`          | Stepper-Komponente; steuert „large-nav-item-number-container-padding“.          |
| `--lux-theme-stepper-large-nav-item-number-container-radius`           | Stepper-Komponente; steuert „large-nav-item-number-container-radius“.           |
| `--lux-theme-stepper-large-nav-item-completed-icon-width`              | Stepper-Komponente; steuert „large-nav-item-completed-icon-width“.              |
| `--lux-theme-stepper-large-nav-item-completed-icon-height`             | Stepper-Komponente; steuert „large-nav-item-completed-icon-height“.             |
| `--lux-theme-stepper-large-nav-item-completed-icon-margin`             | Stepper-Komponente; steuert „large-nav-item-completed-icon-margin“.             |
| `--lux-theme-stepper-large-backdrop-bg`                                | Stepper-Komponente; steuert „large-backdrop-bg“.                                |
| `--lux-theme-stepper-large-completed-fc`                               | Stepper-Komponente; steuert „large-completed-fc“.                               |
| `--lux-theme-stepper-large-nav-item-active-fc`                         | Stepper-Komponente; steuert „large-nav-item-active-fc“.                         |
| `--lux-theme-stepper-large-nav-item-active-bg`                         | Stepper-Komponente; steuert „large-nav-item-active-bg“.                         |
| `--lux-theme-stepper-large-nav-item-disabled-fg`                       | Stepper-Komponente; steuert „large-nav-item-disabled-fg“.                       |
| `--lux-theme-stepper-large-nav-item-disabled-bg`                       | Stepper-Komponente; steuert „large-nav-item-disabled-bg“.                       |
| `--lux-theme-stepper-large-nav-item-completed-fg`                      | Stepper-Komponente; steuert „large-nav-item-completed-fg“.                      |
| `--lux-theme-stepper-large-nav-item-completed-bg`                      | Stepper-Komponente; steuert „large-nav-item-completed-bg“.                      |
| `--lux-theme-stepper-large-nav-item-not-touched-fg`                    | Stepper-Komponente; steuert „large-nav-item-not-touched-fg“.                    |
| `--lux-theme-stepper-large-nav-item-not-touched-bg`                    | Stepper-Komponente; steuert „large-nav-item-not-touched-bg“.                    |
| `--lux-theme-side-nav-button-color`                                    | Side-Navigation-Komponente; steuert „button-color“.                             |
| `--lux-theme-tabs-text-font`                                           | Tabs-Komponente; steuert „text-font“.                                           |
| `--lux-theme-tabs-label-text-size`                                     | Tabs-Komponente; steuert „label-text-size“.                                     |
| `--lux-theme-tabs-label-text-weight`                                   | Tabs-Komponente; steuert „label-text-weight“.                                   |
| `--lux-theme-tabs-border-radius`                                       | Tabs-Komponente; steuert „border-radius“.                                       |

### Buttons

| Variable                                                             | Beschreibung                                                                  |
| -------------------------------------------------------------------- | ----------------------------------------------------------------------------- |
| `--lux-theme-button-text-default-text-color`                         | Button-Komponente; steuert „text-default-text-color“.                         |
| `--lux-theme-button-text-primary-text-color`                         | Button-Komponente; steuert „text-primary-text-color“.                         |
| `--lux-theme-button-text-accent-text-color`                          | Button-Komponente; steuert „text-accent-text-color“.                          |
| `--lux-theme-button-text-warn-text-color`                            | Button-Komponente; steuert „text-warn-text-color“.                            |
| `--lux-theme-button-icon-default-text-color`                         | Button-Komponente; steuert „icon-default-text-color“.                         |
| `--lux-theme-button-icon-primary-text-color`                         | Button-Komponente; steuert „icon-primary-text-color“.                         |
| `--lux-theme-button-icon-accent-text-color`                          | Button-Komponente; steuert „icon-accent-text-color“.                          |
| `--lux-theme-button-icon-warn-text-color`                            | Button-Komponente; steuert „icon-warn-text-color“.                            |
| `--lux-theme-button-icon-size`                                       | Button-Komponente; steuert „icon-size“.                                       |
| `--lux-theme-button-icon-container-size`                             | Button-Komponente; steuert „icon-container-size“.                             |
| `--lux-theme-button-icon-container-shape`                            | Button-Komponente; steuert „icon-container-shape“.                            |
| `--lux-theme-button-flat-default-text-color`                         | Button-Komponente; steuert „flat-default-text-color“.                         |
| `--lux-theme-button-flat-default-container-color`                    | Button-Komponente; steuert „flat-default-container-color“.                    |
| `--lux-theme-button-flat-primary-text-color`                         | Button-Komponente; steuert „flat-primary-text-color“.                         |
| `--lux-theme-button-flat-primary-container-color`                    | Button-Komponente; steuert „flat-primary-container-color“.                    |
| `--lux-theme-button-flat-accent-text-color`                          | Button-Komponente; steuert „flat-accent-text-color“.                          |
| `--lux-theme-button-flat-accent-container-color`                     | Button-Komponente; steuert „flat-accent-container-color“.                     |
| `--lux-theme-button-flat-warn-text-color`                            | Button-Komponente; steuert „flat-warn-text-color“.                            |
| `--lux-theme-button-flat-warn-container-color`                       | Button-Komponente; steuert „flat-warn-container-color“.                       |
| `--lux-theme-button-raised-default-text-color`                       | Button-Komponente; steuert „raised-default-text-color“.                       |
| `--lux-theme-button-raised-default-container-color`                  | Button-Komponente; steuert „raised-default-container-color“.                  |
| `--lux-theme-button-raised-primary-text-color`                       | Button-Komponente; steuert „raised-primary-text-color“.                       |
| `--lux-theme-button-raised-primary-container-color`                  | Button-Komponente; steuert „raised-primary-container-color“.                  |
| `--lux-theme-button-raised-accent-text-color`                        | Button-Komponente; steuert „raised-accent-text-color“.                        |
| `--lux-theme-button-raised-accent-container-color`                   | Button-Komponente; steuert „raised-accent-container-color“.                   |
| `--lux-theme-button-raised-warn-text-color`                          | Button-Komponente; steuert „raised-warn-text-color“.                          |
| `--lux-theme-button-raised-warn-container-color`                     | Button-Komponente; steuert „raised-warn-container-color“.                     |
| `--lux-theme-button-stroked-default-text-color`                      | Button-Komponente; steuert „stroked-default-text-color“.                      |
| `--lux-theme-button-stroked-primary-text-color`                      | Button-Komponente; steuert „stroked-primary-text-color“.                      |
| `--lux-theme-button-stroked-accent-text-color`                       | Button-Komponente; steuert „stroked-accent-text-color“.                       |
| `--lux-theme-button-stroked-warn-text-color`                         | Button-Komponente; steuert „stroked-warn-text-color“.                         |
| `--lux-theme-button-rounded-stroked-default-text-color`              | Button-Komponente; steuert „rounded-stroked-default-text-color“.              |
| `--lux-theme-button-rounded-stroked-primary-text-color`              | Button-Komponente; steuert „rounded-stroked-primary-text-color“.              |
| `--lux-theme-button-rounded-stroked-accent-text-color`               | Button-Komponente; steuert „rounded-stroked-accent-text-color“.               |
| `--lux-theme-button-rounded-stroked-warn-text-color`                 | Button-Komponente; steuert „rounded-stroked-warn-text-color“.                 |
| `--lux-theme-button-rounded-default-text-color`                      | Button-Komponente; steuert „rounded-default-text-color“.                      |
| `--lux-theme-button-rounded-default-container-color`                 | Button-Komponente; steuert „rounded-default-container-color“.                 |
| `--lux-theme-button-rounded-primary-text-color`                      | Button-Komponente; steuert „rounded-primary-text-color“.                      |
| `--lux-theme-button-rounded-primary-container-color`                 | Button-Komponente; steuert „rounded-primary-container-color“.                 |
| `--lux-theme-button-rounded-accent-text-color`                       | Button-Komponente; steuert „rounded-accent-text-color“.                       |
| `--lux-theme-button-rounded-accent-container-color`                  | Button-Komponente; steuert „rounded-accent-container-color“.                  |
| `--lux-theme-button-rounded-warn-text-color`                         | Button-Komponente; steuert „rounded-warn-text-color“.                         |
| `--lux-theme-button-rounded-warn-container-color`                    | Button-Komponente; steuert „rounded-warn-container-color“.                    |
| `--lux-theme-button-text-container-shape`                            | Button-Komponente; steuert „text-container-shape“.                            |
| `--lux-theme-button-flat-container-shape`                            | Button-Komponente; steuert „flat-container-shape“.                            |
| `--lux-theme-button-raised-container-shape`                          | Button-Komponente; steuert „raised-container-shape“.                          |
| `--lux-theme-button-stroked-container-shape`                         | Button-Komponente; steuert „stroked-container-shape“.                         |
| `--lux-theme-button-rounded-container-shape`                         | Button-Komponente; steuert „rounded-container-shape“.                         |
| `--lux-theme-button-rounded-stroked-container-shape`                 | Button-Komponente; steuert „rounded-stroked-container-shape“.                 |
| `--lux-theme-button-text-container-height`                           | Button-Komponente; steuert „text-container-height“.                           |
| `--lux-theme-button-flat-container-height`                           | Button-Komponente; steuert „flat-container-height“.                           |
| `--lux-theme-button-raised-container-height`                         | Button-Komponente; steuert „raised-container-height“.                         |
| `--lux-theme-button-stroked-container-height`                        | Button-Komponente; steuert „stroked-container-height“.                        |
| `--lux-theme-button-rounded-container-height`                        | Button-Komponente; steuert „rounded-container-height“.                        |
| `--lux-theme-button-rounded-stroked-container-height`                | Button-Komponente; steuert „rounded-stroked-container-height“.                |
| `--lux-theme-button-text-text-size`                                  | Button-Komponente; steuert „text-text-size“.                                  |
| `--lux-theme-button-flat-text-size`                                  | Button-Komponente; steuert „flat-text-size“.                                  |
| `--lux-theme-button-raised-text-size`                                | Button-Komponente; steuert „raised-text-size“.                                |
| `--lux-theme-button-stroked-text-size`                               | Button-Komponente; steuert „stroked-text-size“.                               |
| `--lux-theme-button-rounded-text-size`                               | Button-Komponente; steuert „rounded-text-size“.                               |
| `--lux-theme-button-rounded-stroked-text-size`                       | Button-Komponente; steuert „rounded-stroked-text-size“.                       |
| `--lux-theme-button-text-text-weight`                                | Button-Komponente; steuert „text-text-weight“.                                |
| `--lux-theme-button-flat-text-weight`                                | Button-Komponente; steuert „flat-text-weight“.                                |
| `--lux-theme-button-raised-text-weight`                              | Button-Komponente; steuert „raised-text-weight“.                              |
| `--lux-theme-button-stroked-text-weight`                             | Button-Komponente; steuert „stroked-text-weight“.                             |
| `--lux-theme-button-text-font`                                       | Button-Komponente; steuert „text-font“.                                       |
| `--lux-theme-button-flat-font`                                       | Button-Komponente; steuert „flat-font“.                                       |
| `--lux-theme-button-raised-font`                                     | Button-Komponente; steuert „raised-font“.                                     |
| `--lux-theme-button-stroked-font`                                    | Button-Komponente; steuert „stroked-font“.                                    |
| `--lux-theme-button-text-text-tracking`                              | Button-Komponente; steuert „text-text-tracking“.                              |
| `--lux-theme-button-flat-text-tracking`                              | Button-Komponente; steuert „flat-text-tracking“.                              |
| `--lux-theme-button-raised-text-tracking`                            | Button-Komponente; steuert „raised-text-tracking“.                            |
| `--lux-theme-button-stroked-text-tracking`                           | Button-Komponente; steuert „stroked-text-tracking“.                           |
| `--lux-theme-button-toggle-height`                                   | Button-Komponente; steuert „toggle-height“.                                   |
| `--lux-theme-button-toggle-height-dense`                             | Button-Komponente; steuert „toggle-height-dense“.                             |
| `--lux-theme-button-toggle-shape`                                    | Button-Komponente; steuert „toggle-shape“.                                    |
| `--lux-theme-button-toggle-text-color`                               | Button-Komponente; steuert „toggle-text-color“.                               |
| `--lux-theme-button-toggle-divider-color`                            | Button-Komponente; steuert „toggle-divider-color“.                            |
| `--lux-theme-button-toggle-disabled-divider-color`                   | Button-Komponente; steuert „toggle-disabled-divider-color“.                   |
| `--lux-theme-button-toggle-selected-state-text-color`                | Button-Komponente; steuert „toggle-selected-state-text-color“.                |
| `--lux-theme-button-toggle-selected-state-background-color`          | Button-Komponente; steuert „toggle-selected-state-background-color“.          |
| `--lux-theme-button-toggle-hover-state-layer-opacity`                | Button-Komponente; steuert „toggle-hover-state-layer-opacity“.                |
| `--lux-theme-button-toggle-disabled-selected-state-text-color`       | Button-Komponente; steuert „toggle-disabled-selected-state-text-color“.       |
| `--lux-theme-button-toggle-disabled-selected-state-background-color` | Button-Komponente; steuert „toggle-disabled-selected-state-background-color“. |
| `--lux-theme-button-toggle-disabled-state-text-color`                | Button-Komponente; steuert „toggle-disabled-state-text-color“.                |
| `--lux-theme-button-toggle-disabled-state-background-color`          | Button-Komponente; steuert „toggle-disabled-state-background-color“.          |

### Container & Inhalte

| Variable                                                       | Beschreibung                                                                             |
| -------------------------------------------------------------- | ---------------------------------------------------------------------------------------- |
| `--lux-theme-accordion-panel-container-elevation-shadow-width` | Accordion-Komponente; steuert „panel-container-elevation-shadow-width“.                  |
| `--lux-theme-accordion-header-color-neutral`                   | Accordion-Komponente; steuert „header-color-neutral“.                                    |
| `--lux-theme-accordion-header-color-on-neutral`                | Accordion-Komponente; steuert „header-color-on-neutral“.                                 |
| `--lux-theme-accordion-header-hover-color-on-neutral`          | Accordion-Komponente; steuert „header-hover-color-on-neutral“.                           |
| `--lux-theme-accordion-header-focus-color-on-neutral`          | Accordion-Komponente; steuert „header-focus-color-on-neutral“.                           |
| `--lux-theme-accordion-header-color-primary`                   | Accordion-Komponente; steuert „header-color-primary“.                                    |
| `--lux-theme-accordion-header-color-on-primary`                | Accordion-Komponente; steuert „header-color-on-primary“.                                 |
| `--lux-theme-accordion-header-hover-color-on-primary`          | Accordion-Komponente; steuert „header-hover-color-on-primary“.                           |
| `--lux-theme-accordion-header-focus-color-on-primary`          | Accordion-Komponente; steuert „header-focus-color-on-primary“.                           |
| `--lux-theme-accordion-header-color-accent`                    | Accordion-Komponente; steuert „header-color-accent“.                                     |
| `--lux-theme-accordion-header-color-on-accent`                 | Accordion-Komponente; steuert „header-color-on-accent“.                                  |
| `--lux-theme-accordion-header-hover-color-on-accent`           | Accordion-Komponente; steuert „header-hover-color-on-accent“.                            |
| `--lux-theme-accordion-header-focus-color-on-accent`           | Accordion-Komponente; steuert „header-focus-color-on-accent“.                            |
| `--lux-theme-accordion-header-color-warn`                      | Accordion-Komponente; steuert „header-color-warn“.                                       |
| `--lux-theme-accordion-header-color-on-warn`                   | Accordion-Komponente; steuert „header-color-on-warn“.                                    |
| `--lux-theme-accordion-header-hover-color-on-warn`             | Accordion-Komponente; steuert „header-hover-color-on-warn“.                              |
| `--lux-theme-accordion-header-focus-color-on-warn`             | Accordion-Komponente; steuert „header-focus-color-on-warn“.                              |
| `--lux-theme-card-title-line-height`                           | Card-Komponente; steuert „title-line-height“.                                            |
| `--lux-theme-card-title-text-size`                             | Card-Komponente; steuert „title-text-size“.                                              |
| `--lux-theme-card-title-text-weight`                           | Card-Komponente; steuert „title-text-weight“.                                            |
| `--lux-theme-card-subtitle-text-size`                          | Card-Komponente; steuert „subtitle-text-size“.                                           |
| `--lux-theme-card-subtitle-text-weight`                        | Card-Komponente; steuert „subtitle-text-weight“.                                         |
| `--lux-theme-card-subtitle-text-color`                         | Card-Komponente; steuert „subtitle-text-color“.                                          |
| `--lux-theme-card-outline-color`                               | Card-Komponente; steuert „outline-color“.                                                |
| `--lux-theme-card-shape`                                       | Card-Komponente; steuert „shape“.                                                        |
| `--lux-theme-card-background-color`                            | Card-Komponente; steuert „background-color“.                                             |
| `--lux-theme-card-padding`                                     | Card-Komponente; steuert „padding“.                                                      |
| `--lux-theme-dialog-close-button-hover-color`                  | Dialog-Komponente; steuert „close-button-hover-color“.                                   |
| `--lux-theme-dialog-close-button-hover-background-color`       | Dialog-Komponente; steuert „close-button-hover-background-color“.                        |
| `--lux-theme-popup-background-color`                           | Popup-Komponente; steuert „background-color“.                                            |
| `--lux-theme-popup-fade-in-duration`                           | Popup-Komponente; steuert „fade-in-duration“.                                            |
| `--lux-theme-popup-panel-padding`                              | Popup-Komponente; steuert „panel-padding“.                                               |
| `--lux-theme-popup-title-font-size`                            | Popup-Komponente; steuert „title-font-size“.                                             |
| `--lux-theme-popup-title-line-height`                          | Popup-Komponente; steuert „title-line-height“.                                           |
| `--lux-theme-popup-title-font-weight`                          | Popup-Komponente; steuert „title-font-weight“.                                           |
| `--lux-theme-popup-font-size`                                  | Popup-Komponente; steuert „font-size“.                                                   |
| `--lux-theme-popup-line-height`                                | Popup-Komponente; steuert „line-height“.                                                 |
| `--lux-theme-popup-font-weight`                                | Popup-Komponente; steuert „font-weight“.                                                 |
| `--lux-theme-tabble-alternate-row-bg-color`                    | Tabellen-Token (vermutlich Schreibvariante von table); steuert „alternate-row-bg-color“. |
| `--lux-theme-tile-font-hover-color`                            | Tile-Komponente; steuert „font-hover-color“.                                             |
| `--lux-theme-tile-icon-color`                                  | Tile-Komponente; steuert „icon-color“.                                                   |
| `--lux-theme-tile-border-radius`                               | Tile-Komponente; steuert „border-radius“.                                                |
| `--lux-theme-tile-borderradius`                                | Tile-Komponente; steuert „borderradius“.                                                 |
| `--lux-theme-tile-bottom-line-color`                           | Tile-Komponente; steuert „bottom-line-color“.                                            |
| `--lux-theme-tile-ac-icon-color`                               | Tile-Komponente; steuert „ac-icon-color“.                                                |
| `--lux-theme-tile-ac-hover-bg-color`                           | Tile-Komponente; steuert „ac-hover-bg-color“.                                            |
| `--lux-theme-tile-ac-hover-border-color`                       | Tile-Komponente; steuert „ac-hover-border-color“.                                        |

### Feedback & Hinweise

| Variable                                        | Beschreibung                                                        |
| ----------------------------------------------- | ------------------------------------------------------------------- |
| `--lux-theme-snackbar-red`                      | Farbtoken für Snackbar-Variante „red“.                              |
| `--lux-theme-snackbar-green`                    | Farbtoken für Snackbar-Variante „green“.                            |
| `--lux-theme-snackbar-blue`                     | Farbtoken für Snackbar-Variante „blue“.                             |
| `--lux-theme-snackbar-orange`                   | Farbtoken für Snackbar-Variante „orange“.                           |
| `--lux-theme-snackbar-yellow`                   | Farbtoken für Snackbar-Variante „yellow“.                           |
| `--lux-theme-snackbar-white`                    | Farbtoken für Snackbar-Variante „white“.                            |
| `--lux-theme-badge-red`                         | Badge-Komponente; steuert „red“.                                    |
| `--lux-theme-badge-on-red`                      | Badge-Komponente; steuert „on-red“.                                 |
| `--lux-theme-badge-green`                       | Badge-Komponente; steuert „green“.                                  |
| `--lux-theme-badge-on-green`                    | Badge-Komponente; steuert „on-green“.                               |
| `--lux-theme-badge-purple`                      | Badge-Komponente; steuert „purple“.                                 |
| `--lux-theme-badge-on-purple`                   | Badge-Komponente; steuert „on-purple“.                              |
| `--lux-theme-badge-blue`                        | Badge-Komponente; steuert „blue“.                                   |
| `--lux-theme-badge-on-blue`                     | Badge-Komponente; steuert „on-blue“.                                |
| `--lux-theme-badge-gray`                        | Badge-Komponente; steuert „gray“.                                   |
| `--lux-theme-badge-on-gray`                     | Badge-Komponente; steuert „on-gray“.                                |
| `--lux-theme-badge-orange`                      | Badge-Komponente; steuert „orange“.                                 |
| `--lux-theme-badge-on-orange`                   | Badge-Komponente; steuert „on-orange“.                              |
| `--lux-theme-badge-black`                       | Badge-Komponente; steuert „black“.                                  |
| `--lux-theme-badge-on-black`                    | Badge-Komponente; steuert „on-black“.                               |
| `--lux-theme-badge-white`                       | Badge-Komponente; steuert „white“.                                  |
| `--lux-theme-badge-on-white`                    | Badge-Komponente; steuert „on-white“.                               |
| `--lux-theme-badge-yellow`                      | Badge-Komponente; steuert „yellow“.                                 |
| `--lux-theme-badge-on-yellow`                   | Badge-Komponente; steuert „on-yellow“.                              |
| `--lux-theme-badge-pink`                        | Badge-Komponente; steuert „pink“.                                   |
| `--lux-theme-badge-on-pink`                     | Badge-Komponente; steuert „on-pink“.                                |
| `--lux-theme-badge-lightblue`                   | Badge-Komponente; steuert „lightblue“.                              |
| `--lux-theme-badge-on-lightblue`                | Badge-Komponente; steuert „on-lightblue“.                           |
| `--lux-theme-icon-red`                          | Icon-Komponente; steuert „red“.                                     |
| `--lux-theme-icon-on-red`                       | Icon-Komponente; steuert „on-red“.                                  |
| `--lux-theme-icon-green`                        | Icon-Komponente; steuert „green“.                                   |
| `--lux-theme-icon-on-green`                     | Icon-Komponente; steuert „on-green“.                                |
| `--lux-theme-icon-purple`                       | Icon-Komponente; steuert „purple“.                                  |
| `--lux-theme-icon-on-purple`                    | Icon-Komponente; steuert „on-purple“.                               |
| `--lux-theme-icon-blue`                         | Icon-Komponente; steuert „blue“.                                    |
| `--lux-theme-icon-on-blue`                      | Icon-Komponente; steuert „on-blue“.                                 |
| `--lux-theme-icon-gray`                         | Icon-Komponente; steuert „gray“.                                    |
| `--lux-theme-icon-on-gray`                      | Icon-Komponente; steuert „on-gray“.                                 |
| `--lux-theme-icon-orange`                       | Icon-Komponente; steuert „orange“.                                  |
| `--lux-theme-icon-on-orange`                    | Icon-Komponente; steuert „on-orange“.                               |
| `--lux-theme-icon-black`                        | Icon-Komponente; steuert „black“.                                   |
| `--lux-theme-icon-on-black`                     | Icon-Komponente; steuert „on-black“.                                |
| `--lux-theme-icon-yellow`                       | Icon-Komponente; steuert „yellow“.                                  |
| `--lux-theme-icon-on-yellow`                    | Icon-Komponente; steuert „on-yellow“.                               |
| `--lux-theme-icon-pink`                         | Icon-Komponente; steuert „pink“.                                    |
| `--lux-theme-icon-on-pink`                      | Icon-Komponente; steuert „on-pink“.                                 |
| `--lux-theme-icon-lightblue`                    | Icon-Komponente; steuert „lightblue“.                               |
| `--lux-theme-icon-on-lightblue`                 | Icon-Komponente; steuert „on-lightblue“.                            |
| `--lux-theme-link-plain-color`                  | Link-Komponente; steuert „plain-color“.                             |
| `--lux-theme-link-plain-icon-color`             | Link-Komponente; steuert „plain-icon-color“.                        |
| `--lux-theme-link-plain-text-decoration`        | Link-Komponente; steuert „plain-text-decoration“.                   |
| `--lux-theme-link-plain-background-color`       | Link-Komponente; steuert „plain-background-color“.                  |
| `--lux-theme-link-plain-hover-color`            | Link-Komponente; steuert „plain-hover-color“.                       |
| `--lux-theme-link-plain-hover-background-color` | Link-Komponente; steuert „plain-hover-background-color“.            |
| `--lux-theme-messagebox-red`                    | Messagebox-Komponente; steuert „red“.                               |
| `--lux-theme-messagebox-on-red`                 | Messagebox-Komponente; steuert „on-red“.                            |
| `--lux-theme-messagebox-green`                  | Messagebox-Komponente; steuert „green“.                             |
| `--lux-theme-messagebox-on-green`               | Messagebox-Komponente; steuert „on-green“.                          |
| `--lux-theme-messagebox-purple`                 | Messagebox-Komponente; steuert „purple“.                            |
| `--lux-theme-messagebox-on-purple`              | Messagebox-Komponente; steuert „on-purple“.                         |
| `--lux-theme-messagebox-blue`                   | Messagebox-Komponente; steuert „blue“.                              |
| `--lux-theme-messagebox-on-blue`                | Messagebox-Komponente; steuert „on-blue“.                           |
| `--lux-theme-messagebox-gray`                   | Messagebox-Komponente; steuert „gray“.                              |
| `--lux-theme-messagebox-on-gray`                | Messagebox-Komponente; steuert „on-gray“.                           |
| `--lux-theme-messagebox-orange`                 | Messagebox-Komponente; steuert „orange“.                            |
| `--lux-theme-messagebox-on-orange`              | Messagebox-Komponente; steuert „on-orange“.                         |
| `--lux-theme-messagebox-white`                  | Messagebox-Komponente; steuert „white“.                             |
| `--lux-theme-messagebox-on-white`               | Messagebox-Komponente; steuert „on-white“.                          |
| `--lux-theme-messagebox-yellow`                 | Messagebox-Komponente; steuert „yellow“.                            |
| `--lux-theme-messagebox-on-yellow`              | Messagebox-Komponente; steuert „on-yellow“.                         |
| `--lux-theme-messagebox-pink`                   | Messagebox-Komponente; steuert „pink“.                              |
| `--lux-theme-messagebox-on-pink`                | Messagebox-Komponente; steuert „on-pink“.                           |
| `--lux-theme-messagebox-lightblue`              | Messagebox-Komponente; steuert „lightblue“.                         |
| `--lux-theme-messagebox-on-lightblue`           | Messagebox-Komponente; steuert „on-lightblue“.                      |
| `--lux-theme-textbox-default-color`             | Textbox-/Hinweisbox-Komponente; steuert „default-color“.            |
| `--lux-theme-textbox-default-on-color`          | Textbox-/Hinweisbox-Komponente; steuert „default-on-color“.         |
| `--lux-theme-textbox-default-border-color`      | Textbox-/Hinweisbox-Komponente; steuert „default-border-color“.     |
| `--lux-theme-textbox-default-icon-color`        | Textbox-/Hinweisbox-Komponente; steuert „default-icon-color“.       |
| `--lux-theme-textbox-blue-color`                | Textbox-/Hinweisbox-Komponente; steuert „blue-color“.               |
| `--lux-theme-textbox-blue-on-color`             | Textbox-/Hinweisbox-Komponente; steuert „blue-on-color“.            |
| `--lux-theme-textbox-blue-border-color`         | Textbox-/Hinweisbox-Komponente; steuert „blue-border-color“.        |
| `--lux-theme-textbox-blue-icon-color`           | Textbox-/Hinweisbox-Komponente; steuert „blue-icon-color“.          |
| `--lux-theme-textbox-green-color`               | Textbox-/Hinweisbox-Komponente; steuert „green-color“.              |
| `--lux-theme-textbox-green-on-color`            | Textbox-/Hinweisbox-Komponente; steuert „green-on-color“.           |
| `--lux-theme-textbox-green-border-color`        | Textbox-/Hinweisbox-Komponente; steuert „green-border-color“.       |
| `--lux-theme-textbox-green-icon-color`          | Textbox-/Hinweisbox-Komponente; steuert „green-icon-color“.         |
| `--lux-theme-textbox-red-color`                 | Textbox-/Hinweisbox-Komponente; steuert „red-color“.                |
| `--lux-theme-textbox-red-on-color`              | Textbox-/Hinweisbox-Komponente; steuert „red-on-color“.             |
| `--lux-theme-textbox-red-border-color`          | Textbox-/Hinweisbox-Komponente; steuert „red-border-color“.         |
| `--lux-theme-textbox-red-icon-color`            | Textbox-/Hinweisbox-Komponente; steuert „red-icon-color“.           |
| `--lux-theme-textbox-yellow-color`              | Textbox-/Hinweisbox-Komponente; steuert „yellow-color“.             |
| `--lux-theme-textbox-yellow-on-color`           | Textbox-/Hinweisbox-Komponente; steuert „yellow-on-color“.          |
| `--lux-theme-textbox-yellow-border-color`       | Textbox-/Hinweisbox-Komponente; steuert „yellow-border-color“.      |
| `--lux-theme-textbox-yellow-icon-color`         | Textbox-/Hinweisbox-Komponente; steuert „yellow-icon-color“.        |
| `--lux-theme-tour-hint-overlay-backdrop-color`  | Tour-/Onboarding-Komponente; steuert „hint-overlay-backdrop-color“. |

### Sonstiges

| Variable                                  | Beschreibung                                  |
| ----------------------------------------- | --------------------------------------------- |
| `--lux-theme-dark-primary-text`           | Allgemeiner projekt-spezifischer Theme-Token. |
| `--lux-theme-dark-secondary-text`         | Allgemeiner projekt-spezifischer Theme-Token. |
| `--lux-theme-dark-disabled-text`          | Allgemeiner projekt-spezifischer Theme-Token. |
| `--lux-theme-dark-dividers`               | Allgemeiner projekt-spezifischer Theme-Token. |
| `--lux-theme-dark-focused`                | Allgemeiner projekt-spezifischer Theme-Token. |
| `--lux-theme-light-primary-text`          | Allgemeiner projekt-spezifischer Theme-Token. |
| `--lux-theme-light-secondary-text`        | Allgemeiner projekt-spezifischer Theme-Token. |
| `--lux-theme-light-disabled-text`         | Allgemeiner projekt-spezifischer Theme-Token. |
| `--lux-theme-light-dividers`              | Allgemeiner projekt-spezifischer Theme-Token. |
| `--lux-theme-light-focused`               | Allgemeiner projekt-spezifischer Theme-Token. |
| `--lux-theme-state-layer-color`           | Allgemeiner projekt-spezifischer Theme-Token. |
| `--lux-theme-focus-state-layer-opacity`   | Allgemeiner projekt-spezifischer Theme-Token. |
| `--lux-theme-pressed-state-layer-opacity` | Allgemeiner projekt-spezifischer Theme-Token. |
| `--lux-focus-state-layer-color`           | Allgemeiner projekt-spezifischer Theme-Token. |
| `--lux-z-action-bar`                      | Allgemeiner projekt-spezifischer Theme-Token. |
| `--lux-z-header`                          | Allgemeiner projekt-spezifischer Theme-Token. |
| `--lux-z-backdrop`                        | Allgemeiner projekt-spezifischer Theme-Token. |
| `--lux-z-drawer`                          | Allgemeiner projekt-spezifischer Theme-Token. |
| `--lux-z-skip-link`                       | Allgemeiner projekt-spezifischer Theme-Token. |
| `--lux-theme-file-input-button-size`      | Allgemeiner projekt-spezifischer Theme-Token. |
| `--lux-theme-file-input-button-padding`   | Allgemeiner projekt-spezifischer Theme-Token. |

## CSS-Klassen

### Textfarbe

| CSS-Klasse                        | Beschreibung                                                            |
| --------------------------------- | ----------------------------------------------------------------------- |
| `.lux-color-primary-0`            | Setzt die Textfarbe (`color`) auf den Farbtoken „primary-0“.            |
| `.lux-color-primary-10`           | Setzt die Textfarbe (`color`) auf den Farbtoken „primary-10“.           |
| `.lux-color-primary-20`           | Setzt die Textfarbe (`color`) auf den Farbtoken „primary-20“.           |
| `.lux-color-primary-25`           | Setzt die Textfarbe (`color`) auf den Farbtoken „primary-25“.           |
| `.lux-color-primary-30`           | Setzt die Textfarbe (`color`) auf den Farbtoken „primary-30“.           |
| `.lux-color-primary-35`           | Setzt die Textfarbe (`color`) auf den Farbtoken „primary-35“.           |
| `.lux-color-primary-40`           | Setzt die Textfarbe (`color`) auf den Farbtoken „primary-40“.           |
| `.lux-color-primary-50`           | Setzt die Textfarbe (`color`) auf den Farbtoken „primary-50“.           |
| `.lux-color-primary-60`           | Setzt die Textfarbe (`color`) auf den Farbtoken „primary-60“.           |
| `.lux-color-primary-70`           | Setzt die Textfarbe (`color`) auf den Farbtoken „primary-70“.           |
| `.lux-color-primary-80`           | Setzt die Textfarbe (`color`) auf den Farbtoken „primary-80“.           |
| `.lux-color-primary-90`           | Setzt die Textfarbe (`color`) auf den Farbtoken „primary-90“.           |
| `.lux-color-primary-95`           | Setzt die Textfarbe (`color`) auf den Farbtoken „primary-95“.           |
| `.lux-color-primary-98`           | Setzt die Textfarbe (`color`) auf den Farbtoken „primary-98“.           |
| `.lux-color-primary-99`           | Setzt die Textfarbe (`color`) auf den Farbtoken „primary-99“.           |
| `.lux-color-primary-100`          | Setzt die Textfarbe (`color`) auf den Farbtoken „primary-100“.          |
| `.lux-color-accent-0`             | Setzt die Textfarbe (`color`) auf den Farbtoken „accent-0“.             |
| `.lux-color-accent-10`            | Setzt die Textfarbe (`color`) auf den Farbtoken „accent-10“.            |
| `.lux-color-accent-20`            | Setzt die Textfarbe (`color`) auf den Farbtoken „accent-20“.            |
| `.lux-color-accent-25`            | Setzt die Textfarbe (`color`) auf den Farbtoken „accent-25“.            |
| `.lux-color-accent-30`            | Setzt die Textfarbe (`color`) auf den Farbtoken „accent-30“.            |
| `.lux-color-accent-35`            | Setzt die Textfarbe (`color`) auf den Farbtoken „accent-35“.            |
| `.lux-color-accent-40`            | Setzt die Textfarbe (`color`) auf den Farbtoken „accent-40“.            |
| `.lux-color-accent-50`            | Setzt die Textfarbe (`color`) auf den Farbtoken „accent-50“.            |
| `.lux-color-accent-60`            | Setzt die Textfarbe (`color`) auf den Farbtoken „accent-60“.            |
| `.lux-color-accent-70`            | Setzt die Textfarbe (`color`) auf den Farbtoken „accent-70“.            |
| `.lux-color-accent-80`            | Setzt die Textfarbe (`color`) auf den Farbtoken „accent-80“.            |
| `.lux-color-accent-90`            | Setzt die Textfarbe (`color`) auf den Farbtoken „accent-90“.            |
| `.lux-color-accent-95`            | Setzt die Textfarbe (`color`) auf den Farbtoken „accent-95“.            |
| `.lux-color-accent-98`            | Setzt die Textfarbe (`color`) auf den Farbtoken „accent-98“.            |
| `.lux-color-accent-99`            | Setzt die Textfarbe (`color`) auf den Farbtoken „accent-99“.            |
| `.lux-color-accent-100`           | Setzt die Textfarbe (`color`) auf den Farbtoken „accent-100“.           |
| `.lux-color-neutral-0`            | Setzt die Textfarbe (`color`) auf den Farbtoken „neutral-0“.            |
| `.lux-color-neutral-10`           | Setzt die Textfarbe (`color`) auf den Farbtoken „neutral-10“.           |
| `.lux-color-neutral-20`           | Setzt die Textfarbe (`color`) auf den Farbtoken „neutral-20“.           |
| `.lux-color-neutral-25`           | Setzt die Textfarbe (`color`) auf den Farbtoken „neutral-25“.           |
| `.lux-color-neutral-30`           | Setzt die Textfarbe (`color`) auf den Farbtoken „neutral-30“.           |
| `.lux-color-neutral-35`           | Setzt die Textfarbe (`color`) auf den Farbtoken „neutral-35“.           |
| `.lux-color-neutral-40`           | Setzt die Textfarbe (`color`) auf den Farbtoken „neutral-40“.           |
| `.lux-color-neutral-50`           | Setzt die Textfarbe (`color`) auf den Farbtoken „neutral-50“.           |
| `.lux-color-neutral-60`           | Setzt die Textfarbe (`color`) auf den Farbtoken „neutral-60“.           |
| `.lux-color-neutral-70`           | Setzt die Textfarbe (`color`) auf den Farbtoken „neutral-70“.           |
| `.lux-color-neutral-80`           | Setzt die Textfarbe (`color`) auf den Farbtoken „neutral-80“.           |
| `.lux-color-neutral-90`           | Setzt die Textfarbe (`color`) auf den Farbtoken „neutral-90“.           |
| `.lux-color-neutral-95`           | Setzt die Textfarbe (`color`) auf den Farbtoken „neutral-95“.           |
| `.lux-color-neutral-98`           | Setzt die Textfarbe (`color`) auf den Farbtoken „neutral-98“.           |
| `.lux-color-neutral-99`           | Setzt die Textfarbe (`color`) auf den Farbtoken „neutral-99“.           |
| `.lux-color-neutral-100`          | Setzt die Textfarbe (`color`) auf den Farbtoken „neutral-100“.          |
| `.lux-color-warn-0`               | Setzt die Textfarbe (`color`) auf den Farbtoken „warn-0“.               |
| `.lux-color-warn-10`              | Setzt die Textfarbe (`color`) auf den Farbtoken „warn-10“.              |
| `.lux-color-warn-20`              | Setzt die Textfarbe (`color`) auf den Farbtoken „warn-20“.              |
| `.lux-color-warn-25`              | Setzt die Textfarbe (`color`) auf den Farbtoken „warn-25“.              |
| `.lux-color-warn-30`              | Setzt die Textfarbe (`color`) auf den Farbtoken „warn-30“.              |
| `.lux-color-warn-35`              | Setzt die Textfarbe (`color`) auf den Farbtoken „warn-35“.              |
| `.lux-color-warn-40`              | Setzt die Textfarbe (`color`) auf den Farbtoken „warn-40“.              |
| `.lux-color-warn-50`              | Setzt die Textfarbe (`color`) auf den Farbtoken „warn-50“.              |
| `.lux-color-warn-60`              | Setzt die Textfarbe (`color`) auf den Farbtoken „warn-60“.              |
| `.lux-color-warn-70`              | Setzt die Textfarbe (`color`) auf den Farbtoken „warn-70“.              |
| `.lux-color-warn-80`              | Setzt die Textfarbe (`color`) auf den Farbtoken „warn-80“.              |
| `.lux-color-warn-90`              | Setzt die Textfarbe (`color`) auf den Farbtoken „warn-90“.              |
| `.lux-color-warn-95`              | Setzt die Textfarbe (`color`) auf den Farbtoken „warn-95“.              |
| `.lux-color-warn-98`              | Setzt die Textfarbe (`color`) auf den Farbtoken „warn-98“.              |
| `.lux-color-warn-99`              | Setzt die Textfarbe (`color`) auf den Farbtoken „warn-99“.              |
| `.lux-color-warn-100`             | Setzt die Textfarbe (`color`) auf den Farbtoken „warn-100“.             |
| `.lux-color-dark-divider`         | Setzt die Textfarbe (`color`) auf den Farbtoken „dark-divider“.         |
| `.lux-color-light-divider`        | Setzt die Textfarbe (`color`) auf den Farbtoken „light-divider“.        |
| `.lux-color-red`                  | Setzt die Textfarbe (`color`) auf den Farbtoken „red“.                  |
| `.lux-color-green`                | Setzt die Textfarbe (`color`) auf den Farbtoken „green“.                |
| `.lux-color-purple`               | Setzt die Textfarbe (`color`) auf den Farbtoken „purple“.               |
| `.lux-color-blue`                 | Setzt die Textfarbe (`color`) auf den Farbtoken „blue“.                 |
| `.lux-color-gray`                 | Setzt die Textfarbe (`color`) auf den Farbtoken „gray“.                 |
| `.lux-color-orange`               | Setzt die Textfarbe (`color`) auf den Farbtoken „orange“.               |
| `.lux-color-black`                | Setzt die Textfarbe (`color`) auf den Farbtoken „black“.                |
| `.lux-color-white`                | Setzt die Textfarbe (`color`) auf den Farbtoken „white“.                |
| `.lux-color-yellow`               | Setzt die Textfarbe (`color`) auf den Farbtoken „yellow“.               |
| `.lux-color-pink`                 | Setzt die Textfarbe (`color`) auf den Farbtoken „pink“.                 |
| `.lux-color-lightblue`            | Setzt die Textfarbe (`color`) auf den Farbtoken „lightblue“.            |
| `.lux-color-dark-primary-text`    | Setzt die Textfarbe (`color`) auf den Farbtoken „dark-primary-text“.    |
| `.lux-color-dark-secondary-text`  | Setzt die Textfarbe (`color`) auf den Farbtoken „dark-secondary-text“.  |
| `.lux-color-dark-disabled-text`   | Setzt die Textfarbe (`color`) auf den Farbtoken „dark-disabled-text“.   |
| `.lux-color-dark-focused`         | Setzt die Textfarbe (`color`) auf den Farbtoken „dark-focused“.         |
| `.lux-color-light-primary-text`   | Setzt die Textfarbe (`color`) auf den Farbtoken „light-primary-text“.   |
| `.lux-color-light-secondary-text` | Setzt die Textfarbe (`color`) auf den Farbtoken „light-secondary-text“. |
| `.lux-color-light-disabled-text`  | Setzt die Textfarbe (`color`) auf den Farbtoken „light-disabled-text“.  |
| `.lux-color-light-focused`        | Setzt die Textfarbe (`color`) auf den Farbtoken „light-focused“.        |

### Hintergrundfarbe

| CSS-Klasse                  | Beschreibung                                                                     |
| --------------------------- | -------------------------------------------------------------------------------- |
| `.lux-bg-color-primary-0`   | Setzt die Hintergrundfarbe (`background-color`) auf den Farbtoken „primary-0“.   |
| `.lux-bg-color-primary-10`  | Setzt die Hintergrundfarbe (`background-color`) auf den Farbtoken „primary-10“.  |
| `.lux-bg-color-primary-20`  | Setzt die Hintergrundfarbe (`background-color`) auf den Farbtoken „primary-20“.  |
| `.lux-bg-color-primary-25`  | Setzt die Hintergrundfarbe (`background-color`) auf den Farbtoken „primary-25“.  |
| `.lux-bg-color-primary-30`  | Setzt die Hintergrundfarbe (`background-color`) auf den Farbtoken „primary-30“.  |
| `.lux-bg-color-primary-35`  | Setzt die Hintergrundfarbe (`background-color`) auf den Farbtoken „primary-35“.  |
| `.lux-bg-color-primary-40`  | Setzt die Hintergrundfarbe (`background-color`) auf den Farbtoken „primary-40“.  |
| `.lux-bg-color-primary-50`  | Setzt die Hintergrundfarbe (`background-color`) auf den Farbtoken „primary-50“.  |
| `.lux-bg-color-primary-60`  | Setzt die Hintergrundfarbe (`background-color`) auf den Farbtoken „primary-60“.  |
| `.lux-bg-color-primary-70`  | Setzt die Hintergrundfarbe (`background-color`) auf den Farbtoken „primary-70“.  |
| `.lux-bg-color-primary-80`  | Setzt die Hintergrundfarbe (`background-color`) auf den Farbtoken „primary-80“.  |
| `.lux-bg-color-primary-90`  | Setzt die Hintergrundfarbe (`background-color`) auf den Farbtoken „primary-90“.  |
| `.lux-bg-color-primary-95`  | Setzt die Hintergrundfarbe (`background-color`) auf den Farbtoken „primary-95“.  |
| `.lux-bg-color-primary-98`  | Setzt die Hintergrundfarbe (`background-color`) auf den Farbtoken „primary-98“.  |
| `.lux-bg-color-primary-99`  | Setzt die Hintergrundfarbe (`background-color`) auf den Farbtoken „primary-99“.  |
| `.lux-bg-color-primary-100` | Setzt die Hintergrundfarbe (`background-color`) auf den Farbtoken „primary-100“. |
| `.lux-bg-color-accent-0`    | Setzt die Hintergrundfarbe (`background-color`) auf den Farbtoken „accent-0“.    |
| `.lux-bg-color-accent-10`   | Setzt die Hintergrundfarbe (`background-color`) auf den Farbtoken „accent-10“.   |
| `.lux-bg-color-accent-20`   | Setzt die Hintergrundfarbe (`background-color`) auf den Farbtoken „accent-20“.   |
| `.lux-bg-color-accent-25`   | Setzt die Hintergrundfarbe (`background-color`) auf den Farbtoken „accent-25“.   |
| `.lux-bg-color-accent-30`   | Setzt die Hintergrundfarbe (`background-color`) auf den Farbtoken „accent-30“.   |
| `.lux-bg-color-accent-35`   | Setzt die Hintergrundfarbe (`background-color`) auf den Farbtoken „accent-35“.   |
| `.lux-bg-color-accent-40`   | Setzt die Hintergrundfarbe (`background-color`) auf den Farbtoken „accent-40“.   |
| `.lux-bg-color-accent-50`   | Setzt die Hintergrundfarbe (`background-color`) auf den Farbtoken „accent-50“.   |
| `.lux-bg-color-accent-60`   | Setzt die Hintergrundfarbe (`background-color`) auf den Farbtoken „accent-60“.   |
| `.lux-bg-color-accent-70`   | Setzt die Hintergrundfarbe (`background-color`) auf den Farbtoken „accent-70“.   |
| `.lux-bg-color-accent-80`   | Setzt die Hintergrundfarbe (`background-color`) auf den Farbtoken „accent-80“.   |
| `.lux-bg-color-accent-90`   | Setzt die Hintergrundfarbe (`background-color`) auf den Farbtoken „accent-90“.   |
| `.lux-bg-color-accent-95`   | Setzt die Hintergrundfarbe (`background-color`) auf den Farbtoken „accent-95“.   |
| `.lux-bg-color-accent-98`   | Setzt die Hintergrundfarbe (`background-color`) auf den Farbtoken „accent-98“.   |
| `.lux-bg-color-accent-99`   | Setzt die Hintergrundfarbe (`background-color`) auf den Farbtoken „accent-99“.   |
| `.lux-bg-color-accent-100`  | Setzt die Hintergrundfarbe (`background-color`) auf den Farbtoken „accent-100“.  |
| `.lux-bg-color-neutral-0`   | Setzt die Hintergrundfarbe (`background-color`) auf den Farbtoken „neutral-0“.   |
| `.lux-bg-color-neutral-10`  | Setzt die Hintergrundfarbe (`background-color`) auf den Farbtoken „neutral-10“.  |
| `.lux-bg-color-neutral-20`  | Setzt die Hintergrundfarbe (`background-color`) auf den Farbtoken „neutral-20“.  |
| `.lux-bg-color-neutral-25`  | Setzt die Hintergrundfarbe (`background-color`) auf den Farbtoken „neutral-25“.  |
| `.lux-bg-color-neutral-30`  | Setzt die Hintergrundfarbe (`background-color`) auf den Farbtoken „neutral-30“.  |
| `.lux-bg-color-neutral-35`  | Setzt die Hintergrundfarbe (`background-color`) auf den Farbtoken „neutral-35“.  |
| `.lux-bg-color-neutral-40`  | Setzt die Hintergrundfarbe (`background-color`) auf den Farbtoken „neutral-40“.  |
| `.lux-bg-color-neutral-50`  | Setzt die Hintergrundfarbe (`background-color`) auf den Farbtoken „neutral-50“.  |
| `.lux-bg-color-neutral-60`  | Setzt die Hintergrundfarbe (`background-color`) auf den Farbtoken „neutral-60“.  |
| `.lux-bg-color-neutral-70`  | Setzt die Hintergrundfarbe (`background-color`) auf den Farbtoken „neutral-70“.  |
| `.lux-bg-color-neutral-80`  | Setzt die Hintergrundfarbe (`background-color`) auf den Farbtoken „neutral-80“.  |
| `.lux-bg-color-neutral-90`  | Setzt die Hintergrundfarbe (`background-color`) auf den Farbtoken „neutral-90“.  |
| `.lux-bg-color-neutral-95`  | Setzt die Hintergrundfarbe (`background-color`) auf den Farbtoken „neutral-95“.  |
| `.lux-bg-color-neutral-98`  | Setzt die Hintergrundfarbe (`background-color`) auf den Farbtoken „neutral-98“.  |
| `.lux-bg-color-neutral-99`  | Setzt die Hintergrundfarbe (`background-color`) auf den Farbtoken „neutral-99“.  |
| `.lux-bg-color-neutral-100` | Setzt die Hintergrundfarbe (`background-color`) auf den Farbtoken „neutral-100“. |
| `.lux-bg-color-warn-0`      | Setzt die Hintergrundfarbe (`background-color`) auf den Farbtoken „warn-0“.      |
| `.lux-bg-color-warn-10`     | Setzt die Hintergrundfarbe (`background-color`) auf den Farbtoken „warn-10“.     |
| `.lux-bg-color-warn-20`     | Setzt die Hintergrundfarbe (`background-color`) auf den Farbtoken „warn-20“.     |
| `.lux-bg-color-warn-25`     | Setzt die Hintergrundfarbe (`background-color`) auf den Farbtoken „warn-25“.     |
| `.lux-bg-color-warn-30`     | Setzt die Hintergrundfarbe (`background-color`) auf den Farbtoken „warn-30“.     |
| `.lux-bg-color-warn-35`     | Setzt die Hintergrundfarbe (`background-color`) auf den Farbtoken „warn-35“.     |
| `.lux-bg-color-warn-40`     | Setzt die Hintergrundfarbe (`background-color`) auf den Farbtoken „warn-40“.     |
| `.lux-bg-color-warn-50`     | Setzt die Hintergrundfarbe (`background-color`) auf den Farbtoken „warn-50“.     |
| `.lux-bg-color-warn-60`     | Setzt die Hintergrundfarbe (`background-color`) auf den Farbtoken „warn-60“.     |
| `.lux-bg-color-warn-70`     | Setzt die Hintergrundfarbe (`background-color`) auf den Farbtoken „warn-70“.     |
| `.lux-bg-color-warn-80`     | Setzt die Hintergrundfarbe (`background-color`) auf den Farbtoken „warn-80“.     |
| `.lux-bg-color-warn-90`     | Setzt die Hintergrundfarbe (`background-color`) auf den Farbtoken „warn-90“.     |
| `.lux-bg-color-warn-95`     | Setzt die Hintergrundfarbe (`background-color`) auf den Farbtoken „warn-95“.     |
| `.lux-bg-color-warn-98`     | Setzt die Hintergrundfarbe (`background-color`) auf den Farbtoken „warn-98“.     |
| `.lux-bg-color-warn-99`     | Setzt die Hintergrundfarbe (`background-color`) auf den Farbtoken „warn-99“.     |
| `.lux-bg-color-warn-100`    | Setzt die Hintergrundfarbe (`background-color`) auf den Farbtoken „warn-100“.    |
| `.lux-bg-color-red`         | Setzt die Hintergrundfarbe (`background-color`) auf den Farbtoken „red“.         |
| `.lux-bg-color-green`       | Setzt die Hintergrundfarbe (`background-color`) auf den Farbtoken „green“.       |
| `.lux-bg-color-purple`      | Setzt die Hintergrundfarbe (`background-color`) auf den Farbtoken „purple“.      |
| `.lux-bg-color-blue`        | Setzt die Hintergrundfarbe (`background-color`) auf den Farbtoken „blue“.        |
| `.lux-bg-color-gray`        | Setzt die Hintergrundfarbe (`background-color`) auf den Farbtoken „gray“.        |
| `.lux-bg-color-orange`      | Setzt die Hintergrundfarbe (`background-color`) auf den Farbtoken „orange“.      |
| `.lux-bg-color-black`       | Setzt die Hintergrundfarbe (`background-color`) auf den Farbtoken „black“.       |
| `.lux-bg-color-white`       | Setzt die Hintergrundfarbe (`background-color`) auf den Farbtoken „white“.       |
| `.lux-bg-color-yellow`      | Setzt die Hintergrundfarbe (`background-color`) auf den Farbtoken „yellow“.      |
| `.lux-bg-color-pink`        | Setzt die Hintergrundfarbe (`background-color`) auf den Farbtoken „pink“.        |
| `.lux-bg-color-lightblue`   | Setzt die Hintergrundfarbe (`background-color`) auf den Farbtoken „lightblue“.   |

### Rahmenfarbe

| CSS-Klasse                      | Beschreibung                                                            |
| ------------------------------- | ----------------------------------------------------------------------- |
| `.lux-border-color-primary-0`   | Setzt die Rahmenfarbe (`border-color`) auf den Farbtoken „primary-0“.   |
| `.lux-border-color-primary-10`  | Setzt die Rahmenfarbe (`border-color`) auf den Farbtoken „primary-10“.  |
| `.lux-border-color-primary-20`  | Setzt die Rahmenfarbe (`border-color`) auf den Farbtoken „primary-20“.  |
| `.lux-border-color-primary-25`  | Setzt die Rahmenfarbe (`border-color`) auf den Farbtoken „primary-25“.  |
| `.lux-border-color-primary-30`  | Setzt die Rahmenfarbe (`border-color`) auf den Farbtoken „primary-30“.  |
| `.lux-border-color-primary-35`  | Setzt die Rahmenfarbe (`border-color`) auf den Farbtoken „primary-35“.  |
| `.lux-border-color-primary-40`  | Setzt die Rahmenfarbe (`border-color`) auf den Farbtoken „primary-40“.  |
| `.lux-border-color-primary-50`  | Setzt die Rahmenfarbe (`border-color`) auf den Farbtoken „primary-50“.  |
| `.lux-border-color-primary-60`  | Setzt die Rahmenfarbe (`border-color`) auf den Farbtoken „primary-60“.  |
| `.lux-border-color-primary-70`  | Setzt die Rahmenfarbe (`border-color`) auf den Farbtoken „primary-70“.  |
| `.lux-border-color-primary-80`  | Setzt die Rahmenfarbe (`border-color`) auf den Farbtoken „primary-80“.  |
| `.lux-border-color-primary-90`  | Setzt die Rahmenfarbe (`border-color`) auf den Farbtoken „primary-90“.  |
| `.lux-border-color-primary-95`  | Setzt die Rahmenfarbe (`border-color`) auf den Farbtoken „primary-95“.  |
| `.lux-border-color-primary-98`  | Setzt die Rahmenfarbe (`border-color`) auf den Farbtoken „primary-98“.  |
| `.lux-border-color-primary-99`  | Setzt die Rahmenfarbe (`border-color`) auf den Farbtoken „primary-99“.  |
| `.lux-border-color-primary-100` | Setzt die Rahmenfarbe (`border-color`) auf den Farbtoken „primary-100“. |
| `.lux-border-color-accent-0`    | Setzt die Rahmenfarbe (`border-color`) auf den Farbtoken „accent-0“.    |
| `.lux-border-color-accent-10`   | Setzt die Rahmenfarbe (`border-color`) auf den Farbtoken „accent-10“.   |
| `.lux-border-color-accent-20`   | Setzt die Rahmenfarbe (`border-color`) auf den Farbtoken „accent-20“.   |
| `.lux-border-color-accent-25`   | Setzt die Rahmenfarbe (`border-color`) auf den Farbtoken „accent-25“.   |
| `.lux-border-color-accent-30`   | Setzt die Rahmenfarbe (`border-color`) auf den Farbtoken „accent-30“.   |
| `.lux-border-color-accent-35`   | Setzt die Rahmenfarbe (`border-color`) auf den Farbtoken „accent-35“.   |
| `.lux-border-color-accent-40`   | Setzt die Rahmenfarbe (`border-color`) auf den Farbtoken „accent-40“.   |
| `.lux-border-color-accent-50`   | Setzt die Rahmenfarbe (`border-color`) auf den Farbtoken „accent-50“.   |
| `.lux-border-color-accent-60`   | Setzt die Rahmenfarbe (`border-color`) auf den Farbtoken „accent-60“.   |
| `.lux-border-color-accent-70`   | Setzt die Rahmenfarbe (`border-color`) auf den Farbtoken „accent-70“.   |
| `.lux-border-color-accent-80`   | Setzt die Rahmenfarbe (`border-color`) auf den Farbtoken „accent-80“.   |
| `.lux-border-color-accent-90`   | Setzt die Rahmenfarbe (`border-color`) auf den Farbtoken „accent-90“.   |
| `.lux-border-color-accent-95`   | Setzt die Rahmenfarbe (`border-color`) auf den Farbtoken „accent-95“.   |
| `.lux-border-color-accent-98`   | Setzt die Rahmenfarbe (`border-color`) auf den Farbtoken „accent-98“.   |
| `.lux-border-color-accent-99`   | Setzt die Rahmenfarbe (`border-color`) auf den Farbtoken „accent-99“.   |
| `.lux-border-color-accent-100`  | Setzt die Rahmenfarbe (`border-color`) auf den Farbtoken „accent-100“.  |
| `.lux-border-color-neutral-0`   | Setzt die Rahmenfarbe (`border-color`) auf den Farbtoken „neutral-0“.   |
| `.lux-border-color-neutral-10`  | Setzt die Rahmenfarbe (`border-color`) auf den Farbtoken „neutral-10“.  |
| `.lux-border-color-neutral-20`  | Setzt die Rahmenfarbe (`border-color`) auf den Farbtoken „neutral-20“.  |
| `.lux-border-color-neutral-25`  | Setzt die Rahmenfarbe (`border-color`) auf den Farbtoken „neutral-25“.  |
| `.lux-border-color-neutral-30`  | Setzt die Rahmenfarbe (`border-color`) auf den Farbtoken „neutral-30“.  |
| `.lux-border-color-neutral-35`  | Setzt die Rahmenfarbe (`border-color`) auf den Farbtoken „neutral-35“.  |
| `.lux-border-color-neutral-40`  | Setzt die Rahmenfarbe (`border-color`) auf den Farbtoken „neutral-40“.  |
| `.lux-border-color-neutral-50`  | Setzt die Rahmenfarbe (`border-color`) auf den Farbtoken „neutral-50“.  |
| `.lux-border-color-neutral-60`  | Setzt die Rahmenfarbe (`border-color`) auf den Farbtoken „neutral-60“.  |
| `.lux-border-color-neutral-70`  | Setzt die Rahmenfarbe (`border-color`) auf den Farbtoken „neutral-70“.  |
| `.lux-border-color-neutral-80`  | Setzt die Rahmenfarbe (`border-color`) auf den Farbtoken „neutral-80“.  |
| `.lux-border-color-neutral-90`  | Setzt die Rahmenfarbe (`border-color`) auf den Farbtoken „neutral-90“.  |
| `.lux-border-color-neutral-95`  | Setzt die Rahmenfarbe (`border-color`) auf den Farbtoken „neutral-95“.  |
| `.lux-border-color-neutral-98`  | Setzt die Rahmenfarbe (`border-color`) auf den Farbtoken „neutral-98“.  |
| `.lux-border-color-neutral-99`  | Setzt die Rahmenfarbe (`border-color`) auf den Farbtoken „neutral-99“.  |
| `.lux-border-color-neutral-100` | Setzt die Rahmenfarbe (`border-color`) auf den Farbtoken „neutral-100“. |
| `.lux-border-color-warn-0`      | Setzt die Rahmenfarbe (`border-color`) auf den Farbtoken „warn-0“.      |
| `.lux-border-color-warn-10`     | Setzt die Rahmenfarbe (`border-color`) auf den Farbtoken „warn-10“.     |
| `.lux-border-color-warn-20`     | Setzt die Rahmenfarbe (`border-color`) auf den Farbtoken „warn-20“.     |
| `.lux-border-color-warn-25`     | Setzt die Rahmenfarbe (`border-color`) auf den Farbtoken „warn-25“.     |
| `.lux-border-color-warn-30`     | Setzt die Rahmenfarbe (`border-color`) auf den Farbtoken „warn-30“.     |
| `.lux-border-color-warn-35`     | Setzt die Rahmenfarbe (`border-color`) auf den Farbtoken „warn-35“.     |
| `.lux-border-color-warn-40`     | Setzt die Rahmenfarbe (`border-color`) auf den Farbtoken „warn-40“.     |
| `.lux-border-color-warn-50`     | Setzt die Rahmenfarbe (`border-color`) auf den Farbtoken „warn-50“.     |
| `.lux-border-color-warn-60`     | Setzt die Rahmenfarbe (`border-color`) auf den Farbtoken „warn-60“.     |
| `.lux-border-color-warn-70`     | Setzt die Rahmenfarbe (`border-color`) auf den Farbtoken „warn-70“.     |
| `.lux-border-color-warn-80`     | Setzt die Rahmenfarbe (`border-color`) auf den Farbtoken „warn-80“.     |
| `.lux-border-color-warn-90`     | Setzt die Rahmenfarbe (`border-color`) auf den Farbtoken „warn-90“.     |
| `.lux-border-color-warn-95`     | Setzt die Rahmenfarbe (`border-color`) auf den Farbtoken „warn-95“.     |
| `.lux-border-color-warn-98`     | Setzt die Rahmenfarbe (`border-color`) auf den Farbtoken „warn-98“.     |
| `.lux-border-color-warn-99`     | Setzt die Rahmenfarbe (`border-color`) auf den Farbtoken „warn-99“.     |
| `.lux-border-color-warn-100`    | Setzt die Rahmenfarbe (`border-color`) auf den Farbtoken „warn-100“.    |

### Outline-Farbe

| CSS-Klasse                       | Beschreibung                                                               |
| -------------------------------- | -------------------------------------------------------------------------- |
| `.lux-outline-color-primary-0`   | Setzt die Outline-Farbe (`outline-color`) auf den Farbtoken „primary-0“.   |
| `.lux-outline-color-primary-10`  | Setzt die Outline-Farbe (`outline-color`) auf den Farbtoken „primary-10“.  |
| `.lux-outline-color-primary-20`  | Setzt die Outline-Farbe (`outline-color`) auf den Farbtoken „primary-20“.  |
| `.lux-outline-color-primary-25`  | Setzt die Outline-Farbe (`outline-color`) auf den Farbtoken „primary-25“.  |
| `.lux-outline-color-primary-30`  | Setzt die Outline-Farbe (`outline-color`) auf den Farbtoken „primary-30“.  |
| `.lux-outline-color-primary-35`  | Setzt die Outline-Farbe (`outline-color`) auf den Farbtoken „primary-35“.  |
| `.lux-outline-color-primary-40`  | Setzt die Outline-Farbe (`outline-color`) auf den Farbtoken „primary-40“.  |
| `.lux-outline-color-primary-50`  | Setzt die Outline-Farbe (`outline-color`) auf den Farbtoken „primary-50“.  |
| `.lux-outline-color-primary-60`  | Setzt die Outline-Farbe (`outline-color`) auf den Farbtoken „primary-60“.  |
| `.lux-outline-color-primary-70`  | Setzt die Outline-Farbe (`outline-color`) auf den Farbtoken „primary-70“.  |
| `.lux-outline-color-primary-80`  | Setzt die Outline-Farbe (`outline-color`) auf den Farbtoken „primary-80“.  |
| `.lux-outline-color-primary-90`  | Setzt die Outline-Farbe (`outline-color`) auf den Farbtoken „primary-90“.  |
| `.lux-outline-color-primary-95`  | Setzt die Outline-Farbe (`outline-color`) auf den Farbtoken „primary-95“.  |
| `.lux-outline-color-primary-98`  | Setzt die Outline-Farbe (`outline-color`) auf den Farbtoken „primary-98“.  |
| `.lux-outline-color-primary-99`  | Setzt die Outline-Farbe (`outline-color`) auf den Farbtoken „primary-99“.  |
| `.lux-outline-color-primary-100` | Setzt die Outline-Farbe (`outline-color`) auf den Farbtoken „primary-100“. |
| `.lux-outline-color-accent-0`    | Setzt die Outline-Farbe (`outline-color`) auf den Farbtoken „accent-0“.    |
| `.lux-outline-color-accent-10`   | Setzt die Outline-Farbe (`outline-color`) auf den Farbtoken „accent-10“.   |
| `.lux-outline-color-accent-20`   | Setzt die Outline-Farbe (`outline-color`) auf den Farbtoken „accent-20“.   |
| `.lux-outline-color-accent-25`   | Setzt die Outline-Farbe (`outline-color`) auf den Farbtoken „accent-25“.   |
| `.lux-outline-color-accent-30`   | Setzt die Outline-Farbe (`outline-color`) auf den Farbtoken „accent-30“.   |
| `.lux-outline-color-accent-35`   | Setzt die Outline-Farbe (`outline-color`) auf den Farbtoken „accent-35“.   |
| `.lux-outline-color-accent-40`   | Setzt die Outline-Farbe (`outline-color`) auf den Farbtoken „accent-40“.   |
| `.lux-outline-color-accent-50`   | Setzt die Outline-Farbe (`outline-color`) auf den Farbtoken „accent-50“.   |
| `.lux-outline-color-accent-60`   | Setzt die Outline-Farbe (`outline-color`) auf den Farbtoken „accent-60“.   |
| `.lux-outline-color-accent-70`   | Setzt die Outline-Farbe (`outline-color`) auf den Farbtoken „accent-70“.   |
| `.lux-outline-color-accent-80`   | Setzt die Outline-Farbe (`outline-color`) auf den Farbtoken „accent-80“.   |
| `.lux-outline-color-accent-90`   | Setzt die Outline-Farbe (`outline-color`) auf den Farbtoken „accent-90“.   |
| `.lux-outline-color-accent-95`   | Setzt die Outline-Farbe (`outline-color`) auf den Farbtoken „accent-95“.   |
| `.lux-outline-color-accent-98`   | Setzt die Outline-Farbe (`outline-color`) auf den Farbtoken „accent-98“.   |
| `.lux-outline-color-accent-99`   | Setzt die Outline-Farbe (`outline-color`) auf den Farbtoken „accent-99“.   |
| `.lux-outline-color-accent-100`  | Setzt die Outline-Farbe (`outline-color`) auf den Farbtoken „accent-100“.  |
| `.lux-outline-color-neutral-0`   | Setzt die Outline-Farbe (`outline-color`) auf den Farbtoken „neutral-0“.   |
| `.lux-outline-color-neutral-10`  | Setzt die Outline-Farbe (`outline-color`) auf den Farbtoken „neutral-10“.  |
| `.lux-outline-color-neutral-20`  | Setzt die Outline-Farbe (`outline-color`) auf den Farbtoken „neutral-20“.  |
| `.lux-outline-color-neutral-25`  | Setzt die Outline-Farbe (`outline-color`) auf den Farbtoken „neutral-25“.  |
| `.lux-outline-color-neutral-30`  | Setzt die Outline-Farbe (`outline-color`) auf den Farbtoken „neutral-30“.  |
| `.lux-outline-color-neutral-35`  | Setzt die Outline-Farbe (`outline-color`) auf den Farbtoken „neutral-35“.  |
| `.lux-outline-color-neutral-40`  | Setzt die Outline-Farbe (`outline-color`) auf den Farbtoken „neutral-40“.  |
| `.lux-outline-color-neutral-50`  | Setzt die Outline-Farbe (`outline-color`) auf den Farbtoken „neutral-50“.  |
| `.lux-outline-color-neutral-60`  | Setzt die Outline-Farbe (`outline-color`) auf den Farbtoken „neutral-60“.  |
| `.lux-outline-color-neutral-70`  | Setzt die Outline-Farbe (`outline-color`) auf den Farbtoken „neutral-70“.  |
| `.lux-outline-color-neutral-80`  | Setzt die Outline-Farbe (`outline-color`) auf den Farbtoken „neutral-80“.  |
| `.lux-outline-color-neutral-90`  | Setzt die Outline-Farbe (`outline-color`) auf den Farbtoken „neutral-90“.  |
| `.lux-outline-color-neutral-95`  | Setzt die Outline-Farbe (`outline-color`) auf den Farbtoken „neutral-95“.  |
| `.lux-outline-color-neutral-98`  | Setzt die Outline-Farbe (`outline-color`) auf den Farbtoken „neutral-98“.  |
| `.lux-outline-color-neutral-99`  | Setzt die Outline-Farbe (`outline-color`) auf den Farbtoken „neutral-99“.  |
| `.lux-outline-color-neutral-100` | Setzt die Outline-Farbe (`outline-color`) auf den Farbtoken „neutral-100“. |
| `.lux-outline-color-warn-0`      | Setzt die Outline-Farbe (`outline-color`) auf den Farbtoken „warn-0“.      |
| `.lux-outline-color-warn-10`     | Setzt die Outline-Farbe (`outline-color`) auf den Farbtoken „warn-10“.     |
| `.lux-outline-color-warn-20`     | Setzt die Outline-Farbe (`outline-color`) auf den Farbtoken „warn-20“.     |
| `.lux-outline-color-warn-25`     | Setzt die Outline-Farbe (`outline-color`) auf den Farbtoken „warn-25“.     |
| `.lux-outline-color-warn-30`     | Setzt die Outline-Farbe (`outline-color`) auf den Farbtoken „warn-30“.     |
| `.lux-outline-color-warn-35`     | Setzt die Outline-Farbe (`outline-color`) auf den Farbtoken „warn-35“.     |
| `.lux-outline-color-warn-40`     | Setzt die Outline-Farbe (`outline-color`) auf den Farbtoken „warn-40“.     |
| `.lux-outline-color-warn-50`     | Setzt die Outline-Farbe (`outline-color`) auf den Farbtoken „warn-50“.     |
| `.lux-outline-color-warn-60`     | Setzt die Outline-Farbe (`outline-color`) auf den Farbtoken „warn-60“.     |
| `.lux-outline-color-warn-70`     | Setzt die Outline-Farbe (`outline-color`) auf den Farbtoken „warn-70“.     |
| `.lux-outline-color-warn-80`     | Setzt die Outline-Farbe (`outline-color`) auf den Farbtoken „warn-80“.     |
| `.lux-outline-color-warn-90`     | Setzt die Outline-Farbe (`outline-color`) auf den Farbtoken „warn-90“.     |
| `.lux-outline-color-warn-95`     | Setzt die Outline-Farbe (`outline-color`) auf den Farbtoken „warn-95“.     |
| `.lux-outline-color-warn-98`     | Setzt die Outline-Farbe (`outline-color`) auf den Farbtoken „warn-98“.     |
| `.lux-outline-color-warn-99`     | Setzt die Outline-Farbe (`outline-color`) auf den Farbtoken „warn-99“.     |
| `.lux-outline-color-warn-100`    | Setzt die Outline-Farbe (`outline-color`) auf den Farbtoken „warn-100“.    |
| `.lux-outline-color-light`       | Setzt die Outline-Farbe (`outline-color`) auf den Farbtoken „light“.       |
| `.lux-outline-color-dark`        | Setzt die Outline-Farbe (`outline-color`) auf den Farbtoken „dark“.        |

### Textdekorationsfarbe

| CSS-Klasse                               | Beschreibung                                                                                    |
| ---------------------------------------- | ----------------------------------------------------------------------------------------------- |
| `.lux-text-decoration-primary-color-0`   | Setzt die Textdekorationsfarbe (`text-decoration-color`) auf den Farbtoken „primary-color-0“.   |
| `.lux-text-decoration-primary-color-10`  | Setzt die Textdekorationsfarbe (`text-decoration-color`) auf den Farbtoken „primary-color-10“.  |
| `.lux-text-decoration-primary-color-20`  | Setzt die Textdekorationsfarbe (`text-decoration-color`) auf den Farbtoken „primary-color-20“.  |
| `.lux-text-decoration-primary-color-25`  | Setzt die Textdekorationsfarbe (`text-decoration-color`) auf den Farbtoken „primary-color-25“.  |
| `.lux-text-decoration-primary-color-30`  | Setzt die Textdekorationsfarbe (`text-decoration-color`) auf den Farbtoken „primary-color-30“.  |
| `.lux-text-decoration-primary-color-35`  | Setzt die Textdekorationsfarbe (`text-decoration-color`) auf den Farbtoken „primary-color-35“.  |
| `.lux-text-decoration-primary-color-40`  | Setzt die Textdekorationsfarbe (`text-decoration-color`) auf den Farbtoken „primary-color-40“.  |
| `.lux-text-decoration-primary-color-50`  | Setzt die Textdekorationsfarbe (`text-decoration-color`) auf den Farbtoken „primary-color-50“.  |
| `.lux-text-decoration-primary-color-60`  | Setzt die Textdekorationsfarbe (`text-decoration-color`) auf den Farbtoken „primary-color-60“.  |
| `.lux-text-decoration-primary-color-70`  | Setzt die Textdekorationsfarbe (`text-decoration-color`) auf den Farbtoken „primary-color-70“.  |
| `.lux-text-decoration-primary-color-80`  | Setzt die Textdekorationsfarbe (`text-decoration-color`) auf den Farbtoken „primary-color-80“.  |
| `.lux-text-decoration-primary-color-90`  | Setzt die Textdekorationsfarbe (`text-decoration-color`) auf den Farbtoken „primary-color-90“.  |
| `.lux-text-decoration-primary-color-95`  | Setzt die Textdekorationsfarbe (`text-decoration-color`) auf den Farbtoken „primary-color-95“.  |
| `.lux-text-decoration-primary-color-98`  | Setzt die Textdekorationsfarbe (`text-decoration-color`) auf den Farbtoken „primary-color-98“.  |
| `.lux-text-decoration-primary-color-99`  | Setzt die Textdekorationsfarbe (`text-decoration-color`) auf den Farbtoken „primary-color-99“.  |
| `.lux-text-decoration-primary-color-100` | Setzt die Textdekorationsfarbe (`text-decoration-color`) auf den Farbtoken „primary-color-100“. |
| `.lux-text-decoration-accent-color-0`    | Setzt die Textdekorationsfarbe (`text-decoration-color`) auf den Farbtoken „accent-color-0“.    |
| `.lux-text-decoration-accent-color-10`   | Setzt die Textdekorationsfarbe (`text-decoration-color`) auf den Farbtoken „accent-color-10“.   |
| `.lux-text-decoration-accent-color-20`   | Setzt die Textdekorationsfarbe (`text-decoration-color`) auf den Farbtoken „accent-color-20“.   |
| `.lux-text-decoration-accent-color-25`   | Setzt die Textdekorationsfarbe (`text-decoration-color`) auf den Farbtoken „accent-color-25“.   |
| `.lux-text-decoration-accent-color-30`   | Setzt die Textdekorationsfarbe (`text-decoration-color`) auf den Farbtoken „accent-color-30“.   |
| `.lux-text-decoration-accent-color-35`   | Setzt die Textdekorationsfarbe (`text-decoration-color`) auf den Farbtoken „accent-color-35“.   |
| `.lux-text-decoration-accent-color-40`   | Setzt die Textdekorationsfarbe (`text-decoration-color`) auf den Farbtoken „accent-color-40“.   |
| `.lux-text-decoration-accent-color-50`   | Setzt die Textdekorationsfarbe (`text-decoration-color`) auf den Farbtoken „accent-color-50“.   |
| `.lux-text-decoration-accent-color-60`   | Setzt die Textdekorationsfarbe (`text-decoration-color`) auf den Farbtoken „accent-color-60“.   |
| `.lux-text-decoration-accent-color-70`   | Setzt die Textdekorationsfarbe (`text-decoration-color`) auf den Farbtoken „accent-color-70“.   |
| `.lux-text-decoration-accent-color-80`   | Setzt die Textdekorationsfarbe (`text-decoration-color`) auf den Farbtoken „accent-color-80“.   |
| `.lux-text-decoration-accent-color-90`   | Setzt die Textdekorationsfarbe (`text-decoration-color`) auf den Farbtoken „accent-color-90“.   |
| `.lux-text-decoration-accent-color-95`   | Setzt die Textdekorationsfarbe (`text-decoration-color`) auf den Farbtoken „accent-color-95“.   |
| `.lux-text-decoration-accent-color-98`   | Setzt die Textdekorationsfarbe (`text-decoration-color`) auf den Farbtoken „accent-color-98“.   |
| `.lux-text-decoration-accent-color-99`   | Setzt die Textdekorationsfarbe (`text-decoration-color`) auf den Farbtoken „accent-color-99“.   |
| `.lux-text-decoration-accent-color-100`  | Setzt die Textdekorationsfarbe (`text-decoration-color`) auf den Farbtoken „accent-color-100“.  |
| `.lux-text-decoration-neutral-color-0`   | Setzt die Textdekorationsfarbe (`text-decoration-color`) auf den Farbtoken „neutral-color-0“.   |
| `.lux-text-decoration-neutral-color-10`  | Setzt die Textdekorationsfarbe (`text-decoration-color`) auf den Farbtoken „neutral-color-10“.  |
| `.lux-text-decoration-neutral-color-20`  | Setzt die Textdekorationsfarbe (`text-decoration-color`) auf den Farbtoken „neutral-color-20“.  |
| `.lux-text-decoration-neutral-color-25`  | Setzt die Textdekorationsfarbe (`text-decoration-color`) auf den Farbtoken „neutral-color-25“.  |
| `.lux-text-decoration-neutral-color-30`  | Setzt die Textdekorationsfarbe (`text-decoration-color`) auf den Farbtoken „neutral-color-30“.  |
| `.lux-text-decoration-neutral-color-35`  | Setzt die Textdekorationsfarbe (`text-decoration-color`) auf den Farbtoken „neutral-color-35“.  |
| `.lux-text-decoration-neutral-color-40`  | Setzt die Textdekorationsfarbe (`text-decoration-color`) auf den Farbtoken „neutral-color-40“.  |
| `.lux-text-decoration-neutral-color-50`  | Setzt die Textdekorationsfarbe (`text-decoration-color`) auf den Farbtoken „neutral-color-50“.  |
| `.lux-text-decoration-neutral-color-60`  | Setzt die Textdekorationsfarbe (`text-decoration-color`) auf den Farbtoken „neutral-color-60“.  |
| `.lux-text-decoration-neutral-color-70`  | Setzt die Textdekorationsfarbe (`text-decoration-color`) auf den Farbtoken „neutral-color-70“.  |
| `.lux-text-decoration-neutral-color-80`  | Setzt die Textdekorationsfarbe (`text-decoration-color`) auf den Farbtoken „neutral-color-80“.  |
| `.lux-text-decoration-neutral-color-90`  | Setzt die Textdekorationsfarbe (`text-decoration-color`) auf den Farbtoken „neutral-color-90“.  |
| `.lux-text-decoration-neutral-color-95`  | Setzt die Textdekorationsfarbe (`text-decoration-color`) auf den Farbtoken „neutral-color-95“.  |
| `.lux-text-decoration-neutral-color-98`  | Setzt die Textdekorationsfarbe (`text-decoration-color`) auf den Farbtoken „neutral-color-98“.  |
| `.lux-text-decoration-neutral-color-99`  | Setzt die Textdekorationsfarbe (`text-decoration-color`) auf den Farbtoken „neutral-color-99“.  |
| `.lux-text-decoration-neutral-color-100` | Setzt die Textdekorationsfarbe (`text-decoration-color`) auf den Farbtoken „neutral-color-100“. |
| `.lux-text-decoration-warn-color-0`      | Setzt die Textdekorationsfarbe (`text-decoration-color`) auf den Farbtoken „warn-color-0“.      |
| `.lux-text-decoration-warn-color-10`     | Setzt die Textdekorationsfarbe (`text-decoration-color`) auf den Farbtoken „warn-color-10“.     |
| `.lux-text-decoration-warn-color-20`     | Setzt die Textdekorationsfarbe (`text-decoration-color`) auf den Farbtoken „warn-color-20“.     |
| `.lux-text-decoration-warn-color-25`     | Setzt die Textdekorationsfarbe (`text-decoration-color`) auf den Farbtoken „warn-color-25“.     |
| `.lux-text-decoration-warn-color-30`     | Setzt die Textdekorationsfarbe (`text-decoration-color`) auf den Farbtoken „warn-color-30“.     |
| `.lux-text-decoration-warn-color-35`     | Setzt die Textdekorationsfarbe (`text-decoration-color`) auf den Farbtoken „warn-color-35“.     |
| `.lux-text-decoration-warn-color-40`     | Setzt die Textdekorationsfarbe (`text-decoration-color`) auf den Farbtoken „warn-color-40“.     |
| `.lux-text-decoration-warn-color-50`     | Setzt die Textdekorationsfarbe (`text-decoration-color`) auf den Farbtoken „warn-color-50“.     |
| `.lux-text-decoration-warn-color-60`     | Setzt die Textdekorationsfarbe (`text-decoration-color`) auf den Farbtoken „warn-color-60“.     |
| `.lux-text-decoration-warn-color-70`     | Setzt die Textdekorationsfarbe (`text-decoration-color`) auf den Farbtoken „warn-color-70“.     |
| `.lux-text-decoration-warn-color-80`     | Setzt die Textdekorationsfarbe (`text-decoration-color`) auf den Farbtoken „warn-color-80“.     |
| `.lux-text-decoration-warn-color-90`     | Setzt die Textdekorationsfarbe (`text-decoration-color`) auf den Farbtoken „warn-color-90“.     |
| `.lux-text-decoration-warn-color-95`     | Setzt die Textdekorationsfarbe (`text-decoration-color`) auf den Farbtoken „warn-color-95“.     |
| `.lux-text-decoration-warn-color-98`     | Setzt die Textdekorationsfarbe (`text-decoration-color`) auf den Farbtoken „warn-color-98“.     |
| `.lux-text-decoration-warn-color-99`     | Setzt die Textdekorationsfarbe (`text-decoration-color`) auf den Farbtoken „warn-color-99“.     |
| `.lux-text-decoration-warn-color-100`    | Setzt die Textdekorationsfarbe (`text-decoration-color`) auf den Farbtoken „warn-color-100“.    |

### Spaltentrennlinien-Farbe

| CSS-Klasse                           | Beschreibung                                                                              |
| ------------------------------------ | ----------------------------------------------------------------------------------------- |
| `.lux-column-rule-color-primary-0`   | Setzt die Spaltentrennlinien-Farbe (`column-rule-color`) auf den Farbtoken „primary-0“.   |
| `.lux-column-rule-color-primary-10`  | Setzt die Spaltentrennlinien-Farbe (`column-rule-color`) auf den Farbtoken „primary-10“.  |
| `.lux-column-rule-color-primary-20`  | Setzt die Spaltentrennlinien-Farbe (`column-rule-color`) auf den Farbtoken „primary-20“.  |
| `.lux-column-rule-color-primary-25`  | Setzt die Spaltentrennlinien-Farbe (`column-rule-color`) auf den Farbtoken „primary-25“.  |
| `.lux-column-rule-color-primary-30`  | Setzt die Spaltentrennlinien-Farbe (`column-rule-color`) auf den Farbtoken „primary-30“.  |
| `.lux-column-rule-color-primary-35`  | Setzt die Spaltentrennlinien-Farbe (`column-rule-color`) auf den Farbtoken „primary-35“.  |
| `.lux-column-rule-color-primary-40`  | Setzt die Spaltentrennlinien-Farbe (`column-rule-color`) auf den Farbtoken „primary-40“.  |
| `.lux-column-rule-color-primary-50`  | Setzt die Spaltentrennlinien-Farbe (`column-rule-color`) auf den Farbtoken „primary-50“.  |
| `.lux-column-rule-color-primary-60`  | Setzt die Spaltentrennlinien-Farbe (`column-rule-color`) auf den Farbtoken „primary-60“.  |
| `.lux-column-rule-color-primary-70`  | Setzt die Spaltentrennlinien-Farbe (`column-rule-color`) auf den Farbtoken „primary-70“.  |
| `.lux-column-rule-color-primary-80`  | Setzt die Spaltentrennlinien-Farbe (`column-rule-color`) auf den Farbtoken „primary-80“.  |
| `.lux-column-rule-color-primary-90`  | Setzt die Spaltentrennlinien-Farbe (`column-rule-color`) auf den Farbtoken „primary-90“.  |
| `.lux-column-rule-color-primary-95`  | Setzt die Spaltentrennlinien-Farbe (`column-rule-color`) auf den Farbtoken „primary-95“.  |
| `.lux-column-rule-color-primary-98`  | Setzt die Spaltentrennlinien-Farbe (`column-rule-color`) auf den Farbtoken „primary-98“.  |
| `.lux-column-rule-color-primary-99`  | Setzt die Spaltentrennlinien-Farbe (`column-rule-color`) auf den Farbtoken „primary-99“.  |
| `.lux-column-rule-color-primary-100` | Setzt die Spaltentrennlinien-Farbe (`column-rule-color`) auf den Farbtoken „primary-100“. |
| `.lux-column-rule-color-accent-0`    | Setzt die Spaltentrennlinien-Farbe (`column-rule-color`) auf den Farbtoken „accent-0“.    |
| `.lux-column-rule-color-accent-10`   | Setzt die Spaltentrennlinien-Farbe (`column-rule-color`) auf den Farbtoken „accent-10“.   |
| `.lux-column-rule-color-accent-20`   | Setzt die Spaltentrennlinien-Farbe (`column-rule-color`) auf den Farbtoken „accent-20“.   |
| `.lux-column-rule-color-accent-25`   | Setzt die Spaltentrennlinien-Farbe (`column-rule-color`) auf den Farbtoken „accent-25“.   |
| `.lux-column-rule-color-accent-30`   | Setzt die Spaltentrennlinien-Farbe (`column-rule-color`) auf den Farbtoken „accent-30“.   |
| `.lux-column-rule-color-accent-35`   | Setzt die Spaltentrennlinien-Farbe (`column-rule-color`) auf den Farbtoken „accent-35“.   |
| `.lux-column-rule-color-accent-40`   | Setzt die Spaltentrennlinien-Farbe (`column-rule-color`) auf den Farbtoken „accent-40“.   |
| `.lux-column-rule-color-accent-50`   | Setzt die Spaltentrennlinien-Farbe (`column-rule-color`) auf den Farbtoken „accent-50“.   |
| `.lux-column-rule-color-accent-60`   | Setzt die Spaltentrennlinien-Farbe (`column-rule-color`) auf den Farbtoken „accent-60“.   |
| `.lux-column-rule-color-accent-70`   | Setzt die Spaltentrennlinien-Farbe (`column-rule-color`) auf den Farbtoken „accent-70“.   |
| `.lux-column-rule-color-accent-80`   | Setzt die Spaltentrennlinien-Farbe (`column-rule-color`) auf den Farbtoken „accent-80“.   |
| `.lux-column-rule-color-accent-90`   | Setzt die Spaltentrennlinien-Farbe (`column-rule-color`) auf den Farbtoken „accent-90“.   |
| `.lux-column-rule-color-accent-95`   | Setzt die Spaltentrennlinien-Farbe (`column-rule-color`) auf den Farbtoken „accent-95“.   |
| `.lux-column-rule-color-accent-98`   | Setzt die Spaltentrennlinien-Farbe (`column-rule-color`) auf den Farbtoken „accent-98“.   |
| `.lux-column-rule-color-accent-99`   | Setzt die Spaltentrennlinien-Farbe (`column-rule-color`) auf den Farbtoken „accent-99“.   |
| `.lux-column-rule-color-accent-100`  | Setzt die Spaltentrennlinien-Farbe (`column-rule-color`) auf den Farbtoken „accent-100“.  |
| `.lux-column-rule-color-neutral-0`   | Setzt die Spaltentrennlinien-Farbe (`column-rule-color`) auf den Farbtoken „neutral-0“.   |
| `.lux-column-rule-color-neutral-10`  | Setzt die Spaltentrennlinien-Farbe (`column-rule-color`) auf den Farbtoken „neutral-10“.  |
| `.lux-column-rule-color-neutral-20`  | Setzt die Spaltentrennlinien-Farbe (`column-rule-color`) auf den Farbtoken „neutral-20“.  |
| `.lux-column-rule-color-neutral-25`  | Setzt die Spaltentrennlinien-Farbe (`column-rule-color`) auf den Farbtoken „neutral-25“.  |
| `.lux-column-rule-color-neutral-30`  | Setzt die Spaltentrennlinien-Farbe (`column-rule-color`) auf den Farbtoken „neutral-30“.  |
| `.lux-column-rule-color-neutral-35`  | Setzt die Spaltentrennlinien-Farbe (`column-rule-color`) auf den Farbtoken „neutral-35“.  |
| `.lux-column-rule-color-neutral-40`  | Setzt die Spaltentrennlinien-Farbe (`column-rule-color`) auf den Farbtoken „neutral-40“.  |
| `.lux-column-rule-color-neutral-50`  | Setzt die Spaltentrennlinien-Farbe (`column-rule-color`) auf den Farbtoken „neutral-50“.  |
| `.lux-column-rule-color-neutral-60`  | Setzt die Spaltentrennlinien-Farbe (`column-rule-color`) auf den Farbtoken „neutral-60“.  |
| `.lux-column-rule-color-neutral-70`  | Setzt die Spaltentrennlinien-Farbe (`column-rule-color`) auf den Farbtoken „neutral-70“.  |
| `.lux-column-rule-color-neutral-80`  | Setzt die Spaltentrennlinien-Farbe (`column-rule-color`) auf den Farbtoken „neutral-80“.  |
| `.lux-column-rule-color-neutral-90`  | Setzt die Spaltentrennlinien-Farbe (`column-rule-color`) auf den Farbtoken „neutral-90“.  |
| `.lux-column-rule-color-neutral-95`  | Setzt die Spaltentrennlinien-Farbe (`column-rule-color`) auf den Farbtoken „neutral-95“.  |
| `.lux-column-rule-color-neutral-98`  | Setzt die Spaltentrennlinien-Farbe (`column-rule-color`) auf den Farbtoken „neutral-98“.  |
| `.lux-column-rule-color-neutral-99`  | Setzt die Spaltentrennlinien-Farbe (`column-rule-color`) auf den Farbtoken „neutral-99“.  |
| `.lux-column-rule-color-neutral-100` | Setzt die Spaltentrennlinien-Farbe (`column-rule-color`) auf den Farbtoken „neutral-100“. |
| `.lux-column-rule-color-warn-0`      | Setzt die Spaltentrennlinien-Farbe (`column-rule-color`) auf den Farbtoken „warn-0“.      |
| `.lux-column-rule-color-warn-10`     | Setzt die Spaltentrennlinien-Farbe (`column-rule-color`) auf den Farbtoken „warn-10“.     |
| `.lux-column-rule-color-warn-20`     | Setzt die Spaltentrennlinien-Farbe (`column-rule-color`) auf den Farbtoken „warn-20“.     |
| `.lux-column-rule-color-warn-25`     | Setzt die Spaltentrennlinien-Farbe (`column-rule-color`) auf den Farbtoken „warn-25“.     |
| `.lux-column-rule-color-warn-30`     | Setzt die Spaltentrennlinien-Farbe (`column-rule-color`) auf den Farbtoken „warn-30“.     |
| `.lux-column-rule-color-warn-35`     | Setzt die Spaltentrennlinien-Farbe (`column-rule-color`) auf den Farbtoken „warn-35“.     |
| `.lux-column-rule-color-warn-40`     | Setzt die Spaltentrennlinien-Farbe (`column-rule-color`) auf den Farbtoken „warn-40“.     |
| `.lux-column-rule-color-warn-50`     | Setzt die Spaltentrennlinien-Farbe (`column-rule-color`) auf den Farbtoken „warn-50“.     |
| `.lux-column-rule-color-warn-60`     | Setzt die Spaltentrennlinien-Farbe (`column-rule-color`) auf den Farbtoken „warn-60“.     |
| `.lux-column-rule-color-warn-70`     | Setzt die Spaltentrennlinien-Farbe (`column-rule-color`) auf den Farbtoken „warn-70“.     |
| `.lux-column-rule-color-warn-80`     | Setzt die Spaltentrennlinien-Farbe (`column-rule-color`) auf den Farbtoken „warn-80“.     |
| `.lux-column-rule-color-warn-90`     | Setzt die Spaltentrennlinien-Farbe (`column-rule-color`) auf den Farbtoken „warn-90“.     |
| `.lux-column-rule-color-warn-95`     | Setzt die Spaltentrennlinien-Farbe (`column-rule-color`) auf den Farbtoken „warn-95“.     |
| `.lux-column-rule-color-warn-98`     | Setzt die Spaltentrennlinien-Farbe (`column-rule-color`) auf den Farbtoken „warn-98“.     |
| `.lux-column-rule-color-warn-99`     | Setzt die Spaltentrennlinien-Farbe (`column-rule-color`) auf den Farbtoken „warn-99“.     |
| `.lux-column-rule-color-warn-100`    | Setzt die Spaltentrennlinien-Farbe (`column-rule-color`) auf den Farbtoken „warn-100“.    |

### Sonstiges

| CSS-Klasse                           | Beschreibung                                                                                                                                                                            |
| ------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `.lux-h1`                            | Utility-Klasse mit folgenden Deklarationen: font-family: var(--lux-theme-app-headline-font), font-size: 2rem, font-weight: 500.                                                         |
| `.lux-h2`                            | Utility-Klasse mit folgenden Deklarationen: font-family: var(--lux-theme-app-headline-font), font-size: 1.5rem, font-weight: 500.                                                       |
| `.lux-h3`                            | Utility-Klasse mit folgenden Deklarationen: font-family: var(--lux-theme-app-headline-font), font-size: 1.25rem, font-weight: 500.                                                      |
| `.lux-h4`                            | Utility-Klasse mit folgenden Deklarationen: font-family: var(--lux-theme-app-headline-font), font-size: 1rem, font-weight: 500.                                                         |
| `.lux-h5`                            | Utility-Klasse mit folgenden Deklarationen: font-family: var(--lux-theme-app-headline-font), font-size: 0.875rem, font-weight: 700.                                                     |
| `.lux-h6`                            | Utility-Klasse mit folgenden Deklarationen: font-family: var(--lux-theme-app-headline-font), font-size: 0.75rem, font-weight: 700.                                                      |
| `.lux-disabled`                      | Utility-Klasse mit folgenden Deklarationen: color: var(--lux-theme-dark-disabled-text), cursor: text, text-decoration: none.                                                            |
| `.lux-selected-bg`                   | Utility-Klasse mit folgenden Deklarationen: background-color: var(--lux-theme-selected-bg-color).                                                                                       |
| `.lux-hover-bg`                      | Utility-Klasse mit folgenden Deklarationen: background-color: var(--lux-theme-hover-color).                                                                                             |
| `.lux-hover-dark-bg`                 | Utility-Klasse mit folgenden Deklarationen: background-color: var(--lux-theme-hover-color) -for-dark-background.                                                                        |
| `.lux-gradient-bg`                   | Utility-Klasse mit folgenden Deklarationen: background-color: #fff, background-image: var(--lux-theme-app-gradient).                                                                    |
| `.lux-outline-width`                 | Utility-Klasse mit folgenden Deklarationen: outline-width: var(--lux-theme-outline-width).                                                                                              |
| `.lux-outline-style`                 | Utility-Klasse mit folgenden Deklarationen: outline-style: var(--lux-theme-outline-style).                                                                                              |
| `.lux-outline-light`                 | Utility-Klasse mit folgenden Deklarationen: color: var(--lux-theme-outline-color-bright), outline-width: var(--lux-theme-outline-width), outline-style: var(--lux-theme-outline-style). |
| `.lux-outline-dark`                  | Utility-Klasse mit folgenden Deklarationen: color: var(--lux-theme-outline-color-dark), outline-width: var(--lux-theme-outline-width), outline-style: var(--lux-theme-outline-style).   |
| `.lux-card-grow`                     | Utility-Klasse mit folgenden Deklarationen: display: flex, flex: 1 1 auto, width: 400px.                                                                                                |
| `.lux-crop`                          | Utility-Klasse mit folgenden Deklarationen: overflow: hidden, white-space: nowrap, text-overflow: ellipsis.                                                                             |
| `.lux-crop-2-lines`                  | Utility-Klasse mit folgenden Deklarationen: overflow: hidden, white-space: normal, word-wrap: break-word.                                                                               |
| `.lux-label`                         | Utility-Klasse mit folgenden Deklarationen: color: var(--lux-theme-dark-secondary-text), font-size: 0.75rem.                                                                            |
| `.lux-hint`                          | Utility-Klasse mit folgenden Deklarationen: color: var(--lux-theme-dark-secondary-text), font-size: 0.75rem.                                                                            |
| `.lux-sr-only`                       | Utility-Klasse mit folgenden Deklarationen: position: absolute, left: -10000px, top: auto.                                                                                              |
| `.lux-border-box`                    | Utility-Klasse mit folgenden Deklarationen: box-sizing: border-box.                                                                                                                     |
| `.lux-content-box`                   | Utility-Klasse mit folgenden Deklarationen: box-sizing: content-box.                                                                                                                    |
| `.lux-nowrap`                        | Utility-Klasse mit folgenden Deklarationen: white-space: nowrap.                                                                                                                        |
| `.lux-cursor`                        | Utility-Klasse mit folgenden Deklarationen: cursor: pointer.                                                                                                                            |
| `.lux-block-pointer-events`          | Utility-Klasse mit folgenden Deklarationen: pointer-events: none.                                                                                                                       |
| `.lux-vertical-align-baseline`       | Utility-Klasse mit folgenden Deklarationen: vertical-align: baseline !important.                                                                                                        |
| `.lux-black-semi-transparent`        | Utility-Klasse mit folgenden Deklarationen: color: var(--lux-theme-dark-primary-text).                                                                                                  |
| `.lux-semi-transparent`              | Utility-Klasse mit folgenden Deklarationen: opacity: 0.6.                                                                                                                               |
| `.lux-overflow-wrap-break-word`      | Utility-Klasse mit folgenden Deklarationen: overflow-wrap: break-word.                                                                                                                  |
| `.lux-bold`                          | Utility-Klasse mit folgenden Deklarationen: font-weight: bold !important.                                                                                                               |
| `.lux-uppercase`                     | Utility-Klasse mit folgenden Deklarationen: text-transform: uppercase !important.                                                                                                       |
| `.lux-lowercase`                     | Utility-Klasse mit folgenden Deklarationen: text-transform: lowercase !important.                                                                                                       |
| `.lux-hyphenate`                     | Utility-Klasse mit folgenden Deklarationen: overflow-wrap: break-word, word-wrap: break-word, word-break: normal.                                                                       |
| `.lux-font-color-red`                | Utility-Klasse mit folgenden Deklarationen: color: var(--lux-theme-custom-on-red).                                                                                                      |
| `.lux-font-color-green`              | Utility-Klasse mit folgenden Deklarationen: color: var(--lux-theme-custom-on-green).                                                                                                    |
| `.lux-font-color-purple`             | Utility-Klasse mit folgenden Deklarationen: color: var(--lux-theme-custom-on-purple).                                                                                                   |
| `.lux-font-color-blue`               | Utility-Klasse mit folgenden Deklarationen: color: var(--lux-theme-custom-on-blue).                                                                                                     |
| `.lux-font-color-gray`               | Utility-Klasse mit folgenden Deklarationen: color: var(--lux-theme-custom-on-gray).                                                                                                     |
| `.lux-font-color-orange`             | Utility-Klasse mit folgenden Deklarationen: color: var(--lux-theme-custom-on-orange).                                                                                                   |
| `.lux-font-color-black`              | Utility-Klasse mit folgenden Deklarationen: color: var(--lux-theme-custom-on-black).                                                                                                    |
| `.lux-font-color-white`              | Utility-Klasse mit folgenden Deklarationen: color: var(--lux-theme-custom-on-white).                                                                                                    |
| `.lux-font-color-yellow`             | Utility-Klasse mit folgenden Deklarationen: color: var(--lux-theme-custom-on-yellow).                                                                                                   |
| `.lux-font-color-pink`               | Utility-Klasse mit folgenden Deklarationen: color: var(--lux-theme-custom-on-pink).                                                                                                     |
| `.lux-font-color-lightblue`          | Utility-Klasse mit folgenden Deklarationen: color: var(--lux-theme-custom-on-lightblue).                                                                                                |
| `.lux-text-highlight-primary`        | Utility-Klasse mit folgenden Deklarationen: color: var(--mat-sys-on-primary-container), background-color: var(--mat-sys-primary-container).                                             |
| `.lux-text-highlight-primary-strong` | Utility-Klasse mit folgenden Deklarationen: color: var(--lux-theme-dark-primary-text), background-color: var(--lux-theme-primary-70).                                                   |
| `.lux-text-highlight-success`        | Utility-Klasse mit folgenden Deklarationen: color: var(--mat-sys-on-tertiary-container), background-color: var(--mat-sys-tertiary-container).                                           |
| `.lux-text-highlight-success-strong` | Utility-Klasse mit folgenden Deklarationen: color: #1c1b1b, background-color: #56bd66.                                                                                                  |
| `.lux-text-highlight-alert`          | Utility-Klasse mit folgenden Deklarationen: color: #1c1b1b, background-color: #fdedab.                                                                                                  |
| `.lux-text-highlight-alert-strong`   | Utility-Klasse mit folgenden Deklarationen: color: var(--lux-theme-custom-on-yellow), background-color: var(--lux-theme-custom-yellow).                                                 |
| `.lux-text-highlight-error`          | Utility-Klasse mit folgenden Deklarationen: color: #93000c, background-color: #ffdad6.                                                                                                  |
| `.lux-text-highlight-error-strong`   | Utility-Klasse mit folgenden Deklarationen: color: var(--lux-theme-dark-primary-text), background-color: var(--lux-theme-warn-70).                                                      |
| `.lux-block`                         | Utility-Klasse mit folgenden Deklarationen: display: block.                                                                                                                             |
| `.lux-flex`                          | Utility-Klasse mit folgenden Deklarationen: display: flex.                                                                                                                              |
| `.lux-grid`                          | Utility-Klasse mit folgenden Deklarationen: display: grid.                                                                                                                              |
| `.lux-inline-flex`                   | Utility-Klasse mit folgenden Deklarationen: display: inline-flex.                                                                                                                       |
| `.lux-inline-block`                  | Utility-Klasse mit folgenden Deklarationen: display: inline-block.                                                                                                                      |
| `.lux-inline-grid`                   | Utility-Klasse mit folgenden Deklarationen: display: inline-grid.                                                                                                                       |
| `.lux-none`                          | Utility-Klasse mit folgenden Deklarationen: display: none.                                                                                                                              |
| `.lux-display-none`                  | Utility-Klasse mit folgenden Deklarationen: display: none.                                                                                                                              |
| `.lux-display-none-important`        | Utility-Klasse mit folgenden Deklarationen: display: none !important.                                                                                                                   |
| `.lux-hidden`                        | Utility-Klasse mit folgenden Deklarationen: visibility: hidden.                                                                                                                         |
| `.lux-hidden-important`              | Utility-Klasse mit folgenden Deklarationen: visibility: hidden !important.                                                                                                              |
| `.lux-m-0`                           | Utility-Klasse mit folgenden Deklarationen: margin: 0px.                                                                                                                                |
| `.lux-mt-0`                          | Utility-Klasse mit folgenden Deklarationen: margin-top: 0px.                                                                                                                            |
| `.lux-p-0`                           | Utility-Klasse mit folgenden Deklarationen: padding: 0px.                                                                                                                               |
| `.lux-pt-0`                          | Utility-Klasse mit folgenden Deklarationen: padding-top: 0px.                                                                                                                           |
| `.lux-m-1`                           | Utility-Klasse mit folgenden Deklarationen: margin: 2px.                                                                                                                                |
| `.lux-mt-1`                          | Utility-Klasse mit folgenden Deklarationen: margin-top: 2px.                                                                                                                            |
| `.lux-p-1`                           | Utility-Klasse mit folgenden Deklarationen: padding: 2px.                                                                                                                               |
| `.lux-pt-1`                          | Utility-Klasse mit folgenden Deklarationen: padding-top: 2px.                                                                                                                           |
| `.lux-m-2`                           | Utility-Klasse mit folgenden Deklarationen: margin: 4px.                                                                                                                                |
| `.lux-mt-2`                          | Utility-Klasse mit folgenden Deklarationen: margin-top: 4px.                                                                                                                            |
| `.lux-p-2`                           | Utility-Klasse mit folgenden Deklarationen: padding: 4px.                                                                                                                               |
| `.lux-pt-2`                          | Utility-Klasse mit folgenden Deklarationen: padding-top: 4px.                                                                                                                           |
| `.lux-m-3`                           | Utility-Klasse mit folgenden Deklarationen: margin: 8px.                                                                                                                                |
| `.lux-mt-3`                          | Utility-Klasse mit folgenden Deklarationen: margin-top: 8px.                                                                                                                            |
| `.lux-p-3`                           | Utility-Klasse mit folgenden Deklarationen: padding: 8px.                                                                                                                               |
| `.lux-pt-3`                          | Utility-Klasse mit folgenden Deklarationen: padding-top: 8px.                                                                                                                           |
| `.lux-m-4`                           | Utility-Klasse mit folgenden Deklarationen: margin: 16px.                                                                                                                               |
| `.lux-mt-4`                          | Utility-Klasse mit folgenden Deklarationen: margin-top: 16px.                                                                                                                           |
| `.lux-p-4`                           | Utility-Klasse mit folgenden Deklarationen: padding: 16px.                                                                                                                              |
| `.lux-pt-4`                          | Utility-Klasse mit folgenden Deklarationen: padding-top: 16px.                                                                                                                          |
| `.lux-m-5`                           | Utility-Klasse mit folgenden Deklarationen: margin: 32px.                                                                                                                               |
| `.lux-mt-5`                          | Utility-Klasse mit folgenden Deklarationen: margin-top: 32px.                                                                                                                           |
| `.lux-p-5`                           | Utility-Klasse mit folgenden Deklarationen: padding: 32px.                                                                                                                              |
| `.lux-pt-5`                          | Utility-Klasse mit folgenden Deklarationen: padding-top: 32px.                                                                                                                          |
| `.lux-m-6`                           | Utility-Klasse mit folgenden Deklarationen: margin: 64px.                                                                                                                               |
| `.lux-mt-6`                          | Utility-Klasse mit folgenden Deklarationen: margin-top: 64px.                                                                                                                           |
| `.lux-p-6`                           | Utility-Klasse mit folgenden Deklarationen: padding: 64px.                                                                                                                              |
| `.lux-pt-6`                          | Utility-Klasse mit folgenden Deklarationen: padding-top: 64px.                                                                                                                          |
| `.lux-mb-0`                          | Utility-Klasse mit folgenden Deklarationen: margin-bottom: 0px.                                                                                                                         |
| `.lux-pb-0`                          | Utility-Klasse mit folgenden Deklarationen: padding-bottom: 0px.                                                                                                                        |
| `.lux-mb-1`                          | Utility-Klasse mit folgenden Deklarationen: margin-bottom: 2px.                                                                                                                         |
| `.lux-pb-1`                          | Utility-Klasse mit folgenden Deklarationen: padding-bottom: 2px.                                                                                                                        |
| `.lux-mb-2`                          | Utility-Klasse mit folgenden Deklarationen: margin-bottom: 4px.                                                                                                                         |
| `.lux-pb-2`                          | Utility-Klasse mit folgenden Deklarationen: padding-bottom: 4px.                                                                                                                        |
| `.lux-mb-3`                          | Utility-Klasse mit folgenden Deklarationen: margin-bottom: 8px.                                                                                                                         |
| `.lux-pb-3`                          | Utility-Klasse mit folgenden Deklarationen: padding-bottom: 8px.                                                                                                                        |
| `.lux-mb-4`                          | Utility-Klasse mit folgenden Deklarationen: margin-bottom: 16px.                                                                                                                        |
| `.lux-pb-4`                          | Utility-Klasse mit folgenden Deklarationen: padding-bottom: 16px.                                                                                                                       |
| `.lux-mb-5`                          | Utility-Klasse mit folgenden Deklarationen: margin-bottom: 32px.                                                                                                                        |
| `.lux-pb-5`                          | Utility-Klasse mit folgenden Deklarationen: padding-bottom: 32px.                                                                                                                       |
| `.lux-mb-6`                          | Utility-Klasse mit folgenden Deklarationen: margin-bottom: 64px.                                                                                                                        |
| `.lux-pb-6`                          | Utility-Klasse mit folgenden Deklarationen: padding-bottom: 64px.                                                                                                                       |
| `.lux-ml-0`                          | Utility-Klasse mit folgenden Deklarationen: margin-left: 0px.                                                                                                                           |
| `.lux-pl-0`                          | Utility-Klasse mit folgenden Deklarationen: padding-left: 0px.                                                                                                                          |
| `.lux-ml-1`                          | Utility-Klasse mit folgenden Deklarationen: margin-left: 2px.                                                                                                                           |
| `.lux-pl-1`                          | Utility-Klasse mit folgenden Deklarationen: padding-left: 2px.                                                                                                                          |
| `.lux-ml-2`                          | Utility-Klasse mit folgenden Deklarationen: margin-left: 4px.                                                                                                                           |
| `.lux-pl-2`                          | Utility-Klasse mit folgenden Deklarationen: padding-left: 4px.                                                                                                                          |
| `.lux-ml-3`                          | Utility-Klasse mit folgenden Deklarationen: margin-left: 8px.                                                                                                                           |
| `.lux-pl-3`                          | Utility-Klasse mit folgenden Deklarationen: padding-left: 8px.                                                                                                                          |
| `.lux-ml-4`                          | Utility-Klasse mit folgenden Deklarationen: margin-left: 16px.                                                                                                                          |
| `.lux-pl-4`                          | Utility-Klasse mit folgenden Deklarationen: padding-left: 16px.                                                                                                                         |
| `.lux-ml-5`                          | Utility-Klasse mit folgenden Deklarationen: margin-left: 32px.                                                                                                                          |
| `.lux-pl-5`                          | Utility-Klasse mit folgenden Deklarationen: padding-left: 32px.                                                                                                                         |
| `.lux-ml-6`                          | Utility-Klasse mit folgenden Deklarationen: margin-left: 64px.                                                                                                                          |
| `.lux-pl-6`                          | Utility-Klasse mit folgenden Deklarationen: padding-left: 64px.                                                                                                                         |
| `.lux-mr-0`                          | Utility-Klasse mit folgenden Deklarationen: margin-right: 0px.                                                                                                                          |
| `.lux-pr-0`                          | Utility-Klasse mit folgenden Deklarationen: padding-right: 0px.                                                                                                                         |
| `.lux-mr-1`                          | Utility-Klasse mit folgenden Deklarationen: margin-right: 2px.                                                                                                                          |
| `.lux-pr-1`                          | Utility-Klasse mit folgenden Deklarationen: padding-right: 2px.                                                                                                                         |
| `.lux-mr-2`                          | Utility-Klasse mit folgenden Deklarationen: margin-right: 4px.                                                                                                                          |
| `.lux-pr-2`                          | Utility-Klasse mit folgenden Deklarationen: padding-right: 4px.                                                                                                                         |
| `.lux-mr-3`                          | Utility-Klasse mit folgenden Deklarationen: margin-right: 8px.                                                                                                                          |
| `.lux-pr-3`                          | Utility-Klasse mit folgenden Deklarationen: padding-right: 8px.                                                                                                                         |
| `.lux-mr-4`                          | Utility-Klasse mit folgenden Deklarationen: margin-right: 16px.                                                                                                                         |
| `.lux-pr-4`                          | Utility-Klasse mit folgenden Deklarationen: padding-right: 16px.                                                                                                                        |
| `.lux-mr-5`                          | Utility-Klasse mit folgenden Deklarationen: margin-right: 32px.                                                                                                                         |
| `.lux-pr-5`                          | Utility-Klasse mit folgenden Deklarationen: padding-right: 32px.                                                                                                                        |
| `.lux-mr-6`                          | Utility-Klasse mit folgenden Deklarationen: margin-right: 64px.                                                                                                                         |
| `.lux-pr-6`                          | Utility-Klasse mit folgenden Deklarationen: padding-right: 64px.                                                                                                                        |
| `.lux-flex-row`                      | Utility-Klasse mit folgenden Deklarationen: flex-direction: row.                                                                                                                        |
| `.lux-flex-row-reverse`              | Utility-Klasse mit folgenden Deklarationen: flex-direction: row-reverse.                                                                                                                |
| `.lux-flex-col`                      | Utility-Klasse mit folgenden Deklarationen: flex-direction: column.                                                                                                                     |
| `.lux-flex-col-revers`               | Utility-Klasse mit folgenden Deklarationen: flex-direction: column-reverse.                                                                                                             |
| `.lux-flex-nowrap`                   | Utility-Klasse mit folgenden Deklarationen: flex-wrap: nowrap.                                                                                                                          |
| `.lux-flex-wrap`                     | Utility-Klasse mit folgenden Deklarationen: flex-wrap: wrap.                                                                                                                            |
| `.lux-flex-wrap-reverse`             | Utility-Klasse mit folgenden Deklarationen: flex-wrap: wrap-reverse.                                                                                                                    |
| `.lux-flex-1`                        | Utility-Klasse mit folgenden Deklarationen: flex: 1 1 0%.                                                                                                                               |
| `.lux-flex-auto`                     | Utility-Klasse mit folgenden Deklarationen: flex: 1 1 auto.                                                                                                                             |
| `.lux-flex-initial`                  | Utility-Klasse mit folgenden Deklarationen: flex: 0 1 auto.                                                                                                                             |
| `.lux-flex-none`                     | Utility-Klasse mit folgenden Deklarationen: flex: none.                                                                                                                                 |
| `.lux-flex-grow-0`                   | Utility-Klasse mit folgenden Deklarationen: flex-grow: 0.                                                                                                                               |
| `.lux-flex-shrink-0`                 | Utility-Klasse mit folgenden Deklarationen: flex-shrink: 0.                                                                                                                             |
| `.lux-flex-grow-1`                   | Utility-Klasse mit folgenden Deklarationen: flex-grow: 1.                                                                                                                               |
| `.lux-flex-shrink-1`                 | Utility-Klasse mit folgenden Deklarationen: flex-shrink: 1.                                                                                                                             |
| `.lux-flex-grow-2`                   | Utility-Klasse mit folgenden Deklarationen: flex-grow: 2.                                                                                                                               |
| `.lux-flex-shrink-2`                 | Utility-Klasse mit folgenden Deklarationen: flex-shrink: 2.                                                                                                                             |
| `.lux-flex-grow-3`                   | Utility-Klasse mit folgenden Deklarationen: flex-grow: 3.                                                                                                                               |
| `.lux-flex-shrink-3`                 | Utility-Klasse mit folgenden Deklarationen: flex-shrink: 3.                                                                                                                             |
| `.lux-flex-grow-4`                   | Utility-Klasse mit folgenden Deklarationen: flex-grow: 4.                                                                                                                               |
| `.lux-flex-shrink-4`                 | Utility-Klasse mit folgenden Deklarationen: flex-shrink: 4.                                                                                                                             |
| `.lux-flex-grow-5`                   | Utility-Klasse mit folgenden Deklarationen: flex-grow: 5.                                                                                                                               |
| `.lux-flex-shrink-5`                 | Utility-Klasse mit folgenden Deklarationen: flex-shrink: 5.                                                                                                                             |
| `.lux-flex-order-0`                  | Utility-Klasse mit folgenden Deklarationen: order: 0.                                                                                                                                   |
| `.lux-flex-order-1`                  | Utility-Klasse mit folgenden Deklarationen: order: 1.                                                                                                                                   |
| `.lux-flex-order-2`                  | Utility-Klasse mit folgenden Deklarationen: order: 2.                                                                                                                                   |
| `.lux-flex-order-3`                  | Utility-Klasse mit folgenden Deklarationen: order: 3.                                                                                                                                   |
| `.lux-flex-order-4`                  | Utility-Klasse mit folgenden Deklarationen: order: 4.                                                                                                                                   |
| `.lux-flex-order-5`                  | Utility-Klasse mit folgenden Deklarationen: order: 5.                                                                                                                                   |
| `.lux-flex-order-6`                  | Utility-Klasse mit folgenden Deklarationen: order: 6.                                                                                                                                   |
| `.lux-flex-order-7`                  | Utility-Klasse mit folgenden Deklarationen: order: 7.                                                                                                                                   |
| `.lux-flex-order-8`                  | Utility-Klasse mit folgenden Deklarationen: order: 8.                                                                                                                                   |
| `.lux-flex-order-9`                  | Utility-Klasse mit folgenden Deklarationen: order: 9.                                                                                                                                   |
| `.lux-flex-order-10`                 | Utility-Klasse mit folgenden Deklarationen: order: 10.                                                                                                                                  |
| `.lux-justify-normal`                | Utility-Klasse mit folgenden Deklarationen: justify-content: normal.                                                                                                                    |
| `.lux-justify-start`                 | Utility-Klasse mit folgenden Deklarationen: justify-content: flex-start.                                                                                                                |
| `.lux-justify-end`                   | Utility-Klasse mit folgenden Deklarationen: justify-content: flex-end.                                                                                                                  |
| `.lux-justify-center`                | Utility-Klasse mit folgenden Deklarationen: justify-content: center.                                                                                                                    |
| `.lux-justify-between`               | Utility-Klasse mit folgenden Deklarationen: justify-content: space-between.                                                                                                             |
| `.lux-justify-around`                | Utility-Klasse mit folgenden Deklarationen: justify-content: space-around.                                                                                                              |
| `.lux-justify-evenly`                | Utility-Klasse mit folgenden Deklarationen: justify-content: space-evenly.                                                                                                              |
| `.lux-justify-stretch`               | Utility-Klasse mit folgenden Deklarationen: justify-content: stretch.                                                                                                                   |
| `.lux-justify-items-start`           | Utility-Klasse mit folgenden Deklarationen: justify-items: start.                                                                                                                       |
| `.lux-justify-items-end`             | Utility-Klasse mit folgenden Deklarationen: justify-items: end.                                                                                                                         |
| `.lux-justify-items-center`          | Utility-Klasse mit folgenden Deklarationen: justify-items: center.                                                                                                                      |
| `.lux-justify-items-stretch`         | Utility-Klasse mit folgenden Deklarationen: justify-items: stretch.                                                                                                                     |
| `.lux-justify-self-start`            | Utility-Klasse mit folgenden Deklarationen: justify-self: start.                                                                                                                        |
| `.lux-justify-self-end`              | Utility-Klasse mit folgenden Deklarationen: justify-self: end.                                                                                                                          |
| `.lux-justify-self-center`           | Utility-Klasse mit folgenden Deklarationen: justify-self: center.                                                                                                                       |
| `.lux-justify-self-stretch`          | Utility-Klasse mit folgenden Deklarationen: justify-self: stretch.                                                                                                                      |
| `.lux-content-normal`                | Utility-Klasse mit folgenden Deklarationen: align-content: normal.                                                                                                                      |
| `.lux-content-start`                 | Utility-Klasse mit folgenden Deklarationen: align-content: flex-start.                                                                                                                  |
| `.lux-content-end`                   | Utility-Klasse mit folgenden Deklarationen: align-content: flex-end.                                                                                                                    |
| `.lux-content-center`                | Utility-Klasse mit folgenden Deklarationen: align-content: center.                                                                                                                      |
| `.lux-content-between`               | Utility-Klasse mit folgenden Deklarationen: align-content: space-between.                                                                                                               |
| `.lux-content-around`                | Utility-Klasse mit folgenden Deklarationen: align-content: space-around.                                                                                                                |
| `.lux-content-evenly`                | Utility-Klasse mit folgenden Deklarationen: align-content: space-evenly.                                                                                                                |
| `.lux-content-stretch`               | Utility-Klasse mit folgenden Deklarationen: align-content: stretch.                                                                                                                     |
| `.lux-content-baseline`              | Utility-Klasse mit folgenden Deklarationen: align-content: baseline.                                                                                                                    |
| `.lux-items-start`                   | Utility-Klasse mit folgenden Deklarationen: align-items: flex-start.                                                                                                                    |
| `.lux-items-end`                     | Utility-Klasse mit folgenden Deklarationen: align-items: flex-end.                                                                                                                      |
| `.lux-items-center`                  | Utility-Klasse mit folgenden Deklarationen: align-items: center.                                                                                                                        |
| `.lux-items-stretch`                 | Utility-Klasse mit folgenden Deklarationen: align-items: stretch.                                                                                                                       |
| `.lux-items-baseline`                | Utility-Klasse mit folgenden Deklarationen: align-items: baseline.                                                                                                                      |
| `.lux-align-self-auto`               | Utility-Klasse mit folgenden Deklarationen: align-self: auto.                                                                                                                           |
| `.lux-align-self-start`              | Utility-Klasse mit folgenden Deklarationen: align-self: flex-start.                                                                                                                     |
| `.lux-align-self-end`                | Utility-Klasse mit folgenden Deklarationen: align-self: flex-end.                                                                                                                       |
| `.lux-align-self-center`             | Utility-Klasse mit folgenden Deklarationen: align-self: center.                                                                                                                         |
| `.lux-align-self-stretch`            | Utility-Klasse mit folgenden Deklarationen: align-self: stretch.                                                                                                                        |
| `.lux-align-self-baseline`           | Utility-Klasse mit folgenden Deklarationen: align-self: baseline.                                                                                                                       |
| `.lux-place-content-center`          | Utility-Klasse mit folgenden Deklarationen: place-content: center.                                                                                                                      |
| `.lux-place-content-start`           | Utility-Klasse mit folgenden Deklarationen: place-content: flex-start.                                                                                                                  |
| `.lux-place-content-end`             | Utility-Klasse mit folgenden Deklarationen: place-content: flex-end.                                                                                                                    |
| `.lux-place-content-between`         | Utility-Klasse mit folgenden Deklarationen: place-content: space-between.                                                                                                               |
| `.lux-place-content-around`          | Utility-Klasse mit folgenden Deklarationen: place-content: space-around.                                                                                                                |
| `.lux-place-content-evenly`          | Utility-Klasse mit folgenden Deklarationen: place-content: space-evenly.                                                                                                                |
| `.lux-place-content-baseline`        | Utility-Klasse mit folgenden Deklarationen: place-content: baseline.                                                                                                                    |
| `.lux-place-content-stretch`         | Utility-Klasse mit folgenden Deklarationen: place-content: stretch.                                                                                                                     |
| `.lux-place-items-center`            | Utility-Klasse mit folgenden Deklarationen: place-items: center.                                                                                                                        |
| `.lux-place-items-start`             | Utility-Klasse mit folgenden Deklarationen: place-items: start.                                                                                                                         |
| `.lux-place-items-end`               | Utility-Klasse mit folgenden Deklarationen: place-items: end.                                                                                                                           |
| `.lux-place-items-baseline`          | Utility-Klasse mit folgenden Deklarationen: place-items: baseline.                                                                                                                      |
| `.lux-place-items-stretch`           | Utility-Klasse mit folgenden Deklarationen: place-items: stretch.                                                                                                                       |
| `.lux-place-self-center`             | Utility-Klasse mit folgenden Deklarationen: place-self: center.                                                                                                                         |
| `.lux-place-self-start`              | Utility-Klasse mit folgenden Deklarationen: place-self: start.                                                                                                                          |
| `.lux-place-self-end`                | Utility-Klasse mit folgenden Deklarationen: place-self: end.                                                                                                                            |
| `.lux-place-self-baseline`           | Utility-Klasse mit folgenden Deklarationen: place-self: baseline.                                                                                                                       |
| `.lux-place-self-stretch`            | Utility-Klasse mit folgenden Deklarationen: place-self: stretch.                                                                                                                        |
| `.lux-gap-0`                         | Utility-Klasse mit folgenden Deklarationen: gap: 0px.                                                                                                                                   |
| `.lux-row-gap-0`                     | Utility-Klasse mit folgenden Deklarationen: row-gap: 0px.                                                                                                                               |
| `.lux-col-gap-0`                     | Utility-Klasse mit folgenden Deklarationen: column-gap: 0px.                                                                                                                            |
| `.lux-gap-1`                         | Utility-Klasse mit folgenden Deklarationen: gap: 0.25rem.                                                                                                                               |
| `.lux-row-gap-1`                     | Utility-Klasse mit folgenden Deklarationen: row-gap: 0.25rem.                                                                                                                           |
| `.lux-col-gap-1`                     | Utility-Klasse mit folgenden Deklarationen: column-gap: 0.25rem.                                                                                                                        |
| `.lux-gap-2`                         | Utility-Klasse mit folgenden Deklarationen: gap: 0.5rem.                                                                                                                                |
| `.lux-row-gap-2`                     | Utility-Klasse mit folgenden Deklarationen: row-gap: 0.5rem.                                                                                                                            |
| `.lux-col-gap-2`                     | Utility-Klasse mit folgenden Deklarationen: column-gap: 0.5rem.                                                                                                                         |
| `.lux-gap-3`                         | Utility-Klasse mit folgenden Deklarationen: gap: 0.75rem.                                                                                                                               |
| `.lux-row-gap-3`                     | Utility-Klasse mit folgenden Deklarationen: row-gap: 0.75rem.                                                                                                                           |
| `.lux-col-gap-3`                     | Utility-Klasse mit folgenden Deklarationen: column-gap: 0.75rem.                                                                                                                        |
| `.lux-gap-4`                         | Utility-Klasse mit folgenden Deklarationen: gap: 1rem.                                                                                                                                  |
| `.lux-row-gap-4`                     | Utility-Klasse mit folgenden Deklarationen: row-gap: 1rem.                                                                                                                              |
| `.lux-col-gap-4`                     | Utility-Klasse mit folgenden Deklarationen: column-gap: 1rem.                                                                                                                           |
| `.lux-gap-5`                         | Utility-Klasse mit folgenden Deklarationen: gap: 1.25rem.                                                                                                                               |
| `.lux-row-gap-5`                     | Utility-Klasse mit folgenden Deklarationen: row-gap: 1.25rem.                                                                                                                           |
| `.lux-col-gap-5`                     | Utility-Klasse mit folgenden Deklarationen: column-gap: 1.25rem.                                                                                                                        |
| `.lux-gap-6`                         | Utility-Klasse mit folgenden Deklarationen: gap: 1.5rem.                                                                                                                                |
| `.lux-row-gap-6`                     | Utility-Klasse mit folgenden Deklarationen: row-gap: 1.5rem.                                                                                                                            |
| `.lux-col-gap-6`                     | Utility-Klasse mit folgenden Deklarationen: column-gap: 1.5rem.                                                                                                                         |
| `.lux-gap-7`                         | Utility-Klasse mit folgenden Deklarationen: gap: 1.75rem.                                                                                                                               |
| `.lux-row-gap-7`                     | Utility-Klasse mit folgenden Deklarationen: row-gap: 1.75rem.                                                                                                                           |
| `.lux-col-gap-7`                     | Utility-Klasse mit folgenden Deklarationen: column-gap: 1.75rem.                                                                                                                        |
| `.lux-gap-8`                         | Utility-Klasse mit folgenden Deklarationen: gap: 2rem.                                                                                                                                  |
| `.lux-row-gap-8`                     | Utility-Klasse mit folgenden Deklarationen: row-gap: 2rem.                                                                                                                              |
| `.lux-col-gap-8`                     | Utility-Klasse mit folgenden Deklarationen: column-gap: 2rem.                                                                                                                           |
| `.lux-gap-9`                         | Utility-Klasse mit folgenden Deklarationen: gap: 2.25rem.                                                                                                                               |
| `.lux-row-gap-9`                     | Utility-Klasse mit folgenden Deklarationen: row-gap: 2.25rem.                                                                                                                           |
| `.lux-col-gap-9`                     | Utility-Klasse mit folgenden Deklarationen: column-gap: 2.25rem.                                                                                                                        |
| `.lux-gap-10`                        | Utility-Klasse mit folgenden Deklarationen: gap: 2.5rem.                                                                                                                                |
| `.lux-row-gap-10`                    | Utility-Klasse mit folgenden Deklarationen: row-gap: 2.5rem.                                                                                                                            |
| `.lux-col-gap-10`                    | Utility-Klasse mit folgenden Deklarationen: column-gap: 2.5rem.                                                                                                                         |
| `.lux-gap-11`                        | Utility-Klasse mit folgenden Deklarationen: gap: 2.75rem.                                                                                                                               |
| `.lux-row-gap-11`                    | Utility-Klasse mit folgenden Deklarationen: row-gap: 2.75rem.                                                                                                                           |
| `.lux-col-gap-11`                    | Utility-Klasse mit folgenden Deklarationen: column-gap: 2.75rem.                                                                                                                        |
| `.lux-gap-12`                        | Utility-Klasse mit folgenden Deklarationen: gap: 3rem.                                                                                                                                  |
| `.lux-row-gap-12`                    | Utility-Klasse mit folgenden Deklarationen: row-gap: 3rem.                                                                                                                              |
| `.lux-col-gap-12`                    | Utility-Klasse mit folgenden Deklarationen: column-gap: 3rem.                                                                                                                           |
| `.lux-gap-16`                        | Utility-Klasse mit folgenden Deklarationen: gap: 4rem.                                                                                                                                  |
| `.lux-row-gap-16`                    | Utility-Klasse mit folgenden Deklarationen: row-gap: 4rem.                                                                                                                              |
| `.lux-col-gap-16`                    | Utility-Klasse mit folgenden Deklarationen: column-gap: 4rem.                                                                                                                           |
| `.lux-gap-20`                        | Utility-Klasse mit folgenden Deklarationen: gap: 5rem.                                                                                                                                  |
| `.lux-row-gap-20`                    | Utility-Klasse mit folgenden Deklarationen: row-gap: 5rem.                                                                                                                              |
| `.lux-col-gap-20`                    | Utility-Klasse mit folgenden Deklarationen: column-gap: 5rem.                                                                                                                           |
| `.lux-gap-24`                        | Utility-Klasse mit folgenden Deklarationen: gap: 6rem.                                                                                                                                  |
| `.lux-row-gap-24`                    | Utility-Klasse mit folgenden Deklarationen: row-gap: 6rem.                                                                                                                              |
| `.lux-col-gap-24`                    | Utility-Klasse mit folgenden Deklarationen: column-gap: 6rem.                                                                                                                           |
| `.lux-gap-28`                        | Utility-Klasse mit folgenden Deklarationen: gap: 7rem.                                                                                                                                  |
| `.lux-row-gap-28`                    | Utility-Klasse mit folgenden Deklarationen: row-gap: 7rem.                                                                                                                              |
| `.lux-col-gap-28`                    | Utility-Klasse mit folgenden Deklarationen: column-gap: 7rem.                                                                                                                           |
| `.lux-gap-32`                        | Utility-Klasse mit folgenden Deklarationen: gap: 8rem.                                                                                                                                  |
| `.lux-row-gap-32`                    | Utility-Klasse mit folgenden Deklarationen: row-gap: 8rem.                                                                                                                              |
| `.lux-col-gap-32`                    | Utility-Klasse mit folgenden Deklarationen: column-gap: 8rem.                                                                                                                           |
| `.lux-gap-36`                        | Utility-Klasse mit folgenden Deklarationen: gap: 9rem.                                                                                                                                  |
| `.lux-row-gap-36`                    | Utility-Klasse mit folgenden Deklarationen: row-gap: 9rem.                                                                                                                              |
| `.lux-col-gap-36`                    | Utility-Klasse mit folgenden Deklarationen: column-gap: 9rem.                                                                                                                           |
| `.lux-gap-40`                        | Utility-Klasse mit folgenden Deklarationen: gap: 10rem.                                                                                                                                 |
| `.lux-row-gap-40`                    | Utility-Klasse mit folgenden Deklarationen: row-gap: 10rem.                                                                                                                             |
| `.lux-col-gap-40`                    | Utility-Klasse mit folgenden Deklarationen: column-gap: 10rem.                                                                                                                          |
| `.lux-gap-44`                        | Utility-Klasse mit folgenden Deklarationen: gap: 11rem.                                                                                                                                 |
| `.lux-row-gap-44`                    | Utility-Klasse mit folgenden Deklarationen: row-gap: 11rem.                                                                                                                             |
| `.lux-col-gap-44`                    | Utility-Klasse mit folgenden Deklarationen: column-gap: 11rem.                                                                                                                          |
| `.lux-gap-48`                        | Utility-Klasse mit folgenden Deklarationen: gap: 12rem.                                                                                                                                 |
| `.lux-row-gap-48`                    | Utility-Klasse mit folgenden Deklarationen: row-gap: 12rem.                                                                                                                             |
| `.lux-col-gap-48`                    | Utility-Klasse mit folgenden Deklarationen: column-gap: 12rem.                                                                                                                          |
| `.lux-gap-52`                        | Utility-Klasse mit folgenden Deklarationen: gap: 13rem.                                                                                                                                 |
| `.lux-row-gap-52`                    | Utility-Klasse mit folgenden Deklarationen: row-gap: 13rem.                                                                                                                             |
| `.lux-col-gap-52`                    | Utility-Klasse mit folgenden Deklarationen: column-gap: 13rem.                                                                                                                          |
| `.lux-gap-56`                        | Utility-Klasse mit folgenden Deklarationen: gap: 14rem.                                                                                                                                 |
| `.lux-row-gap-56`                    | Utility-Klasse mit folgenden Deklarationen: row-gap: 14rem.                                                                                                                             |
| `.lux-col-gap-56`                    | Utility-Klasse mit folgenden Deklarationen: column-gap: 14rem.                                                                                                                          |
| `.lux-gap-60`                        | Utility-Klasse mit folgenden Deklarationen: gap: 15rem.                                                                                                                                 |
| `.lux-row-gap-60`                    | Utility-Klasse mit folgenden Deklarationen: row-gap: 15rem.                                                                                                                             |
| `.lux-col-gap-60`                    | Utility-Klasse mit folgenden Deklarationen: column-gap: 15rem.                                                                                                                          |
| `.lux-gap-64`                        | Utility-Klasse mit folgenden Deklarationen: gap: 16rem.                                                                                                                                 |
| `.lux-row-gap-64`                    | Utility-Klasse mit folgenden Deklarationen: row-gap: 16rem.                                                                                                                             |
| `.lux-col-gap-64`                    | Utility-Klasse mit folgenden Deklarationen: column-gap: 16rem.                                                                                                                          |
| `.lux-gap-72`                        | Utility-Klasse mit folgenden Deklarationen: gap: 18rem.                                                                                                                                 |
| `.lux-row-gap-72`                    | Utility-Klasse mit folgenden Deklarationen: row-gap: 18rem.                                                                                                                             |
| `.lux-col-gap-72`                    | Utility-Klasse mit folgenden Deklarationen: column-gap: 18rem.                                                                                                                          |
| `.lux-gap-80`                        | Utility-Klasse mit folgenden Deklarationen: gap: 20rem.                                                                                                                                 |
| `.lux-row-gap-80`                    | Utility-Klasse mit folgenden Deklarationen: row-gap: 20rem.                                                                                                                             |
| `.lux-col-gap-80`                    | Utility-Klasse mit folgenden Deklarationen: column-gap: 20rem.                                                                                                                          |
| `.lux-gap-96`                        | Utility-Klasse mit folgenden Deklarationen: gap: 24rem.                                                                                                                                 |
| `.lux-row-gap-96`                    | Utility-Klasse mit folgenden Deklarationen: row-gap: 24rem.                                                                                                                             |
| `.lux-col-gap-96`                    | Utility-Klasse mit folgenden Deklarationen: column-gap: 24rem.                                                                                                                          |
| `.lux-grid-cols-1`                   | Utility-Klasse mit folgenden Deklarationen: grid-template-columns: repeat(1, minmax(0, 1fr)).                                                                                           |
| `.lux-col-span-1`                    | Utility-Klasse mit folgenden Deklarationen: grid-column: span 1/span 1.                                                                                                                 |
| `.lux-col-start-1`                   | Utility-Klasse mit folgenden Deklarationen: grid-column-start: 1.                                                                                                                       |
| `.lux-col-end-1`                     | Utility-Klasse mit folgenden Deklarationen: grid-column-end: 1.                                                                                                                         |
| `.lux-grid-cols-2`                   | Utility-Klasse mit folgenden Deklarationen: grid-template-columns: repeat(2, minmax(0, 1fr)).                                                                                           |
| `.lux-col-span-2`                    | Utility-Klasse mit folgenden Deklarationen: grid-column: span 2/span 2.                                                                                                                 |
| `.lux-col-start-2`                   | Utility-Klasse mit folgenden Deklarationen: grid-column-start: 2.                                                                                                                       |
| `.lux-col-end-2`                     | Utility-Klasse mit folgenden Deklarationen: grid-column-end: 2.                                                                                                                         |
| `.lux-grid-cols-3`                   | Utility-Klasse mit folgenden Deklarationen: grid-template-columns: repeat(3, minmax(0, 1fr)).                                                                                           |
| `.lux-col-span-3`                    | Utility-Klasse mit folgenden Deklarationen: grid-column: span 3/span 3.                                                                                                                 |
| `.lux-col-start-3`                   | Utility-Klasse mit folgenden Deklarationen: grid-column-start: 3.                                                                                                                       |
| `.lux-col-end-3`                     | Utility-Klasse mit folgenden Deklarationen: grid-column-end: 3.                                                                                                                         |
| `.lux-grid-cols-4`                   | Utility-Klasse mit folgenden Deklarationen: grid-template-columns: repeat(4, minmax(0, 1fr)).                                                                                           |
| `.lux-col-span-4`                    | Utility-Klasse mit folgenden Deklarationen: grid-column: span 4/span 4.                                                                                                                 |
| `.lux-col-start-4`                   | Utility-Klasse mit folgenden Deklarationen: grid-column-start: 4.                                                                                                                       |
| `.lux-col-end-4`                     | Utility-Klasse mit folgenden Deklarationen: grid-column-end: 4.                                                                                                                         |
| `.lux-grid-cols-5`                   | Utility-Klasse mit folgenden Deklarationen: grid-template-columns: repeat(5, minmax(0, 1fr)).                                                                                           |
| `.lux-col-span-5`                    | Utility-Klasse mit folgenden Deklarationen: grid-column: span 5/span 5.                                                                                                                 |
| `.lux-col-start-5`                   | Utility-Klasse mit folgenden Deklarationen: grid-column-start: 5.                                                                                                                       |
| `.lux-col-end-5`                     | Utility-Klasse mit folgenden Deklarationen: grid-column-end: 5.                                                                                                                         |
| `.lux-grid-cols-6`                   | Utility-Klasse mit folgenden Deklarationen: grid-template-columns: repeat(6, minmax(0, 1fr)).                                                                                           |
| `.lux-col-span-6`                    | Utility-Klasse mit folgenden Deklarationen: grid-column: span 6/span 6.                                                                                                                 |
| `.lux-col-start-6`                   | Utility-Klasse mit folgenden Deklarationen: grid-column-start: 6.                                                                                                                       |
| `.lux-col-end-6`                     | Utility-Klasse mit folgenden Deklarationen: grid-column-end: 6.                                                                                                                         |
| `.lux-grid-cols-7`                   | Utility-Klasse mit folgenden Deklarationen: grid-template-columns: repeat(7, minmax(0, 1fr)).                                                                                           |
| `.lux-col-span-7`                    | Utility-Klasse mit folgenden Deklarationen: grid-column: span 7/span 7.                                                                                                                 |
| `.lux-col-start-7`                   | Utility-Klasse mit folgenden Deklarationen: grid-column-start: 7.                                                                                                                       |
| `.lux-col-end-7`                     | Utility-Klasse mit folgenden Deklarationen: grid-column-end: 7.                                                                                                                         |
| `.lux-grid-cols-8`                   | Utility-Klasse mit folgenden Deklarationen: grid-template-columns: repeat(8, minmax(0, 1fr)).                                                                                           |
| `.lux-col-span-8`                    | Utility-Klasse mit folgenden Deklarationen: grid-column: span 8/span 8.                                                                                                                 |
| `.lux-col-start-8`                   | Utility-Klasse mit folgenden Deklarationen: grid-column-start: 8.                                                                                                                       |
| `.lux-col-end-8`                     | Utility-Klasse mit folgenden Deklarationen: grid-column-end: 8.                                                                                                                         |
| `.lux-grid-cols-9`                   | Utility-Klasse mit folgenden Deklarationen: grid-template-columns: repeat(9, minmax(0, 1fr)).                                                                                           |
| `.lux-col-span-9`                    | Utility-Klasse mit folgenden Deklarationen: grid-column: span 9/span 9.                                                                                                                 |
| `.lux-col-start-9`                   | Utility-Klasse mit folgenden Deklarationen: grid-column-start: 9.                                                                                                                       |
| `.lux-col-end-9`                     | Utility-Klasse mit folgenden Deklarationen: grid-column-end: 9.                                                                                                                         |
| `.lux-grid-cols-10`                  | Utility-Klasse mit folgenden Deklarationen: grid-template-columns: repeat(10, minmax(0, 1fr)).                                                                                          |
| `.lux-col-span-10`                   | Utility-Klasse mit folgenden Deklarationen: grid-column: span 10/span 10.                                                                                                               |
| `.lux-col-start-10`                  | Utility-Klasse mit folgenden Deklarationen: grid-column-start: 10.                                                                                                                      |
| `.lux-col-end-10`                    | Utility-Klasse mit folgenden Deklarationen: grid-column-end: 10.                                                                                                                        |
| `.lux-grid-cols-11`                  | Utility-Klasse mit folgenden Deklarationen: grid-template-columns: repeat(11, minmax(0, 1fr)).                                                                                          |
| `.lux-col-span-11`                   | Utility-Klasse mit folgenden Deklarationen: grid-column: span 11/span 11.                                                                                                               |
| `.lux-col-start-11`                  | Utility-Klasse mit folgenden Deklarationen: grid-column-start: 11.                                                                                                                      |
| `.lux-col-end-11`                    | Utility-Klasse mit folgenden Deklarationen: grid-column-end: 11.                                                                                                                        |
| `.lux-grid-cols-12`                  | Utility-Klasse mit folgenden Deklarationen: grid-template-columns: repeat(12, minmax(0, 1fr)).                                                                                          |
| `.lux-col-span-12`                   | Utility-Klasse mit folgenden Deklarationen: grid-column: span 12/span 12.                                                                                                               |
| `.lux-col-start-12`                  | Utility-Klasse mit folgenden Deklarationen: grid-column-start: 12.                                                                                                                      |
| `.lux-col-end-12`                    | Utility-Klasse mit folgenden Deklarationen: grid-column-end: 12.                                                                                                                        |
| `.lux-grid-cols-none`                | Utility-Klasse mit folgenden Deklarationen: grid-template-columns: none.                                                                                                                |
| `.lux-col-auto`                      | Utility-Klasse mit folgenden Deklarationen: grid-column: auto.                                                                                                                          |
| `.lux-col-start-13`                  | Utility-Klasse mit folgenden Deklarationen: grid-column-start: 13.                                                                                                                      |
| `.lux-col-end-13`                    | Utility-Klasse mit folgenden Deklarationen: grid-column-end: 13.                                                                                                                        |
| `.lux-col-span-full`                 | Utility-Klasse mit folgenden Deklarationen: grid-column: 1/-1.                                                                                                                          |
| `.lux-col-start-auto`                | Utility-Klasse mit folgenden Deklarationen: grid-column-start: auto.                                                                                                                    |
| `.lux-col-end-auto`                  | Utility-Klasse mit folgenden Deklarationen: grid-column-end: auto.                                                                                                                      |
| `.lux-grid-rows-1`                   | Utility-Klasse mit folgenden Deklarationen: grid-template-rows: repeat(1, minmax(0, 1fr)).                                                                                              |
| `.lux-row-span-1`                    | Utility-Klasse mit folgenden Deklarationen: grid-row: span 1/span 1.                                                                                                                    |
| `.lux-row-start-1`                   | Utility-Klasse mit folgenden Deklarationen: grid-row-start: 1.                                                                                                                          |
| `.lux-row-end-1`                     | Utility-Klasse mit folgenden Deklarationen: grid-row-end: 1.                                                                                                                            |
| `.lux-grid-rows-2`                   | Utility-Klasse mit folgenden Deklarationen: grid-template-rows: repeat(2, minmax(0, 1fr)).                                                                                              |
| `.lux-row-span-2`                    | Utility-Klasse mit folgenden Deklarationen: grid-row: span 2/span 2.                                                                                                                    |
| `.lux-row-start-2`                   | Utility-Klasse mit folgenden Deklarationen: grid-row-start: 2.                                                                                                                          |
| `.lux-row-end-2`                     | Utility-Klasse mit folgenden Deklarationen: grid-row-end: 2.                                                                                                                            |
| `.lux-grid-rows-3`                   | Utility-Klasse mit folgenden Deklarationen: grid-template-rows: repeat(3, minmax(0, 1fr)).                                                                                              |
| `.lux-row-span-3`                    | Utility-Klasse mit folgenden Deklarationen: grid-row: span 3/span 3.                                                                                                                    |
| `.lux-row-start-3`                   | Utility-Klasse mit folgenden Deklarationen: grid-row-start: 3.                                                                                                                          |
| `.lux-row-end-3`                     | Utility-Klasse mit folgenden Deklarationen: grid-row-end: 3.                                                                                                                            |
| `.lux-grid-rows-4`                   | Utility-Klasse mit folgenden Deklarationen: grid-template-rows: repeat(4, minmax(0, 1fr)).                                                                                              |
| `.lux-row-span-4`                    | Utility-Klasse mit folgenden Deklarationen: grid-row: span 4/span 4.                                                                                                                    |
| `.lux-row-start-4`                   | Utility-Klasse mit folgenden Deklarationen: grid-row-start: 4.                                                                                                                          |
| `.lux-row-end-4`                     | Utility-Klasse mit folgenden Deklarationen: grid-row-end: 4.                                                                                                                            |
| `.lux-grid-rows-5`                   | Utility-Klasse mit folgenden Deklarationen: grid-template-rows: repeat(5, minmax(0, 1fr)).                                                                                              |
| `.lux-row-span-5`                    | Utility-Klasse mit folgenden Deklarationen: grid-row: span 5/span 5.                                                                                                                    |
| `.lux-row-start-5`                   | Utility-Klasse mit folgenden Deklarationen: grid-row-start: 5.                                                                                                                          |
| `.lux-row-end-5`                     | Utility-Klasse mit folgenden Deklarationen: grid-row-end: 5.                                                                                                                            |
| `.lux-grid-rows-6`                   | Utility-Klasse mit folgenden Deklarationen: grid-template-rows: repeat(6, minmax(0, 1fr)).                                                                                              |
| `.lux-row-span-6`                    | Utility-Klasse mit folgenden Deklarationen: grid-row: span 6/span 6.                                                                                                                    |
| `.lux-row-start-6`                   | Utility-Klasse mit folgenden Deklarationen: grid-row-start: 6.                                                                                                                          |
| `.lux-row-end-6`                     | Utility-Klasse mit folgenden Deklarationen: grid-row-end: 6.                                                                                                                            |
| `.lux-grid-rows-none`                | Utility-Klasse mit folgenden Deklarationen: grid-template-rows: none.                                                                                                                   |
| `.lux-row-span-full`                 | Utility-Klasse mit folgenden Deklarationen: grid-row: 1/-1.                                                                                                                             |
| `.lux-row-start-auto`                | Utility-Klasse mit folgenden Deklarationen: grid-row-start: auto.                                                                                                                       |
| `.lux-row-end-auto`                  | Utility-Klasse mit folgenden Deklarationen: grid-row-end: auto.                                                                                                                         |
| `.lux-row-start-7`                   | Utility-Klasse mit folgenden Deklarationen: grid-row-start: 7.                                                                                                                          |
| `.lux-row-end-7`                     | Utility-Klasse mit folgenden Deklarationen: grid-row-end: 7.                                                                                                                            |
| `.lux-grid-flow-row`                 | Utility-Klasse mit folgenden Deklarationen: grid-auto-flow: row.                                                                                                                        |
| `.lux-grid-flow-col`                 | Utility-Klasse mit folgenden Deklarationen: grid-auto-flow: column.                                                                                                                     |
| `.lux-grid-flow-dense`               | Utility-Klasse mit folgenden Deklarationen: grid-auto-flow: dense.                                                                                                                      |
| `.lux-grid-flow-row-dense`           | Utility-Klasse mit folgenden Deklarationen: grid-auto-flow: row dense.                                                                                                                  |
| `.lux-grid-flow-col-dense`           | Utility-Klasse mit folgenden Deklarationen: grid-auto-flow: column dense.                                                                                                               |
| `.lux-auto-cols-auto`                | Utility-Klasse mit folgenden Deklarationen: grid-auto-columns: auto.                                                                                                                    |
| `.lux-auto-cols-min`                 | Utility-Klasse mit folgenden Deklarationen: grid-auto-columns: min-content.                                                                                                             |
| `.lux-auto-cols-max`                 | Utility-Klasse mit folgenden Deklarationen: grid-auto-columns: max-content.                                                                                                             |
| `.lux-auto-cols-fr`                  | Utility-Klasse mit folgenden Deklarationen: grid-auto-columns: minmax(0, 1fr).                                                                                                          |
| `.lux-auto-rows-auto`                | Utility-Klasse mit folgenden Deklarationen: grid-auto-rows: auto.                                                                                                                       |
| `.lux-auto-rows-min`                 | Utility-Klasse mit folgenden Deklarationen: grid-auto-rows: min-content.                                                                                                                |
| `.lux-auto-rows-max`                 | Utility-Klasse mit folgenden Deklarationen: grid-auto-rows: max-content.                                                                                                                |
| `.lux-auto-rows-fr`                  | Utility-Klasse mit folgenden Deklarationen: grid-auto-rows: minmax(0, 1fr).                                                                                                             |
| `.lux-static`                        | Utility-Klasse mit folgenden Deklarationen: position: static.                                                                                                                           |
| `.lux-relative`                      | Utility-Klasse mit folgenden Deklarationen: position: relative.                                                                                                                         |
| `.lux-absolute`                      | Utility-Klasse mit folgenden Deklarationen: position: absolute.                                                                                                                         |
| `.lux-fixed`                         | Utility-Klasse mit folgenden Deklarationen: position: fixed.                                                                                                                            |
| `.lux-sticky`                        | Utility-Klasse mit folgenden Deklarationen: position: sticky.                                                                                                                           |
| `.lux-inset-0`                       | Utility-Klasse mit folgenden Deklarationen: inset: 0.                                                                                                                                   |
| `.lux-top-0`                         | Utility-Klasse mit folgenden Deklarationen: top: 0.                                                                                                                                     |
| `.lux-right-0`                       | Utility-Klasse mit folgenden Deklarationen: right: 0.                                                                                                                                   |
| `.lux-bottom-0`                      | Utility-Klasse mit folgenden Deklarationen: bottom: 0.                                                                                                                                  |
| `.lux-left-0`                        | Utility-Klasse mit folgenden Deklarationen: left: 0.                                                                                                                                    |
| `.lux-inset-auto`                    | Utility-Klasse mit folgenden Deklarationen: inset: auto.                                                                                                                                |
| `.lux-top-auto`                      | Utility-Klasse mit folgenden Deklarationen: top: auto.                                                                                                                                  |
| `.lux-right-auto`                    | Utility-Klasse mit folgenden Deklarationen: right: auto.                                                                                                                                |
| `.lux-bottom-auto`                   | Utility-Klasse mit folgenden Deklarationen: bottom: auto.                                                                                                                               |
| `.lux-left-auto`                     | Utility-Klasse mit folgenden Deklarationen: left: auto.                                                                                                                                 |
| `.lux-z-auto`                        | Utility-Klasse mit folgenden Deklarationen: z-index: auto.                                                                                                                              |
| `.lux-z-0`                           | Utility-Klasse mit folgenden Deklarationen: z-index: 0.                                                                                                                                 |
| `.lux-z-1`                           | Utility-Klasse mit folgenden Deklarationen: z-index: 1.                                                                                                                                 |
| `.lux-z-5`                           | Utility-Klasse mit folgenden Deklarationen: z-index: 5.                                                                                                                                 |
| `.lux-z-8`                           | Utility-Klasse mit folgenden Deklarationen: z-index: 8.                                                                                                                                 |
| `.lux-z-9`                           | Utility-Klasse mit folgenden Deklarationen: z-index: 9.                                                                                                                                 |
| `.lux-z-10`                          | Utility-Klasse mit folgenden Deklarationen: z-index: 10.                                                                                                                                |
| `.lux-z-100`                         | Utility-Klasse mit folgenden Deklarationen: z-index: 100.                                                                                                                               |
| `.lux-z-199`                         | Utility-Klasse mit folgenden Deklarationen: z-index: 199.                                                                                                                               |
| `.lux-z-200`                         | Utility-Klasse mit folgenden Deklarationen: z-index: 200.                                                                                                                               |
| `.lux-z-500`                         | Utility-Klasse mit folgenden Deklarationen: z-index: 500.                                                                                                                               |
| `.lux-z-1000`                        | Utility-Klasse mit folgenden Deklarationen: z-index: 1000.                                                                                                                              |
| `.lux-z-10000`                       | Utility-Klasse mit folgenden Deklarationen: z-index: 10000.                                                                                                                             |
| `.lux-overflow-auto`                 | Utility-Klasse mit folgenden Deklarationen: overflow: auto.                                                                                                                             |
| `.lux-overflow-x-auto`               | Utility-Klasse mit folgenden Deklarationen: overflow-x: auto.                                                                                                                           |
| `.lux-overflow-y-auto`               | Utility-Klasse mit folgenden Deklarationen: overflow-y: auto.                                                                                                                           |
| `.lux-overflow-hidden`               | Utility-Klasse mit folgenden Deklarationen: overflow: hidden.                                                                                                                           |
| `.lux-overflow-x-hidden`             | Utility-Klasse mit folgenden Deklarationen: overflow-x: hidden.                                                                                                                         |
| `.lux-overflow-y-hidden`             | Utility-Klasse mit folgenden Deklarationen: overflow-y: hidden.                                                                                                                         |
| `.lux-overflow-visible`              | Utility-Klasse mit folgenden Deklarationen: overflow: visible.                                                                                                                          |
| `.lux-overflow-x-visible`            | Utility-Klasse mit folgenden Deklarationen: overflow-x: visible.                                                                                                                        |
| `.lux-overflow-y-visible`            | Utility-Klasse mit folgenden Deklarationen: overflow-y: visible.                                                                                                                        |
| `.lux-overflow-scroll`               | Utility-Klasse mit folgenden Deklarationen: overflow: scroll.                                                                                                                           |
| `.lux-overflow-x-scroll`             | Utility-Klasse mit folgenden Deklarationen: overflow-x: scroll.                                                                                                                         |
| `.lux-overflow-y-scroll`             | Utility-Klasse mit folgenden Deklarationen: overflow-y: scroll.                                                                                                                         |
| `.lux-border-0`                      | Utility-Klasse mit folgenden Deklarationen: border: none.                                                                                                                               |
| `.lux-rounded-none`                  | Utility-Klasse mit folgenden Deklarationen: border-radius: 0.                                                                                                                           |
| `.lux-rounded-sm`                    | Utility-Klasse mit folgenden Deklarationen: border-radius: var(--lux-theme-radius-xs).                                                                                                  |
| `.lux-rounded-md`                    | Utility-Klasse mit folgenden Deklarationen: border-radius: var(--lux-theme-radius-sm).                                                                                                  |
| `.lux-rounded-lg`                    | Utility-Klasse mit folgenden Deklarationen: border-radius: var(--lux-theme-radius-md).                                                                                                  |
| `.lux-rounded-full`                  | Utility-Klasse mit folgenden Deklarationen: border-radius: 50%.                                                                                                                         |
| `.lux-rounded-theme`                 | Utility-Klasse mit folgenden Deklarationen: border-radius: var(--lux-theme-app-border-radius).                                                                                          |
| `.lux-shadow-none`                   | Utility-Klasse mit folgenden Deklarationen: box-shadow: none.                                                                                                                           |
| `.lux-cursor-pointer`                | Utility-Klasse mit folgenden Deklarationen: cursor: pointer.                                                                                                                            |
| `.lux-cursor-default`                | Utility-Klasse mit folgenden Deklarationen: cursor: default.                                                                                                                            |
| `.lux-pointer-events-none`           | Utility-Klasse mit folgenden Deklarationen: pointer-events: none.                                                                                                                       |
| `.lux-pointer-events-auto`           | Utility-Klasse mit folgenden Deklarationen: pointer-events: auto.                                                                                                                       |
| `.lux-text-xs`                       | Utility-Klasse mit folgenden Deklarationen: font-size: var(--lux-theme-font-size-xs).                                                                                                   |
| `.lux-text-sm`                       | Utility-Klasse mit folgenden Deklarationen: font-size: var(--lux-theme-font-size-sm).                                                                                                   |
| `.lux-text-base`                     | Utility-Klasse mit folgenden Deklarationen: font-size: var(--lux-theme-font-size-md).                                                                                                   |
| `.lux-text-lg`                       | Utility-Klasse mit folgenden Deklarationen: font-size: var(--lux-theme-font-size-lg).                                                                                                   |
| `.lux-text-xl`                       | Utility-Klasse mit folgenden Deklarationen: font-size: var(--lux-theme-font-size-xl).                                                                                                   |
| `.lux-text-2xl`                      | Utility-Klasse mit folgenden Deklarationen: font-size: var(--lux-theme-font-size-2xl).                                                                                                  |
| `.lux-font-light`                    | Utility-Klasse mit folgenden Deklarationen: font-weight: 300.                                                                                                                           |
| `.lux-font-normal`                   | Utility-Klasse mit folgenden Deklarationen: font-weight: 400.                                                                                                                           |
| `.lux-font-medium`                   | Utility-Klasse mit folgenden Deklarationen: font-weight: 500.                                                                                                                           |
| `.lux-font-semibold`                 | Utility-Klasse mit folgenden Deklarationen: font-weight: 600.                                                                                                                           |
| `.lux-font-bold`                     | Utility-Klasse mit folgenden Deklarationen: font-weight: 700.                                                                                                                           |
| `.lux-font-headline`                 | Utility-Klasse mit folgenden Deklarationen: font-family: var(--lux-theme-app-headline-font, inherit).                                                                                   |
| `.lux-font-body`                     | Utility-Klasse mit folgenden Deklarationen: font-family: var(--lux-theme-app-font-family, inherit).                                                                                     |
| `.lux-leading-none`                  | Utility-Klasse mit folgenden Deklarationen: line-height: 1.                                                                                                                             |
| `.lux-leading-tight`                 | Utility-Klasse mit folgenden Deklarationen: line-height: 1.2.                                                                                                                           |
| `.lux-leading-normal`                | Utility-Klasse mit folgenden Deklarationen: line-height: 1.5.                                                                                                                           |
| `.lux-leading-relaxed`               | Utility-Klasse mit folgenden Deklarationen: line-height: 1.75.                                                                                                                          |
| `.lux-whitespace-nowrap`             | Utility-Klasse mit folgenden Deklarationen: white-space: nowrap.                                                                                                                        |
| `.lux-whitespace-normal`             | Utility-Klasse mit folgenden Deklarationen: white-space: normal.                                                                                                                        |
| `.lux-bg-transparent`                | Utility-Klasse mit folgenden Deklarationen: background: transparent.                                                                                                                    |
| `.lux-bg-header`                     | Utility-Klasse mit folgenden Deklarationen: background-color: var(--lux-theme-app-header-bg).                                                                                           |
| `.lux-bg-content`                    | Utility-Klasse mit folgenden Deklarationen: background-color: var(--lux-theme-app-content-bg).                                                                                          |
| `.lux-bg-footer`                     | Utility-Klasse mit folgenden Deklarationen: background-color: var(--lux-theme-app-footer-bg).                                                                                           |
| `.lux-bg-primary`                    | Utility-Klasse mit folgenden Deklarationen: background-color: var(--lux-theme-primary-color).                                                                                           |
| `.lux-text-primary`                  | Utility-Klasse mit folgenden Deklarationen: color: var(--lux-theme-primary-color).                                                                                                      |
| `.lux-text-dark`                     | Utility-Klasse mit folgenden Deklarationen: color: var(--lux-theme-dark-primary-text).                                                                                                  |
| `.lux-text-light`                    | Utility-Klasse mit folgenden Deklarationen: color: var(--lux-theme-light-primary-text).                                                                                                 |
| `.lux-text-secondary`                | Utility-Klasse mit folgenden Deklarationen: color: var(--lux-theme-dark-secondary-text).                                                                                                |
| `.lux-text-disabled`                 | Utility-Klasse mit folgenden Deklarationen: color: var(--lux-theme-dark-disabled-text).                                                                                                 |
| `.lux-outline-none`                  | Utility-Klasse mit folgenden Deklarationen: outline: none.                                                                                                                              |
| `.lux-transition-none`               | Utility-Klasse mit folgenden Deklarationen: transition: none.                                                                                                                           |
| `.lux-vertical`                      | Utility-Klasse mit folgenden Deklarationen: flex-direction: column.                                                                                                                     |
| `.lux-form-error-container`          | Utility-Klasse mit folgenden Deklarationen: display: flex, flex: 0 1 auto, font-size: 0.75rem.                                                                                          |
| `.lux-form-error-icon`               | Utility-Klasse mit folgenden Deklarationen: color: var(--mat-sys-on-error-container).                                                                                                   |
| `.lux-form-error-label`              | Utility-Klasse mit folgenden Deklarationen: display: flex, flex: 0 1 auto, background-color: var(--lux-theme-form-error-msg-background).                                                |
| `.lux-focused`                       | Utility-Klasse mit folgenden Deklarationen: outline: var(--lux-theme-outline-dark).                                                                                                     |

## Code-Beispiele

### CSS-Variable nutzen

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

### LUX-Card umstylen

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

### LUX-Button (rund) umstylen

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

### LUX-Button (stroked) umstylen

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

### CSS-Klasse

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
