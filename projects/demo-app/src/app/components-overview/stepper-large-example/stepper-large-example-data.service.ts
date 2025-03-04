import { Injectable } from '@angular/core';
import {
  LUX_STEPPER_LARGE_DEFAULT_FIN_BTN_CONF,
  LUX_STEPPER_LARGE_DEFAULT_NEXT_BTN_CONF,
  LUX_STEPPER_LARGE_DEFAULT_PREV_BTN_CONF,
  LuxStepperLargeButtonInfo
} from 'lux-components-lib';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';

@Injectable({
  providedIn: 'root'
})
export class StepperLargeExampleDataService {
  prevButtonConfig: LuxStepperLargeButtonInfo = JSON.parse(JSON.stringify(LUX_STEPPER_LARGE_DEFAULT_PREV_BTN_CONF));
  nextButtonConfig: LuxStepperLargeButtonInfo = JSON.parse(JSON.stringify(LUX_STEPPER_LARGE_DEFAULT_NEXT_BTN_CONF));
  finButtonConfig: LuxStepperLargeButtonInfo = JSON.parse(JSON.stringify(LUX_STEPPER_LARGE_DEFAULT_FIN_BTN_CONF));
  luxStepValidationActive = true;
  showErrorMessage = new BehaviorSubject<boolean>(false);

  constructor() {}
}
