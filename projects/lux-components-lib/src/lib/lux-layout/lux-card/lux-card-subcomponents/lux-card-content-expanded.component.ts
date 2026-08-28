import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'lux-card-content-expanded',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>'
})
export class LuxCardContentExpandedComponent {
  constructor() {}
}
