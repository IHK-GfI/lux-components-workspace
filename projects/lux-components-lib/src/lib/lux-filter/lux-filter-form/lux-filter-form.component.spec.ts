import { Component, inject, OnDestroy, ViewChild } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, tick, waitForAsync } from '@angular/core/testing';
import { Subscription } from 'rxjs';
import { LuxMediaQueryObserverService } from '../../lux-util/lux-media-query-observer.service';
import { LuxFilter } from '../lux-filter-base/lux-filter';
import { LuxFilterItem } from '../lux-filter-base/lux-filter-item';

import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { LuxAutocompleteAcComponent } from '../../lux-form/lux-autocomplete-ac/lux-autocomplete-ac.component';
import { LuxDatepickerAcComponent } from '../../lux-form/lux-datepicker-ac/lux-datepicker-ac.component';
import { LuxInputAcComponent } from '../../lux-form/lux-input-ac/lux-input-ac.component';
import { LuxSelectAcComponent } from '../../lux-form/lux-select-ac/lux-select-ac.component';
import { LuxToggleAcComponent } from '../../lux-form/lux-toggle-ac/lux-toggle-ac.component';
import { LuxFilterItemDirective } from '../lux-filter-base/lux-filter-item.directive';
import { LuxFilterFormComponent } from './lux-filter-form.component';

describe('LuxFilterFormComponent', () => {
  let component: TestFilterFormComponent;
  let fixture: ComponentFixture<TestFilterFormComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()]
    }).compileComponents();
  }));

  beforeEach(fakeAsync(() => {
    fixture = TestBed.createComponent(TestFilterFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    tick(500);
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('Sollte ohne Validierungsfehler filtern', () => {
    // Init
    const spy = spyOn(component, 'onFilter').and.callThrough();

    // Vorbedingungen testen
    expect(component.filterComponent.filterForm.get('input')!.value).toBeUndefined();

    // Änderungen durchführen
    component.initFilter = { input: 'Not empty' };
    fixture.detectChanges();

    // Nachbedingungen prüfen
    expect(component.filterComponent.filterForm.valid).toBeTrue();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('Sollte mit Validierungsfehlern nicht filtern', () => {
    // Init
    const spy = spyOn(component, 'onFilter').and.callThrough();

    // Vorbedingungen testen
    expect(component.filterComponent.filterForm.get('input')!.value).toBeUndefined();

    // Änderungen durchführen
    // Validierungsfehler: Das Feld 'input' ist required und darf somit nicht leer sein.
    component.initFilter = { input: '' };
    fixture.detectChanges();

    // Nachbedingungen prüfen
    expect(component.filterComponent.filterForm.valid).toBeFalse();
    expect(spy).toHaveBeenCalledTimes(0);
  });

  it('Sollte die Filterwerte vollständig ersetzen', () => {
    // Init
    const spy = spyOn(component, 'onFilter').and.callThrough();

    // Vorbedingungen testen
    expect(component.filterComponent.luxFilterValues).toEqual({});

    // Änderungen durchführen
    component.initFilter = { input: 'aaa' };
    fixture.detectChanges();

    // Nachbedingungen prüfen
    expect(spy).toHaveBeenCalledTimes(1);

    // Änderungen durchführen.
    // Hier sollen die Filterwerte ersetzt werden.
    component.initFilter = { autocomplete: component.autoCompleteOptions[0] };
    fixture.detectChanges();

    // Nachbedingungen prüfen
    expect(spy).toHaveBeenCalledTimes(1); // Es bleibt bei 1, weil das Pflichtfeld "input" nicht gefüllt ist.
    expect(component.filterComponent.filterForm.get('autocomplete')!.value).toEqual(component.autoCompleteOptions[0]);
    expect(component.filterComponent.filterForm.get('input')!.value).toBeUndefined();
  });
});

@Component({
  template: `
    <lux-filter-form
      (luxOnFilter)="onFilter($event)"
      [(luxFilterExpanded)]="expanded"
      [luxFilterValues]="initFilter"
      (luxOnSave)="onSave($event)"
      (luxOnLoad)="onLoad($event)"
      (luxOnReset)="onReset()"
      (luxOnDelete)="onDelete()"
      [luxShowChips]="showFilterChips"
      [luxStoredFilters]="storedFilters"
      class="lux-ml-1 lux-mr-1 lux-mb-3"
    >
      <lux-input-ac
        luxLabel="Input"
        luxName="filter_input"
        luxAutocomplete="off"
        luxControlBinding="input"
        [luxRequired]="true"
        [luxFilterDisabled]="inputDisabled"
        [luxFilterHidden]="inputHidden"
        luxFilterItem
      ></lux-input-ac>
      <lux-autocomplete-ac
        luxLabel="Autocomplete"
        [luxOptions]="autoCompleteOptions"
        luxControlBinding="autocomplete"
        [luxFilterDisabled]="autoCompleteDisabled"
        [luxFilterHidden]="autoCompleteHidden"
        luxFilterItem
      ></lux-autocomplete-ac>
      <lux-datepicker-ac
        luxLabel="Datepicker"
        luxName="filter_datepicker"
        luxControlBinding="datepicker"
        [luxFilterDisabled]="datepickerDisabled"
        [luxFilterHidden]="datepickerHidden"
        luxFilterItem
      ></lux-datepicker-ac>
      <lux-select-ac
        luxLabel="Single-Select"
        luxControlBinding="singleSelect"
        luxOptionLabelProp="label"
        [luxMultiple]="false"
        [luxOptions]="singleSelectOptions"
        [luxCompareWith]="compareValueFn"
        [luxFilterDisabled]="singleSelectDisabled"
        [luxFilterHidden]="singleSelectHidden"
        luxFilterColor="accent"
        luxFilterItem
      ></lux-select-ac>
      <lux-select-ac
        luxLabel="Multi-Select"
        luxControlBinding="multiSelect"
        luxOptionLabelProp="label"
        [luxMultiple]="true"
        [luxOptions]="multiSelectOptions"
        [luxCompareWith]="compareValueFn"
        [luxFilterDisabled]="multiSelectDisabled"
        [luxFilterHidden]="multiSelectHidden"
        luxFilterColor="accent"
        luxFilterItem
      ></lux-select-ac>
      <lux-toggle-ac
        luxLabel="Toggle"
        luxControlBinding="toggle"
        [luxFilterRenderFn]="renderToggleFn"
        [luxFilterDisabled]="toggleSelectDisabled"
        [luxFilterHidden]="toggleSelectHidden"
        luxFilterColor="warn"
        luxFilterItem
      ></lux-toggle-ac>
    </lux-filter-form>
  `,
  imports: [
    LuxFilterFormComponent,
    LuxFilterItemDirective,
    LuxToggleAcComponent,
    LuxSelectAcComponent,
    LuxInputAcComponent,
    LuxAutocompleteAcComponent,
    LuxDatepickerAcComponent
  ]
})
class TestFilterFormComponent implements OnDestroy {
  private mediaQuery = inject(LuxMediaQueryObserverService);

  @ViewChild(LuxFilterFormComponent) filterComponent!: LuxFilterFormComponent;

  autoCompleteOptions: any[] = [
    { label: 'Auto A', value: 'a' },
    { label: 'Auto B', value: 'b' },
    { label: 'Auto C', value: 'c' }
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
  currentFilter: any = this.initFilter;

  expanded = false;
  showFilterChips = true;

  storedFilters: LuxFilter[] = [];

  mediaQuerySubscription: Subscription;

  inputDisabled = false;
  inputHidden = false;
  autoCompleteDisabled = false;
  autoCompleteHidden = false;
  datepickerDisabled = false;
  datepickerHidden = false;
  singleSelectDisabled = false;
  singleSelectHidden = false;
  multiSelectDisabled = false;
  multiSelectHidden = false;
  toggleSelectDisabled = false;
  toggleSelectHidden = false;

  constructor() {
    this.mediaQuerySubscription = this.mediaQuery.getMediaQueryChangedAsObservable().subscribe(() => {
      this.showFilterChips = !this.mediaQuery.isSmallerOrEqual('xs');
    });
  }

  ngOnDestroy(): void {
    this.mediaQuerySubscription.unsubscribe();
  }

  compareValueFn = (o1: any, o2: any) => {
    return o1.value === o2.value;
  };

  renderToggleFn(filterItem: LuxFilterItem<boolean>, value: boolean) {
    return value ? 'aktiviert' : 'deaktiviert';
  }

  onFilter(filter: any) {
    this.currentFilter = filter;
  }

  onSave(filter: LuxFilter) {
    this.saveFilter(filter);
  }

  onDelete() {}

  onReset() {}

  onLoad(filterName: string) {
    this.initFilter = this.loadFilter(filterName);
  }

  private saveFilter(filter: LuxFilter) {
    // Hier müssten die Filtereinstellungen (z.B. in die Datenbank) geschrieben werden.
    this.storedFilters.push(filter);
  }

  private loadFilter(filterName: string) {
    // Hier müssten die Filtereinstellungen (z.B. aus der Datenbank) gelesen und zurückgeliefert werden.
    const luxFilter = this.storedFilters.find((filter) => filter.name === filterName);

    if (!luxFilter) {
      throw Error(`Es konnte kein Filter mit dem Namen "${filterName}" gefunden werden.`);
    }

    return JSON.parse(JSON.stringify(luxFilter.data));
  }
}
