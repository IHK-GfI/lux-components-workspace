import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'lux-input-ac-suffix',
  template: ` <ng-content></ng-content> `,
  changeDetection: ChangeDetectionStrategy.Eager,
  styles: []
})
export class LuxInputAcSuffixComponent {
  constructor() {}
}
