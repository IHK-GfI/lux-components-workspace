import { Component } from '@angular/core';
import { MatExpansionPanelActionRow } from '@angular/material/expansion';

@Component({
  selector: 'lux-panel-action',
  template: '<mat-action-row><ng-content></ng-content></mat-action-row>',
  imports: [MatExpansionPanelActionRow]
})
export class LuxPanelActionComponent {
  constructor() {}
}
