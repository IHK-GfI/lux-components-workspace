import { JsonPipe } from '@angular/common';
import { Component, OnDestroy, OnInit, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import {
  LuxAutocompleteComponent,
  LuxButtonComponent,
  LuxDatepickerComponent,
  LuxDatetimepickerComponent,
  LuxFieldValues,
  LuxFilter,
  LuxFilterFormComponent,
  LuxFilterFormExtendedComponent,
  LuxFilterItem,
  LuxFilterItemDirective,
  LuxInputComponent,
  LuxLookupAutocompleteComponent,
  LuxLookupComboboxComponent,
  LuxLookupParameters,
  LuxMediaQueryObserverService,
  LuxRadioComponent,
  LuxSelectComponent,
  LuxTextareaComponent,
  LuxThemePalette,
  LuxTimepickerComponent,
  LuxToggleComponent,
  LuxUtil
} from '@ihk-gfi/lux-components';
import { Subscription } from 'rxjs';
import { ExampleBaseContentComponent } from '../../example-base/example-base-root/example-base-subcomponents/example-base-content/example-base-content.component';
import { ExampleBaseAdvancedOptionsComponent } from '../../example-base/example-base-root/example-base-subcomponents/example-base-options/example-base-advanced-options.component';
import { ExampleBaseSimpleOptionsComponent } from '../../example-base/example-base-root/example-base-subcomponents/example-base-options/example-base-simple-options.component';
import { ExampleBaseStructureComponent } from '../../example-base/example-base-root/example-base-subcomponents/example-base-structure/example-base-structure.component';
import { CustomFilterItemComponent } from './custom-filter-item.component';

@Component({
  selector: 'lux-filter-example',
  templateUrl: './filter-example.component.html',
  styleUrls: ['./filter-example.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    LuxLookupComboboxComponent,
    LuxLookupAutocompleteComponent,
    LuxFilterItemDirective,
    LuxFilterFormExtendedComponent,
    LuxFilterFormComponent,
    LuxButtonComponent,
    LuxToggleComponent,
    LuxTextareaComponent,
    LuxSelectComponent,
    LuxRadioComponent,
    LuxInputComponent,
    LuxDatetimepickerComponent,
    LuxDatepickerComponent,
    LuxTimepickerComponent,
    LuxAutocompleteComponent,
    ExampleBaseStructureComponent,
    ExampleBaseContentComponent,
    ExampleBaseSimpleOptionsComponent,
    ExampleBaseAdvancedOptionsComponent,
    JsonPipe,
    CustomFilterItemComponent
  ]
})
export class FilterExampleComponent implements OnInit, OnDestroy {
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

  readonly initFilter = signal<any>({});
  readonly initFilterAc = signal<any>({});
  readonly currentFilter = signal<any>({});
  readonly currentFilterAc = signal<any>({});
  readonly replaceFilterJson = signal(`{
  "input": "Lorem ipsum",
  "datepicker": "${LuxUtil.newDateWithoutTime().toISOString()}",
  "toggle": true
  }`);

  readonly title = signal('Filter');
  readonly hideMenu = signal(false);
  readonly expanded = signal(false);
  readonly showFilterChips = signal(true);
  readonly hideChipsBorder = signal(false);

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
        combinedDateTime: '2020-07-21T14:30:00.000Z',
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

  readonly customDisabled = signal(false);
  readonly customHidden = signal(false);
  readonly inputDisabled = signal(false);
  readonly inputHidden = signal(false);
  readonly autoCompleteDisabled = signal(false);
  readonly autoCompleteHidden = signal(false);
  readonly autoCompleteLookupDisabled = signal(false);
  readonly autoCompleteLookupHidden = signal(false);
  readonly datepickerDisabled = signal(false);
  readonly datepickerHidden = signal(false);
  readonly datetimepickerDisabled = signal(false);
  readonly datetimepickerHidden = signal(false);
  readonly combinedDateTimeDisabled = signal(false);
  readonly combinedDateTimeHidden = signal(false);
  readonly singleSelectDisabled = signal(false);
  readonly singleSelectHidden = signal(false);
  readonly multiSelectDisabled = signal(false);
  readonly multiSelectHidden = signal(false);
  readonly selectLookupDisabled = signal(false);
  readonly selectLookupHidden = signal(false);
  readonly toggleSelectDisabled = signal(false);
  readonly toggleSelectHidden = signal(false);
  readonly radioSelectDisabled = signal(false);
  readonly radioSelectHidden = signal(false);

  buttonColorOptions = ['default', 'primary', 'accent', 'warn'];
  readonly buttonFlat = signal(true);
  readonly buttonFilterColor = signal<LuxThemePalette>('primary');
  readonly buttonDialogSave = signal<LuxThemePalette>('primary');
  readonly buttonDialogLoad = signal<LuxThemePalette>('primary');
  readonly buttonDialogDelete = signal<LuxThemePalette>('warn');
  readonly buttonDialogCancel = signal<LuxThemePalette>('primary');
  readonly buttonDialogClose = signal<LuxThemePalette>('primary');

  readonly openLabel = signal('');
  readonly closeLabel = signal('');

  readonly disableShortcut = signal(false);
  initRunning = false;
  radioPickValueFn = (o: { label: string; value: string }) => o.value;
  compareValueFn = (o1: any, o2: any) => o1.value === o2.value;

  private mediaQuery = inject(LuxMediaQueryObserverService);

  constructor() {
    this.mediaQuerySubscription = this.mediaQuery.getMediaQueryChangedAsObservable().subscribe(() => {
      this.showFilterChips.set(!this.mediaQuery.isSmallerOrEqual('xs'));
    });
  }

  ngOnInit(): void {
    this.initRunning = true;

    // Hier wird die setTimeout-Methode verwendet, um einen Backend-Call zu simulieren.
    setTimeout(() => {
      this.initFilter.set({ input: 'Lorem ipsum' });
      this.initFilterAc.set({ input: 'Lorem ipsum' });
      this.currentFilter.set(this.initFilter());
      this.currentFilterAc.set(this.initFilterAc());

      setTimeout(() => {
        this.initRunning = false;
      });
    }, 100);
  }

  ngOnDestroy(): void {
    this.mediaQuerySubscription.unsubscribe();
  }

  renderToggleFn(_filterItem: LuxFilterItem<boolean>, value: boolean) {
    return value ? 'aktiviert' : 'deaktiviert';
  }

  onFilter(filter: any) {
    this.currentFilter.set(filter);

    if (!this.initRunning) {
      console.log('Neuer Filter:', filter);
    }
  }

  onFilterAc(filter: any) {
    this.currentFilterAc.set(filter);

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
    this.initFilter.set(this.loadFilter(filterName));
  }

  onLoadAc(filterName: string) {
    this.initFilterAc.set(this.loadFilterAc(filterName));
  }

  onSetFilter() {
    this.initFilter.set(JSON.parse(this.replaceFilterJson()));
    this.initFilterAc.set(JSON.parse(this.replaceFilterJson()));
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
