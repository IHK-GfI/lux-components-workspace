import { Component, EventEmitter, Input, Output } from '@angular/core';
import { LuxButtonComponent } from '../../../../lux-action/lux-button/lux-button.component';
import { ILuxStepperConfiguration } from '../../lux-stepper-model/lux-stepper-configuration.interface';
import { LuxStepComponent } from '../lux-step.component';

@Component({
  selector: 'lux-stepper-nav-buttons',
  templateUrl: './lux-stepper-nav-buttons.component.html',
  imports: [LuxButtonComponent]
})
export class LuxStepperNavButtonsComponent {
  @Output() luxPrevClick = new EventEmitter<void>();
  @Output() luxNextClick = new EventEmitter<void>();
  @Output() luxFinClick = new EventEmitter<void>();

  @Input() luxIndex = -1;
  @Input() luxStep!: LuxStepComponent;
  @Input() luxStepperConfig?: ILuxStepperConfiguration;

  constructor() {}
}
