import { Directive, OnDestroy, OutputRefSubscription, signal } from '@angular/core';
import { ICustomCSSConfig, LuxTableComponent } from '@ihk-gfi/lux-components';
import { ColumnConfig } from './column-config';
import { ResponsiveBehaviour } from './responsive-behaviour';

@Directive()
export abstract class TableExampleBaseClass implements OnDestroy {
  pageSizeOptions = [
    { label: '[5, 10, 25, 50]', value: [5, 10, 25, 50] },
    { label: '[10, 20, 30, 40]', value: [10, 20, 30, 40] },
    { label: '[25, 50, 75, 100, 200]', value: [25, 50, 75, 100, 200] }
  ];
  mediaQueryOptions = ['xs', 'sm', 'md', 'lg', 'xl'];
  columnWidthOptions = [
    { label: '[20%, 20%, 60%]', value: [20, 20, 60] },
    { label: '[33%, 33%, 34%]', value: [33, 33, 34] },
    { label: '[50%, 25%, 25%]', value: [50, 25, 25] }
  ];
  tableCSS: ICustomCSSConfig[] = [
    {
      class: 'lux-text-highlight-primary',
      check: (element) => element.date.getFullYear() === 2016
    },
    {
      class: 'lux-text-highlight-primary-strong',
      check: (element) => element.date.getFullYear() === 2016
    },
    {
      class: 'lux-text-highlight-success',
      check: (element) => element.date.getFullYear() === 2017
    },
    {
      class: 'lux-text-highlight-success-strong',
      check: (element) => element.date.getFullYear() === 2017
    },
    {
      class: 'lux-text-highlight-alert',
      check: (element) => element.date.getFullYear() === 2018
    },
    {
      class: 'lux-text-highlight-alert-strong',
      check: (element) => element.date.getFullYear() === 2018
    },
    {
      class: 'lux-text-highlight-error',
      check: (element) => element.date.getFullYear() === 2019
    },
    {
      class: 'lux-text-highlight-error-strong',
      check: (element) => element.date.getFullYear() === 2019
    }
  ];
  readonly filter = signal(false);
  readonly filterText = signal('Filter hier eingeben');
  readonly noDataText = signal('Keine Daten vorhanden');
  readonly pagination = signal(true);
  readonly pageSize = signal(5);
  readonly pageSizeOption = signal(this.pageSizeOptions[0].value);
  readonly autoPagination = signal(true);
  readonly cssClass = signal<ICustomCSSConfig[]>([]);
  readonly pagerDisabled = signal(false);
  readonly pagerTooltip = signal('');
  readonly pagerFirstLastButton = signal(true);
  readonly columnWidthOption = signal(this.columnWidthOptions[1].value);
  readonly multiSelectOnlyCheckboxClick = signal(true);
  readonly multiSelectDisabledPropertyActive = signal(false);
  readonly multiSelectDisabledProperty = signal('disabled');
  readonly calculateProportions = signal(false);
  readonly minWidthPx = signal(-1);
  readonly tableHeightPx = signal(500);
  readonly hideBorders = signal(false);
  readonly selected = signal(new Set<any>());
  readonly unboundSelected = signal(new Set<any>());
  readonly bindLuxSelected = signal(true);
  readonly observeSelectedChange = signal(true);
  readonly observeSelectedAsArrayChange = signal(true);
  nameConfig: ColumnConfig = new ColumnConfig({ label: 'Name', sticky: false });
  symbolConfig: ColumnConfig = new ColumnConfig({ label: 'Symbol' });
  dateConfig: ColumnConfig = new ColumnConfig({ label: 'Datum', sticky: false,  responsiveAt: ['xs', 'sm', 'md'], responsiveBehaviour: ResponsiveBehaviour.COLUMN_HIDE });
  columnConfigs = [this.nameConfig, this.symbolConfig, this.dateConfig];
  dblClickSub?: OutputRefSubscription;
  readonly alignElementsTop = signal(false);

  private readonly _multiSelect = signal(true);
  private readonly _doubleClickActive = signal(false);

  ngOnDestroy(): void {
    this.dblClickSub?.unsubscribe();
  }

  get doubleClickActive() {
    return this._doubleClickActive();
  }

  set doubleClickActive(active: boolean) {
    this._doubleClickActive.set(active);

    if (active) {
      this.dblClickSub = this.getTableComponent().luxDoubleClicked.subscribe((rowItem) => {
        console.log('luxDoubleClicked fired ->', rowItem);
      });
    } else {
      this.dblClickSub?.unsubscribe();
    }
  }

  get multiSelect() {
    return this._multiSelect();
  }

  set multiSelect(multiSelect: boolean) {
    this._multiSelect.set(multiSelect);

    if (multiSelect) {
      this._doubleClickActive.set(false);
    } else {
      this.multiSelectOnlyCheckboxClick.set(false);
    }
  }

  abstract getTableComponent(): LuxTableComponent;

  abstract getDataArr(): any[];

  abstract refreshSelectionBindings(): void;

  compareFn(o1: any, o2: any) {
    return o1.name === o2.name;
  }

  pickPageSize(selected: any) {
    return selected ? selected.value : selected;
  }

  pickColWidth(selected: any) {
    return selected ? selected.value : selected;
  }

  preselect() {
    const newSelected = new Set();
    newSelected.add({ name: 'Hydrogen', symbol: 'H', date: new Date(2017, 11, 24), disabled: false });
    newSelected.add({ name: 'Helium', symbol: 'He', date: new Date(2017, 11, 22), disabled: false });
    newSelected.add({ name: 'Lithium', symbol: 'Li', date: new Date(2018, 11, 21), disabled: false });
    newSelected.add({ name: 'Beryllium', symbol: 'Be', date: new Date(2018, 11, 18), disabled: false });
    newSelected.add({ name: 'Boron', symbol: 'B', date: new Date(2018, 10, 24), disabled: false });

    this.selected.set(newSelected);
  }
}
