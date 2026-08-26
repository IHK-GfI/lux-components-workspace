import { Component, Input, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { LuxFormHintComponent, LuxInputAcComponent, LuxSelectAcComponent, LuxToggleAcComponent, LuxUtil } from '@ihk-gfi/lux-components';
import { TableExampleBaseClass } from '../table-example-base.class';

@Component({
  selector: 'table-example-simple-options',
  templateUrl: './table-example-simple-options.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [LuxToggleAcComponent, LuxSelectAcComponent, LuxInputAcComponent, LuxFormHintComponent]
})
export class TableExampleSimpleOptionsComponent implements OnInit {
  @Input() tableExample!: TableExampleBaseClass;

  constructor() {}

  ngOnInit() {
    LuxUtil.assertNonNull('tableExample', this.tableExample);
  }
}
