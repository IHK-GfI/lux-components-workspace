# LUX-Stepper

![Beispielbild LUX-Stepper](https://raw.githubusercontent.com/wiki/IHK-GfI/lux-components/Versions/v15/lux‐stepper-v15-img.png)

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
    - [1. Horizontaler Stepper mit angepassten Buttons](#1-horizontaler-stepper-mit-angepassten-buttons)
    - [2. Horizontaler Stepper mit Buttons im Footer](#2-horizontaler-stepper-mit-buttons-im-footer)
    - [3. Vertikaler Stepper](#3-vertikaler-stepper)
    - [4. Stepper ohne StepControl](#4-stepper-ohne-stepcontrol)
    - [5. Schritt in eigene Komponente auslagern](#5-schritt-in-eigene-komponente-auslagern)
  - [Zusatzinformationen](#zusatzinformationen)
    - [Allgemein](#allgemein-2)
    - [Validierung der Steps](#validierung-der-steps)
    - [Konfigurationsoptionen](#konfigurationsoptionen)

## Overview / API

### Allgemein

| Name     | Beschreibung    |
| -------- | --------------- |
| import   | LuxLayoutModule |
| selector | lux-stepper     |

### @Input

| Name                             | Typ                     | Beschreibung                                                                                                                                                                                                            |
| -------------------------------- | ----------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| luxVerticalStepper               | boolean                 | Definiert ob der Stepper vertikal oder horizontal dargestellt wird.                                                                                                                                                     |
| luxLinear                        | boolean                 | Definiert ob die einzelnen Schritte nur nacheinander abgearbeitet werden können oder ob jeder Step direkt angesteuert werden kann.                                                                                      |
| luxDisabled                      | boolean                 | Definiert ob der Stepper deaktiviert ist oder nicht. Wenn deaktiviert, ist der Stepper leicht ausgegraut.                                                                                                               |
| luxHorizontalStepAnimationActive | boolean                 | Definiert ob die Übergangsanimationen für den horizontalen Stepper aktiviert sind oder nicht. Aktuell noch nicht für den vertikalen Stepper verfügbar.                                                                  |
| luxShowNavigationButtons         | boolean                 | Definiert ob die Navigations-Buttons (Zurück, Weiter, Finish) dargestellt werden sollen oder nicht.                                                                                                                     |
| luxUseCustomIcons                | boolean                 | Definiert ob für die einzelnen Steps eigene Icons verwendet werden sollen oder nicht. Wenn false, dann werden Ziffern für die einzelnen Steps verwendet. Die Icons haben die Größe '2x', diese entspricht dem Wert 2em. |
| luxEditedIconName                | string                  | Definiert das Icon das angezeigt wird wenn ein einzelner Step erfolgreich bearbeitet worden ist.                                                                                                                        |
| luxCurrentStepNumber             | number                  | Definiert den aktiven Step, dadurch lässt sich der Start-Step festlegen, sofern luxLinear auf false gesetzt ist. Das Two-Way-Binding ist mit diesem Attribut möglich.                                                   |
| luxPreviousButtonConfig          | ILuxStepperButtonConfig | Konfigurationsobjekt, welches die Anpassung des Zurück-Buttons regelt. Mögliche Optionen sind im Interface ILuxStepperButtonConfig eingetragen.                                                                         |
| luxNextButtonConfig              | ILuxStepperButtonConfig | Konfigurationsobjekt, welches die Anpassung des Weiter-Buttons regelt. Mögliche Optionen sind im Interface ILuxStepperButtonConfig eingetragen.                                                                         |
| luxFinishButtonConfig            | ILuxStepperButtonConfig | Konfigurationsobjekt, welches die Anpassung des Abschließen-Buttons regelt. Mögliche Optionen sind im Interface ILuxStepperButtonConfig eingetragen.                                                                    |
| luxNumberAlignLeft               | boolean                 | Bestimmt ob der Inhalt in einem number-Input-Feld links- oder rechtsbündig dargestellt wird.                                                                                                                            |

### @Output

| Name                       | Typ                                   | Beschreibung                                                                                                                       |
| -------------------------- | ------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| luxFinishButtonClicked     | EventEmitter \<void>                  | Gibt ein Event aus, sobald der Abschließen-Button angeklickt wurde. Der Button ist nur im letzten Step verfügbar.                  |
| luxStepChanged             | EventEmitter \<StepperSelectionEvent> | Das Event wird immer gefeuert, wenn ein neuer Schritt ausgewählt wird. Die Event-Payload ist vom Typ StepperSelectionEvent.        |
| luxCurrentStepNumberChange | EventEmitter \<number>                | Gibt ein Event mit der aktuellen Step-Nummer aus, ermöglicht das Two-Way-Binding an luxCurrentStepNumber.                          |
| luxStepClicked             | EventEmitter \<number>                | Gibt ein Event aus, sobald ein Step angeklickt wurde.                                                                              |
| luxCheckValidation         | EventEmitter \<number>                | Gibt ein Event aus, wenn neu validiert werden sollte. Z.B. wenn kein Formular verwendet wird, sondern das Property "luxCompleted". |

## Components

### LuxStepComponent

Diese Component entspricht einem einzelnen Step in dem Stepper.

Für die Validierung des Steps benötigt es eine FormGroup, welche über luxStepControl eingebunden wird,
zusätzlich muss die FormGroup aktuell auch dem LuxStepContentComponent zugewiesen werden.

#### Allgemein

| Name     | Beschreibung |
| -------- | ------------ |
| selector | lux-step     |

#### @Input

| Name           | Typ       | Beschreibung                                                                                                                                                             |
| -------------- | --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| luxStepControl | FormGroup | Enthält die FormGroup, die für den aktuellen Step notwendig ist. Alternativ ist es ab 1.7.10 möglich, luxCompleted zu nutzen.                                            |
| luxIconName    | string    | Enthält das Icon, welches für diesen Step angezeigt werden soll. Funktioniert nur, wenn der dazugehörige LuxStepper den Wert für luxUseCustomIcons auf true gesetzt hat. |
| luxOptional    | boolean   | Bestimmt ob dieser Step optional ist. Greift nur, wenn kein luxStepControl gesetzt ist, welches invalid ist.                                                             |
| luxEditable    | boolean   | Bestimmt ob dieser Step wieder angesteuert werden kann, nachdem er bearbeitet und verlassen wurde.                                                                       |
| luxCompleted   | boolean   | Alternative zu luxStepControl, ermöglicht es die Validierung für den Step ohne eine FormGroup zu machen.                                                                 |

### LuxStepHeaderComponent

Über das LuxStepHeaderComponent lässt sich der Titel eines Steps festlegen.

| Name     | Beschreibung    |
| -------- | --------------- |
| selector | lux-step-header |

### LuxStepContentComponent

Das LuxStepContentComponent beinhaltet den eigentlichen Inhalt dieses Steps.

Für die Validierung ist es nötig, diesen Tag ebenfalls mit einer Referenz auf die entsprechende FormGroup zu versehen.

| Name     | Beschreibung     |
| -------- | ---------------- |
| selector | lux-step-content |

## Classes / Interfaces

### ILuxStepperButtonConfig

Objekte können dieses Interface implementieren, um so die einzelnen Steuer-Buttons zu modifizieren.

| Name               | Typ             | Beschreibung                                |
| ------------------ | --------------- | ------------------------------------------- |
| label              | string          | Text des Buttons.                           |
| color              | LuxThemePalette | Farbe des Buttons                           |
| iconName           | string          | Name des Icons, für diesen Button.          |
| alignIconWithLabel | boolean         | Vertikale Anordnung des Icons mit dem Text. |

## Beispiele

### 1. Horizontaler Stepper mit angepassten Buttons

![Beispielbild 01](https://raw.githubusercontent.com/wiki/IHK-GfI/lux-components/Versions/v15/lux‐stepper-v15-img-01.gif)

Ts

```typescript
stepperForm0: FormGroup;
stepperForm1: FormGroup;
stepperForm2: FormGroup;

stepperPreviousButtonConfig: ILuxStepperButtonConfig = {
  label   : 'Zurück'
};

stepperNextButtonConfig: ILuxStepperButtonConfig = {
  label   : 'Weiter',
  color   : 'primary'
};

stepperFinishButtonConfig: ILuxStepperButtonConfig = {
  label: 'Abschließen',
  iconName: 'lux-save',
  color   : 'primary'
};

constructor() {
  this.stepperForm0 = new FormGroup({
    testInput0: new FormControl<string>('', Validators.required)
  });

  this.stepperForm1 = new FormGroup({
    testInput1: new FormControl<string>('', Validators.required)
  });

  this.stepperForm2 = new FormGroup({
    testInput2: new FormControl<string>('', Validators.required)
  });
}
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
    <lux-step-content [formGroup]="stepperForm0">
      <lux-input-ac
        luxControlBinding="testInput0"
        luxLabel="Testinput 0"
      ></lux-input-ac>
    </lux-step-content>
  </lux-step>

  <lux-step [luxStepControl]="stepperForm1">
    <lux-step-header> Testheader 1 </lux-step-header>
    <lux-step-content [formGroup]="stepperForm1">
      <lux-input-ac
        luxControlBinding="testInput1"
        luxLabel="Testinput 1"
      ></lux-input-ac>
    </lux-step-content>
  </lux-step>

  <lux-step [luxStepControl]="stepperForm2">
    <lux-step-header> Testheader 2 </lux-step-header>
    <lux-step-content [formGroup]="stepperForm2">
      <lux-input-ac
        luxControlBinding="testInput2"
        luxLabel="Testinput 2"
      ></lux-input-ac>
    </lux-step-content>
  </lux-step>
</lux-stepper>
```

### 2. Horizontaler Stepper mit Buttons im Footer

![Beispielbild 02](https://raw.githubusercontent.com/wiki/IHK-GfI/lux-components/Versions/v15/lux‐stepper-v15-img-02.png)

Ts

```typescript
@ViewChild('stepper') stepper!: LuxStepperComponent;

btnPrev = LuxAppFooterButtonInfo.generateInfo({ label: 'Zurück', color: undefined, hidden: true, cmd: 'zurueck', alwaysVisible: true,  onClick: () => this.stepperService.previousStep(this.stepper)});
btnNext = LuxAppFooterButtonInfo.generateInfo({ label: 'Weiter', color: 'primary', hidden: false, cmd: 'weiter', alwaysVisible: true, onClick: ()  => this.stepperService.nextStep(this.stepper)});
btnFin = LuxAppFooterButtonInfo.generateInfo({ label: 'Abschließen', color: 'primary', hidden: true, cmd: 'abschliessen', alwaysVisible: true });

stepperForm0: FormGroup;
stepperForm1: FormGroup;
stepperForm2: FormGroup;

constructor(private fb: FormBuilder, private buttonService: LuxAppFooterButtonService, private stepperService: LuxStepperHelperService) {
  this.stepperForm0 = new FormGroup({
    testInput0: new FormControl<string>('', Validators.required)
  });

  this.stepperForm1 = new FormGroup({
    testInput1: new FormControl<string>('', Validators.required)
  });

  this.stepperForm2 = new FormGroup({
    testInput2: new FormControl<string>('', Validators.required)
  });

  this.buttonService.buttonInfos = [
    this.btnPrev,
    this.btnNext,
    this.btnFin
  ];
}

ngOnInit(): void {
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
    <lux-step-content [formGroup]="stepperForm0">
      <lux-input-ac
        luxControlBinding="testInput0"
        luxLabel="Testinput 0"
      ></lux-input-ac>
    </lux-step-content>
  </lux-step>

  <lux-step [luxStepControl]="stepperForm1" luxIconName="lux-money-graph">
    <lux-step-header> Testheader 2 </lux-step-header>
    <lux-step-content [formGroup]="stepperForm1">
      <lux-input-ac
        luxControlBinding="testInput1"
        luxLabel="Testinput 1"
      ></lux-input-ac>
    </lux-step-content>
  </lux-step>

  <lux-step
    [luxStepControl]="stepperForm2"
    luxIconName="lux-money-currency-euro"
  >
    <lux-step-header> Testheader 3 </lux-step-header>
    <lux-step-content [formGroup]="stepperForm2">
      <lux-input-ac
        luxControlBinding="testInput2"
        luxLabel="Testinput 2"
      ></lux-input-ac>
    </lux-step-content>
  </lux-step>
</lux-stepper>
```

### 3. Vertikaler Stepper

![Beispielbild 03](https://raw.githubusercontent.com/wiki/IHK-GfI/lux-components/Versions/v15/lux‐stepper-v15-img-03.png)

Ts

```typescript
stepperForm0: FormGroup;
stepperForm1: FormGroup;
stepperForm2: FormGroup;

constructor() {
  this.stepperForm0 = new FormGroup({
    testInput0: new FormControl<string>('', Validators.required)
  });

  this.stepperForm1 = new FormGroup({
    testInput1: new FormControl<string>('', Validators.required)
  });

  this.stepperForm2 = new FormGroup({
    testInput2: new FormControl<string>('', Validators.required)
  });
}
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
    <lux-step-content [formGroup]="stepperForm0">
      <lux-input-ac
        luxControlBinding="testInput0"
        luxLabel="Testinput 0"
      ></lux-input-ac>
    </lux-step-content>
  </lux-step>

  <lux-step [luxStepControl]="stepperForm1">
    <lux-step-header> Testheader 2 </lux-step-header>
    <lux-step-content [formGroup]="stepperForm1">
      <lux-input-ac
        luxControlBinding="testInput1"
        luxLabel="Testinput 1"
      ></lux-input-ac>
    </lux-step-content>
  </lux-step>

  <lux-step [luxStepControl]="stepperForm2">
    <lux-step-header> Testheader 3 </lux-step-header>
    <lux-step-content [formGroup]="stepperForm2">
      <lux-input-ac
        luxControlBinding="testInput2"
        luxLabel="Testinput 2"
      ></lux-input-ac>
    </lux-step-content>
  </lux-step>
</lux-stepper>
```

### 4. Stepper ohne StepControl

Html

```html
<lux-stepper [luxLinear]="true">
  <lux-step [luxCompleted]="input.luxValue?.length > 0">
    <lux-step-header> Testheader 1 </lux-step-header>
    <lux-step-content>
      <lux-input luxLabel="Testinput 0" #input></lux-input>
    </lux-step-content>
  </lux-step>

  <lux-step [luxCompleted]="true">
    <lux-step-header> Testheader 2 </lux-step-header>
    <lux-step-content>
      <lux-input luxLabel="Testinput 1"></lux-input>
    </lux-step-content>
  </lux-step>
</lux-stepper>
```

### 5. Schritt in eigene Komponente auslagern

In diesem Beispiel wurde der erste Stepperschritt in die Komponente "lux-step-person" ausgelagert.

Ts - Stepper

```typescript
@Component({
  selector: "app-stepper-example",
  templateUrl: "./stepper-example.component.html",
  styleUrls: ["./stepper-example.component.scss"],
})
export class StepperExampleComponent {
  stepperForm: FormGroup;

  constructor() {
    this.stepperForm = new FormGroup({
      street: new FormControl<string>("", Validators.required),
      number: new FormControl<string>(""),
    });
  }
}
```

Html - Stepper

```html
<lux-stepper [luxLinear]="true">
  <lux-step-person></lux-step-person>

  <lux-step [luxStepControl]="stepperForm">
    <lux-step-header> Adresse </lux-step-header>
    <lux-step-content [formGroup]="stepperForm">
      <div fxFlex="50" fxFlex.lt-md="100">
        <lux-layout-form-row>
          <lux-input-ac
            luxLabel="Straße"
            luxName="street"
            luxControlBinding="street"
            *luxLayoutRowItem="{colSpan: 3}"
          ></lux-input-ac>
          <lux-input-ac
            luxLabel="Nummer"
            luxName="number"
            luxControlBinding="number"
            *luxLayoutRowItem="{}"
          ></lux-input-ac>
        </lux-layout-form-row>
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

Ts - lux-step-person

```typescript
@Component({
  selector: "lux-step-person",
  templateUrl: "./step-person.component.html",
  providers: [{ provide: LuxStepComponent, useExisting: StepPersonComponent }],
})
export class StepPersonComponent extends LuxStepComponent implements OnInit {
  stepperForm!: FormGroup;

  constructor() {
    super();
  }

  ngOnInit(): void {
    this.stepperForm = new FormGroup({
      firstname: new FormControl<string>("", Validators.required),
      lastname: new FormControl<string>("", Validators.required),
    });

    // Stepper-Properties setzen
    this.luxOptional = false;

    // 1. Variante: Formular legt fest, ob man zum nächsten Schritt darf.
    this.luxStepControl = this.stepperForm;

    // 2. Variante: Wert von luxCompleted legt fest, ob man zum nächsten Schritt darf.
    // this.luxCompleted = false;
    // this.valueSubscription = this.stepperForm.valueChanges.subscribe(() =>  {
    //   this.luxCompleted = this.stepperForm.valid && andereTolleBedingung;
    // });
  }
}
```

Html - lux-step-person

```html
<ng-template #header>Person</ng-template>

<ng-template #content>
  <div fxFlex="50" fxFlex.lt-md="100" [formGroup]="stepperForm">
    <lux-layout-form-row>
      <lux-input-ac
        luxLabel="Vorname"
        luxName="firstname"
        luxControlBinding="firstname"
        *luxLayoutRowItem="{}"
      ></lux-input-ac>
    </lux-layout-form-row>
    <lux-layout-form-row>
      <lux-input-ac
        luxLabel="Nachname"
        luxName="lastname"
        luxControlBinding="lastname"
        *luxLayoutRowItem="{}"
      ></lux-input-ac>
    </lux-layout-form-row>
  </div>
</ng-template>
```

## Zusatzinformationen

### Allgemein

Komponente zur Darstellung von einzelnen Schritten in einer linearen/non-linearen Reihenfolge. Erwartet für jeden einzelnen Schritt eine eigene FormGroup.

Besteht aus den Komponenten LuxStepper und LuxStep, der LuxStep wiederum besteht aus dem LuxStepHeader und dem LuxStepContent.
Die Komponenten LuxStepHeader und LuxStepContent bestehen lediglich aus dem Selektor und dienen der Template-Übertragung zum LuxStep hin.

Mithilfe des LuxStepperHelperService können die nextStep- und previousStep-Funktionen eines bestimmten Steppers bzw. falls kein spezieller Stepper definiert ist aller aktuellen Stepper aufgerufen werden.
Das ist besonders für ausgelagerte Navigation interessant (siehe Beispiel 2).

### Validierung der Steps

Damit die einzelnen LuxSteps eine Validierung machen können, muss für jeden Step eine FormGroup vorhanden sein.
Diese wird dann dem LuxStep über das Feld luxStepControl mitgeteilt, außerdem benötigt die LuxStepContent-Komponente ebenfalls einen Verweis auf die FormGroup.

Beispiel:

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

Durch Nutzung der [LUX-Components-Config](config-v15) kann für die LuxStepComponent bestimmt werden, dass der Text in den LuxStepComponents immer in Großbuchstaben ausgegeben wird.
Will man die LuxSteps als Ausnahmen für die Ausgabe in Großbuchstaben hinzufügen, muss der Selektor "lux-step" dem Config-Module übergeben werden.

Standardmäßig werden die Texte der Steps immer in Großbuchstaben angezeigt.
