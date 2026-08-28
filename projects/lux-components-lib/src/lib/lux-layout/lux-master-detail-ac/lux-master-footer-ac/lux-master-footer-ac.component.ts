import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'lux-master-footer-ac',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>'
})
export class LuxMasterFooterAcComponent {}
