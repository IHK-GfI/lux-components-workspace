# LUX-Filter-Form

Filter (aufgeklappt):

![Beispielbild LUX-Filter-Form](https://raw.githubusercontent.com/IHK-GfI/lux-components-workspace/main/projects/lux-components-wiki/Versions/v22/lux‐filter‐form-v22-img1.png)

Filter (zugeklappt):

![Beispielbild LUX-Filter-Form](https://raw.githubusercontent.com/IHK-GfI/lux-components-workspace/main/projects/lux-components-wiki/Versions/v22/lux‐filter‐form-v22-img2.png)

- [LUX-Filter-Form](#lux-filter-form)
  - [Overview / API](#overview--api)
    - [Allgemein](#allgemein)
    - [@Input](#input)
    - [@Output](#output)
  - [Components](#components)
    - [LuxFilterSaveDialogComponent](#luxfiltersavedialogcomponent)
      - [Allgemein](#allgemein-1)
    - [LuxFilterLoadDialogComponent](#luxfilterloaddialogcomponent)
      - [Allgemein](#allgemein-2)
    - [LuxFilterItemDirective](#luxfilteritemdirective)
      - [Allgemein](#allgemein-3)
      - [@Input](#input-1)
  - [Classes / Services](#classes--services)
    - [LuxFilter](#luxfilter)
    - [LuxFilterItem](#luxfilteritem)
  - [Beispiele](#beispiele)
    - [1. Standard](#1-standard)
    - [2. Mit Custom-Component - Filter in Subkomponente](#2-mit-custom-component---filter-in-subkomponente)

## Overview / API

### Allgemein

| Name     | Beschreibung    |
| -------- | --------------- |
| selector | lux-filter-form |

> **Hinweis zu Signal Forms:** Die Filter-Form baut intern eine Reactive-Forms-`FormGroup` auf. Die Filter-Elemente werden daher weiterhin über `luxControlBinding` zusammen mit der Direktive `luxFilterItem` angebunden. Das ist innerhalb der Filter-Form so vorgesehen, auch wenn `luxControlBinding` für normale Formulare als veraltet gilt; eine Anbindung über `[formField]` wird von der Filter-Form nicht unterstützt.

### @Input

| Name                    | Typ             | Beschreibung                                                                                                                   |
| ----------------------- | --------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| luxTitle                | string          | Titel des Filters. Default: ''.                                                                                                |
| luxButtonRaised         | boolean         | Gibt an, ob die Filter-Buttons hervorgehoben dargestellt werden. Default: false.                                               |
| luxButtonFlat           | boolean         | Gibt an, ob die Filter-Buttons flach (gefüllt, ohne Schatten) dargestellt werden. Default: false.                              |
| luxButtonFilterLabel    | string          | Bezeichnung des Filter-Buttons. Ohne Angabe wird ein Standardtext verwendet. Default: ''.                                      |
| luxButtonFilterColor    | LuxThemePalette | Farbe des Filter-Buttons ('primary', 'accent', 'warn' oder `undefined`). Default: 'primary'.                                   |
| luxButtonResetLabel     | string          | Bezeichnung des Reset-Buttons. Ohne Angabe wird ein Standardtext verwendet. Default: ''.                                       |
| luxButtonResetColor     | LuxThemePalette | Farbe des Reset-Buttons. Default: undefined.                                                                                   |
| luxButtonSaveLabel      | string          | Bezeichnung des Speichern-Buttons. Ohne Angabe wird ein Standardtext verwendet. Default: ''.                                   |
| luxButtonSaveColor      | LuxThemePalette | Farbe des Speichern-Buttons. Default: undefined.                                                                               |
| luxButtonLoadLabel      | string          | Bezeichnung des Laden-Buttons. Ohne Angabe wird ein Standardtext verwendet. Default: ''.                                       |
| luxButtonLoadColor      | LuxThemePalette | Farbe des Laden-Buttons. Default: undefined.                                                                                   |
| luxButtonDialogSave     | LuxThemePalette | Farbe des Speichern-Buttons im Dialog. Default: 'primary'.                                                                     |
| luxButtonDialogLoad     | LuxThemePalette | Farbe des Laden-Buttons im Dialog. Default: 'primary'.                                                                         |
| luxButtonDialogDelete   | LuxThemePalette | Farbe des Löschen-Buttons im Dialog. Default: 'warn'.                                                                          |
| luxButtonDialogCancel   | LuxThemePalette | Farbe des Abbrechen-Buttons im Dialog. Default: undefined.                                                                     |
| luxButtonDialogClose    | LuxThemePalette | Farbe des Schließen-Buttons im Dialog. Default: undefined.                                                                     |
| luxDefaultFilterMessage | string          | Die Standardfilternachricht wird angezeigt, wenn der Filter unverändert ist. Default: ''.                                      |
| luxShowChips            | boolean         | Gibt an, ob die Filterwerte im eingeklappten Zustand als Chips dargestellt werden. Default: true.                              |
| luxHideChipsBorder      | boolean         | Gibt an, ob der Rahmen um die Chips ausgeblendet wird. Default: false.                                                         |
| luxHideMenu             | boolean         | Gibt an, ob das Filtermenü im oberen Bereich ausgeblendet werden soll. Default: false.                                         |
| luxStoredFilters        | LuxFilter[]     | Ein Array mit den vorhandenen Filtern. Default: [].                                                                            |
| luxDisableShortcut      | boolean         | Property, die das Tastaturkürzel für das Auslösen des Filters unterdrückt. Default: false.                                     |
| luxShowAsCard           | boolean         | Stellt die Filter-Form als Card dar. Default: false.                                                                           |
| luxExpandedLabelOpen    | string          | Label (Tooltip/Aria-Label) des Buttons zum Aufklappen. Ohne Angabe wird ein Standardtext verwendet. Default: ''.               |
| luxExpandedLabelClose   | string          | Label (Tooltip/Aria-Label) des Buttons zum Zuklappen. Ohne Angabe wird ein Standardtext verwendet. Default: ''.                |
| luxShowSaveAction       | boolean         | Gibt an, ob im Filtermenü die Aktion zum Speichern eines Filters angezeigt wird. Default: true.                                |
| luxShowLoadAction       | boolean         | Gibt an, ob im Filtermenü die Aktion zum Laden eines gespeicherten Filters angezeigt wird. Default: true.                      |
| luxFilterExpanded       | boolean         | Gibt an, ob der Filter auf-/zugeklappt dargestellt wird. Two-Way-Binding über `[(luxFilterExpanded)]` möglich. Default: false. |
| luxFilterValues         | any             | Die aktuellen Filterwerte als Objekt (Schlüssel = luxControlBinding der Filter-Elemente). Default: {}.                         |

### @Output

| Name                    | Typ       | Beschreibung                                                                                                                                                          |
| ----------------------- | --------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| luxOnFilter             | any       | Output-Event welches ausgelöst wird, wenn der Filter-Button gedrückt wird. Als Daten wird ein Objekt mit den Filterwerten übergeben (im Code als `string` typisiert). |
| luxOnSave               | LuxFilter | Output-Event welches ausgelöst wird, wenn ein neuer Filter gespeichert wird.                                                                                          |
| luxOnLoad               | string    | Output-Event welches ausgelöst wird, wenn ein Filter geladen werden soll. Übergeben wird der Name des Filters.                                                        |
| luxOnDelete             | LuxFilter | Output-Event welches ausgelöst wird, wenn ein Filter gelöscht werden soll.                                                                                            |
| luxOnReset              | void      | Output-Event welches ausgelöst wird, wenn der aktuelle Filter zurückgesetzt werden soll.                                                                              |
| luxFilterExpandedChange | boolean   | Output-Event welches ausgelöst wird, wenn der Filter ein-/ausgeklappt wird (Grundlage von `[(luxFilterExpanded)]`).                                                   |

## Components

### LuxFilterSaveDialogComponent

Ein LuxFilterSaveDialogComponent bietet ein Eingabefeld für den Filternamen, einen Speichern-Button und einen Abbrechen-Button.

#### Allgemein

| Name     | Beschreibung           |
| -------- | ---------------------- |
| selector | lux-filter-save-dialog |

### LuxFilterLoadDialogComponent

Ein LuxFilterLoadDialogComponent zeigt die vorhandenen Filter an und bietet eine Möglichkeit, einen Filter auszuwählen.

#### Allgemein

| Name     | Beschreibung           |
| -------- | ---------------------- |
| selector | lux-filter-load-dialog |

### LuxFilterItemDirective

Über die LuxFilterItemDirective werden die Filteritems bestimmt. Die Direktive wird an ein LUX-Formularelement gesetzt, das über `luxControlBinding` angebunden ist.

#### Allgemein

| Name     | Beschreibung  |
| -------- | ------------- |
| selector | luxFilterItem |

#### @Input

| Name                   | Typ                   | Beschreibung                                                                                                                                          |
| ---------------------- | --------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| luxFilterLabel         | string                | Bezeichnung des Filterwerts in den Chips. Ohne Angabe wird das Label des Formularelements verwendet. Default: ''.                                     |
| luxFilterColor         | LuxThemePalette       | Farbe des Chips. Default: 'primary'.                                                                                                                  |
| luxFilterDefaultValues | any[]                 | Werte, die als "nicht gesetzt" gelten und für die kein Chip angezeigt wird. Default: `LuxFilterItem.DEFAULT_VALUES` (`[undefined, null, false, '']`). |
| luxFilterRenderFn      | LuxFilterRenderFnType | Funktion, die die Bezeichnung für den Filterwert im Chip liefert (Parameter: Filteritem und Wert).                                                    |
| luxFilterHidden        | boolean               | Blendet das Filteritem aus. Default: false.                                                                                                           |
| luxFilterDisabled      | boolean               | Deaktiviert das Filteritem. Default: false.                                                                                                           |

## Classes / Services

### LuxFilter

| Name | Typ    | Beschreibung                             |
| ---- | ------ | ---------------------------------------- |
| id?  | string | Eine optionale Id.                       |
| name | string | Ein eindeutiger Filtername. Default: ''. |
| data | any    | Die Filterwerte als Objekt. Default: {}. |

### LuxFilterItem

Die statische Property `LuxFilterItem.DEFAULT_VALUES` (`[undefined, null, false, '']`) enthält die Standardwerte für `defaultValues`.

| Name            | Typ                                             | Beschreibung                                                                                                      |
| --------------- | ----------------------------------------------- | ----------------------------------------------------------------------------------------------------------------- |
| label           | string                                          | Eine Bezeichnung (z.B. Land).                                                                                     |
| binding         | string                                          | Ein Binding (z.B. country).                                                                                       |
| component       | LuxFilterableFormComponent\<T>                  | Die Formularkomponente (z.B. lux-input). Struktureller Typ mit `luxControlBinding`, `luxLabel` und `formControl`. |
| value           | T                                               | Der Wert.                                                                                                         |
| defaultValues   | any[]                                           | Die Defaultwerte. Default: `[...LuxFilterItem.DEFAULT_VALUES]`.                                                   |
| color           | LuxThemePalette                                 | Eine Farbe. Default: 'primary'.                                                                                   |
| disabled        | boolean                                         | Gibt an, ob das Filteritem deaktiviert ist. Default: false.                                                       |
| hidden          | boolean                                         | Gibt an, ob das Filteritem ausgeblendet ist. Default: false.                                                      |
| multiValueIndex | number                                          | Index des Werts bei Mehrfachauswahl (ein Chip je Wert). Default: -1.                                              |
| renderFn        | (filter: LuxFilterItem\<T>, value: T) => string | Die Render-Funktion liefert die Bezeichnung für den Filterwert als Chip.                                          |

## Beispiele

### 1. Standard

![Beispielbild 01](https://raw.githubusercontent.com/IHK-GfI/lux-components-workspace/main/projects/lux-components-wiki/Versions/v22/lux‐filter‐form-v22-img-01-01.png)

![Beispielbild 01](https://raw.githubusercontent.com/IHK-GfI/lux-components-workspace/main/projects/lux-components-wiki/Versions/v22/lux‐filter‐form-v22-img-01-02.png)

![Beispielbild 01](https://raw.githubusercontent.com/IHK-GfI/lux-components-workspace/main/projects/lux-components-wiki/Versions/v22/lux‐filter‐form-v22-img-01-03.png)

Ts

```typescript
private readonly mediaQuery = inject(LuxMediaQueryObserverService);

readonly autoCompleteOptions = [
  { label: 'Auto A', value: 'a' },
  { label: 'Auto B', value: 'b' },
  { label: 'Auto C', value: 'c' }
];

readonly singleSelectOptions = [
  { label: 'Single 4711', value: '4711' },
  { label: 'Single 4712', value: '4712' },
  { label: 'Single 4713', value: '4713' }
];

readonly multiSelectOptions = [
  { label: 'Multi 1', value: 1 },
  { label: 'Multi 2', value: 2 },
  { label: 'Multi 3', value: 3 }
];

readonly initFilter = signal<any>({ input: 'aaa' });
readonly expanded = signal(false);
readonly storedFilters = signal<LuxFilter[]>([]);
readonly showFilterChips = toSignal(
  this.mediaQuery.getMediaQueryChangedAsObservable().pipe(map(() => !this.mediaQuery.isSmallerOrEqual('xs'))),
  { initialValue: !this.mediaQuery.isSmallerOrEqual('xs') }
);

readonly inputDisabled = signal(false);
readonly inputHidden = signal(false);
readonly autoCompleteDisabled = signal(false);
readonly autoCompleteHidden = signal(false);
readonly datepickerDisabled = signal(false);
readonly datepickerHidden = signal(false);
readonly singleSelectDisabled = signal(false);
readonly singleSelectHidden = signal(false);
readonly multiSelectDisabled = signal(false);
readonly multiSelectHidden = signal(false);
readonly toggleSelectDisabled = signal(false);
readonly toggleSelectHidden = signal(false);

readonly compareValueFn = (o1: any, o2: any) => o1.value === o2.value;

renderToggleFn(filterItem: LuxFilterItem, value: any) {
  return value ? 'aktiviert' : 'deaktiviert';
}

onFilter(filter: any) {
  console.log('Please filter...', filter);
}

onSave(filter: LuxFilter) {
  this.saveFilter(filter);
}

onDelete(filter: LuxFilter) {
  console.log('Filter deleted.', filter);
}

onReset() {
  console.log('Filter reset.');
}

onLoad(filterName: string) {
  this.initFilter.set(this.loadFilter(filterName));
}

private saveFilter(filter: LuxFilter) {
  // Hier müssten die Filtereinstellungen (z.B. in die Datenbank) geschrieben werden.
  this.storedFilters.update((filters) => [...filters, filter]);
  console.log('Filter saved.', filter);
}

private loadFilter(filterName: string) {
  // Hier müssten die Filtereinstellungen (z.B. aus der Datenbank) gelesen und zurückgeliefert werden.
  const luxFilter = this.storedFilters().find((filter) => filter.name === filterName);

  if (!luxFilter) {
    throw Error(`Es konnte kein Filter mit dem Namen "${filterName}" gefunden werden.`);
  }

  return JSON.parse(JSON.stringify(luxFilter.data));
}
```

Html

```html
<lux-filter-form
  (luxOnFilter)="onFilter($event)"
  [(luxFilterExpanded)]="expanded"
  [luxFilterValues]="initFilter()"
  (luxOnSave)="onSave($event)"
  (luxOnLoad)="onLoad($event)"
  (luxOnReset)="onReset()"
  (luxOnDelete)="onDelete($event)"
  [luxShowChips]="showFilterChips()"
  [luxStoredFilters]="storedFilters()"
  class="lux-ml-1 lux-mr-1 lux-mb-3"
>
  <div class="lux-grid lux-grid-cols-3 lt-md:lux-grid-cols-1 lux-gap-4 lux-mt-4">
    <lux-input
      luxLabel="Input"
      luxName="filter_input"
      luxAutocomplete="off"
      luxControlBinding="input"
      [luxFilterDisabled]="inputDisabled()"
      [luxFilterHidden]="inputHidden()"
      luxFilterItem
    />
    <lux-autocomplete
      luxLabel="Autocomplete"
      luxName="filter_autocomplete"
      [luxOptions]="autoCompleteOptions"
      luxControlBinding="autocomplete"
      [luxFilterDisabled]="autoCompleteDisabled()"
      [luxFilterHidden]="autoCompleteHidden()"
      luxFilterItem
    />
    <lux-datepicker
      luxLabel="Datepicker"
      luxControlBinding="datepicker"
      [luxFilterDisabled]="datepickerDisabled()"
      [luxFilterHidden]="datepickerHidden()"
      luxFilterItem
    />
    <lux-select
      luxLabel="Single-Select"
      luxControlBinding="singleSelect"
      luxOptionLabelProp="label"
      [luxMultiple]="false"
      [luxOptions]="singleSelectOptions"
      [luxCompareWith]="compareValueFn"
      [luxFilterDisabled]="singleSelectDisabled()"
      [luxFilterHidden]="singleSelectHidden()"
      luxFilterColor="accent"
      luxFilterItem
    />
    <lux-select
      luxLabel="Multi-Select"
      luxControlBinding="multiSelect"
      luxOptionLabelProp="label"
      [luxMultiple]="true"
      [luxOptions]="multiSelectOptions"
      [luxCompareWith]="compareValueFn"
      [luxFilterDisabled]="multiSelectDisabled()"
      [luxFilterHidden]="multiSelectHidden()"
      luxFilterColor="accent"
      luxFilterItem
    />
    <lux-toggle
      luxLabel="Toggle"
      luxControlBinding="toggle"
      [luxFilterRenderFn]="renderToggleFn"
      [luxFilterDisabled]="toggleSelectDisabled()"
      [luxFilterHidden]="toggleSelectHidden()"
      luxFilterColor="warn"
      luxFilterItem
    />
  </div>
</lux-filter-form>
```

Json

```json
{
  "input": "Lorem ipsum",
  "autocomplete": {
    "label": "Auto A",
    "value": "a"
  },
  "datepicker": "2020-09-09T00:00:00.000Z",
  "singleSelect": {
    "label": "Single 4711",
    "value": "4711"
  },
  "multiSelect": [
    {
      "label": "Multi 1",
      "value": 1
    },
    {
      "label": "Multi 2",
      "value": 2
    }
  ],
  "toggle": true
}
```

### 2. Mit Custom-Component - Filter in Subkomponente

Ts - Custom Component

```typescript
@Component({
  selector: 'app-custom-filter-item',
  imports: [LuxInputComponent, LuxFilterItemDirective, LuxToggleComponent],
  templateUrl: './custom-filter-item.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'lux-grid lux-grid-cols-12 lt-md:lux-grid-cols-1 lux-gap-4 lux-mt-4 lux-items-center' }
})
export class CustomFilterItemComponent implements AfterViewInit {
  readonly filterDisabled = input<boolean>(true);
  readonly filterHidden = input<boolean>(false);

  readonly formElements = viewChildren(LuxFilterItemDirective);

  private readonly filterFormComponent = inject(LuxFilterFormComponent);

  ngAfterViewInit(): void {
    this.filterFormComponent.registerFilterItems([...this.formElements()]);
  }
}
```

Html - Custom Component

```html
<lux-input
  class="lux-col-span-6 lt-md:lux-col-span-1"
  luxLabel="Custom-Component"
  luxName="customComponentInput"
  luxAutocomplete="off"
  luxControlBinding="customComponentInput"
  [luxFilterDisabled]="filterDisabled()"
  [luxFilterHidden]="filterHidden()"
  luxFilterItem
/>
<lux-toggle
  class="lux-col-span-6 lt-md:lux-col-span-1"
  luxLabel="Custom-Component"
  luxControlBinding="customComponentToggle"
  [luxFilterDisabled]="filterDisabled()"
  [luxFilterHidden]="filterHidden()"
  [luxNoLabels]="true"
  luxFilterItem
/>
```

Ts - Filter

```typescript
readonly inputDisabled = signal(false);
readonly inputHidden = signal(false);
readonly customDisabled = signal(false);
readonly customHidden = signal(false);
```

Html - Filter

```html
<lux-filter-form ...>
  ...
  <div class="lux-grid lux-grid-cols-12 lt-md:lux-grid-cols-1 lux-gap-4 lux-mt-4">
    <lux-input
      class="lux-col-span-6 lt-md:lux-col-span-1"
      luxLabel="Input"
      luxName="filter_input"
      luxAutocomplete="off"
      luxControlBinding="input"
      [luxFilterDisabled]="inputDisabled()"
      [luxFilterHidden]="inputHidden()"
      luxFilterItem
    />
    <app-custom-filter-item
      class="lux-col-span-12 lt-md:lux-col-span-1"
      [filterDisabled]="customDisabled()"
      [filterHidden]="customHidden()"
    />
  </div>
  ...
</lux-filter-form>
```
