import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'lux-input-prefix, lux-input-ac-prefix',
  template: ` <ng-content /> `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: []
})
export class LuxInputPrefixComponent {}
