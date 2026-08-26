import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'example-base-options-actions',
  changeDetection: ChangeDetectionStrategy.Eager,
  template: '<ng-content></ng-content>'
})
export class ExampleBaseOptionsActionsComponent {
  constructor() {}
}
