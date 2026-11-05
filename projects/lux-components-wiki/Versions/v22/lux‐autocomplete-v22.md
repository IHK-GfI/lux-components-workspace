# LUX-Autocomplete

![Beispielbild LUX-Autocomplete](https://raw.githubusercontent.com/IHK-GfI/lux-components-workspace/main/projects/lux-components-wiki/Versions/v22/lux‐autocomplete-v22-img.png)

- [LUX-Autocomplete](#lux-autocomplete)
  - [Overview / API](#overview--api)
    - [Allgemein](#allgemein)
    - [@Input](#input)
    - [@Output](#output)
  - [Beispiele](#beispiele)
    - [1. Signal Forms](#1-signal-forms)
    - [2. Ohne Formular](#2-ohne-formular)
    - [3. Mit Formular](#3-mit-formular)
    - [4. Einfaches String-Array als Optionen](#4-einfaches-string-array-als-optionen)
    - [5. Ohne Formular - Mit Label-Template](#5-ohne-formular---mit-label-template)

## Overview / API

### Allgemein

| Name     | Beschreibung                          |
| -------- | ------------------------------------- |
| selector | lux-autocomplete, lux-autocomplete-ac |

### @Input

| Name                       | Typ                                                         | Beschreibung                                                                                                                                                                                                                                                                                                                                      |
| -------------------------- | ----------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| luxOptions                 | O[]                                                         | Enthält das Array mit den einzelnen Vorschlägen für das Autocomplete-Feld.                                                                                                                                                                                                                                                                        |
| luxOptionLabelProp         | string                                                      | Enthält den Namen des Feldes der für die Darstellung einer einzelnen Option genutzt werden soll. (Wenn Objekte als Optionen genutzt werden und kein einfaches String-Array). Default: 'label'.                                                                                                                                                    |
| luxLookupDelay             | number                                                      | Entspricht der Verzögerung in ms bis die Filterung nach Eingabe im Input-Feld einsetzt. Default: 500.                                                                                                                                                                                                                                             |
| luxPlaceholder             | string                                                      | Beinhaltet einen Platzhalter, der angezeigt wird, solange kein Wert eingegeben wurde.                                                                                                                                                                                                                                                             |
| luxSelectAllOnClick        | boolean                                                     | Bestimmt, ob das Anklicken des Input-Felds den kompletten Text darin selektiert. Default: true.                                                                                                                                                                                                                                                   |
| luxStrict                  | boolean                                                     | Bestimmt, ob nur Elemente aus der Auswahlliste gültig sind oder ob eigene Eingaben ebenfalls als gültiger Wert genommen werden dürfen. Default: true.                                                                                                                                                                                             |
| luxTagId                   | string                                                      | [LUX-Tag-Id](luxTagId-v22#direkte-konfiguration) für die automatischen Tests.                                                                                                                                                                                                                                                                     |
| luxClearable               | boolean                                                     | Blendet optional einen Button im Eingabefeld ein, mit dem der aktuelle Eingabewert zurückgesetzt werden kann. Default: false.                                                                                                                                                                                                                     |
| luxClearAriaLabel          | string                                                      | ARIA-Label für den Zurücksetzen-Button. Wenn leer, wird ein Standardtext verwendet.                                                                                                                                                                                                                                                               |
| luxErrorMessageNotAnOption | string                                                      | Fehlermeldung, wenn der eingegebene Text keiner möglichen Option entspricht.                                                                                                                                                                                                                                                                      |
| formField                  | FieldTree\<T\>                                              | Bindet das Element an ein Feld eines [Angular Signal Forms](https://angular.dev/guide/forms/signals/overview) (Direktive `FormField` aus `@angular/forms/signals`). Pflichtfeld, Deaktivierung und Fehler werden aus dem Schema übernommen.                                                                                                       |
| value                      | V \| null                                                   | Der Wert des Elements. Two-Way-Binding über `[(value)]`. Innerhalb eines Signal Forms wird stattdessen `[formField]` verwendet.                                                                                                                                                                                                                   |
| luxValue                   | V \| null                                                   | **Veraltet**, stattdessen `[(value)]` bzw. `[formField]` verwenden. Two-Way-Binding ebenfalls möglich, wenn das Input-Feld nicht innerhalb eines Reactive-Forms ist.                                                                                                                                                                              |
| luxRequired                | boolean                                                     | Bestimmt, ob die Component ein Pflichtfeld ist oder nicht. Technisch als `model()` umgesetzt; eine Two-Way-Bindung wird nicht benötigt.                                                                                                                                                                                                           |
| luxControlBinding          | string                                                      | **Veraltet**, stattdessen `[formField]` verwenden. Das Controlbinding (z.B. firstname) verbindet das Formularelement mit einem Wert aus dem Modell. (!) Diese Eigenschaft kann nur verwendet werden, wenn das Element innerhalb eines Formulars verwendet wird.                                                                                   |
| luxErrorMessage            | string                                                      | Fehlertext, wenn das Formularelement nicht valide ist. Der Fehlertext ersetzt den Hinweistext, wenn es einen gibt. Ersetzt den luxErrorCallback, wenn gesetzt.                                                                                                                                                                                    |
| luxDisabled                | boolean                                                     | Bestimmt, ob die Component deaktiviert ist oder nicht. Two-Way-Binding über `[(luxDisabled)]` möglich.                                                                                                                                                                                                                                            |
| luxReadonly                | boolean                                                     | **Veraltet**, stattdessen `[readonly]` bzw. die `readonly()`-Regel im Signal-Forms-Schema verwenden. Bestimmt, ob sich das Feld im reinen Lese-Zustand befindet.                                                                                                                                                                                  |
| luxErrorCallback           | LuxErrorCallbackFnType                                      | Callback-Funktion die aufgerufen wird nachdem die Validierung der Component stattgefunden hat. Hier kann dann entsprechend aus dem übergebenen Errors-Objekt ein Fehler ausgelesen und die passende Fehlermeldung zurückgegeben werden. Liefert der Callback `undefined` zurück, wird die Defaultfehlermeldung ausgegeben.                        |
| luxControlValidators       | ValidatorFnType                                             | Validator-Funktion oder ein Array von Validator-Funktionen, die für diese Component hereingereicht werden können. Diese werden nur für nicht-ReactiveForms-Components angewendet und sollen so eine Validierung für "normale" Komponenten ermöglichen.                                                                                            |
| luxLabel                   | string                                                      | Property, welche ein Label oberhalb der FormComponent (Ausnahme: LuxToggle und LuxCheckbox, diese stellen das Label rechts von der Schaltfläche dar) darstellt. Technisch als `model()` umgesetzt; eine Two-Way-Bindung wird nicht benötigt.                                                                                                      |
| luxHint                    | string                                                      | Property, welche einen Tipp/Text unterhalb der FormComponent darstellt. Alternativ kann man über das Content-Child `lux-form-hint` komplexere Hinweise (z.B. mit einem Link) darstellen.                                                                                                                                                          |
| luxHintShowOnlyOnFocus     | boolean                                                     | Gibt an, ob der Hinweis (siehe luxHint) nur angezeigt wird, wenn das Element den Fokus hat.                                                                                                                                                                                                                                                       |
| luxPickValue               | ((selected: O \| null \| undefined) => V) \| undefined      | Callback-Funktion die ein einzelnes Objekt vom selben Typ wie die luxOptions entgegennimmt. Hier kann dann ausgesucht werden, welches Property von der Komponente als Rückgabewert genutzt werden soll. Das ist vor allem dann nützlich, wenn nicht das ganze Objekt für die weitere Verwendung genutzt werden soll. Erfordert _luxStrict = true_ |
| luxFilterFn                | (filterTerm: string, label: string, option: any) => boolean | Callback-Funktion zum Filtern der Optionen. Wenn keine individuelle Funktion angegeben wird, wird eine Teilstringsuche durchgeführt.                                                                                                                                                                                                              |
| luxPanelWidth              | string \| number                                            | Breite des Optionpanels. Default: ''.                                                                                                                                                                                                                                                                                                             |
| luxLabelLongFormat         | boolean                                                     | Bestimmt, ob das Label mehrzeilig sein kann. Nutzung nur in Spalten empfohlen, da die Höhe des Formcontrols variieren kann. Dadurch kann die Ausrichtung an der Baseline nicht mehr gewährleistet werden.                                                                                                                                         |
| luxOptionBlockSize         | number                                                      | Lädt die Optionen in der eingestellten Blockgröße nach, wenn gescrollt wird. Default: 50.                                                                                                                                                                                                                                                         |
| luxNoLabels                | boolean                                                     | Gibt an, ob Labels angezeigt werden sollen.                                                                                                                                                                                                                                                                                                       |
| luxNoTopLabel              | boolean                                                     | Gibt an, ob das obere Label angezeigt werden soll.                                                                                                                                                                                                                                                                                                |
| luxNoBottomLabel           | boolean                                                     | Gibt an, ob das untere Label (Hinweis oder Fehlermeldung) angezeigt werden soll.                                                                                                                                                                                                                                                                  |
| luxDense                   | boolean                                                     | Property um die Höhe der Komponente zu verringern. Diese Eigenschaft ist für den Einsatz in großen Formularen gedacht und soll nicht standardmäßig in einer Anwendung genutzt werden.                                                                                                                                                             |
| luxName                    | string                                                      | Name des Eingabeelements (Attribut `name`).                                                                                                                                                                                                                                                                                                       |
| luxId                      | string                                                      | Id des Formularelements. Ohne Angabe wird eine eindeutige Id generiert.                                                                                                                                                                                                                                                                           |
| luxAriaLabel               | string                                                      | Setzt `aria-label` am Eingabeelement. Nur für Felder ohne sichtbares Label gedacht; ein abweichendes aria-label überschreibt ein sichtbares Label (WCAG 2.5.3).                                                                                                                                                                                   |
| luxAriaLabelledby          | string                                                      | Verweist per `aria-labelledby` auf ein externes Label-Element. Hat Vorrang vor luxAriaLabel und luxLabel.                                                                                                                                                                                                                                         |
| luxFormGroup               | FormGroup                                                   | **Veraltet**, stattdessen `[formField]` verwenden. FormGroup, in der das luxControlBinding gesucht wird, wenn die Komponente nicht innerhalb von `[formGroup]` steht.                                                                                                                                                                             |
| luxFormControl             | FormControl                                                 | **Veraltet**, stattdessen `[formField]` verwenden. Direkt übergebenes FormControl.                                                                                                                                                                                                                                                                |

### @Output

| Name              | Typ        | Beschreibung                                                                                                                                                                                       |
| ----------------- | ---------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| luxOptionSelected | V \| null  | Output-Event welches ausgelöst wird sobald ein Wert aus der Auswahlliste selektiert wurde. Gibt das selektierte Element mit.                                                                       |
| luxValueChange    | V \| null  | Gehört zur veralteten `luxValue`-API, stattdessen `(valueChange)` verwenden. Output-Event welches ausgelöst wird sobald sich der luxValue-Wert ändert. Ermöglicht das Two-Way-Binding an luxValue. |
| luxFocusIn        | FocusEvent | Event welches beim Fokussieren des Elements ausgelöst wird und ein Objekt vom Typ FocusEvent weitergibt.                                                                                           |
| luxFocusOut       | FocusEvent | Event welches beim Fokusverlust des Elements ausgelöst wird und ein Objekt vom Typ FocusEvent weitergibt.                                                                                          |
| luxDisabledChange | boolean    | Event welches beim Disablen des Elements ausgelöst wird.                                                                                                                                           |
| valueChange       | V \| null  | Wird ausgelöst, wenn sich der Wert ändert (implizit aus dem `value`-Model, Grundlage von `[(value)]`).                                                                                             |
| luxBlur           | FocusEvent | Wird ausgelöst, wenn das Element selbst den Fokus verliert (Kindelemente werden nicht betrachtet).                                                                                                 |
| luxFocus          | FocusEvent | Wird ausgelöst, wenn das Element selbst den Fokus erhält (Kindelemente werden nicht betrachtet).                                                                                                   |

## Beispiele

### 1. Signal Forms

Ab v22 lässt sich die Komponente über `[formField]` an ein [Angular Signal Form](https://angular.dev/guide/forms/signals/overview) binden. Pflichtfeld, Deaktivierung und Validierung werden im Schema von `form()` festgelegt. Ein dort hinterlegter `message`-Text wird als Fehlermeldung angezeigt (`luxErrorMessage` und `luxErrorCallback` haben Vorrang). Die Direktive `FormField` muss in den `imports` der Komponente stehen.

Ts

```typescript
import { FormField, form, required } from '@angular/forms/signals';

// außerhalb der Klasse
interface Task {
  label: string;
  value: string;
}

// in der Klasse
readonly options: Task[] = [
  { label: 'Meine Aufgaben', value: 'A' },
  { label: 'Gruppenaufgaben', value: 'B' },
  { label: 'Zurückgestellte Aufgaben', value: 'C' },
  { label: 'Vertretungsaufgaben', value: 'D' }
];

readonly model = signal<{ task: Task | string | null }>({ task: null });
readonly taskForm = form(this.model, (path) => {
  required(path.task);
});
```

Html

```html
<lux-autocomplete
  luxLabel="Aufgaben"
  luxOptionLabelProp="label"
  [luxOptions]="options"
  [formField]="taskForm.task"
/>
```

### 2. Ohne Formular

![Beispielbild 01](https://raw.githubusercontent.com/IHK-GfI/lux-components-workspace/main/projects/lux-components-wiki/Versions/v22/lux‐autocomplete-v22-img-01.png)

Ts

```typescript
readonly options = [
  { label: "Meine Aufgaben", value: "A" },
  { label: "Gruppenaufgaben", value: "B" },
  { label: "Zurückgestellte Aufgaben", value: "C" },
  { label: "Vertretungsaufgaben", value: "D" },
];
readonly selected = signal<{ label: string; value: string } | string | null>(null);
```

Html

```html
<lux-autocomplete
  luxLabel="Mein Autocomplete"
  luxPlaceholder="Mein Placeholder"
  luxOptionLabelProp="label"
  [luxOptions]="options"
  [(value)]="selected"
/>
```

### 3. Mit Formular

> **Veraltet:** Die Reactive-Forms-Variante (`luxControlBinding`) in diesem Beispiel funktioniert in v22 weiterhin, entfällt aber mit der nächsten Major-Version. Für neue Formulare bitte Signal Forms verwenden (siehe [1. Signal Forms](#1-signal-forms)).

![Beispielbild 02](https://raw.githubusercontent.com/IHK-GfI/lux-components-workspace/main/projects/lux-components-wiki/Versions/v22/lux‐autocomplete-v22-img-02.png)

Ts

```typescript
readonly options = [
  { label: "Meine Aufgaben", value: "A" },
  { label: "Gruppenaufgaben", value: "B" },
  { label: "Zurückgestellte Aufgaben", value: "C" },
  { label: "Vertretungsaufgaben", value: "D" },
];

readonly myGroup = new FormGroup({
  autocomplete: new FormControl("", Validators.required),
});
```

Html

```html
<div [formGroup]="myGroup">
  <lux-autocomplete
    luxLabel="Mein Autocomplete"
    luxPlaceholder="Mein Placeholder"
    luxOptionLabelProp="label"
    [luxOptions]="options"
    luxControlBinding="autocomplete"
  />
</div>
```

### 4. Einfaches String-Array als Optionen

> **Veraltet:** Die Reactive-Forms-Variante (`luxControlBinding`) in diesem Beispiel funktioniert in v22 weiterhin, entfällt aber mit der nächsten Major-Version. Für neue Formulare bitte Signal Forms verwenden (siehe [1. Signal Forms](#1-signal-forms)).

![Beispielbild 03](https://raw.githubusercontent.com/IHK-GfI/lux-components-workspace/main/projects/lux-components-wiki/Versions/v22/lux‐autocomplete-v22-img-03.png)

Ts

```typescript
readonly options = [
  "Meine Aufgaben",
  "Gruppenaufgaben",
  "Zurückgestellte Aufgaben",
  "Vertretungsaufgaben",
];

readonly myGroup = new FormGroup({
  autocomplete: new FormControl(""),
});
```

Html

```html
<div [formGroup]="myGroup">
  <lux-autocomplete
    luxLabel="Mein Autocomplete"
    luxPlaceholder="Mein Placeholder"
    [luxOptions]="options"
    luxControlBinding="autocomplete"
  />
</div>
```

### 5. Ohne Formular - Mit Label-Template

Ts

```typescript
readonly options = [
  { label: "Meine Aufgaben", value: "A" },
  { label: "Gruppenaufgaben", value: "B" },
  { label: "Zurückgestellte Aufgaben", value: "C" },
  { label: "Vertretungsaufgaben", value: "D" },
];
readonly selected = signal<{ label: string; value: string } | string | null>(null);
```

Html

```html
<lux-autocomplete
  luxLabel="Mein Autocomplete"
  luxPlaceholder="Mein Placeholder"
  [luxOptions]="options"
  [(value)]="selected"
>
  <ng-template let-option #labelTemplate>
    <div class="lux-flex">
      <div><lux-icon luxIconName="lux-tasks" /></div>
      <div>{{ option.label }}</div>
    </div>
  </ng-template>
</lux-autocomplete>
```
