import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'lux-list-item-content',
  changeDetection: ChangeDetectionStrategy.Eager,
  template: '<ng-content></ng-content>'
})
export class LuxListItemContentComponent {
  constructor() {}
}
