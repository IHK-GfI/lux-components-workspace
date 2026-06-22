# LUX-Timepicker

- [LUX-Timepicker](#lux-timepicker)
  - [Overview / API](#overview--api)
    - [Allgemein](#allgemein)
    - [@Input](#input)
    - [@Output](#output)
  - [Beispiele](#beispiele)
    - [1. Ohne Formular](#1-ohne-formular)
    - [2. Mit Formular](#2-mit-formular)
    - [3. Min- und Max-Time](#3-min--und-max-time)
    - [4. Kombination: Datepicker + Timepicker im Formular](#4-kombination-datepicker--timepicker-im-formular)

## Overview / API

### Allgemein

| Name     | Beschreibung   |
| -------- | -------------- |
| selector | lux-timepicker |

### @Input

| Name                   | Typ                                                | Beschreibung                                                                                                                                              |
| ---------------------- | -------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| luxValue               | string (ISO 8601 z.B. '1970-01-01T14:15:00.000Z')  | Beinhaltet den aktuellen Wert des Timepickers. Initial kann auch ein Date-Objekt hereingereicht werden, dieses wird dann von der Component konvertiert.   |
| luxOpened              | boolean                                            | Bestimmt, ob das Auswahlfenster ausgeklappt oder eingeklappt ist.                                                                                         |
| luxShowToggle          | boolean                                            | Bestimmt, ob der Toggle-Button sichtbar ist oder nicht.                                                                                                   |
| luxInterval            | string \| number                                   | Intervall für die Zeitauswahl, z.B. `15m`, `30m` oder `1h`.                                                                                               |
| luxMinTime             | string (z.B. 08:00)                                | Minimale zulässige Zeit.                                                                                                                                  |
| luxMaxTime             | string (z.B. 18:00)                                | Maximale zulässige Zeit.                                                                                                                                  |
| luxPlaceholder         | string                                             | Platzhaltertext.                                                                                                                                          |
| luxRequired            | boolean                                            | Bestimmt, ob die Component ein Pflichtfeld ist oder nicht.                                                                                                |
| luxControlBinding      | string                                             | Bindet das Formularelement an ein Reactive-Form-Control. Bei der Kombination mit `luxReferenceControl` wird `updateOn: 'blur'` benötigt.                  |
| luxErrorMessage        | string                                             | Feste Fehlermeldung für ungültige Eingaben.                                                                                                               |
| luxDisabled            | boolean                                            | Bestimmt, ob die Component deaktiviert ist oder nicht.                                                                                                    |
| luxReadonly            | boolean                                            | Bestimmt, ob die Component nur lesbar ist.                                                                                                                |
| luxLabel               | string                                             | Label oberhalb der Component.                                                                                                                             |
| luxHint                | string                                             | Hinweistext unterhalb der Component.                                                                                                                      |
| luxHintShowOnlyOnFocus | boolean                                            | Zeigt den Hinweis nur bei Fokus an.                                                                                                                       |
| luxNoLabels            | boolean                                            | Gibt an, ob Labels angezeigt werden sollen.                                                                                                               |
| luxNoTopLabel          | boolean                                            | Gibt an, ob das obere Label angezeigt werden soll.                                                                                                        |
| luxNoBottomLabel       | boolean                                            | Gibt an, ob das untere Label angezeigt werden soll.                                                                                                       |
| luxReferenceControl    | LuxDatepickerAcComponent \| LuxTimepickerComponent | Referenz auf eine verknüpfte Datepicker- oder Timepicker-Komponente, damit Datum und Uhrzeit kombiniert in einem gemeinsamen ISO-Wert gespeichert werden. |

### @Output

| Name              | Typ                        | Beschreibung                                                |
| ----------------- | -------------------------- | ----------------------------------------------------------- |
| luxValueChange    | EventEmitter \<string>     | Wird bei Änderungen am Value ausgelöst.                     |
| luxBlur           | EventEmitter \<FocusEvent> | Wird ausgelöst, wenn das Element selbst den Fokus verliert. |
| luxFocus          | EventEmitter \<FocusEvent> | Wird ausgelöst, wenn das Element den Fokus erhält.          |
| luxFocusIn        | EventEmitter \<FocusEvent> | Wird ausgelöst, wenn das Element fokussiert wird.           |
| luxFocusOut       | EventEmitter \<FocusEvent> | Wird ausgelöst, wenn das Element den Fokus verliert.        |
| luxDisabledChange | EventEmitter \<boolean>    | Wird beim Ändern des Disabled-Status ausgelöst.             |

## Beispiele

### 1. Ohne Formular

![Beispielbild 01](https://raw.githubusercontent.com/IHK-GfI/lux-components-workspace/main/projects/lux-components-wiki/Versions/v21/lux‐timepicker-v21-img-01.png)

```typescript
value = '1970-01-01T14:15:00.000Z';
```

```html
<lux-timepicker
  luxLabel="Timepicker"
  luxInterval="15m"
  [(luxValue)]="value"
></lux-timepicker>
```

### 2. Mit Formular

![Beispielbild 02](https://raw.githubusercontent.com/IHK-GfI/lux-components-workspace/main/projects/lux-components-wiki/Versions/v21/lux‐timepicker-v21-img-02.png)

```typescript
form = new FormGroup({
  timepicker: new FormControl<string | null>(new Date(Date.UTC(1970, 0, 1, 14, 15)) as any)
});
```

```html
<div [formGroup]="form">
  <lux-timepicker luxLabel="Timepicker" luxControlBinding="timepicker"></lux-timepicker>
</div>
```

### 3. Min- und Max-Time

![Beispielbild 03](https://raw.githubusercontent.com/IHK-GfI/lux-components-workspace/main/projects/lux-components-wiki/Versions/v21/lux‐timepicker-v21-img-03.png)

```html
<lux-timepicker
  luxLabel="Timepicker"
  luxMinTime="08:00"
  luxMaxTime="18:00"
  [(luxValue)]="value"
></lux-timepicker>
```

### 4. Kombination: Datepicker + Timepicker im Formular

![Beispielbild 04](https://raw.githubusercontent.com/IHK-GfI/lux-components-workspace/main/projects/lux-components-wiki/Versions/v21/lux‐timepicker-v21-img-04.png)

Datum und Uhrzeit können über `luxReferenceControl` miteinander verknüpft werden, um einen kombinierten ISO-Wert zu verwenden:

```typescript
form = new FormGroup({
  dateTime: new FormControl<string | null>('2026-06-18T14:15:00.000Z', { updateOn: 'blur' })
});
```

```html
<div [formGroup]="form">
  <div class="lux-flex lux-gap-4">
    <lux-datepicker-ac
      class="lux-flex-auto"
      luxLabel="Datum"
      luxControlBinding="dateTime"
      [luxReferenceControl]="timepicker"
      #datepicker
    ></lux-datepicker-ac>
    <lux-timepicker
      class="lux-flex-auto"
      luxLabel="Uhrzeit"
      luxControlBinding="dateTime"
      [luxReferenceControl]="datepicker"
      luxInterval="15m"
      #timepicker
    ></lux-timepicker>
  </div>
</div>
```

**Hinweis:** Das Timepicker-FormControl sollte mit `updateOn: 'blur'` konfiguriert werden, wenn es mit einem Datepicker-Control verknüpft ist, um unerwartete Änderungsschleifen zu vermeiden.
