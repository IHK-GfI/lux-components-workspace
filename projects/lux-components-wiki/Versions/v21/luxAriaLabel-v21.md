# luxAriaLabel

- [luxAriaLabel](#luxarialabel)
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
| selector | luxAriaLabel        |

### @Input

| Name                 | Typ    | Beschreibung                                                                                                    |
| -------------------- | ------ | --------------------------------------------------------------------------------------------------------------- |
| luxAriaLabel         | string | Die Bezeichnung für Screenreader.                                                                               |
| luxAriaLabelSelector | string | Über den CSS-Selector (z.B. button) kann das Element beeinflusst werden, an dem das Aria-Attribut gehängt wird. |

## Beispiel

Html

```html
<lux-button
  luxIconName="lux-interface-delete-1"
  luxAriaLabel="Nachricht schließen"
></lux-button>
```
