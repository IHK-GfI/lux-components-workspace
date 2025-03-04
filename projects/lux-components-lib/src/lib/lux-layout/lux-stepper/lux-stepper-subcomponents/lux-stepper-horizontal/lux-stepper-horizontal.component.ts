import { NgClass, NgTemplateOutlet } from '@angular/common';
import { Component } from '@angular/core';
import { MatStep, MatStepLabel, MatStepper, MatStepperIcon } from '@angular/material/stepper';
import { LuxIconComponent } from '../../../../lux-icon/lux-icon/lux-icon.component';
import { LuxStepperParent } from '../../lux-stepper-model/lux-stepper-parent.class';
import { LuxStepperNavButtonsComponent } from '../lux-stepper-nav-buttons/lux-stepper-nav-buttons.component';

@Component({
  selector: 'lux-stepper-horizontal',
  templateUrl: './lux-stepper-horizontal.component.html',
  imports: [MatStepper, NgClass, MatStep, MatStepLabel, NgTemplateOutlet, MatStepperIcon, LuxStepperNavButtonsComponent, LuxIconComponent]
})
export class LuxStepperHorizontalComponent extends LuxStepperParent {
  constructor() {
    super();
  }
}
