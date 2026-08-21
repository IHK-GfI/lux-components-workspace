import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'lux-side-nav-footer',
  changeDetection: ChangeDetectionStrategy.Eager,
  template: '<div class="lux-side-nav-footer-content"><ng-content></ng-content></div>'
})
export class LuxSideNavFooterComponent {
  constructor() {}
}
