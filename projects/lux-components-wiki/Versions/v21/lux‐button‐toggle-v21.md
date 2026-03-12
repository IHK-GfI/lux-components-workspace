# LUX-Button-Toggle

- [LUX-Button-Toggle](#lux-button-toggle)
  - [Overview / API](#overview--api)
    - [Allgemein](#allgemein)
    - [@Input](#input)
    - [@Output](#output)
  - [Beispiele](#beispiele)
    - [1. Ohne Reactive-Form (Single-Select)](#1-ohne-reactive-form-single-select)
    - [2. Ohne Reactive-Form (Multi-Select)](#2-ohne-reactive-form-multi-select)
    - [3. Mit Reactive-Form](#3-mit-reactive-form)

## Overview / API

### Allgemein

| Name     | Beschreibung      |
| -------- | ----------------- |
| selector | lux-button-toggle |

Hinweis: Die Komponente benötigt mindestens 2 Optionen in `luxOptions`.

### @Input

| Name              | Typ                         | Beschreibung                                                                                         |
| ----------------- | --------------------------- | ---------------------------------------------------------------------------------------------------- |
| luxAriaLabel      | string                      | Aria-Label für die gesamte Toggle-Gruppe.                                                            |
| luxOptions        | LuxButtonToggleOption\<V>[] | Optionen der Gruppe. Jede Option unterstützt `label`, `value`, optional `disabled` und `ariaLabel`.  |
| luxMultiple       | boolean                     | Aktiviert Mehrfachauswahl. Bei `false` wird eine einzelne Auswahl verwendet.                         |
| luxDense          | boolean                     | Reduziert die Höhe der Komponente.                                                                   |
| luxDisabled       | boolean                     | Deaktiviert die gesamte Gruppe.                                                                      |
| luxRequired       | boolean                     | Kennzeichnet das Feld als Pflichtfeld.                                                               |
| luxHint           | string                      | Hinweistext unterhalb der Gruppe (nur wenn kein Fehler angezeigt wird).                              |
| luxError          | string                      | Optionaler eigener Fehlertext. Überschreibt die Standard-Required-Meldung.                           |
| luxControlBinding | string                      | Verknüpft die Komponente in Reactive Forms mit einem `FormControl` im aktuellen `FormGroup`-Kontext. |
| luxCompareWith    | (a: V, b: V) => boolean     | Vergleichsfunktion für Wertegleichheit (relevant für Objektwerte).                                   |
| luxSelected       | V \| undefined              | Single-Select-Wert (auch als Two-Way-Binding nutzbar).                                               |
| luxSelectedValues | V[]                         | Multi-Select-Werte (auch als Two-Way-Binding nutzbar).                                               |

### @Output

| Name                    | Typ                           | Beschreibung                                               |
| ----------------------- | ----------------------------- | ---------------------------------------------------------- |
| luxSelectedChange       | EventEmitter\<V \| undefined> | Wird im Single-Select-Modus bei Auswahländerung ausgelöst. |
| luxSelectedValuesChange | EventEmitter\<V[]>            | Wird im Multi-Select-Modus bei Auswahländerung ausgelöst.  |

## Beispiele

### 1. Ohne Reactive-Form (Single-Select)

Ts

```typescript
interface ViewOption {
  key: string;
}

singleOptions = [
  { label: 'Übersicht', value: { key: 'overview' } },
  { label: 'Details', value: { key: 'details' } },
  { label: 'Aktivität', value: { key: 'activity' } }
];

singleSelected: ViewOption | undefined;
```

Html

```html
<lux-button-toggle
  luxAriaLabel="Ansicht auswählen"
  [luxOptions]="singleOptions"
  [(luxSelected)]="singleSelected"
></lux-button-toggle>
```

### 2. Ohne Reactive-Form (Multi-Select)

Ts

```typescript
interface ViewOption {
  key: string;
}

multiOptions = [
  { label: 'Übersicht', value: { key: 'overview' } },
  { label: 'Details', value: { key: 'details' } },
  { label: 'Aktivität', value: { key: 'activity' } },
  { label: 'Archiv', value: { key: 'archive' }, disabled: true }
];

multiSelected: ViewOption[] = [];
```

Html

```html
<lux-button-toggle
  luxAriaLabel="Ansichten auswählen"
  [luxOptions]="multiOptions"
  [luxMultiple]="true"
  [luxCompareWith]="compareByKey"
  [(luxSelectedValues)]="multiSelected"
></lux-button-toggle>
```

```typescript
compareByKey = (a: ViewOption, b: ViewOption) => a?.key === b?.key;
```

### 3. Mit Reactive-Form

Ts

```typescript
interface ViewOption {
  key: string;
}

singleOptions = [
  { label: 'Übersicht', value: { key: 'overview' } },
  { label: 'Details', value: { key: 'details' } }
];

form = new FormGroup({
  view: new FormControl<ViewOption | null>(null, Validators.required)
});
```

Html

```html
<form [formGroup]="form">
  <lux-button-toggle
    luxAriaLabel="Ansicht auswählen"
    [luxOptions]="singleOptions"
    [luxRequired]="true"
    luxHint="Bitte treffen Sie eine Auswahl."
    luxControlBinding="view"
  ></lux-button-toggle>
</form>
```
