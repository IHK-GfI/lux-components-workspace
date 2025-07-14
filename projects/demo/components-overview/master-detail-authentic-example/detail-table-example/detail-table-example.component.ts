import { Component, Input } from '@angular/core';
import {
  LuxTableColumnComponent,
  LuxTableColumnContentComponent,
  LuxTableColumnHeaderComponent,
  LuxTableComponent
} from '@ihk-gfi/lux-components';

@Component({
  selector: 'detail-table-example',
  templateUrl: './detail-table-example.component.html',
  imports: [
    LuxTableComponent,
    LuxTableColumnHeaderComponent,
    LuxTableColumnComponent,
    LuxTableColumnContentComponent,
  ],
  standalone: true
})
export class DetailTableExampleComponent {
  @Input() tableData: any[] = [];
}

