# LUX-Slider

![Beispielbild LUX-Slider](https://raw.githubusercontent.com/wiki/IHK-GfI/lux-components/Versions/v18/lux‐slider-v18-img.png)

- [LUX-Slider](#lux-slider)
  - [Overview / API](#overview--api)
    - [Allgemein](#allgemein)
    - [@Input](#input)
    - [@Output](#output)
  - [Beispiele](#beispiele)
    - [1. Ohne Formular](#1-ohne-formular)
    - [2. Mit Formular](#2-mit-formular)
    - [3. Mit DisplayWith-Function](#3-mit-displaywith-function)

## Overview / API

### Allgemein

| Name     | Beschreibung  |
| -------- | ------------- |
| selector | lux-slider-ac |

### @Input

| Name                   | Typ                    | Beschreibung                                                                                                                                                                                                                                                                                                                                                         |
| ---------------------- | ---------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| luxColor               | LuxSliderColor         | Bestimmt das Farbschema (abhängig vom Theme) des Sliders, diese können auch im Typ SLIDER_COLORS der Slider-Komponente eingesehen werden. Mögliche Werte: 'primary' 'accent' 'warn'                                                                                                                                                                                  |
| luxShowThumbLabel      | boolean                | Bestimmt ob beim Ziehen des Sliders ein Label mit dem aktuellen Wert im Slider.                                                                                                                                                                                                                                                                                      |
| luxValue               | number                 | Beinhaltet den aktuellen Wert des Sliders als Zahlenwert. Erlaubt auch Two-Way-Binding.                                                                                                                                                                                                                                                                              |
| luxMax                 | number                 | Bestimmt den Maximal-Wert des Sliders und kann nicht kleiner/gleich 0 und kleiner/gleich luxMin sein.                                                                                                                                                                                                                                                                |
| luxMin                 | number                 | Bestimmt den Minimal-Wert des Slider und kann nicht kleiner 0 und größer/gleich luxMax sein.                                                                                                                                                                                                                                                                         |
| luxStep                | number                 | Bestimmt die Größe der Schritte die in diesem Slider gemacht werden können. Diese können nur kleiner/gleich luxMax - luxMin sein.                                                                                                                                                                                                                                    |
| luxTagId               | string                 | [LUX-Tag-Id](luxTagId-v18#direkte-konfiguration) für die automatischen Tests.                                                                                                                                                                                                                                                                                        |
| luxPlaceholder         | string                 | Text der als Platzhalter, solange kein anderer Wert eingetragen ist, dargestellt wird.                                                                                                                                                                                                                                                                               |
| luxRequired            | boolean                | Bestimmt ob die Component ein Pflichtfeld ist oder nicht.                                                                                                                                                                                                                                                                                                            |
| luxControlBinding      | string                 | Das Controlbinding (z.B. firstname) verbindet das Formularelement mit einem Wert aus dem Modell. (!) Diese Eigenschaft kann nur verwendet werden, wenn das Element innerhalb eines Formulars verwendet wird.                                                                                                                                                         |
| luxErrorMessage        | string                 | Fehlertext, wenn das Formularelement nicht valide ist. Der Fehlertext ersetzt den Hinweistext, wenn es einen gibt. Ersetzt den luxErrorCallback, wenn gesetzt.                                                                                                                                                                                                       |
| luxDisabled            | boolean                | Bestimmt ob die Component deaktiviert ist oder nicht. Durch den Event-Emitter "luxDisabledChange" ist ein Two-Way-Binding möglich.                                                                                                                                                                                                                                   |
| luxReadonly            | boolean                | Bestimmt ob sich das Feld im reinen Lese-Zustand befindet (ähnlich wie disabled, aber ohne die Auswirkungen auf Forms und andere visuelle Darstellung).                                                                                                                                                                                                              |
| luxErrorCallback       | LuxErrorCallbackFnType | Callback-Funktion die aufgerufen wird nachdem die Validierung der Component stattgefunden hat. Hier kann dann entsprechend aus dem übergebenen Errors-Objekt ein Fehler ausgelesen und die passende Fehlermeldung zurückgegeben werden. Liefert der Callback `undefined` zurück, wird die Defaultfehlermeldung ausgegeben.                                           |
| luxControlValidators   | ValidatorFnType        | Validator-Funktion oder ein Array von Validator-Funktionen, die für diese Component hereingereicht werden können. Diese werden nur für nicht-ReactiveForms-Components angewendet und sollen so eine Validierung für "normale" Komponenten ermöglichen.                                                                                                               |
| luxLabel               | string                 | Property welche ein Label oberhalb der FormComponent (Ausnahme: LuxToggle und LuxCheckbox, diese stellen das Label rechts von der Schaltfläche dar) darstellt.                                                                                                                                                                                                       |
| luxHint                | string                 | Property, welche einen Tipp/Text unterhalb der FormComponent darstellt. Alternativ kann man über das Content-Child `lux-form-hint` komplexere Hinweise (z.B. mit einem Link) darstellen.                                                                                                                                                                             |
| luxHintShowOnlyOnFocus | boolean                | Gibt an, ob der Hinweis (siehe luxHint) nur angezeigt wird, wenn das Element den Fokus hat.                                                                                                                                                                                                                                                                          |
| luxLabelLongFormat     | boolean                | Bestimmt, ob das Label mehrzeilig sein kann. Nutzung nur in Spalten empfohlen, da die Höhe des Formcontrols variieren kann. Dadurch kann die Ausrichtung an der Baseline nicht mehr gewährleistet werden.                                                                                                                                                            |
| luxNoLabels            | boolean                | Gibt an, ob Labels angezeigt werden sollen.                                                                                                                                                                                                                                                                                                                          |
| luxNoTopLabel          | boolean                | Gib an, ob das obere Label angezeigt werden soll.                                                                                                                                                                                                                                                                                                                    |
| luxNoBottomLabel       | boolean                | Gibt an, ob das untere Label (Hinweis oder Fehlermeldung) angezeigt werden soll.                                                                                                                                                                                                                                                                                     |
| luxDense               | boolean                | Property um die Höhe der Komponente zu verringern. Diese Eigenschaft ist für den Einsatz in großen Formularen gedacht und soll nicht standardmäßig in einer Anwendung genutzt werden.                                                                                                                                                                                |

### @Output

| Name              | Typ                        | Beschreibung                                                                                                                                        |
| ----------------- | -------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| luxChange         | EventEmitter \<number>     | Output-Event welches beim Ändern des Slider-Wertes ausgelöst wird.                                                                                  |
| luxInput          | EventEmitter \<number>     | Output-Event welches bereits beim Bewegen des Sliders ausgelöst wird.                                                                               |
| luxValueChange    | EventEmitter \<number>     | Output-Event welches ausgelöst wird, wenn sich luxValue ändert. Ermöglicht das Two-Way-Binding von luxValue.                                        |
| luxValuePercent   | EventEmitter \<number>     | Output-Event welches ausgelöst wird, wenn sich luxValue ändert. Es beinhaltet als Event den aktuellen Prozentwert des Sliders als Zahl (z.B. 55.5). |
| luxFocusIn        | EventEmitter \<FocusEvent> | Event welches beim Fokussieren des Elements ausgelöst wird und ein Objekt vom Typ FocusEvent weitergibt.                                            |
| luxFocusOut       | EventEmitter \<FocusEvent> | Event welches beim Fokusverlust des Elements ausgelöst wird und ein Objekt vom Typ FocusEvent weitergibt.                                           |
| luxDisabledChange | EventEmitter \<boolean>    | Event welches beim Disablen des Elements ausgelöst wird.                                                                                            |

## Beispiele

### 1. Ohne Formular

![Beispielbild 01](https://raw.githubusercontent.com/wiki/IHK-GfI/lux-components/Versions/v18/lux‐slider-v18-img-01.png)

Ts

```typescript
color: LuxSliderAcColor = "warn";
disabled: boolean = false;
showThumbLabel: boolean = true;
value: number = 30;
max: number = 100;
min: number = 10;
step: number = 10;
percent: number = 0;
```

Html

```html
<lux-slider-ac
  [luxColor]="color"
  [luxDisabled]="disabled"
  [luxShowThumbLabel]="showThumbLabel"
  [(luxValue)]="value"
  [luxMax]="max"
  [luxMin]="min"
  [luxStep]="step"
  (luxValuePercent)="percent = $event"
  luxTagId="slidernoform"
>
</lux-slider-ac>
```

### 2. Mit Formular

![Beispielbild 02](https://raw.githubusercontent.com/wiki/IHK-GfI/lux-components/Versions/v18/lux‐slider-v18-img-02.png)

Ts

```typescript
color: LuxSliderAcColor = 'primary';
showThumbLabel: boolean = true;
max: number             = 100;
min: number             = 10;
step: number            = 10;
percent: number         = 0;

formGroup: FormGroup;

constructor() {
  this.formGroup = new FormGroup({
    slider: new FormControl<number>(10, Validators.min(20))
  });
}
```

Html

```html
<div [formGroup]="formGroup" *ngIf="formGroup">
  <lux-slider-ac
    [luxColor]="color"
    [luxShowThumbLabel]="showThumbLabel"
    [luxMax]="max"
    [luxMin]="min"
    [luxStep]="step"
    (luxValuePercent)="percent = $event"
    luxControlBinding="slider"
    luxTagId="sliderform"
  >
  </lux-slider-ac>
  <p>Formular-Value: {{formGroup.value | json}}</p>
</div>
```

### 3. Mit DisplayWith-Function

![Beispielbild 03](https://raw.githubusercontent.com/wiki/IHK-GfI/lux-components/Versions/v18/lux‐slider-v18-img-03.png)

Ts

```typescript
displayFn(value: number): string {
  if (value && value >= 1000) {
    return Math.round(value / 1000) + 'k';
  }
  return value ? ()'' + value) : '0';
}
```

Html

```html
<lux-slider-ac [luxMax]="10000" [luxMin]="0" [luxDisplayWith]="displayFn">
</lux-slider-ac>
```
