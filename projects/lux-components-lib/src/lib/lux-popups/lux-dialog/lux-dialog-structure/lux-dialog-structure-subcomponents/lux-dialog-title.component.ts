import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'lux-dialog-title',
  changeDetection: ChangeDetectionStrategy.Eager,
  template: '<ng-content></ng-content>'
})
export class LuxDialogTitleComponent {
  constructor() {}
}
