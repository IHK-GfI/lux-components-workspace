# LUX-Divider

![Beispielbild LUX-Divider](lux‐divider-v21-img.png)

- [LUX-Divider](#lux-divider)
  - [Overview / API](#overview--api)
    - [Allgemein](#allgemein)
    - [@Input](#input)
  - [Beispiele](#beispiele)
    - [1. Horizontal Divider](#1-horizontal-divider)
    - [2. Vertical Divider](#2-vertical-divider)

## Overview / API

### Allgemein

| Name     | Beschreibung    |
| -------- | --------------- |
| selector | lux-divider     |

### @Input

| Name        | Typ     | Beschreibung                                                                                                         |
| ----------- | ------- | -------------------------------------------------------------------------------------------------------------------- |
| luxInset    | boolean | Bestimmt ob der Divider über die komplette Breite der aktuellen Komponente geht oder nur mit einem leichten Versatz. |
| luxVertical | boolean | Bestimmt ob der Divider vertikal oder horizontal dargestellt wird.                                                   |

## Beispiele

### 1. Horizontal Divider

![Beispielbild 01](lux‐divider-v21-img-01.png)

Html

```html
<div class="lux-flex lux-flex-col">
  <p>Lorem ipsum</p>
  <lux-divider></lux-divider>
  <p>Dolor sit amet</p>
</div>
```

### 2. Vertical Divider

![Beispielbild 02](lux‐divider-v21-img-02.png)

Html

```html
<div class="lux-flex">
  <p>Lorem ipsum</p>
  <lux-divider [luxVertical]="true"></lux-divider>
  <p>Dolor sit amet</p>
</div>
```
