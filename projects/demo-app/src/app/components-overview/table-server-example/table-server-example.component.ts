import { DatePipe, LowerCasePipe, NgStyle } from '@angular/common';
import { Component, ViewChild, inject } from '@angular/core';
import {
    LuxConsoleService,
    LuxMenuComponent,
    LuxMenuItemComponent,
    LuxTableColumnComponent,
    LuxTableColumnContentComponent,
    LuxTableColumnFooterComponent,
    LuxTableColumnHeaderComponent,
    LuxTableComponent
} from '@ihk-gfi/lux-components';
import { ExampleBaseContentComponent } from '../../example-base/example-base-root/example-base-subcomponents/example-base-content/example-base-content.component';
import { ExampleBaseAdvancedOptionsComponent } from '../../example-base/example-base-root/example-base-subcomponents/example-base-options/example-base-advanced-options.component';
import { ExampleBaseOptionsActionsComponent } from '../../example-base/example-base-root/example-base-subcomponents/example-base-options/example-base-options-actions.component';
import { ExampleBaseSimpleOptionsComponent } from '../../example-base/example-base-root/example-base-subcomponents/example-base-options/example-base-simple-options.component';
import { ExampleBaseStructureComponent } from '../../example-base/example-base-root/example-base-subcomponents/example-base-structure/example-base-structure.component';
import { TableExampleAdvancedOptionsComponent } from '../table-example/table-example-advanced-options/table-example-advanced-options.component';
import { TableExampleBaseClass } from '../table-example/table-example-base.class';
import { TableExampleSimpleOptionsComponent } from '../table-example/table-example-simple-options/table-example-simple-options.component';
import { TestHttpDao } from './test-http-dao';

@Component({
  selector: 'app-table-server-example',
  templateUrl: './table-server-example.component.html',
  styleUrls: ['./table-server-example.component.scss'],
  imports: [
    LuxTableColumnContentComponent,
    LuxTableColumnHeaderComponent,
    LuxTableColumnComponent,
    LuxTableColumnFooterComponent,
    LuxTableComponent,
    LuxMenuComponent,
    LuxMenuItemComponent,
    ExampleBaseStructureComponent,
    ExampleBaseContentComponent,
    NgStyle,
    ExampleBaseSimpleOptionsComponent,
    TableExampleSimpleOptionsComponent,
    ExampleBaseAdvancedOptionsComponent,
    TableExampleAdvancedOptionsComponent,
    ExampleBaseOptionsActionsComponent,
    LowerCasePipe,
    DatePipe
  ]
})
export class TableServerExampleComponent extends TableExampleBaseClass {
  private logger = inject(LuxConsoleService);

  @ViewChild('myTable') tableComponent!: LuxTableComponent;

  httpDAO: TestHttpDao;
  reloadCount = 0;

  constructor() {
    super();

    this.httpDAO = new TestHttpDao(this.logger);
  }

  getDataArr() {
    return this.httpDAO.data;
  }

  getTableComponent(): LuxTableComponent<any> {
    return this.tableComponent;
  }

  onSelectedChange(selected: Set<any>) {
    console.log('als Set:  ', selected);
  }

  onSelectedAsArrayChange(selected: any[]) {
    console.log('als Array:', selected);
  }

  reload() {
    this.reloadCount++;

    // Das Datenarray kürzen
    const newHttpDAO = new TestHttpDao(this.logger);
    newHttpDAO.dataSourceFix = newHttpDAO.dataSourceFix.slice(0, newHttpDAO.dataSourceFix.length - 2);

    // Die Namen ändern
    newHttpDAO.dataSourceFix.forEach((item) => {
      item.name += '_' + this.reloadCount;
    });

    // Das neue ILuxTableHttpDao setzen
    this.httpDAO = newHttpDAO;
  }
}
