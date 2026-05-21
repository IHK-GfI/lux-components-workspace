import { LuxStepComponent } from '../lux-stepper-subcomponents/lux-step.component';
import { ILuxStepperButtonConfig } from './lux-stepper-button-config.interface';

/**
 * Enthält die für den LuxStepper (und damit für den horizontalen und vertikalen Stepper) verfügbaren
 * Input-Properties.
 */
export interface ILuxStepperConfiguration {
  luxCurrentStepNumber?: number;
  luxUseCustomIcons?: boolean;
  luxEditedIconName?: string;
  luxVerticalStepper?: boolean;
  luxLinear?: boolean;
  luxDisabled?: boolean;
  luxShowNavigationButtons?: boolean;
  luxHorizontalStepAnimationActive?: boolean;
  luxPreviousButtonConfig?: ILuxStepperButtonConfig;
  luxNextButtonConfig?: ILuxStepperButtonConfig;
  luxFinishButtonConfig?: ILuxStepperButtonConfig;
  luxSteps?: LuxStepComponent[];
  luxA11YMode?: boolean;
  luxButtonAlignLeft?: boolean;
}
