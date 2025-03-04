import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  LuxInputAcComponent,
  LuxStepperLargeClickEvent,
  LuxStepperLargeStepComponent,
  LuxThemePalette,
  LuxToggleAcComponent,
  LuxUtil,
  LuxVetoState
} from 'lux-components-lib';
import { Subscription } from 'rxjs';
import { StepperLargeExampleDataService } from '../stepper-large-example-data.service';
import { StepperLargeExampleErrorMessageBoxComponent } from '../stepper-large-example-error-message-box/stepper-large-example-error-message-box.component';

interface StepperLargePrevButtonDummyForm {
  label: FormControl<string>;
  iconName: FormControl<string | undefined>;
  color: FormControl<LuxThemePalette | undefined>;
  iconShowRight: FormControl<boolean | undefined>;
  alignIconWithLabel: FormControl<boolean | undefined>;
}

@Component({
  selector: 'app-stepper-large-example-step-prev-button',
  templateUrl: './stepper-large-example-step-prev-button.component.html',
  providers: [{ provide: LuxStepperLargeStepComponent, useExisting: StepperLargeExampleStepPrevButtonComponent }],
  imports: [LuxToggleAcComponent, LuxInputAcComponent, ReactiveFormsModule, StepperLargeExampleErrorMessageBoxComponent]
})
export class StepperLargeExampleStepPrevButtonComponent extends LuxStepperLargeStepComponent implements OnInit, OnDestroy {
  dataService = inject(StepperLargeExampleDataService);

  form: FormGroup<StepperLargePrevButtonDummyForm>;
  showErrorMessage = false;

  subscriptions: Subscription[] = [];

  constructor() {
    super();

    this.form = new FormGroup<StepperLargePrevButtonDummyForm>({
      label: new FormControl<string>(this.dataService.prevButtonConfig.label ?? '', { validators: Validators.required, nonNullable: true }),
      iconName: new FormControl<string | undefined>(this.dataService.prevButtonConfig.iconName, { nonNullable: true }),
      color: new FormControl<LuxThemePalette | undefined>(this.dataService.prevButtonConfig.color, { nonNullable: true }),
      iconShowRight: new FormControl<boolean | undefined>(this.dataService.prevButtonConfig.iconShowRight, { nonNullable: true }),
      alignIconWithLabel: new FormControl<boolean | undefined>(this.dataService.prevButtonConfig.alignIconWithLabel, { nonNullable: true })
    });
  }

  ngOnInit(): void {
    this.luxTitle = 'Konfiguration: Zurück-Button';
    this.luxVetoFn = this.createVetoPromise;

    this.form.get('alignIconWithLabel')!.disable();

    this.luxCompleted = this.form.valid;

    this.subscriptions.push(
      this.form.statusChanges.subscribe(() => {
        this.luxCompleted = this.form.valid;
      })
    );
    this.subscriptions.push(
      this.dataService.showErrorMessage.subscribe((value) => {
        this.showErrorMessage = value;
      })
    );
  }

  createVetoPromise(event: LuxStepperLargeClickEvent): Promise<LuxVetoState> {
    return new Promise((resolve) => {
      // Hier kann man prüfen, ob der Step valide ist. Auch das Backend
      // kann aufgerufen werden. Für die Demo gibt es aber kein Backend,
      // deshalb wird hier die setTimeout-Methode verwendet.
      // Hier kann man:
      // - Die Daten des Steps validieren.
      // - Die Daten aus dem Step in seine Datenstruktur übertragen.
      // - Über die resolve-Methode zurückmelden, ob zum nächsten Schritt navigiert werden darf.
      setTimeout(() => {
        if (!event.newStep.luxTouched) {
          // Prüfen, ob das Formular valide ist.
          if (this.form.valid) {
            // Hier werden die Daten aus dem Formular in den Datenservice übertragen.
            this.dataService.prevButtonConfig = this.form.value;

            // Als letztes wird der Step als valide gekennzeichnet.
            this.luxCompleted = true;
          } else {
            // Das Formular ist noch nicht valide und deswegen wird der Step
            // als noch nicht fertig gekennzeichnet.
            this.luxCompleted = false;
            // LuxUtil.showValidationErrors(this.form);
          }
          if (this.dataService.luxStepValidationActive) {
            resolve(this.luxCompleted ? LuxVetoState.navigationAccepted : LuxVetoState.navigationRejected);
          } else {
            resolve(LuxVetoState.navigationAccepted);
          }
        } else {
          // Man darf zu jedem Schritt springen, wenn dieser bereits besucht wurde.
          LuxUtil.showValidationErrors(this.form);
          resolve(LuxVetoState.navigationAccepted);
        }
      }, 250);
    });
  }

  ngOnDestroy() {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }
}
