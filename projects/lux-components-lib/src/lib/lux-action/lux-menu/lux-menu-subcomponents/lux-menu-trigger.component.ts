import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'lux-menu-trigger',
  changeDetection: ChangeDetectionStrategy.Eager,
  template: '<ng-content></ng-content>'
})
export class LuxMenuTriggerComponent {
  constructor() {}
}
