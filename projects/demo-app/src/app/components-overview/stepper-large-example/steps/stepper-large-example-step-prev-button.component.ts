import { Component, OnDestroy, OnInit, inject, ChangeDetectionStrategy } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  LuxInputComponent,
  LuxStepperLargeClickEvent,
  LuxStepperLargeStepComponent,
  LuxThemePalette,
  LuxToggleComponent,
  LuxUtil,
  LuxVetoState
} from '@ihk-gfi/lux-components';
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
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [LuxToggleComponent, LuxInputComponent, ReactiveFormsModule, StepperLargeExampleErrorMessageBoxComponent]
})
export class StepperLargeExampleStepPrevButtonComponent extends LuxStepperLargeStepComponent implements OnInit, OnDestroy {
  form: FormGroup<StepperLargePrevButtonDummyForm>;
  subscriptions: Subscription[] = [];

  private dataService = inject(StepperLargeExampleDataService);

  constructor() {
    super();

    const prevButtonConfig = this.dataService.prevButtonConfig();
    this.form = new FormGroup<StepperLargePrevButtonDummyForm>({
      label: new FormControl<string>(prevButtonConfig.label ? prevButtonConfig.label : 'Zurück', {
        validators: Validators.required,
        nonNullable: true
      }),
      iconName: new FormControl<string | undefined>(prevButtonConfig.iconName, { nonNullable: true }),
      color: new FormControl<LuxThemePalette | undefined>(prevButtonConfig.color, { nonNullable: true }),
      iconShowRight: new FormControl<boolean | undefined>(prevButtonConfig.iconShowRight, { nonNullable: true }),
      alignIconWithLabel: new FormControl<boolean | undefined>(prevButtonConfig.alignIconWithLabel, { nonNullable: true })
    });
  }

  ngOnInit(): void {
    this.luxTitle.set('Konfiguration: Zurück-Button');
    this.luxVetoFn.set(this.createVetoPromise.bind(this));

    this.form.get('alignIconWithLabel')!.disable();

    this.luxCompleted.set(this.form.valid);

    this.subscriptions.push(
      this.form.statusChanges.subscribe(() => {
        this.luxCompleted.set(this.form.valid);
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
        if (!event.newStep.luxTouched()) {
          // Prüfen, ob das Formular valide ist.
          if (this.form.valid) {
            // Hier werden die Daten aus dem Formular in den Datenservice übertragen.
            this.dataService.prevButtonConfig.set(this.form.value);

            // Als letztes wird der Step als valide gekennzeichnet.
            this.luxCompleted.set(true);
          } else {
            // Das Formular ist noch nicht valide und deswegen wird der Step
            // als noch nicht fertig gekennzeichnet.
            this.luxCompleted.set(false);
            // LuxUtil.showValidationErrors(this.form);
          }
          if (this.dataService.luxStepValidationActive) {
            resolve(this.luxCompleted() ? LuxVetoState.navigationAccepted : LuxVetoState.navigationRejected);
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
