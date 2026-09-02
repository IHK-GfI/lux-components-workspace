import { Component, input, ChangeDetectionStrategy } from '@angular/core';
import { LuxFormHintComponent, LuxInputAcComponent, LuxSelectAcComponent, LuxToggleAcComponent } from '@ihk-gfi/lux-components';
import { TableExampleBaseClass } from '../table-example-base.class';

@Component({
  selector: 'table-example-simple-options',
  templateUrl: './table-example-simple-options.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [LuxToggleAcComponent, LuxSelectAcComponent, LuxInputAcComponent, LuxFormHintComponent]
})
export class TableExampleSimpleOptionsComponent {
  readonly tableExample = input.required<TableExampleBaseClass>();
}
