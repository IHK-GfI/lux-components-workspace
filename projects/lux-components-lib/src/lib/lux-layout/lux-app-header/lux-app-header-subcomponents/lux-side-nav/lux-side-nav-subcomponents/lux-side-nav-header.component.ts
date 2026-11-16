import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'lux-side-nav-header',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<div class="lux-side-nav-header-content"><ng-content /></div>'
})
export class LuxSideNavHeaderComponent {}
