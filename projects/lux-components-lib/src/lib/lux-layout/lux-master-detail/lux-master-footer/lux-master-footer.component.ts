import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'lux-master-footer, lux-master-footer-ac',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content />'
})
export class LuxMasterFooterComponent {}
