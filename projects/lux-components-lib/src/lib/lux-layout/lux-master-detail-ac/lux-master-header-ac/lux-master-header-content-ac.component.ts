import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'lux-master-header-content-ac',
  changeDetection: ChangeDetectionStrategy.Eager,
  template: `<ng-content></ng-content>`
})
export class LuxMasterHeaderContentAcComponent {
  constructor() {}
}
