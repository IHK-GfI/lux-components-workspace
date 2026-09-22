import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { TranslocoPipe } from '@jsverse/transloco';
import { LuxButtonComponent } from '../../../../lux-action/lux-button/lux-button.component';
import { ILuxStepperConfiguration } from '../../lux-stepper-model/lux-stepper-configuration.interface';
import { LuxStepComponent } from '../lux-step.component';

@Component({
  selector: 'lux-stepper-nav-buttons',
  templateUrl: './lux-stepper-nav-buttons.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [LuxButtonComponent, TranslocoPipe]
})
export class LuxStepperNavButtonsComponent {
  readonly luxPrevClick = output<void>();
  readonly luxNextClick = output<void>();
  readonly luxFinClick = output<void>();

  readonly luxIndex = input(-1);
  readonly luxStep = input.required<LuxStepComponent>();
  readonly luxStepperConfig = input<ILuxStepperConfiguration | undefined>();
}
