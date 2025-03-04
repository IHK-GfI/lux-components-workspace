# luxTabindex

- [luxTabindex](#luxtabindex)
  - [Overview / API](#overview--api)
    - [Allgemein](#allgemein)
    - [@Input](#input)
  - [Beispiele](#beispiele)
    - [1. Simple](#1-simple)
    - [2. Nur Parent mit Tabindex versehen](#2-nur-parent-mit-tabindex-versehen)
    - [3. Nur spezielle Children mit Tabindex versehen](#3-nur-spezielle-children-mit-tabindex-versehen)

## Overview / API

### Allgemein

| Name     | Beschreibung        |
| -------- | ------------------- |
| import   | LuxDirectivesModule |
| selector | luxTabIndex         |

### @Input

| Name                 | Typ      | Beschreibung                                                                                                                     |
| -------------------- | -------- | -------------------------------------------------------------------------------------------------------------------------------- |
| luxTabIndex          | string   | Bestimmt den TabIndex für das Ziel dieser Direktive.                                                                             |
| luxApplyToParent     | boolean  | Bestimmt, ob der Tab-Index auch für das Parent-Element des Ziels gelten soll.                                                    |
| luxApplyToChildren   | boolean  | Bestimmt, ob die Direktive die Kind-Elemente des Ziels nach den luxPotentialChildren durchsucht und für sie den Tab-Index setzt. |
| luxPotentialChildren | string[] | Enthält ein Array mit den möglichen Kind-Elementen des Ziels, welche für einen Tab-Index in Frage kommen.                        |

## Beispiele

### 1. Simple

Html

```html
<lux-datepicker-ac
  luxLabel="Tabindex 1 (LuxDatepicker)"
  luxTabIndex="1"
></lux-datepicker-ac>
<lux-checkbox-ac
  luxLabel="Tabindex 3 (LuxCheckbox)"
  luxTabIndex="3"
></lux-checkbox-ac>
<lux-select-ac
  luxLabel="Tabindex 2 (LuxSelect)"
  luxTabIndex="2"
></lux-select-ac>
<lux-toggle-ac
  luxLabel="Tabindex 4 (LuxToggle)"
  luxTabIndex="4"
></lux-toggle-ac>
<lux-button-ac
  luxLabel="Tabindex 5 (LuxButton)"
  luxTabIndex="5"
></lux-button-ac>
```

### 2. Nur Parent mit Tabindex versehen

Html

```html
<lux-input-ac
  placeholder="Tabindex 1"
  luxTabIndex="1"
  [luxApplyToParent]="true"
  [luxApplyToChildren]="false"
></lux-input-ac>
<lux-input-ac
  placeholder="Tabindex 3"
  luxTabIndex="3"
  [luxApplyToParent]="true"
  [luxApplyToChildren]="false"
></lux-input-ac>
<lux-input-ac
  placeholder="Tabindex 2"
  luxTabIndex="2"
  [luxApplyToParent]="true"
  [luxApplyToChildren]="false"
></lux-input-ac>
<lux-input-ac
  placeholder="Tabindex 4"
  luxTabIndex="4"
  [luxApplyToParent]="true"
  [luxApplyToChildren]="false"
></lux-input-ac>
```

### 3. Nur spezielle Children mit Tabindex versehen

Ts

```typescript
children = ["input", "button", "a", "textarea", "div", "span"];
```

Html

```html
<lux-datepicker-ac
  luxLabel="Tabindex 1 (LuxDatepicker)"
  luxTabIndex="1"
  [luxPotentialChildren]="children"
></lux-datepicker-ac>
<lux-checkbox-ac
  luxLabel="Tabindex 3 (LuxCheckbox)"
  luxTabIndex="3"
  [luxPotentialChildren]="children"
></lux-checkbox-ac>
<lux-select-ac
  luxLabel="Tabindex 2 (LuxSelect)"
  luxTabIndex="2"
  [luxPotentialChildren]="children"
></lux-select-ac>
<lux-toggle-ac
  luxLabel="Tabindex 4 (LuxToggle)"
  luxTabIndex="4"
  [luxPotentialChildren]="children"
></lux-toggle-ac>
<lux-button-ac
  luxLabel="Tabindex 5 (LuxButton)"
  luxTabIndex="5"
  [luxPotentialChildren]="children"
></lux-button-ac>
```
