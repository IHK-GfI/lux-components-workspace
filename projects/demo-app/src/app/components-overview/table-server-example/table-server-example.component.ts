import { DatePipe, LowerCasePipe, NgStyle } from '@angular/common';
import { Component, ViewChild, inject } from '@angular/core';
import {
  LuxConsoleService,
  LuxFormHintComponent,
  LuxMenuComponent,
  LuxMenuItemComponent,
  LuxTableColumnComponent,
  LuxTableColumnContentComponent,
  LuxTableColumnFooterComponent,
  LuxTableColumnHeaderComponent,
  LuxTableComponent,
  LuxToggleAcComponent
} from '@ihk-gfi/lux-components';
import { DemoGlobalLoadingService } from '../../base/global-loading/demo-global-loading.service';
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
    LuxToggleAcComponent,
    LuxFormHintComponent,
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
  private globalLoading = inject(DemoGlobalLoadingService);
  private releaseTableLoading?: () => void;
  private tableLoading = false;
  private showProgressBeforeGlobalLoading = true;

  @ViewChild('myTable') tableComponent!: LuxTableComponent;

  httpDAO: TestHttpDao;
  reloadCount = 0;
  showProgress = true;
  useGlobalLoading = false;

  constructor() {
    super();

    this.httpDAO = new TestHttpDao(this.logger);
  }

  override ngOnDestroy(): void {
    this.releaseTableLoading?.();
    super.ngOnDestroy();
  }

  /**
   * Schaltet zwischen der internen Progressbar und dem globalen Ladebalken (unter dem App-Header) um.
   * Damit nie zwei Ladebalken gleichzeitig laufen, wird die interne Progressbar dabei deaktiviert.
   */
  onUseGlobalLoadingChange(useGlobalLoading: boolean) {
    if (useGlobalLoading === this.useGlobalLoading) {
      return;
    }

    this.useGlobalLoading = useGlobalLoading;
    if (useGlobalLoading) {
      this.showProgressBeforeGlobalLoading = this.showProgress;
      this.showProgress = false;
    } else {
      this.showProgress = this.showProgressBeforeGlobalLoading;
    }
    this.syncGlobalLoading();
  }

  onTableLoadingChange(loading: boolean) {
    this.tableLoading = loading;
    this.syncGlobalLoading();
  }

  getDataArr() {
    return this.httpDAO.data;
  }

  /**
   * Meldet den Ladezustand der Tabelle an den globalen Ladezustand, solange dieser verwendet wird.
   * Wird während eines Ladevorgangs umgeschaltet, wird der laufende Vorgang übernommen bzw. freigegeben.
   */
  private syncGlobalLoading() {
    const loading = this.useGlobalLoading && this.tableLoading;
    if (loading && !this.releaseTableLoading) {
      this.releaseTableLoading = this.globalLoading.busy();
    } else if (!loading && this.releaseTableLoading) {
      this.releaseTableLoading();
      this.releaseTableLoading = undefined;
    }
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

  override refreshSelectionBindings(): void {
    // This example handles selection via template bindings.
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
