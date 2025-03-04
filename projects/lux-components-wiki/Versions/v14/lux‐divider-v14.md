# LUX-Divider

![Beispielbild LUX-Divider](https://raw.githubusercontent.com/wiki/IHK-GfI/lux-components/Versions/v14/lux‐divider-v14-img.png)

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
| import   | LuxLayoutModule |
| selector | lux-divider     |

### @Input

| Name        | Typ     | Beschreibung                                                                                                         |
| ----------- | ------- | -------------------------------------------------------------------------------------------------------------------- |
| luxInset    | boolean | Bestimmt ob der Divider über die komplette Breite der aktuellen Komponente geht oder nur mit einem leichten Versatz. |
| luxVertical | boolean | Bestimmt ob der Divider vertikal oder horizontal dargestellt wird.                                                   |

## Beispiele

### 1. Horizontal Divider

![Beispielbild 01](https://raw.githubusercontent.com/wiki/IHK-GfI/lux-components/Versions/v14/lux‐divider-v14-img-01.png)

Html

```html
<div fxLayout="column">
  <p>Lorem ipsum</p>
  <lux-divider></lux-divider>
  <p>Dolor sit amet</p>
</div>
```

### 2. Vertical Divider

![Beispielbild 01](https://raw.githubusercontent.com/wiki/IHK-GfI/lux-components/Versions/v14/lux‐divider-v14-img-01.png)

Html

```html
<div fxLayout="row">
  <p>Lorem ipsum</p>
  <lux-divider [luxVertical]="true"></lux-divider>
  <p>Dolor sit amet</p>
</div>
```
