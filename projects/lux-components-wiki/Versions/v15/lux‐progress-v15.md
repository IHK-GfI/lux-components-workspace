# LUX-Progress

![Beispielbild LUX-Progress](https://raw.githubusercontent.com/wiki/IHK-GfI/lux-components/Versions/v15/lux‐progress-v15-img.png)

- [LUX-Progress](#lux-progress)
  - [Overview / API](#overview--api)
    - [Allgemein](#allgemein)
    - [@Input](#input)
    - [Werte - luxSize](#werte---luxsize)
  - [Beispiele](#beispiele)
    - [1. Progressbar](#1-progressbar)
    - [2. Progressbar (bunt / groß)](#2-progressbar-bunt--groß)
    - [3. Spinner](#3-spinner)
    - [4. Spinner (bunt)](#4-spinner-bunt)

## Overview / API

### Allgemein

| Name     | Beschreibung    |
| -------- | --------------- |
| import   | LuxCommonModule |
| selector | lux-progress    |

### @Input

| Name     | Typ                 | Beschreibung                                                                                                                                                                                   |
| -------- | ------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| luxMode  | LuxProgressModeType | Bestimmt in welchem Modus diese Komponente läuft. Mögliche Werte: 'determinate' = Zeigt den luxValue-Wert als Fortschritt an bis dieser 100 erreicht hat 'indeterminate' = Läuft endlos weiter |
| luxType  | LuxProgressType     | Bestimmt den Typ dieser Komponente. Mögliche Werte: 'Progressbar' 'Spinner'                                                                                                                    |
| luxValue | number              | Bestimmt den aktuellen Wert und somit den Fortschritt der Progress-Komponente (nur bei Mode = 'determinate' oder 'buffer').                                                                    |
| luxSize  | LuxProgressSizeType | Bestimmt die Größe des ProgressBars/-Spinners (siehe Werte - luxSize).                                                                                                                         |
| luxColor | LuxProgressColor    | Bestimmt die Farbe des ProgressBars/-Spinners.                                                                                                                                                 |
| luxTagId | string              | [LUX-Tag-Id](luxTagId-v15#direkte-konfiguration) für die automatischen Tests.                                                                                                                  |

### Werte - luxSize

| Werte  | Höhe in ProgressBar | Durchmesser in Spinner |
| ------ | ------------------- | ---------------------- |
| small  | 6px                 | 24px                   |
| medium | 12px                | 48px                   |
| large  | 24px                | 96px                   |

## Beispiele

### 1. Progressbar

![Beispielbild 01](https://raw.githubusercontent.com/wiki/IHK-GfI/lux-components/Versions/v15/lux‐progress-v15-img-01.png)

Ts

```typescript
barValue: number     = 0;

addBarProgress() {
  this.barValue = this.barValue + 10 > 100 ? 100 : this.barValue + 10;
}

subtractBarProgress() {
  this.barValue = this.barValue - 10 < 0 ? 0 : this.barValue - 10;
}
```

Html

```html
<lux-card luxTitle="Progressbar" [luxTitleLineBreak]="true">
  <lux-card-content>
    <h2>Progressbar: indeterminate</h2>
    <lux-progress luxType="Progressbar" luxMode="indeterminate"></lux-progress
    ><br />
    <h2>Progressbar: determinate | {{barValue}}/100</h2>
    <lux-progress
      luxType="Progressbar"
      luxMode="determinate"
      [luxValue]="barValue"
    ></lux-progress
    ><br />
  </lux-card-content>
  <lux-card-actions>
    <lux-button
      luxLabel="+10"
      (luxClicked)="addBarProgress()"
      [luxStroked]="true"
    ></lux-button>
    <lux-button
      luxLabel="-10"
      (luxClicked)="subtractBarProgress()"
      [luxStroked]="true"
    ></lux-button>
  </lux-card-actions>
</lux-card>
```

### 2. Progressbar (bunt / groß)

![Beispielbild 02-01](https://raw.githubusercontent.com/wiki/IHK-GfI/lux-components/Versions/v15/lux‐progress-v15-img-02-01.png)

Html

```html
<lux-progress luxType="Progressbar" luxColor="red"></lux-progress>
<p></p>
<lux-progress luxType="Progressbar" luxColor="green"></lux-progress>
<p></p>
<lux-progress luxType="Progressbar" luxColor="blue"></lux-progress>
<p></p>
<lux-progress luxType="Progressbar" luxColor="gray"></lux-progress>
<p></p>
<lux-progress luxType="Progressbar" luxColor="orange"></lux-progress>
<p></p>
<lux-progress luxType="Progressbar" luxColor="brown"></lux-progress>
```

![Beispielbild 02-02](https://raw.githubusercontent.com/wiki/IHK-GfI/lux-components/Versions/v15/lux‐progress-v15-img-02-02.png)

Html

```html
<lux-progress luxType="Progressbar" luxSize="small"></lux-progress>
<p></p>
<lux-progress luxType="Progressbar" luxSize="medium"></lux-progress>
<p></p>
<lux-progress luxType="Progressbar" luxSize="large"></lux-progress>
```

### 3. Spinner

![Beispielbild 03](https://raw.githubusercontent.com/wiki/IHK-GfI/lux-components/Versions/v15/lux‐progress-v15-img-03.png)

Ts

```typescript
spinnerValue: number     = 0;

addSpinnerProgress() {
  this.spinnerValue = this.spinnerValue + 25 > 100 ? 100 : this.spinnerValue + 25;
}

subtractSpinnerProgress() {
  this.spinnerValue = this.spinnerValue - 25 < 0 ? 0 : this.spinnerValue - 25;
}
```

Html

```html
<lux-card luxTitle="Spinner" [luxTitleLineBreak]="true">
  <lux-card-content>
    <h2>Spinner: indeterminate</h2>
    <lux-progress
      luxType="Spinner"
      luxMode="indeterminate"
      luxAnimationDuration="slow"
    ></lux-progress
    ><br />
    <h2>Spinner: determinate | {{spinnerValue}}/100</h2>
    <lux-progress
      luxType="Spinner"
      luxMode="determinate"
      [luxValue]="spinnerValue"
    ></lux-progress
    ><br />
  </lux-card-content>
  <lux-card-actions>
    <lux-button
      luxLabel="+25"
      (luxClicked)="addSpinnerProgress()"
      [luxStroked]="true"
    ></lux-button>
    <lux-button
      luxLabel="-25"
      (luxClicked)="subtractSpinnerProgress()"
      [luxStroked]="true"
    ></lux-button>
  </lux-card-actions>
</lux-card>
```

### 4. Spinner (bunt)

![Beispielbild 04-01](https://raw.githubusercontent.com/wiki/IHK-GfI/lux-components/Versions/v15/lux‐progress-v15-img-04-01.png)

Html

```html
<lux-progress luxType="Spinner" luxColor="red"></lux-progress>
<p></p>
<lux-progress luxType="Spinner" luxColor="green"></lux-progress>
<p></p>
<lux-progress luxType="Spinner" luxColor="blue"></lux-progress>
<p></p>
<lux-progress luxType="Spinner" luxColor="gray"></lux-progress>
<p></p>
<lux-progress luxType="Spinner" luxColor="orange"></lux-progress>
<p></p>
<lux-progress luxType="Spinner" luxColor="brown"></lux-progress>
```

![Beispielbild 04-02](https://raw.githubusercontent.com/wiki/IHK-GfI/lux-components/Versions/v15/lux‐progress-v15-img-04-02.png)

Html

```html
<lux-progress luxType="Spinner" luxSize="small"></lux-progress>
<p></p>
<lux-progress luxType="Spinner" luxSize="medium"></lux-progress>
<p></p>
<lux-progress luxType="Spinner" luxSize="large"></lux-progress>
```
