# LUX-Stepper

![Beispielbild LUX-Stepper](https://raw.githubusercontent.com/IHK-GfI/lux-components-workspace/main/projects/lux-components-wiki/Versions/v22/lux‐stepper-v22-img.png)

- [LUX-Stepper](#lux-stepper)
  - [Overview / API](#overview--api)
    - [Allgemein](#allgemein)
    - [@Input](#input)
    - [@Output](#output)
  - [Components](#components)
    - [LuxStepComponent](#luxstepcomponent)
      - [Allgemein](#allgemein-1)
      - [@Input](#input-1)
    - [LuxStepHeaderComponent](#luxstepheadercomponent)
    - [LuxStepContentComponent](#luxstepcontentcomponent)
  - [Classes / Interfaces](#classes--interfaces)
    - [ILuxStepperButtonConfig](#iluxstepperbuttonconfig)
  - [Beispiele](#beispiele)
    - [1. Signal Forms](#1-signal-forms)
    - [2. Horizontaler Stepper mit angepassten Buttons](#2-horizontaler-stepper-mit-angepassten-buttons)
    - [3. Horizontaler Stepper mit Buttons im Footer](#3-horizontaler-stepper-mit-buttons-im-footer)
    - [4. Vertikaler Stepper](#4-vertikaler-stepper)
    - [5. Stepper ohne StepControl](#5-stepper-ohne-stepcontrol)
    - [6. Schritt in eigene Komponente auslagern](#6-schritt-in-eigene-komponente-auslagern)
    - [7. Stepper im Dialog](#7-stepper-im-dialog)
  - [Zusatzinformationen](#zusatzinformationen)
    - [Allgemein](#allgemein-2)
    - [Validierung der Steps](#validierung-der-steps)
    - [Konfigurationsoptionen](#konfigurationsoptionen)

## Overview / API

### Allgemein

| Name     | Beschreibung |
| -------- | ------------ |
| selector | lux-stepper  |

### @Input

| Name                             | Typ                     | Beschreibung                                                                                                                                                                                                            |
| -------------------------------- | ----------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| luxVerticalStepper | boolean | Definiert ob der Stepper vertikal oder horizontal dargestellt wird. Default: false. |
| luxLinear | boolean | Definiert ob die einzelnen Schritte nur nacheinander abgearbeitet werden können oder ob jeder Step direkt angesteuert werden kann. Default: true. |
| luxDisabled | boolean | Definiert ob der Stepper deaktiviert ist oder nicht. Wenn deaktiviert, ist der Stepper leicht ausgegraut. Default: false. |
| luxHorizontalStepAnimationActive | boolean | Definiert ob die Übergangsanimationen für den horizontalen Stepper aktiviert sind oder nicht. Aktuell noch nicht für den vertikalen Stepper verfügbar. Default: true. |
| luxShowNavigationButtons | boolean | Definiert ob die Navigations-Buttons (Zurück, Weiter, Finish) dargestellt werden sollen oder nicht. Default: true. |
| luxUseCustomIcons | boolean | Definiert ob für die einzelnen Steps eigene Icons verwendet werden sollen oder nicht. Wenn false, dann werden Ziffern für die einzelnen Steps verwendet. Die Icons haben die Größe '2x', diese entspricht dem Wert 2em. Default: false. |
| luxEditedIconName | string | Definiert das Icon das angezeigt wird wenn ein einzelner Step erfolgreich bearbeitet worden ist. Default: 'lux-interface-edit-pencil'. |
| luxCurrentStepNumber | number | Definiert den aktiven Step, dadurch lässt sich der Start-Step festlegen, sofern luxLinear auf false gesetzt ist. Two-Way-Binding über `[(luxCurrentStepNumber)]` möglich. Default: 0. |
| luxPreviousButtonConfig          | ILuxStepperButtonConfig | Konfigurationsobjekt, welches die Anpassung des Zurück-Buttons regelt. Mögliche Optionen sind im Interface ILuxStepperButtonConfig eingetragen.                                                                         |
| luxNextButtonConfig              | ILuxStepperButtonConfig | Konfigurationsobjekt, welches die Anpassung des Weiter-Buttons regelt. Mögliche Optionen sind im Interface ILuxStepperButtonConfig eingetragen.                                                                         |
| luxFinishButtonConfig            | ILuxStepperButtonConfig | Konfigurationsobjekt, welches die Anpassung des Abschließen-Buttons regelt. Mögliche Optionen sind im Interface ILuxStepperButtonConfig eingetragen.                                                                    |
| luxA11YMode                      | boolean                 | Wenn aktiv, sind die Navigations-Buttons immer klickbar (nicht visuell deaktiviert), auch wenn der aktuelle Step noch nicht abgeschlossen ist. Standardwert: `false`.                                                   |
| luxButtonAlignLeft               | boolean                 | Wenn aktiv, werden die Navigations-Buttons linksbündig unterhalb des Step-Contents angezeigt. Standardwert: `false` (rechtsbündig).                                                                                     |

### @Output

| Name                       | Typ                   | Beschreibung                                                                                                                       |
| -------------------------- | --------------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| luxFinishButtonClicked     | void                  | Gibt ein Event aus, sobald der Abschließen-Button angeklickt wurde. Der Button ist nur im letzten Step verfügbar.                  |
| luxStepChanged             | StepperSelectionEvent | Das Event wird immer gefeuert, wenn ein neuer Schritt ausgewählt wird. Die Event-Payload ist vom Typ StepperSelectionEvent.        |
| luxCurrentStepNumberChange | number                | Gibt ein Event mit der aktuellen Step-Nummer aus, ermöglicht das Two-Way-Binding an luxCurrentStepNumber.                          |
| luxStepClicked             | number                | Gibt ein Event aus, sobald ein Step angeklickt wurde.                                                                              |
| luxCheckValidation         | number                | Gibt ein Event aus, wenn neu validiert werden sollte. Z.B. wenn kein Formular verwendet wird, sondern das Property "luxCompleted". |

## Components

### LuxStepComponent

Diese Component entspricht einem einzelnen Step in dem Stepper.

Die Validierung des Steps erfolgt entweder über `luxCompleted` (z.B. mit Signal Forms, siehe [1. Signal Forms](#1-signal-forms)) oder über eine FormGroup (Reactive Forms), welche über luxStepControl eingebunden und zusätzlich dem LuxStepContentComponent zugewiesen wird.

#### Allgemein

| Name     | Beschreibung |
| -------- | ------------ |
| selector | lux-step     |

#### @Input

| Name           | Typ       | Beschreibung                                                                                                                                                             |
| -------------- | --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| luxStepControl | FormGroup | Enthält die FormGroup (Reactive Forms), die für den aktuellen Step notwendig ist. Alternativ kann luxCompleted genutzt werden (z.B. mit Signal Forms). |
| luxIconName    | string    | Enthält das Icon, welches für diesen Step angezeigt werden soll. Funktioniert nur, wenn der dazugehörige LuxStepper den Wert für luxUseCustomIcons auf true gesetzt hat. |
| luxIconSize | string | Größe des Step-Icons (siehe luxIconName). Default: '1x'. |
| luxOptional | boolean | Bestimmt, ob dieser Step optional ist. Greift nur, wenn kein luxStepControl gesetzt ist, welches invalid ist. Default: false. |
| luxEditable | boolean | Bestimmt, ob dieser Step wieder angesteuert werden kann, nachdem er bearbeitet und verlassen wurde. Default: true. |
| luxCompleted | boolean | Alternative zu luxStepControl, ermöglicht die Validierung des Steps ohne FormGroup (z.B. mit Signal Forms: `[luxCompleted]="myForm.feld().valid()"`). Ein Step ohne luxStepControl und luxCompleted gilt als abgeschlossen. Default: true. |

### LuxStepHeaderComponent

Über das LuxStepHeaderComponent lässt sich der Titel eines Steps festlegen.

| Name     | Beschreibung    |
| -------- | --------------- |
| selector | lux-step-header |

### LuxStepContentComponent

Das LuxStepContentComponent beinhaltet den eigentlichen Inhalt dieses Steps.

Bei der Validierung über luxStepControl (Reactive Forms) wird dieser Tag ebenfalls mit einer Referenz auf die entsprechende FormGroup versehen.

| Name     | Beschreibung     |
| -------- | ---------------- |
| selector | lux-step-content |

## Classes / Interfaces

### ILuxStepperButtonConfig

Objekte können dieses Interface implementieren, um so die einzelnen Steuer-Buttons zu modifizieren. Alle Properties sind optional.

| Name               | Typ             | Beschreibung                                |
| ------------------ | --------------- | ------------------------------------------- |
| label? | string | Text des Buttons. |
| color? | LuxThemePalette | Farbe des Buttons |
| iconName? | string | Name des Icons, für diesen Button. |
| alignIconWithLabel? | boolean | Ohne Wirkung (wird von den Buttons nicht mehr ausgewertet). |
| flat? | boolean | Stellt den Button als Flat-Button dar. |
| stroked? | boolean | Stellt den Button als Stroked-Button dar. |

## Beispiele

### 1. Signal Forms

Mit Signal Forms wird die Validierung eines Steps über `luxCompleted` gesteuert. Die Formularelemente werden über `[formField]` gebunden; die Direktive `FormField` muss in den `imports` der Komponente stehen.

Ts

```typescript
import { FormField, form, required } from '@angular/forms/signals';

readonly model = signal({ firstname: '', lastname: '', street: '' });
readonly stepperForm = form(this.model, (path) => {
  required(path.firstname, { message: 'Bitte geben Sie Ihren Vornamen ein.' });
  required(path.lastname, { message: 'Bitte geben Sie Ihren Nachnamen ein.' });
  required(path.street, { message: 'Bitte geben Sie die Straße ein.' });
});
```

Html

```html
<lux-stepper [luxLinear]="true">
  <lux-step [luxCompleted]="stepperForm.firstname().valid() && stepperForm.lastname().valid()">
    <lux-step-header> Person </lux-step-header>
    <lux-step-content class="lux-flex lux-flex-col">
      <lux-input luxLabel="Vorname" [formField]="stepperForm.firstname" />
      <lux-input luxLabel="Nachname" [formField]="stepperForm.lastname" />
    </lux-step-content>
  </lux-step>

  <lux-step [luxCompleted]="stepperForm.street().valid()">
    <lux-step-header> Adresse </lux-step-header>
    <lux-step-content class="lux-flex lux-flex-col">
      <lux-input luxLabel="Straße" [formField]="stepperForm.street" />
    </lux-step-content>
  </lux-step>

  <lux-step>
    <lux-step-header> Zusammenfassung </lux-step-header>
    <lux-step-content>
      {{ model().firstname }} {{ model().lastname }}, {{ model().street }}
    </lux-step-content>
  </lux-step>
</lux-stepper>
```

### 2. Horizontaler Stepper mit angepassten Buttons

> **Veraltet:** Die Reactive-Forms-Variante (`luxControlBinding`, `luxStepControl`) in diesem Beispiel funktioniert in v22 weiterhin, entfällt aber mit der nächsten Major-Version. Für neue Formulare bitte Signal Forms verwenden (siehe [1. Signal Forms](#1-signal-forms)).

![Beispielbild 01](https://raw.githubusercontent.com/IHK-GfI/lux-components-workspace/main/projects/lux-components-wiki/Versions/v22/lux‐stepper-v22-img-01.png)

Ts

```typescript
readonly stepperPreviousButtonConfig: ILuxStepperButtonConfig = {
  label: 'Zurück'
};

readonly stepperNextButtonConfig: ILuxStepperButtonConfig = {
  label: 'Weiter',
  color: 'primary'
};

readonly stepperFinishButtonConfig: ILuxStepperButtonConfig = {
  label: 'Abschließen',
  iconName: 'lux-save',
  color: 'primary'
};

readonly stepperForm0 = new FormGroup({
  testInput0: new FormControl<string>('', Validators.required)
});

readonly stepperForm1 = new FormGroup({
  testInput1: new FormControl<string>('', Validators.required)
});

readonly stepperForm2 = new FormGroup({
  testInput2: new FormControl<string>('', Validators.required)
});
```

Html

```html
<lux-stepper
  [luxVerticalStepper]="false"
  [luxLinear]="true"
  [luxHorizontalStepAnimationActive]="false"
  [luxPreviousButtonConfig]="stepperPreviousButtonConfig"
  [luxNextButtonConfig]="stepperNextButtonConfig"
  [luxFinishButtonConfig]="stepperFinishButtonConfig"
>
  <lux-step [luxStepControl]="stepperForm0">
    <lux-step-header> Testheader 0 </lux-step-header>
    <lux-step-content [formGroup]="stepperForm0" class="lux-flex lux-flex-col">
      <lux-input
        class="lux-max-width-80"
        luxControlBinding="testInput0"
        luxLabel="Testinput 0"
      />
    </lux-step-content>
  </lux-step>

  <lux-step [luxStepControl]="stepperForm1">
    <lux-step-header> Testheader 1 </lux-step-header>
    <lux-step-content [formGroup]="stepperForm1" class="lux-flex lux-flex-col">
      <lux-input
        class="lux-max-width-80"
        luxControlBinding="testInput1"
        luxLabel="Testinput 1"
      />
    </lux-step-content>
  </lux-step>

  <lux-step [luxStepControl]="stepperForm2">
    <lux-step-header> Testheader 2 </lux-step-header>
    <lux-step-content [formGroup]="stepperForm2" class="lux-flex lux-flex-col">
      <lux-input
        class="lux-max-width-80"
        luxControlBinding="testInput2"
        luxLabel="Testinput 2"
      />
    </lux-step-content>
  </lux-step>
</lux-stepper>
```

### 3. Horizontaler Stepper mit Buttons im Footer

> **Veraltet:** Die Reactive-Forms-Variante (`luxControlBinding`, `luxStepControl`) in diesem Beispiel funktioniert in v22 weiterhin, entfällt aber mit der nächsten Major-Version. Für neue Formulare bitte Signal Forms verwenden (siehe [1. Signal Forms](#1-signal-forms)).

![Beispielbild 02](https://raw.githubusercontent.com/IHK-GfI/lux-components-workspace/main/projects/lux-components-wiki/Versions/v22/lux‐stepper-v22-img-02.png)

Ts

```typescript
readonly stepper = viewChild.required<LuxStepperComponent>('stepper');

readonly btnPrev = LuxAppFooterButtonInfo.generateInfo({ label: 'Zurück', color: undefined, hidden: true, cmd: 'zurueck', alwaysVisible: true, onClick: () => this.stepperService.previousStep(this.stepper()) });
readonly btnNext = LuxAppFooterButtonInfo.generateInfo({ label: 'Weiter', color: 'primary', hidden: false, cmd: 'weiter', alwaysVisible: true, onClick: () => this.stepperService.nextStep(this.stepper()) });
readonly btnFin = LuxAppFooterButtonInfo.generateInfo({ label: 'Abschließen', color: 'primary', hidden: true, cmd: 'abschliessen', alwaysVisible: true });

private readonly buttonService = inject(LuxAppFooterButtonService);
private readonly stepperService = inject(LuxStepperHelperService);

readonly stepperForm0 = new FormGroup({
  testInput0: new FormControl<string>('', Validators.required)
});

readonly stepperForm1 = new FormGroup({
  testInput1: new FormControl<string>('', Validators.required)
});

readonly stepperForm2 = new FormGroup({
  testInput2: new FormControl<string>('', Validators.required)
});

constructor() {
  this.buttonService.buttonInfos = [
    this.btnPrev,
    this.btnNext,
    this.btnFin
  ];
}

ngOnDestroy() {
  this.buttonService.buttonInfos = [];
}

onStepChanged(event: StepperSelectionEvent) {
  if (event.selectedIndex === 0) {
    this.btnPrev.hidden = true;
    this.btnNext.hidden = false;
    this.btnFin.hidden = true;
  } else if (event.selectedIndex === 2) {
    this.btnPrev.hidden = false;
    this.btnNext.hidden = true;
    this.btnFin.hidden = false;
  } else {
    this.btnPrev.hidden = false;
    this.btnNext.hidden = false;
    this.btnFin.hidden = true;
  }

  // Der Footer verwendet OnPush: Änderungen an den ButtonInfos erst durch Neuzuweisung sichtbar machen
  this.buttonService.buttonInfos = [...this.buttonService.buttonInfos];
}
```

Html

```html
<lux-stepper
  [luxVerticalStepper]="false"
  [luxLinear]="true"
  [luxHorizontalStepAnimationActive]="false"
  [luxUseCustomIcons]="true"
  [luxShowNavigationButtons]="false"
  luxEditedIconName="lux-interface-validation-check"
  (luxStepChanged)="onStepChanged($event)"
  #stepper
>
  <lux-step [luxStepControl]="stepperForm0" luxIconName="lux-money-atm-card-1">
    <lux-step-header> Testheader 1 </lux-step-header>
    <lux-step-content [formGroup]="stepperForm0" class="lux-flex lux-flex-col">
      <lux-input
        class="lux-max-width-80"
        luxControlBinding="testInput0"
        luxLabel="Testinput 0"
      />
    </lux-step-content>
  </lux-step>

  <lux-step [luxStepControl]="stepperForm1" luxIconName="lux-money-graph">
    <lux-step-header> Testheader 2 </lux-step-header>
    <lux-step-content [formGroup]="stepperForm1" class="lux-flex lux-flex-col">
      <lux-input
        class="lux-max-width-80"
        luxControlBinding="testInput1"
        luxLabel="Testinput 1"
      />
    </lux-step-content>
  </lux-step>

  <lux-step
    [luxStepControl]="stepperForm2"
    luxIconName="lux-money-currency-euro"
  >
    <lux-step-header> Testheader 3 </lux-step-header>
    <lux-step-content [formGroup]="stepperForm2" class="lux-flex lux-flex-col">
      <lux-input
        class="lux-max-width-80"
        luxControlBinding="testInput2"
        luxLabel="Testinput 2"
      />
    </lux-step-content>
  </lux-step>
</lux-stepper>
```

### 4. Vertikaler Stepper

> **Veraltet:** Die Reactive-Forms-Variante (`luxControlBinding`, `luxStepControl`) in diesem Beispiel funktioniert in v22 weiterhin, entfällt aber mit der nächsten Major-Version. Für neue Formulare bitte Signal Forms verwenden (siehe [1. Signal Forms](#1-signal-forms)).

![Beispielbild 03](https://raw.githubusercontent.com/IHK-GfI/lux-components-workspace/main/projects/lux-components-wiki/Versions/v22/lux‐stepper-v22-img-03.png)

Ts

```typescript
readonly stepperForm0 = new FormGroup({
  testInput0: new FormControl<string>('', Validators.required)
});

readonly stepperForm1 = new FormGroup({
  testInput1: new FormControl<string>('', Validators.required)
});

readonly stepperForm2 = new FormGroup({
  testInput2: new FormControl<string>('', Validators.required)
});
```

Html

```html
<lux-stepper
  [luxVerticalStepper]="true"
  [luxLinear]="true"
  [luxUseCustomIcons]="false"
>
  <lux-step [luxStepControl]="stepperForm0">
    <lux-step-header> Testheader 1 </lux-step-header>
    <lux-step-content [formGroup]="stepperForm0" class="lux-flex lux-flex-col">
      <lux-input
        class="lux-max-width-80"
        luxControlBinding="testInput0"
        luxLabel="Testinput 0"
      />
    </lux-step-content>
  </lux-step>

  <lux-step [luxStepControl]="stepperForm1">
    <lux-step-header> Testheader 2 </lux-step-header>
    <lux-step-content [formGroup]="stepperForm1" class="lux-flex lux-flex-col">
      <lux-input
        class="lux-max-width-80"
        luxControlBinding="testInput1"
        luxLabel="Testinput 1"
      />
    </lux-step-content>
  </lux-step>

  <lux-step [luxStepControl]="stepperForm2">
    <lux-step-header> Testheader 3 </lux-step-header>
    <lux-step-content [formGroup]="stepperForm2" class="lux-flex lux-flex-col">
      <lux-input
        class="lux-max-width-80"
        luxControlBinding="testInput2"
        luxLabel="Testinput 2"
      />
    </lux-step-content>
  </lux-step>
</lux-stepper>
```

### 5. Stepper ohne StepControl

Html

```html
<lux-stepper [luxLinear]="true">
  <lux-step [luxCompleted]="!!input.value()">
    <lux-step-header> Testheader 1 </lux-step-header>
    <lux-step-content>
      <lux-input luxLabel="Testinput 0" #input />
    </lux-step-content>
  </lux-step>

  <lux-step [luxCompleted]="true">
    <lux-step-header> Testheader 2 </lux-step-header>
    <lux-step-content>
      <lux-input luxLabel="Testinput 1" />
    </lux-step-content>
  </lux-step>
</lux-stepper>
```

### 6. Schritt in eigene Komponente auslagern

> **Veraltet:** Die Reactive-Forms-Variante (`luxControlBinding`, `luxStepControl`) in diesem Beispiel funktioniert in v22 weiterhin, entfällt aber mit der nächsten Major-Version. Für neue Formulare bitte Signal Forms verwenden (siehe [1. Signal Forms](#1-signal-forms)).

In diesem Beispiel wurde der erste Stepperschritt in die Komponente "app-step-person" ausgelagert.

Ts - Stepper

```typescript
@Component({
  selector: 'app-stepper-example',
  templateUrl: './stepper-example.component.html',
  styleUrls: ['./stepper-example.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    LuxStepperComponent,
    LuxStepComponent,
    LuxStepHeaderComponent,
    LuxStepContentComponent,
    LuxInputComponent,
    ReactiveFormsModule,
    StepPersonComponent
  ]
})
export class StepperExampleComponent {
  readonly personForm = new FormGroup({
    firstname: new FormControl<string>('', Validators.required),
    lastname: new FormControl<string>('', Validators.required)
  });

  readonly stepperForm = new FormGroup({
    street: new FormControl<string>('', Validators.required),
    number: new FormControl<string>('')
  });
}
```

Html - Stepper

```html
<lux-stepper [luxLinear]="true">
  <app-step-person [luxStepControl]="personForm" />

  <lux-step [luxStepControl]="stepperForm">
    <lux-step-header> Adresse </lux-step-header>
    <lux-step-content [formGroup]="stepperForm">
      <div class="lux-flex lt-md:lux-flex-col lux-gap-4">
        <lux-input
          luxLabel="Straße"
          luxName="street"
          luxControlBinding="street"
        />
        <lux-input
          luxLabel="Nummer"
          luxName="number"
          luxControlBinding="number"
        />
      </div>
    </lux-step-content>
  </lux-step>

  <lux-step [luxStepControl]="stepperForm">
    <lux-step-header> Zusammenfassung </lux-step-header>
    <lux-step-content [formGroup]="stepperForm">
      <p>ToDo</p>
    </lux-step-content>
  </lux-step>
</lux-stepper>
```

Ts - app-step-person

```typescript
@Component({
  selector: 'app-step-person',
  templateUrl: './step-person.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [LuxInputComponent, ReactiveFormsModule],
  providers: [{ provide: LuxStepComponent, useExisting: StepPersonComponent }]
})
export class StepPersonComponent extends LuxStepComponent {
  // Die Step-Properties (luxStepControl, luxCompleted, luxOptional, ...) sind Inputs
  // und werden wie bei lux-step am Element gesetzt, z.B.:
  // 1. Variante: <app-step-person [luxStepControl]="personForm" />
  //    Das Formular legt fest, ob man zum nächsten Schritt darf.
  // 2. Variante: <app-step-person [luxCompleted]="personForm.valid && andereTolleBedingung" />
  //    Der Wert von luxCompleted legt fest, ob man zum nächsten Schritt darf.
}
```

Html - app-step-person

```html
<ng-template #header>Person</ng-template>

<ng-template #content>
  <div class="lux-flex lt-md:lux-flex-col lux-gap-4" [formGroup]="luxStepControl()!">
    <lux-input
      luxLabel="Vorname"
      luxName="firstname"
      luxControlBinding="firstname"
    />
  </div>
  <div class="lux-flex lux-gap-4">
    <lux-input
      luxLabel="Nachname"
      luxName="lastname"
      luxControlBinding="lastname"
    />
  </div>
</ng-template>
```

### 7. Stepper im Dialog

In diesem Beispiel wird ein Stepper in einem Dialog verwendet. Der Stepper ist im Dialog-Inhalt sichtbar, und die Dialog-Actions ersetzen die Stepper-Navigations-Buttons. Dazu wird `luxShowNavigationButtons="false"` gesetzt.

Ts – Dialog-Component

```typescript
@Component({
  selector: 'app-stepper-dialog-example',
  templateUrl: './stepper-dialog-example.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [/* ... */]
})
export class StepperDialogExampleComponent {
  readonly totalSteps = 3;
  readonly currentStepNumber = signal(0);
  readonly isFirstStep = computed(() => this.currentStepNumber() === 0);
  readonly isLastStep = computed(() => this.currentStepNumber() === this.totalSteps - 1);

  private readonly luxDialogRef = inject(LuxDialogRef);

  prevStep(): void {
    this.currentStepNumber.update((step) => Math.max(step - 1, 0));
  }

  nextStep(): void {
    this.currentStepNumber.update((step) => Math.min(step + 1, this.totalSteps - 1));
  }

  finish(): void {
    this.luxDialogRef.closeDialog(true);
  }

  cancel(): void {
    this.luxDialogRef.closeDialog(false);
  }
}
```

Html – Dialog-Component

```html
<lux-dialog-structure>
  <lux-dialog-title>Stepper im Dialog</lux-dialog-title>
  <lux-dialog-content>
    <lux-stepper
      [luxShowNavigationButtons]="false"
      [luxLinear]="false"
      [(luxCurrentStepNumber)]="currentStepNumber"
    >
      <lux-step>
        <lux-step-header>Schritt 1</lux-step-header>
        <lux-step-content>...</lux-step-content>
      </lux-step>
      <lux-step>
        <lux-step-header>Schritt 2</lux-step-header>
        <lux-step-content>...</lux-step-content>
      </lux-step>
      <lux-step>
        <lux-step-header>Zusammenfassung</lux-step-header>
        <lux-step-content>...</lux-step-content>
      </lux-step>
    </lux-stepper>
  </lux-dialog-content>
  <lux-dialog-actions>
    @if (!isFirstStep()) {
      <lux-button luxLabel="Zurück" (luxClicked)="prevStep()" />
    }
    @if (!isLastStep()) {
      <lux-button luxLabel="Weiter" luxColor="primary" [luxFlat]="true" (luxClicked)="nextStep()" />
    }
    @if (isLastStep()) {
      <lux-button luxLabel="Abschließen" luxColor="primary" [luxFlat]="true" (luxClicked)="finish()" />
    }
    <lux-button luxLabel="Abbrechen" (luxClicked)="cancel()" />
  </lux-dialog-actions>
</lux-dialog-structure>
```

Ts – Öffnen des Dialogs

```typescript
private readonly dialogService = inject(LuxDialogService);

openStepperDialog(): void {
  this.dialogService.openComponent(StepperDialogExampleComponent, { width: '600px', disableClose: true });
}
```

## Zusatzinformationen

### Allgemein

Komponente zur Darstellung von einzelnen Schritten in einer linearen/non-linearen Reihenfolge. Die Validierung eines Schritts erfolgt über `luxCompleted` (z.B. mit Signal Forms) oder über eine eigene FormGroup je Schritt (`luxStepControl`).

Besteht aus den Komponenten LuxStepper und LuxStep, der LuxStep wiederum besteht aus dem LuxStepHeader und dem LuxStepContent.
Die Komponenten LuxStepHeader und LuxStepContent bestehen lediglich aus dem Selektor und dienen der Template-Übertragung zum LuxStep hin.

Mithilfe des LuxStepperHelperService können die nextStep- und previousStep-Funktionen eines bestimmten Steppers bzw. falls kein spezieller Stepper definiert ist aller aktuellen Stepper aufgerufen werden.
Das ist besonders für ausgelagerte Navigation interessant (siehe Beispiel 3).

| Methode                                    | Beschreibung                                                                                   |
| ------------------------------------------ | ---------------------------------------------------------------------------------------------- |
| nextStep(stepper?: LuxStepperComponent)     | Wechselt zum nächsten Schritt des übergebenen Steppers (ohne Parameter: aller aktuellen Stepper). |
| previousStep(stepper?: LuxStepperComponent) | Wechselt zum vorherigen Schritt des übergebenen Steppers (ohne Parameter: aller aktuellen Stepper). |

### Validierung der Steps

Mit Signal Forms wird die Gültigkeit eines Steps über `[luxCompleted]` gesetzt (siehe [1. Signal Forms](#1-signal-forms)).

Bei Reactive Forms (veraltet) muss für jeden Step eine FormGroup vorhanden sein.
Diese wird dann dem LuxStep über das Feld luxStepControl mitgeteilt, außerdem benötigt die LuxStepContent-Komponente ebenfalls einen Verweis auf die FormGroup.

Beispiel (Reactive Forms):

```html
<lux-stepper ...>
  <lux-step [luxStepControl]="formGroup01" ...>
    <lux-step-header> Beispielheader </lux-step-header>
    <lux-step-content [formGroup]="formGroup01">
      ...
      <!-- Hier die Formularelemente eintragen, z.B. lux-input -->
      ...
    </lux-step-content>
  </lux-step>
</lux-stepper>
```

### Konfigurationsoptionen

Standardmäßig werden die Texte der Steps **nicht** in Großbuchstaben angezeigt.

Über die [LUX-Components-Config](config-v22) (`labelConfiguration.allUppercase: true` in `provideLuxComponentsConfig()`) kann festgelegt werden, dass die Texte in Großbuchstaben ausgegeben werden.
Will man die LuxSteps davon ausnehmen, muss der Selektor "lux-step" in `labelConfiguration.notAppliedTo` eingetragen werden.
