import { Component, Input, OnInit } from '@angular/core';
import {
  LuxAccordionComponent,
  LuxFormHintComponent,
  LuxFormLabelComponent,
  LuxInputAcComponent,
  LuxPanelComponent,
  LuxPanelContentComponent,
  LuxPanelHeaderTitleComponent,
  LuxSelectAcComponent,
  LuxToggleAcComponent,
  LuxUtil
} from 'lux-components-lib';
import { ResponsiveBehaviour } from '../responsive-behaviour';
import { ResponsiveBehaviourFilteredPipe } from '../responsive-behaviour-filtered.pipe';
import { TableExampleBaseClass } from '../table-example-base.class';

@Component({
  selector: 'table-example-advanced-options',
  templateUrl: './table-example-advanced-options.component.html',
  imports: [
    LuxAccordionComponent,
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
