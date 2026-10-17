# LUX-Chips

![Beispielbild LUX-Chips](https://raw.githubusercontent.com/IHK-GfI/lux-components-workspace/main/projects/lux-components-wiki/Versions/v22/lux‐chips-v22-img.png)

- [LUX-Chips](#lux-chips)
  - [Overview / API](#overview--api)
    - [Allgemein](#allgemein)
    - [@Input](#input)
    - [@Output](#output)
  - [Components](#components)
    - [LuxChipGroupComponent](#luxchipgroupcomponent)
      - [Allgemein](#allgemein-1)
      - [@Input](#input-1)
      - [@Output](#output-1)
    - [LuxChipComponent](#luxchipcomponent)
      - [Allgemein](#allgemein-2)
      - [@Input](#input-2)
      - [@Output](#output-2)
  - [Beispiele](#beispiele)
    - [1. Signal Forms](#1-signal-forms)
    - [2. Simple Chips](#2-simple-chips)
    - [3. Chipgroup mit Eingabefeld](#3-chipgroup-mit-eingabefeld)
    - [4. Chips mit Autocomplete](#4-chips-mit-autocomplete)
    - [5. Chips im Formular](#5-chips-im-formular)

## Overview / API

### Allgemein

| Name     | Beschreibung            |
| -------- | ----------------------- |
| selector | lux-chips, lux-chips-ac |

Ober-Komponente der LuxChips. Kann einzelne LuxChip- oder auch die LuxChipGroup-Komponenten enthalten.

### @Input

| Name                       | Typ                    | Beschreibung                                                                                                                                                                                                                                                    |
| -------------------------- | ---------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| luxOrientation             | LuxChipsOrientation    | Definiert die Ausrichtung der Chips. Mögliche Werte: 'horizontal' \| 'vertical'. Default: 'horizontal'.                                                                                                                                                         |
| luxInputAllowed            | boolean                | Boolean-Flag, das definiert, ob das Input-Feld für das dynamische Hinzufügen von Chips verfügbar sein soll. Default: false.                                                                                                                                     |
| luxInputLabelAlwaysVisible | boolean                | Blendet das Label auch dann ein, wenn `luxInputAllowed` auf false gesetzt ist. Default: false.                                                                                                                                                                  |
| luxInputLabel              | string                 | Der Text, der über dem Input-Feld angezeigt wird. Alias für `luxLabel`.                                                                                                                                                                                         |
| luxLabel                   | string                 | Der Text, der über dem Input-Feld angezeigt wird (gleichbedeutend mit `luxInputLabel`). Technisch als `model()` umgesetzt; eine Two-Way-Bindung wird nicht benötigt.                                                                                            |
| luxDisabled                | boolean                | Boolean-Flag, das definiert, ob diese LuxChips-Komponente und alle darunterliegenden LuxChipGroups und LuxChips deaktiviert sein sollen. Deaktiviert ebenfalls das Input-Feld, wenn auf true gesetzt. Two-Way-Binding über `[(luxDisabled)]` möglich.           |
| luxNewChipGroup            | LuxChipGroupComponent  | Die LuxChipGroup der dynamisch neue LuxChips hinzugefügt werden, wenn eine Eingabe in dem Input-Feld gemacht wird. Wenn nicht gesetzt wird stattdessen das @Output-Event luxChipAdded ausgelöst, damit der Aufrufer selbst reagieren kann.                      |
| luxAutocompleteOptions     | string[]               | Optionales Array, welches dann - vorausgesetzt luxInputAllowed hat den Wert true - in einem Autocomplete-Feld unterhalb des Inputs dargestellt wird.                                                                                                            |
| luxPlaceholder             | string                 | Text der als Platzhalter, solange kein anderer Wert eingetragen ist, dargestellt wird. Default: ''.                                                                                                                                                             |
| luxLabelLongFormat         | boolean                | Bestimmt, ob das Label mehrzeilig sein kann. Nutzung nur in Spalten empfohlen, da die Höhe des Formcontrols variieren kann. Dadurch kann die Ausrichtung an der Baseline nicht mehr gewährleistet werden.                                                       |
| luxOptionBlockSize         | number                 | Lädt die Optionen in der eingestellten Blockgröße nach, wenn gescrollt wird. Default: 50.                                                                                                                                                                       |
| luxStrict                  | boolean                | Gibt an, ob nur Chips ausgewählt werden dürfen, die Teil der Optionen sind (siehe `luxAutocompleteOptions`). Doppelte Einträge sind ebenfalls nicht erlaubt. Default: false.                                                                                    |
| formField                  | FieldTree\<T\>         | Bindet das Element an ein Feld eines [Angular Signal Forms](https://angular.dev/guide/forms/signals/overview) (Direktive `FormField` aus `@angular/forms/signals`). Pflichtfeld, Deaktivierung und Fehler werden aus dem Schema übernommen.                     |
| value                      | string[] \| null       | Der Wert des Elements. Two-Way-Binding über `[(value)]`. Innerhalb eines Signal Forms wird stattdessen `[formField]` verwendet.                                                                                                                                 |
| luxControlBinding          | string                 | **Veraltet**, stattdessen `[formField]` verwenden. Das Controlbinding (z.B. countries) verbindet das Formularelement mit einem Wert aus dem Modell. (!) Diese Eigenschaft kann nur verwendet werden, wenn das Element innerhalb eines Formulars verwendet wird. |
| luxControlValidators       | ValidatorFnType        | Validator-Funktion oder ein Array von Validator-Funktionen, die für diese Component hereingereicht werden können. Diese werden nur für nicht-ReactiveForms-Components angewendet und sollen so eine Validierung für "normale" Komponenten ermöglichen.          |
| luxRequired                | boolean                | Bestimmt, ob die Component ein Pflichtfeld ist oder nicht. Technisch als `model()` umgesetzt; eine Two-Way-Bindung wird nicht benötigt.                                                                                                                         |
| luxDense                   | boolean                | Property um die Höhe der Komponente zu verringern. Diese Eigenschaft ist für den Einsatz in großen Formularen gedacht und soll nicht standardmäßig in einer Anwendung genutzt werden.                                                                           |
| luxHideBorder              | boolean                | Mit dieser Property kann die Border um das Inputelement ausgeblendet werden, falls luxInputAllowed auf false gesetzt ist. Default: false.                                                                                                                       |
| luxReadonly                | boolean                | **Veraltet**, stattdessen `[readonly]` bzw. die `readonly()`-Regel im Signal-Forms-Schema verwenden. Bestimmt, ob sich das Feld im reinen Lese-Zustand befindet.                                                                                                |
| luxValue                   | string[] \| null       | **Veraltet**, stattdessen `[(value)]` bzw. `[formField]` verwenden.                                                                                                                                                                                             |
| luxTagId                   | string                 | [LUX-Tag-Id](luxTagId-v22#direkte-konfiguration) für die automatischen Tests.                                                                                                                                                                                   |
| luxHint                    | string                 | Property, welche einen Tipp/Text unterhalb der FormComponent darstellt. Alternativ kann man über das Content-Child `lux-form-hint` komplexere Hinweise (z.B. mit einem Link) darstellen.                                                                        |
| luxHintShowOnlyOnFocus     | boolean                | Gibt an, ob der Hinweis (siehe luxHint) nur angezeigt wird, wenn das Element den Fokus hat.                                                                                                                                                                     |
| luxErrorMessage            | string                 | Fehlertext, wenn das Formularelement nicht valide ist. Der Fehlertext ersetzt den Hinweistext, wenn es einen gibt. Ersetzt den luxErrorCallback, wenn gesetzt.                                                                                                  |
| luxErrorCallback           | LuxErrorCallbackFnType | Callback-Funktion, die nach der Validierung aufgerufen wird und aus dem Errors-Objekt eine Fehlermeldung ermitteln kann. Liefert der Callback `undefined` zurück, wird die Defaultfehlermeldung ausgegeben.                                                     |
| luxNoLabels                | boolean                | Kombination aus luxNoTopLabel und luxNoBottomLabel.                                                                                                                                                                                                             |
| luxNoTopLabel              | boolean                | Blendet das obere Label nur visuell aus (der zugängliche Name bleibt erhalten).                                                                                                                                                                                 |
| luxNoBottomLabel           | boolean                | Entfernt den unteren Bereich (Hinweis, Fehlermeldung, Zähler).                                                                                                                                                                                                  |
| luxId                      | string                 | Id des Formularelements. Ohne Angabe wird eine eindeutige Id generiert.                                                                                                                                                                                         |
| luxAriaLabel               | string                 | Setzt `aria-label` am Eingabeelement. Nur für Felder ohne sichtbares Label gedacht; ein abweichendes aria-label überschreibt ein sichtbares Label (WCAG 2.5.3).                                                                                                 |
| luxAriaLabelledby          | string                 | Verweist per `aria-labelledby` auf ein externes Label-Element. Hat Vorrang vor luxAriaLabel und luxLabel.                                                                                                                                                       |
| luxFormGroup               | FormGroup              | **Veraltet**, stattdessen `[formField]` verwenden. FormGroup, in der das luxControlBinding gesucht wird, wenn die Komponente nicht innerhalb von `[formGroup]` steht.                                                                                           |
| luxFormControl             | FormControl            | **Veraltet**, stattdessen `[formField]` verwenden. Direkt übergebenes FormControl.                                                                                                                                                                              |

### @Output

| Name              | Typ              | Beschreibung                                                                                                  |
| ----------------- | ---------------- | ------------------------------------------------------------------------------------------------------------- |
| luxChipAdded      | string           | Output-Event welches ausgelöst wird, wenn keine spezielle LuxChipGroup für neue Chip-Einträge festgelegt ist. |
| valueChange       | string[] \| null | Wird ausgelöst, wenn sich der Wert ändert (implizit aus dem `value`-Model, Grundlage von `[(value)]`).        |
| luxValueChange    | string[] \| null | Gehört zur veralteten `luxValue`-API, stattdessen `(valueChange)` verwenden.                                  |
| luxBlur           | FocusEvent       | Wird ausgelöst, wenn das Element selbst den Fokus verliert (Kindelemente werden nicht betrachtet).            |
| luxFocus          | FocusEvent       | Wird ausgelöst, wenn das Element selbst den Fokus erhält (Kindelemente werden nicht betrachtet).              |
| luxFocusIn        | FocusEvent       | Wird beim Fokussieren des Elements ausgelöst.                                                                 |
| luxFocusOut       | FocusEvent       | Wird beim Fokusverlust des Elements ausgelöst.                                                                |
| luxDisabledChange | boolean          | Wird ausgelöst, wenn sich luxDisabled ändert (Grundlage von `[(luxDisabled)]`).                               |

## Components

### LuxChipGroupComponent

Kapselt ein Array von Labels um eine Liste von Chips anzuzeigen. Für die Darstellung von mehreren Chips mit dem selben Aufbau.

Um den Inhalt eines einzelnen Chips zu definieren, erwartet die LuxChipGroup ein ng-template, welches dann jeden gewünschten Content enthalten kann.

Über let-chipItem am ng-template erhält man Zugriff auf das aktuelle Chip.

#### Allgemein

| Name     | Beschreibung                      |
| -------- | --------------------------------- |
| selector | lux-chip-group, lux-chip-ac-group |

#### @Input

| Name         | Typ             | Beschreibung                                                                                                                                                                                                                                   |
| ------------ | --------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| luxLabels    | string[]        | Enthält das Array mit den Labels, die in den einzelnen LuxChips angezeigt werden. Beim Hinzufügen oder Entfernen eines Chips wird ein **neues** Array erzeugt; damit der Aufrufer die Änderung erhält, `[(luxLabels)]` verwenden. Default: []. |
| luxColor     | LuxThemePalette | Definiert die Farbe der LuxChips innerhalb dieser LuxGroup. Mögliche Werte: 'primary', 'accent' und 'warn'. Default: 'primary'.                                                                                                                |
| luxDisabled  | boolean         | Boolean-Flag, das definiert, ob die LuxChips in dieser LuxGroup deaktiviert sind oder nicht. Two-Way-Binding über `[(luxDisabled)]` möglich. Default: false.                                                                                   |
| luxRemovable | boolean         | Boolean-Flag, das definiert, ob die LuxChips in dieser LuxGroup entfernt werden können oder nicht. Default: true.                                                                                                                              |

#### @Output

| Name              | Typ      | Beschreibung                                                                                                               |
| ----------------- | -------- | -------------------------------------------------------------------------------------------------------------------------- |
| luxChipClicked    | number   | Output-Event welches ausgelöst wird, wenn ein LuxChip angeklickt wird. Gibt den Index des Chips als Übergabeparameter mit. |
| luxChipAdded      | string   | Output-Event welches ausgelöst wird, wenn ein LuxChip hinzugefügt wird.                                                    |
| luxChipRemoved    | number   | Output-Event welches ausgelöst wird, wenn ein LuxChip entfernt wird.                                                       |
| luxLabelsChange   | string[] | Wird ausgelöst, wenn sich die Labels ändern (Grundlage von `[(luxLabels)]`).                                               |
| luxDisabledChange | boolean  | Wird ausgelöst, wenn sich luxDisabled ändert (Grundlage von `[(luxDisabled)]`).                                            |

### LuxChipComponent

Stellt einen einzelnen Chip dar.

#### Allgemein

| Name     | Beschreibung          |
| -------- | --------------------- |
| selector | lux-chip, lux-chip-ac |

#### @Input

| Name         | Typ             | Beschreibung                                                                                                                                                                                                              |
| ------------ | --------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| luxColor     | LuxThemePalette | Definiert die Farbe dieses LuxChip. Mögliche Werte: 'primary', 'accent' und 'warn'. Default: 'primary'.                                                                                                                   |
| luxDisabled  | boolean         | Boolean-Flag, das definiert, ob dieser LuxChip deaktiviert ist oder nicht. Wenn auf true gesetzt, wird das Icon für das Entfernen dieses Chips versteckt. Two-Way-Binding über `[(luxDisabled)]` möglich. Default: false. |
| luxRemovable | boolean         | Boolean-Flag, das definiert, ob dieser LuxChip entfernt werden kann oder nicht. Ist der Wert true, wird ein Icon mit einem "x"-Symbol dargestellt, welches beim Klick das Remove-Event anstößt. Default: true.            |

#### @Output

| Name              | Typ     | Beschreibung                                                                                                                         |
| ----------------- | ------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| luxChipRemoved    | number  | Output-Event welches ausgelöst wird, wenn auf das "x"-Symbol geklickt wird. Gibt den entsprechenden Index als Übergabeparameter mit. |
| luxChipClicked    | number  | Output-Event welches ausgelöst wird, wenn ein LuxChip angeklickt wird. Gibt den entsprechenden Index als Übergabeparameter mit.      |
| luxDisabledChange | boolean | Wird ausgelöst, wenn sich luxDisabled ändert (Grundlage von `[(luxDisabled)]`).                                                      |

## Beispiele

### 1. Signal Forms

Ab v22 lässt sich die Komponente über `[formField]` an ein [Angular Signal Form](https://angular.dev/guide/forms/signals/overview) binden. Pflichtfeld, Deaktivierung und Validierung werden im Schema von `form()` festgelegt. Ein dort hinterlegter `message`-Text wird als Fehlermeldung angezeigt (`luxErrorMessage` und `luxErrorCallback` haben Vorrang). Die Direktive `FormField` muss in den `imports` der Komponente stehen.

`required()` von Angular behandelt ein leeres Array nicht als leer. Für Pflichtfelder mit einem Array als Wert deshalb zusätzlich `luxRequiredArray()` verwenden.

Ts

```typescript
import { FormField, form, required, validate } from '@angular/forms/signals';
import { luxRequiredArray } from '@ihk-gfi/lux-components';

readonly autocompleteOptions = ['Belgien', 'Deutschland', 'Frankreich', 'Ukraine', 'USA'];

readonly model = signal<{ countries: string[] }>({ countries: [] });
readonly countryForm = form(this.model, (path) => {
  required(path.countries);
  validate(path.countries, luxRequiredArray());
});
```

Html

```html
<lux-chips
  luxInputLabel="Länder"
  [luxStrict]="true"
  [luxInputAllowed]="true"
  [luxAutocompleteOptions]="autocompleteOptions"
  [luxNewChipGroup]="chipGroup"
  [formField]="countryForm.countries"
>
  <lux-chip-group [luxRemovable]="true" #chipGroup />
</lux-chips>
```

### 2. Simple Chips

![Beispielbild 01](https://raw.githubusercontent.com/IHK-GfI/lux-components-workspace/main/projects/lux-components-wiki/Versions/v22/lux‐chips-v22-img-01.png)

Ts

```typescript
chipClicked(index: number) {
  console.log(index);
}

chipRemoved(index: number) {
  console.log(index);
}
```

Html

```html
<lux-chips [luxHideBorder]="true">
  <lux-chip luxColor="primary">Primary Farbe</lux-chip>
  <lux-chip luxColor="warn">Warn Farbe</lux-chip>
  <lux-chip luxColor="accent">Accent Farbe</lux-chip>
  <lux-chip [luxDisabled]="true" (luxChipClicked)="chipClicked($event)"
    >Deaktivierter Chip</lux-chip
  >
  <lux-chip [luxRemovable]="true" (luxChipRemoved)="chipRemoved($event)"
    >Entfernbarer Chip</lux-chip
  >
</lux-chips>
```

### 3. Chipgroup mit Eingabefeld

![Beispielbild 02](https://raw.githubusercontent.com/IHK-GfI/lux-components-workspace/main/projects/lux-components-wiki/Versions/v22/lux‐chips-v22-img-02.png)

Ts

```typescript
readonly chipItems = signal(['Chip 0', 'Chip 1', 'Chip 2', 'Chip 3']);

chipRemoved(index: number) {
  console.log(index);
}

chipAdded(newChip: string) {
  console.log(newChip);
}

chipItemClicked(index: number) {
  console.log(index);
}
```

Html

```html
<lux-chips
  [luxInputAllowed]="true"
  luxInputLabel="Chip-Text eingeben"
  [luxNewChipGroup]="group"
>
  <lux-chip-group
    [(luxLabels)]="chipItems"
    luxColor="primary"
    [luxRemovable]="true"
    (luxChipAdded)="chipAdded($event)"
    (luxChipRemoved)="chipRemoved($event)"
    (luxChipClicked)="chipItemClicked($event)"
    #group
  />
</lux-chips>
```

### 4. Chips mit Autocomplete

![Beispielbild 03](https://raw.githubusercontent.com/IHK-GfI/lux-components-workspace/main/projects/lux-components-wiki/Versions/v22/lux‐chips-v22-img-03.png)

Ts

```typescript
readonly chips = signal<string[]>(['Chip 0', 'Chip 1', 'Chip 2', 'Chip 3']);
readonly options: string[] = ['Hallo', 'Ciao', 'Privet'];

chipAdded(newChip: string) {
  this.chips.update((chips) => [...chips, newChip]);
}
```

Html

```html
<lux-chips
  [luxAutocompleteOptions]="options"
  [luxInputAllowed]="true"
  (luxChipAdded)="chipAdded($event)"
>
  @for (chip of chips(); track chip) {
    <lux-chip luxColor="primary">
      {{ chip }}
    </lux-chip>
  }
</lux-chips>
```

### 5. Chips im Formular

> **Veraltet:** Die Reactive-Forms-Variante (`luxControlBinding`) in diesem Beispiel funktioniert in v22 weiterhin, entfällt aber mit der nächsten Major-Version. Für neue Formulare bitte Signal Forms verwenden (siehe [1. Signal Forms](#1-signal-forms)).

![Beispielbild 04](https://raw.githubusercontent.com/IHK-GfI/lux-components-workspace/main/projects/lux-components-wiki/Versions/v22/lux‐chips-v22-img-04.png)

Ts

```typescript
readonly autocompleteOptions = ['Belgien', 'Deutschland', 'Frankreich', 'Ukraine', 'USA'];

readonly form = new FormGroup({
  countries: new FormControl<string[] | null>(null, Validators.required)
});
```

Html

```html
<ng-container [formGroup]="form">
  <lux-chips
    luxInputLabel="Länder"
    luxControlBinding="countries"
    [luxStrict]="true"
    [luxInputAllowed]="true"
    [luxAutocompleteOptions]="autocompleteOptions"
    [luxNewChipGroup]="chipGroupForm"
  >
    <lux-chip-group
      [luxRemovable]="true"
      [luxDisabled]="false"
      #chipGroupForm
    />
  </lux-chips>
</ng-container>
```
