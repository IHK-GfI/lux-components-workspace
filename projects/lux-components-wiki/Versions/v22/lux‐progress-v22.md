# LUX-Progress

![Beispielbild LUX-Progress](https://raw.githubusercontent.com/IHK-GfI/lux-components-workspace/main/projects/lux-components-wiki/Versions/v22/lux‐progress-v22-img.png)

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
| selector | lux-progress    |

### @Input

| Name         | Typ                 | Beschreibung                                                                                                                                                                                   |
| ------------ | ------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| luxMode | LuxProgressModeType | Bestimmt, in welchem Modus diese Komponente läuft. Mögliche Werte: 'determinate' = zeigt den luxValue-Wert als Fortschritt an, bis dieser 100 erreicht hat; 'indeterminate' = läuft endlos weiter. Default: 'indeterminate'. |
| luxType | LuxProgressType | Bestimmt den Typ dieser Komponente. Mögliche Werte: 'Progressbar', 'Spinner'. Default: 'Progressbar'. |
| luxValue | number | Bestimmt den aktuellen Wert (0-100) und somit den Fortschritt der Progress-Komponente (nur bei luxMode = 'determinate'). Default: 0. |
| luxSize | LuxProgressSizeType | Bestimmt die Größe des ProgressBars/-Spinners (siehe Werte - luxSize). Default: 'medium'. |
| luxColor | LuxProgressColor | Bestimmt die Farbe des ProgressBars/-Spinners. Mögliche Werte: `red`, `green`, `purple`, `blue`, `gray`, `orange`, `yellow`, `pink`, `lightblue`. Default: `blue`. |
| luxTagId     | string              | [LUX-Tag-Id](luxTagId-v22#direkte-konfiguration) für die automatischen Tests.                                                                                                                  |
| luxAriaLabel | string | Die Bezeichnung für Screenreader. Default: ''. |

### Werte - luxSize

| Werte  | Höhe in ProgressBar | Durchmesser in Spinner |
| ------ | ------------------- | ---------------------- |
| small  | 6px                 | 24px                   |
| medium | 12px                | 48px                   |
| large  | 24px                | 96px                   |

## Beispiele

### 1. Progressbar

![Beispielbild 01](https://raw.githubusercontent.com/IHK-GfI/lux-components-workspace/main/projects/lux-components-wiki/Versions/v22/lux‐progress-v22-img-01.png)

Ts

```typescript
readonly barValue = signal(0);

addBarProgress() {
  this.barValue.update((value) => Math.min(value + 10, 100));
}

subtractBarProgress() {
  this.barValue.update((value) => Math.max(value - 10, 0));
}
```

Html

```html
<lux-card luxTitle="Progressbar" [luxTitleLineBreak]="true">
  <lux-card-content>
    <h2>Progressbar: indeterminate</h2>
    <lux-progress luxType="Progressbar" luxMode="indeterminate" /><br />
    <h2>Progressbar: determinate | {{ barValue() }}/100</h2>
    <lux-progress
      luxType="Progressbar"
      luxMode="determinate"
      [luxValue]="barValue()"
    /><br />
  </lux-card-content>
  <lux-card-actions>
    <lux-button
      luxLabel="+10"
      (luxClicked)="addBarProgress()"
      [luxStroked]="true"
    />
    <lux-button
      luxLabel="-10"
      (luxClicked)="subtractBarProgress()"
      [luxStroked]="true"
    />
  </lux-card-actions>
</lux-card>
```

### 2. Progressbar (bunt / groß)

![Beispielbild 02-01](https://raw.githubusercontent.com/IHK-GfI/lux-components-workspace/main/projects/lux-components-wiki/Versions/v22/lux‐progress-v22-img-02-01.png)

Html

```html
<lux-progress luxType="Progressbar" luxColor="red" />
<p></p>
<lux-progress luxType="Progressbar" luxColor="green" />
<p></p>
<lux-progress luxType="Progressbar" luxColor="blue" />
<p></p>
<lux-progress luxType="Progressbar" luxColor="gray" />
<p></p>
<lux-progress luxType="Progressbar" luxColor="orange" />
<p></p>
<lux-progress luxType="Progressbar" luxColor="purple" />
```

![Beispielbild 02-02](https://raw.githubusercontent.com/IHK-GfI/lux-components-workspace/main/projects/lux-components-wiki/Versions/v22/lux‐progress-v22-img-02-02.png)

Html

```html
<lux-progress luxType="Progressbar" luxSize="small" />
<p></p>
<lux-progress luxType="Progressbar" luxSize="medium" />
<p></p>
<lux-progress luxType="Progressbar" luxSize="large" />
```

### 3. Spinner

![Beispielbild 03](https://raw.githubusercontent.com/IHK-GfI/lux-components-workspace/main/projects/lux-components-wiki/Versions/v22/lux‐progress-v22-img-03.png)

Ts

```typescript
readonly spinnerValue = signal(0);

addSpinnerProgress() {
  this.spinnerValue.update((value) => Math.min(value + 25, 100));
}

subtractSpinnerProgress() {
  this.spinnerValue.update((value) => Math.max(value - 25, 0));
}
```

Html

```html
<lux-card luxTitle="Spinner" [luxTitleLineBreak]="true">
  <lux-card-content>
    <h2>Spinner: indeterminate</h2>
    <lux-progress luxType="Spinner" luxMode="indeterminate" /><br />
    <h2>Spinner: determinate | {{ spinnerValue() }}/100</h2>
    <lux-progress
      luxType="Spinner"
      luxMode="determinate"
      [luxValue]="spinnerValue()"
    /><br />
  </lux-card-content>
  <lux-card-actions>
    <lux-button
      luxLabel="+25"
      (luxClicked)="addSpinnerProgress()"
      [luxStroked]="true"
    />
    <lux-button
      luxLabel="-25"
      (luxClicked)="subtractSpinnerProgress()"
      [luxStroked]="true"
    />
  </lux-card-actions>
</lux-card>
```

### 4. Spinner (bunt)

![Beispielbild 04-01](https://raw.githubusercontent.com/IHK-GfI/lux-components-workspace/main/projects/lux-components-wiki/Versions/v22/lux‐progress-v22-img-04-01.png)

Html

```html
<lux-progress luxType="Spinner" luxColor="red" />
<p></p>
<lux-progress luxType="Spinner" luxColor="green" />
<p></p>
<lux-progress luxType="Spinner" luxColor="blue" />
<p></p>
<lux-progress luxType="Spinner" luxColor="gray" />
<p></p>
<lux-progress luxType="Spinner" luxColor="orange" />
<p></p>
<lux-progress luxType="Spinner" luxColor="purple" />
```

![Beispielbild 04-02](https://raw.githubusercontent.com/IHK-GfI/lux-components-workspace/main/projects/lux-components-wiki/Versions/v22/lux‐progress-v22-img-04-02.png)

Html

```html
<lux-progress luxType="Spinner" luxSize="small" />
<p></p>
<lux-progress luxType="Spinner" luxSize="medium" />
<p></p>
<lux-progress luxType="Spinner" luxSize="large" />
```
