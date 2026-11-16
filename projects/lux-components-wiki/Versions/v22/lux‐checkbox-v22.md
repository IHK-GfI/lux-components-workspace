# LUX-Checkbox

![Beispielbild LUX-Checkbox](https://raw.githubusercontent.com/IHK-GfI/lux-components-workspace/main/projects/lux-components-wiki/Versions/v22/lux‐checkbox-v22-img.png)

- [LUX-Checkbox](#lux-checkbox)
  - [Overview / API](#overview--api)
    - [Allgemein](#allgemein)
    - [@Input](#input)
    - [@Output](#output)
  - [Beispiele](#beispiele)
    - [1. Signal Forms](#1-signal-forms)
    - [2. Ohne Formular](#2-ohne-formular)
    - [3. Mit Two-Way-Binding](#3-mit-two-way-binding)
    - [4. Mit Formular](#4-mit-formular)

## Overview / API

### Allgemein

| Name     | Beschreibung                  |
| -------- | ----------------------------- |
| selector | lux-checkbox, lux-checkbox-ac |

### @Input

| Name                   | Typ                    | Beschreibung                                                                                                                                                                                                                                                                                                                                                                              |
| ---------------------- | ---------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| luxTagId               | string                 | [LUX-Tag-Id](luxTagId-v22#direkte-konfiguration) für die automatischen Tests.                                                                                                                                                                                                                                                                                                             |
| formField              | FieldTree\<T\>         | Bindet das Element an ein Feld eines [Angular Signal Forms](https://angular.dev/guide/forms/signals/overview) (Direktive `FormField` aus `@angular/forms/signals`). Pflichtfeld, Deaktivierung und Fehler werden aus dem Schema übernommen.                                                                                                                                               |
| checked                | boolean                | Gibt an, ob das Element ausgewählt ist. Two-Way-Binding über `[(checked)]`. Innerhalb eines Signal Forms wird stattdessen `[formField]` verwendet. Default: false.                                                                                                                                                                                                                        |
| luxChecked             | boolean                | **Veraltet**, stattdessen `[(checked)]` bzw. `[formField]` verwenden. Beschreibt den Zustand der Component (true = checked, false = unchecked). Two-Way-Binding ebenfalls möglich, wenn die Component nicht innerhalb eines Formulars verwendet wird.                                                                                                                                     |
| luxRequired            | boolean                | Bestimmt, ob die Component ein Pflichtfeld ist oder nicht. <br><br>**Vorsicht, sollte sich die Checkbox in einem _lux-checkbox-container-ac_ befinden, wird kein Hinweis oder Fehler angezeigt, da der Error-Container aus Platzgründen dort ausgeblendet wird.** Technisch als `model()` umgesetzt; eine Two-Way-Bindung wird nicht benötigt.                                            |
| luxControlBinding      | string                 | **Veraltet**, stattdessen `[formField]` verwenden. Das Controlbinding (z.B. firstname) verbindet das Formularelement mit einem Wert aus dem Modell. (!) Diese Eigenschaft kann nur verwendet werden, wenn das Element innerhalb eines Formulars verwendet wird.                                                                                                                           |
| luxErrorMessage        | string                 | Fehlertext, wenn das Formularelement nicht valide ist. Der Fehlertext ersetzt den Hinweistext, wenn es einen gibt. Ersetzt den luxErrorCallback, wenn gesetzt. <br><br>Siehe auch den Warnhinweis im Abschnitt _luxRequired_.                                                                                                                                                             |
| luxDisabled            | boolean                | Bestimmt, ob die Component deaktiviert ist oder nicht. Two-Way-Binding über `[(luxDisabled)]` möglich.                                                                                                                                                                                                                                                                                    |
| luxReadonly            | boolean                | **Veraltet**, stattdessen `[readonly]` bzw. die `readonly()`-Regel im Signal-Forms-Schema verwenden. Bestimmt, ob sich das Feld im reinen Lese-Zustand befindet.                                                                                                                                                                                                                          |
| luxErrorCallback       | LuxErrorCallbackFnType | Callback-Funktion die aufgerufen wird nachdem die Validierung der Component stattgefunden hat. Hier kann dann entsprechend aus dem übergebenen Errors-Objekt ein Fehler ausgelesen und die passende Fehlermeldung zurückgegeben werden. Liefert der Callback `undefined` zurück, wird die Defaultfehlermeldung ausgegeben. <br><br>Siehe auch den Warnhinweis im Abschnitt _luxRequired_. |
| luxControlValidators   | ValidatorFnType        | Validator-Funktion oder ein Array von Validator-Funktionen, die für diese Component hereingereicht werden können. Diese werden nur für nicht-ReactiveForms-Components angewendet und sollen so eine Validierung für "normale" Komponenten ermöglichen.                                                                                                                                    |
| luxLabel               | string                 | Property welche ein Label oberhalb der FormComponent (Ausnahme: LuxToggle und LuxCheckbox, diese stellen das Label rechts von der Schaltfläche dar) darstellt. Technisch als `model()` umgesetzt; eine Two-Way-Bindung wird nicht benötigt.                                                                                                                                               |
| luxHint                | string                 | Property, welche einen Tipp/Text unterhalb der FormComponent darstellt. Alternativ kann man über das Content-Child `lux-form-hint` komplexere Hinweise (z.B. mit einem Link) darstellen.                                                                                                                                                                                                  |
| luxHintShowOnlyOnFocus | boolean                | Gibt an, ob der Hinweis (siehe luxHint) nur angezeigt wird, wenn das Element den Fokus hat.                                                                                                                                                                                                                                                                                               |
| luxNoLabels            | boolean                | Gibt an, ob Labels angezeigt werden sollen.                                                                                                                                                                                                                                                                                                                                               |
| luxNoTopLabel          | boolean                | Gibt an, ob das obere Label angezeigt werden soll.                                                                                                                                                                                                                                                                                                                                        |
| luxNoBottomLabel       | boolean                | Gibt an, ob das untere Label (Hinweis oder Fehlermeldung) angezeigt werden soll.                                                                                                                                                                                                                                                                                                          |
| luxDense               | boolean                | Property um die Höhe der Komponente zu verringern. Diese Eigenschaft ist für den Einsatz in großen Formularen gedacht und soll nicht standardmäßig in einer Anwendung genutzt werden.                                                                                                                                                                                                     |
| luxId                  | string                 | Id des Formularelements. Ohne Angabe wird eine eindeutige Id generiert.                                                                                                                                                                                                                                                                                                                   |
| luxAriaLabel           | string                 | Setzt `aria-label` am Eingabeelement. Nur für Felder ohne sichtbares Label gedacht; ein abweichendes aria-label überschreibt ein sichtbares Label (WCAG 2.5.3).                                                                                                                                                                                                                           |
| luxAriaLabelledby      | string                 | Verweist per `aria-labelledby` auf ein externes Label-Element. Hat Vorrang vor luxAriaLabel und luxLabel.                                                                                                                                                                                                                                                                                 |
| luxFormGroup           | FormGroup              | **Veraltet**, stattdessen `[formField]` verwenden. FormGroup, in der das luxControlBinding gesucht wird, wenn die Komponente nicht innerhalb von `[formGroup]` steht.                                                                                                                                                                                                                     |
| luxFormControl         | FormControl            | **Veraltet**, stattdessen `[formField]` verwenden. Direkt übergebenes FormControl.                                                                                                                                                                                                                                                                                                        |

### @Output

| Name              | Typ        | Beschreibung                                                                                                                                                                                                      |
| ----------------- | ---------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| luxCheckedChange  | boolean    | Gehört zur veralteten `luxChecked`-API, stattdessen `(checkedChange)` verwenden. Output-Event welches ausgelöst wird, sobald sich der Checked-Zustand geändert hat. Ermöglicht das Two-Way-Binding an luxChecked. |
| luxFocusIn        | FocusEvent | Event welches beim Fokussieren des Elements ausgelöst wird und ein Objekt vom Typ FocusEvent weitergibt.                                                                                                          |
| luxFocusOut       | FocusEvent | Event welches beim Fokusverlust des Elements ausgelöst wird und ein Objekt vom Typ FocusEvent weitergibt.                                                                                                         |
| luxDisabledChange | boolean    | Event welches beim Disablen des Elements ausgelöst wird.                                                                                                                                                          |
| checkedChange     | boolean    | Wird ausgelöst, wenn sich der Checked-Zustand ändert (implizit aus dem `checked`-Model, Grundlage von `[(checked)]`).                                                                                             |
| luxBlur           | FocusEvent | Wird ausgelöst, wenn das Element selbst den Fokus verliert (Kindelemente werden nicht betrachtet).                                                                                                                |
| luxFocus          | FocusEvent | Wird ausgelöst, wenn das Element selbst den Fokus erhält (Kindelemente werden nicht betrachtet).                                                                                                                  |

## Beispiele

### 1. Signal Forms

Ab v22 lässt sich die Komponente über `[formField]` an ein [Angular Signal Form](https://angular.dev/guide/forms/signals/overview) binden. Pflichtfeld, Deaktivierung und Validierung werden im Schema von `form()` festgelegt. Ein dort hinterlegter `message`-Text wird als Fehlermeldung angezeigt (`luxErrorMessage` und `luxErrorCallback` haben Vorrang). Die Direktive `FormField` muss in den `imports` der Komponente stehen.

Ts

```typescript
import { FormField, form, required } from '@angular/forms/signals';

readonly model = signal({ agbAccepted: false });
readonly agbForm = form(this.model, (path) => {
  required(path.agbAccepted, { message: 'Bitte bestätigen Sie die AGB.' });
});
```

Html

```html
<lux-checkbox luxLabel="Ich habe die AGB gelesen" [formField]="agbForm.agbAccepted" />
```

### 2. Ohne Formular

![Beispielbild 01](https://raw.githubusercontent.com/IHK-GfI/lux-components-workspace/main/projects/lux-components-wiki/Versions/v22/lux‐checkbox-v22-img-01.png)

Ts

```typescript
readonly checked = signal(true);

onCheckedChange($event: boolean) {
  this.checked.set($event);
  console.log($event);
}
```

Html

```html
<lux-checkbox
  luxLabel="Hungrig"
  [checked]="checked()"
  (checkedChange)="onCheckedChange($event)"
/>
```

### 3. Mit Two-Way-Binding

![Beispielbild 02](https://raw.githubusercontent.com/IHK-GfI/lux-components-workspace/main/projects/lux-components-wiki/Versions/v22/lux‐checkbox-v22-img-02.png)

Ts

```typescript
readonly checked = signal(true);
```

Html

```html
<lux-checkbox luxLabel="Hungrig" [(checked)]="checked" />
```

### 4. Mit Formular

> **Veraltet:** Die Reactive-Forms-Variante (`luxControlBinding`) in diesem Beispiel funktioniert in v22 weiterhin, entfällt aber mit der nächsten Major-Version. Für neue Formulare bitte Signal Forms verwenden (siehe [1. Signal Forms](#1-signal-forms)).

![Beispielbild 03](https://raw.githubusercontent.com/IHK-GfI/lux-components-workspace/main/projects/lux-components-wiki/Versions/v22/lux‐checkbox-v22-img-03.png)

Ts

```typescript
readonly myGroup = new FormGroup({
  hungry: new FormControl<boolean>(false, {
    validators: Validators.requiredTrue,
    nonNullable: true,
  }),
});
```

Html

```html
<form [formGroup]="myGroup">
  <lux-checkbox
    luxLabel="Hungrig"
    luxControlBinding="hungry"
  />
</form>
```
