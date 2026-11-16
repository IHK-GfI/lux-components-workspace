import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'lux-master-footer-ac',
  changeDetection: ChangeDetectionStrategy.Eager,
  template: '<ng-content></ng-content>'
})
export class LuxMasterFooterAcComponent {
  constructor() {}
}
