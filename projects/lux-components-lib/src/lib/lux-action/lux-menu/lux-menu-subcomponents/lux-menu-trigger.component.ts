import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'lux-menu-trigger',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>'
})
export class LuxMenuTriggerComponent {
  constructor() {}
}
