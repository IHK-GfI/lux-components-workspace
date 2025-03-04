# LUX-Textarea

![Beispielbild LUX-Textarea](https://raw.githubusercontent.com/wiki/IHK-GfI/lux-components/Versions/v14/lux‐textarea-v14-img.png)

- [LUX-Textarea](#lux-textarea)
  - [Overview / API](#overview--api)
    - [Allgemein](#allgemein)
    - [@Input](#input)
    - [@Output](#output)
  - [Beispiele](#beispiele)
    - [1. Ohne Formular](#1-ohne-formular)
    - [2. Mit Formular](#2-mit-formular)

## Overview / API

### Allgemein

| Name     | Beschreibung  |
| -------- | ------------- |
| import   | LuxFormModule |
| selector | lux-textarea  |

### @Input

| Name                   | Typ                    | Beschreibung                                                                                                                                                                                                                                                                                                                                                                 |
| ---------------------- | ---------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| luxName                | string                 | Der Name des Elements                                                                                                                                                                                                                                                                                                                                                        |
| luxMaxRows             | number                 | Bestimmt die maximale Anzahl an Zeilen, die dieses Textarea-Feld haben kann. -1 bedeutet, das kein Wert festgelegt ist.                                                                                                                                                                                                                                                      |
| luxMinRows             | number                 | Bestimmt die minimale Anzahl an Zeilen, welche von dieser Textarea angezeigt werden.                                                                                                                                                                                                                                                                                         |
| luxMaxLength           | number                 | Gibt an, wie viele Zeichen erlaubt sind. Vorsicht! Das funktioniert nicht für den Type "number". <br><br> Ab Version 11.5.0 wird ein Label angezeigt, das angibt, wie viele Zeichen (z.B. 10/50) noch eingegeben werden können. Über die Eigenschaft `luxHideCounterLabel` kann das Verhalten gesteuert werden. Bedingungen: luxType = `text` und das Element hat den Fokus. |
| luxPlaceholder         | string                 | Text der als Platzhalter, solange kein anderer Wert eingetragen ist, dargestellt wird.                                                                                                                                                                                                                                                                                       |
| luxAutocomplete        | string                 | Steuert, ob der Browser den Inhalt cachen darf.                                                                                                                                                                                                                                                                                                                              |
| luxValue               | string                 | Der Text-Wert des Input-Felds. Two-Way-Binding ebenfalls möglich, wenn das Input-Feld nicht innerhalb eines Reactive-Forms ist.                                                                                                                                                                                                                                              |
| luxTagId               | string                 | [LUX-Tag-Id](luxTagId-v14#direkte-konfiguration) für die automatischen Tests.                                                                                                                                                                                                                                                                                                |
| luxPlaceholder         | string                 | Text der als Platzhalter, solange kein anderer Wert eingetragen ist, dargestellt wird.                                                                                                                                                                                                                                                                                       |
| luxRequired            | boolean                | Bestimmt ob die Component ein Pflichtfeld ist oder nicht.                                                                                                                                                                                                                                                                                                                    |
| luxControlBinding      | string                 | Das Controlbinding (z.B. firstname) verbindet das Formularelement mit einem Wert aus dem Modell. (!) Diese Eigenschaft kann nur verwendet werden, wenn das Element innerhalb eines Formulars verwendet wird.                                                                                                                                                                 |
| luxErrorMessage        | string                 | Fehlertext, wenn das Formularelement nicht valide ist. Der Fehlertext ersetzt den Hinweistext, wenn es einen gibt. Ersetzt den luxErrorCallback, wenn gesetzt.                                                                                                                                                                                                               |
| luxDisabled            | boolean                | Bestimmt ob die Component deaktiviert ist oder nicht. Durch den Event-Emitter "luxDisabledChange" ist ein Two-Way-Binding möglich.                                                                                                                                                                                                                                           |
| luxReadonly            | boolean                | Bestimmt ob sich das Feld im reinen Lese-Zustand befindet (ähnlich wie disabled, aber ohne die Auswirkungen auf Forms und andere visuelle Darstellung).                                                                                                                                                                                                                      |
| luxErrorCallback       | LuxErrorCallbackFnType | Callback-Funktion die aufgerufen wird nachdem die Validierung der Component stattgefunden hat. Hier kann dann entsprechend aus dem übergebenen Errors-Objekt ein Fehler ausgelesen und die passende Fehlermeldung zurückgegeben werden. Liefert der Callback `undefined` zurück, wird die Defaultfehlermeldung ausgegeben.                                                   |
| luxControlValidators   | ValidatorFnType        | Validator-Funktion oder ein Array von Validator-Funktionen, die für diese Component hereingereicht werden können. Diese werden nur für nicht-ReactiveForms-Components angewendet und sollen so eine Validierung für "normale" Komponenten ermöglichen.                                                                                                                       |
| luxLabel               | string                 | Property welche ein Label oberhalb der FormComponent (Ausnahme: LuxToggle und LuxCheckbox, diese stellen das Label rechts von der Schaltfläche dar) darstellt.                                                                                                                                                                                                               |
| luxHint                | string                 | Property, welche einen Tipp/Text unterhalb der FormComponent darstellt. Alternativ kann man über das Content-Child `lux-form-hint` komplexere Hinweise (z.B. mit einem Link) darstellen.                                                                                                                                                                                     |
| luxHintShowOnlyOnFocus | boolean                | Gibt an, ob der Hinweis (siehe luxHint) nur angezeigt wird, wenn das Element den Fokus hat.                                                                                                                                                                                                                                                                                  |
| luxLabelLongFormat     | boolean                | Bestimmt, ob das Label mehrzeilig sein kann. Nutzung nur in Spalten empfohlen, da die Höhe des Formcontrols variieren kann. Dadurch kann die Ausrichtung an der Baseline nicht mehr gewährleistet werden.                                                                                                                                                                    |
| luxNoLabels            | boolean                | Gibt an, ob Labels angezeigt werden sollen.                                                                                                                                                                                                                                                                                                                                  |
| luxNoTopLabel          | boolean                | Gib an, ob das obere Label angezeigt werden soll.                                                                                                                                                                                                                                                                                                                            |
| luxNoBottomLabel       | boolean                | Gibt an, ob das untere Label (Hinweis oder Fehlermeldung) angezeigt werden soll.                                                                                                                                                                                                                                                                                             |
| luxDense               | boolean                | Property um die Höhe der Komponente zu verringern. Diese Eigenschaft ist für den Einsatz in großen Formularen gedacht und soll nicht standardmäßig in einer Anwendung genutzt werden.                                                                                                                                                                                        |

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

![Beispielbild 01](https://raw.githubusercontent.com/wiki/IHK-GfI/lux-components/Versions/v14/lux‐textarea-v14-img-01.png)

Ts

```typescript
value: string = "";
```

Html

```html
<lux-textarea
  luxLabel="Addressinformationen"
  luxPlaceholder="Maria Musterfrau"
  luxHint="Bitte tragen Sie hier Ihre Daten ein"
  [luxMaxRows]="5"
  [(luxValue)]="value"
  [luxMinRows]="1"
>
</lux-textarea>
```

### 2. Mit Formular

![Beispielbild 02](https://raw.githubusercontent.com/wiki/IHK-GfI/lux-components/Versions/v14/lux‐textarea-v14-img-02.png)

Ts

```typescript
myGroup: FormGroup;

constructor() {
    this.myGroup = new FormGroup({
        textarea: new FormControl<string>('')
    });
}
```

Html

```html
<form [formGroup]="myGroup">
  <lux-textarea
    luxLabel="Addressinformationen"
    luxPlaceholder="Maria Musterfrau"
    luxHint="Bitte tragen Sie hier Ihre Daten ein"
    [luxMaxRows]="5"
    [luxMinRows]="1"
    luxControlBinding="textarea"
  >
  </lux-textarea>
</form>
{{ myGroup?.value | json }}
```
