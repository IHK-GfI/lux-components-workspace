import { ChangeDetectionStrategy, Component } from '@angular/core';
import { LuxStepComponent } from '@ihk-gfi/lux-components';

@Component({
  selector: 'app-stepper-external-step-example',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [
    `
      .step-header {
        margin-left: 12px;
      }
    `
  ],
  template: `
    <ng-template #header><span class="step-header">Person</span></ng-template>

    <ng-template #content>
      <h3>Ausgelagerter Step</h3>
      <p>Dieser Step wird als eigene Komponente eingebunden und liefert Header und Content über #header/#content an den Stepper.</p>
    </ng-template>
  `,
  providers: [{ provide: LuxStepComponent, useExisting: StepperExternalStepExampleComponent }]
})
export class StepperExternalStepExampleComponent extends LuxStepComponent {}
