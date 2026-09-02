import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'example-base-content-actions',
  template: '<ng-content select="lux-button"></ng-content>',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ExampleBaseContentActionsComponent {}
