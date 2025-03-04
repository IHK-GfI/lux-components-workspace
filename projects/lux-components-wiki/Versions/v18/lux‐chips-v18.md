# LUX-Chips

![Beispielbild LUX-Chips](https://raw.githubusercontent.com/wiki/IHK-GfI/lux-components/Versions/v18/lux‐chips-v18-img.png)

- [LUX-Chips](#lux-chips)
  - [Overview / API](#overview--api)
    - [Allgemein](#allgemein)
    - [@Input](#input)
    - [@Output](#output)
  - [Components](#components)
    - [LuxChipGroupComponent](#luxchipgroupcomponent)
      - [Allgemein](#allgemein-1)
      - [@Input](#input-1)
      - [@Output](#output-1)
    - [LuxChipComponent](#luxchipcomponent)
      - [Allgemein](#allgemein-2)
      - [@Input](#input-2)
      - [@Output](#output-2)
  - [Beispiele](#beispiele)
    - [1. Simple Chips](#1-simple-chips)
    - [2. Chipgroup mit Eingabefeld](#2-chipgroup-mit-eingabefeld)
    - [3. Chips mit Autocomplete](#3-chips-mit-autocomplete)
    - [4. Chips im Formular](#4-chips-im-formular)

## Overview / API

### Allgemein

| Name     | Beschreibung  |
| -------- | ------------- |
| import   | LuxFormModule |
| selector | lux-chips-ac  |

Ober-Komponente der LuxChips. Kann einzelne LuxChip- oder auch die LuxChipGroup-Komponenten enthalten.

### @Input

| Name                   | Typ                   | Beschreibung                                                                                                                                                                                                                                           |
| ---------------------- | --------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| luxOrientation         | LuxChipsOrientation   | Definiert die Ausrichtung der Chips. Mögliche Werte: 'horizontal' \| 'vertical'                                                                                                                                                                        |
| luxInputAllowed        | boolean               | Boolean-Flag der definiert ob das Input-Feld für das dynamische Hinzufügen von Chips verfügbar sein soll.                                                                                                                                              |
| luxInputLabel          | string                | Der Text der über dem Input-Feld angezeigt wird.                                                                                                                                                                                                       |
| luxDisabled            | boolean               | Boolean-Flag der definiert ob diese LuxChips-Komponente und alle darunterliegenden LuxChipGroups und LuxChips deaktiviert sein sollen. Deaktiviert ebenfalls das Input-Feld, wenn auf true gesetzt.                                                    |
| luxNewChipGroup        | LuxChipGroupComponent | Die LuxChipGroup der dynamisch neue LuxChips hinzugefügt werden, wenn eine Eingabe in dem Input-Feld gemacht wird. Wenn nicht gesetzt wird stattdessen das @Output-Event luxChipAdded ausgelöst, damit der Aufrufer selbst reagieren kann.             |
| luxAutocompleteOptions | string[]              | Optionales Array, welches dann - vorausgesetzt luxInputAllowed hat den Wert true - in einem Autocomplete-Feld unterhalb des Inputs dargestellt wird.                                                                                                   |
| luxPlaceholder         | string                | Text der als Platzhalter, solange kein anderer Wert eingetragen ist, dargestellt wird.                                                                                                                                                                 |
| luxLabelLongFormat     | boolean               | Bestimmt, ob das Label mehrzeilig sein kann. Nutzung nur in Spalten empfohlen, da die Höhe des Formcontrols variieren kann. Dadurch kann die Ausrichtung an der Baseline nicht mehr gewährleistet werden.                                              |
| luxOptionBlockSize     | number                | Lädt die Optionen in der eingestellten Blockgröße nach, wenn gescrollt wird.                                                                                                                                                                           |
| luxStrict              | boolean               | Gibt an, ob nur Chips ausgewählt werden dürfen, die Teil der Optionen sind (siehe `luxAutocompleteOptions`). Doppelte Einträge sind ebenfalls nicht erlaubt.                                                                                           |
| luxControlBinding      | string                | Das Controlbinding (z.B. countries) verbindet das Formularelement mit einem Wert aus dem Modell. (!) Diese Eigenschaft kann nur verwendet werden, wenn das Element innerhalb eines Formulars verwendet wird.                                           |
| luxControlValidators   | ValidatorFnType       | Validator-Funktion oder ein Array von Validator-Funktionen, die für diese Component hereingereicht werden können. Diese werden nur für nicht-ReactiveForms-Components angewendet und sollen so eine Validierung für "normale" Komponenten ermöglichen. |
| luxRequired            | boolean               | Bestimmt ob die Component ein Pflichtfeld ist oder nicht.                                                                                                                                                                                              |
| luxDense               | boolean               | Property um die Höhe der Komponente zu verringern. Diese Eigenschaft ist für den Einsatz in großen Formularen gedacht und soll nicht standardmäßig in einer Anwendung genutzt werden.                                                                  |
| luxHideBorder          | boolean               | Mit dieser Property kann die Border um das Inputelement ausgeblendet werden, falls luxInputAllowed auf false gesetzt ist.                                                                                                                              |

### @Output

| Name         | Typ                    | Beschreibung                                                                                                  |
| ------------ | ---------------------- | ------------------------------------------------------------------------------------------------------------- |
| luxChipAdded | EventEmitter \<string> | Output-Event welches ausgelöst wird, wenn keine spezielle LuxChipGroup für neue Chip-Einträge festgelegt ist. |

## Components

### LuxChipGroupComponent

Kapselt ein Array von Labels um eine Liste von Chips anzuzeigen. Für die Darstellung von mehreren Chips mit dem selben Aufbau.

Um den Inhalt eines einzelnen Chips zu definieren, erwartet die LuxChipGroup ein ng-template, welches dann jeden gewünschten Content enthalten kann.

Über let-chipItem am ng-template erhält man Zugriff auf das aktuelle Chip.

#### Allgemein

| Name     | Beschreibung      |
| -------- | ----------------- |
| selector | lux-chip-ac-group |

#### @Input

| Name              | Typ             | Beschreibung                                                                                                                                                     |
| ----------------- | --------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| lux-chip-ac-group | Selector        |                                                                                                                                                                  |
| luxLabels         | string[]        | Enthält das Array mit den Labels, die in den einzelnen LuxChips angezeigt werden. Erlaubt auch das Two-Way-Binding (praktisch für die Arbeit in Reactive-Forms). |
| luxColor          | LuxThemePalette | Definiert die Farbe der LuxChips innerhalb dieser LuxGroup. Mögliche Werte: 'primary', 'accent' und 'warn'                                                       |
| luxDisabled       | boolean         | Boolean-Flag der definiert ob die LuxChips in dieser LuxGroup deaktiviert sind oder nicht.                                                                       |
| luxRemovable      | boolean         | Boolean-Flag der definiert ob die LuxChips in dieser LuxGroup entfernt werden können oder nicht.                                                                 |

#### @Output

| Name            | Typ                              | Beschreibung                                                                                                                  |
| --------------- | -------------------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| luxChipClicked  | EventEmitter \<number>           | Output-Event welches ausgelöst wird, wenn ein LuxChip angeklickt wird. Gibt das entsprechende Chip als Übergabeparameter mit. |
| luxChipAdded    | EventEmitter \<string>           | Output-Event welches ausgelöst wird, wenn ein LuxChip hinzugefügt wird.                                                       |
| luxChipRemoved  | EventEmitter \<number>           | Output-Event welches ausgelöst wird, wenn ein LuxChip entfernt wird.                                                          |

### LuxChipComponent

Stellt einen einzelnen Chip dar.

#### Allgemein

| Name     | Beschreibung |
| -------- | ------------ |
| selector | lux-chip-ac  |

#### @Input

| Name         | Typ             | Beschreibung                                                                                                                                                                                      |
| ------------ | --------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| luxColor     | LuxThemePalette | Definiert die Farbe dieses LuxChip. Mögliche Werte: 'primary', 'accent' und 'warn'                                                                                                                |
| luxDisabled  | boolean         | Boolean-Flag der definiert ob dieser LuxChip deaktiviert ist oder nicht. Wenn auf true gesetzt, wird das Icon für das Entfernen dieses Chips versteckt.                                           |
| luxRemovable | boolean         | Boolean-Flag der definiert ob dieser LuxChip entfernt werden kann oder nicht. Wenn auf true gesetzt, wird ein Icon mit einem "x"-Symbol dargestellt, welches beim Klick das Remove-Event anstößt. |

#### @Output

| Name            | Typ                              | Beschreibung                                                                                                                         |
| --------------- | -------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| luxChipRemoved  | EventEmitter \<number>           | Output-Event welches ausgelöst wird, wenn auf das "x"-Symbol geklickt wird. Gibt den entsprechenden Index als Übergabeparameter mit. |
| luxChipClicked  | EventEmitter \<number>           | Output-Event welches ausgelöst wird, wenn ein LuxChip angeklickt wird. Gibt den entsprechenden Index als Übergabeparameter mit.      |

## Beispiele

### 1. Simple Chips

![Beispielbild 01](https://raw.githubusercontent.com/wiki/IHK-GfI/lux-components/Versions/v18/lux‐chips-v18-img-01.png)

Ts

```typescript
chipClicked(index: number) {
  console.log(index);
}

chipRemoved(index: number) {
  console.log(index);
}
```

Html

```html
<lux-chips-ac [luxHideBorder]="true">
  <lux-chip-ac luxColor="primary">Primary Farbe</lux-chip-ac>
  <lux-chip-ac luxColor="warn">Warn Farbe</lux-chip-ac>
  <lux-chip-ac luxColor="accent">Accent Farbe</lux-chip-ac>
  <lux-chip-ac [luxDisabled]="true" (luxChipClicked)="chipClicked($event)"
    >Deaktivierter Chip</lux-chip-ac
  >
  <lux-chip-ac [luxRemovable]="true" (luxChipRemoved)="chipRemoved($event)"
    >Entfernbarer Chip</lux-chip-ac
  >
</lux-chips-ac>
```

### 2. Chipgroup mit Eingabefeld

![Beispielbild 02](https://raw.githubusercontent.com/wiki/IHK-GfI/lux-components/Versions/v18/lux‐chips-v18-img-02.png)

Ts

```typescript
chipItems: string[] = [ 'Chip 0', 'Chip 1', 'Chip 2', 'Chip 3'];


chipRemoved(index: number) {
    console.log(index);
}


chipAdded(newChip: string) {
    console.log(newChip);
}


chipItemClicked(index: number) {
    console.log(index);
}
```

Html

```html
<lux-chips-ac
  [luxInputAllowed]="true"
  luxInputLabel="Chip-Text eingeben"
  [luxNewChipGroup]="group"
>
  <lux-chip-ac-group
    [luxLabels]="chipItems"
    luxColor="primary"
    [luxRemovable]="true"
    (luxChipAdded)="chipAdded($event)"
    (luxChipRemoved)="chipRemoved($event)"
    (luxChipClicked)="chipItemClicked($event)"
    #group
  >
  </lux-chip-ac-group>
</lux-chips-ac>
```

### 3. Chips mit Autocomplete

![Beispielbild 03](https://raw.githubusercontent.com/wiki/IHK-GfI/lux-components/Versions/v18/lux‐chips-v18-img-03.png)

Ts

```typescript
chips: string[] = [ 'Chip 0', 'Chip 1', 'Chip 2', 'Chip 3'];
options: string[] = ['Hallo', 'Ciao', 'Privet'];


chipAdded(newChip: string) {
  this.chips.push(newChip);
}
```

Html

```html
<lux-chips-ac
  [luxAutocompleteOptions]="options"
  [luxInputAllowed]="true"
  (luxChipAdded)="chipAdded($event)"
>
  <lux-chip-ac luxColor="primary" *ngFor="let chip of chips">
    {{ chip }}
  </lux-chip-ac>
</lux-chips-ac>
```

### 4. Chips im Formular

![Beispielbild 04](https://raw.githubusercontent.com/wiki/IHK-GfI/lux-components/Versions/v18/lux‐chips-v18-img-04.png)

Ts

```typescript
form: FormGroup;
autocompleteOptions = ['Belgien', 'Deutschland', 'Frankreich', 'Ukraine', 'USA'];

constructor() {
  this.form = new FormGroup({
    countries: new FormControl<string[] | null>(null, Validators.required)
  });
}
```

Html

```html
<ng-container [formGroup]="form">
  <lux-chips-ac
    luxInputLabel="Länder"
    luxControlBinding="countries"
    [luxStrict]="true"
    [luxInputAllowed]="true"
    [luxAutocompleteOptions]="autocompleteOptions"
    [luxNewChipGroup]="chipGroupForm"
  >
    <lux-chip-ac-group
      [luxRemovable]="true"
      [luxDisabled]="false"
      #chipGroupForm
    >
    </lux-chip-ac-group>
  </lux-chips-ac>
</ng-container>
```
