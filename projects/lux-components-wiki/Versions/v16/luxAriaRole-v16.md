# luxAriaRole

- [luxAriaRole](#luxariarole)
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
| selector | luxAriaRole         |

### @Input

| Name                | Typ    | Beschreibung                                                                                                    |
| ------------------- | ------ | --------------------------------------------------------------------------------------------------------------- |
| luxAriaRole         | string | Gibt die Rolle (z.B. region, button, list, listitem,...) des Elements an.                                       |
| luxAriaRoleSelector | string | Über den CSS-Selector (z.B. button) kann das Element beeinflusst werden, an dem das Aria-Attribut gehängt wird. |

## Beispiel

Html

```html
<lux-card
  luxTitle="Wichtiges Beispiel"
  luxAriaRole="region"
  luxAriaLabel="Bitte das Beispiel beachten"
>
  <lux-card-content> ... </lux-card-content>
</lux-card>
```
