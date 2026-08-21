import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'lux-card-content',
  changeDetection: ChangeDetectionStrategy.Eager,
  template: '<ng-content></ng-content>'
})
export class LuxCardContentComponent {
  constructor() {}
}
