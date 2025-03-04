# LUX-Stepper-Large

Desktop:

![Beispielbild LUX-Stepper-Large](https://raw.githubusercontent.com/wiki/IHK-GfI/lux-components/Versions/v16/lux‐stepper‐large-v16-img.png)

Mobile:

![Beispielbild LUX-Stepper-Large mobile 01](https://raw.githubusercontent.com/wiki/IHK-GfI/lux-components/Versions/v16/lux‐stepper‐large-v16-img-mobile-01.png)
![Beispielbild LUX-Stepper-Large mobile 02](https://raw.githubusercontent.com/wiki/IHK-GfI/lux-components/Versions/v16/lux‐stepper‐large-v16-img-mobile-02.png)

- [LUX-Stepper-Large](#lux-stepper-large)
  - [Overview / API](#overview--api)
    - [Allgemein](#allgemein)
    - [@Input](#input)
    - [@Output](#output)
  - [Components](#components)
    - [LuxStepperLargeStepComponent](#luxstepperlargestepcomponent)
      - [Allgemein](#allgemein-1)
      - [@Input](#input-1)
    - [@ViewChild](#viewchild)
  - [Classes / Interfaces](#classes--interfaces)
    - [LuxVetoState (enum)](#luxvetostate-enum)
    - [ILuxStepperLargeStep](#iluxstepperlargestep)
    - [LuxStepperLargeButtonInfo](#luxstepperlargebuttoninfo)
    - [LuxStepperLargeClickEvent](#luxstepperlargeclickevent)
    - [LuxStepperLargeSelectionEvent](#luxstepperlargeselectionevent)
  - [Beispiele](#beispiele)
    - [1. Stepper mit einem Step als ausgelagerte Komponente](#1-stepper-mit-einem-step-als-ausgelagerte-komponente)

## Overview / API

Dieser Stepper ist auch für viele Schritte geeignet.

### Allgemein

| Name     | Beschreibung      |
| -------- | ----------------- |
| import   | LuxLayoutModule   |
| selector | lux-stepper-large |

### @Input

| Name                    | Typ                       | Beschreibung                                                                                                                                                                                                                                 |
| ----------------------- | ------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| luxPrevButtonConfig     | LuxStepperLargeButtonInfo | Konfigurationsobjekt des Zurück-Buttons.                                                                                                                                                                                                     |
| luxNextButtonConfig     | LuxStepperLargeButtonInfo | Konfigurationsobjekt des Weiter-Buttons.                                                                                                                                                                                                     |
| luxFinButtonConfig      | LuxStepperLargeButtonInfo | Konfigurationsobjekt des Abschließen-Buttons.                                                                                                                                                                                                |
| luxCurrentStepNumber    | number                    | Der Index des aktuellen Schritts (0..n). (Two-Way-Binding möglich)                                                                                                                                                                           |
| luxStepValidationActive | boolean                   | Über diese Property kann die Validierung der Schritte (de-)aktiviert werden. Wenn die Validierung deaktiviert wird, dann ist er Weiter-Button immer aktiv und nur die Veto-Funktionen können das Navigieren zum nächsten Schritt verhindern. |

### @Output

| Name                       | Typ                                           | Beschreibung                                                                                  |
| -------------------------- | --------------------------------------------- | --------------------------------------------------------------------------------------------- |
| luxStepperFinished         | EventEmitter \<void>                          | Das Event wird gefeuert, wenn der Stepper erfolgreich abgeschlossen wurde.                    |
| luxStepChanged             | EventEmitter \<LuxStepperLargeSelectionEvent> | Das Event wird gefeuert, wenn der Schritt gewechselt wird.                                    |
| luxCurrentStepNumberChange | EventEmitter \<number\>                       | Das Event wird gefeuert, wenn der Schritt gewechselt wird und ermöglicht das Two-Way-Binding. |

## Components

### LuxStepperLargeStepComponent

Diese Component entspricht einem einzelnen Step im Stepper.

#### Allgemein

| Name     | Beschreibung           |
| -------- | ---------------------- |
| selector | lux-stepper-large-step |

#### @Input

| Name         | Typ                                                                | Beschreibung                                                                                                                                                                                                                                                                        |
| ------------ | ------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| luxTitle     | string                                                             | Der Titel des Schritts, wird z.B. in der Navigationsleiste angezeigt.                                                                                                                                                                                                               |
| luxTouched   | boolean                                                            | Gibt an, ob der Schritt bereits besucht wurde.                                                                                                                                                                                                                                      |
| luxCompleted | boolean                                                            | Gibt an, ob der Schritt erfolgreich abgeschlossen wurde.                                                                                                                                                                                                                            |
| luxVetoFn    | (clickEvent: LuxStepperLargeClickEvent) => Promise\<LuxVetoState\> | Diese Funktion wird aufgerufen, wenn versucht wird, den Schritt zu wechseln. D.h. hier kann zusätzliche Logik (Validierung im Backend,...) ausgeführt werden. Als Rückgabewert liefert das Promise `LuxVetoState.navigationAccepted` oder `LuxVetoState.navigationRejected` zurück. |

### @ViewChild

| Name            | ng-Template-Id | Typ                | Beschreibung               |
| --------------- | -------------- | ------------------ | -------------------------- |
| contentTemplate | #content       | TemplateRef\<any\> | Enthält den Schrittinhalt. |

## Classes / Interfaces

### LuxVetoState (enum)

| Name               | Wert | Typ       | Beschreibung                                                                                                 |
| ------------------ | ---- | --------- | ------------------------------------------------------------------------------------------------------------ |
| navigationAccepted | 0    | enum-Wert | Dieser Wert wird verwendet, wenn zum nächsten Schritt navigiert werden darf. (siehe `luxVetoFn`)             |
| navigationRejected | 1    | enum-Wert | Dieser Wert wird verwendet, wenn _**nicht**_ zum nächsten Schritt navigiert werden darf. (siehe `luxVetoFn`) |

### ILuxStepperLargeStep

| Name            | Typ                                                                     | Beschreibung                                                                                                                                                                                                                                                                        |
| --------------- | ----------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| luxTitle        | string                                                                  | Der Titel des Schritts, wird z.B. in der Navigationsleiste angezeigt.                                                                                                                                                                                                               |
| luxTouched      | boolean                                                                 | Gibt an, ob der Schritt bereits besucht wurde.                                                                                                                                                                                                                                      |
| luxCompleted    | boolean                                                                 | Gibt an, ob der Schritt erfolgreich abgeschlossen wurde.                                                                                                                                                                                                                            |
| luxDisabled     | boolean                                                                 | Gibt an, ob der Schritt erfolgreich abgeschlossen wurde.                                                                                                                                                                                                                            |
| luxVetoFn       | (clickEvent:&nbsp;LuxStepperLargeClickEvent) => Promise\<LuxVetoState\> | Diese Funktion wird aufgerufen, wenn versucht wird, den Schritt zu wechseln. D.h. hier kann zusätzliche Logik (Validierung im Backend,...) ausgeführt werden. Als Rückgabewert liefert das Promise `LuxVetoState.navigationAccepted` oder `LuxVetoState.navigationRejected` zurück. |
| contentTemplate | TemplateRef\<any\>                                                      | Enthält eine `TemplateRef` auf den Inhalt.                                                                                                                                                                                                                                          |

### LuxStepperLargeButtonInfo

| Name               | Typ                                 | Beschreibung                                                    |
| ------------------ | ----------------------------------- | --------------------------------------------------------------- |
| label              | string                              | Die Bezeichnung des Buttons.                                    |
| color              | Siehe [lux-button](lux‐button-v16). | Siehe [lux-button](lux‐button-v16).                             |
| iconName           | string                              | Der Iconname.                                                   |
| iconShowRight      | boolean                             | Gibt an, ob das Icon rechts von der Bezeichnung angezeigt wird. |
| alignIconWithLabel | boolean                             | Gibt an, ob das Icon anhand der Bezeichnung ausgerichtet wird.  |

Es gibt die folgenden Konstanten für die Standardkonfigurationen:

- LUX_STEPPER_LARGE_DEFAULT_PREV_BTN_CONF
- LUX_STEPPER_LARGE_DEFAULT_NEXT_BTN_CONF
- LUX_STEPPER_LARGE_DEFAULT_FIN_BTN_CONF

### LuxStepperLargeClickEvent

| Name     | Typ                                 | Beschreibung                                                                                |
| -------- | ----------------------------------- | ------------------------------------------------------------------------------------------- |
| stepper  | LuxStepperLargeComponent            | Die Stepperkomponente.                                                                      |
| newIndex | number                              | Der neue Index zu dem navigiert wird, wenn kein Veto eingelegt wird. (Siehe `luxVetoFn`).   |
| newStep  | ILuxStepperLargeStep                | Der neue Schritt zu dem navigiert wird, wenn kein Veto eingelegt wird. (Siehe `luxVetoFn`). |
| newStep  | LuxStepperLargeClickEventSourceType | Gibt die Quelle des Events an.                                                              |

### LuxStepperLargeSelectionEvent

| Name         | Typ                      | Beschreibung                       |
| ------------ | ------------------------ | ---------------------------------- |
| stepper      | LuxStepperLargeComponent | Die Stepperkomponente.             |
| currentIndex | number                   | Der Index des aktuellen Schritts.  |
| currentStep  | ILuxStepperLargeStep     | Der aktuelle Schritt.              |
| prevIndex    | number                   | Der Index des vorherigen Schritts. |
| prevStep     | ILuxStepperLargeStep     | Der vorherige Schritt.             |

## Beispiele

### 1. Stepper mit einem Step als ausgelagerte Komponente

![Beispielbild 01](https://raw.githubusercontent.com/wiki/IHK-GfI/lux-components/Versions/v16/lux‐stepper‐large-v16-img-01.png)

Ts: ExampleComponent

```typescript
export class ExampleComponent implements OnInit, OnDestroy {
  infoCompleted = false;

  personForm: FormGroup;
  personCompleted = false;

  consentForm: FormGroup;
  consentCompleted = false;

  subscriptions: Subscription[] = [];

  constructor(
    private snackbar: LuxSnackbarService,
    public dataService: ExampleDataService,
    private router: Router,
  ) {
    this.personForm = new FormGroup({
      givenName: new FormControl<string>("", Validators.required),
      familyName: new FormControl<string>("", Validators.required),
    });

    this.subscriptions.push(
      this.personForm.statusChanges.subscribe(() => {
        this.personCompleted = this.personForm.valid;

        if (this.personCompleted) {
          this.dataService.data.person = this.personForm.value;
        }
      }),
    );

    this.consentForm = new FormGroup({
      consent: new FormControl<string>("", Validators.required),
    });
  }

  onFinish() {
    // In dieser Demo gibt es kein Backend und deshalb wird eine
    // Snackbar angezeigt und die Seite neu geladen, damit sich der
    // Stepper zurücksetzt.
    const snackbarDuration = 5000;

    this.snackbar.open(snackbarDuration, {
      iconName: "lux-info",
      iconSize: "2x",
      iconColor: "green",
      text: "Stepper erfolgreich abgeschlossen!",
    });

    setTimeout(() => {
      let currentUrl = this.router.url;
      this.router.routeReuseStrategy.shouldReuseRoute = () => false;
      this.router.onSameUrlNavigation = "reload";
      this.router.navigate([currentUrl]);
    }, snackbarDuration);
  }

  ngOnInit() {
    this.subscriptions.push(
      this.consentForm.statusChanges.subscribe(() => {
        this.consentCompleted = this.consentForm.valid;

        if (this.consentCompleted) {
          this.dataService.consent = this.consentForm.value;
        }
      }),
    );

    // Damit der Schritt nicht direkt seinen Fertig-Haken anzeigt,
    // wurde hier eine kleine Verzögerung eingebaut.
    setTimeout(() => {
      this.infoCompleted = true;
    }, 3000);
  }

  ngOnDestroy() {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }
}
```

Html: ExampleComponent

```html
<div class="app-stepper-large-container">
  <lux-stepper-large (luxStepperFinished)="onFinish()">
    <lux-stepper-large-step
      luxTitle="Allgemeine Information"
      [luxCompleted]="infoCompleted"
    >
      <h2 class="example-lux-stepper-large-h2">Allgemeine Information</h2>
      <p>
        Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy
        eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam
        voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet
        clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit
        amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam
        nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat,
        sed diam voluptua. At vero eos et accusam et justo duo dolores et ea
        rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem
        ipsum dolor sit amet.
      </p>
      <p>
        Duis autem vel eum iriure dolor in hendrerit in vulputate velit esse
        molestie consequat, vel illum dolore eu feugiat nulla facilisis at vero
        eros et accumsan et iusto odio dignissim qui blandit praesent luptatum
        zzril delenit augue duis dolore te feugait nulla facilisi. Lorem ipsum
        dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh
        euismod tincidunt ut laoreet dolore magna aliquam erat volutpat.
      </p>
      <p>Nach 3 Sekunden wird der Weiter-Button aktiviert.</p>
    </lux-stepper-large-step>

    <lux-stepper-large-step
      luxTitle="Angaben zur Person"
      [formGroup]="personForm"
      [luxCompleted]="personCompleted"
    >
      <h2 class="example-lux-stepper-large-h2">Angaben zur Person</h2>
      <p>
        Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy
        eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam
        voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet
        clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit
        amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam
        nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat,
        sed diam voluptua. At vero eos et accusam et justo duo dolores et ea
        rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem
        ipsum dolor sit amet.
      </p>
      <p>
        Duis autem vel eum iriure dolor in hendrerit in vulputate velit esse
        molestie consequat, vel illum dolore eu feugiat nulla facilisis at vero
        eros et accumsan et iusto odio dignissim qui blandit praesent luptatum
        zzril delenit augue duis dolore te feugait nulla facilisi. Lorem ipsum
        dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh
        euismod tincidunt ut laoreet dolore magna aliquam erat volutpat.
      </p>
      <div class="lux-flex lux-gap-4">
        <lux-input-ac
          luxLabel="Vorname"
          luxName="given-name"
          luxControlBinding="givenName"
        ></lux-input-ac>
        <lux-input-ac
          luxLabel="Nachname"
          luxName="family-name"
          luxControlBinding="familyName"
        ></lux-input-ac>
      </div>
    </lux-stepper-large-step>

    <app-example-step></app-example-step>

    <lux-stepper-large-step
      luxTitle="Einwilligung"
      [formGroup]="consentForm"
      [luxCompleted]="consentCompleted"
    >
      <h2>Einwilligung</h2>
      <p>
        Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy
        eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam
        voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet
        clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit
        amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam
        nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat,
        sed diam voluptua. At vero eos et accusam et justo duo dolores et ea
        rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem
        ipsum dolor sit amet.
      </p>
      <p>
        Duis autem vel eum iriure dolor in hendrerit in vulputate velit esse
        molestie consequat, vel illum dolore eu feugiat nulla facilisis at vero
        eros et accumsan et iusto odio dignissim qui blandit praesent luptatum
        zzril delenit augue duis dolore te feugait nulla facilisi. Lorem ipsum
        dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh
        euismod tincidunt ut laoreet dolore magna aliquam erat volutpat.
      </p>
      <lux-toggle-ac
        luxLabel="Hier mit stimme ich den Bedingungen zu"
        luxControlBinding="consent"
      ></lux-toggle-ac>
    </lux-stepper-large-step>
    <lux-stepper-large-step luxTitle="Zusammenfassung" [luxCompleted]="true">
      <h2>Zusammenfassung</h2>
      <p>
        Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy
        eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam
        voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet
        clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit
        amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam
        nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat,
        sed diam voluptua. At vero eos et accusam et justo duo dolores et ea
        rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem
        ipsum dolor sit amet.
      </p>
      <p>In dieser Demo werden die Daten einfach ausgegeben:</p>
      <pre>{{ dataService.data | json }}</pre>
    </lux-stepper-large-step>
  </lux-stepper-large>
</div>
```

TS: ExampleDataService

```typescript
import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root",
})
export class ExampleDataService {
  data = {
    person: { givenName: "", familyName: "" },
    address: { street: "", number: "", city: "" },
  };
  consent = false;

  constructor() {}
}
```

TS: ExampleStepComponent

```typescript
@Component({
  selector: "app-example-step",
  templateUrl: "./example-step.component.html",
  providers: [
    {
      provide: LuxStepperLargeStepComponent,
      useExisting: ExampleStepComponent,
    },
  ],
})
export class ExampleStepComponent
  extends LuxStepperLargeStepComponent
  implements OnInit, OnDestroy
{
  initVetoMessage = true;
  showVetoMessage = false;
  messages: ILuxMessage[] = [
    {
      text: "Beim ersten Klick auf den Weiter-Button wird in dieser Demo ein Veto simuliert.",
      iconName: "lux-exclamation-mark",
      color: "red",
    },
  ];

  form: FormGroup;

  subscriptions: Subscription[] = [];

  constructor(public dataService: ExampleDataService) {
    super();

    this.form = new FormGroup({
      street: new FormControl<string>("", Validators.required),
      number: new FormControl<string>("", Validators.required),
      city: new FormControl<string>("", Validators.required),
    });

    this.luxCompleted = this.form.valid;

    this.subscriptions.push(
      this.form.statusChanges.subscribe(() => {
        this.luxCompleted = this.form.valid;
      }),
    );
  }

  ngOnInit(): void {
    this.luxTitle = "Angaben zur Adresse";
    this.luxVetoFn = this.createVetoPromise;
  }

  createVetoPromise(event: LuxStepperLargeClickEvent): Promise<LuxVetoState> {
    const component = this;

    return new Promise(function (resolve, reject) {
      // Hier kann man prüfen, ob der Step valide ist. Auch das Backend
      // kann aufgerufen werden. Für die Demo gibt es aber kein Backend,
      // deshalb wird hier die setTimeout-Methode verwendet.
      // Hier kann man:
      // - Die Daten des Steps validieren.
      // - Die Daten aus dem Step in seine Datenstruktur übertragen.
      // - Über die resolve-Methode zurückmelden, ob zum nächsten Schritt navigiert werden darf.
      setTimeout(() => {
        // Prüfen, ob das Formular valide ist.
        if (component.form.valid) {
          // Hier werden die Daten aus dem Formular in den Datenservice übertragen.
          component.dataService.data.address = component.form.value;

          // Als letztes wird der Step als valide gekennzeichnet.
          component.luxCompleted = true;
        } else {
          // Das Formular ist noch nicht valide und deswegen wird der Step
          // als noch nicht fertig gekennzeichnet.
          component.luxCompleted = false;
        }

        if (component.initVetoMessage) {
          component.showVetoMessage = true;
          component.initVetoMessage = false;

          resolve(LuxVetoState.navigationRejected);
        } else {
          resolve(
            component.luxCompleted
              ? LuxVetoState.navigationAccepted
              : LuxVetoState.navigationRejected,
          );
        }
      }, 250);
    });
  }

  hideVetoMessage() {
    this.showVetoMessage = false;
  }

  ngOnDestroy() {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }
}
```

Html: ExampleStepComponent

```html
<ng-template #content>
  <ng-container [formGroup]="form">
    <h2>Angaben zur Adresse</h2>
    <p>
      Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy
      eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam
      voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet
      clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit
      amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam
      nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed
      diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum.
      Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor
      sit amet.
    </p>
    <div class="lux-flex lux-gap-4">
      <lux-input-ac
        luxLabel="Straße"
        luxName="street"
        luxControlBinding="street"
      ></lux-input-ac>
      <lux-input-ac
        luxLabel="Nummer"
        luxName="streetnumber"
        luxControlBinding="number"
      ></lux-input-ac>
      <div></div>
    </div>
    <div class="lux-flex lux-gap-4">
      <lux-input-ac
        luxLabel="Stadt"
        luxName="city"
        luxControlBinding="city"
      ></lux-input-ac>
      <div></div>
      <div></div>
    </div>

    <lux-message-box
      [luxMessages]="messages"
      *ngIf="showVetoMessage"
      (luxMessageBoxClosed)="hideVetoMessage()"
    ></lux-message-box>
  </ng-container>
</ng-template>
```
