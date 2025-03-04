# LUX-Checkbox

![Beispielbild LUX-Checkbox](https://raw.githubusercontent.com/wiki/IHK-GfI/lux-components/Versions/v16/lux‐checkbox-v16-img.png)

- [LUX-Checkbox](#lux-checkbox)
  - [Overview / API](#overview--api)
    - [Allgemein](#allgemein)
    - [@Input](#input)
    - [@Output](#output)
  - [Beispiele](#beispiele)
    - [1. Ohne Formular](#1-ohne-formular)
    - [2. Mit Two-Way-Binding](#2-mit-two-way-binding)
    - [3. Mit Formular](#3-mit-formular)

## Overview / API

### Allgemein

| Name     | Version | Beschreibung    |
| -------- | ------- | --------------- |
| import   |         | LuxFormModule   |
| selector | 1.1.3   | lux-checkbox-ac |

### @Input

| Name                   | Typ                    | Beschreibung                                                                                                                                                                                                                                                                                                               |
| ---------------------- | ---------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| luxTagId               | string                 | [LUX-Tag-Id](luxTagId-v16#direkte-konfiguration) für die automatischen Tests.                                                                                                                                                                                                                                              |
| luxChecked             | boolean                | Beschreibt den Zustand der Component (true = checked, false = unchecked). Two-Way-Binding ebenfalls möglich, wenn die Component nicht innerhalb eines Formulars verwendet wird.                                                                                                                                            |
| luxRequired            | boolean                | Bestimmt ob die Component ein Pflichtfeld ist oder nicht.                                                                                                                                                                                                                                                                  |
| luxControlBinding      | string                 | Das Controlbinding (z.B. firstname) verbindet das Formularelement mit einem Wert aus dem Modell. (!) Diese Eigenschaft kann nur verwendet werden, wenn das Element innerhalb eines Formulars verwendet wird.                                                                                                               |
| luxErrorMessage        | string                 | Fehlertext, wenn das Formularelement nicht valide ist. Der Fehlertext ersetzt den Hinweistext, wenn es einen gibt. Ersetzt den luxErrorCallback, wenn gesetzt.                                                                                                                                                             |
| luxDisabled            | boolean                | Bestimmt ob die Component deaktiviert ist oder nicht. Durch den Event-Emitter "luxDisabledChange" ist ein Two-Way-Binding möglich.                                                                                                                                                                                         |
| luxReadonly            | boolean                | Bestimmt ob sich das Feld im reinen Lese-Zustand befindet (ähnlich wie disabled, aber ohne die Auswirkungen auf Forms und andere visuelle Darstellung).                                                                                                                                                                    |
| luxErrorCallback       | LuxErrorCallbackFnType | Callback-Funktion die aufgerufen wird nachdem die Validierung der Component stattgefunden hat. Hier kann dann entsprechend aus dem übergebenen Errors-Objekt ein Fehler ausgelesen und die passende Fehlermeldung zurückgegeben werden. Liefert der Callback `undefined` zurück, wird die Defaultfehlermeldung ausgegeben. |
| luxControlValidators   | ValidatorFnType        | Validator-Funktion oder ein Array von Validator-Funktionen, die für diese Component hereingereicht werden können. Diese werden nur für nicht-ReactiveForms-Components angewendet und sollen so eine Validierung für "normale" Komponenten ermöglichen.                                                                     |
| luxLabel               | string                 | Property welche ein Label oberhalb der FormComponent (Ausnahme: LuxToggle und LuxCheckbox, diese stellen das Label rechts von der Schaltfläche dar) darstellt.                                                                                                                                                             |
| luxHint                | string                 | Property, welche einen Tipp/Text unterhalb der FormComponent darstellt. Alternativ kann man über das Content-Child `lux-form-hint` komplexere Hinweise (z.B. mit einem Link) darstellen.                                                                                                                                   |
| luxHintShowOnlyOnFocus | boolean                | Gibt an, ob der Hinweis (siehe luxHint) nur angezeigt wird, wenn das Element den Fokus hat.                                                                                                                                                                                                                                |
| luxNoLabels            | boolean                | Gibt an, ob Labels angezeigt werden sollen.                                                                                                                                                                                                                                                                                |
| luxNoTopLabel          | boolean                | Gib an, ob das obere Label angezeigt werden soll.                                                                                                                                                                                                                                                                          |
| luxNoBottomLabel       | boolean                | Gibt an, ob das untere Label (Hinweis oder Fehlermeldung) angezeigt werden soll.                                                                                                                                                                                                                                           |
| luxDense               | boolean                | Property um die Höhe der Komponente zu verringern. Diese Eigenschaft ist für den Einsatz in großen Formularen gedacht und soll nicht standardmäßig in einer Anwendung genutzt werden.                                                                                                                                      |

### @Output

| Name              | Typ                        | Beschreibung                                                                                                                     |
| ----------------- | -------------------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| luxCheckedChange  | EventEmitter \<boolean>    | Output-Event welches ausgelöst wird, sobald sich der Checked-Zustand geändert hat. Ermöglicht das Two-Way-Binding an luxChecked. |
| luxFocusIn        | EventEmitter \<FocusEvent> | Event welches beim Fokussieren des Elements ausgelöst wird und ein Objekt vom Typ FocusEvent weitergibt.                         |
| luxFocusOut       | EventEmitter \<FocusEvent> | Event welches beim Fokusverlust des Elements ausgelöst wird und ein Objekt vom Typ FocusEvent weitergibt.                        |
| luxDisabledChange | EventEmitter \<boolean>    | Event welches beim Disablen des Elements ausgelöst wird.                                                                         |

## Beispiele

### 1. Ohne Formular

![Beispielbild 01](https://raw.githubusercontent.com/wiki/IHK-GfI/lux-components/Versions/v16/lux‐checkbox-v16-img-01.png)

Ts

```typecript
checked: boolean = true;

onCheckedChange($event: boolean) {
    console.log($event);
}
```

Html

```html
<lux-checkbox-ac
  luxLabel="Hungrig"
  (luxCheckedChange)="onCheckedChange($event)"
  [luxChecked]="checked"
></lux-checkbox-ac>
```

### 2. Mit Two-Way-Binding

![Beispielbild 02](https://raw.githubusercontent.com/wiki/IHK-GfI/lux-components/Versions/v16/lux‐checkbox-v16-img-02.png)

Ts

```typescript
checked: boolean = true;
```

Html

```html
<lux-checkbox-ac luxLabel="Hungrig" [(luxChecked)]="checked"></lux-checkbox-ac>
```

### 3. Mit Formular

![Beispielbild 03](https://raw.githubusercontent.com/wiki/IHK-GfI/lux-components/Versions/v16/lux‐checkbox-v16-img-03.png)

Ts

```typescript
myGroup = new FormGroup({
  hungry: new FormControl<boolean>(false, {
    validators: Validators.requiredTrue,
    nonNullable: true,
  }),
});
```

Html

```html
<form [formGroup]="myGroup">
  <lux-checkbox-ac
    luxLabel="Hungrig"
    luxControlBinding="hungry"
  ></lux-checkbox-ac>
</form>
```
