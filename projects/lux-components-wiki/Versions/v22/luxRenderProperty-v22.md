# luxRenderProperty

- [luxRenderProperty](#luxrenderproperty)
  - [Overview / API](#overview--api)
    - [Allgemein](#allgemein)
    - [@Input](#input)
  - [Beispiel](#beispiel)

## Overview / API

### Allgemein

| Name     | Beschreibung      |
| -------- | ----------------- |
| name     | luxRenderProperty |

### @Input

| Name               | Typ    | Beschreibung                                                |
| ------------------ | ------ | ----------------------------------------------------------- |
| luxRenderProperty  | any    | Input-Wert der Pipe (muss nicht explizit ausgefüllt werden) |
| renderPropertyName | string | Name der Property, die aus dem Objekt gelesen werden soll.  |

## Beispiel

Ts

```typescript
readonly exampleObject = { propertyXY: "Maxi Musterline" };
```

Html

```html
<div>{{ exampleObject | luxRenderProperty:'propertyXY' }}</div>
```
