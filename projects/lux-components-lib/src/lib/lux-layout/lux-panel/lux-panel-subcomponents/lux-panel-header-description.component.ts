import { Component } from '@angular/core';
import { MatExpansionPanelDescription } from '@angular/material/expansion';

@Component({
  selector: 'lux-panel-header-description',
  template: '<mat-panel-description><ng-content></ng-content></mat-panel-description>',
  imports: [MatExpansionPanelDescription]
})
export class LuxPanelHeaderDescriptionComponent {
  constructor() {}
}
