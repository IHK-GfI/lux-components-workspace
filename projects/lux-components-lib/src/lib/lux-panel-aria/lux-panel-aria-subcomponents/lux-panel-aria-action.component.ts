import { Component } from '@angular/core';
import { LuxDividerComponent } from '../../../public_api';

@Component({
  selector: 'lux-panel-aria-action',
  template:
    '<div class="lux-mr-4 lux-ml-4"><lux-divider [luxInset]="true"></lux-divider><div class="lux-flex lux-justify-end lux-gap-4 lux-pt-4 lux-pb-4"><ng-content></ng-content></div></div>',
  standalone: true,
  imports: [LuxDividerComponent]
})
export class LuxPanelAriaActionComponent {}
