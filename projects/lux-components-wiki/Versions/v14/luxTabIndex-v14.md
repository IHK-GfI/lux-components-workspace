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
<lux-datepicker
  luxLabel="Tabindex 1 (LuxDatepicker)"
  luxTabIndex="1"
></lux-datepicker>
<lux-checkbox
  luxLabel="Tabindex 3 (LuxCheckbox)"
  luxTabIndex="3"
></lux-checkbox>
<lux-select luxLabel="Tabindex 2 (LuxSelect)" luxTabIndex="2"></lux-select>
<lux-toggle luxLabel="Tabindex 4 (LuxToggle)" luxTabIndex="4"></lux-toggle>
<lux-button luxLabel="Tabindex 5 (LuxButton)" luxTabIndex="5"></lux-button>
```

### 2. Nur Parent mit Tabindex versehen

Html

```html
<input
  placeholder="Tabindex 1"
  luxTabIndex="1"
  [luxApplyToParent]="true"
  [luxApplyToChildren]="false"
/>
<input
  placeholder="Tabindex 3"
  luxTabIndex="3"
  [luxApplyToParent]="true"
  [luxApplyToChildren]="false"
/>
<input
  placeholder="Tabindex 2"
  luxTabIndex="2"
  [luxApplyToParent]="true"
  [luxApplyToChildren]="false"
/>
<input
  placeholder="Tabindex 4"
  luxTabIndex="4"
  [luxApplyToParent]="true"
  [luxApplyToChildren]="false"
/>
```

### 3. Nur spezielle Children mit Tabindex versehen

Ts

```typescript
children = ["input", "button", "a", "textarea", "div", "span"];
```

Html

```html
<lux-datepicker
  luxLabel="Tabindex 1 (LuxDatepicker)"
  luxTabIndex="1"
  [luxPotentialChildren]="children"
></lux-datepicker>
<lux-checkbox
  luxLabel="Tabindex 3 (LuxCheckbox)"
  luxTabIndex="3"
  [luxPotentialChildren]="children"
></lux-checkbox>
<lux-select
  luxLabel="Tabindex 2 (LuxSelect)"
  luxTabIndex="2"
  [luxPotentialChildren]="children"
></lux-select>
<lux-toggle
  luxLabel="Tabindex 4 (LuxToggle)"
  luxTabIndex="4"
  [luxPotentialChildren]="children"
></lux-toggle>
<lux-button
  luxLabel="Tabindex 5 (LuxButton)"
  luxTabIndex="5"
  [luxPotentialChildren]="children"
></lux-button>
```
