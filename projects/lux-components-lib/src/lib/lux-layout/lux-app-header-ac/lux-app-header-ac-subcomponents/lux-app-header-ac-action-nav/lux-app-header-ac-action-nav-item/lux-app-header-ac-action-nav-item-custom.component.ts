import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'lux-app-header-ac-action-nav-item-custom',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>'
})
export class LuxAppHeaderAcActionNavItemCustomComponent {
  constructor() {}
}
