import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'lux-side-nav-header',
  changeDetection: ChangeDetectionStrategy.Eager,
  template: '<div class="lux-side-nav-header-content"><ng-content></ng-content></div>'
})
export class LuxSideNavHeaderComponent {
  constructor() {}
}
