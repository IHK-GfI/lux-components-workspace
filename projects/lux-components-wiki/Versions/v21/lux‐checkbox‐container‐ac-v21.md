# LUX-Checkbox-Container-Ac

![Beispielbild LUX-Checkbox-Container](https://raw.githubusercontent.com/IHK-GfI/lux-components-workspace/main/projects/lux-components-wiki/Versions/v21/lux‐checkbox‐container‐ac-v21-img.png)

- [LUX-Checkbox-Container-Ac](#lux-checkbox-container-ac)
  - [Overview / API](#overview--api)
    - [Allgemein](#allgemein)
    - [@Input](#input)
  - [Beispiele](#beispiele)
    - [1. Checkbox-Container mit einem Label](#1-checkbox-container-mit-einem-label)
    - [2. Mehrere Container in einem css-Grid](#2-mehrere-container-in-einem-css-grid)
    - [3. Validator: Mindestens eine Checkbox angehakt](#3-validator-mindestens-eine-checkbox-angehakt)
    - [4. Prüfung ohne Formular (luxAtLeastOneChecked)](#4-prüfung-ohne-formular-luxatleastonechecked)

## Overview / API

### Allgemein

Diese Komponente bietet einen einfachen Layout-Container, um mehrere Checkboxen analog zu einer Radio-Group anzuordnen.
Er ist für die Verwendung der lux-checkbox-ac konzipiert.
Diese wird automatisch in der komprimierten Darstellung angezeigt _**und enthält daher keinen Hinweis/Fehler-Container mehr!**_
Die Container können in einem Raster mit weiteren Ac-Form-Controls im luxDense-Format ausgerichtet werden.

| Name     | Beschreibung              |
| -------- | ------------------------- |
| selector | lux-checkbox-container-ac |

### @Input

| Name        | Typ     | Beschreibung                                                                                                                                                                                                                                           |
| ----------- | ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| luxLabel    | String  | Optionales Label oberhalb des Containers. Es ist im Styling dem Formcontrol-Label angepasst. Damit kann der Container mit weiteren Ac-Formular-Elementen kombiniert werden. Wird kein Label angegeben, wird der Label-Container komplett ausgeblendet. |
| luxVertical | boolean | Mit dieser Property kann die Ausrichtung des Containers bestimmt werden. Default ist "true" und die Checkboxen werden in einer Spalte dargestellt, mit false wird auf eine Reihendarstellung gewechselt.                                               |

## Beispiele

### 1. Checkbox-Container mit einem Label

![Beispielbild 01](https://raw.githubusercontent.com/IHK-GfI/lux-components-workspace/main/projects/lux-components-wiki/Versions/v21/lux‐checkbox‐container‐ac-v21-img-01.png)

Html

```html
<lux-checkbox-container-ac luxLabel="MyTestContainerLabel">
  <lux-checkbox-ac luxLabel="Lorem ipsum"></lux-checkbox-ac>
  <lux-checkbox-ac luxLabel="dolor"></lux-checkbox-ac>
  <lux-checkbox-ac luxLabel="sit amet consectetur"></lux-checkbox-ac>
  <lux-checkbox-ac luxLabel="adipisicing"></lux-checkbox-ac>
</lux-checkbox-container-ac>
```

### 2. Mehrere Container in einem css-Grid

![Beispielbild 02](https://raw.githubusercontent.com/IHK-GfI/lux-components-workspace/main/projects/lux-components-wiki/Versions/v21/lux‐checkbox‐container‐ac-v21-img-02.png)

Html

```html
<h2>Beispiel für die Verwendung von css-Grid</h2>
<div class="lux-grid lux-grid-cols-3 lt-md:lux-grid-cols-1 lux-gap-4">
  <lux-checkbox-container-ac luxLabel="Stufe">
    <lux-checkbox-ac luxLabel="Stufe 1"></lux-checkbox-ac>
    <lux-checkbox-ac luxLabel="Stufe 2"></lux-checkbox-ac>
    <lux-checkbox-ac luxLabel="Stufe 2+" class="col1"></lux-checkbox-ac>
  </lux-checkbox-container-ac>
  <lux-checkbox-container-ac luxLabel="Antragsart">
    <lux-checkbox-ac luxLabel="eUZ"></lux-checkbox-ac>
    <lux-checkbox-ac luxLabel="eBS"></lux-checkbox-ac>
    <lux-checkbox-ac luxLabel="mUZ"></lux-checkbox-ac>
    <lux-checkbox-ac luxLabel="mBS"></lux-checkbox-ac>
  </lux-checkbox-container-ac>
  <lux-checkbox-container-ac luxLabel="Status">
    <lux-checkbox-ac luxLabel="Bewilligt"></lux-checkbox-ac>
    <lux-checkbox-ac luxLabel="Abgelehnt"></lux-checkbox-ac>
    <lux-checkbox-ac luxLabel="Kommentiert"></lux-checkbox-ac>
    <lux-checkbox-ac luxLabel="Ungültig erklärt"></lux-checkbox-ac>
  </lux-checkbox-container-ac>
</div>
<p>
  Lorem ipsum dolor sit amet consectetur adipisicing elit. Nulla illum
  temporibus maxime quam repellat sunt delectus, excepturi maiores, saepe
  consequatur modi tempore sit!
</p>
```

### 3. Validator: Mindestens eine Checkbox angehakt

Mit dem `luxAtLeastOneCheckboxChecked`-Validator kann auf `FormGroup`-Ebene geprüft werden, ob mindestens eine der angegebenen Checkboxen angehakt ist.

> **Hinweis:** Da Checkboxen innerhalb eines `lux-checkbox-container-ac` keinen eigenen Fehler-Container besitzen, muss die Fehleranzeige manuell über `formGroup.hasError('luxAtLeastOneCheckboxChecked')` im Template realisiert werden.

TypeScript

```typescript
import { luxAtLeastOneCheckboxChecked } from '@ihk-gfi/lux-components';
import { FormControl, FormGroup } from '@angular/forms';

interface MeineForm {
  option1: FormControl<boolean>;
  option2: FormControl<boolean>;
  option3: FormControl<boolean>;
}

this.form = new FormGroup<MeineForm>(
  {
    option1: new FormControl<boolean>(false, { nonNullable: true }),
    option2: new FormControl<boolean>(false, { nonNullable: true }),
    option3: new FormControl<boolean>(false, { nonNullable: true })
  },
  { validators: luxAtLeastOneCheckboxChecked(['option1', 'option2', 'option3']) }
);
```

Html

```html
<form [formGroup]="form">
  <lux-checkbox-container-ac luxLabel="Bitte mindestens eine Option wählen" [luxShowRequiredMarker]="true">
    <lux-checkbox-ac luxLabel="Option 1" luxControlBinding="option1"></lux-checkbox-ac>
    <lux-checkbox-ac luxLabel="Option 2" luxControlBinding="option2"></lux-checkbox-ac>
    <lux-checkbox-ac luxLabel="Option 3" luxControlBinding="option3"></lux-checkbox-ac>
  </lux-checkbox-container-ac>

  @if (form.hasError('luxAtLeastOneCheckboxChecked') && form.touched) {
    <div class="lux-pl-3 lux-form-error-container">
      <lux-icon
        class="lux-form-error-icon"
        luxIconName="lux-interface-alert-warning-triangle"
        luxIconSize="0.875rem"
        luxPadding="1px"
        luxMargin="0px 2px 0px 0px"
      ></lux-icon>
      <mat-error class="lux-form-error-label">Es muss mindestens eine Option ausgewählt werden.</mat-error>
    </div>
  }

  <lux-button luxLabel="Absenden" (luxClicked)="submit()"></lux-button>
</form>
```

Die Methode `submit()` sollte `form.markAllAsTouched()` aufrufen, damit die Fehlermeldung angezeigt wird:

```typescript
submit(): void {
  this.form.markAllAsTouched();
  this.form.updateValueAndValidity();
}
```

### 4. Prüfung ohne Formular (luxAtLeastOneChecked)

Für Checkboxen, die ohne `FormGroup` per `[(luxChecked)]`-Binding verwendet werden, steht die Funktion
`luxAtLeastOneChecked(values: boolean[])` zur Verfügung.
Sie erwartet ein Array von boolean-Werten und gibt `true` zurück, wenn mindestens einer davon `true` ist.

> **Hinweis:** Da kein Formular vorhanden ist, muss die Fehleranzeige und der Absendevorgang
> vollständig in der Komponente gesteuert werden (z.B. über ein `submitted`-Flag).

TypeScript

```typescript
import { luxAtLeastOneChecked } from '@ihk-gfi/lux-components';

opt1 = false;
opt2 = false;
opt3 = false;
submitted = false;
readonly luxAtLeastOneChecked = luxAtLeastOneChecked;

submit(): void {
  this.submitted = true;
}
```

Html

```html
<lux-checkbox-container-ac luxLabel="Bitte mindestens eine Option wählen" [luxShowRequiredMarker]="true">
  <lux-checkbox-ac luxLabel="Option A" [(luxChecked)]="opt1"></lux-checkbox-ac>
  <lux-checkbox-ac luxLabel="Option B" [(luxChecked)]="opt2"></lux-checkbox-ac>
  <lux-checkbox-ac luxLabel="Option C" [(luxChecked)]="opt3"></lux-checkbox-ac>
</lux-checkbox-container-ac>

@if (submitted && !luxAtLeastOneChecked([opt1, opt2, opt3])) {
  <div class="lux-pl-3 lux-form-error-container">
    <lux-icon
      class="lux-form-error-icon"
      luxIconName="lux-interface-alert-warning-triangle"
      luxIconSize="0.875rem"
      luxPadding="1px"
      luxMargin="0px 2px 0px 0px"
    ></lux-icon>
    <mat-error class="lux-form-error-label">Es muss mindestens eine Option ausgewählt werden.</mat-error>
  </div>
}

<lux-button luxLabel="Absenden" (luxClicked)="submit()"></lux-button>
```
