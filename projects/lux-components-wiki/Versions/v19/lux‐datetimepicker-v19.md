# LUX-Datetimepicker

![Beispielbild LUX-Datetimepicker](https://raw.githubusercontent.com/wiki/IHK-GfI/lux-components-workspace/Versions/v19/lux‐datetimepicker-v19-img.png)

- [LUX-Datetimepicker](#lux-datetimepicker)
  - [Overview / API](#overview--api)
    - [Allgemein](#allgemein)
    - [@Input](#input)
  - [Beispiele](#beispiele)
    - [1. Ohne Formular](#1-ohne-formular)
    - [2. Mit Formular](#2-mit-formular)
    - [3. Min- und Max-Datum](#3-min--und-max-datum)
    - [4. Eigener Filter](#4-eigener-filter)

## Overview / API

### Allgemein

| Name     | Beschreibung          |
| -------- | --------------------- |
| selector | lux-datetimepicker-ac |

### @Input

| Name                   | Typ                                               | Beschreibung                                                                                                                                                                                                                                                                                                               |
| ---------------------- | ------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| luxValue               | string (ISO 8601 z.B. '2021-09-21T12:15:00.000Z') | Beinhaltet den aktuellen Wert des Datepickers als String (ISO 8601 z.B. '2021-09-21T00:00:00.000Z'). Initial kann auch ein Date-Objekt (UTC z.B. new Date(Date.UTC(2021, 8, 21, 12, 15))) hereingereicht werden, dieses wird dann von der Component konvertiert.                                                           |
| luxStartView           | 'month', 'year', 'multi-year'                     | Bestimmt die Startansicht des Datepickers.                                                                                                                                                                                                                                                                                 |
| luxStartDate           | string (z.B. 01.01.2000, 00:00)                   | Legt die Standarddatum im Popup fest, wenn kein Wert gesetzt ist.                                                                                                                                                                                                                                                          |
| luxStartTime           | number[] (z.B. \[12, 15\])                        | Legt die Standardzeit im Popup fest, wenn kein Wert gesetzt ist.                                                                                                                                                                                                                                                           |
| luxMinDate             | string (z.B. 01.01.2000, 00:00)                   | Das minimal zulässige Datum für den Datepicker.                                                                                                                                                                                                                                                                            |
| luxMaxDate             | string (z.B. 31.12.2000, 23:59)                   | Das maximale zulässige Datum für den Datepicker.                                                                                                                                                                                                                                                                           |
| luxOpened              | boolean                                           | Bestimmt, ob das Auswahlfenster ausgeklappt oder eingeklappt ist.                                                                                                                                                                                                                                                          |
| luxShowToggle          | boolean                                           | Gibt an, ob der Toggle-Button sichtbar ist oder nicht.                                                                                                                                                                                                                                                                     |
| luxCustomFilter        | LuxDateFilterFn                                   | Der optionale eigene Filter für den Datepicker.                                                                                                                                                                                                                                                                            |
| luxTagId               | string                                            | [LUX-Tag-Id](luxTagId-v19#direkte-konfiguration) für die automatischen Tests.                                                                                                                                                                                                                                              |
| luxPlaceholder         | string                                            | Text der als Platzhalter, solange kein anderer Wert eingetragen ist, dargestellt wird.                                                                                                                                                                                                                                     |
| luxAutocomplete        | string                                            | Steuert, ob der Browser den Inhalt cachen darf.                                                                                                                                                                                                                                                                            |
| luxRequired            | boolean                                           | Bestimmt ob die Component ein Pflichtfeld ist oder nicht.                                                                                                                                                                                                                                                                  |
| luxControlBinding      | string                                            | Das Controlbinding (z.B. firstname) verbindet das Formularelement mit einem Wert aus dem Modell. (!) Diese Eigenschaft kann nur verwendet werden, wenn das Element innerhalb eines Formulars verwendet wird.                                                                                                               |
| luxErrorMessage        | string                                            | Fehlertext, wenn das Formularelement nicht valide ist. Der Fehlertext ersetzt den Hinweistext, wenn es einen gibt. Ersetzt den luxErrorCallback, wenn gesetzt.                                                                                                                                                             |
| luxDisabled            | boolean                                           | Bestimmt ob die Component deaktiviert ist oder nicht. Durch den Event-Emitter "luxDisabledChange" ist ein Two-Way-Binding möglich.                                                                                                                                                                                         |
| luxReadonly            | boolean                                           | Bestimmt ob sich das Feld im reinen Lese-Zustand befindet (ähnlich wie disabled, aber ohne die Auswirkungen auf Forms und andere visuelle Darstellung).                                                                                                                                                                    |
| luxErrorCallback       | LuxErrorCallbackFnType                            | Callback-Funktion die aufgerufen wird nachdem die Validierung der Component stattgefunden hat. Hier kann dann entsprechend aus dem übergebenen Errors-Objekt ein Fehler ausgelesen und die passende Fehlermeldung zurückgegeben werden. Liefert der Callback `undefined` zurück, wird die Defaultfehlermeldung ausgegeben. |
| luxControlValidators   | ValidatorFnType                                   | Validator-Funktion oder ein Array von Validator-Funktionen, die für diese Component hereingereicht werden können. Diese werden nur für nicht-ReactiveForms-Components angewendet und sollen so eine Validierung für "normale" Komponenten ermöglichen.                                                                     |
| luxLabel               | string                                            | Property welche ein Label oberhalb der FormComponent (Ausnahme: LuxToggle und LuxCheckbox, diese stellen das Label rechts von der Schaltfläche dar) darstellt.                                                                                                                                                             |
| luxHint                | string                                            | Property, welche einen Tipp/Text unterhalb der FormComponent darstellt. Alternativ kann man über das Content-Child `lux-form-hint` komplexere Hinweise (z.B. mit einem Link) darstellen.                                                                                                                                   |
| luxHintShowOnlyOnFocus | boolean                                           | Gibt an, ob der Hinweis (siehe luxHint) nur angezeigt wird, wenn das Element den Fokus hat.                                                                                                                                                                                                                                |
| luxLabelLongFormat     | boolean                                           | Bestimmt, ob das Label mehrzeilig sein kann. Nutzung nur in Spalten empfohlen, da die Höhe des Formcontrols variieren kann. Dadurch kann die Ausrichtung an der Baseline nicht mehr gewährleistet werden.                                                                                                                  |
| luxNoLabels            | boolean                                           | Gibt an, ob Labels angezeigt werden sollen.                                                                                                                                                                                                                                                                                |
| luxNoTopLabel          | boolean                                           | Gib an, ob das obere Label angezeigt werden soll.                                                                                                                                                                                                                                                                          |
| luxNoBottomLabel       | boolean                                           | Gibt an, ob das untere Label (Hinweis oder Fehlermeldung) angezeigt werden soll.                                                                                                                                                                                                                                           |

| Name              | Typ                        | Beschreibung                                                                                                                                                                                                                                                                                       |
| ----------------- | -------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| luxValueChange    | EventEmitter \<string>     | Output-Event das bei Änderungen am Value-Feld ausgestoßen wird. Ermöglicht das Two-Way-Binding an luxValue.                                                                                                                                                                                        |
| luxBlur           | EventEmitter \<FocusEvent> | Event welches beim Fokusverlust des Elements ausgelöst wird und ein Objekt vom Typ FocusEvent weitergibt. Unterschied zu luxFocusOut (LUX-FORM-COMPONENT-BASE) ist der, dass dieses Event nur ausgegeben wird wenn das Element selbst den Fokus verliert und Kindelemente nicht betrachtet werden. |
| luxFocus          | EventEmitter \<FocusEvent> | Event welches beim Fokussieren des Elements ausgelöst wird und ein Objekt vom Typ FocusEvent weitergibt. Unterschied zu luxFocusIn (LUX-FORM-COMPONENT-BASE) ist der, dass dieses Event nur ausgegeben wird wenn das Element selbst den Fokus erhält und Kindelemente nicht betrachtet werden.     |
| luxFocusIn        | EventEmitter \<FocusEvent> | Event welches beim Fokussieren des Elements ausgelöst wird und ein Objekt vom Typ FocusEvent weitergibt.                                                                                                                                                                                           |
| luxFocusOut       | EventEmitter \<FocusEvent> | Event welches beim Fokusverlust des Elements ausgelöst wird und ein Objekt vom Typ FocusEvent weitergibt.                                                                                                                                                                                          |
| luxDisabledChange | EventEmitter \<boolean>    | Event welches beim Disablen des Elements ausgelöst wird.                                                                                                                                                                                                                                           |
| luxDense          | boolean                    | Property um die Höhe der Komponente zu verringern. Diese Eigenschaft ist für den Einsatz in großen Formularen gedacht und soll nicht standardmäßig in einer Anwendung genutzt werden.                                                                                                              |

## Beispiele

### 1. Ohne Formular

![Beispielbild 01](https://raw.githubusercontent.com/wiki/IHK-GfI/lux-components-workspace/Versions/v19/lux‐datetimepicker-v19-img-01.png)

Ts

```typescript
valueAsDate = new Date(Date.UTC(2021, 8, 21, 14, 15));
valueAsIsoString = "2021-09-21T14:15:00.000Z";
```

Html

```html
<div class="lux-flex lux-flex-col">
  <lux-datetimepicker-ac
    luxLabel="Datetimepicker"
    [(luxValue)]="valueAsDate"
  ></lux-datetimepicker-ac>
  <lux-datetimepicker-ac
    luxLabel="Datetimepicker"
    [(luxValue)]="valueAsIsoString"
    [luxDisabled]="true"
  ></lux-datetimepicker-ac>
</div>
```

### 2. Mit Formular

![Beispielbild 02](https://raw.githubusercontent.com/wiki/IHK-GfI/lux-components-workspace/Versions/v19/lux‐datetimepicker-v19-img-02.png)

Ts

```typescript
  form: FormGroup;

  constructor() {
    this.form = new FormGroup({
      valueAsDate: new FormControl<string | null>(new Date(Date.UTC(2021, 8, 21, 14, 15)) as any),  // Ein Date-objekt kann übergeben werden, aber es wird vom Control in ein String umgewandelt.
      valueAsIsoString: new FormControl<string | null>('2021-09-21T14:15:00.000Z')
    });

    this.form.get('valueAsIsoString')!.disable();
  }
```

Html

```html
<div class="lux-flex lux-flex-col" [formGroup]="form">
  <lux-datetimepicker-ac
    luxLabel="Datetimepicker"
    luxControlBinding="valueAsDate"
  ></lux-datetimepicker-ac>
  <lux-datetimepicker-ac
    luxLabel="Datetimepicker"
    luxControlBinding="valueAsIsoString"
  ></lux-datetimepicker-ac>
</div>
```

### 3. Min- und Max-Datum

![Beispielbild 03](https://raw.githubusercontent.com/wiki/IHK-GfI/lux-components-workspace/Versions/v19/lux‐datetimepicker-v19-img-03.png)

Ts

```typescript
value: string = new Date().toLocaleDateString() + ", 12:45";
```

Html

```html
<lux-datetimepicker-ac
  luxLabel="Datetimepicker"
  luxMinDate="02.02.2000, 00:00"
  luxMaxDate="02.02.2050, 23:59"
  [(luxValue)]="value"
></lux-datetimepicker-ac>
```

### 4. Eigener Filter

![Beispielbild 04](https://raw.githubusercontent.com/wiki/IHK-GfI/lux-components-workspace/Versions/v19/lux‐datetimepicker-v19-img-04.png)

Ts

```typescript
myFilter = (d: Date | null): boolean => {
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
<lux-datetimepicker-ac
  luxLabel="Datetimepicker"
  [luxCustomFilter]="myFilter"
></lux-datetimepicker-ac>
```
