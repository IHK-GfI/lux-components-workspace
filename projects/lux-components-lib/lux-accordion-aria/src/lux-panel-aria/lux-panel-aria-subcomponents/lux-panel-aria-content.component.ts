import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'lux-panel-aria-content',
  template: '<ng-content></ng-content>',
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: true
})
export class LuxPanelAriaContentComponent {}
