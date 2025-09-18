import { NgClass } from '@angular/common';
import { Component, input } from '@angular/core';

export type LuxCardActionAlignType = 'left' | 'right';

@Component({
  selector: 'lux-card-actions',
  templateUrl: './lux-card-actions.component.html',
  imports: [NgClass],
  host: { class: 'lux-flex lux-flex-auto'}
})
export class LuxCardActionsComponent {

  luxAlign = input<LuxCardActionAlignType>('right');

  constructor() {}
}
