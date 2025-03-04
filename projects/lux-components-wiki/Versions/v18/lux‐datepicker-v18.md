# LUX-Datepicker

![Beispielbild LUX-Datepicker](https://raw.githubusercontent.com/wiki/IHK-GfI/lux-components/Versions/v18/lux‐datepicker-v18-img.png)

- [LUX-Datepicker](#lux-datepicker)
  - [Overview / API](#overview--api)
    - [Allgemein](#allgemein)
    - [@Input](#input)
    - [@Output](#output)
  - [Beispiele](#beispiele)
    - [1. Ohne Formular](#1-ohne-formular)
    - [2. Mit Formular](#2-mit-formular)
    - [3. Min- und Max-Date](#3-min--und-max-date)
    - [4. Eigener Filter](#4-eigener-filter)

## Overview / API

### Allgemein

| Name     | Beschreibung      |
| -------- | ----------------- |
| import   | LuxFormModule     |
| selector | lux-datepicker-ac |

### @Input

| Name                   | Typ                                               | Beschreibung                                                                                                                                                                                                                                                                                                               |
| ---------------------- | ------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| luxValue               | string (ISO 8601 z.B. '2021-09-21T12:15:00.000Z') | Beinhaltet den aktuellen Wert des Datepickers als Date-Objekt. Beinhaltet den aktuellen Wert des Datepickers als String-Objekt. Initial kann auch ein Date-Objekt hereingereicht werden, dieses wird dann von der Component konvertiert.                                                                                   |
| luxStartView           | 'month' \| 'year' \| 'multi-year'                 | Bestimmt die Startansicht des Datepickers (Jahres- oder Monatsansicht). Mögliche Werte: 'month', 'year'                                                                                                                                                                                                                    |
| luxTouchUi             | boolean                                           | Aktiviert bzw. Deaktiviert die vergrößerte Touch-Ansicht für den Datepicker (leichtere Eingabe für Mobilgeräte).                                                                                                                                                                                                           |
| luxOpened              | boolean                                           | Bestimmt ob das Auswahlfenster ausgeklappt oder eingeklappt ist.                                                                                                                                                                                                                                                           |
| luxStartDate           | string (z.B. 01.01.2000)                          | Bestimmt das Startdatum für den Datepicker. Nimmt Date-Objects und Date-Strings (z.B. '01.01.2018') entgegen. Nimmt nur noch Strings als mögliche Werte entgegen.                                                                                                                                                          |
| luxShowToggle          | boolean                                           | Bestimmt ob der Toggle-Button sichtbar ist oder nicht.                                                                                                                                                                                                                                                                     |
| luxLocale              | string                                            | Entspricht der Sprachformatierung die für diesen Datepicker genommen werden soll.                                                                                                                                                                                                                                          |
| luxTagId               | string                                            | [LUX-Tag-Id](luxTagId-v18#direkte-konfiguration) für die automatischen Tests.                                                                                                                                                                                                                                              |
| luxCustomFilter        | LuxDateFilterFn                                   | Der optionale eigene Filter für den Datepicker.                                                                                                                                                                                                                                                                            |
| luxMaxDate             | string (z.B. 01.01.2000)                          | Das maximale zulässige Datum für den Datepicker. Nimmt Date-Objects und Date-Strings (z.B. '01.01.2018') entgegen. Nimmt nur noch Strings als mögliche Werte entgegen.                                                                                                                                                     |
| luxMinDate             | string (z.B. 01.01.2000)                          | Das minimal zulässige Datum für den Datepicker. Nimmt Date-Objects und Date-Strings (z.B. '01.01.2018') entgegen. Nimmt nur noch Strings als mögliche Werte entgegen.                                                                                                                                                      |
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
| luxDense               | boolean                                           | Property um die Höhe der Komponente zu verringern. Diese Eigenschaft ist für den Einsatz in großen Formularen gedacht und soll nicht standardmäßig in einer Anwendung genutzt werden.                                                                                                                                      |

### @Output

| Name              | Typ                        | Beschreibung                                                                                                                                                                                                                                                                                       |
| ----------------- | -------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| luxValueChange    | EventEmitter \<string>     | Output-Event das bei Änderungen am Value-Feld ausgestoßen wird. Ermöglicht das Two-Way-Binding an luxValue.                                                                                                                                                                                        |
| luxBlur           | EventEmitter \<FocusEvent> | Event welches beim Fokusverlust des Elements ausgelöst wird und ein Objekt vom Typ FocusEvent weitergibt. Unterschied zu luxFocusOut (LUX-FORM-COMPONENT-BASE) ist der, dass dieses Event nur ausgegeben wird wenn das Element selbst den Fokus verliert und Kindelemente nicht betrachtet werden. |
| luxFocus          | EventEmitter \<FocusEvent> | Event welches beim Fokussieren des Elements ausgelöst wird und ein Objekt vom Typ FocusEvent weitergibt. Unterschied zu luxFocusIn (LUX-FORM-COMPONENT-BASE) ist der, dass dieses Event nur ausgegeben wird wenn das Element selbst den Fokus erhält und Kindelemente nicht betrachtet werden.     |
| luxFocusIn        | EventEmitter \<FocusEvent> | Event welches beim Fokussieren des Elements ausgelöst wird und ein Objekt vom Typ FocusEvent weitergibt.                                                                                                                                                                                           |
| luxFocusOut       | EventEmitter \<FocusEvent> | Event welches beim Fokusverlust des Elements ausgelöst wird und ein Objekt vom Typ FocusEvent weitergibt.                                                                                                                                                                                          |
| luxDisabledChange | EventEmitter \<boolean>    | Event welches beim Disablen des Elements ausgelöst wird.                                                                                                                                                                                                                                           |

## Beispiele

### 1. Ohne Formular

![Beispielbild 01](https://raw.githubusercontent.com/wiki/IHK-GfI/lux-components/Versions/v18/lux‐datepicker-v18-img-01.png)

Ts

```typescript
value: string = new Date().toLocaleDateString();
```

Html

```html
<lux-datepicker-ac
  luxLabel="Datepicker"
  [luxTouchUi]="true"
  luxPlaceholder="DE"
  [(luxValue)]="value"
></lux-datepicker-ac>
<lux-datepicker-ac
  luxLabel="Datepicker"
  [luxTouchUi]="true"
  luxLocale="jp-JP"
  luxPlaceholder="JP"
  [(luxValue)]="value"
></lux-datepicker-ac>
<lux-datepicker-ac
  luxLabel="Datepicker"
  [luxTouchUi]="false"
  luxLocale="en-US"
  luxPlaceholder="US"
  [(luxValue)]="value"
></lux-datepicker-ac>
<lux-datepicker-ac
  luxLabel="Datepicker"
  [luxDisabled]="true"
  luxLocale="en-US"
  luxPlaceholder="Disabled"
  [(luxValue)]="value"
></lux-datepicker-ac>
```

### 2. Mit Formular

![Beispielbild 02](https://raw.githubusercontent.com/wiki/IHK-GfI/lux-components/Versions/v18/lux‐datepicker-v18-img-02.png)

Ts

```typescript
form: FormGroup;
constructor() {
  this.form = new FormGroup<any>({
    datepicker: new FormControl<string>(new Date().toLocaleDateString())
  });
}
```

Html

```html
<div [formGroup]="form">
  <lux-datepicker-ac luxLabel="Datepicker" luxControlBinding="datepicker">
  </lux-datepicker-ac>
</div>
```

### 3. Min- und Max-Date

![Beispielbild 03](https://raw.githubusercontent.com/wiki/IHK-GfI/lux-components/Versions/v18/lux‐datepicker-v18-img-03.png)

Ts

```typescript
value: string = "";
```

Html

```html
<lux-datepicker-ac
  luxLabel="Datepicker"
  luxMaxDate="02/02/2002"
  luxMinDate="02.02.2000"
  [(luxValue)]="value"
></lux-datepicker-ac>
```

### 4. Eigener Filter

![Beispielbild 04](https://raw.githubusercontent.com/wiki/IHK-GfI/lux-components/Versions/v18/lux‐datepicker-v18-img-04.png)

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
<lux-datepicker-ac
  luxLabel="Datepicker"
  [luxCustomFilter]="myFilter"
></lux-datepicker-ac>
```
