import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'example-base-options-actions',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>'
})
export class ExampleBaseOptionsActionsComponent {}
