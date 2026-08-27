import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'lux-input-ac-suffix',
  template: ` <ng-content></ng-content> `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: []
})
export class LuxInputAcSuffixComponent {}
