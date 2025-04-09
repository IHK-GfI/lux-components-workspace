import { JsonPipe, NgClass, NgStyle } from '@angular/common';
import { Component, ViewChild, inject } from '@angular/core';
import { Router } from '@angular/router';
import {
    LuxSelectAcComponent,
    LuxSnackbarService,
    LuxStepperLargeComponent,
    LuxStepperLargeSelectionEvent,
    LuxStepperLargeStepComponent,
    LuxThemeService,
    LuxToggleAcComponent
} from '@ihk-gfi/lux-components';
import { StepperLargeExampleDataService } from './stepper-large-example-data.service';
import { StepperLargeExampleErrorMessageBoxComponent } from './stepper-large-example-error-message-box/stepper-large-example-error-message-box.component';
import { StepperLargeExampleStepFinButtonComponent } from './steps/stepper-large-example-step-fin-button.component';
import { StepperLargeExampleStepNextButtonComponent } from './steps/stepper-large-example-step-next-button.component';
import { StepperLargeExampleStepPrevButtonComponent } from './steps/stepper-large-example-step-prev-button.component';
import { StepperLargeExampleStepVetoComponent } from './steps/stepper-large-example-step-veto.component';
import { StepperLargeExternStepExampleComponent } from './steps/stepper-large-extern-step-example.component';

@Component({
  selector: 'lux-stepper-large-example',
  templateUrl: './stepper-large-example.component.html',
  styleUrls: ['./stepper-large-example.component.scss'],
  imports: [
    LuxStepperLargeStepComponent,
    LuxStepperLargeComponent,
    LuxToggleAcComponent,
    LuxSelectAcComponent,
    NgStyle,
    NgClass,
    StepperLargeExampleStepPrevButtonComponent,
    StepperLargeExampleStepNextButtonComponent,
    StepperLargeExampleStepFinButtonComponent,
    StepperLargeExampleStepVetoComponent,
    StepperLargeExternStepExampleComponent,
    JsonPipe,
    StepperLargeExampleErrorMessageBoxComponent
  ]
})
export class StepperLargeExampleComponent {
  dataService = inject(StepperLargeExampleDataService);
  private router = inject(Router);
  private snackbar = inject(LuxSnackbarService);
  private themeService = inject(LuxThemeService);

  @ViewChild(LuxStepperLargeComponent) stepper!: LuxStepperLargeComponent;
  @ViewChild('requiredCheck') toggle!: LuxToggleAcComponent;

  allowed = false;
  stepValidationActive = true;
  currentStepIndex = 0;
  options: any[] = ['100%', '800px', '1000px', '1200px'];
  maxWidth = this.options[0];
  completed = true;
  theme = '';
  luxA11YMode = false;
  showError = false;

  constructor() {
    this.theme = this.themeService.getTheme().name;
  }

  onStepChanged(event: LuxStepperLargeSelectionEvent) {
    console.log(
      `Event 'luxStepChanged': Von \nSchritt "${event.prevStep.luxTitle}" (index = ${event.prevIndex}) nach \nSchritt "${event.currentStep.luxTitle}" (index = ${event.currentIndex})`
    );
    console.log(`Stepper-Index': ${event.stepper.luxCurrentStepNumber}`);
    if (this.currentStepIndex == 1) {
      this.dataService.luxStepValidationActive = this.stepValidationActive;
    }
    this.dataService.showErrorMessage.next(false);
  }

  onFinish() {
    const snackbarDuration = 5000;

    this.snackbar.open(snackbarDuration, {
      iconName: 'lux-info',
      iconSize: '2x',
      iconColor: 'green',
      text: 'Stepper erfolgreich abgeschlossen!'
    });

    setTimeout(() => {
      const currentUrl = this.router.url;
      this.router.routeReuseStrategy.shouldReuseRoute = () => false;
      this.router.onSameUrlNavigation = 'reload';
      this.router.navigate([currentUrl]);
    }, snackbarDuration);
  }

  onStepNotComplete() {
    this.toggle.formControl.markAsTouched();
    this.showError = true;

    this.dataService.showErrorMessage.next(true);
  }
}
