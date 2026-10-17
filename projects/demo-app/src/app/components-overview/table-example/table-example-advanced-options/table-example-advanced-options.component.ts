import { Component, input, ChangeDetectionStrategy } from '@angular/core';
import {
  LuxAccordionComponent,
  LuxButtonComponent,
  LuxFormHintComponent,
  LuxFormLabelComponent,
  LuxInputComponent,
  LuxPanelComponent,
  LuxPanelContentComponent,
  LuxPanelHeaderTitleComponent,
  LuxSelectComponent,
  LuxToggleComponent
} from '@ihk-gfi/lux-components';
import { ResponsiveBehaviour } from '../responsive-behaviour';
import { ResponsiveBehaviourFilteredPipe } from '../responsive-behaviour-filtered.pipe';
import { TableExampleBaseClass } from '../table-example-base.class';

@Component({
  selector: 'table-example-advanced-options',
  templateUrl: './table-example-advanced-options.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    LuxAccordionComponent,
    LuxButtonComponent,
    LuxPanelHeaderTitleComponent,
    LuxPanelContentComponent,
    LuxPanelComponent,
    LuxToggleComponent,
    LuxSelectComponent,
    LuxInputComponent,
    LuxFormLabelComponent,
    LuxFormHintComponent,
    ResponsiveBehaviourFilteredPipe
  ]
})
export class TableExampleAdvancedOptionsComponent {
  readonly tableExample = input.required<TableExampleBaseClass>();

  BEHAVIOURS = ResponsiveBehaviour.BEHAVIOURS;
}
