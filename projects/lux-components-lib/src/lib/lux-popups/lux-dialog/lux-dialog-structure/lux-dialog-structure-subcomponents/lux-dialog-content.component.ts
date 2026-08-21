import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'lux-dialog-content',
  changeDetection: ChangeDetectionStrategy.Eager,
  template: '<ng-content></ng-content>'
})
export class LuxDialogContentComponent {
  constructor() {}
}
