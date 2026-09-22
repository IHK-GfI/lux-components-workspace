import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatExpansionPanelActionRow } from '@angular/material/expansion';

@Component({
  selector: 'lux-panel-action',
  template: '<mat-action-row><ng-content /></mat-action-row>',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatExpansionPanelActionRow]
})
export class LuxPanelActionComponent {}
