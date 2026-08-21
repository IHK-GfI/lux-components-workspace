import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'lux-step-content',
  changeDetection: ChangeDetectionStrategy.Eager,
  template: '<ng-content></ng-content>'
})
export class LuxStepContentComponent {
  constructor() {}
}
