import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'lux-panel-content',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content />'
})
export class LuxPanelContentComponent {}
