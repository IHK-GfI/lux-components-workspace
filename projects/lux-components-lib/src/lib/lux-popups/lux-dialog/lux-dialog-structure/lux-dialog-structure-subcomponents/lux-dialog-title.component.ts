import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'lux-dialog-title',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content />'
})
export class LuxDialogTitleComponent {}
