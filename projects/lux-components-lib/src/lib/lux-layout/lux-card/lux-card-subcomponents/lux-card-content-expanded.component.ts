import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'lux-card-content-expanded',
  changeDetection: ChangeDetectionStrategy.Eager,
  template: '<ng-content></ng-content>'
})
export class LuxCardContentExpandedComponent {
  constructor() {}
}
