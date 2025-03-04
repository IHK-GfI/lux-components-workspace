# LUX-Layout-Card-Row

![Beispielbild LUX-Layout-Card-Row](https://raw.githubusercontent.com/wiki/IHK-GfI/lux-components/Versions/v14/lux‐layout‐card‐row-v14-3-spaltig-desktop.png)

- [LUX-Layout-Card-Row](#lux-layout-card-row)
  - [Overview / API](#overview--api)
    - [Allgemein](#allgemein)
    - [@Input](#input)
    - [Grundgerüst](#grundgerüst)
    - [Überschrift](#überschrift)
    - [Größere Karten (colSpan: x)](#größere-karten-colspan-x)
    - [Leerraum (empty: true)](#leerraum-empty-true)
    - [Gap](#gap)
    - [Margin](#margin)
    - [Umbrechen](#umbrechen)
    - [Layout über die zentrale Konfiguration global anpassen](#layout-über-die-zentrale-konfiguration-global-anpassen)
  - [Classes / Interfaces](#classes--interfaces)
    - [LuxLayoutRowGapConfig](#luxlayoutrowgapconfig)
    - [LuxLayoutRowMarginConfig](#luxlayoutrowmarginconfig)
    - [LuxLayoutRowItemConfig](#luxlayoutrowitemconfig)
  - [Directiven](#directiven)
    - [LuxLayoutRowItemDirective](#luxlayoutrowitemdirective)
    - [@Input](#input-1)
  - [Beispiele](#beispiele)
    - [2-Spaltenlayout](#2-spaltenlayout)
    - [3-Spaltenlayout](#3-spaltenlayout)

## Overview / API

### Allgemein

| Name     | Beschreibung        |
| -------- | ------------------- |
| import   | LuxLayoutModule     |
| selector | lux-layout-card-row |

### @Input

| Name      | Typ                                  | Beschreibung                                    |
| --------- | ------------------------------------ | ----------------------------------------------- |
| luxTitle  | string                               | Jede Zeile kann einen Titel haben.              |
| luxWrapAt | 'none', 'xs', 'sm', 'md', 'lg', 'xl' | Gibt an, ab welcher Auflösung umgebrochen wird. |
| luxGap    | LuxLayoutRowGapConfig                | Abstand zwischen den Elementen.                 |
| luxMargin | LuxLayoutRowMarginConfig             | Abstand der Zeile nach links und rechts.        |

### Grundgerüst

Ein Layout wird immer wie folgt aufgebaut:

HTML

```html
<lux-layout>
  <lux-layout-card-row>
    <lux-card luxTitle="Karte A" *luxLayoutRowItem="{}"></lux-card>
    <lux-card luxTitle="Karte B" *luxLayoutRowItem="{}"></lux-card>
  </lux-layout-card-row>
</lux-layout>
```

Dabei ist es sehr wichtig, seine Karten mit der Directive \*luxLayoutRowItem zu versehen,
da sie ansonsten nicht von dem umliegenden Layout gefunden werden können. Zusätzlich werden die Karten über die Directive konfiguriert.
Beispiele folgen in den nächsten Abschnitten.

### Überschrift

Jede Zeile kann eine Überschrift (siehe luxTitle) haben.

HTML

```html
<lux-layout>
  <lux-layout-card-row luxTitle="Überschrift">
    <lux-card luxTitle="Karte A" *luxLayoutRowItem="{}"></lux-card>
    <lux-card luxTitle="Karte B" *luxLayoutRowItem="{}"></lux-card>
  </lux-layout-card-row>
</lux-layout>
```

### Größere Karten (colSpan: x)

Über das Property "colSpan" kann die Größe eines Elements festgelegt werden.
Im folgenden Beispiel sieht man ein 3-spaltiges Layout, bei dem das erste Element über zwei Spalten geht.
Bei der zweiten Karte ist keine Konfiguration angegeben und deshalb greift hier der Default. D.h.
\*luxLayoutRowItem="{}" ist eine verkürzte Schreibweise für \*luxLayoutRowItem="{}"="{ colSpan: 1, empty: false}".

HTML

```html
<lux-layout>
  <lux-layout-card-row>
    <lux-card luxTitle="Karte A" *luxLayoutRowItem="{ colSpan: 2 }"></lux-card>
    <lux-card luxTitle="Karte B" *luxLayoutRowItem="{}"></lux-card>
  </lux-layout-card-row>
</lux-layout>
```

### Leerraum (empty: true)

Ein Leerraum kann über ein entsprechendes Div-Element realisiert werden. Im folgenden Beispiel sieht man
ein 4-spaltiges Layout, bei dem die erste Karte den halben Platz einnimmt und der Rest leer bleibt.

HTML

```html
<lux-layout>
  <lux-layout-card-row>
    <lux-card luxTitle="Karte A" *luxLayoutRowItem="{ colSpan: 2 }"></lux-card>
    <div *luxLayoutRowItem="{ empty: true, colSpan: 2 }"></div>
  </lux-layout-card-row>
</lux-layout>
```

### Gap

Der Gap kann über das Property "luxGap" angepasst werden.

HTML

```html
<lux-layout>
  <lux-layout-card-row
    [luxGap]="{ row: '50px', rowItem: '25px', column: '10px'}"
  >
    <lux-card luxTitle="Karte A" *luxLayoutRowItem="{}"></lux-card>
    <lux-card luxTitle="Karte B" *luxLayoutRowItem="{}"></lux-card>
    <lux-card luxTitle="Karte C" *luxLayoutRowItem="{}"></lux-card>
  </lux-layout-card-row>
</lux-layout>
```

### Margin

Der Margin kann über das Property "luxMargin" angepasst werden.

HTML

```html
<lux-layout>
  <lux-layout-card-row
    [luxMargin]="{ xs: '10%', lg: '20%', marginLeft: true, marginRight: true}"
  >
    <lux-card luxTitle="Karte A" *luxLayoutRowItem="{}"></lux-card>
    <lux-card luxTitle="Karte B" *luxLayoutRowItem="{}"></lux-card>
    <lux-card luxTitle="Karte C" *luxLayoutRowItem="{}"></lux-card>
  </lux-layout-card-row>
</lux-layout>
```

### Umbrechen

Über das Property "luxWrapAt" kann beeinflusst werden, wann aus der Zeile eine Spalte wird und
die Karten anstatt nebeneinander untereinander angezeigt werden.

HTML

```html
<lux-layout>
  <lux-layout-card-row luxWrapAt="sm">
    <lux-card luxTitle="Karte A" *luxLayoutRowItem="{}"></lux-card>
    <lux-card luxTitle="Karte B" *luxLayoutRowItem="{}"></lux-card>
    <lux-card luxTitle="Karte C" *luxLayoutRowItem="{}"></lux-card>
  </lux-layout-card-row>
</lux-layout>
```

### Layout über die zentrale Konfiguration global anpassen

Siehe [Config - Layout](config-v14#layout).

TS

```typescript
const myConfiguration: LuxComponentsConfigParameters = {
  [...]
  layout: {
    cardRow: {
      wrapAt: 'sm',
      gapConfig: {
        row: '8px',
        rowItem: '8px',
        column: '4px'
      },
      marginConfig: {
        marginLeft: true,
        marginRight: true,
        xs: '0%',
        sm: '5%',
        md: '10%',
        lg: '15%',
        xl: '20%'
      }
    }
  }
};
```

## Classes / Interfaces

### LuxLayoutRowGapConfig

| Name    | Typ    | Beschreibung                                                                                                                                                                                 |
| ------- | ------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| row     | string | Der Abstand zur nächsten Zeile (z.B. '4px'), wenn die Auflösung größer als [luxWrapAt](#umbrechen) ist. Darstellung der Elemente nebeneinander in einer Zeile.                               |
| rowItem | string | Der Abstand zum nächsten Element (z.B. '4px'), wenn die Auflösung größer als [luxWrapAt](#umbrechen) ist. Darstellung der Elemente nebeneinander in einer Zeile.                             |
| column  | string | Der Abstand zur nächsten Zeile und zum nächsten Element (z.B. '4px'), wenn die Auflösung kleiner gleich [luxWrapAt](#umbrechen) ist. Darstellung der Elemente untereinander in einer Spalte. |

### LuxLayoutRowMarginConfig

| Name        | Typ     | Beschreibung                                    |
| ----------- | ------- | ----------------------------------------------- |
| xs          | string  | Ein String (z.B. '5%')                          |
| sm          | string  | Ein String (z.B. '5%')                          |
| md          | string  | Ein String (z.B. '5%')                          |
| lg          | string  | Ein String (z.B. '5%')                          |
| xl          | string  | Ein String (z.B. '5%')                          |
| marginLeft  | boolean | Gibt an, ob der Margin (links) angezeigt wird.  |
| marginRight | boolean | Gibt an, ob der Margin (rechts) angezeigt wird. |

### LuxLayoutRowItemConfig

| Name    | Typ     | Beschreibung                                       |
| ------- | ------- | -------------------------------------------------- |
| colSpan | number  | Gibt an, wie viel Platz ein Element einnimmt.      |
| empty   | boolean | Gibt an, ob es sich um ein leeres Element handelt. |
| flex    | string  | Inhalt des fxFlex-Attributes (z.B. 'none').        |

## Directiven

### LuxLayoutRowItemDirective

| Name     | Beschreibung     |
| -------- | ---------------- |
| import   | LuxLayoutModule  |
| selector | luxLayoutRowItem |

### @Input

| Name             | Typ                    | Beschreibung                                             |
| ---------------- | ---------------------- | -------------------------------------------------------- |
| luxLayoutRowItem | LuxLayoutRowItemConfig | Ein LuxLayoutRowItemConfig-Objekt (z.B. { colSpan: 2 }). |

## Beispiele

### 2-Spaltenlayout

Desktop

![Beispielbild 2-Spaltenlayout](https://raw.githubusercontent.com/wiki/IHK-GfI/lux-components/Versions/v14/lux‐layout‐card‐row-v14-2-spaltig-desktop.png)

Mobile

![Beispielbild 2-Spaltenlayout](https://raw.githubusercontent.com/wiki/IHK-GfI/lux-components/Versions/v14/lux‐layout‐card‐row-v14-2-spaltig-mobile.png)

HTML

```html
<lux-layout>
  <lux-layout-card-row luxTitle="2-Spaltenlayout">
    <lux-card luxTitle="Karte A" *luxLayoutRowItem="{}"></lux-card>
    <lux-card luxTitle="Karte B" *luxLayoutRowItem="{}"></lux-card>
  </lux-layout-card-row>
  <lux-layout-card-row>
    <lux-card luxTitle="Karte C" *luxLayoutRowItem="{ colSpan: 2 }"></lux-card>
  </lux-layout-card-row>
  <lux-layout-card-row>
    <lux-card luxTitle="Karte D" *luxLayoutRowItem="{}"></lux-card>
    <div *luxLayoutRowItem="{ empty: true }"></div>
  </lux-layout-card-row>
</lux-layout>
```

### 3-Spaltenlayout

Desktop

![Beispielbild 3-Spaltenlayout](https://raw.githubusercontent.com/wiki/IHK-GfI/lux-components/Versions/v14/lux‐layout‐card‐row-v14-3-spaltig-desktop.png)

Mobile

![Beispielbild 3-Spaltenlayout](https://raw.githubusercontent.com/wiki/IHK-GfI/lux-components/Versions/v14/lux‐layout‐card‐row-v14-3-spaltig-mobile.png)

HTML

```html
<lux-layout>
  <lux-layout-card-row luxTitle="3-Spaltenlayout">
    <lux-card luxTitle="Karte A" *luxLayoutRowItem="{}"></lux-card>
    <lux-card luxTitle="Karte B" *luxLayoutRowItem="{}"></lux-card>
    <lux-card luxTitle="Karte C" *luxLayoutRowItem="{}"></lux-card>
  </lux-layout-card-row>
  <lux-layout-card-row>
    <lux-card luxTitle="Karte D" *luxLayoutRowItem="{ colSpan: 2 }"></lux-card>
    <lux-card luxTitle="Karte E" *luxLayoutRowItem="{}"></lux-card>
  </lux-layout-card-row>
  <lux-layout-card-row>
    <lux-card luxTitle="Karte F" *luxLayoutRowItem="{ colSpan: 2 }"></lux-card>
    <div *luxLayoutRowItem="{ empty: true }"></div>
  </lux-layout-card-row>
  <lux-layout-card-row>
    <lux-card luxTitle="Karte G" *luxLayoutRowItem="{ colSpan: 3 }"></lux-card>
  </lux-layout-card-row>
</lux-layout>
```
