import { Component, Input, OnInit, ChangeDetectionStrategy } from '@angular/core';
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
    LuxToggleAcComponent,
    LuxUtil
} from '@ihk-gfi/lux-components';
import { ResponsiveBehaviour } from '../responsive-behaviour';
import { ResponsiveBehaviourFilteredPipe } from '../responsive-behaviour-filtered.pipe';
import { TableExampleBaseClass } from '../table-example-base.class';

@Component({
  selector: 'table-example-advanced-options',
  templateUrl: './table-example-advanced-options.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
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
export class TableExampleAdvancedOptionsComponent implements OnInit {
  BEHAVIOURS = ResponsiveBehaviour.BEHAVIOURS;

  @Input() tableExample!: TableExampleBaseClass;

  constructor() {}

  ngOnInit() {
    LuxUtil.assertNonNull('tableExample', this.tableExample);
  }
}
