import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'lux-input-ac-prefix',
  template: ` <ng-content></ng-content> `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: []
})
export class LuxInputAcPrefixComponent {}
