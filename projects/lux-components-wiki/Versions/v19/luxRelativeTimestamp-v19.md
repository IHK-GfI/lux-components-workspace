# luxRelativeTimestamp

![Beispielbild LUX-Relative-Timestamp](https://raw.githubusercontent.com/wiki/IHK-GfI/lux-components/Versions/v18/luxRelativeTimestamp-v18-img.png)

- [luxRelativeTimestamp](#luxrelativetimestamp)
  - [Overview / API](#overview--api)
    - [Allgemein](#allgemein)
    - [@Input](#input)
  - [Beispiele](#beispiele)
    - [1. Simple](#1-simple)
    - [2. Custom Prefix](#2-custom-prefix)

## Overview / API

### Allgemein

Eine Pipe die es möglich macht, einen Timestamp in eine relative Zeitangabe umzuwandeln.

| Name     | Beschreibung         |
| -------- | -------------------- |
| selector | luxRelativeTimestamp |

### @Input

| Name        | Typ            | Beschreibung                                                                        |
| ----------- | -------------- | ----------------------------------------------------------------------------------- |
| timestamp   | number \| null | Input-Wert der Pipe (muss nicht explizit bei Aufruf gefüllt werden)                 |
| defaultText | string         | Parameter der den Default-Text anzeigt, wenn der timestamp-Wert null/undefined ist. |
| prefix      | string         | Parameter der einen alternativen Präfix (anstelle von "in/vor") forciert.           |

## Beispiele

### 1. Simple

Mögliche Ausgaben: Gestern, Heute, Morgen, [in/vor] x Tagen/Wochen/Monaten/Jahren.

Html

```html
<p>
  {{1506525151786 | luxRelativeTimestamp }} <br />
  {{1506525151786 | luxRelativeTimestamp: 'Keine Fälligkeit'}} <br />
</p>
```

### 2. Custom Prefix

Mögliche Ausgaben: Gestern, Heute, Morgen, seit x Tagen/Wochen/Monaten/Jahren.

Html

```html
<p>
  {{1506525151786 | luxRelativeTimestamp: 'Keine Fälligkeit': 'seit'}} <br />
</p>
```
