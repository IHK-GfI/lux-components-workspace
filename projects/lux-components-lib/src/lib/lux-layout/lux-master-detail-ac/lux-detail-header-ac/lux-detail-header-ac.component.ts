import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'lux-detail-header-ac',
  changeDetection: ChangeDetectionStrategy.Eager,
  template: '<ng-content></ng-content>'
})
export class LuxDetailHeaderAcComponent {
  constructor() {}
}
