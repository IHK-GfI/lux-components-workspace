import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'lux-side-nav-footer',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<div class="lux-side-nav-footer-content"><ng-content /></div>'
})
export class LuxSideNavFooterComponent {}
