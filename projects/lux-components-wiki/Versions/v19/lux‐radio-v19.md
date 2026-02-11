# LUX-Radio

![Beispielbild LUX-Radio](lux‐radio-v19-img.png)

- [LUX-Radio](#lux-radio)
  - [Overview / API](#overview--api)
    - [Allgemein](#allgemein)
    - [@Input](#input)
    - [@Output](#output)
  - [Beispiele](#beispiele)
    - [1. Ohne Formular](#1-ohne-formular)
      - [String-Array](#string-array)
      - [Object-Array mit deaktivierter Option](#object-array-mit-deaktivierter-option)
      - [Mit ng-template](#mit-ng-template)
    - [2. Mit Formular](#2-mit-formular)
    - [3. Mit pickValue-Fn](#3-mit-pickvalue-fn)

## Overview / API

### Allgemein

| Name     | Beschreibung  |
| -------- | ------------- |
| selector | lux-radio-ac  |

### @Input

| Name                   | Typ                    | Beschreibung                                                                                                                                                                                                                                                                                                               |
| ---------------------- | ---------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| luxGroupName           | string                 | Name dieser Radio-Group. Ein luxGroupName muss vergeben werden, wenn mehrere Radiobuttongroups auf einer Seite verwendet werden.                                                                                                                                                                                           |
| luxOrientationVertical | boolean                | Boolean-Flag der definiert ob die Radio-Buttons horizontal oder vertikal angezeigt werden sollen.                                                                                                                                                                                                                          |
| luxSelected            | \<V = any>             | Das selektierte Element (luxMultiple = false). Die selektierten Elemente (luxMultiple = true).                                                                                                                                                                                                                             |
| luxOptions             | \<O = any>[]           | Array, welches die möglichen Optionen für den Select bereitstellt. <br/><br/>Ab der Version 11.2.0 kann man über die Property "disabled" einzelne Optionen deaktivieren (siehe Beispiel 1 "Object-Array mit deaktivierter Option").                                                                                        |
| luxOptionLabelProp     | string                 | Gibt das Property an, aus dem das Label geholt wird (siehe Beispiel unten).                                                                                                                                                                                                                                                |
| luxPickValue           | Function               | Callback-Funktion die ein einzelnes Objekt vom selben Typ wie die luxOptions entgegennimmt. Hier kann dann ausgesucht werden, welches Property von der Komponente als Rückgabewert genutzt werden soll. Das ist vor allem dann nützlich, wenn nicht das ganze Objekt für die weitere Verwendung genutzt werden soll.       |
| luxCompareWith         | Function               | Hier kann eine Vergleichsfunktion angegeben werden, die die Component dann benutzt um Objekte zu vergleichen. Aufbau: (o1: any, o2: any) => boolean;                                                                                                                                                                       |
| luxTagId               | string                 | [LUX-Tag-Id](luxTagId-v19#direkte-konfiguration) für die automatischen Tests.                                                                                                                                                                                                                                              |
| luxPlaceholder         | string                 | Text der als Platzhalter, solange kein anderer Wert eingetragen ist, dargestellt wird.                                                                                                                                                                                                                                     |
| luxAutocomplete        | string                 | Steuert, ob der Browser den Inhalt cachen darf.                                                                                                                                                                                                                                                                            |
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
| luxLabelLongFormat     | boolean                | Bestimmt, ob das Label mehrzeilig sein kann. Nutzung nur in Spalten empfohlen, da die Höhe des Formcontrols variieren kann. Dadurch kann die Ausrichtung an der Baseline nicht mehr gewährleistet werden.                                                                                                                  |
| luxNoLabels            | boolean                | Gibt an, ob Labels angezeigt werden sollen.                                                                                                                                                                                                                                                                                |
| luxNoTopLabel          | boolean                | Gib an, ob das obere Label angezeigt werden soll.                                                                                                                                                                                                                                                                          |
| luxNoBottomLabel       | boolean                | Gibt an, ob das untere Label (Hinweis oder Fehlermeldung) angezeigt werden soll.                                                                                                                                                                                                                                           |
| luxDense               | boolean                | Property um die Höhe der Komponente zu verringern. Diese Eigenschaft ist für den Einsatz in großen Formularen gedacht und soll nicht standardmäßig in einer Anwendung genutzt werden.                                                                                                                                      |

### @Output

| Name              | Typ                        | Beschreibung                                                                                                                             |
| ----------------- | -------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| luxSelectedChange | EventEmitter \<V = any>    | Output-Event welches ausgelöst wird wenn ein Element/mehrere Elemente selektiert wurde/n. Ermöglicht das Two-Way-Binding an luxSelected. |
| luxFocusIn        | EventEmitter \<FocusEvent> | Event welches beim Fokussieren des Elements ausgelöst wird und ein Objekt vom Typ FocusEvent weitergibt.                                 |
| luxFocusOut       | EventEmitter \<FocusEvent> | Event welches beim Fokusverlust des Elements ausgelöst wird und ein Objekt vom Typ FocusEvent weitergibt.                                |
| luxDisabledChange | EventEmitter \<boolean>    | Event welches beim Disablen des Elements ausgelöst wird.                                                                                 |

## Beispiele

### 1. Ohne Formular

![Beispielbild 01-01](lux‐radio-v19-img-01-01.png)

#### String-Array

Ts

```typescript
options: string[] = ['männlich', 'weiblich'];
selected: string = this.options[1];
```

Html

```html
<lux-radio-ac
  luxGroupName="genderGroup"
  [luxOptions]="options"
  [luxSelected]="selected"
  [luxOrientationVertical]="false"
></lux-radio-ac>
```

#### Object-Array mit deaktivierter Option

![Beispielbild 01-02](lux‐radio-v19-img-01-02.png)

Ts

```typescript
  options: { label: string, value: string, disabled?: boolean }[] = [
    { label: 'männlich', value: 'm' },
    { label: 'weiblich', value: 'w' },
    { label: 'divers', value: 'd', disabled: true },
  ];
  selected:  { label: string, value: string, disabled?: boolean } = this.options[1];
```

Html

```html
<lux-radio-ac
  luxGroupName="genderGroup"
  [luxOptions]="options"
  [luxSelected]="selected"
  [luxOrientationVertical]="false"
  luxOptionLabelProp="label"
></lux-radio-ac>
```

#### Mit ng-template

Ts

```typescript
options: { label: string, value: string }[] = [
  { label: 'männlich', value: 'm' },
  { label: 'weiblich', value: 'w' }
];
selected: { label: string, value: string } = this.options[1];
```

Html

```html
<lux-radio-ac
  luxGroupName="genderGroup"
  [luxOptions]="options"
  [luxSelected]="selected"
  [luxOrientationVertical]="false"
>
  <ng-template let-option> {{ option.label }} </ng-template>
</lux-radio-ac>
```

### 2. Mit Formular

![Beispielbild 02](lux‐radio-v19-img-02.png)

Ts

```typescript
options: { label: string, value: string }[] = [
    { label: 'männlich', value: 'm' },
    { label: 'weiblich', value: 'w' }
];

myGroup: FormGroup;

constructor() {
    this.myGroup = new FormGroup({
      radio: new FormControl<{ label: string, value: string } | null>(this.options[0])
    });
}
```

Html

```html
<form [formGroup]="myGroup">
  <lux-radio-ac luxGroupName="genderGroup" [luxOptions]="options" luxControlBinding="radio">
    <ng-template let-option> {{ option.label }} </ng-template>
  </lux-radio-ac>
</form>
```

### 3. Mit pickValue-Fn

![Beispielbild 03](lux‐radio-v19-img-03.png)

Ts

```typescript
options: { label: string, value: string }[] = [
    { label: 'männlich', value: 'm' },
    { label: 'weiblich', value: 'w' }
];

selected = 'w';

pickFn(o: { label: string, value: string }) {
   return o ? o.value : undefined;
}
```

Html

```html
<lux-radio-ac
  luxGroupName="genderGroup"
  [luxOptions]="options"
  [(luxSelected)]="selected"
  [luxPickValue]="pickFn"
  [luxOrientationVertical]="false"
>
  <ng-template let-option> {{ option.label }} </ng-template>
</lux-radio-ac>
```
