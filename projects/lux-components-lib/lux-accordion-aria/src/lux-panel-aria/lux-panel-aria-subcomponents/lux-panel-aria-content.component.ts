import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'lux-panel-aria-content',
  template: '<ng-content></ng-content>',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true
})
export class LuxPanelAriaContentComponent {}
