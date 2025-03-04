# luxAriaHidden

- [luxAriaHidden](#luxariahidden)
  - [Overview / API](#overview--api)
    - [Allgemein](#allgemein)
    - [@Input](#input)
  - [Beispiel](#beispiel)

## Overview / API

### Allgemein

ARIA steht für Accessible Rich Internet Applications.

Über die LUX-ARIA-XXX-Direktiven können die LUX-Components mit ARIA-Tags versehen werden,
um möglichst barrierefreie Anwendungen zu erstellen.

| Name     | Beschreibung        |
| -------- | ------------------- |
| import   | LuxDirectivesModule |
| selector | luxAriaHidden       |

### @Input

| Name                  | Typ     | Beschreibung                                                                                                |
| --------------------- | ------- | ----------------------------------------------------------------------------------------------------------- |
| luxAriaHidden         | boolean | Gibt an, ob das Element (z.B. Divider) von Screenreadern berücksichtigt werden soll.                        |
| luxAriaHiddenSelector | string  | Über den CSS-Selector (z.B. hr) kann das Element beeinflusst werden, an dem das Aria-Attribut gehängt wird. |

## Beispiel

Html

```html
<lux-divider [luxAriaHidden]="true"></lux-divider>
```
