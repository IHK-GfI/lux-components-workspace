import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'lux-filter-form-extended',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>'
})
export class LuxFilterFormExtendedComponent {}
