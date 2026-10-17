# LUX-Radio

![Beispielbild LUX-Radio](https://raw.githubusercontent.com/IHK-GfI/lux-components-workspace/main/projects/lux-components-wiki/Versions/v22/lux‐radio-v22-img.png)

- [LUX-Radio](#lux-radio)
  - [Overview / API](#overview--api)
    - [Allgemein](#allgemein)
    - [@Input](#input)
    - [@Output](#output)
  - [Beispiele](#beispiele)
    - [1. Signal Forms](#1-signal-forms)
    - [2. Ohne Formular](#2-ohne-formular)
      - [String-Array](#string-array)
      - [Object-Array mit deaktivierter Option](#object-array-mit-deaktivierter-option)
      - [Mit ng-template](#mit-ng-template)
    - [3. Mit Formular](#3-mit-formular)
    - [4. Mit pickValue-Fn](#4-mit-pickvalue-fn)

## Overview / API

### Allgemein

| Name     | Beschreibung |
| -------- | ------------ |
| selector | lux-radio, lux-radio-ac |

### @Input

| Name                   | Typ                    | Beschreibung                                                                                                                                                                                                                                                                                                               |
| ---------------------- | ---------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| luxGroupName | string | Name dieser Radio-Group. Ein luxGroupName muss vergeben werden, wenn mehrere Radiobuttongroups auf einer Seite verwendet werden. Default: ''. |
| luxOrientationVertical | boolean | Boolean-Flag, das definiert, ob die Radio-Buttons vertikal (true) oder horizontal (false) angezeigt werden. Default: true. |
| formField              | FieldTree\<T\>         | Bindet das Element an ein Feld eines [Angular Signal Forms](https://angular.dev/guide/forms/signals/overview) (Direktive `FormField` aus `@angular/forms/signals`). Pflichtfeld, Deaktivierung und Fehler werden aus dem Schema übernommen.                                                                                |
| value | V | Der Wert des Elements. Two-Way-Binding über `[(value)]`. Innerhalb eines Signal Forms wird stattdessen `[formField]` verwendet. |
| luxSelected | V | **Veraltet**, stattdessen `[(value)]` bzw. `[formField]` verwenden. Das selektierte Element. |
| luxOptions | O[] | Array, welches die möglichen Optionen bereitstellt. Über die Property "disabled" einer Option können einzelne Optionen deaktiviert werden (siehe Beispiel 2 "Object-Array mit deaktivierter Option"). Default: []. |
| luxOptionLabelProp | string | Gibt das Property an, aus dem das Label geholt wird (siehe Beispiele unten). Default: ''. |
| luxPickValue | LuxPickValueFnType\<O, P> | Callback-Funktion die ein einzelnes Objekt vom selben Typ wie die luxOptions entgegennimmt. Hier kann dann ausgesucht werden, welches Property von der Komponente als Rückgabewert genutzt werden soll. Das ist vor allem dann nützlich, wenn nicht das ganze Objekt für die weitere Verwendung genutzt werden soll. |
| luxCompareWith | (o1: O, o2: O) => boolean | Hier kann eine Vergleichsfunktion angegeben werden, die die Component dann benutzt, um Objekte zu vergleichen. Default: Vergleich per `===`. |
| luxTagId               | string                 | [LUX-Tag-Id](luxTagId-v22#direkte-konfiguration) für die automatischen Tests.                                                                                                                                                                                                                                              |
| luxRequired            | boolean                | Bestimmt, ob die Component ein Pflichtfeld ist oder nicht. Technisch als `model()` umgesetzt; eine Two-Way-Bindung wird nicht benötigt.                                                                                                                                                                                    |
| luxControlBinding      | string                 | **Veraltet**, stattdessen `[formField]` verwenden. Das Controlbinding (z.B. firstname) verbindet das Formularelement mit einem Wert aus dem Modell. (!) Diese Eigenschaft kann nur verwendet werden, wenn das Element innerhalb eines Formulars verwendet wird.                                                            |
| luxErrorMessage        | string                 | Fehlertext, wenn das Formularelement nicht valide ist. Der Fehlertext ersetzt den Hinweistext, wenn es einen gibt. Ersetzt den luxErrorCallback, wenn gesetzt.                                                                                                                                                             |
| luxDisabled            | boolean                | Bestimmt, ob die Component deaktiviert ist oder nicht. Two-Way-Binding über `[(luxDisabled)]` möglich.                                                                                                                                                                                                                     |
| luxReadonly            | boolean                | **Veraltet**, stattdessen `[readonly]` bzw. die `readonly()`-Regel im Signal-Forms-Schema verwenden. Bestimmt, ob sich das Feld im reinen Lese-Zustand befindet.                                                                                                                                                           |
| luxErrorCallback       | LuxErrorCallbackFnType | Callback-Funktion die aufgerufen wird nachdem die Validierung der Component stattgefunden hat. Hier kann dann entsprechend aus dem übergebenen Errors-Objekt ein Fehler ausgelesen und die passende Fehlermeldung zurückgegeben werden. Liefert der Callback `undefined` zurück, wird die Defaultfehlermeldung ausgegeben. |
| luxControlValidators   | ValidatorFnType        | Validator-Funktion oder ein Array von Validator-Funktionen, die für diese Component hereingereicht werden können. Diese werden nur für nicht-ReactiveForms-Components angewendet und sollen so eine Validierung für "normale" Komponenten ermöglichen.                                                                     |
| luxLabel               | string                 | Property welche ein Label oberhalb der FormComponent (Ausnahme: LuxToggle und LuxCheckbox, diese stellen das Label rechts von der Schaltfläche dar) darstellt. Technisch als `model()` umgesetzt; eine Two-Way-Bindung wird nicht benötigt.                                                                                |
| luxHint                | string                 | Property, welche einen Tipp/Text unterhalb der FormComponent darstellt. Alternativ kann man über das Content-Child `lux-form-hint` komplexere Hinweise (z.B. mit einem Link) darstellen.                                                                                                                                   |
| luxHintShowOnlyOnFocus | boolean                | Gibt an, ob der Hinweis (siehe luxHint) nur angezeigt wird, wenn das Element den Fokus hat.                                                                                                                                                                                                                                |
| luxLabelLongFormat     | boolean                | Bestimmt, ob das Label mehrzeilig sein kann. Nutzung nur in Spalten empfohlen, da die Höhe des Formcontrols variieren kann. Dadurch kann die Ausrichtung an der Baseline nicht mehr gewährleistet werden.                                                                                                                  |
| luxNoLabels            | boolean                | Gibt an, ob Labels angezeigt werden sollen.                                                                                                                                                                                                                                                                                |
| luxNoTopLabel          | boolean                | Gibt an, ob das obere Label angezeigt werden soll.                                                                                                                                                                                                                                                                         |
| luxNoBottomLabel       | boolean                | Gibt an, ob das untere Label (Hinweis oder Fehlermeldung) angezeigt werden soll.                                                                                                                                                                                                                                           |
| luxDense               | boolean                | Property um die Höhe der Komponente zu verringern. Diese Eigenschaft ist für den Einsatz in großen Formularen gedacht und soll nicht standardmäßig in einer Anwendung genutzt werden.                                                                                                                                      |
| luxId                  | string                 | Id des Formularelements. Ohne Angabe wird eine eindeutige Id generiert.                                                                                                                                                                                                                                                    |
| luxAriaLabel           | string                 | Setzt `aria-label` am Eingabeelement. Nur für Felder ohne sichtbares Label gedacht; ein abweichendes aria-label überschreibt ein sichtbares Label (WCAG 2.5.3).                                                                                                                                                            |
| luxAriaLabelledby      | string                 | Verweist per `aria-labelledby` auf ein externes Label-Element. Hat Vorrang vor luxAriaLabel und luxLabel.                                                                                                                                                                                                                  |
| luxFormGroup           | FormGroup              | **Veraltet**, stattdessen `[formField]` verwenden. FormGroup, in der das luxControlBinding gesucht wird, wenn die Komponente nicht innerhalb von `[formGroup]` steht.                                                                                                                                                      |
| luxFormControl         | FormControl            | **Veraltet**, stattdessen `[formField]` verwenden. Direkt übergebenes FormControl.                                                                                                                                                                                                                                         |

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

Ts

```typescript
import { FormField, form, required } from '@angular/forms/signals';

interface Employment {
  label: string;
  value: string;
}

readonly options: Employment[] = [
  { label: 'Vollzeit', value: 'V' },
  { label: 'Teilzeit', value: 'T' }
];

readonly model = signal<{ employment: Employment | null }>({ employment: null });
readonly employmentForm = form(this.model, (path) => {
  required(path.employment, { message: 'Bitte wählen Sie eine Option.' });
});
```

Html

```html
<lux-radio
  luxLabel="Beschäftigung"
  luxOptionLabelProp="label"
  [luxOptions]="options"
  [formField]="employmentForm.employment"
/>
```

### 2. Ohne Formular

![Beispielbild 01-01](https://raw.githubusercontent.com/IHK-GfI/lux-components-workspace/main/projects/lux-components-wiki/Versions/v22/lux‐radio-v22-img-01-01.png)

#### String-Array

Ts

```typescript
readonly options: string[] = ['männlich', 'weiblich'];
readonly selected = signal<string | null>(this.options[1]);
```

Html

```html
<lux-radio
  luxLabel="Geschlecht"
  luxGroupName="genderGroup"
  [luxOptions]="options"
  [(value)]="selected"
  [luxOrientationVertical]="false"
/>
```

#### Object-Array mit deaktivierter Option

![Beispielbild 01-02](https://raw.githubusercontent.com/IHK-GfI/lux-components-workspace/main/projects/lux-components-wiki/Versions/v22/lux‐radio-v22-img-01-02.png)

Ts

```typescript
readonly options: { label: string; value: string; disabled?: boolean }[] = [
  { label: 'männlich', value: 'm' },
  { label: 'weiblich', value: 'w' },
  { label: 'divers', value: 'd', disabled: true }
];
readonly selected = signal<{ label: string; value: string; disabled?: boolean } | null>(this.options[1]);
```

Html

```html
<lux-radio
  luxLabel="Geschlecht"
  luxGroupName="genderGroup"
  [luxOptions]="options"
  [(value)]="selected"
  [luxOrientationVertical]="false"
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
<lux-radio
  luxLabel="Geschlecht"
  luxGroupName="genderGroup"
  [luxOptions]="options"
  [(value)]="selected"
  [luxOrientationVertical]="false"
>
  <ng-template let-option> {{ option.label }} </ng-template>
</lux-radio>
```

### 3. Mit Formular

> **Veraltet:** Die Reactive-Forms-Variante (`luxControlBinding`) in diesem Beispiel funktioniert in v22 weiterhin, entfällt aber mit der nächsten Major-Version. Für neue Formulare bitte Signal Forms verwenden (siehe [1. Signal Forms](#1-signal-forms)).

![Beispielbild 02](https://raw.githubusercontent.com/IHK-GfI/lux-components-workspace/main/projects/lux-components-wiki/Versions/v22/lux‐radio-v22-img-02.png)

Ts

```typescript
readonly options = [
  { label: 'männlich', value: 'm' },
  { label: 'weiblich', value: 'w' }
];

readonly myGroup = new FormGroup({
  radio: new FormControl<{ label: string; value: string } | null>(this.options[0])
});
```

Html

```html
<form [formGroup]="myGroup">
  <lux-radio luxLabel="Geschlecht" luxGroupName="genderGroup" [luxOptions]="options" luxControlBinding="radio">
    <ng-template let-option> {{ option.label }} </ng-template>
  </lux-radio>
</form>
```

### 4. Mit pickValue-Fn

![Beispielbild 03](https://raw.githubusercontent.com/IHK-GfI/lux-components-workspace/main/projects/lux-components-wiki/Versions/v22/lux‐radio-v22-img-03.png)

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
<lux-radio
  luxLabel="Geschlecht"
  luxGroupName="genderGroup"
  [luxOptions]="options"
  [(value)]="selected"
  [luxPickValue]="pickFn"
  [luxOrientationVertical]="false"
>
  <ng-template let-option> {{ option.label }} </ng-template>
</lux-radio>
```
