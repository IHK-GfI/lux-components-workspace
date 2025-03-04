# LUX-autocomplete

![Beispielbild LUX-Autocomplete](https://raw.githubusercontent.com/wiki/IHK-GfI/lux-components/Versions/v14/lux‐autocomplete-v14-img.png)

- [LUX-autocomplete](#lux-autocomplete)
  - [Overview / API](#overview--api)
    - [Allgemein](#allgemein)
    - [@Input](#input)
    - [@Output](#output)
  - [Beispiele](#beispiele)
    - [1. Ohne Formular](#1-ohne-formular)
    - [2. Mit Formular](#2-mit-formular)
    - [3. Mit Suffix und Präfix](#3-mit-suffix-und-präfix)
    - [4. Einfaches String-Array als Optionen](#4-einfaches-string-array-als-optionen)

## Overview / API

### Allgemein

| Name     | Beschreibung     |
| -------- | ---------------- |
| import   | LuxFormModule    |
| selector | lux-autocomplete |

### @Input

| Name                       | Typ                                                         | Beschreibung                                                                                                                                                                                                                                                                                                                                      |
| -------------------------- | ----------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| luxOptions                 | \<O = any>[]                                                | Enthält das Array mit den einzelnen Vorschlägen für das Autocomplete-Feld.                                                                                                                                                                                                                                                                        |
| luxOptionLabelProp         | string                                                      | Enthält den Namen des Feldes der für die Darstellung einer einzelnen Option genutzt werden soll. (Wenn Objekte als Optionen genutzt werden und kein einfaches String-Array).                                                                                                                                                                      |
| luxLookupDelay             | number                                                      | Entspricht der Verzögerung in ms bis die Filterung nach Eingabe im Input-Feld einsetzt.                                                                                                                                                                                                                                                           |
| luxPlaceholder             | string                                                      | Beinhaltet einen Platzhalter, der angezeigt wird solange kein Wert eingegeben wurde.                                                                                                                                                                                                                                                              |
| luxSelectAllOnClick        | boolean                                                     | Bestimmt ob das Anklicken des Input-Felds den kompletten Text darin selektiert.                                                                                                                                                                                                                                                                   |
| luxStrict                  | boolean                                                     | Bestimmt ob nur Elemente aus der Auswahlliste gültig sind oder ob eigene Eingaben ebenfalls als gültiger Wert genommen werden dürfen.                                                                                                                                                                                                             |
| luxTagId                   | string                                                      | [LUX-Tag-Id](luxTagId-v14#direkte-konfiguration) für die automatischen Tests.                                                                                                                                                                                                                                                                     |
| luxErrorMessageNotAnOption | string                                                      | Fehlermeldung, wenn der eingegebene Text keiner möglichen Option entspricht.                                                                                                                                                                                                                                                                      |
| luxValue                   | \<V = any \| null>                                          | Two-Way-Binding ebenfalls möglich, wenn das Input-Feld nicht innerhalb eines Reactive-Forms ist.                                                                                                                                                                                                                                                  |
| luxRequired                | boolean                                                     | Bestimmt ob die Component ein Pflichtfeld ist oder nicht.                                                                                                                                                                                                                                                                                         |
| luxControlBinding          | string                                                      | Das Controlbinding (z.B. firstname) verbindet das Formularelement mit einem Wert aus dem Modell. (!) Diese Eigenschaft kann nur verwendet werden, wenn das Element innerhalb eines Formulars verwendet wird.                                                                                                                                      |
| luxErrorMessage            | string                                                      | Fehlertext, wenn das Formularelement nicht valide ist. Der Fehlertext ersetzt den Hinweistext, wenn es einen gibt. Ersetzt den luxErrorCallback, wenn gesetzt.                                                                                                                                                                                    |
| luxDisabled                | boolean                                                     | Bestimmt ob die Component deaktiviert ist oder nicht. Durch den Event-Emitter "luxDisabledChange" ist ein Two-Way-Binding möglich.                                                                                                                                                                                                                |
| luxReadonly                | boolean                                                     | Bestimmt ob sich das Feld im reinen Lese-Zustand befindet (ähnlich wie disabled, aber ohne die Auswirkungen auf Forms und andere visuelle Darstellung).                                                                                                                                                                                           |
| luxErrorCallback           | LuxErrorCallbackFnType                                      | Callback-Funktion die aufgerufen wird nachdem die Validierung der Component stattgefunden hat. Hier kann dann entsprechend aus dem übergebenen Errors-Objekt ein Fehler ausgelesen und die passende Fehlermeldung zurückgegeben werden. Liefert der Callback `undefined` zurück, wird die Defaultfehlermeldung ausgegeben.                        |
| luxControlValidators       | ValidatorFnType                                             | Validator-Funktion oder ein Array von Validator-Funktionen, die für diese Component hereingereicht werden können. Diese werden nur für nicht-ReactiveForms-Components angewendet und sollen so eine Validierung für "normale" Komponenten ermöglichen.                                                                                            |
| luxLabel                   | string                                                      | Property welche ein Label oberhalb der FormComponent (Ausnahme: LuxToggle und LuxCheckbox, diese stellen das Label rechts von der Schaltfläche dar) darstellt.                                                                                                                                                                                    |
| luxHint                    | string                                                      | Property, welche einen Tipp/Text unterhalb der FormComponent darstellt. Alternativ kann man über das Content-Child `lux-form-hint` komplexere Hinweise (z.B. mit einem Link) darstellen.                                                                                                                                                          |
| luxHintShowOnlyOnFocus     | boolean                                                     | Gibt an, ob der Hinweis (siehe luxHint) nur angezeigt wird, wenn das Element den Fokus hat.                                                                                                                                                                                                                                                       |
| luxPickValue               | ((selected: O \| null \| undefined) => V) \| undefined      | Callback-Funktion die ein einzelnes Objekt vom selben Typ wie die luxOptions entgegennimmt. Hier kann dann ausgesucht werden, welches Property von der Komponente als Rückgabewert genutzt werden soll. Das ist vor allem dann nützlich, wenn nicht das ganze Objekt für die weitere Verwendung genutzt werden soll. Erfordert _luxStrict = true_ |
| luxFilterFn                | (filterTerm: string, label: string, option: any) => boolean | Callback-Funktion zum Filtern der Optionen. Wenn keine individuelle Funktion angegeben wird, wird eine Teilstringsuche durchgeführt.                                                                                                                                                                                                              |
| luxPanelWidth              | string,number,null                                          | Breite des Optionpanels                                                                                                                                                                                                                                                                                                                           |
| luxLabelLongFormat         | boolean                                                     | Bestimmt, ob das Label mehrzeilig sein kann. Nutzung nur in Spalten empfohlen, da die Höhe des Formcontrols variieren kann. Dadurch kann die Ausrichtung an der Baseline nicht mehr gewährleistet werden.                                                                                                                                         |
| luxOptionMultiline         | boolean                                                     | Mit dieser Property können im Dropdown-Panel mehrzeilige Optionstexte angezeigt werden.                                                                                                                                                                                                                                                           |
| luxOptionBlockSize         | number                                                      | Lädt die Optionen in der eingestellten Blockgröße nach, wenn gescrollt wird.                                                                                                                                                                                                                                                                      |
| luxNoLabels                | boolean                                                     | Gibt an, ob Labels angezeigt werden sollen.                                                                                                                                                                                                                                                                                                       |
| luxNoTopLabel              | boolean                                                     | Gib an, ob das obere Label angezeigt werden soll.                                                                                                                                                                                                                                                                                                 |
| luxNoBottomLabel           | boolean                                                     | Gibt an, ob das untere Label (Hinweis oder Fehlermeldung) angezeigt werden soll.                                                                                                                                                                                                                                                                  |
| luxDense                   | boolean                                                     | Property um die Höhe der Komponente zu verringern. Diese Eigenschaft ist für den Einsatz in großen Formularen gedacht und soll nicht standardmäßig in einer Anwendung genutzt werden.                                                                                                                                                             |

### @Output

| Name              | Typ                             | Beschreibung                                                                                                                 |
| ----------------- | ------------------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| luxOptionSelected | EventEmitter \<V = any \| null> | Output-Event welches ausgelöst wird sobald ein Wert aus der Auswahlliste selektiert wurde. Gibt das selektierte Element mit. |
| luxValueChange    | EventEmitter \<V = any \| null> | Output-Event welches ausgelöst wird sobald sich der luxValue-Wert ändert. Ermöglicht das Two-Way-Binding an luxValue         |
| luxFocusIn        | EventEmitter \<FocusEvent>      | Event welches beim Fokussieren des Elements ausgelöst wird und ein Objekt vom Typ FocusEvent weitergibt.                     |
| luxFocusOut       | EventEmitter \<FocusEvent>      | Event welches beim Fokusverlust des Elements ausgelöst wird und ein Objekt vom Typ FocusEvent weitergibt.                    |
| luxDisabledChange | EventEmitter \<boolean>         | Event welches beim Disablen des Elements ausgelöst wird.                                                                     |

## Beispiele

### 1. Ohne Formular

![Beispielbild 01](https://raw.githubusercontent.com/wiki/IHK-GfI/lux-components/Versions/v14/lux‐autocomplete-v14-img-01.png)

Ts

```typescript
options = [
  { label: "Meine Aufgaben", value: "A" },
  { label: "Gruppenaufgaben", value: "B" },
  { label: "Zurückgestellte Aufgaben", value: "C" },
  { label: "Vertretungsaufgaben", value: "D" },
];
selected: any;
```

Html

```html
<lux-autocomplete
  luxLabel="Mein Autocomplete"
  luxPlaceholder="Mein Placeholder"
  luxOptionLabelProp="label"
  [luxOptions]="options"
  [(luxValue)]="selected"
>
</lux-autocomplete>
```

### 2. Mit Formular

![Beispielbild 02](https://raw.githubusercontent.com/wiki/IHK-GfI/lux-components/Versions/v14/lux‐autocomplete-v14-img-02.png)

Ts

```typescript
options = [
  { label: "Meine Aufgaben", value: "A" },
  { label: "Gruppenaufgaben", value: "B" },
  { label: "Zurückgestellte Aufgaben", value: "C" },
  { label: "Vertretungsaufgaben", value: "D" },
];

myGroup = new FormGroup({
  autocomplete: new FormControl("", Validators.required),
});
```

Html

```html
<lux-autocomplete
  luxLabel="Mein Autocomplete"
  luxPlaceholder="Mein Placeholder"
  luxOptionLabelProp="label"
  [luxOptions]="options"
  luxControlBinding="autocomplete"
>
</lux-autocomplete>
```

### 3. Mit Suffix und Präfix

![Beispielbild 03](https://raw.githubusercontent.com/wiki/IHK-GfI/lux-components/Versions/v14/lux‐autocomplete-v14-img-03.png)

Ts

```typescript
options = [
  { label: "Meine Aufgaben", value: "A" },
  { label: "Gruppenaufgaben", value: "B" },
  { label: "Zurückgestellte Aufgaben", value: "C" },
  { label: "Vertretungsaufgaben", value: "D" },
];

myGroup = new FormGroup({
  autocomplete: new FormControl(""),
});
```

Html

```html
<lux-autocomplete
  luxLabel="Mein Autocomplete"
  luxPlaceholder="Mein Placeholder"
  luxOptionLabelProp="label"
  [luxOptions]="options"
  luxControlBinding="autocomplete"
>
  <lux-input-prefix>ABC</lux-input-prefix>
  <lux-input-suffix
    ><lux-icon [luxIconName]="'fas fa-tasks'"></lux-icon
  ></lux-input-suffix>
</lux-autocomplete>
```

### 4. Einfaches String-Array als Optionen

![Beispielbild 04](https://raw.githubusercontent.com/wiki/IHK-GfI/lux-components/Versions/v14/lux‐autocomplete-v14-img-04.png)

Ts

```typescript
options = [
  "Meine Aufgaben",
  "Gruppenaufgaben",
  "Zurückgestellte Aufgaben",
  "Vertretungsaufgaben",
];

myGroup = new FormGroup({
  autocomplete: new FormControl(""),
});
```

Html

```html
<lux-autocomplete
  luxLabel="Mein Autocomplete"
  luxPlaceholder="Mein Placeholder"
  luxOptionLabelProp="label"
  [luxOptions]="options"
  luxControlBinding="autocomplete"
>
</lux-autocomplete>
```
