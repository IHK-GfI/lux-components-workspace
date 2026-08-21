import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'lux-filter-form-extended',
  changeDetection: ChangeDetectionStrategy.Eager,
  template: '<ng-content></ng-content>'
})
export class LuxFilterFormExtendedComponent {
  constructor() {}
}
