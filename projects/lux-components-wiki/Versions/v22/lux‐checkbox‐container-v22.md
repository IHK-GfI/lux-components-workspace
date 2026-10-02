# LUX-Checkbox-Container

![Beispielbild LUX-Checkbox-Container](https://raw.githubusercontent.com/IHK-GfI/lux-components-workspace/main/projects/lux-components-wiki/Versions/v22/lux‐checkbox‐container-v22-img.png)

- [LUX-Checkbox-Container](#lux-checkbox-container)
  - [Overview / API](#overview--api)
    - [Allgemein](#allgemein)
    - [@Input](#input)
  - [Beispiele](#beispiele)
    - [1. Checkbox-Container mit einem Label](#1-checkbox-container-mit-einem-label)
    - [2. Mehrere Container in einem css-Grid](#2-mehrere-container-in-einem-css-grid)
    - [3. Signal Forms: Mindestens eine Checkbox angehakt](#3-signal-forms-mindestens-eine-checkbox-angehakt)
    - [4. Validator: Mindestens eine Checkbox angehakt](#4-validator-mindestens-eine-checkbox-angehakt)
    - [5. Prüfung ohne Formular (luxAtLeastOneChecked)](#5-prüfung-ohne-formular-luxatleastonechecked)

## Overview / API

### Allgemein

Diese Komponente bietet einen einfachen Layout-Container, um mehrere Checkboxen analog zu einer Radio-Group anzuordnen.
Er ist für die Verwendung der lux-checkbox konzipiert.
Diese wird automatisch in der komprimierten Darstellung angezeigt _**und enthält daher keinen Hinweis/Fehler-Container mehr!**_
Die Container können in einem Raster mit weiteren Form-Controls im luxDense-Format ausgerichtet werden.

| Name     | Beschreibung                                      |
| -------- | ------------------------------------------------- |
| selector | lux-checkbox-container, lux-checkbox-container-ac |

### @Input

| Name                  | Typ     | Beschreibung                                                                                                                                                                                                                                        |
| --------------------- | ------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| luxLabel              | string  | Optionales Label oberhalb des Containers. Es ist im Styling dem Formcontrol-Label angepasst. Damit kann der Container mit weiteren Formular-Elementen kombiniert werden. Wird kein Label angegeben, wird der Label-Container komplett ausgeblendet. |
| luxVertical           | boolean | Mit dieser Property kann die Ausrichtung des Containers bestimmt werden. Default ist "true" und die Checkboxen werden in einer Spalte dargestellt, mit false wird auf eine Reihendarstellung gewechselt.                                            |
| luxShowRequiredMarker | boolean | Zeigt am Label die Pflichtfeld-Markierung (*) an, z.B. wenn mindestens eine Checkbox angehakt werden muss. Default: false.                                                                                                                          |

## Beispiele

### 1. Checkbox-Container mit einem Label

![Beispielbild 01](https://raw.githubusercontent.com/IHK-GfI/lux-components-workspace/main/projects/lux-components-wiki/Versions/v22/lux‐checkbox‐container-v22-img-01.png)

Html

```html
<lux-checkbox-container luxLabel="MyTestContainerLabel">
  <lux-checkbox luxLabel="Lorem ipsum" />
  <lux-checkbox luxLabel="dolor" />
  <lux-checkbox luxLabel="sit amet consectetur" />
  <lux-checkbox luxLabel="adipisicing" />
</lux-checkbox-container>
```

### 2. Mehrere Container in einem css-Grid

![Beispielbild 02](https://raw.githubusercontent.com/IHK-GfI/lux-components-workspace/main/projects/lux-components-wiki/Versions/v22/lux‐checkbox‐container-v22-img-02.png)

Html

```html
<h2>Beispiel für die Verwendung von css-Grid</h2>
<div class="lux-grid lux-grid-cols-3 lt-md:lux-grid-cols-1 lux-gap-4">
  <lux-checkbox-container luxLabel="Stufe">
    <lux-checkbox luxLabel="Stufe 1" />
    <lux-checkbox luxLabel="Stufe 2" />
    <lux-checkbox luxLabel="Stufe 2+" class="col1" />
  </lux-checkbox-container>
  <lux-checkbox-container luxLabel="Antragsart">
    <lux-checkbox luxLabel="eUZ" />
    <lux-checkbox luxLabel="eBS" />
    <lux-checkbox luxLabel="mUZ" />
    <lux-checkbox luxLabel="mBS" />
  </lux-checkbox-container>
  <lux-checkbox-container luxLabel="Status">
    <lux-checkbox luxLabel="Bewilligt" />
    <lux-checkbox luxLabel="Abgelehnt" />
    <lux-checkbox luxLabel="Kommentiert" />
    <lux-checkbox luxLabel="Ungültig erklärt" />
  </lux-checkbox-container>
</div>
<p>
  Lorem ipsum dolor sit amet consectetur adipisicing elit. Nulla illum
  temporibus maxime quam repellat sunt delectus, excepturi maiores, saepe
  consequatur modi tempore sit!
</p>
```

### 3. Signal Forms: Mindestens eine Checkbox angehakt

Mit Signal Forms wird die Prüfung über eine eigene `validate()`-Regel auf der Ebene des Objekts formuliert, das die Checkbox-Werte enthält. Die Checkboxen werden über `[formField]` gebunden.

> **Hinweis:** Da Checkboxen innerhalb eines `lux-checkbox-container` keinen eigenen Fehler-Container besitzen, muss die Fehleranzeige manuell im Template realisiert werden. Für `<mat-error>` muss `MatError` (aus `@angular/material/form-field`) in den `imports` der Komponente stehen.

Ts

```typescript
import { FormField, form, validate } from '@angular/forms/signals';

readonly model = signal({ options: { option1: false, option2: false, option3: false } });
readonly optionsForm = form(this.model, (path) => {
  validate(path.options, ({ value }) => {
    const { option1, option2, option3 } = value();
    return option1 || option2 || option3
      ? undefined
      : { kind: 'atLeastOneChecked', message: 'Es muss mindestens eine Option ausgewählt werden.' };
  });
});
readonly submitted = signal(false);

submit(): void {
  this.submitted.set(true);
}
```

Html

```html
<lux-checkbox-container luxLabel="Bitte mindestens eine Option wählen" [luxShowRequiredMarker]="true">
  <lux-checkbox luxLabel="Option 1" [formField]="optionsForm.options.option1" />
  <lux-checkbox luxLabel="Option 2" [formField]="optionsForm.options.option2" />
  <lux-checkbox luxLabel="Option 3" [formField]="optionsForm.options.option3" />
</lux-checkbox-container>

@if (submitted() && optionsForm.options().invalid()) {
  <div class="lux-pl-3 lux-form-error-container">
    <lux-icon
      class="lux-form-error-icon"
      luxIconName="lux-interface-alert-warning-triangle"
      luxIconSize="0.875rem"
      luxPadding="1px"
      luxMargin="0px 2px 0px 0px"
    />
    <mat-error class="lux-form-error-label">Es muss mindestens eine Option ausgewählt werden.</mat-error>
  </div>
}

<lux-button luxLabel="Absenden" (luxClicked)="submit()" />
```

### 4. Validator: Mindestens eine Checkbox angehakt

> **Veraltet:** Die Reactive-Forms-Variante (`luxControlBinding`) in diesem Beispiel funktioniert in v22 weiterhin, entfällt aber mit der nächsten Major-Version. Für neue Formulare bitte Signal Forms verwenden (siehe [3. Signal Forms: Mindestens eine Checkbox angehakt](#3-signal-forms-mindestens-eine-checkbox-angehakt)).

Mit dem `luxAtLeastOneCheckboxChecked`-Validator kann auf `FormGroup`-Ebene geprüft werden, ob mindestens eine der angegebenen Checkboxen angehakt ist.

> **Hinweis:** Da Checkboxen innerhalb eines `lux-checkbox-container` keinen eigenen Fehler-Container besitzen, muss die Fehleranzeige manuell über `formGroup.hasError('luxAtLeastOneCheckboxChecked')` im Template realisiert werden. Für `<mat-error>` muss `MatError` in den `imports` der Komponente stehen.

TypeScript

```typescript
import { luxAtLeastOneCheckboxChecked } from '@ihk-gfi/lux-components';
import { FormControl, FormGroup } from '@angular/forms';

// außerhalb der Klasse
interface MeineForm {
  option1: FormControl<boolean>;
  option2: FormControl<boolean>;
  option3: FormControl<boolean>;
}

// in der Klasse
readonly form = new FormGroup<MeineForm>(
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
  <lux-checkbox-container luxLabel="Bitte mindestens eine Option wählen" [luxShowRequiredMarker]="true">
    <lux-checkbox luxLabel="Option 1" luxControlBinding="option1" />
    <lux-checkbox luxLabel="Option 2" luxControlBinding="option2" />
    <lux-checkbox luxLabel="Option 3" luxControlBinding="option3" />
  </lux-checkbox-container>

  @if (form.hasError('luxAtLeastOneCheckboxChecked') && form.touched) {
    <div class="lux-pl-3 lux-form-error-container">
      <lux-icon
        class="lux-form-error-icon"
        luxIconName="lux-interface-alert-warning-triangle"
        luxIconSize="0.875rem"
        luxPadding="1px"
        luxMargin="0px 2px 0px 0px"
      />
      <mat-error class="lux-form-error-label">Es muss mindestens eine Option ausgewählt werden.</mat-error>
    </div>
  }

  <lux-button luxLabel="Absenden" (luxClicked)="submit()" />
</form>
```

Die Methode `submit()` sollte `form.markAllAsTouched()` aufrufen, damit die Fehlermeldung angezeigt wird:

```typescript
submit(): void {
  this.form.markAllAsTouched();
  this.form.updateValueAndValidity();
}
```

### 5. Prüfung ohne Formular (luxAtLeastOneChecked)

Für Checkboxen, die ohne Formular per `[(checked)]`-Binding verwendet werden, steht die Funktion
`luxAtLeastOneChecked(values: boolean[])` zur Verfügung.
Sie erwartet ein Array von boolean-Werten und gibt `true` zurück, wenn mindestens einer davon `true` ist.

> **Hinweis:** Da kein Formular vorhanden ist, muss die Fehleranzeige und der Absendevorgang
> vollständig in der Komponente gesteuert werden (z.B. über ein `submitted`-Flag).

TypeScript

```typescript
import { luxAtLeastOneChecked } from '@ihk-gfi/lux-components';

readonly opt1 = signal(false);
readonly opt2 = signal(false);
readonly opt3 = signal(false);
readonly submitted = signal(false);
readonly luxAtLeastOneChecked = luxAtLeastOneChecked;

submit(): void {
  this.submitted.set(true);
}
```

Html

```html
<lux-checkbox-container luxLabel="Bitte mindestens eine Option wählen" [luxShowRequiredMarker]="true">
  <lux-checkbox luxLabel="Option A" [(checked)]="opt1" />
  <lux-checkbox luxLabel="Option B" [(checked)]="opt2" />
  <lux-checkbox luxLabel="Option C" [(checked)]="opt3" />
</lux-checkbox-container>

@if (submitted() && !luxAtLeastOneChecked([opt1(), opt2(), opt3()])) {
  <div class="lux-pl-3 lux-form-error-container">
    <lux-icon
      class="lux-form-error-icon"
      luxIconName="lux-interface-alert-warning-triangle"
      luxIconSize="0.875rem"
      luxPadding="1px"
      luxMargin="0px 2px 0px 0px"
    />
    <mat-error class="lux-form-error-label">Es muss mindestens eine Option ausgewählt werden.</mat-error>
  </div>
}

<lux-button luxLabel="Absenden" (luxClicked)="submit()" />
```
