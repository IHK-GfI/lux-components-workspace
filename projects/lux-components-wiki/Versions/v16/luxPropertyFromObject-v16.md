# luxPropertyFromObject

- [luxPropertyFromObject](#luxpropertyfromobject)
  - [Overview / API](#overview--api)
    - [Allgemein](#allgemein)
    - [@Input](#input)
  - [Beispiel](#beispiel)

## Overview / API

### Allgemein

| Name     | Beschreibung          |
| -------- | --------------------- |
| import   | LuxPipesModule        |
| selector | luxPropertyFromObject |

### @Input

| Name                  | Typ    | Beschreibung                                                                                                                                           |
| --------------------- | ------ | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| luxPropertyFromObject | any    | Input-Wert der Pipe (muss nicht explizit ausgefüllt werden)                                                                                            |
| propertyNamePath      | string | Enthält den "Pfad" zur gesuchten Property. Das kann direkt der Name der Property, aber auch über mehrere Unterobjekte verzweigt sein (siehe Beispiel). |

## Beispiel

Ts

```typescript
exampleObject = {
  subObject: {
    propertyXY: "Maxi Musterline",
  },
};
```

Html

```html
<div>{{ exampleObject | luxPropertyFromObject:'subObject.propertyXY' }}</div>
```
