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

Hinweis: Die Komponente benötigt mindestens zwei Optionen in `luxOptions`.

### @Input

| Name              | Typ                         | Beschreibung                                                                                         |
| ----------------- | --------------------------- | ---------------------------------------------------------------------------------------------------- |
| luxAriaLabel      | string                      | Aria-Label für die gesamte Toggle-Gruppe.                                                            |
| luxOptions        | LuxButtonToggleOption\<V>[] | Optionen der Gruppe. Jede Option unterstützt `label`, `value`, optional `disabled` und `ariaLabel`.  |
| luxMultiple       | boolean                     | Aktiviert Mehrfachauswahl. Bei `false` wird eine einzelne Auswahl verwendet. Default: false.         |
| luxDense          | boolean                     | Reduziert die Höhe der Komponente. Default: false.                                                   |
| luxDisabled       | boolean                     | Deaktiviert die gesamte Gruppe. Default: false.                                                      |
| luxRequired       | boolean                     | Kennzeichnet das Feld als Pflichtfeld. Default: false.                                               |
| luxHint           | string                      | Hinweistext unterhalb der Gruppe (nur wenn kein Fehler angezeigt wird).                              |
| luxError          | string                      | Optionaler eigener Fehlertext. Überschreibt die Standard-Required-Meldung.                           |
| luxControlBinding | string                      | Verknüpft die Komponente in Reactive Forms mit einem `FormControl` im aktuellen `FormGroup`-Kontext. |
| luxCompareWith    | (a: V, b: V) => boolean     | Vergleichsfunktion für Wertegleichheit (relevant für Objektwerte). Default: `(a, b) => a === b`.     |
| luxSelected       | V \| undefined              | Single-Select-Wert (auch als Two-Way-Binding nutzbar).                                               |
| luxSelectedValues | V[]                         | Multi-Select-Werte (auch als Two-Way-Binding nutzbar). Default: [].                                  |

### @Output

| Name                    | Typ            | Beschreibung                                               |
| ----------------------- | -------------- | ---------------------------------------------------------- |
| luxSelectedChange       | V \| undefined | Wird im Single-Select-Modus bei Auswahländerung ausgelöst. |
| luxSelectedValuesChange | V[]            | Wird im Multi-Select-Modus bei Auswahländerung ausgelöst.  |

## Beispiele

### 1. Ohne Reactive-Form (Single-Select)

Ts

```typescript
// außerhalb der Klasse
interface ViewOption {
  key: string;
}

// in der Klasse
readonly singleOptions: LuxButtonToggleOption<ViewOption>[] = [
  { label: 'Übersicht', value: { key: 'overview' } },
  { label: 'Details', value: { key: 'details' } },
  { label: 'Aktivität', value: { key: 'activity' } }
];

readonly singleSelected = signal<ViewOption | undefined>(undefined);
```

Html

```html
<lux-button-toggle
  luxAriaLabel="Ansicht auswählen"
  [luxOptions]="singleOptions"
  [(luxSelected)]="singleSelected"
/>
```

### 2. Ohne Reactive-Form (Multi-Select)

Ts

```typescript
// außerhalb der Klasse
interface ViewOption {
  key: string;
}

// in der Klasse
readonly multiOptions: LuxButtonToggleOption<ViewOption>[] = [
  { label: 'Übersicht', value: { key: 'overview' } },
  { label: 'Details', value: { key: 'details' } },
  { label: 'Aktivität', value: { key: 'activity' } },
  { label: 'Archiv', value: { key: 'archive' }, disabled: true }
];

readonly multiSelected = signal<ViewOption[]>([]);

readonly compareByKey = (a: ViewOption, b: ViewOption) => a?.key === b?.key;
```

Html

```html
<lux-button-toggle
  luxAriaLabel="Ansichten auswählen"
  [luxOptions]="multiOptions"
  [luxMultiple]="true"
  [luxCompareWith]="compareByKey"
  [(luxSelectedValues)]="multiSelected"
/>
```

### 3. Mit Reactive-Form

Ts

```typescript
// außerhalb der Klasse
interface ViewOption {
  key: string;
}

// in der Klasse
readonly singleOptions: LuxButtonToggleOption<ViewOption>[] = [
  { label: 'Übersicht', value: { key: 'overview' } },
  { label: 'Details', value: { key: 'details' } }
];

readonly form = new FormGroup({
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
  />
</form>
```
