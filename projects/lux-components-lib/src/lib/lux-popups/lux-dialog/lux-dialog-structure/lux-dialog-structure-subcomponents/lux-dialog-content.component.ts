import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'lux-dialog-content',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content />'
})
export class LuxDialogContentComponent {}
