import { Signal, TemplateRef, WritableSignal } from '@angular/core';
import { LuxStepperLargeClickEvent } from './lux-stepper-large-click-event';

export enum LuxVetoState {
  navigationAccepted,
  navigationRejected
}

export interface ILuxStepperLargeStep {
  luxTitle: Signal<string>;
  luxTouched: WritableSignal<boolean>;
  luxCompleted: WritableSignal<boolean>;
  luxDisabled: Signal<boolean>;
  luxVetoFn: Signal<(clickEvent: LuxStepperLargeClickEvent) => Promise<LuxVetoState>>;
  contentTemplate: Signal<TemplateRef<any>>;
}
