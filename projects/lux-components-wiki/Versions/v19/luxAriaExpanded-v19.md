# luxAriaExpanded

- [luxAriaExpanded](#luxariaexpanded)
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
| selector | luxAriaExpanded     |

### @Input

| Name                    | Typ     | Beschreibung                                                                                                    |
| ----------------------- | ------- | --------------------------------------------------------------------------------------------------------------- |
| luxAriaExpanded         | boolean | Gibt an, ob das Element (z.B. Button mit Menü) aufgeklappt ist.                                                 |
| luxAriaExpandedSelector | string  | Über den CSS-Selector (z.B. button) kann das Element beeinflusst werden, an dem das Aria-Attribut gehängt wird. |

## Beispiel

Ts

```typescript
myExpandedState = false;
```

Html

```html
<lux-button
  luxIconName="lux-interface-setting-menu-1"
  [luxAriaExpanded]="myExpandedState"
  luxAriaLabel="Appmenü"
></lux-button>
```
