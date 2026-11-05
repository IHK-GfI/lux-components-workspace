# LUX-Textarea

![Beispielbild LUX-Textarea](https://raw.githubusercontent.com/IHK-GfI/lux-components-workspace/main/projects/lux-components-wiki/Versions/v22/lux‐textarea-v22-img.png)

- [LUX-Textarea](#lux-textarea)
  - [Overview / API](#overview--api)
    - [Allgemein](#allgemein)
    - [@Input](#input)
    - [@Output](#output)
  - [Beispiele](#beispiele)
    - [1. Signal Forms](#1-signal-forms)
    - [2. Ohne Formular](#2-ohne-formular)
    - [3. Mit Formular](#3-mit-formular)

## Overview / API

### Allgemein

| Name     | Beschreibung |
| -------- | ------------ |
| selector | lux-textarea, lux-textarea-ac |

### @Input

| Name                   | Typ                    | Beschreibung                                                                                                                                                                                                                                                                                                                                                                 |
| ---------------------- | ---------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| luxName                | string                 | Der Name des Elements.                                                                                                                                                                                                                                                                                                                                                       |
| luxMaxRows | number | Bestimmt die maximale Anzahl an Zeilen, die dieses Textarea-Feld haben kann. -1 bedeutet, dass kein Wert festgelegt ist. Default: -1. |
| luxMinRows | number | Bestimmt die minimale Anzahl an Zeilen, die von dieser Textarea angezeigt werden. Default: 0. |
| luxMaxLength | number | Gibt an, wie viele Zeichen erlaubt sind (0 = unbegrenzt). <br><br> Solange die Textarea den Fokus hat, wird ein Label angezeigt, das angibt, wie viele Zeichen (z.B. 10/50) bereits eingegeben wurden. Über die Eigenschaft `luxHideCounterLabel` kann dieses Label ausgeblendet werden. Default: 0. |
| luxHideCounterLabel | boolean | Blendet das Zähler-Label aus (siehe luxMaxLength). Default: false. |
| luxPlaceholder | string | Text, der als Platzhalter dargestellt wird, solange kein anderer Wert eingetragen ist. Default: ''. |
| luxAutocomplete | string | Steuert, ob der Browser den Inhalt cachen darf. Default: 'on'. |
| formField              | FieldTree\<T\>         | Bindet das Element an ein Feld eines [Angular Signal Forms](https://angular.dev/guide/forms/signals/overview) (Direktive `FormField` aus `@angular/forms/signals`). Pflichtfeld, Deaktivierung und Fehler werden aus dem Schema übernommen.                                                                                                                                  |
| value                  | string                 | Der Wert des Elements. Two-Way-Binding über `[(value)]`. Innerhalb eines Signal Forms wird stattdessen `[formField]` verwendet.                                                                                                                                                                                                                                              |
| luxValue               | string                 | **Veraltet**, stattdessen `[(value)]` bzw. `[formField]` verwenden. Der Textwert des Input-Felds. Two-Way-Binding ebenfalls möglich, wenn das Input-Feld nicht innerhalb eines Reactive-Forms ist.                                                                                                                                                                           |
| luxTagId               | string                 | [LUX-Tag-Id](luxTagId-v22#direkte-konfiguration) für die automatischen Tests.                                                                                                                                                                                                                                                                                                |
| luxRequired            | boolean                | Bestimmt, ob die Komponente ein Pflichtfeld ist oder nicht. Technisch als `model()` umgesetzt; eine Two-Way-Bindung wird nicht benötigt.                                                                                                                                                                                                                                     |
| luxControlBinding      | string                 | **Veraltet**, stattdessen `[formField]` verwenden. Das Controlbinding (z.B. firstname) verbindet das Formularelement mit einem Wert aus dem Modell. (!) Diese Eigenschaft kann nur verwendet werden, wenn das Element innerhalb eines Formulars verwendet wird.                                                                                                              |
| luxErrorMessage        | string                 | Fehlertext, wenn das Formularelement nicht valide ist. Der Fehlertext ersetzt den Hinweistext, wenn es einen gibt. Ersetzt den luxErrorCallback, wenn gesetzt.                                                                                                                                                                                                               |
| luxDisabled            | boolean                | Bestimmt, ob die Component deaktiviert ist oder nicht. Two-Way-Binding über `[(luxDisabled)]` möglich.                                                                                                                                                                                                                                                                       |
| luxReadonly            | boolean                | **Veraltet**, stattdessen `[readonly]` bzw. die `readonly()`-Regel im Signal-Forms-Schema verwenden. Bestimmt, ob sich das Feld im reinen Lese-Zustand befindet.                                                                                                                                                                                                             |
| luxErrorCallback       | LuxErrorCallbackFnType | Callback-Funktion die aufgerufen wird nachdem die Validierung der Component stattgefunden hat. Hier kann dann entsprechend aus dem übergebenen Errors-Objekt ein Fehler ausgelesen und die passende Fehlermeldung zurückgegeben werden. Liefert der Callback `undefined` zurück, wird die Defaultfehlermeldung ausgegeben.                                                   |
| luxControlValidators   | ValidatorFnType        | Validator-Funktion oder ein Array von Validator-Funktionen, die für diese Component hereingereicht werden können. Diese werden nur für nicht-ReactiveForms-Components angewendet und sollen so eine Validierung für "normale" Komponenten ermöglichen.                                                                                                                       |
| luxLabel               | string                 | Property welche ein Label oberhalb der FormComponent (Ausnahme: LuxToggle und LuxCheckbox, diese stellen das Label rechts von der Schaltfläche dar) darstellt. Technisch als `model()` umgesetzt; eine Two-Way-Bindung wird nicht benötigt.                                                                                                                                  |
| luxHint                | string                 | Property, welche einen Tipp/Text unterhalb der FormComponent darstellt. Alternativ kann man über das Content-Child `lux-form-hint` komplexere Hinweise (z.B. mit einem Link) darstellen.                                                                                                                                                                                     |
| luxHintShowOnlyOnFocus | boolean                | Gibt an, ob der Hinweis (siehe luxHint) nur angezeigt wird, wenn das Element den Fokus hat.                                                                                                                                                                                                                                                                                  |
| luxLabelLongFormat     | boolean                | Bestimmt, ob das Label mehrzeilig sein kann. Nutzung nur in Spalten empfohlen, da die Höhe des Formcontrols variieren kann. Dadurch kann die Ausrichtung an der Baseline nicht mehr gewährleistet werden.                                                                                                                                                                    |
| luxNoLabels            | boolean                | Gibt an, ob Labels angezeigt werden sollen.                                                                                                                                                                                                                                                                                                                                  |
| luxNoTopLabel | boolean | Gibt an, ob das obere Label angezeigt werden soll. |
| luxNoBottomLabel       | boolean                | Gibt an, ob das untere Label (Hinweis oder Fehlermeldung) angezeigt werden soll.                                                                                                                                                                                                                                                                                             |
| luxDense               | boolean                | Property um die Höhe der Komponente zu verringern. Diese Eigenschaft ist für den Einsatz in großen Formularen gedacht und soll nicht standardmäßig in einer Anwendung genutzt werden.                                                                                                                                                                                        |
| luxId                  | string                 | Id des Formularelements. Ohne Angabe wird eine eindeutige Id generiert.                                                                                                                                                                                                                                                                                                      |
| luxAriaLabel           | string                 | Setzt `aria-label` am Eingabeelement. Nur für Felder ohne sichtbares Label gedacht; ein abweichendes aria-label überschreibt ein sichtbares Label (WCAG 2.5.3).                                                                                                                                                                                                              |
| luxAriaLabelledby      | string                 | Verweist per `aria-labelledby` auf ein externes Label-Element. Hat Vorrang vor luxAriaLabel und luxLabel.                                                                                                                                                                                                                                                                    |
| luxFormGroup           | FormGroup              | **Veraltet**, stattdessen `[formField]` verwenden. FormGroup, in der das luxControlBinding gesucht wird, wenn die Komponente nicht innerhalb von `[formGroup]` steht.                                                                                                                                                                                                        |
| luxFormControl         | FormControl            | **Veraltet**, stattdessen `[formField]` verwenden. Direkt übergebenes FormControl.                                                                                                                                                                                                                                                                                           |

### @Output

| Name              | Typ        | Beschreibung                                                                                                                                                                                                                                                                                       |
| ----------------- | ---------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| luxValueChange    | string     | Gehört zur veralteten `luxValue`-API, stattdessen `(valueChange)` verwenden. Output-Event das bei Änderungen am Value-Feld ausgestoßen wird. Ermöglicht das Two-Way-Binding an luxValue.                                                                                                           |
| luxBlur           | FocusEvent | Event welches beim Fokusverlust des Elements ausgelöst wird und ein Objekt vom Typ FocusEvent weitergibt. Unterschied zu luxFocusOut (LUX-FORM-COMPONENT-BASE) ist der, dass dieses Event nur ausgegeben wird wenn das Element selbst den Fokus verliert und Kindelemente nicht betrachtet werden. |
| luxFocus          | FocusEvent | Event welches beim Fokussieren des Elements ausgelöst wird und ein Objekt vom Typ FocusEvent weitergibt. Unterschied zu luxFocusIn (LUX-FORM-COMPONENT-BASE) ist der, dass dieses Event nur ausgegeben wird wenn das Element selbst den Fokus erhält und Kindelemente nicht betrachtet werden.     |
| luxFocusIn        | FocusEvent | Event welches beim Fokussieren des Elements ausgelöst wird und ein Objekt vom Typ FocusEvent weitergibt.                                                                                                                                                                                           |
| luxFocusOut       | FocusEvent | Event welches beim Fokusverlust des Elements ausgelöst wird und ein Objekt vom Typ FocusEvent weitergibt.                                                                                                                                                                                          |
| luxDisabledChange | boolean    | Event welches beim Disablen des Elements ausgelöst wird.                                                                                                                                                                                                                                           |
| valueChange       | string     | Wird ausgelöst, wenn sich der Wert ändert (implizit aus dem `value`-Model, Grundlage von `[(value)]`).                                                                                                                                                                                             |

## Beispiele

### 1. Signal Forms

Ab v22 lässt sich die Komponente über `[formField]` an ein [Angular Signal Form](https://angular.dev/guide/forms/signals/overview) binden. Pflichtfeld, Deaktivierung und Validierung werden im Schema von `form()` festgelegt. Ein dort hinterlegter `message`-Text wird als Fehlermeldung angezeigt (`luxErrorMessage` und `luxErrorCallback` haben Vorrang). Die Direktive `FormField` muss in den `imports` der Komponente stehen.

Ts

```typescript
import { FormField, form, maxLength, required } from '@angular/forms/signals';

readonly model = signal({ comment: '' });
readonly commentForm = form(this.model, (path) => {
  required(path.comment, { message: 'Bitte geben Sie eine Anmerkung ein.' });
  maxLength(path.comment, 500);
});
```

Html

```html
<lux-textarea luxLabel="Anmerkung" [luxMaxLength]="500" [formField]="commentForm.comment" />
```

### 2. Ohne Formular

![Beispielbild 01](https://raw.githubusercontent.com/IHK-GfI/lux-components-workspace/main/projects/lux-components-wiki/Versions/v22/lux‐textarea-v22-img-01.png)

Ts

```typescript
readonly value = signal('');
```

Html

```html
<lux-textarea
  luxLabel="Adressinformationen"
  luxPlaceholder="Maria Musterfrau"
  luxHint="Bitte tragen Sie hier Ihre Daten ein"
  [luxMaxRows]="5"
  [(value)]="value"
  [luxMinRows]="1"
/>
```

### 3. Mit Formular

> **Veraltet:** Die Reactive-Forms-Variante (`luxControlBinding`) in diesem Beispiel funktioniert in v22 weiterhin, entfällt aber mit der nächsten Major-Version. Für neue Formulare bitte Signal Forms verwenden (siehe [1. Signal Forms](#1-signal-forms)).

![Beispielbild 02](https://raw.githubusercontent.com/IHK-GfI/lux-components-workspace/main/projects/lux-components-wiki/Versions/v22/lux‐textarea-v22-img-02.png)

Ts

```typescript
readonly myGroup = new FormGroup({
  textarea: new FormControl<string>('')
});
```

Html

```html
<form [formGroup]="myGroup">
  <lux-textarea
    luxLabel="Adressinformationen"
    luxPlaceholder="Maria Musterfrau"
    luxHint="Bitte tragen Sie hier Ihre Daten ein"
    [luxMaxRows]="5"
    [luxMinRows]="1"
    luxControlBinding="textarea"
  />
</form>
<p>{{ myGroup.value | json }}</p>
```

Für die `json`-Pipe muss `JsonPipe` in den `imports` der Komponente stehen.
