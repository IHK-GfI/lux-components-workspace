# luxAutofocus

- [luxAutofocus](#luxautofocus)
  - [Overview / API](#overview--api)
    - [Allgemein](#allgemein)
    - [@Input](#input)
  - [Beispiele](#beispiele)
    - [1. Input](#1-input)
    - [2. Autocomplete](#2-autocomplete)

## Overview / API

### Allgemein

Diese Directive fokussiert eine Komponente (_lux-autocomplete-ac_, _lux-breadcrumb_, _lux-button_, _lux-checkbox-ac_, _lux-chips-ac_, _lux-datepicker-ac_, _lux-datetimepicker-ac_, _lux-file-input-ac_, _lux-file-list_, _lux-file-upload_, _lux-input-ac_, _lux-link_, _lux-link-plain_, _lux-lookup-autocomplete-ac_, _lux-lookup-combobox-ac_, _lux-radio-ac_, _lux-select-ac_, _lux-slider-ac_, _lux-textarea-ac_, _lux-tile_, _lux-tile-ac_ und _lux-toggle-ac_).

| Name     | Beschreibung |
| -------- | ------------ |
| selector | luxAutofocus |

### @Input

| Name                  | Typ    | Beschreibung                                                                                                                                                 |
| --------------------- | ------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| luxAutofocusSelector  | string | Über den CSS-Selector (z.B. _button:not([disabled])_) kann das Element bestimmt werden, das den Fokus erhalten soll.                                         |
| luxAutofocusComponent | any    | Die Komponente. Dies ist z.B. bei der Komponente _lux-autocomplete-ac_ nötig, damit das Panel geschlossen werden kann, welches sich beim Fokussieren öffnet. |

## Beispiele

### 1. Input

Html

```html
<lux-input-ac
  luxAutofocus
  luxLabel="Vorname"
></lux-input-ac>
```

### 2. Autocomplete

```html
<lux-autocomplete-ac
  luxAutofocus
  [luxAutofocusComponent]="autocomplete"
  luxLabel="label"
  #autocomplete
></lux-autocomplete-ac>
```
