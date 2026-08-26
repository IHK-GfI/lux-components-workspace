import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'lux-input-ac-prefix',
  template: ` <ng-content></ng-content> `,
  changeDetection: ChangeDetectionStrategy.Eager,
  styles: []
})
export class LuxInputAcPrefixComponent {
  constructor() {}
}
