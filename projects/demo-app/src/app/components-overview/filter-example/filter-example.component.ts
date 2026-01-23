import { JsonPipe } from '@angular/common';
import { Component, OnDestroy, OnInit, ViewChild, inject } from '@angular/core';
import {
  LuxAutocompleteAcComponent,
  LuxButtonComponent,
  LuxDatepickerAcComponent,
  LuxDatetimepickerAcComponent,
  LuxFieldValues,
  LuxFilter,
  LuxFilterFormComponent,
  LuxFilterFormExtendedComponent,
  LuxFilterItem,
  LuxFilterItemDirective,
  LuxInputAcComponent,
  LuxLookupAutocompleteAcComponent,
  LuxLookupComboboxAcComponent,
  LuxLookupParameters,
  LuxMediaQueryObserverService,
  LuxRadioAcComponent,
  LuxSelectAcComponent,
  LuxTextareaAcComponent,
  LuxThemePalette,
  LuxToggleAcComponent,
  LuxUtil
} from '@ihk-gfi/lux-components';
import { Subscription } from 'rxjs';
import { ExampleBaseContentComponent } from '../../example-base/example-base-root/example-base-subcomponents/example-base-content/example-base-content.component';
import { ExampleBaseAdvancedOptionsComponent } from '../../example-base/example-base-root/example-base-subcomponents/example-base-options/example-base-advanced-options.component';
import { ExampleBaseSimpleOptionsComponent } from '../../example-base/example-base-root/example-base-subcomponents/example-base-options/example-base-simple-options.component';
import { ExampleBaseStructureComponent } from '../../example-base/example-base-root/example-base-subcomponents/example-base-structure/example-base-structure.component';
import { CustomFilterItemComponent } from "./custom-filter-item.component";

@Component({
  selector: 'lux-filter-example',
  templateUrl: './filter-example.component.html',
  styleUrls: ['./filter-example.component.scss'],
  imports: [
    LuxLookupComboboxAcComponent,
    LuxLookupAutocompleteAcComponent,
    LuxFilterItemDirective,
    LuxFilterFormExtendedComponent,
    LuxFilterFormComponent,
    LuxButtonComponent,
    LuxToggleAcComponent,
    LuxTextareaAcComponent,
    LuxSelectAcComponent,
    LuxRadioAcComponent,
    LuxInputAcComponent,
    LuxDatetimepickerAcComponent,
    LuxDatepickerAcComponent,
    LuxAutocompleteAcComponent,
    ExampleBaseStructureComponent,
    ExampleBaseContentComponent,
    ExampleBaseSimpleOptionsComponent,
    ExampleBaseAdvancedOptionsComponent,
    JsonPipe,
    CustomFilterItemComponent
]
})
export class FilterExampleComponent implements OnInit, OnDestroy {
  private mediaQuery = inject(LuxMediaQueryObserverService);

  @ViewChild(LuxFilterFormComponent) filterComponent!: LuxFilterFormComponent;
  @ViewChild(LuxFilterFormExtendedComponent) filterExtendedOptionsComponent?: LuxFilterFormExtendedComponent;

  parameters = new LuxLookupParameters({
    knr: 101,
    fields: [LuxFieldValues.kurz, LuxFieldValues.lang1, LuxFieldValues.lang2]
  });

  autoCompleteOptions: any[] = [
    { label: 'Auto A', value: 'a' },
    { label: 'Auto B', value: 'b' },
    { label: 'Auto C', value: 'c' }
  ];

  radioOptions: any[] = [
    { label: 'A', value: 'a' },
    { label: 'B', value: 'b' }
  ];

  singleSelectOptions: any[] = [
    { label: 'Single 4711', value: '4711' },
    { label: 'Single 4712', value: '4712' },
    { label: 'Single 4713', value: '4713' }
  ];

  multiSelectOptions: any[] = [
    { label: 'Multi 1', value: 1 },
    { label: 'Multi 2', value: 2 },
    { label: 'Multi 3', value: 3 }
  ];

  initFilter: any = {};
  initFilterAc: any = {};
  currentFilter: any = {};
  currentFilterAc: any = {};
  replaceFilterJson = `{
  "input": "Lorem ipsum",
  "datepicker": "${LuxUtil.newDateWithoutTime().toISOString()}",
  "toggle": true
  }`;

  title = 'Filter';
  hideMenu = false;
  expanded = false;
  showFilterChips = true;
  hideChipsBorder = false;

  storedFilters: LuxFilter[] = [
    {
      name: 'Demo-Test-Filter',
      data: {
        autocompleteLookup: {
          key: '1',
          kurzText: 'Frankreich',
          langText1: 'Frankreich',
          isUngueltig: false
        },
        comboboxLookup: [
          {
            key: '4',
            kurzText: 'Deutschland',
            langText1: 'Deutschland',
            isUngueltig: false
          }
        ],
        input: 'Max Mustermann',
        autocomplete: {
          label: 'Auto A',
          value: 'a'
        },
        datepicker: '2020-07-21T00:00:00.000Z',
        datetimepicker: '2020-07-21T12:15:00.000Z',
        singleSelect: {
          label: 'Single 4711',
          value: '4711'
        },
        multiSelect: [
          {
            label: 'Multi 1',
            value: 1
          },
          {
            label: 'Multi 2',
            value: 2
          },
          {
            label: 'Multi 3',
            value: 3
          }
        ],
        toggle: true,
        radio: 'b',
        customComponentInput: 'ci',
        customComponentToggle: true
      }
    }
  ];
  storedFiltersAc: LuxFilter[] = JSON.parse(JSON.stringify(this.storedFilters));

  mediaQuerySubscription: Subscription;

  customDisabled = false;
  customHidden = false;
  inputDisabled = false;
  inputHidden = false;
  autoCompleteDisabled = false;
  autoCompleteHidden = false;
  autoCompleteLookupDisabled = false;
  autoCompleteLookupHidden = false;
  datepickerDisabled = false;
  datepickerHidden = false;
  datetimepickerDisabled = false;
  datetimepickerHidden = false;
  singleSelectDisabled = false;
  singleSelectHidden = false;
  multiSelectDisabled = false;
  multiSelectHidden = false;
  selectLookupDisabled = false;
  selectLookupHidden = false;
  toggleSelectDisabled = false;
  toggleSelectHidden = false;
  radioSelectDisabled = false;
  radioSelectHidden = false;

  buttonColorOptions = ['default', 'primary', 'accent', 'warn'];
  buttonFlat = true;
  buttonFilterColor: LuxThemePalette = 'primary';
  buttonDialogSave: LuxThemePalette = 'primary';
  buttonDialogLoad: LuxThemePalette = 'primary';
  buttonDialogDelete: LuxThemePalette = 'warn';
  buttonDialogCancel: LuxThemePalette = 'primary';
  buttonDialogClose: LuxThemePalette = 'primary';

  openLabel = '';
  closeLabel = '';

  disableShortcut = false;
  initRunning = false;
  radioPickValueFn = (o: { label: string; value: string }) => o.value;

  constructor() {
    this.mediaQuerySubscription = this.mediaQuery.getMediaQueryChangedAsObservable().subscribe(() => {
      this.showFilterChips = !this.mediaQuery.isSmallerOrEqual('xs');
    });
  }

  ngOnInit(): void {
    this.initRunning = true;

    // Hier wird die setTimeout-Methode verwendet, um einen Backend-Call zu simulieren.
    setTimeout(() => {
      this.initFilter = { input: 'Lorem ipsum' };
      this.initFilterAc = { input: 'Lorem ipsum' };
      this.currentFilter = this.initFilter;
      this.currentFilterAc = this.initFilterAc;

      setTimeout(() => {
        this.initRunning = false;
      });
    }, 100);
  }

  ngOnDestroy(): void {
    this.mediaQuerySubscription.unsubscribe();
  }

  compareValueFn = (o1: any, o2: any) => o1.value === o2.value;

  renderToggleFn(_filterItem: LuxFilterItem<boolean>, value: boolean) {
    return value ? 'aktiviert' : 'deaktiviert';
  }

  onFilter(filter: any) {
    this.currentFilter = filter;

    if (!this.initRunning) {
      console.log('Neuer Filter:', filter);
    }
  }

  onFilterAc(filter: any) {
    this.currentFilterAc = filter;

    if (!this.initRunning) {
      console.log('Neuer Filter:', filter);
    }
  }

  onSave(filter: LuxFilter) {
    this.saveFilter(filter);
  }

  onSaveAc(filter: LuxFilter) {
    this.saveFilterAc(filter);
  }

  onDelete(filter: LuxFilter) {
    console.log('Filter deleted.', filter);
  }

  onReset() {
    console.log('Filter reset.');
  }

  onLoad(filterName: string) {
    this.initFilter = this.loadFilter(filterName);
  }

  onLoadAc(filterName: string) {
    this.initFilterAc = this.loadFilterAc(filterName);
  }

  onSetFilter() {
    this.initFilter = JSON.parse(this.replaceFilterJson);
    this.initFilterAc = JSON.parse(this.replaceFilterJson);
  }

  private saveFilter(filter: LuxFilter) {
    // Hier müssten die Filtereinstellungen (z.B. in die Datenbank) geschrieben werden.
    this.storedFilters.push(filter);
    console.log('Filter saved.', filter);
  }

  private saveFilterAc(filter: LuxFilter) {
    // Hier müssten die Filtereinstellungen (z.B. in die Datenbank) geschrieben werden.
    this.storedFiltersAc.push(filter);
    console.log('Filter saved.', filter);
  }

  private loadFilter(filterName: string) {
    // Hier müssten die Filtereinstellungen (z.B. aus der Datenbank) gelesen und zurückgeliefert werden.
    const luxFilter = this.storedFilters.find((filter) => filter.name === filterName);

    if (!luxFilter) {
      throw Error(`Es konnte kein Filter mit dem Namen "${filterName}" gefunden werden.`);
    }

    return JSON.parse(JSON.stringify(luxFilter.data));
  }

  private loadFilterAc(filterName: string) {
    // Hier müssten die Filtereinstellungen (z.B. aus der Datenbank) gelesen und zurückgeliefert werden.
    const luxFilter = this.storedFiltersAc.find((filter) => filter.name === filterName);

    if (!luxFilter) {
      throw Error(`Es konnte kein Filter mit dem Namen "${filterName}" gefunden werden.`);
    }

    return JSON.parse(JSON.stringify(luxFilter.data));
  }
}
