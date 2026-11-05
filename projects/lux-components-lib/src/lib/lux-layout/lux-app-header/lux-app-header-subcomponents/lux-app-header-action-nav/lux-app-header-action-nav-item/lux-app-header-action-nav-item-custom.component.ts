import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'lux-app-header-action-nav-item-custom',
  changeDetection: ChangeDetectionStrategy.Eager,
  template: '<ng-content></ng-content>'
})
export class LuxAppHeaderActionNavItemCustomComponent {
  constructor() {}
}
