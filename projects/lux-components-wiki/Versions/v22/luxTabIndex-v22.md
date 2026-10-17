# luxTabIndex

- [luxTabIndex](#luxtabindex)
  - [Overview / API](#overview--api)
    - [Allgemein](#allgemein)
    - [@Input](#input)
  - [Beispiele](#beispiele)
    - [1. Simple](#1-simple)
    - [2. Nur Parent mit Tabindex versehen](#2-nur-parent-mit-tabindex-versehen)
    - [3. Nur spezielle Children mit Tabindex versehen](#3-nur-spezielle-children-mit-tabindex-versehen)

## Overview / API

### Allgemein

| Name     | Beschreibung |
| -------- | ------------ |
| selector | luxTabIndex  |

### @Input

| Name                 | Typ      | Beschreibung                                                                                                                                                           |
| -------------------- | -------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| luxTabIndex          | string   | Bestimmt den TabIndex für das Ziel dieser Direktive. Default: '0'.                                                                                                     |
| luxApplyToParent     | boolean  | Bestimmt, ob der Tab-Index auch für das Parent-Element des Ziels gelten soll. Default: false.                                                                          |
| luxApplyToChildren   | boolean  | Bestimmt, ob die Direktive die Kind-Elemente des Ziels nach den luxPotentialChildren durchsucht und für sie den Tab-Index setzt. Default: true.                        |
| luxPotentialChildren | string[] | Enthält ein Array mit den möglichen Kind-Elementen des Ziels, welche für einen Tab-Index in Frage kommen. Default: ['input', 'textarea', 'a', 'button', 'mat-select']. |

## Beispiele

### 1. Simple

Html

```html
<div class="lux-flex lux-gap-4">
  <lux-datepicker
    luxLabel="Tabindex 1 (LuxDatepicker)"
    luxTabIndex="1"
  />
  <lux-checkbox
    luxLabel="Tabindex 3 (LuxCheckbox)"
    luxTabIndex="3"
  />
  <lux-select
    luxLabel="Tabindex 2 (LuxSelect)"
    luxTabIndex="2"
  />
  <lux-toggle
    luxLabel="Tabindex 4 (LuxToggle)"
    luxTabIndex="4"
  />
  <lux-button
    luxLabel="Tabindex 5 (LuxButton)"
    luxTabIndex="5"
  />
</div>
```

### 2. Nur Parent mit Tabindex versehen

Html

```html
<div class="lux-flex lux-gap-4">
  <lux-input
    luxLabel="Tabindex 1"
    luxTabIndex="1"
    [luxApplyToParent]="true"
    [luxApplyToChildren]="false"
  />
  <lux-input
    luxLabel="Tabindex 3"
    luxTabIndex="3"
    [luxApplyToParent]="true"
    [luxApplyToChildren]="false"
  />
  <lux-input
    luxLabel="Tabindex 2"
    luxTabIndex="2"
    [luxApplyToParent]="true"
    [luxApplyToChildren]="false"
  />
  <lux-input
    luxLabel="Tabindex 4"
    luxTabIndex="4"
    [luxApplyToParent]="true"
    [luxApplyToChildren]="false"
  />
</div>
```

### 3. Nur spezielle Children mit Tabindex versehen

Ts

```typescript
readonly children = ["input", "button", "a", "textarea", "div", "span"];
```

Html

```html
<div class="lux-flex lux-gap-4">
  <lux-datepicker
    luxLabel="Tabindex 1 (LuxDatepicker)"
    luxTabIndex="1"
    [luxPotentialChildren]="children"
  />
  <lux-checkbox
    luxLabel="Tabindex 3 (LuxCheckbox)"
    luxTabIndex="3"
    [luxPotentialChildren]="children"
  />
  <lux-select
    luxLabel="Tabindex 2 (LuxSelect)"
    luxTabIndex="2"
    [luxPotentialChildren]="children"
  />
  <lux-toggle
    luxLabel="Tabindex 4 (LuxToggle)"
    luxTabIndex="4"
    [luxPotentialChildren]="children"
  />
  <lux-button
    luxLabel="Tabindex 5 (LuxButton)"
    luxTabIndex="5"
    [luxPotentialChildren]="children"
  />
</div>
```
