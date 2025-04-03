# luxAriaDescribedBy

- [luxAriaDescribedBy](#luxariadescribedby)
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
| selector | luxAriaDescribedby  |

### @Input

| Name                       | Typ    | Beschreibung                                                                                                    |
| -------------------------- | ------ | --------------------------------------------------------------------------------------------------------------- |
| luxAriaDescribedby         | string | Gibt die ID des beschreibenden Elements an.                                                                     |
| luxAriaDescribedbySelector | string | Über den CSS-Selector (z.B. button) kann das Element beeinflusst werden, an dem das Aria-Attribut gehängt wird. |

## Beispiel

Html

```html
<lux-button luxLabel="Speichern" luxAriaDescribedby="save-hint"></lux-button>
<div id="save-hint">Bitte vergessen Sie nicht die AGBs zu akzeptieren!</div>
```
