import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'lux-app-header-action-nav-item-custom',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>'
})
export class LuxAppHeaderActionNavItemCustomComponent {}
