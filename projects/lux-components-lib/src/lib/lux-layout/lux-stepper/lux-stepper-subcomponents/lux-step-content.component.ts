import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'lux-step-content',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>'
})
export class LuxStepContentComponent {}
