import { Component, OnInit, inject } from '@angular/core';
import {
    ILuxDialogPresetConfig,
    LuxDialogService,
    LuxSnackbarService,
    LuxStepperLargeClickEvent,
    LuxStepperLargeStepComponent,
    LuxVetoState
} from '@ihk-gfi/lux-components';

@Component({
  selector: 'app-stepper-large-example-step-veto',
  templateUrl: './stepper-large-example-step-veto.component.html',
  providers: [{ provide: LuxStepperLargeStepComponent, useExisting: StepperLargeExampleStepVetoComponent }]
})
export class StepperLargeExampleStepVetoComponent extends LuxStepperLargeStepComponent implements OnInit {
  private dialogService = inject(LuxDialogService);
  private snackbar = inject(LuxSnackbarService);

  dialogConfig: ILuxDialogPresetConfig = {
    title: 'Lorem ipsum?',
    content:
      'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et\n' +
      '          dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum.',
    disableClose: true,
    width: 'auto',
    height: 'auto',
    panelClass: [],
    confirmAction: {
      label: 'Fortfahren',
      raised: true,
      color: 'warn'
    },
    declineAction: {
      label: 'Abbrechen',
      raised: true
    }
  };

  useVetoFn = false;

  myVetoFn = (stepperEvent: LuxStepperLargeClickEvent) => this.createMyVetoPromis(stepperEvent);
  vetoYesFn = (stepperEvent: LuxStepperLargeClickEvent) => this.createVetoYesPromise(stepperEvent);
  vetoNoFn = (stepperEvent: LuxStepperLargeClickEvent) => this.createVetoNoPromise(stepperEvent);

  ngOnInit(): void {
    this.luxTitle = 'Veto-Schritt';
    this.luxCompleted = true;

    this.luxVetoFn = this.myVetoFn;
  }

  updateVetoFun(useVetoFn: boolean) {
    this.luxVetoFn = useVetoFn ? this.vetoYesFn : this.vetoNoFn;
  }

  createMyVetoPromis(_event: LuxStepperLargeClickEvent): Promise<LuxVetoState> {
    const dialogRef = this.dialogService.open(this.dialogConfig);

    return new Promise((resolve) => {
      dialogRef.dialogDeclined.subscribe(() => {
        console.log('dialogDeclined');
        resolve(LuxVetoState.navigationRejected);
      });

      dialogRef.dialogConfirmed.subscribe(() => {
        console.log('dialogConfirmed');
        resolve(LuxVetoState.navigationAccepted);
      });
    });
  }

  createVetoYesPromise(event: LuxStepperLargeClickEvent): Promise<LuxVetoState> {
    this.logEvent(event);

    return new Promise((resolve) => {
      const dialogRef = this.dialogService.open(this.dialogConfig);

      dialogRef.dialogClosed.subscribe((result: any) => {
        console.log('dialogClosed', result);
        resolve(LuxVetoState.navigationAccepted);
      });

      dialogRef.dialogDeclined.subscribe(() => {
        console.log('dialogDeclined');
        resolve(LuxVetoState.navigationRejected);
      });

      dialogRef.dialogConfirmed.subscribe(() => {
        console.log('dialogConfirmed');
        resolve(LuxVetoState.navigationAccepted);
      });
    });
  }

  createVetoNoPromise(event: LuxStepperLargeClickEvent): Promise<LuxVetoState> {
    this.logEvent(event);

    return Promise.resolve(LuxVetoState.navigationAccepted);
  }

  logEvent(event: LuxStepperLargeClickEvent) {
    console.log(
      `Event 'luxVetoFn': \nAktueller Schritt "${this.luxTitle}" (index = ${event.stepper.steps
        .toArray()
        .findIndex((step) => step === this)} - hier wird das Vetorecht geprüft) \nNächster Schritt wäre "${
        event.newStep.luxTitle
      }" (index = ${event.newIndex})`
    );
  }
}
