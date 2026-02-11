# LUX-Icon

![Beispielbild LUX-Icon](lux‐icon-v21-img.png)

- [LUX-Icon](#lux-icon)
  - [Overview / API](#overview--api)
    - [Allgemein](#allgemein)
    - [@Input](#input)
  - [Styleguide](#styleguide)
  - [Konfiguration](#konfiguration)
    - [Icons mit der App ausliefern](#icons-mit-der-app-ausliefern)
    - [Icons über ein CDN laden](#icons-über-ein-cdn-laden)
  - [Beispiele](#beispiele)
    - [1. Simple Icons](#1-simple-icons)
      - [Default-Icon ohne Hintergrund](#default-icon-ohne-hintergrund)
      - [Default-Icon mit farbigen Hintergrund](#default-icon-mit-farbigen-hintergrund)
    - [2. luxIconSize](#2-luxiconsize)
      - [Vorbelegte IconSize 1x, 2x, ..., 5x](#vorbelegte-iconsize-1x-2x--5x)
    - [3. Icons colored](#3-icons-colored)
      - [Anpassung der Linienfarbe](#anpassung-der-linienfarbe)
      - [Anpassung der Hintergrundfarbe](#anpassung-der-hintergrundfarbe)
    - [4. Icons rounded](#4-icons-rounded)
      - [Mit vorgegebener Iconsize 1x, 2x, ..., 5x](#mit-vorgegebener-iconsize-1x-2x--5x)
      - [Mit individueller Größe und Padding](#mit-individueller-größe-und-padding)
    - [5. Icon Padding](#5-icon-padding)
    - [6. Icon Margin](#6-icon-margin)
    - [7. Custom-Icon verwenden](#7-custom-icon-verwenden)

## Overview / API

### Allgemein

| Name     | Beschreibung |
| -------- | ------------ |
| selector | lux-icon     |

### @Input

| Name        | Typ          | Beschreibung                                                                                                                                                                                                                                                                                                                                                      |
| ----------- | ------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| luxIconName | string       | Ein Iconname, z.B. "lux-battery-full-1".                                                                                                                                                                                                                                                                                                                          |
| luxIconSize | string       | Definiert die Größe des Icons und entspricht einem 'em'-Wert (z.B. '1x' = 'font-size: 1em'). Passt dann die Größe passend zu dem Icon an. Default-Wert: '1x'. Mögliche Eingaben: '1x' bis '5x'. Zusätzlich können auch individuelle Pixelwerte oder em-Werte mit einem Dezimalwert angeben werden, z.B. '42px' oder '1.25em'                                      |
| luxRounded  | boolean      | Definiert ob das Icon mit abgerundeten Hintergrund dargestellt werden soll. (Nur sichtbar wenn eine Farbe gesetzt ist).                                                                                                                                                                                                                                           |
| luxColor    | LuxIconColor | Bestimmt die Hintergrundfarbe und davon abhängig die Schriftfarbe des Icons (analog zu den LuxBadges).                                                                                                                                                                                                                                                            |
| luxMargin   | string       | Ermöglicht das Einstellen von Margins nach Oben, Rechts, Unten und Links. Die Syntax entspricht genau der normalen CSS-Syntax. Beispiele: luxMargin='5px', luxMargin='5px 10px', luxMargin='5px 10px 15px 20px'                                                                                                                                                   |
| luxPadding  | string       | Ermöglicht das Einstellen von Paddings nach Oben, Rechts, Unten und Links. Die Syntax entspricht genau der normalen CSS-Syntax. Beispiele: luxPadding='5px', luxPadding='5px 10px', luxPadding='5px 10px 15px 20px'. Wichtig: bei Runden Icons mit individueller Größe, muss das Padding selbständig angepasst werden, damit das Icon vollständig angezeigt wird. |

## Styleguide

Grundlegende Regeln zum Umgang mit Icons sind:

- Die Icons sollen innerhalb einer App einheitlich eingerückt sein.

## Konfiguration

### Icons mit der App ausliefern

Siehe [LUX-Components-Config](config-v21#icons-mit-der-app-ausliefern).

### Icons über ein CDN laden

Siehe [LUX-Components-Config](config-v21#icons-über-ein-cdn-laden).

## Beispiele

### 1. Simple Icons

#### Default-Icon ohne Hintergrund

![Beispielbild 01-01](lux‐icon-v21-img-01-01.png)

Html

```html
<lux-icon luxIconName="lux-interface-favorite-like-1" class="lux-color-blue"></lux-icon>
```

#### Default-Icon mit farbigen Hintergrund

![Beispielbild 01-02](lux‐icon-v21-img-01-02.png)

Html

```html
<lux-icon luxIconName="lux-interface-favorite-like-1" luxColor="blue"></lux-icon>
```

### 2. luxIconSize

#### Vorbelegte IconSize 1x, 2x, ..., 5x

![Beispielbild 02](lux‐icon-v21-img-02.png)

Html

```html
<lux-icon luxIconName="lux-interface-edit-write-2" luxIconSize="1x"></lux-icon>
<lux-icon luxIconName="lux-interface-edit-write-2" luxIconSize="2x"></lux-icon>
<lux-icon luxIconName="lux-interface-edit-write-2" luxIconSize="3x"></lux-icon>
<lux-icon luxIconName="lux-interface-edit-write-2" luxIconSize="4x"></lux-icon>
<lux-icon luxIconName="lux-interface-edit-write-2" luxIconSize="5x"></lux-icon>
```

### 3. Icons colored

#### Anpassung der Linienfarbe

![Beispielbild 03-01](lux‐icon-v21-img-03-01.png)

Html

```html
<div class="lux-flex lux-flex-wrap lux-gap-4">
  <lux-icon luxIconName="lux-interface-favorite-like-1" style="color: red"></lux-icon>
  <lux-icon luxIconName="lux-interface-favorite-like-1" style="color: green"></lux-icon>
  <lux-icon luxIconName="lux-interface-favorite-like-1" style="color: purple"></lux-icon>
  <lux-icon luxIconName="lux-interface-favorite-like-1" style="color: blue"></lux-icon>
  <lux-icon luxIconName="lux-interface-favorite-like-1" style="color: gray"></lux-icon>
  <lux-icon luxIconName="lux-interface-favorite-like-1" style="color: orange"></lux-icon>
  <lux-icon luxIconName="lux-interface-favorite-like-1" style="color: brown"></lux-icon>
  <lux-icon luxIconName="lux-interface-favorite-like-1" style="color: black"></lux-icon>
  <lux-icon luxIconName="lux-interface-favorite-like-1" style="color: yellow"></lux-icon>
  <lux-icon luxIconName="lux-interface-favorite-like-1" style="color: pink"></lux-icon>
  <lux-icon luxIconName="lux-interface-favorite-like-1" style="color: lightblue"></lux-icon>
</div>
```

#### Anpassung der Hintergrundfarbe

![Beispielbild 03-02](lux‐icon-v21-img-03-02.png)

Html

```html
<div class="lux-flex lux-flex-wrap lux-gap-4">
  <lux-icon luxIconName="lux-interface-favorite-like-1" luxColor="red"></lux-icon>
  <lux-icon luxIconName="lux-interface-favorite-like-1" luxColor="green"></lux-icon>
  <lux-icon luxIconName="lux-interface-favorite-like-1" luxColor="purple"></lux-icon>
  <lux-icon luxIconName="lux-interface-favorite-like-1" luxColor="blue"></lux-icon>
  <lux-icon luxIconName="lux-interface-favorite-like-1" luxColor="gray"></lux-icon>
  <lux-icon luxIconName="lux-interface-favorite-like-1" luxColor="orange"></lux-icon>
  <lux-icon luxIconName="lux-interface-favorite-like-1" luxColor="brown"></lux-icon>
  <lux-icon luxIconName="lux-interface-favorite-like-1" luxColor="black"></lux-icon>
  <lux-icon luxIconName="lux-interface-favorite-like-1" luxColor="yellow"></lux-icon>
  <lux-icon luxIconName="lux-interface-favorite-like-1" luxColor="pink"></lux-icon>
  <lux-icon luxIconName="lux-interface-favorite-like-1" luxColor="lightblue"></lux-icon>
</div>
```

### 4. Icons rounded

#### Mit vorgegebener Iconsize 1x, 2x, ..., 5x

![Beispielbild 04-01](lux‐icon-v21-img-04-01.png)

Html

```html
<lux-icon luxIconName="lux-interface-edit-write-2" luxIconSize="1x" [luxRounded]="true" luxColor="blue"> </lux-icon>
<lux-icon luxIconName="lux-interface-edit-write-2" luxIconSize="2x" [luxRounded]="true" luxColor="blue"> </lux-icon>
<lux-icon luxIconName="lux-interface-edit-write-2" luxIconSize="3x" [luxRounded]="true" luxColor="blue"> </lux-icon>
<lux-icon luxIconName="lux-interface-edit-write-2" luxIconSize="4x" [luxRounded]="true" luxColor="blue"> </lux-icon>
<lux-icon luxIconName="lux-interface-edit-write-2" luxIconSize="5x" [luxRounded]="true" luxColor="blue"> </lux-icon>
```

#### Mit individueller Größe und Padding

![Beispielbild 04-02](lux‐icon-v21-img-04-02.png)

Html

```html
<lux-icon luxIconName="lux-food-burger" luxIconSize="42px" luxPadding="16px" [luxRounded]="true" luxColor="blue"></lux-icon>
```

### 5. Icon Padding

![Beispielbild 05](lux‐icon-v21-img-05.png)

Html

```html
<lux-icon luxIconName="lux-food-burger" luxIconSize="2x" luxPadding="10px 20px" luxColor="blue"></lux-icon>
```

### 6. Icon Margin

![Beispielbild 06](lux‐icon-v21-img-06.png)

Html

```html
<div style="border-radius: 4px; width: fit-content" class="lux-bg-color-primary-50">
  <lux-icon luxIconName="lux-food-burger" luxIconSize="42px" luxMargin="10px" class="lux-color-blue"></lux-icon>
</div>
```

### 7. Custom-Icon verwenden

Das Custom-Icon wird im Asset-Ordner abgelegt. Aber bevor es verwendet werden kann, muss das Icon dem _LuxIconRegistryService_ bekannt gemacht werden.
Es ist ausreichend, wenn das Custom-Icon einmal registriert wird, d.h. der Konstruktor der _app.component.ts_ würde sich anbieten.

Bitte die LUX-Icons verwenden und ausschließlich in Ausnahmefällen individuelle Icons verwenden!

Beispiel ohne CDN (heißt es wurde zentral kein CDN konfiguriert):

```typescript
  constructor(private iconService: LuxIconRegistryService) {
    iconService.getSvgIconList().push({ iconName: 'app-icon-custom', iconPath: '/assets/svg/custom.svg'});
  }
```

Beispiel mit CDN oder angepasstem _iconBasePath_:

Der _iconBasePath_ wird bei der Verwendung eines CDNs angepasst (siehe [LUX-Components-Config](config-v21#icons-über-ein-cdn-laden)). Wenn ein Custom-Icon aus der App verwendet werden soll, muss der _iconBasePath_ bei der Registrierung auf _'/'_ gesetzt werden.

```typescript
  constructor(private iconService: LuxIconRegistryService) {
    iconService.getSvgIconList().push({ iconName: 'app-icon-custom', iconBasePath: '/',  iconPath: '/assets/svg/custom.svg'});
  }
```

```html
<lux-icon luxIconName="app-icon-custom"></lux-icon>
```
