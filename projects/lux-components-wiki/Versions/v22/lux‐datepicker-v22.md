# LUX-Datepicker

![Beispielbild LUX-Datepicker](https://raw.githubusercontent.com/IHK-GfI/lux-components-workspace/main/projects/lux-components-wiki/Versions/v22/lux‐datepicker-v22-img.png)

- [LUX-Datepicker](#lux-datepicker)
  - [Overview / API](#overview--api)
    - [Allgemein](#allgemein)
    - [@Input](#input)
    - [@Output](#output)
  - [Beispiele](#beispiele)
    - [1. Signal Forms](#1-signal-forms)
    - [2. Ohne Formular](#2-ohne-formular)
    - [3. Mit Formular](#3-mit-formular)
    - [4. Min- und Max-Date](#4-min--und-max-date)
    - [5. Eigener Filter](#5-eigener-filter)
  - [Zusatzinformationen](#zusatzinformationen)

## Overview / API

### Allgemein

| Name     | Beschreibung                      |
| -------- | --------------------------------- |
| selector | lux-datepicker, lux-datepicker-ac |

### @Input

| Name                   | Typ                                                       | Beschreibung                                                                                                                                                                                                                                                                                                                                                                                                                      |
| ---------------------- | --------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| formField              | FieldTree\<T\>                                            | Bindet das Element an ein Feld eines [Angular Signal Forms](https://angular.dev/guide/forms/signals/overview) (Direktive `FormField` aus `@angular/forms/signals`). Pflichtfeld, Deaktivierung und Fehler werden aus dem Schema übernommen.                                                                                                                                                                                       |
| value                  | string \| null (ISO 8601 z.B. '2021-09-21T00:00:00.000Z') | Der Wert des Elements. Two-Way-Binding über `[(value)]`. Innerhalb eines Signal Forms wird stattdessen `[formField]` verwendet. Der Tag wird immer als UTC-Mitternacht gespeichert (z.B. '2021-09-21T00:00:00.000Z'). Initial können auch ein reines Datum (z.B. '2021-09-21' oder '21.09.2021') oder ein Date-Objekt (z.B. new Date(Date.UTC(2021, 8, 21))) übergeben werden, siehe [Zusatzinformationen](#zusatzinformationen). |
| luxValue               | string \| null (ISO 8601 z.B. '2021-09-21T00:00:00.000Z') | **Veraltet**, stattdessen `[(value)]` bzw. `[formField]` verwenden. Beinhaltet den aktuellen Wert des Datepickers als ISO-String.                                                                                                                                                                                                                                                                                                 |
| luxStartView           | 'month' \| 'year' \| 'multi-year'                         | Bestimmt die Startansicht des Datepickers (Monats-, Jahres- oder Mehrjahresansicht). Mögliche Werte: 'month', 'year', 'multi-year'. Default: 'month'.                                                                                                                                                                                                                                                                             |
| luxTouchUi             | boolean                                                   | Aktiviert bzw. Deaktiviert die vergrößerte Touch-Ansicht für den Datepicker (leichtere Eingabe für Mobilgeräte). Default: false.                                                                                                                                                                                                                                                                                                  |
| luxOpened              | boolean                                                   | Bestimmt, ob das Auswahlfenster ausgeklappt oder eingeklappt ist. Default: false.                                                                                                                                                                                                                                                                                                                                                 |
| luxStartDate           | string (ISO 8601 oder dd.MM.yyyy, z.B. 01.01.2000)        | Bestimmt das Startdatum für den Datepicker. Akzeptiert ISO-Strings und Datums-Strings (z.B. '01.01.2018').                                                                                                                                                                                                                                                                                                                        |
| luxShowToggle          | boolean                                                   | Bestimmt, ob der Toggle-Button sichtbar ist oder nicht. Default: true.                                                                                                                                                                                                                                                                                                                                                            |
| luxTagId               | string                                                    | [LUX-Tag-Id](luxTagId-v22#direkte-konfiguration) für die automatischen Tests.                                                                                                                                                                                                                                                                                                                                                     |
| luxCustomFilter        | LuxDateFilterFn                                           | Der optionale eigene Filter für den Datepicker.                                                                                                                                                                                                                                                                                                                                                                                   |
| luxMaxDate             | string (ISO 8601 oder dd.MM.yyyy, z.B. 01.01.2000)        | Das maximal zulässige Datum für den Datepicker. Akzeptiert ISO-Strings und Datums-Strings (z.B. '01.01.2018').                                                                                                                                                                                                                                                                                                                    |
| luxMinDate             | string (ISO 8601 oder dd.MM.yyyy, z.B. 01.01.2000)        | Das minimal zulässige Datum für den Datepicker. Akzeptiert ISO-Strings und Datums-Strings (z.B. '01.01.2018').                                                                                                                                                                                                                                                                                                                    |
| luxPlaceholder         | string                                                    | Text der als Platzhalter, solange kein anderer Wert eingetragen ist, dargestellt wird.                                                                                                                                                                                                                                                                                                                                            |
| luxAutocomplete        | string                                                    | Steuert, ob der Browser den Inhalt cachen darf. Default: 'off'.                                                                                                                                                                                                                                                                                                                                                                   |
| luxRequired            | boolean                                                   | Bestimmt, ob die Component ein Pflichtfeld ist oder nicht. Technisch als `model()` umgesetzt; eine Two-Way-Bindung wird nicht benötigt.                                                                                                                                                                                                                                                                                           |
| luxControlBinding      | string                                                    | **Veraltet**, stattdessen `[formField]` verwenden. Das Controlbinding (z.B. firstname) verbindet das Formularelement mit einem Wert aus dem Modell. (!) Diese Eigenschaft kann nur verwendet werden, wenn das Element innerhalb eines Formulars verwendet wird.                                                                                                                                                                   |
| luxErrorMessage        | string                                                    | Fehlertext, wenn das Formularelement nicht valide ist. Der Fehlertext ersetzt den Hinweistext, wenn es einen gibt. Ersetzt den luxErrorCallback, wenn gesetzt.                                                                                                                                                                                                                                                                    |
| luxDisabled            | boolean                                                   | Bestimmt, ob die Component deaktiviert ist oder nicht. Two-Way-Binding über `[(luxDisabled)]` möglich.                                                                                                                                                                                                                                                                                                                            |
| luxReadonly            | boolean                                                   | **Veraltet**, stattdessen `[readonly]` bzw. die `readonly()`-Regel im Signal-Forms-Schema verwenden. Bestimmt, ob sich das Feld im reinen Lese-Zustand befindet.                                                                                                                                                                                                                                                                  |
| luxErrorCallback       | LuxErrorCallbackFnType                                    | Callback-Funktion die aufgerufen wird nachdem die Validierung der Component stattgefunden hat. Hier kann dann entsprechend aus dem übergebenen Errors-Objekt ein Fehler ausgelesen und die passende Fehlermeldung zurückgegeben werden. Liefert der Callback `undefined` zurück, wird die Defaultfehlermeldung ausgegeben.                                                                                                        |
| luxControlValidators   | ValidatorFnType                                           | Validator-Funktion oder ein Array von Validator-Funktionen, die für diese Component hereingereicht werden können. Diese werden nur für nicht-ReactiveForms-Components angewendet und sollen so eine Validierung für "normale" Komponenten ermöglichen.                                                                                                                                                                            |
| luxLabel               | string                                                    | Property welche ein Label oberhalb der FormComponent (Ausnahme: LuxToggle und LuxCheckbox, diese stellen das Label rechts von der Schaltfläche dar) darstellt. Technisch als `model()` umgesetzt; eine Two-Way-Bindung wird nicht benötigt.                                                                                                                                                                                       |
| luxHint                | string                                                    | Property, welche einen Tipp/Text unterhalb der FormComponent darstellt. Alternativ kann man über das Content-Child `lux-form-hint` komplexere Hinweise (z.B. mit einem Link) darstellen.                                                                                                                                                                                                                                          |
| luxHintShowOnlyOnFocus | boolean                                                   | Gibt an, ob der Hinweis (siehe luxHint) nur angezeigt wird, wenn das Element den Fokus hat.                                                                                                                                                                                                                                                                                                                                       |
| luxLabelLongFormat     | boolean                                                   | Bestimmt, ob das Label mehrzeilig sein kann. Nutzung nur in Spalten empfohlen, da die Höhe des Formcontrols variieren kann. Dadurch kann die Ausrichtung an der Baseline nicht mehr gewährleistet werden.                                                                                                                                                                                                                         |
| luxNoLabels            | boolean                                                   | Gibt an, ob Labels angezeigt werden sollen.                                                                                                                                                                                                                                                                                                                                                                                       |
| luxNoTopLabel          | boolean                                                   | Gibt an, ob das obere Label angezeigt werden soll.                                                                                                                                                                                                                                                                                                                                                                                |
| luxNoBottomLabel       | boolean                                                   | Gibt an, ob das untere Label (Hinweis oder Fehlermeldung) angezeigt werden soll.                                                                                                                                                                                                                                                                                                                                                  |
| luxDense               | boolean                                                   | Property um die Höhe der Komponente zu verringern. Diese Eigenschaft ist für den Einsatz in großen Formularen gedacht und soll nicht standardmäßig in einer Anwendung genutzt werden.                                                                                                                                                                                                                                             |
| luxId                  | string                                                    | Id des Formularelements. Ohne Angabe wird eine eindeutige Id generiert.                                                                                                                                                                                                                                                                                                                                                           |
| luxAriaLabel           | string                                                    | Setzt `aria-label` am Eingabeelement. Nur für Felder ohne sichtbares Label gedacht; ein abweichendes aria-label überschreibt ein sichtbares Label (WCAG 2.5.3).                                                                                                                                                                                                                                                                   |
| luxAriaLabelledby      | string                                                    | Verweist per `aria-labelledby` auf ein externes Label-Element. Hat Vorrang vor luxAriaLabel und luxLabel.                                                                                                                                                                                                                                                                                                                         |
| luxFormGroup           | FormGroup                                                 | **Veraltet**, stattdessen `[formField]` verwenden. FormGroup, in der das luxControlBinding gesucht wird, wenn die Komponente nicht innerhalb von `[formGroup]` steht.                                                                                                                                                                                                                                                             |
| luxFormControl         | FormControl                                               | **Veraltet**, stattdessen `[formField]` verwenden. Direkt übergebenes FormControl.                                                                                                                                                                                                                                                                                                                                                |

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

// Der Wert ist ein ISO-8601-String, z.B. '2021-09-21T00:00:00.000Z'.
readonly model = signal<{ birthday: string | null }>({ birthday: null });
readonly personForm = form(this.model, (path) => {
  required(path.birthday, { message: 'Bitte geben Sie Ihr Geburtsdatum ein.' });
});
```

Html

```html
<lux-datepicker luxLabel="Geburtsdatum" [formField]="personForm.birthday" />
```

### 2. Ohne Formular

![Beispielbild 01](https://raw.githubusercontent.com/IHK-GfI/lux-components-workspace/main/projects/lux-components-wiki/Versions/v22/lux‐datepicker-v22-img-01.png)

Ts

```typescript
// Heutiger Tag als UTC-Mitternacht (LuxUtil aus '@ihk-gfi/lux-components')
readonly value = signal<string | null>(LuxUtil.newDateWithoutTime().toISOString());
```

Html

```html
<lux-datepicker
  luxLabel="Datepicker"
  [luxTouchUi]="true"
  [(value)]="value"
/>
<lux-datepicker
  luxLabel="Datepicker"
  [luxTouchUi]="false"
  [(value)]="value"
/>
<lux-datepicker
  luxLabel="Datepicker"
  [luxDisabled]="true"
  luxPlaceholder="Disabled"
  [(value)]="value"
/>
```

### 3. Mit Formular

> **Veraltet:** Die Reactive-Forms-Variante (`luxControlBinding`) in diesem Beispiel funktioniert in v22 weiterhin, entfällt aber mit der nächsten Major-Version. Für neue Formulare bitte Signal Forms verwenden (siehe [1. Signal Forms](#1-signal-forms)).

![Beispielbild 02](https://raw.githubusercontent.com/IHK-GfI/lux-components-workspace/main/projects/lux-components-wiki/Versions/v22/lux‐datepicker-v22-img-02.png)

Ts

```typescript
readonly form = new FormGroup({
  // Heutiger Tag als UTC-Mitternacht (LuxUtil aus '@ihk-gfi/lux-components')
  datepicker: new FormControl<string | null>(LuxUtil.newDateWithoutTime().toISOString())
});
```

Html

```html
<div [formGroup]="form">
  <lux-datepicker luxLabel="Datepicker" luxControlBinding="datepicker" />
</div>
```

### 4. Min- und Max-Date

![Beispielbild 03](https://raw.githubusercontent.com/IHK-GfI/lux-components-workspace/main/projects/lux-components-wiki/Versions/v22/lux‐datepicker-v22-img-03.png)

Ts

```typescript
readonly value = signal<string | null>(null);
```

Html

```html
<lux-datepicker
  luxLabel="Datepicker"
  luxMaxDate="02/02/2002"
  luxMinDate="02.02.2000"
  [(value)]="value"
/>
```

### 5. Eigener Filter

![Beispielbild 04](https://raw.githubusercontent.com/IHK-GfI/lux-components-workspace/main/projects/lux-components-wiki/Versions/v22/lux‐datepicker-v22-img-04.png)

Der Filter erhält jeden Tag als UTC-Mitternacht (z.B. `2029-05-26T00:00:00.000Z`). Damit der Filter in jeder Zeitzone den richtigen Tag prüft, müssen die UTC-Methoden (z.B. `getUTCDay()`, `getUTCDate()`) verwendet werden.

Ts

```typescript
readonly myFilter = (d: Date | null): boolean => {
  let result = false;

  if (d) {
    const day = d.getUTCDay();
    // Samstag und Sonntag in der Date-Auswahl deaktivieren
    result = day !== 0 && day !== 6;
  }

  return result;
};
```

Html

```html
<lux-datepicker
  luxLabel="Datepicker"
  [luxCustomFilter]="myFilter"
/>
```

## Zusatzinformationen

Der Datepicker speichert einen Tag immer als UTC-Mitternacht (z.B. `2029-05-26T00:00:00.000Z`) und zeigt in jeder Zeitzone genau diesen Tag an. Welcher Tag mit einem übergebenen Wert gemeint ist, wird so bestimmt:

- Datum ohne Zeitzone (z.B. `2029-05-26`, `26.05.2029` oder `2029-05-26T23:30:00`) oder ISO-String mit Offset (z.B. `2029-05-26T23:30:00+02:00`): der geschriebene Tag.
- UTC-Zeitpunkt (`...Z`) oder `Date`-Objekt genau auf UTC-Mitternacht (z.B. `2029-05-26T00:00:00.000Z`, so speichert der Datepicker selbst): der UTC-Tag.
- UTC-Zeitpunkt oder `Date`-Objekt mit anderer Uhrzeit (z.B. `new Date(2029, 4, 26)`): der lokale Tag des Nutzers.
- In Kombination mit einem [LUX-Timepicker](lux‐timepicker-v22) (`luxReferenceControl`) bilden Datum und Uhrzeit zusammen einen UTC-Zeitpunkt; der Tag wird dann immer über UTC bestimmt.

Empfohlen sind ein reines Datum (`2029-05-26` bzw. `26.05.2029`) oder UTC-Mitternacht (z.B. `new Date(Date.UTC(2029, 4, 26))` oder `LuxUtil.newDateWithoutTime()` für den heutigen Tag).
