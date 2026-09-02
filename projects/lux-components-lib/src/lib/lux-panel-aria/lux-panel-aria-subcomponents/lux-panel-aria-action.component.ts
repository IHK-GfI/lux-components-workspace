import { Component } from '@angular/core';

@Component({
  selector: 'lux-panel-aria-action',
  template: '<div class="mat-expansion-panel-action-row"><ng-content></ng-content></div>',
  standalone: true
})
export class LuxPanelAriaActionComponent {}
