import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'lux-list-item-icon',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>'
})
export class LuxListItemIconComponent {
  constructor() {}
}
