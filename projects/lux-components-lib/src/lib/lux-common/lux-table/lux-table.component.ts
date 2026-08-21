import { LiveAnnouncer } from '@angular/cdk/a11y';
import { NgClass, NgStyle, NgTemplateOutlet } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  contentChildren,
  DoCheck,
  effect,
  ElementRef,
  EventEmitter,
  inject,
  Injector,
  input,
  Input,
  model,
  OnDestroy,
  OnInit,
  Output,
  output,
  untracked,
  viewChild
} from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { FormGroup } from '@angular/forms';
import { MatSort, MatSortHeader, Sort } from '@angular/material/sort';
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatFooterCell,
  MatFooterCellDef,
  MatFooterRow,
  MatFooterRowDef,
  MatHeaderCell,
  MatHeaderCellDef,
  MatHeaderRow,
  MatHeaderRowDef,
  MatRow,
  MatRowDef,
  MatTable
} from '@angular/material/table';
import { LuxPageEvent, LuxPaginatorComponent } from '@ihk-gfi/lux-components/lux-paginator';
import { TranslocoPipe, TranslocoService } from '@jsverse/transloco';
import { of, Subject, Subscription } from 'rxjs';
import { catchError, debounceTime, distinctUntilChanged, tap } from 'rxjs/operators';
import { LuxAriaLabelDirective } from '../../lux-directives/lux-aria/lux-aria-label.directive';
import { LuxTabIndexDirective } from '../../lux-directives/lux-tabindex/lux-tab-index.directive';
import { LuxTooltipDirective } from '../../lux-directives/lux-tooltip/lux-tooltip.directive';
import { LuxCheckboxAcComponent } from '../../lux-form/lux-checkbox-ac/lux-checkbox-ac.component';
import { LuxInputAcPrefixComponent } from '../../lux-form/lux-input-ac/lux-input-ac-subcomponents/lux-input-ac-prefix.component';
import { LuxInputAcSuffixComponent } from '../../lux-form/lux-input-ac/lux-input-ac-subcomponents/lux-input-ac-suffix.component';
import { LuxInputAcComponent } from '../../lux-form/lux-input-ac/lux-input-ac.component';
import { LuxSelectAcComponent } from '../../lux-form/lux-select-ac/lux-select-ac.component';
import { LuxIconComponent } from '../../lux-icon/lux-icon/lux-icon.component';
import { LuxConsoleService } from '../../lux-util/lux-console.service';
import { LuxMediaQueryObserverService } from '../../lux-util/lux-media-query-observer.service';
import { LuxUtil } from '../../lux-util/lux-util';
import { LuxProgressComponent } from '../lux-progress/lux-progress.component';
import { ILuxTableColumnVisibilityStore, LuxTableLocalColumnVisibilityStore } from './lux-table-column-visibility-store';
import { ICustomCSSConfig } from './lux-table-custom-css-config.interface';
import { LuxTableDataSource } from './lux-table-data-source';
import { ILuxTableHttpDaoStructure } from './lux-table-http/lux-table-http-dao-structure.interface';
import { ILuxTableHttpDao } from './lux-table-http/lux-table-http-dao.interface';
import { LuxTableColumnComponent } from './lux-table-subcomponents/lux-table-column.component';

export interface LuxTableDoubleClickEventType<T> {
  event: MouseEvent;
  rowItem: T;
}

@Component({
  selector: 'lux-table',
  templateUrl: './lux-table.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    LuxProgressComponent,
    NgClass,
    LuxInputAcComponent,
    LuxInputAcPrefixComponent,
    LuxInputAcSuffixComponent,
    LuxSelectAcComponent,
    NgStyle,
    MatTable,
    MatSort,
    MatColumnDef,
    MatHeaderCellDef,
    MatHeaderCell,
    MatSortHeader,
    MatCellDef,
    MatCell,
    LuxCheckboxAcComponent,
    LuxTabIndexDirective,
    LuxAriaLabelDirective,
    MatFooterCellDef,
    MatFooterCell,
    NgTemplateOutlet,
    MatHeaderRowDef,
    MatHeaderRow,
    MatRowDef,
    MatRow,
    MatFooterRowDef,
    MatFooterRow,
    LuxPaginatorComponent,
    LuxTooltipDirective,
    LuxIconComponent,
    TranslocoPipe
  ]
})
export class LuxTableComponent<T = any> implements OnInit, AfterViewInit, DoCheck, OnDestroy {
  private queryObserver = inject(LuxMediaQueryObserverService);
  private luxConsole = inject(LuxConsoleService);
  private liveAnnouncer = inject(LiveAnnouncer);
  private tService = inject(TranslocoService);
  private defaultColumnVisibilityStore = inject(LuxTableLocalColumnVisibilityStore);
  private cdr = inject(ChangeDetectorRef);
  private injector = inject(Injector);

  static AUTO_PAGINATION_START = 100; // 100 Elemente bis automatisch die Pagination aktiviert wird

  private _dataColumnDefs: string[] = [];
  private _dataSource: LuxTableDataSource<any> = new LuxTableDataSource<any>([]);
  private _luxSelected = new Set<T>();

  private previousWidth = 0;
  private previousHeight = 0;
  private httpRequestConf: { page?: number; pageSize?: number; filter?: string; sort?: string; order?: string } = {};

  private mediaQuerySubscription: Subscription;
  private httpDaoSubscription?: Subscription;
  private filterChangedSubscription?: Subscription;
  private columnSubscriptions: Subscription[] = [];
  private tableColumnsChangedSubscription?: Subscription;
  private sortChangedSubscription?: Subscription;
  private selectedSubscription?: Subscription;

  filtered$: Subject<string> = new Subject<string>();
  currentCustomClasses: { entry: any; classes: string }[] = [];
  isLoadingResults = false;
  allSelected = false;
  mediaQuery: string;
  movedTableColumns: LuxTableColumnComponent[] = [];
  hasMovedColumnsMap = new Map<string, boolean>();
  tableMinWidth?: string;
  tableHeightCSSCalc?: string;
  init = true;
  lastSelectedEventData = JSON.stringify([]);
  allColumnsForVisibility: { label: string; value: string }[] = [];
  hiddenColumns: string[] = [];
  columnVisibilityPickValueFN = (option: { label: string; value: string }) => option.value;

  readonly luxShowColumnSelector = input<boolean>(false);
  readonly luxColumnStorageKey = input<string | undefined>(undefined);
  readonly luxColumnVisibilityStore = input<ILuxTableColumnVisibilityStore>(this.defaultColumnVisibilityStore);
  readonly luxColWidthsPercent = input<number[]>([]);
  readonly luxFilterText = input('Filter');
  readonly luxNoDataText = input('Keine Daten gefunden.');
  readonly luxPageSize = input(10);
  readonly luxPageSizeOptions = input([5, 10, 25, 50]);
  readonly luxMinWidthPx = input(-1);
  readonly luxAutoPaginate = input(true);
  readonly luxHideBorders = input(false);
  readonly luxMultiSelectOnlyCheckboxClick = input(false);
  readonly luxMultiSelectDisabledProperty = input<string | undefined>(undefined);
  readonly luxPagerDisabled = input(false);
  readonly luxPagerTooltip = input('');
  readonly luxPagerFirstLastButton = input(true);
  readonly luxAlignElementsTop = input(false);

  readonly luxHttpDAO = input<ILuxTableHttpDao | undefined>(undefined);

  readonly luxClasses = input<ICustomCSSConfig[], ICustomCSSConfig | ICustomCSSConfig[]>([], {
    transform: (classes) => (classes && !Array.isArray(classes) ? [classes] : (classes ?? []))
  });

  // Wird zusätzlich intern gesetzt (Auto-Pagination bei großen Datenmengen), daher als model() statt input().
  readonly luxShowPagination = model(false);

  readonly luxShowFilter = input(false);

  readonly luxMultiSelect = input(false);

  // luxSelected bleibt als Getter (siehe unten) der intern abgeglichene Selektions-Set-Wert;
  // das Input-Signal muss daher unter einem anderen Property-Namen deklariert und auf den
  // externen Binding-Namen "luxSelected" aliasiert werden.
  // eslint-disable-next-line @angular-eslint/no-input-rename
  readonly luxSelectedInput = input<Set<T>>(new Set<T>(), { alias: 'luxSelected' });

  readonly luxPickValue = input<(o: any) => any, (o: any) => any>((o: any) => o, {
    transform: (pickFn: (o: any) => any) => {
      LuxUtil.assertNonNull('luxPickValue', pickFn);
      return pickFn;
    }
  });

  readonly luxCompareWith = input<(o1: any, o2: any) => boolean, (o1: any, o2: any) => boolean>(
    (o1: any, o2: any) => o1 === o2,
    {
      transform: (compareFn: (o1: any, o2: any) => boolean) => {
        LuxUtil.assertNonNull('luxCompareWith', compareFn);
        return compareFn;
      }
    }
  );

  @Output() luxSelectedChange = new EventEmitter<Set<T>>();
  @Output() luxSelectedAsArrayChange = new EventEmitter<T[]>();
  @Output() luxSingleClicked = new EventEmitter<{ event: Event; rowItem: T; rowIndex: number }>();
  @Output() luxDoubleClicked = new EventEmitter<{ event: MouseEvent; rowItem: T }>();
  readonly luxHiddenColumnsChange = output<string[]>();

  private paginatorQuery = viewChild(LuxPaginatorComponent);
  private sortQuery = viewChild(MatSort);
  private paginatorElementQuery = viewChild('paginator', { read: ElementRef });
  private filterElementQuery = viewChild('filter', { read: ElementRef });
  private filterComponentQuery = viewChild<LuxInputAcComponent>('filter');
  private tableContainerElementQuery = viewChild('tableContainer', { read: ElementRef });
  private tableColumnsQuery = contentChildren(LuxTableColumnComponent);

  get paginator(): LuxPaginatorComponent | undefined {
    return this.paginatorQuery();
  }

  get sort(): MatSort | undefined {
    return this.sortQuery();
  }

  get paginatorElement(): ElementRef | undefined {
    return this.paginatorElementQuery();
  }

  get filterElement(): ElementRef | undefined {
    return this.filterElementQuery();
  }

  get filterComponent(): LuxInputAcComponent | undefined {
    return this.filterComponentQuery();
  }

  get tableContainerElement(): ElementRef | undefined {
    return this.tableContainerElementQuery();
  }

  get tableColumns(): LuxTableColumnComponent[] {
    return [...this.tableColumnsQuery()];
  }

  get dataColumnDefs(): string[] {
    return this._dataColumnDefs;
  }

  get dataSource(): LuxTableDataSource<any> {
    return this._dataSource;
  }

  get luxData(): any[] {
    return this.dataSource.data;
  }

  // Bleibt bewusst ein Decorator-Input: der Setter muss synchron (im selben CD-Zyklus wie
  // die Bindung) laufen, damit die noData-Zeile bei Signal-basierten Daten (z.B. rxResource)
  // korrekt ausgeblendet wird (Issue #217). Ein effect() auf ein input()-Signal würde
  // asynchron laufen und dieses Timing nicht mehr garantieren.
  @Input()
  set luxData(data: any[]) {
    data = data ? data : [];
    this.dataSource.data = data;
    if (this.dataSource) {
      // Sofort setzen, damit die noData-Zeile bereits im ersten CD-Zyklus korrekt
      // ausgeblendet wird, wenn Daten über Signals (z.B. rxResource) geladen werden (Issue #217).
      // updateDataSourceAttributes() setzt totalElements nach dem setTimeout ebenfalls
      // (dort wird auch Pagination/Sort berücksichtigt).
      if (!this.luxHttpDAO()) {
        this.dataSource.totalElements = data.length;
      }
      setTimeout(() => {
        this.updateDataSourceAttributes(data);
        this.handleSort();
        this.insertCustomCSSClasses();
        this.updateColumnsByMediaQuery();
        this.calculateProportions();
        this.updateSelection();
        // markForCheck() stellt sicher, dass Konsumenten mit OnPush nach dem Timeout
        // einen weiteren CD-Zyklus erhalten (zoneless-kompatibel).
        this.cdr.markForCheck();
      });
    }
  }

  get luxSelected(): Set<T> {
    return this._luxSelected;
  }

  private luxSelectedIntern(selected: Set<T>) {
    const newSelected = selected ? Array.from(selected) : [];
    this.luxSelected.clear();
    if (newSelected) {
      newSelected.forEach((entry) => {
        this.addSelected(entry);
      });
    }
    if (this.luxData && this.luxData.length > 0) {
      this.updateSelection();
    }
  }

  /**
   * Eigene Implementierung der Filterung für diese Tabelle.
   * Iteriert über die Values des einzelnen Objektes und prüft dann, ob der Filter-Wert irgendwo vorkommt.
   * @param data
   * @param filter
   */
  private customFilterPredicate = (data: any, filter = '') => {
    for (const property in data) {
      if (Object.hasOwn(data, property)) {
        const dataEntry = data[property];
        if (LuxUtil.isDate(dataEntry)) {
          if (dataEntry.toLocaleString().toLowerCase().indexOf(filter) > -1) {
            return true;
          }
        } else {
          if ((dataEntry + '').toLowerCase().indexOf(filter) > -1) {
            return true;
          }
        }
      }
    }
    return false;
  };

  constructor() {
    // Datasource um eigene Filter-Funktionalität ergänzen
    this.dataSource.filterPredicate = this.customFilterPredicate;

    this.mediaQuery = this.queryObserver.activeMediaQuery;

    this.mediaQuerySubscription = this.queryObserver.getMediaQueryChangedAsObservable().subscribe((query: string) => {
      if (this.mediaQuery !== query) {
        this.mediaQuery = query;
        this.updateColumnsByMediaQuery();
      }
    });

    effect(() => {
      // Die folgende Zeile ist wichtig, damit der Effekt nur ausgelöst wird,
      // wenn sich luxShowColumnSelector ändert, andernfalls würde die Methode
      // bei jeder Änderung innerhalb der Komponente reagieren.
      const value = this.luxShowColumnSelector();

      // untracked(), da updateColumnsByMediaQuery() auch die Signal-Inputs der einzelnen
      // Columns (z.B. luxColumnDef, luxResponsiveAt) liest. Ohne untracked() würde dieser
      // Effekt zusätzlich bei jeder Änderung eines Column-Inputs erneut auslösen (siehe
      // Column-eigene change$-Subscription in updateColumnSubscriptions()).
      untracked(() => this.updateColumnsByMediaQuery());
    });

    effect(() => {
      this.luxHttpDAO();
      if (!this.init) {
        this.resetPaginatorToFirstPage();
        this.httpRequestConf.page = 0;
        this.clearSelected();
        this.emitSelectedEvent();
        this.loadHttpDAOData();
      }
    });

    effect(() => {
      this.luxClasses();
      this.insertCustomCSSClasses();
    });

    effect(() => {
      this.luxShowPagination();
      setTimeout(() => {
        this.handlePagination();
      });
    });

    effect(() => {
      this.luxShowFilter();
      this.handleFilter();
    });

    effect(() => {
      if (this.luxMultiSelect()) {
        this.clearSelected();
      }
      // updateColumnsByMediaQuery() baut _dataColumnDefs komplett neu auf (inkl. multiSelect-Spalte) und
      // läuft selbst asynchron als effect() (luxShowColumnSelector). Ein direktes unshift/filter hier würde
      // mit diesem Rebuild racen und zu doppelten Spalten-IDs führen (siehe MatSort-Fehler bei doppelter ID).
      // untracked(), s. Kommentar beim luxShowColumnSelector-Effekt weiter oben.
      untracked(() => this.updateColumnsByMediaQuery());

      setTimeout(() => {
        this.calculateProportions();
      });
    });

    effect(() => {
      const selected = this.luxSelectedInput();
      if (!selected && !this.luxSelected) {
        // Nothing to do
      } else if (selected && !this.luxSelected) {
        this.luxSelectedIntern(selected);
      } else if (!selected && this.luxSelected) {
        this.luxSelectedIntern(selected);
      } else if (selected && this.luxSelected) {
        if (this.luxSelected.size !== selected.size || !Array.from(selected).every((value) => this.luxSelected.has(value))) {
          this.luxSelectedIntern(selected);
        }
      }
    });
  }

  ngOnInit() {
    this.loadHiddenColumnsFromStorage();
    setTimeout(() => {
      if (this.luxHttpDAO()) {
        this.loadHttpDAOData();
      } else {
        this.updateDataSourceAttributes(this.luxData);
        this.handleSort();
        this.insertCustomCSSClasses();
      }
      this.init = false;
    });
  }

  ngAfterViewInit() {
    if (this.tableColumns.length > 0) {
      // Für den Fall das Spalten wegfallen/dazu kommen
      this.tableColumnsChangedSubscription = toObservable(this.tableColumnsQuery, { injector: this.injector }).subscribe(() => {
        this.updateColumnsByMediaQuery();
        this.updateColumnSubscriptions();
        this.updateColumnVisibilityOptions();
      });

      // Nach dem Init sollten einmal die Spalten aktualisiert werden
      setTimeout(() => {
        this.updateColumnsByMediaQuery();
      });
    }

    if (this.luxShowPagination()) {
      this.handlePagination();
    }
  }

  ngDoCheck() {
    const tableContainerElement = this.tableContainerElementQuery();
    if (!tableContainerElement) {
      return;
    }

    if (
      tableContainerElement.nativeElement.offsetWidth !== this.previousWidth ||
      tableContainerElement.nativeElement.offsetHeight !== this.previousHeight
    ) {
      this.previousWidth = tableContainerElement.nativeElement.offsetWidth;
      this.previousHeight = tableContainerElement.nativeElement.offsetHeight;

      this.calculateProportions();
    }
  }

  ngOnDestroy() {
    // Subscriptions auflösen
    this.columnSubscriptions.forEach((subscription: Subscription) => {
      subscription.unsubscribe();
    });
    if (this.httpDaoSubscription) {
      this.httpDaoSubscription.unsubscribe();
    }
    if (this.filterChangedSubscription) {
      this.filterChangedSubscription.unsubscribe();
    }
    if (this.tableColumnsChangedSubscription) {
      this.tableColumnsChangedSubscription.unsubscribe();
    }
    if (this.sortChangedSubscription) {
      this.sortChangedSubscription.unsubscribe();
    }
    if (this.selectedSubscription) {
      this.selectedSubscription.unsubscribe();
    }
  }

  /**
   * Zieht sich die aktuellen CSS-Klassen aus den zugewiesenen
   * CSS-Klassen.
   * @param row
   * @returns string
   */
  getCustomClassesForIndex(row: any): string {
    const customClasses = this.currentCustomClasses.find((value) => value.entry === row);
    return customClasses ? customClasses.classes : '';
  }

  /**
   * TrackBy-Funktion um die Tabelle etwas schneller zu machen.
   * @param index
   * @param item
   */
  trackFn(index: number, item: any) {
    return index;
  }

  onSingleClick(event: Event, rowItem: T, rowIndex: number) {
    if (!this.luxMultiSelect()) {
      this.luxSingleClicked.emit({ event, rowItem, rowIndex });
    }

    this.changeSelectedEntry(rowItem);
  }

  onDoubleClick(event: MouseEvent, rowItem: T) {
    if (!this.luxMultiSelect()) {
      this.luxDoubleClicked.emit({ event, rowItem });
    }
  }

  onPaginatorPageChange(pageEvent: LuxPageEvent): void {
    if (!this.luxHttpDAO()) {
      return;
    }

    this.httpRequestConf.page = pageEvent.pageIndex;
    this.httpRequestConf.pageSize = pageEvent.pageSize;
    this.loadHttpDAOData();
  }

  /**
   * Wird beim Klick auf eine Row aufgerufen und handelt das Sichern und Entfernen von
   * selektierten Einträgen.
   * @param entry
   * @param checkboxEvent
   */
  changeSelectedEntry(entry: any, checkboxEvent = false) {
    const luxMultiSelectDisabledProperty = this.luxMultiSelectDisabledProperty();
    if ((luxMultiSelectDisabledProperty && entry[luxMultiSelectDisabledProperty] === true) || this.luxDoubleClicked.observed) {
      return;
    }

    if ((!this.luxMultiSelectOnlyCheckboxClick() && !checkboxEvent) || (this.luxMultiSelectOnlyCheckboxClick() && checkboxEvent)) {
      if (this.luxMultiSelect()) {
        if (this.luxSelected.has(entry)) {
          this.deleteSelected(entry);
        } else {
          this.addSelected(entry);
        }
      } else {
        if (this.luxSelected.has(entry)) {
          // Wenn der selektierte Eintrag erneut angeklickt wird,
          // wird die Selektion entfernt.
          this.clearSelected();
        } else {
          this.clearSelected();
          this.addSelected(entry);
        }
      }

      this.updateSelectedIntern();
    }
  }

  /**
   * Selektiert/Deselektiert alle Einträge in dieser Tabelle.
   *
   * Voraussetzung dafür ist, das Multiselect aktiv ist und keine Http-Table vorliegt.
   */
  changeSelectedEntries() {
    if (this.luxMultiSelect()) {
      // Bei HTTP-Tabellen selektieren wir nur die aktuell geladenen (gefilterten) Elemente
      // und nicht alle Elemente serverseitig.
      if (this.checkFilteredAllSelected()) {
        this.dataSource.filteredData.forEach((dataEntry: any) => {
          if (!this.isEntryDisabled(dataEntry)) {
            this.deleteSelected(dataEntry);
          }
        });
      } else {
        this.dataSource.filteredData.forEach((dataEntry: any) => {
          if (!this.isEntryDisabled(dataEntry)) {
            this.addSelected(dataEntry);
          }
        });
      }
      this.updateSelectedIntern();
    }
  }

  private updateSelectedIntern() {
    this.emitSelectedEvent();
    this.dataSource.selectedEntries = this.luxSelected;
    this.allSelected = this.checkFilteredAllSelected();
  }

  /**
   * Prüft, ob die aktuell angezeigten Einträge alle selektiert sind oder nicht.
   */
  checkFilteredAllSelected(): boolean {
    let result = true;
    if (this.luxSelected.size === 0) {
      result = false;
    } else {
      // Prüfen, ob die gefilterten Daten selected sind
      this.dataSource.filteredData.forEach((dataEntry: any) => {
        if (!this.isEntryDisabled(dataEntry) && !this.luxSelected.has(dataEntry)) {
          result = false;
        }
      });
    }

    return result;
  }

  /**
   * Gibt zurück, ob irgendein Footer-Element für diese Tabelle aktuell sichtbar ist.
   */
  anyFootersAvailable() {
    return this.luxMultiSelect() || !!this.tableColumns.find((column: LuxTableColumnComponent) => !!column.footer());
  }

  /**
   * Aktualisiert die DataSource und eventuell Subscriptions sowie die CustomCSS-Classes
   * nach einer Änderung.
   * @param data
   */
  private updateDataSourceAttributes(data: any[]) {
    if (!this.luxHttpDAO() && this.luxAutoPaginate() && data && data.length > LuxTableComponent.AUTO_PAGINATION_START) {
      this.luxShowPagination.set(true);
    }
    if (!this.luxHttpDAO()) {
      if (this.luxShowPagination()) {
        this.handlePagination();
      }
    }
    if (!this.luxHttpDAO()) {
      this.dataSource.sort = this.sort ?? null;
    }
    if (!this.luxHttpDAO()) {
      this.dataSource.totalElements = this.dataSource.data ? this.dataSource.data.length : 0;
    }
  }

  /**
   * Prüft anhand der mitgegebenen Callbacks die CSS-Klassen
   * für die einzelnen Rows.
   */
  private insertCustomCSSClasses() {
    if (this.luxClasses() && this.luxData) {
      this.currentCustomClasses = [];
      this.luxData.forEach((entry: any) => {
        let classes = '';
        this.luxClasses().forEach((cssClass: ICustomCSSConfig) => {
          if (cssClass.check(entry)) {
            classes += cssClass.class + ' ';
          }
        });
        this.currentCustomClasses.push({ entry, classes });
      });
    }
  }

  /**
   * Gibt über den liveAnnouncer eine Nachricht aus, dass sich die Sortierung einer Spalte geändert hat.
   * @param sort
   */
  announceSortChange(sort: Sort) {
    const index = this.tableColumns.findIndex((tableColumn: LuxTableColumnComponent) => sort.active === tableColumn.luxColumnDef());
    let columnDef = index > -1 ? this.tableColumns[index].luxColumnDef() : null;
    if (columnDef === null) {
      columnDef = sort.active === 'multiSelect' ? 'multiSelect' : null;
    }
    if (columnDef !== null) {
      let directionDescription;
      switch (sort.direction) {
        case 'desc':
          directionDescription = this.tService.translate('luxc.table.sort.descending');
          break;
        case 'asc':
          directionDescription = this.tService.translate('luxc.table.sort.ascending');
          break;
        case '':
          directionDescription = this.tService.translate('luxc.table.sort.no_longer');
          break;
      }

      this.liveAnnouncer.announce(
        this.tService.translate(`luxc.table.sort.announce`, { column: columnDef, direction: directionDescription }),
        'assertive'
      );
    }
  }

  /**
   * Aktualisiert die momentan angezeigten Spalten anhand der für sie definierten
   * Responsive-Queries und Verhaltensweisen.
   */
  private updateColumnsByMediaQuery() {
    if (this.tableColumns.length === 0) {
      return;
    }

    this._dataColumnDefs = [];

    // wenn Multiselect, dann benötigen wir hier noch eine Spalte mehr
    if (this.luxMultiSelect()) {
      this._dataColumnDefs.push('multiSelect');
    }

    this.tableColumns.forEach((column: LuxTableColumnComponent) => {
      if (this.luxShowColumnSelector()) {
        if (!this.hiddenColumns.includes(column.luxColumnDef())) {
          this._dataColumnDefs.push(column.luxColumnDef());
        }
      } else {
        this._dataColumnDefs.push(column.luxColumnDef());
      }
    });
    this.movedTableColumns = [];
    this.hasMovedColumnsMap.clear();
    // Zuerst die auszublendenden Spalten durchgehen
    this.tableColumns.forEach((tableColumn: LuxTableColumnComponent) => {
      if (
        (tableColumn.luxResponsiveAt() && !tableColumn.luxResponsiveBehaviour()) ||
        (!tableColumn.luxResponsiveAt() && tableColumn.luxResponsiveBehaviour())
      ) {
        this.luxConsole.error(
          `Achtung! Die Column '${tableColumn.luxColumnDef()}' hat entweder keine Media-Queries ` +
            `oder kein Responsive-Verhalten zugewiesen bekommen.`
        );
      } else if (this.doesResponsiveAtApply(tableColumn.luxResponsiveAt())) {
        // Schauen, ob eine Spalte angegeben wurde, in welche sich diese hier verschieben kann
        if (this._dataColumnDefs.find((column: string) => column === tableColumn.luxResponsiveBehaviour())) {
          // Wenn ja, die Spalte merken und vorerst ausblenden
          this.movedTableColumns.push(tableColumn);
          this.hasMovedColumnsMap.set(tableColumn.luxResponsiveBehaviour(), true);
        }

        this._dataColumnDefs = this.dataColumnDefs.filter((dataColumn: string) => dataColumn !== tableColumn.luxColumnDef());
      }
    });

    // Diese Methode wird u.a. aus Subscriptions/Effects heraus aufgerufen, die außerhalb des
    // normalen Input-Bindings laufen. Unter OnPush muss daher explizit markForCheck() aufgerufen
    // werden, damit die View (z.B. sticky/moved/hidden Columns) neu geprüft wird.
    this.cdr.markForCheck();
  }

  /**
   * Prüft, ob die aktuelle MediaQuery mit der übergebenen MediaQuery/den übergebenen MediaQueries übereinstimmt.
   * @param responsiveAt
   */
  private doesResponsiveAtApply(responsiveAt: string | string[] | null) {
    const mediaQueries: string[] = [];

    if (typeof responsiveAt === 'string' && responsiveAt) {
      mediaQueries.push(responsiveAt);
    } else if (Array.isArray(responsiveAt) && responsiveAt.length > 0) {
      mediaQueries.push(...responsiveAt);
    }

    for (const mediaQuery of mediaQueries) {
      if (mediaQuery === this.mediaQuery) {
        return true;
      }
    }
    return false;
  }

  /**
   * Durchläuft die aktuellen TableColumns und hört auf Changes in den Properties
   * der Columns und merkt sich die Subscriptions.
   */
  private updateColumnSubscriptions() {
    this.columnSubscriptions.forEach((subscription: Subscription) => {
      subscription.unsubscribe();
    });
    this.columnSubscriptions = [];
    this.tableColumns.forEach((column: LuxTableColumnComponent) => {
      this.columnSubscriptions.push(
        column.change$.subscribe(() => {
          this.updateColumnsByMediaQuery();
        })
      );
    });
  }

  /**
   * Triggert über das DAO die Abfrage nach neuen Daten.
   * Sendet dabei das Request-Conf Objekt, welches Informationen bzgl.
   * page, pageSize, filter, sort, order mitgibt.
   * @param filteredBy?
   * @param filteredBy
   */
  loadHttpDAOData(filteredBy?: string) {
    const luxHttpDAO = this.luxHttpDAO();
    if (luxHttpDAO) {
      this.isLoadingResults = true;
      luxHttpDAO
        .loadData(this.httpRequestConf)
        .pipe(
          tap((data: ILuxTableHttpDaoStructure) => {
            this.isLoadingResults = false;
            // Wenn ein Filter-Text gegeben ist, sich dieser aber vom Aktuellen unterscheiden, brechen wir die Datenaktualisierung ab
            if (filteredBy && this.httpRequestConf.filter !== filteredBy) {
              return;
            }

            if (data) {
              this.dataSource.totalElements = data.totalCount;
              this.luxData = data.items;

              if (this.luxAutoPaginate() && data.totalCount > LuxTableComponent.AUTO_PAGINATION_START) {
                this.luxShowPagination.set(true);
              }
            } else {
              this.dataSource.totalElements = 0;
              this.luxData = [];
            }
            this.insertCustomCSSClasses();
          }),
          catchError((error) => {
            this.isLoadingResults = false;
            return of(error);
          })
        )
        .subscribe();
    }
  }

  /**
   * Wird aufgerufen, wenn der Sort neu zur DataSource hinzugefügt werden soll (Data wurde neu gesetzt).
   * Resettet die Pagination und aktualisiert, wenn es sich um eine asynchrone Tabelle handelt die
   * requestConf.
   */
  private handleSort() {
    if (this.sort) {
      if (this.sortChangedSubscription) {
        this.sortChangedSubscription.unsubscribe();
      }
      this.sortChangedSubscription = this.sort.sortChange.subscribe((sort: any) => {
        // If this is a server-side table with multiSelect enabled,
        // ignore sort events on the internal selection column to avoid
        // inconsistent selection state and duplicate entries.
        if (sort && sort.active === 'multiSelect' && this.luxHttpDAO() && this.luxMultiSelect()) {
          return;
        }

        this.resetPaginatorToFirstPage();

        if (this.luxHttpDAO()) {
          this.httpRequestConf.page = this.getPaginatorPageIndex();
          this.httpRequestConf.sort = sort.active;
          this.httpRequestConf.order = sort.direction;
          this.loadHttpDAOData();
        }
      });
    }

    this.calculateProportions();
  }

  /**
   * Wird nach dem set von luxShowFilter aufgerufen und fängt neue Filter-Operationen ab und
   * aktualisiert dementsprechend die Daten.
   */
  private handleFilter() {
    if (this.filterChangedSubscription) {
      this.filterChangedSubscription.unsubscribe();
    }
    if (this.luxShowFilter()) {
      this.filterChangedSubscription = this.filtered$
        .asObservable()
        .pipe(
          tap(() => (this.isLoadingResults = true)),
          debounceTime(500),
          distinctUntilChanged((x: string, y: string) => {
            if (x === y) {
              this.isLoadingResults = false;
            }

            return x === y;
          })
        )
        .subscribe((filterValue: string) => {
          filterValue = filterValue.trim();
          filterValue = filterValue.toLocaleLowerCase();
          this.resetPaginatorToFirstPage();
          this.isLoadingResults = false;
          if (!this.luxHttpDAO()) {
            this.dataSource.filter = filterValue;
          }
          if (this.luxHttpDAO()) {
            this.httpRequestConf.filter = filterValue;
            this.httpRequestConf.page = this.getPaginatorPageIndex();
            this.loadHttpDAOData(filterValue);
          }
        });
    }
    this.calculateProportions();
  }

  /**
   * Wird nach dem set von luxShowPagination aufgerufen und setzt, wenn es sich hier um
   * eine asynchrone Tabelle handelt eine Subscription um Pagination-Änderungen zu erhalten.
   */
  private handlePagination() {
    if (this.luxShowPagination()) {
      if (this.luxHttpDAO()) {
        this.httpRequestConf.page = this.getPaginatorPageIndex();
        this.httpRequestConf.pageSize = this.getPaginatorPageSize();
      }
      if (!this.luxHttpDAO()) {
        this.dataSource.paginator = this.paginator?.getMatPaginator() ?? null;
      }
    } else {
      this.dataSource.paginator = null;
    }
    this.calculateProportions();
  }

  private resetPaginatorToFirstPage(): void {
    if (this.paginator) {
      this.paginator.luxPageIndex.set(0);
    }
  }

  private getPaginatorPageIndex(): number {
    return this.paginator?.luxPageIndex() ?? 0;
  }

  private getPaginatorPageSize(): number {
    return this.paginator?.getMatPaginator()?.pageSize ?? this.luxPageSize();
  }

  /**
   * Erzeugt einen neuen String für die Höhenberechnung der Tabelle und setzt die Minimalbreite für die Tabelle
   * (wenn möglich).
   */
  private calculateProportions() {
    setTimeout(() => {
      const filter = this.filterElement ? this.filterElement.nativeElement.offsetHeight : 0;
      const pagination = this.paginatorElement ? this.paginatorElement.nativeElement.scrollHeight : 0;
      const progress = 15;
      const temp = 'calc(100% - ' + progress + 'px' + ' - ' + pagination + 'px' + ' - ' + filter + 'px)';
      if (temp !== this.tableHeightCSSCalc) {
        this.tableHeightCSSCalc = temp;
      }

      const luxMinWidthPx = this.luxMinWidthPx();
      this.tableMinWidth = luxMinWidthPx > -1 ? luxMinWidthPx + 'px' : 'unset';
    });
  }

  /**
   * Aktualisiert die selectedEntries dieser Component anhand der aktuell gesetzten luxSelected-Elemente.
   *
   * Dabei werden die einzelnen Elemente zuerst mithilfe der luxCompareWith- und luxPickValue-Functions miteinander
   * verglichen.
   */
  private updateSelection() {
    // Prüfen ob selected gesetzt ist
    if (this.luxSelected.size > 0) {
      // Die selected-Einträge durchgehen und schauen, ob diese im data-Block enthalten sind
      const foundEntries: any[] = [];
      this.luxSelected.forEach((entry: any) => {
        const newEntry = this.dataSource.data.find((dataEntry: any) =>
          this.luxCompareWith()(this.luxPickValue()(entry), this.luxPickValue()(dataEntry))
        );

        // Merkt sich den Entry, wenn dieser noch nicht in der Selected-Liste ist (wenn es sich um eine HTTP-Tabelle handelt)
        if (newEntry && (!this.luxHttpDAO() || (this.luxHttpDAO() && !this.luxSelected.has(newEntry)))) {
          foundEntries.push(newEntry);
          this.deleteSelected(entry);
        }
      });
      // Nur bei nicht-HTTP-Tabellen die Selektion einmal leeren
      if (!this.luxHttpDAO()) {
        this.clearSelected();
      }
      foundEntries.forEach((entry: boolean) => this.addSelected(entry));
    }
    this.updateSelectedIntern();
  }

  private emitSelectedEvent() {
    const newData = Array.from(this.luxSelected);

    // Wenn das Array FormGroups enthält,
    // wirft JSON.stringify einen Fehler,
    // da FormGroups nicht serialisierbar sind.
    let newDataString: string;
    if (newData && newData.length > 0 && newData[0] instanceof FormGroup) {
      newDataString = JSON.stringify(newData.map((item) => (item as FormGroup).value));
    } else {
      newDataString = JSON.stringify(newData);
    }

    if (this.lastSelectedEventData !== newDataString) {
      this.lastSelectedEventData = newDataString;

      this.luxSelectedChange.next(this.luxSelected);
      this.luxSelectedAsArrayChange.next(newData);
    }
  }

  private isEntryDisabled(dataEntry: any) {
    const luxMultiSelectDisabledProperty = this.luxMultiSelectDisabledProperty();
    return luxMultiSelectDisabledProperty ? dataEntry[luxMultiSelectDisabledProperty] === true : false;
  }

  addSelected(entry: any) {
    this.luxSelected.add(entry);
  }

  deleteSelected(entry: any) {
    this.luxSelected.delete(entry);
  }

  clearSelected() {
    this.luxSelected.clear();
  }

  // =============================================================
  // Column Visibility Handling
  // =============================================================

  onHiddenColumnsChange(newHiddenColumns: string[]) {
    const luxColumnStorageKey = this.luxColumnStorageKey();
    if (luxColumnStorageKey) {
      this.luxColumnVisibilityStore().save(luxColumnStorageKey, [...newHiddenColumns]);
    }

    this.luxHiddenColumnsChange.emit([...newHiddenColumns]);
    this.updateColumnsByMediaQuery();
  }

  private loadHiddenColumnsFromStorage() {
    const luxColumnStorageKey = this.luxColumnStorageKey();
    if (luxColumnStorageKey) {
      const invisibleColumns = this.luxColumnVisibilityStore().load(luxColumnStorageKey);
      if (Array.isArray(invisibleColumns) && invisibleColumns.length) {
        this.hiddenColumns = invisibleColumns.filter((v) => typeof v === 'string');
      }
    }
  }

  private updateColumnVisibilityOptions() {
    this.allColumnsForVisibility = this.tableColumns.map((c) => ({
      label: c.luxConfigLabel() ? c.luxConfigLabel()! : c.luxColumnDef(),
      value: c.luxColumnDef()
    }));
  }
}
