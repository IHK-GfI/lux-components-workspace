# LUX-Label

- [LUX-Label](#lux-label)
  - [Overview / API](#overview--api)
    - [Allgemein](#allgemein)
    - [@Input](#input)
  - [Beispiel](#beispiel)

## Overview / API

### Allgemein

| Name     | Beschreibung    |
| -------- | --------------- |
| import   | LuxCommonModule |
| selector | lux-label       |

### @Input

| Name  | Typ    | Beschreibung                                               |
| ----- | ------ | ---------------------------------------------------------- |
| luxId | string | Setzt die (HTML-)ID des spans, welches den Inhalt anzeigt. |

## Beispiel

![Beispielbild 01](https://raw.githubusercontent.com/wiki/IHK-GfI/lux-components/Versions/v15/lux‐label-v15-img-01.png)

Html

```html
<lux-label luxId="gesamtsummePKW">21.000,00 EUR</lux-label>
```
