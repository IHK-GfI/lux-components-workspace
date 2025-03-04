# LUX-Layout-Form-Row

![Beispielbild LUX-Layout-Form-Row](https://raw.githubusercontent.com/wiki/IHK-GfI/lux-components/Versions/v14/lux‐layout‐form‐row-v14-3-spaltig-desktop.png)

- [LUX-Layout-Form-Row](#lux-layout-form-row)
  - [Overview / API](#overview--api)
    - [Allgemein](#allgemein)
    - [@Input](#input)
    - [Grundgerüst](#grundgerüst)
    - [Überschrift](#überschrift)
    - [Größere Formularelemente (colSpan: x)](#größere-formularelemente-colspan-x)
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
| selector | lux-layout-form-row |

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
  <lux-layout-form-row>
    <lux-input luxLabel="Element A" *luxLayoutRowItem="{}"></lux-input>
    <lux-input luxLabel="Element B" *luxLayoutRowItem="{}"></lux-input>
    <lux-input luxLabel="Element C" *luxLayoutRowItem="{}"></lux-input>
  </lux-layout-form-row>
</lux-layout>
```

Dabei ist es sehr wichtig, seine Formularelemente mit der Directive \*luxLayoutRowItem zu versehen,
da sie ansonsten nicht von dem umliegenden Layout gefunden werden können. Zusätzlich werden die Formularelemente
über die Directive konfiguriert. Beispiele folgen in den nächsten Abschnitten.

### Überschrift

Jede Zeile kann eine Überschrift (siehe luxTitle) haben.

HTML

```html
<lux-layout>
  <lux-layout-form-row luxTitle="Lorem ipsum">
    <lux-input luxLabel="Element A" *luxLayoutRowItem="{}"></lux-input>
    <lux-input luxLabel="Element B" *luxLayoutRowItem="{}"></lux-input>
    <lux-input luxLabel="Element C" *luxLayoutRowItem="{}"></lux-input>
  </lux-layout-form-row>
</lux-layout>
```

### Größere Formularelemente (colSpan: x)

Über das Property "colSpan" kann die Größe eines Elements festgelegt werden.
Im folgenden Beispiel sieht man ein 4-spaltiges Layout, bei dem das erste Element über zwei Spalten geht.
Bei dem zweiten Formularelement ist keine Konfiguration angegeben und deshalb greift hier der Default. D.h.
\*\luxLayoutRowItem ist eine verkürzte Schreibweise für \*luxLayoutRowItem="{ colSpan: 1, empty: false}".

HTML

```html
<lux-layout>
  <lux-layout-form-row luxTitle="Lorem ipsum">
    <lux-input
      luxLabel="Element A"
      *luxLayoutRowItem="{ colSpan: 2 }"
    ></lux-input>
    <lux-input luxLabel="Element B" *luxLayoutRowItem="{}"></lux-input>
    <lux-input luxLabel="Element C" *luxLayoutRowItem="{}"></lux-input>
  </lux-layout-form-row>
</lux-layout>
```

### Leerraum (empty: true)

Ein Leerraum kann über ein entsprechendes Div-Element realisiert werden. Im folgenden Beispiel sieht man
ein 4-spaltiges Layout, bei dem das erste Formularelement den halben Platz einnimmt und der Rest leer bleibt.

HTML

```html
<lux-layout>
  <lux-layout-form-row>
    <lux-input
      luxLabel="Element A"
      *luxLayoutRowItem="{ colSpan: 2 }"
    ></lux-input>
    <div *luxLayoutRowItem="{ empty: true, colSpan: 2 }"></div>
  </lux-layout-form-row>
</lux-layout>
```

### Gap

Der Gap kann über das Property "luxGap" angepasst werden.

HTML

```html
<lux-layout>
  <lux-layout-form-row
    [luxGap]="{ row: '50px', rowItem: '25px', column: '10px'}"
  >
    <lux-input luxLabel="Element A" *luxLayoutRowItem="{}"></lux-input>
    <lux-input luxLabel="Element B" *luxLayoutRowItem="{}"></lux-input>
    <lux-input luxLabel="Element C" *luxLayoutRowItem="{}"></lux-input>
  </lux-layout-form-row>
</lux-layout>
```

### Margin

Der Margin kann über das Property "luxMargin" angepasst werden.

HTML

```html
<lux-layout>
  <lux-layout-form-row
    [luxMargin]="{ xs: '10%', lg: '20%', marginLeft: true, marginRight: true}"
  >
    <lux-input luxLabel="Element A" *luxLayoutRowItem="{}"></lux-input>
    <lux-input luxLabel="Element B" *luxLayoutRowItem="{}"></lux-input>
    <lux-input luxLabel="Element C" *luxLayoutRowItem="{}"></lux-input>
  </lux-layout-form-row>
</lux-layout>
```

### Umbrechen

Über das Property "luxWrapAt" kann beeinflusst werden, wann aus der Zeile eine Spalte wird und
die Formularelemente anstatt nebeneinander untereinander angezeigt werden.

HTML

```html
<lux-layout>
  <lux-layout-form-row luxWrapAt="sm">
    <lux-input luxLabel="Element A" *luxLayoutRowItem="{}"></lux-input>
    <lux-input luxLabel="Element B" *luxLayoutRowItem="{}"></lux-input>
    <lux-input luxLabel="Element C" *luxLayoutRowItem="{}"></lux-input>
  </lux-layout-form-row>
</lux-layout>
```

### Layout über die zentrale Konfiguration global anpassen

Siehe [Config - Layout](config-v14#layout).

TS

```typescript
const myConfiguration: LuxComponentsConfigParameters = {
  [...]
  layout: {
    formRow: {
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

| Name    | Typ    | Beschreibung                                                                                                                                                                                 | Optional |
| ------- | ------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- |
| row     | string | Der Abstand zur nächsten Zeile (z.B. '4px'), wenn die Auflösung größer als [luxWrapAt](#umbrechen) ist. Darstellung der Elemente nebeneinander in einer Zeile.                               | ja       |
| rowItem | string | Der Abstand zum nächsten Element (z.B. '4px'), wenn die Auflösung größer als [luxWrapAt](#umbrechen) ist. Darstellung der Elemente nebeneinander in einer Zeile.                             | ja       |
| column  | string | Der Abstand zur nächsten Zeile und zum nächsten Element (z.B. '4px'), wenn die Auflösung kleiner gleich [luxWrapAt](#umbrechen) ist. Darstellung der Elemente untereinander in einer Spalte. | ja       |

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

| Name              | Typ     | Beschreibung                                                                             |
| ----------------- | ------- | ---------------------------------------------------------------------------------------- |
| colSpan           | number  | Gibt an, wie viel Platz ein Element einnimmt.                                            |
| empty             | boolean | Gibt an, ob es sich um ein leeres Element handelt.                                       |
| flex              | string  | Inhalt des fxFlex-Attributes (z.B. 'none').                                              |
| formNoTopLabel    | boolean | Steuert die vertikale Ausrichtung eines Buttons neben einem Formcontrol ohne Toplabel    |
| formNoBottomLabel | boolean | Steuert die vertikale Ausrichtung eines Buttons neben einem Formcontrol ohne Bottomlabel |

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

![Beispielbild 2-Spaltenlayout](https://raw.githubusercontent.com/wiki/IHK-GfI/lux-components/Versions/v14/lux‐layout‐form‐row-v14-2-spaltig-desktop.png)

Mobile

![Beispielbild 2-Spaltenlayout](https://raw.githubusercontent.com/wiki/IHK-GfI/lux-components/Versions/v14/lux‐layout‐form‐row-v14-2-spaltig-mobile.png)

HTML

```html
<lux-card>
  <lux-card-content>
    <lux-layout>
      <lux-layout-form-row luxTitle="2-Spaltenlayout">
        <lux-input luxLabel="Element A" *luxLayoutRowItem="{}"></lux-input>
        <lux-input luxLabel="Element B" *luxLayoutRowItem="{}"></lux-input>
      </lux-layout-form-row>
      <lux-layout-form-row>
        <lux-input
          luxLabel="Element C"
          *luxLayoutRowItem="{ colSpan: 2 }"
        ></lux-input>
      </lux-layout-form-row>
      <lux-layout-form-row>
        <lux-input luxLabel="Element D" *luxLayoutRowItem="{}"></lux-input>
        <div *luxLayoutRowItem="{ empty: true }"></div>
      </lux-layout-form-row>
    </lux-layout>
  </lux-card-content>
</lux-card>
```

### 3-Spaltenlayout

Desktop

![Beispielbild 3-Spaltenlayout](https://raw.githubusercontent.com/wiki/IHK-GfI/lux-components/Versions/v14/lux‐layout‐form‐row-v14-3-spaltig-desktop.png)

Mobile

![Beispielbild 3-Spaltenlayout](https://raw.githubusercontent.com/wiki/IHK-GfI/lux-components/Versions/v14/lux‐layout‐form‐row-v14-3-spaltig-mobile.png)

HTML

```html
<lux-card>
  <lux-card-content>
    <lux-layout>
      <lux-layout-form-row luxTitle="3-Spaltenlayout">
        <lux-input luxLabel="Element A" *luxLayoutRowItem="{}"></lux-input>
        <lux-input luxLabel="Element B" *luxLayoutRowItem="{}"></lux-input>
        <lux-input luxLabel="Element C" *luxLayoutRowItem="{}"></lux-input>
      </lux-layout-form-row>
      <lux-layout-form-row>
        <lux-input
          luxLabel="Element D"
          *luxLayoutRowItem="{ colSpan: 2 }"
        ></lux-input>
        <lux-input luxLabel="Element E" *luxLayoutRowItem="{}"></lux-input>
      </lux-layout-form-row>
      <lux-layout-form-row>
        <lux-input
          luxLabel="Element F"
          *luxLayoutRowItem="{ colSpan: 2 }"
        ></lux-input>
        <div *luxLayoutRowItem="{ empty: true }"></div>
      </lux-layout-form-row>
      <lux-layout-form-row>
        <lux-input
          luxLabel="Element G"
          *luxLayoutRowItem="{ colSpan: 3 }"
        ></lux-input>
      </lux-layout-form-row>
    </lux-layout>
  </lux-card-content>
</lux-card>
```
