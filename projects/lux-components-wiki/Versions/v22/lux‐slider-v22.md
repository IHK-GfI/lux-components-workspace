# LUX-Slider

![Beispielbild LUX-Slider](https://raw.githubusercontent.com/IHK-GfI/lux-components-workspace/main/projects/lux-components-wiki/Versions/v22/lux‐slider-v22-img.png)

- [LUX-Slider](#lux-slider)
  - [Overview / API](#overview--api)
    - [Allgemein](#allgemein)
    - [@Input](#input)
    - [@Output](#output)
  - [Beispiele](#beispiele)
    - [1. Signal Forms](#1-signal-forms)
    - [2. Ohne Formular](#2-ohne-formular)
    - [3. Mit Formular](#3-mit-formular)
    - [4. Mit DisplayWith-Function](#4-mit-displaywith-function)

## Overview / API

### Allgemein

| Name     | Beschreibung |
| -------- | ------------ |
| selector | lux-slider, lux-slider-ac |

### @Input

| Name                   | Typ                    | Beschreibung                                                                                                                                                                                                                                                                                                               |
| ---------------------- | ---------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| luxColor | LuxSliderColor | Bestimmt das Farbschema (abhängig vom Theme) des Sliders (Typ `LuxSliderColor`). Mögliche Werte: 'primary', 'accent', 'warn'. Default: 'primary'. |
| luxShowThumbLabel | boolean | Bestimmt, ob beim Ziehen des Sliders ein Label mit dem aktuellen Wert angezeigt wird. Default: true. |
| formField              | FieldTree\<T\>         | Bindet das Element an ein Feld eines [Angular Signal Forms](https://angular.dev/guide/forms/signals/overview) (Direktive `FormField` aus `@angular/forms/signals`). Pflichtfeld, Deaktivierung und Fehler werden aus dem Schema übernommen.                                                                                |
| value                  | number                 | Der Wert des Elements. Two-Way-Binding über `[(value)]`. Innerhalb eines Signal Forms wird stattdessen `[formField]` verwendet.                                                                                                                                                                                            |
| luxValue               | number                 | **Veraltet**, stattdessen `[(value)]` bzw. `[formField]` verwenden. Beinhaltet den aktuellen Wert des Sliders als Zahlenwert. Erlaubt auch Two-Way-Binding.                                                                                                                                                                |
| luxMax | number | Bestimmt den Maximal-Wert des Sliders und kann nicht kleiner/gleich 0 und kleiner/gleich luxMin sein. Default: 100. |
| luxMin | number | Bestimmt den Minimal-Wert des Slider und kann nicht kleiner 0 und größer/gleich luxMax sein. Default: 0. |
| luxStep | number | Bestimmt die Größe der Schritte die in diesem Slider gemacht werden können. Diese können nur kleiner/gleich luxMax - luxMin sein. Default: 1. |
| luxDisplayWith | LuxDisplayWithFnType | Funktion `(value: number) => string`, die den Wert für das Thumb-Label formatiert (siehe Beispiel 4). Default: gibt den Wert als String zurück (0 bei leerem Wert). |
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

| Name              | Typ        | Beschreibung                                                                                                                                                                              |
| ----------------- | ---------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| luxChange         | number     | Output-Event welches beim Ändern des Slider-Wertes ausgelöst wird.                                                                                                                        |
| luxInput          | number     | Output-Event welches bereits beim Bewegen des Sliders ausgelöst wird.                                                                                                                     |
| luxValueChange    | number     | Gehört zur veralteten `luxValue`-API, stattdessen `(valueChange)` verwenden. Output-Event welches ausgelöst wird, wenn sich luxValue ändert. Ermöglicht das Two-Way-Binding von luxValue. |
| luxValuePercent   | number     | Output-Event welches ausgelöst wird, wenn sich luxValue ändert. Es beinhaltet als Event den aktuellen Prozentwert des Sliders als Zahl (z.B. 55.5).                                       |
| luxFocusIn        | FocusEvent | Event welches beim Fokussieren des Elements ausgelöst wird und ein Objekt vom Typ FocusEvent weitergibt.                                                                                  |
| luxFocusOut       | FocusEvent | Event welches beim Fokusverlust des Elements ausgelöst wird und ein Objekt vom Typ FocusEvent weitergibt.                                                                                 |
| luxDisabledChange | boolean    | Event welches beim Disablen des Elements ausgelöst wird.                                                                                                                                  |
| valueChange       | number     | Wird ausgelöst, wenn sich der Wert ändert (implizit aus dem `value`-Model, Grundlage von `[(value)]`).                                                                                    |
| luxBlur           | FocusEvent | Wird ausgelöst, wenn das Element selbst den Fokus verliert (Kindelemente werden nicht betrachtet).                                                                                        |
| luxFocus          | FocusEvent | Wird ausgelöst, wenn das Element selbst den Fokus erhält (Kindelemente werden nicht betrachtet).                                                                                          |

## Beispiele

### 1. Signal Forms

Ab v22 lässt sich die Komponente über `[formField]` an ein [Angular Signal Form](https://angular.dev/guide/forms/signals/overview) binden. Pflichtfeld, Deaktivierung und Validierung werden im Schema von `form()` festgelegt. Ein dort hinterlegter `message`-Text wird als Fehlermeldung angezeigt (`luxErrorMessage` und `luxErrorCallback` haben Vorrang). Die Direktive `FormField` muss in den `imports` der Komponente stehen.

Ts

```typescript
import { FormField, form, min } from '@angular/forms/signals';

readonly model = signal({ amount: 10 });
readonly amountForm = form(this.model, (path) => {
  min(path.amount, 20, { message: 'Bitte wählen Sie mindestens 20.' });
});
```

Html

```html
<lux-slider
  luxLabel="Betrag"
  [luxMin]="0"
  [luxMax]="100"
  [luxStep]="10"
  [luxShowThumbLabel]="true"
  [formField]="amountForm.amount"
/>
```

### 2. Ohne Formular

![Beispielbild 01](https://raw.githubusercontent.com/IHK-GfI/lux-components-workspace/main/projects/lux-components-wiki/Versions/v22/lux‐slider-v22-img-01.png)

Ts

```typescript
readonly color: LuxSliderColor = 'warn';
readonly disabled = signal(false);
readonly showThumbLabel = signal(true);
readonly value = signal(30);
readonly max = 100;
readonly min = 10;
readonly step = 10;
readonly percent = signal(0);
```

Html

```html
<lux-slider
  [luxColor]="color"
  [luxDisabled]="disabled()"
  [luxShowThumbLabel]="showThumbLabel()"
  [(value)]="value"
  [luxMax]="max"
  [luxMin]="min"
  [luxStep]="step"
  (luxValuePercent)="percent.set($event)"
  luxTagId="slidernoform"
/>
```

### 3. Mit Formular

> **Veraltet:** Die Reactive-Forms-Variante (`luxControlBinding`) in diesem Beispiel funktioniert in v22 weiterhin, entfällt aber mit der nächsten Major-Version. Für neue Formulare bitte Signal Forms verwenden (siehe [1. Signal Forms](#1-signal-forms)).

![Beispielbild 02](https://raw.githubusercontent.com/IHK-GfI/lux-components-workspace/main/projects/lux-components-wiki/Versions/v22/lux‐slider-v22-img-02.png)

Ts

```typescript
readonly color: LuxSliderColor = 'primary';
readonly showThumbLabel = true;
readonly max = 100;
readonly min = 10;
readonly step = 10;
readonly percent = signal(0);

readonly formGroup = new FormGroup({
  slider: new FormControl<number>(10, Validators.min(20))
});
```

Für die `json`-Pipe im Template muss `JsonPipe` in den `imports` der Komponente stehen.

Html

```html
<div [formGroup]="formGroup">
  <lux-slider
    [luxColor]="color"
    [luxShowThumbLabel]="showThumbLabel"
    [luxMax]="max"
    [luxMin]="min"
    [luxStep]="step"
    (luxValuePercent)="percent.set($event)"
    luxControlBinding="slider"
    luxTagId="sliderform"
  />
  <p>Formular-Value: {{ formGroup.value | json }}</p>
</div>
```

### 4. Mit DisplayWith-Function

![Beispielbild 03](https://raw.githubusercontent.com/IHK-GfI/lux-components-workspace/main/projects/lux-components-wiki/Versions/v22/lux‐slider-v22-img-03.png)

Ts

```typescript
readonly displayFn = (value: number): string => {
  if (value && value >= 1000) {
    return Math.round(value / 1000) + 'k';
  }
  return value ? '' + value : '0';
};
```

Html

```html
<lux-slider [luxMax]="10000" [luxMin]="0" [luxDisplayWith]="displayFn" />
```
