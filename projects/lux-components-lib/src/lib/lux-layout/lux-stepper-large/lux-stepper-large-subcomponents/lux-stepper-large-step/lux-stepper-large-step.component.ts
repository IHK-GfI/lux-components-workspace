import { AfterViewInit, ChangeDetectionStrategy, Component, model, TemplateRef, viewChild } from '@angular/core';
import { LuxUtil } from '../../../../lux-util/lux-util';
import { LuxStepperLargeClickEvent } from '../../lux-stepper-large-model/lux-stepper-large-click-event';
import { ILuxStepperLargeStep, LuxVetoState } from '../../lux-stepper-large-model/lux-stepper-large-step.interface';

@Component({
  selector: 'lux-stepper-large-step',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <ng-template #content>
      <ng-content />
    </ng-template>
  `
})
export class LuxStepperLargeStepComponent implements ILuxStepperLargeStep, AfterViewInit {
  readonly contentTemplate = viewChild.required<TemplateRef<any>>('content');

  readonly luxTitle = model('');
  readonly luxTouched = model(false);
  readonly luxCompleted = model(false);
  readonly luxDisabled = model(false);
  readonly luxVetoFn = model<(clickEvent: LuxStepperLargeClickEvent) => Promise<LuxVetoState>>(() =>
    Promise.resolve(LuxVetoState.navigationAccepted)
  );

  ngAfterViewInit() {
    LuxUtil.assertNonNull('contentTemplate', this.contentTemplate());
  }
}
