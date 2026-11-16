import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'lux-detail-header, lux-detail-header-ac',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content />'
})
export class LuxDetailHeaderComponent {}
