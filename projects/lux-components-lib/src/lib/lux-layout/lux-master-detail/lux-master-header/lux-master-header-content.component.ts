import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'lux-master-header-content, lux-master-header-content-ac',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-content />`
})
export class LuxMasterHeaderContentComponent {}
