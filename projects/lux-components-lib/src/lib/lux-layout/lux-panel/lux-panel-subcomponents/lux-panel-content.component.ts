import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'lux-panel-content',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>'
})
export class LuxPanelContentComponent {
  constructor() {}
}
