import { Component, input, ChangeDetectionStrategy } from '@angular/core';
import {
    LuxAccordionComponent,
    LuxButtonComponent,
    LuxFormHintComponent,
    LuxFormLabelComponent,
    LuxInputAcComponent,
    LuxPanelComponent,
    LuxPanelContentComponent,
    LuxPanelHeaderTitleComponent,
    LuxSelectAcComponent,
    LuxToggleAcComponent
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
    LuxToggleAcComponent,
    LuxSelectAcComponent,
    LuxInputAcComponent,
    LuxFormLabelComponent,
    LuxFormHintComponent,
    ResponsiveBehaviourFilteredPipe
  ]
})
export class TableExampleAdvancedOptionsComponent {
  BEHAVIOURS = ResponsiveBehaviour.BEHAVIOURS;

  readonly tableExample = input.required<TableExampleBaseClass>();
}
