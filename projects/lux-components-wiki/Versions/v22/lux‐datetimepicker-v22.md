# LUX-Datetimepicker

![Beispielbild LUX-Datetimepicker](https://raw.githubusercontent.com/IHK-GfI/lux-components-workspace/main/projects/lux-components-wiki/Versions/v22/lux‐datetimepicker-v22-img.png)

- [LUX-Datetimepicker](#lux-datetimepicker)
  - [Overview / API](#overview--api)
    - [Allgemein](#allgemein)
    - [@Input](#input)
    - [@Output](#output)
  - [Beispiele](#beispiele)
    - [1. Signal Forms](#1-signal-forms)
    - [2. Ohne Formular](#2-ohne-formular)
    - [3. Mit Formular](#3-mit-formular)
    - [4. Min- und Max-Datum](#4-min--und-max-datum)
    - [5. Eigener Filter](#5-eigener-filter)

## Overview / API

### Allgemein

| Name     | Beschreibung                              |
| -------- | ----------------------------------------- |
| selector | lux-datetimepicker, lux-datetimepicker-ac |

### @Input

| Name                   | Typ                                                       | Beschreibung                                                                                                                                                                                                                                                                                                                         |
| ---------------------- | --------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| formField              | FieldTree\<T\>                                            | Bindet das Element an ein Feld eines [Angular Signal Forms](https://angular.dev/guide/forms/signals/overview) (Direktive `FormField` aus `@angular/forms/signals`). Pflichtfeld, Deaktivierung und Fehler werden aus dem Schema übernommen.                                                                                          |
| value                  | string \| null (ISO 8601 z.B. '2021-09-21T12:15:00.000Z') | Der Wert des Elements. Two-Way-Binding über `[(value)]`. Innerhalb eines Signal Forms wird stattdessen `[formField]` verwendet.                                                                                                                                                                                                      |
| luxValue               | string \| null (ISO 8601 z.B. '2021-09-21T12:15:00.000Z') | **Veraltet**, stattdessen `[(value)]` bzw. `[formField]` verwenden. Beinhaltet den aktuellen Wert des Datepickers als String (ISO 8601 z.B. '2021-09-21T00:00:00.000Z'). Initial kann auch ein Date-Objekt (UTC z.B. new Date(Date.UTC(2021, 8, 21, 12, 15))) hereingereicht werden, dieses wird dann von der Component konvertiert. |
| luxStartView           | 'month', 'year', 'multi-year'                             | Bestimmt die Startansicht des Datepickers. Default: 'month'.                                                                                                                                                                                                                                                                         |
| luxStartDate           | string (z.B. 01.01.2000, 00:00)                           | Legt die Standarddatum im Popup fest, wenn kein Wert gesetzt ist.                                                                                                                                                                                                                                                                    |
| luxStartTime           | number[] (z.B. \[12, 15\])                                | Legt die Standardzeit im Popup fest, wenn kein Wert gesetzt ist. Default: [].                                                                                                                                                                                                                                                        |
| luxMinDate             | string (z.B. 01.01.2000, 00:00)                           | Das minimal zulässige Datum für den Datepicker.                                                                                                                                                                                                                                                                                      |
| luxMaxDate             | string (z.B. 31.12.2000, 23:59)                           | Das maximale zulässige Datum für den Datepicker.                                                                                                                                                                                                                                                                                     |
| luxOpened              | boolean                                                   | Bestimmt, ob das Auswahlfenster ausgeklappt oder eingeklappt ist. Default: false.                                                                                                                                                                                                                                                    |
| luxShowToggle          | boolean                                                   | Gibt an, ob der Toggle-Button sichtbar ist oder nicht. Default: true.                                                                                                                                                                                                                                                                |
| luxCustomFilter        | LuxDateFilterFn                                           | Der optionale eigene Filter für den Datepicker.                                                                                                                                                                                                                                                                                      |
| luxTagId               | string                                                    | [LUX-Tag-Id](luxTagId-v22#direkte-konfiguration) für die automatischen Tests.                                                                                                                                                                                                                                                        |
| luxPlaceholder         | string                                                    | Text der als Platzhalter, solange kein anderer Wert eingetragen ist, dargestellt wird.                                                                                                                                                                                                                                               |
| luxAutocomplete        | string                                                    | Steuert, ob der Browser den Inhalt cachen darf. Default: 'off'.                                                                                                                                                                                                                                                                      |
| luxRequired            | boolean                                                   | Bestimmt, ob die Component ein Pflichtfeld ist oder nicht. Technisch als `model()` umgesetzt; eine Two-Way-Bindung wird nicht benötigt.                                                                                                                                                                                              |
| luxControlBinding      | string                                                    | **Veraltet**, stattdessen `[formField]` verwenden. Das Controlbinding (z.B. firstname) verbindet das Formularelement mit einem Wert aus dem Modell. (!) Diese Eigenschaft kann nur verwendet werden, wenn das Element innerhalb eines Formulars verwendet wird.                                                                      |
| luxErrorMessage        | string                                                    | Fehlertext, wenn das Formularelement nicht valide ist. Der Fehlertext ersetzt den Hinweistext, wenn es einen gibt. Ersetzt den luxErrorCallback, wenn gesetzt.                                                                                                                                                                       |
| luxDisabled            | boolean                                                   | Bestimmt, ob die Component deaktiviert ist oder nicht. Two-Way-Binding über `[(luxDisabled)]` möglich.                                                                                                                                                                                                                               |
| luxReadonly            | boolean                                                   | **Veraltet**, stattdessen `[readonly]` bzw. die `readonly()`-Regel im Signal-Forms-Schema verwenden. Bestimmt, ob sich das Feld im reinen Lese-Zustand befindet.                                                                                                                                                                     |
| luxErrorCallback       | LuxErrorCallbackFnType                                    | Callback-Funktion die aufgerufen wird nachdem die Validierung der Component stattgefunden hat. Hier kann dann entsprechend aus dem übergebenen Errors-Objekt ein Fehler ausgelesen und die passende Fehlermeldung zurückgegeben werden. Liefert der Callback `undefined` zurück, wird die Defaultfehlermeldung ausgegeben.           |
| luxControlValidators   | ValidatorFnType                                           | Validator-Funktion oder ein Array von Validator-Funktionen, die für diese Component hereingereicht werden können. Diese werden nur für nicht-ReactiveForms-Components angewendet und sollen so eine Validierung für "normale" Komponenten ermöglichen.                                                                               |
| luxLabel               | string                                                    | Property welche ein Label oberhalb der FormComponent (Ausnahme: LuxToggle und LuxCheckbox, diese stellen das Label rechts von der Schaltfläche dar) darstellt. Technisch als `model()` umgesetzt; eine Two-Way-Bindung wird nicht benötigt.                                                                                          |
| luxHint                | string                                                    | Property, welche einen Tipp/Text unterhalb der FormComponent darstellt. Alternativ kann man über das Content-Child `lux-form-hint` komplexere Hinweise (z.B. mit einem Link) darstellen.                                                                                                                                             |
| luxHintShowOnlyOnFocus | boolean                                                   | Gibt an, ob der Hinweis (siehe luxHint) nur angezeigt wird, wenn das Element den Fokus hat.                                                                                                                                                                                                                                          |
| luxLabelLongFormat     | boolean                                                   | Bestimmt, ob das Label mehrzeilig sein kann. Nutzung nur in Spalten empfohlen, da die Höhe des Formcontrols variieren kann. Dadurch kann die Ausrichtung an der Baseline nicht mehr gewährleistet werden.                                                                                                                            |
| luxNoLabels            | boolean                                                   | Gibt an, ob Labels angezeigt werden sollen.                                                                                                                                                                                                                                                                                          |
| luxNoTopLabel          | boolean                                                   | Gibt an, ob das obere Label angezeigt werden soll.                                                                                                                                                                                                                                                                                   |
| luxNoBottomLabel       | boolean                                                   | Gibt an, ob das untere Label (Hinweis oder Fehlermeldung) angezeigt werden soll.                                                                                                                                                                                                                                                     |
| luxDense               | boolean                                                   | Property um die Höhe der Komponente zu verringern. Diese Eigenschaft ist für den Einsatz in großen Formularen gedacht und soll nicht standardmäßig in einer Anwendung genutzt werden.                                                                                                                                                |
| luxId                  | string                                                    | Id des Formularelements. Ohne Angabe wird eine eindeutige Id generiert.                                                                                                                                                                                                                                                              |
| luxAriaLabel           | string                                                    | Setzt `aria-label` am Eingabeelement. Nur für Felder ohne sichtbares Label gedacht; ein abweichendes aria-label überschreibt ein sichtbares Label (WCAG 2.5.3).                                                                                                                                                                      |
| luxAriaLabelledby      | string                                                    | Verweist per `aria-labelledby` auf ein externes Label-Element. Hat Vorrang vor luxAriaLabel und luxLabel.                                                                                                                                                                                                                            |
| luxFormGroup           | FormGroup                                                 | **Veraltet**, stattdessen `[formField]` verwenden. FormGroup, in der das luxControlBinding gesucht wird, wenn die Komponente nicht innerhalb von `[formGroup]` steht.                                                                                                                                                                |
| luxFormControl         | FormControl                                               | **Veraltet**, stattdessen `[formField]` verwenden. Direkt übergebenes FormControl.                                                                                                                                                                                                                                                   |

### @Output

| Name              | Typ            | Beschreibung                                                                                                                                                                                                                                                                                       |
| ----------------- | -------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| luxValueChange    | string         | Gehört zur veralteten `luxValue`-API, stattdessen `(valueChange)` verwenden. Output-Event das bei Änderungen am Value-Feld ausgestoßen wird. Ermöglicht das Two-Way-Binding an luxValue.                                                                                                           |
| luxBlur           | FocusEvent     | Event welches beim Fokusverlust des Elements ausgelöst wird und ein Objekt vom Typ FocusEvent weitergibt. Unterschied zu luxFocusOut (LUX-FORM-COMPONENT-BASE) ist der, dass dieses Event nur ausgegeben wird wenn das Element selbst den Fokus verliert und Kindelemente nicht betrachtet werden. |
| luxFocus          | FocusEvent     | Event welches beim Fokussieren des Elements ausgelöst wird und ein Objekt vom Typ FocusEvent weitergibt. Unterschied zu luxFocusIn (LUX-FORM-COMPONENT-BASE) ist der, dass dieses Event nur ausgegeben wird wenn das Element selbst den Fokus erhält und Kindelemente nicht betrachtet werden.     |
| luxFocusIn        | FocusEvent     | Event welches beim Fokussieren des Elements ausgelöst wird und ein Objekt vom Typ FocusEvent weitergibt.                                                                                                                                                                                           |
| luxFocusOut       | FocusEvent     | Event welches beim Fokusverlust des Elements ausgelöst wird und ein Objekt vom Typ FocusEvent weitergibt.                                                                                                                                                                                          |
| luxDisabledChange | boolean        | Event welches beim Disablen des Elements ausgelöst wird.                                                                                                                                                                                                                                           |
| valueChange       | string \| null | Wird ausgelöst, wenn sich der Wert ändert (implizit aus dem `value`-Model, Grundlage von `[(value)]`).                                                                                                                                                                                             |

## Beispiele

### 1. Signal Forms

Ab v22 lässt sich die Komponente über `[formField]` an ein [Angular Signal Form](https://angular.dev/guide/forms/signals/overview) binden. Pflichtfeld, Deaktivierung und Validierung werden im Schema von `form()` festgelegt. Ein dort hinterlegter `message`-Text wird als Fehlermeldung angezeigt (`luxErrorMessage` und `luxErrorCallback` haben Vorrang). Die Direktive `FormField` muss in den `imports` der Komponente stehen.

Ts

```typescript
import { FormField, form, required } from '@angular/forms/signals';

// Der Wert ist ein ISO-8601-String, z.B. '2021-09-21T12:15:00.000Z'.
readonly model = signal<{ appointment: string | null }>({ appointment: null });
readonly appointmentForm = form(this.model, (path) => {
  required(path.appointment, { message: 'Bitte wählen Sie einen Termin.' });
});
```

Html

```html
<lux-datetimepicker luxLabel="Termin" [formField]="appointmentForm.appointment" />
```

### 2. Ohne Formular

![Beispielbild 01](https://raw.githubusercontent.com/IHK-GfI/lux-components-workspace/main/projects/lux-components-wiki/Versions/v22/lux‐datetimepicker-v22-img-01.png)

Ts

```typescript
readonly value = signal<string | null>('2021-09-21T14:15:00.000Z');
readonly valueDisabled = signal<string | null>('2021-09-21T14:15:00.000Z');
```

Html

Der Wert ist immer ein ISO-String. Ein initial übergebenes `Date`-Objekt wird von der Komponente zwar konvertiert, das gebundene Feld wechselt dadurch aber still seinen Typ – daher besser direkt einen ISO-String verwenden.

```html
<div class="lux-flex lux-flex-col">
  <lux-datetimepicker
    luxLabel="Datetimepicker"
    [(value)]="value"
  />
  <lux-datetimepicker
    luxLabel="Datetimepicker"
    [(value)]="valueDisabled"
    [luxDisabled]="true"
  />
</div>
```

### 3. Mit Formular

> **Veraltet:** Die Reactive-Forms-Variante (`luxControlBinding`) in diesem Beispiel funktioniert in v22 weiterhin, entfällt aber mit der nächsten Major-Version. Für neue Formulare bitte Signal Forms verwenden (siehe [1. Signal Forms](#1-signal-forms)).

![Beispielbild 02](https://raw.githubusercontent.com/IHK-GfI/lux-components-workspace/main/projects/lux-components-wiki/Versions/v22/lux‐datetimepicker-v22-img-02.png)

Ts

```typescript
readonly form = new FormGroup({
  valueAsDate: new FormControl<string | null>('2021-09-21T14:15:00.000Z'),
  valueAsIsoString: new FormControl<string | null>({ value: '2021-09-21T14:15:00.000Z', disabled: true })
});
```

Html

```html
<div class="lux-flex lux-flex-col" [formGroup]="form">
  <lux-datetimepicker
    luxLabel="Datetimepicker"
    luxControlBinding="valueAsDate"
  />
  <lux-datetimepicker
    luxLabel="Datetimepicker"
    luxControlBinding="valueAsIsoString"
  />
</div>
```

### 4. Min- und Max-Datum

![Beispielbild 03](https://raw.githubusercontent.com/IHK-GfI/lux-components-workspace/main/projects/lux-components-wiki/Versions/v22/lux‐datetimepicker-v22-img-03.png)

Ts

```typescript
// 01.01.2000, 12:45 Uhr (Ortszeit) - liegt vor dem Minimaldatum und erzeugt daher einen Fehler
readonly value = signal<string | null>(new Date(2000, 0, 1, 12, 45).toISOString());
```

Html

```html
<lux-datetimepicker
  luxLabel="Datetimepicker"
  luxMinDate="02.02.2000, 00:00"
  luxMaxDate="02.02.2050, 23:59"
  [(value)]="value"
/>
```

### 5. Eigener Filter

![Beispielbild 04](https://raw.githubusercontent.com/IHK-GfI/lux-components-workspace/main/projects/lux-components-wiki/Versions/v22/lux‐datetimepicker-v22-img-04.png)

Der Filter erhält im Kalender jeden Tag als lokale Mitternacht (z.B. `new Date(2029, 4, 26)`). Deshalb werden hier - anders als beim [LUX-Datepicker](lux‐datepicker-v22#5-eigener-filter) - die lokalen Methoden (z.B. `getDay()`, `getDate()`) verwendet.

Ts

```typescript
readonly myFilter = (d: Date | null): boolean => {
  let result = false;

  if (d) {
    const day = d.getDay();
    // Samstag und Sonntag in der Date-Auswahl deaktivieren
    result = day !== 0 && day !== 6;
  }

  return result;
};
```

Html

```html
<lux-datetimepicker
  luxLabel="Datetimepicker"
  [luxCustomFilter]="myFilter"
/>
```
