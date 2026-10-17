# LUX-Timepicker

- [LUX-Timepicker](#lux-timepicker)
  - [Overview / API](#overview--api)
    - [Allgemein](#allgemein)
    - [@Input](#input)
    - [@Output](#output)
  - [Beispiele](#beispiele)
    - [1. Signal Forms](#1-signal-forms)
    - [2. Ohne Formular](#2-ohne-formular)
    - [3. Mit Formular](#3-mit-formular)
    - [4. Min- und Max-Time](#4-min--und-max-time)
    - [5. Kombination: Datepicker + Timepicker im Formular](#5-kombination-datepicker--timepicker-im-formular)

## Overview / API

### Allgemein

| Name     | Beschreibung   |
| -------- | -------------- |
| selector | lux-timepicker |

### @Input

| Name                   | Typ                                               | Beschreibung                                                                                                                                                                                                                                |
| ---------------------- | ------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| formField              | FieldTree\<T\>                                    | Bindet das Element an ein Feld eines [Angular Signal Forms](https://angular.dev/guide/forms/signals/overview) (Direktive `FormField` aus `@angular/forms/signals`). Pflichtfeld, Deaktivierung und Fehler werden aus dem Schema übernommen. |
| value | string \| null (ISO 8601 z.B. '1970-01-01T14:15:00.000Z') | Der Wert des Elements. Two-Way-Binding über `[(value)]`. Innerhalb eines Signal Forms wird stattdessen `[formField]` verwendet. |
| luxValue | string \| null (ISO 8601 z.B. '1970-01-01T14:15:00.000Z') | **Veraltet**, stattdessen `[(value)]` bzw. `[formField]` verwenden. Beinhaltet den aktuellen Wert des Timepickers. Initial kann auch ein Date-Objekt hereingereicht werden, dieses wird dann von der Component konvertiert. |
| luxOpened | boolean | Bestimmt, ob das Auswahlfenster ausgeklappt oder eingeklappt ist. Default: false. |
| luxShowToggle | boolean | Bestimmt, ob der Toggle-Button sichtbar ist oder nicht. Default: true. |
| luxInterval | string \| number \| null | Intervall für die Zeitauswahl, z.B. `15m`, `30m` oder `1h`. Default: '30m'. |
| luxMinTime | string (z.B. 08:00) | Minimale zulässige Zeit. Default: null. |
| luxMaxTime | string (z.B. 18:00) | Maximale zulässige Zeit. Default: null. |
| luxPlaceholder | string | Platzhaltertext. Default: ''. |
| luxRequired            | boolean                                           | Bestimmt, ob die Component ein Pflichtfeld ist oder nicht. Technisch als `model()` umgesetzt; eine Two-Way-Bindung wird nicht benötigt.                                                                                                     |
| luxControlBinding      | string                                            | **Veraltet**, stattdessen `[formField]` verwenden. Bindet das Formularelement an ein Reactive-Form-Control. Bei der Kombination mit `luxReferenceControl` wird `updateOn: 'blur'` benötigt.                                                 |
| luxErrorMessage        | string                                            | Feste Fehlermeldung für ungültige Eingaben.                                                                                                                                                                                                 |
| luxDisabled | boolean | Bestimmt, ob die Component deaktiviert ist oder nicht. Two-Way-Binding über `[(luxDisabled)]` möglich. |
| luxReadonly            | boolean                                           | **Veraltet**, stattdessen `[readonly]` bzw. die `readonly()`-Regel im Signal-Forms-Schema verwenden. Bestimmt, ob sich das Feld im reinen Lese-Zustand befindet.                                                                            |
| luxLabel               | string                                            | Label oberhalb der Component. Technisch als `model()` umgesetzt; eine Two-Way-Bindung wird nicht benötigt.                                                                                                                                  |
| luxHint                | string                                            | Hinweistext unterhalb der Component.                                                                                                                                                                                                        |
| luxHintShowOnlyOnFocus | boolean                                           | Zeigt den Hinweis nur bei Fokus an.                                                                                                                                                                                                         |
| luxNoLabels            | boolean                                           | Gibt an, ob Labels angezeigt werden sollen.                                                                                                                                                                                                 |
| luxNoTopLabel          | boolean                                           | Gibt an, ob das obere Label angezeigt werden soll.                                                                                                                                                                                          |
| luxNoBottomLabel       | boolean                                           | Gibt an, ob das untere Label angezeigt werden soll.                                                                                                                                                                                         |
| luxReferenceControl | LuxReferenceControl | Referenz auf eine verknüpfte Datepicker-Komponente (bzw. eine Komponente, die das Interface `LuxReferenceControl` erfüllt), damit Datum und Uhrzeit kombiniert in einem gemeinsamen ISO-Wert gespeichert werden (siehe Beispiel 5). |
| luxAutocomplete        | string                                            | Steuert, ob der Browser den Inhalt cachen darf. Default: `off`.                                                                                                                                                                             |
| luxTagId               | string                                            | [LUX-Tag-Id](luxTagId-v22#direkte-konfiguration) für die automatischen Tests.                                                                                                                                                               |
| luxControlValidators   | ValidatorFnType                                   | Validator-Funktion oder ein Array von Validator-Funktionen für den Einsatz ohne Formular (z.B. mit `[(value)]`).                                                                                                                            |
| luxErrorCallback       | LuxErrorCallbackFnType                            | Callback-Funktion, die nach der Validierung aufgerufen wird und aus dem Errors-Objekt eine Fehlermeldung ermitteln kann. Liefert der Callback `undefined` zurück, wird die Defaultfehlermeldung ausgegeben.                                 |
| luxLabelLongFormat     | boolean                                           | Bestimmt, ob das Label mehrzeilig sein kann.                                                                                                                                                                                                |
| luxDense               | boolean                                           | Property um die Höhe der Komponente zu verringern. Diese Eigenschaft ist für den Einsatz in großen Formularen gedacht und soll nicht standardmäßig in einer Anwendung genutzt werden.                                                       |
| luxId                  | string                                            | Id des Formularelements. Ohne Angabe wird eine eindeutige Id generiert.                                                                                                                                                                     |
| luxAriaLabel           | string                                            | Setzt `aria-label` am Eingabeelement. Nur für Felder ohne sichtbares Label gedacht; ein abweichendes aria-label überschreibt ein sichtbares Label (WCAG 2.5.3).                                                                             |
| luxAriaLabelledby      | string                                            | Verweist per `aria-labelledby` auf ein externes Label-Element. Hat Vorrang vor luxAriaLabel und luxLabel.                                                                                                                                   |
| luxFormGroup           | FormGroup                                         | **Veraltet**, stattdessen `[formField]` verwenden. FormGroup, in der das luxControlBinding gesucht wird, wenn die Komponente nicht innerhalb von `[formGroup]` steht.                                                                       |
| luxFormControl         | FormControl                                       | **Veraltet**, stattdessen `[formField]` verwenden. Direkt übergebenes FormControl.                                                                                                                                                          |

### @Output

| Name              | Typ            | Beschreibung                                                                                                         |
| ----------------- | -------------- | -------------------------------------------------------------------------------------------------------------------- |
| luxValueChange    | string         | Gehört zur veralteten `luxValue`-API, stattdessen `(valueChange)` verwenden. Wird bei Änderungen am Value ausgelöst. |
| luxBlur           | FocusEvent     | Wird ausgelöst, wenn das Element selbst den Fokus verliert.                                                          |
| luxFocus          | FocusEvent     | Wird ausgelöst, wenn das Element den Fokus erhält.                                                                   |
| luxFocusIn        | FocusEvent     | Wird ausgelöst, wenn das Element fokussiert wird.                                                                    |
| luxFocusOut       | FocusEvent     | Wird ausgelöst, wenn das Element den Fokus verliert.                                                                 |
| luxDisabledChange | boolean        | Wird beim Ändern des Disabled-Status ausgelöst.                                                                      |
| valueChange       | string \| null | Wird ausgelöst, wenn sich der Wert ändert (implizit aus dem `value`-Model, Grundlage von `[(value)]`).               |

## Beispiele

### 1. Signal Forms

Ab v22 lässt sich die Komponente über `[formField]` an ein [Angular Signal Form](https://angular.dev/guide/forms/signals/overview) binden. Pflichtfeld, Deaktivierung und Validierung werden im Schema von `form()` festgelegt. Ein dort hinterlegter `message`-Text wird als Fehlermeldung angezeigt (`luxErrorMessage` und `luxErrorCallback` haben Vorrang). Die Direktive `FormField` muss in den `imports` der Komponente stehen.

`luxMinTime` und `luxMaxTime` schränken die Auswahl ein. Die passende Fehlermeldung liefert im Signal Form der Validator `luxTimepickerMinMax()`. Er ruft intern `inject()` auf und kann deshalb nur im Injection Context verwendet werden (z.B. im Schema von `form()` in einem Feld-Initialisierer). `min` und `max` werden als Funktionen übergeben, damit auch veränderliche Werte (z.B. Signale) berücksichtigt werden.

Ts

```typescript
import { FormField, form, required, validate } from '@angular/forms/signals';
import { luxTimepickerMinMax } from '@ihk-gfi/lux-components';

// Der Wert ist ein ISO-8601-String, z.B. '1970-01-01T14:15:00.000Z'.
readonly model = signal<{ start: string | null }>({ start: null });
readonly timeForm = form(this.model, (path) => {
  required(path.start);
  validate(path.start, luxTimepickerMinMax({ min: () => '08:00', max: () => '18:00' }));
});
```

Html

```html
<lux-timepicker
  luxLabel="Beginn"
  luxMinTime="08:00"
  luxMaxTime="18:00"
  [formField]="timeForm.start"
/>
```

### 2. Ohne Formular

![Beispielbild 01](https://raw.githubusercontent.com/IHK-GfI/lux-components-workspace/main/projects/lux-components-wiki/Versions/v22/lux‐timepicker-v22-img-01.png)

Ts

```typescript
readonly value = signal<string | null>('1970-01-01T14:15:00.000Z');
```

Html

```html
<lux-timepicker
  luxLabel="Timepicker"
  luxInterval="15m"
  [(value)]="value"
/>
```

### 3. Mit Formular

> **Veraltet:** Die Reactive-Forms-Variante (`luxControlBinding`) in diesem Beispiel funktioniert in v22 weiterhin, entfällt aber mit der nächsten Major-Version. Für neue Formulare bitte Signal Forms verwenden (siehe [1. Signal Forms](#1-signal-forms)).

![Beispielbild 02](https://raw.githubusercontent.com/IHK-GfI/lux-components-workspace/main/projects/lux-components-wiki/Versions/v22/lux‐timepicker-v22-img-02.png)

Ts

```typescript
readonly form = new FormGroup({
  timepicker: new FormControl<string | null>('1970-01-01T14:15:00.000Z')
});
```

Html

```html
<div [formGroup]="form">
  <lux-timepicker luxLabel="Timepicker" luxControlBinding="timepicker" />
</div>
```

### 4. Min- und Max-Time

![Beispielbild 03](https://raw.githubusercontent.com/IHK-GfI/lux-components-workspace/main/projects/lux-components-wiki/Versions/v22/lux‐timepicker-v22-img-03.png)

Ts

```typescript
readonly value = signal<string | null>('1970-01-01T14:15:00.000Z');
```

Html

```html
<lux-timepicker
  luxLabel="Timepicker"
  luxMinTime="08:00"
  luxMaxTime="18:00"
  [(value)]="value"
/>
```

### 5. Kombination: Datepicker + Timepicker im Formular

> **Veraltet:** Die Reactive-Forms-Variante (`luxControlBinding`) in diesem Beispiel funktioniert in v22 weiterhin, entfällt aber mit der nächsten Major-Version. Für neue Formulare bitte Signal Forms verwenden (siehe [1. Signal Forms](#1-signal-forms)).

![Beispielbild 04](https://raw.githubusercontent.com/IHK-GfI/lux-components-workspace/main/projects/lux-components-wiki/Versions/v22/lux‐timepicker-v22-img-04.png)

Datum und Uhrzeit können über `luxReferenceControl` miteinander verknüpft werden, um einen kombinierten ISO-Wert zu verwenden:

Ts

```typescript
readonly form = new FormGroup({
  dateTime: new FormControl<string | null>('2026-06-18T14:15:00.000Z', { updateOn: 'blur' })
});
```

Html

```html
<div [formGroup]="form">
  <div class="lux-flex lux-gap-4">
    <lux-datepicker
      class="lux-flex-auto"
      luxLabel="Datum"
      luxControlBinding="dateTime"
      [luxReferenceControl]="timepicker"
      #datepicker
    />
    <lux-timepicker
      class="lux-flex-auto"
      luxLabel="Uhrzeit"
      luxControlBinding="dateTime"
      [luxReferenceControl]="datepicker"
      luxInterval="15m"
      #timepicker
    />
  </div>
</div>
```

**Hinweis:** Das Timepicker-FormControl sollte mit `updateOn: 'blur'` konfiguriert werden, wenn es mit einem Datepicker-Control verknüpft ist, um unerwartete Änderungsschleifen zu vermeiden.
