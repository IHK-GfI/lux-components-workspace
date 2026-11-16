import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'lux-dialog-actions',
  changeDetection: ChangeDetectionStrategy.Eager,
  template: '<ng-content></ng-content>'
})
export class LuxDialogActionsComponent {
  constructor() {}
}
