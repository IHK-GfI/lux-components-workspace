import { Component } from '@angular/core';
import { MatExpansionPanelTitle } from '@angular/material/expansion';

@Component({
  selector: 'lux-panel-header-title',
  template: '<mat-panel-title><ng-content></ng-content></mat-panel-title>',
  imports: [MatExpansionPanelTitle]
})
export class LuxPanelHeaderTitleComponent {
  constructor() {}
}
