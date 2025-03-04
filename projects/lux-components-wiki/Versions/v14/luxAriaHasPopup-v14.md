# luxAriaHasPopup

- [luxAriaHasPopup](#luxariahaspopup)
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
| selector | luxAriaHasPopup     |

### @Input

| Name                    | Typ     | Beschreibung                                                                                                    |
| ----------------------- | ------- | --------------------------------------------------------------------------------------------------------------- |
| luxAriaHasPopup         | boolean | Gibt an, ob das Element (z.B. Select) über ein Popup verfügt.                                                   |
| luxAriaHasPopupSelector | string  | Über den CSS-Selector (z.B. button) kann das Element beeinflusst werden, an dem das Aria-Attribut gehängt wird. |

## Beispiel

Ts

```typescript
myPopupState = false;
```

Html

```typescript
<lux-button luxIconName="lux-interface-setting-menu-1" [luxAriaHasPopup]="myPopupState" luxAriaLabel="Namen"></lux-button>
```
