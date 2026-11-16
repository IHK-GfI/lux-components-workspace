# LUX-Select

![Beispielbild LUX-Select](https://raw.githubusercontent.com/IHK-GfI/lux-components-workspace/main/projects/lux-components-wiki/Versions/v22/lux‐select-v22-img.png)

- [LUX-Select](#lux-select)
  - [Overview / API](#overview--api)
    - [Allgemein](#allgemein)
    - [@Input](#input)
    - [@Output](#output)
  - [Beispiele](#beispiele)
    - [1. Signal Forms](#1-signal-forms)
    - [2. Ohne Formular](#2-ohne-formular)
      - [String-Array](#string-array)
      - [Object-Array](#object-array)
      - [Mit ng-template](#mit-ng-template)
      - [Mit Multiselect](#mit-multiselect)
    - [3. Mit Formular](#3-mit-formular)
    - [4. Mit pickValue-Fn](#4-mit-pickvalue-fn)
    - [5. Mit clientseitiger Filterung](#5-mit-clientseitiger-filterung)
      - [Mit ng-template, Tooltip und Filter](#mit-ng-template-tooltip-und-filter)

## Overview / API

### Allgemein

| Name     | Beschreibung |
| -------- | ------------ |
| selector | lux-select, lux-select-ac |

### @Input

| Name                    | Typ                    | Beschreibung                                                                                                                                                                                                                                                                                                               |
| ----------------------- | ---------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| luxPlaceholder | string | Text der als Platzhalter, solange kein anderer Wert eingetragen ist, dargestellt wird. Default: ''. |
| luxMultiple | boolean | Gibt an, ob eine Mehrfachselektion erlaubt ist. Default: false. |
| luxEnableFilter         | boolean                | Aktiviert ein Suchfeld im Dropdown-Panel. Die Filterung erfolgt rein clientseitig auf Basis der aktuell geladenen Optionen. Standardwert: `false`.                                                                                                                                                                         |
| luxFilterPlaceholder    | string                 | Platzhalter- und Aria-Label-Text des Filtereingabefeldes im Dropdown-Panel. Standardwert: `Filter`.                                                                                                                                                                                                                        |
| luxFilterValue          | string                 | Vorbelegter Wert des Filtereingabefeldes. Ein nicht-leerer Wert aktiviert die clientseitige Filterung direkt beim Öffnen. Standardwert: leerer String.                                                                                                                                                                     |
| luxFilterClearAriaLabel | string                 | Aria-Label der Schaltfläche zum Leeren des Filtereingabefeldes. Standardwert: `Clear filter`.                                                                                                                                                                                                                              |
| luxVisibleOptionCount   | number                 | Begrenzt die Anzahl der gleichzeitig sichtbaren Optionen im geöffneten Panel. Werte `<= 0`, `null` oder `undefined` deaktivieren das Override und verwenden die Standardhöhe.                                                                                                                                              |
| luxKeepOptionOrder      | boolean                | Behält die ursprüngliche Reihenfolge der Optionen bei. Ist das Flag aktiv, werden selektierte Optionen nicht mehr an den Anfang der Liste sortiert. Standardwert: `false`.                                                                                                                                                 |
| formField               | FieldTree\<T\>         | Bindet das Element an ein Feld eines [Angular Signal Forms](https://angular.dev/guide/forms/signals/overview) (Direktive `FormField` aus `@angular/forms/signals`). Pflichtfeld, Deaktivierung und Fehler werden aus dem Schema übernommen.                                                                                |
| value | V | Der Wert des Elements. Two-Way-Binding über `[(value)]`. Innerhalb eines Signal Forms wird stattdessen `[formField]` verwendet. |
| luxSelected | V | **Veraltet**, stattdessen `[(value)]` bzw. `[formField]` verwenden. Das selektierte Element (luxMultiple = false). Die selektierten Elemente (luxMultiple = true). |
| luxOptions | O[] | Array, welches die möglichen Optionen für den Select bereitstellt. Default: []. |
| luxOptionLabelProp | string | Gibt das Property an, aus dem das Label geholt wird (siehe Beispiele unten). Default: ''. |
| luxPickValue | LuxPickValueFnType\<O, P> | Callback-Funktion die ein einzelnes Objekt vom selben Typ wie die luxOptions entgegennimmt. Hier kann dann ausgesucht werden, welches Property von der Komponente als Rückgabewert genutzt werden soll. Das ist vor allem dann nützlich, wenn nicht das ganze Objekt für die weitere Verwendung genutzt werden soll. |
| luxCompareWith | (o1: O, o2: O) => boolean | Hier kann eine Vergleichsfunktion angegeben werden, die die Component dann benutzt, um Objekte zu vergleichen. Default: Vergleich per `===`. |
| luxTagId                | string                 | [LUX-Tag-Id](luxTagId-v22#direkte-konfiguration) für die automatischen Tests.                                                                                                                                                                                                                                              |
| luxRequired             | boolean                | Bestimmt, ob die Component ein Pflichtfeld ist oder nicht. Technisch als `model()` umgesetzt; eine Two-Way-Bindung wird nicht benötigt.                                                                                                                                                                                    |
| luxControlBinding       | string                 | **Veraltet**, stattdessen `[formField]` verwenden. Das Controlbinding (z.B. firstname) verbindet das Formularelement mit einem Wert aus dem Modell. (!) Diese Eigenschaft kann nur verwendet werden, wenn das Element innerhalb eines Formulars verwendet wird.                                                            |
| luxErrorMessage         | string                 | Fehlertext, wenn das Formularelement nicht valide ist. Der Fehlertext ersetzt den Hinweistext, wenn es einen gibt. Ersetzt den luxErrorCallback, wenn gesetzt.                                                                                                                                                             |
| luxDisabled             | boolean                | Bestimmt, ob die Component deaktiviert ist oder nicht. Two-Way-Binding über `[(luxDisabled)]` möglich.                                                                                                                                                                                                                     |
| luxReadonly             | boolean                | **Veraltet**, stattdessen `[readonly]` bzw. die `readonly()`-Regel im Signal-Forms-Schema verwenden. Bestimmt, ob sich das Feld im reinen Lese-Zustand befindet.                                                                                                                                                           |
| luxErrorCallback        | LuxErrorCallbackFnType | Callback-Funktion die aufgerufen wird nachdem die Validierung der Component stattgefunden hat. Hier kann dann entsprechend aus dem übergebenen Errors-Objekt ein Fehler ausgelesen und die passende Fehlermeldung zurückgegeben werden. Liefert der Callback `undefined` zurück, wird die Defaultfehlermeldung ausgegeben. |
| luxControlValidators    | ValidatorFnType        | Validator-Funktion oder ein Array von Validator-Funktionen, die für diese Component hereingereicht werden können. Diese werden nur für nicht-ReactiveForms-Components angewendet und sollen so eine Validierung für "normale" Komponenten ermöglichen.                                                                     |
| luxLabel                | string                 | Property welche ein Label oberhalb der FormComponent (Ausnahme: LuxToggle und LuxCheckbox, diese stellen das Label rechts von der Schaltfläche dar) darstellt. Technisch als `model()` umgesetzt; eine Two-Way-Bindung wird nicht benötigt.                                                                                |
| luxHint                 | string                 | Property, welche einen Tipp/Text unterhalb der FormComponent darstellt. Alternativ kann man über das Content-Child `lux-form-hint` komplexere Hinweise (z.B. mit einem Link) darstellen.                                                                                                                                   |
| luxHintShowOnlyOnFocus  | boolean                | Gibt an, ob der Hinweis (siehe luxHint) nur angezeigt wird, wenn das Element den Fokus hat.                                                                                                                                                                                                                                |
| luxLabelLongFormat      | boolean                | Bestimmt, ob das Label mehrzeilig sein kann. Nutzung nur in Spalten empfohlen, da die Höhe des Formcontrols variieren kann. Dadurch kann die Ausrichtung an der Baseline nicht mehr gewährleistet werden.                                                                                                                  |
| luxNoLabels             | boolean                | Gibt an, ob Labels angezeigt werden sollen.                                                                                                                                                                                                                                                                                |
| luxNoTopLabel           | boolean                | Gibt an, ob das obere Label angezeigt werden soll.                                                                                                                                                                                                                                                                         |
| luxNoBottomLabel        | boolean                | Gibt an, ob das untere Label (Hinweis oder Fehlermeldung) angezeigt werden soll.                                                                                                                                                                                                                                           |
| luxDense                | boolean                | Property um die Höhe der Komponente zu verringern. Diese Eigenschaft ist für den Einsatz in großen Formularen gedacht und soll nicht standardmäßig in einer Anwendung genutzt werden.                                                                                                                                      |
| luxId                   | string                 | Id des Formularelements. Ohne Angabe wird eine eindeutige Id generiert.                                                                                                                                                                                                                                                    |
| luxAriaLabel            | string                 | Setzt `aria-label` am Eingabeelement. Nur für Felder ohne sichtbares Label gedacht; ein abweichendes aria-label überschreibt ein sichtbares Label (WCAG 2.5.3).                                                                                                                                                            |
| luxAriaLabelledby       | string                 | Verweist per `aria-labelledby` auf ein externes Label-Element. Hat Vorrang vor luxAriaLabel und luxLabel.                                                                                                                                                                                                                  |
| luxFormGroup            | FormGroup              | **Veraltet**, stattdessen `[formField]` verwenden. FormGroup, in der das luxControlBinding gesucht wird, wenn die Komponente nicht innerhalb von `[formGroup]` steht.                                                                                                                                                      |
| luxFormControl          | FormControl            | **Veraltet**, stattdessen `[formField]` verwenden. Direkt übergebenes FormControl.                                                                                                                                                                                                                                         |

### @Output

| Name              | Typ        | Beschreibung                                                                                                                                                                                                             |
| ----------------- | ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| luxSelectedChange | V          | Gehört zur veralteten `luxSelected`-API, stattdessen `(valueChange)` verwenden. Output-Event welches ausgelöst wird wenn ein Element/mehrere Elemente selektiert wurde/n. Ermöglicht das Two-Way-Binding an luxSelected. |
| luxFocusIn        | FocusEvent | Event welches beim Fokussieren des Elements ausgelöst wird und ein Objekt vom Typ FocusEvent weitergibt.                                                                                                                 |
| luxFocusOut       | FocusEvent | Event welches beim Fokusverlust des Elements ausgelöst wird und ein Objekt vom Typ FocusEvent weitergibt.                                                                                                                |
| luxDisabledChange | boolean    | Event welches beim Disablen des Elements ausgelöst wird.                                                                                                                                                                 |
| valueChange       | V          | Wird ausgelöst, wenn sich der Wert ändert (implizit aus dem `value`-Model, Grundlage von `[(value)]`).                                                                                                                   |
| luxBlur           | FocusEvent | Wird ausgelöst, wenn das Element selbst den Fokus verliert (Kindelemente werden nicht betrachtet).                                                                                                                       |
| luxFocus          | FocusEvent | Wird ausgelöst, wenn das Element selbst den Fokus erhält (Kindelemente werden nicht betrachtet).                                                                                                                         |

## Beispiele

### 1. Signal Forms

Ab v22 lässt sich die Komponente über `[formField]` an ein [Angular Signal Form](https://angular.dev/guide/forms/signals/overview) binden. Pflichtfeld, Deaktivierung und Validierung werden im Schema von `form()` festgelegt. Ein dort hinterlegter `message`-Text wird als Fehlermeldung angezeigt (`luxErrorMessage` und `luxErrorCallback` haben Vorrang). Die Direktive `FormField` muss in den `imports` der Komponente stehen.

`required()` von Angular behandelt ein leeres Array nicht als leer. Für Pflichtfelder mit einem Array als Wert deshalb zusätzlich `luxRequiredArray()` verwenden.

Ts

```typescript
import { FormField, form, required, validate } from '@angular/forms/signals';
import { luxRequiredArray } from '@ihk-gfi/lux-components';

interface Language {
  label: string;
  value: string;
}

readonly options: Language[] = [
  { label: 'Deutsch', value: 'de' },
  { label: 'Englisch', value: 'en' },
  { label: 'Französisch', value: 'fr' }
];

readonly model = signal<{ nativeLanguage: Language | null; languages: Language[] }>({ nativeLanguage: null, languages: [] });
readonly languageForm = form(this.model, (path) => {
  required(path.nativeLanguage);
  required(path.languages);
  validate(path.languages, luxRequiredArray());
});
```

Html

```html
<lux-select
  luxLabel="Muttersprache"
  luxOptionLabelProp="label"
  [luxOptions]="options"
  [formField]="languageForm.nativeLanguage"
/>
<lux-select
  luxLabel="Weitere Sprachen"
  luxOptionLabelProp="label"
  [luxOptions]="options"
  [luxMultiple]="true"
  [formField]="languageForm.languages"
/>
```

### 2. Ohne Formular

![Beispielbild 01-01](https://raw.githubusercontent.com/IHK-GfI/lux-components-workspace/main/projects/lux-components-wiki/Versions/v22/lux‐select-v22-img-01-01.png)

#### String-Array

Ts

```typescript
readonly options: string[] = ['männlich', 'weiblich'];
readonly selected = signal<string | null>(this.options[1]);
```

Html

```html
<lux-select luxLabel="Geschlecht" [luxOptions]="options" [(value)]="selected" />
```

#### Object-Array

Ts

```typescript
readonly options = [
  { label: 'männlich', value: 'm' },
  { label: 'weiblich', value: 'w' }
];
readonly selected = signal<{ label: string; value: string } | null>(this.options[1]);
```

Html

```html
<lux-select
  luxLabel="Geschlecht"
  [luxOptions]="options"
  [(value)]="selected"
  luxOptionLabelProp="label"
/>
```

#### Mit ng-template

Ts

```typescript
readonly options = [
  { label: 'männlich', value: 'm' },
  { label: 'weiblich', value: 'w' }
];
readonly selected = signal<{ label: string; value: string } | null>(this.options[1]);
```

Html

```html
<lux-select luxLabel="Geschlecht" [luxOptions]="options" [(value)]="selected">
  <ng-template let-option> {{ option.label }} </ng-template>
</lux-select>
```

#### Mit Multiselect

![Beispielbild 01-02](https://raw.githubusercontent.com/IHK-GfI/lux-components-workspace/main/projects/lux-components-wiki/Versions/v22/lux‐select-v22-img-01-02.png)

Ts

```typescript
readonly options = [
  { label: 'männlich', value: 'm' },
  { label: 'weiblich', value: 'w' }
];
readonly selected = signal<{ label: string; value: string }[]>([this.options[0], this.options[1]]);
```

Html

```html
<lux-select
  luxLabel="Geschlecht"
  [luxOptions]="options"
  [(value)]="selected"
  [luxMultiple]="true"
>
  <ng-template let-option> {{ option.label }} </ng-template>
</lux-select>
```

### 3. Mit Formular

> **Veraltet:** Die Reactive-Forms-Variante (`luxControlBinding`) in diesem Beispiel funktioniert in v22 weiterhin, entfällt aber mit der nächsten Major-Version. Für neue Formulare bitte Signal Forms verwenden (siehe [1. Signal Forms](#1-signal-forms)).

![Beispielbild 02](https://raw.githubusercontent.com/IHK-GfI/lux-components-workspace/main/projects/lux-components-wiki/Versions/v22/lux‐select-v22-img-02.png)

Ts

```typescript
readonly options = [
  { label: 'männlich', value: 'm' },
  { label: 'weiblich', value: 'w' }
];

readonly myGroup = new FormGroup({
  select: new FormControl<{ label: string; value: string } | null>(this.options[0])
});
```

Html

```html
<form [formGroup]="myGroup">
  <lux-select luxLabel="Geschlecht" [luxOptions]="options" luxControlBinding="select">
    <ng-template let-option> {{ option.label }} </ng-template>
  </lux-select>
</form>
```

### 4. Mit pickValue-Fn

![Beispielbild 03](https://raw.githubusercontent.com/IHK-GfI/lux-components-workspace/main/projects/lux-components-wiki/Versions/v22/lux‐select-v22-img-03.png)

Ts

```typescript
readonly options = [
  { label: 'männlich', value: 'm' },
  { label: 'weiblich', value: 'w' }
];

readonly selected = signal<string | undefined>('w');

pickFn(o: { label: string; value: string }) {
  return o ? o.value : undefined;
}
```

Html

```html
<lux-select
  luxLabel="Geschlecht"
  [luxOptions]="options"
  [(value)]="selected"
  [luxPickValue]="pickFn"
>
  <ng-template let-option> {{ option.label }} </ng-template>
</lux-select>
```

### 5. Mit clientseitiger Filterung

Ts

```typescript
readonly options = [
  { label: 'Meine Aufgaben', value: 'A' },
  { label: 'Gruppenaufgaben', value: 'B' },
  { label: 'Zurückgestellte Aufgaben', value: 'C' }
];
readonly selected = signal<{ label: string; value: string } | null>(null);
```

Html

```html
<lux-select
  luxLabel="Aufgaben"
  [luxOptions]="options"
  luxOptionLabelProp="label"
  [luxEnableFilter]="true"
  [(value)]="selected"
/>
```

#### Mit ng-template, Tooltip und Filter

Html

```html
<lux-select luxLabel="Aufgaben" [luxOptions]="options" luxOptionLabelProp="label" [luxEnableFilter]="true" [(value)]="selected">
  <ng-template let-option>
    <span [luxTooltip]="option.label">{{ option.label }}</span>
  </ng-template>
</lux-select>
```
