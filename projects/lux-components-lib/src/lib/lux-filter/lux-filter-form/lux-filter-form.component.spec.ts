import { ChangeDetectionStrategy, Component, inject, OnDestroy, signal, viewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormField, disabled, form, hidden, required } from '@angular/forms/signals';
import { Subscription } from 'rxjs';
import { beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';
import { LuxA11yTestHelper } from '@ihk-gfi/lux-components/test-utils';
import { LuxMediaQueryObserverService } from '../../lux-util/lux-media-query-observer.service';
import { LuxFilter } from '../lux-filter-base/lux-filter';
import { LuxFilterItem } from '../lux-filter-base/lux-filter-item';

import { provideHttpClient, withInterceptorsFromDi, withXhr } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideLuxTranslocoTesting } from '../../../testing/transloco-test.provider';
import { LuxAutocompleteComponent } from '../../lux-form/lux-autocomplete/lux-autocomplete.component';
import { LuxDatepickerComponent } from '../../lux-form/lux-datepicker/lux-datepicker.component';
import { LuxInputComponent } from '../../lux-form/lux-input/lux-input.component';
import { LuxSelectComponent } from '../../lux-form/lux-select/lux-select.component';
import { LuxTimepickerComponent } from '../../lux-form/lux-timepicker/lux-timepicker.component';
import { LuxToggleComponent } from '../../lux-form/lux-toggle/lux-toggle.component';
import { LuxFilterItemDirective } from '../lux-filter-base/lux-filter-item.directive';
import { LuxFilterFormComponent } from './lux-filter-form.component';

describe('LuxFilterFormComponent', () => {
  let component: TestFilterFormComponent;
  let fixture: ComponentFixture<TestFilterFormComponent>;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(withXhr(), withInterceptorsFromDi()), provideHttpClientTesting(), provideLuxTranslocoTesting()]
    }).compileComponents();
  });

  beforeEach(async () => {
    fixture = TestBed.createComponent(TestFilterFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    await new Promise((resolve) => setTimeout(resolve));
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('Sollte ohne Validierungsfehler filtern', () => {
    // Init
    const spy = vi.spyOn(component, 'onFilter');

    // Vorbedingungen testen
    expect(component.filterComponent().filterForm.get('input')!.value).toBeUndefined();

    // Änderungen durchführen
    component.initFilter.set({ input: 'Not empty' });
    fixture.detectChanges();

    // Nachbedingungen prüfen
    expect(component.filterComponent().filterForm.valid).toBe(true);
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('Sollte mit Validierungsfehlern nicht filtern', () => {
    // Init
    const spy = vi.spyOn(component, 'onFilter');

    // Vorbedingungen testen
    expect(component.filterComponent().filterForm.get('input')!.value).toBeUndefined();

    // Änderungen durchführen
    // Validierungsfehler: Das Feld 'input' ist required und darf somit nicht leer sein.
    component.initFilter.set({ input: '' });
    fixture.detectChanges();

    // Nachbedingungen prüfen
    expect(component.filterComponent().filterForm.valid).toBe(false);
    expect(spy).toHaveBeenCalledTimes(0);
  });

  it('Sollte die Filterwerte vollständig ersetzen', () => {
    // Init
    const spy = vi.spyOn(component, 'onFilter');

    // Vorbedingungen testen
    expect(component.filterComponent().luxFilterValues()).toEqual({});

    // Änderungen durchführen
    component.initFilter.set({ input: 'aaa' });
    fixture.detectChanges();

    // Nachbedingungen prüfen
    expect(spy).toHaveBeenCalledTimes(1);

    // Änderungen durchführen.
    // Hier sollen die Filterwerte ersetzt werden.
    component.initFilter.set({ autocomplete: component.autoCompleteOptions[0] });
    fixture.detectChanges();

    // Nachbedingungen prüfen
    expect(spy).toHaveBeenCalledTimes(1); // Es bleibt bei 1, weil das Pflichtfeld "input" nicht gefüllt ist.
    expect(component.filterComponent().filterForm.get('autocomplete')!.value).toEqual(component.autoCompleteOptions[0]);
    expect(component.filterComponent().filterForm.get('input')!.value).toBeUndefined();
  });

  it('Sollte auch mit Datepicker-Timepicker-Kombination funktionieren', async () => {
    // Init
    const spy = vi.spyOn(component, 'onFilter');

    // Vorbedingungen testen
    expect(component.filterComponent().filterForm.get('combinedDateTime')!.value).toBeUndefined();

    // Änderungen durchführen
    component.initFilter.set({ input: 'Not empty', combinedDateTime: '2020-07-21T14:30:00.000Z' });
    fixture.detectChanges();
    // Datepicker/Timepicker verzögern ihren Value-Change-Emit per setTimeout (siehe
    // notifyFormValueChangedTimeout), um ein ExpressionChangedAfterChecked zu vermeiden. Ohne
    // dieses Warten wird die Fixture zerstört, bevor der Timeout feuert (NG0953).
    await fixture.whenStable();

    // Nachbedingungen prüfen
    expect(component.filterComponent().filterForm.valid).toBe(true);
    expect(component.filterComponent().filterForm.get('combinedDateTime')!.value).toEqual('2020-07-21T14:30:00.000Z');
    expect(component.currentFilter.combinedDateTime).toEqual('2020-07-21T14:30:00.000Z');
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('Sollte luxFilterDisabled ohne Endlosschleife umschalten', async () => {
    // formControl.disabled ist im Signal-Forms-Betrieb selbst signalgestützt. Ohne untracked() um
    // die disable()/enable()-Aufrufe koppelte deren Read den Effect der Direktive an
    // formControl.disabled - jeder disable()/enable()-Aufruf (auch der eigene) stieß den Effect
    // dadurch erneut an und kam nie zur Ruhe.
    const inputItem = component.filterComponent().formElementes.find((f) => f.filterItem.binding === 'input')!;
    const fc = inputItem.filterItem.component.formControl!;
    const disableSpy = vi.spyOn(fc, 'disable');
    const enableSpy = vi.spyOn(fc, 'enable');

    component.inputDisabled.set(true);
    fixture.detectChanges();
    await fixture.whenStable();
    expect(fc.disabled).toBe(true);

    component.inputDisabled.set(false);
    fixture.detectChanges();
    await fixture.whenStable();
    expect(fc.disabled).toBe(false);

    expect(disableSpy.mock.calls.length).toBeLessThan(5);
    expect(enableSpy.mock.calls.length).toBeLessThan(5);
  });
});

describe('LuxFilterFormComponent with Signal Forms', () => {
  let fixture: ComponentFixture<TestSignalFilterFormComponent>;
  let component: TestSignalFilterFormComponent;

  beforeAll(() => LuxA11yTestHelper.addA11yMatchers());

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [provideHttpClient(withXhr(), withInterceptorsFromDi()), provideHttpClientTesting(), provideLuxTranslocoTesting()]
    }).compileComponents();
    fixture = TestBed.createComponent(TestSignalFilterFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    await new Promise((resolve) => setTimeout(resolve));
    fixture.detectChanges();
  });

  it('uses the Signal Form for validation, values and chips', () => {
    expect(component.filterForm().formElementes.length).toBe(3);
    component.filterForm().onFilter();
    expect(component.emitted()).toBeUndefined();
    expect(component.form.input().touched()).toBe(true);

    component.form.input().value.set('Test');
    fixture.detectChanges();
    component.filterForm().onFilter();
    expect(component.emitted()).toEqual({ input: 'Test', toggle: false, multi: [] });
    expect(
      component
        .filterForm()
        .filterItems()
        .map((item) => item.binding)
    ).toEqual(['input']);

    component.filterForm().filterChipRemoved(0);
    expect(component.form.input().value()).toBe('');
    expect(component.form.input().touched()).toBe(true);
    expect(component.emitted()).toEqual({ input: 'Test', toggle: false, multi: [] });

    component.filterForm().onReset();
    expect(component.form().value()).toEqual({ input: '', toggle: false, multi: [] });
  });

  it('is accessible with a Signal Form', async () => {
    await LuxA11yTestHelper.expectNoA11yViolations(fixture.nativeElement);
  });

  it('removes only the selected chip from a Signal Form multi-select', () => {
    component.form.input().value.set('Test');
    component.form.multi().value.set(['One', 'Two']);
    component.filterForm().onFilter();
    expect(
      component
        .filterForm()
        .filterItems()
        .map((item) => item.value)
    ).toEqual(['Test', 'One', 'Two']);

    component.filterForm().filterChipRemoved(1);
    expect(component.form.multi().value()).toEqual(['Two']);
    expect(component.emitted()).toEqual({ input: 'Test', toggle: false, multi: ['Two'] });
  });

  it('applies replacement values and saves the Signal Form model', () => {
    component.values.set({ input: 'Erster Wert', toggle: true });
    fixture.detectChanges();
    expect(component.form().value()).toEqual({ input: 'Erster Wert', toggle: true, multi: [] });
    expect(component.emitted()).toEqual({ input: 'Erster Wert', toggle: true, multi: [] });

    component.values.set({ input: 'Neuer Wert' });
    fixture.detectChanges();
    expect(component.form().value()).toEqual({ input: 'Neuer Wert', toggle: false, multi: [] });

    component.filterForm().onSave('Testfilter');
    expect(component.saved()?.data).toEqual({ input: 'Neuer Wert', toggle: false, multi: [] });
  });
});

describe('LuxFilterFormComponent with Signal Forms (inaktive Felder)', () => {
  let fixture: ComponentFixture<TestSignalFilterStateComponent>;
  let component: TestSignalFilterStateComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [provideHttpClient(withXhr(), withInterceptorsFromDi()), provideHttpClientTesting(), provideLuxTranslocoTesting()]
    }).compileComponents();
    fixture = TestBed.createComponent(TestSignalFilterStateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    await new Promise((resolve) => setTimeout(resolve));
    fixture.detectChanges();
  });

  const chipBindings = () =>
    component
      .filterForm()
      .filterItems()
      .map((item) => item.binding);

  it('lässt deaktivierte, ausgeblendete und nicht registrierte Felder aus Ergebnis und Chips weg', () => {
    // Per Schema ausgeblendete Felder entfernt der Aufrufer per @if aus dem DOM (NG01916) - die
    // Filter-Form kennt das Filterelement aber weiterhin.
    component.regionHidden.set(true);
    fixture.detectChanges();
    component.filterForm().onFilter();

    // status: per Schema deaktiviert, region: per Schema ausgeblendet, versteckt: luxFilterHidden
    // (das leere Pflichtfeld blockiert das Filtern nicht), extra: kein luxFilterItem - wie bei
    // FormGroup.value tauchen sie im Ergebnis nicht auf.
    expect(component.emitted()).toEqual({ input: 'Test', datum: null });
    expect(chipBindings()).toEqual(['input']);

    component.filterForm().onSave('Testfilter');
    expect(component.saved()?.data).toEqual({ input: 'Test', datum: null });
  });

  it('berücksichtigt Feldzustände aus dem Schema dynamisch', () => {
    component.statusDisabled.set(false);
    component.filterForm().onFilter();

    expect(component.emitted()).toEqual({ input: 'Test', status: 'offen', region: 'Nord', datum: null });
    expect(chipBindings()).toEqual(['input', 'status', 'region']);
  });

  it('filtert nicht, solange ein aktives Pflichtfeld leer ist', () => {
    component.form.input().value.set('');
    component.filterForm().onFilter();

    expect(component.emitted()).toBeUndefined();
    expect(component.form.input().touched()).toBe(true);
  });

  it('zeigt im Datum-Chip das neu gesetzte Datum', async () => {
    component.values.set({ input: 'Test', datum: '2026-10-01T00:00:00.000Z' });
    fixture.detectChanges();
    await fixture.whenStable();

    const chip = component
      .filterForm()
      .filterItems()
      .find((item) => item.binding === 'datum');
    expect(chip?.value).toBe('01.10.2026');
  });
});

@Component({
  template: `
    <lux-filter-form
      luxTitle="Signal-Filter"
      [luxSignalForm]="form"
      [luxFilterValues]="values()"
      (luxOnFilter)="emitted.set($event)"
      (luxOnSave)="saved.set($event)"
    >
      <lux-input luxLabel="Input" [formField]="form.input" luxFilterItem [luxFilterDefaultValues]="['']" />
      <lux-input luxLabel="Status" [formField]="form.status" luxFilterItem [luxFilterDefaultValues]="['']" />
      @if (!form.region().hidden()) {
        <lux-input luxLabel="Region" [formField]="form.region" luxFilterItem [luxFilterDefaultValues]="['']" />
      }
      <lux-input luxLabel="Versteckt" [formField]="form.versteckt" luxFilterItem [luxFilterHidden]="true" [luxFilterDefaultValues]="['']" />
      <lux-datepicker luxLabel="Datum" [formField]="form.datum" luxFilterItem [luxFilterDefaultValues]="[null]" />
    </lux-filter-form>
  `,
  imports: [LuxFilterFormComponent, LuxFilterItemDirective, LuxInputComponent, LuxDatepickerComponent, FormField]
})
class TestSignalFilterStateComponent {
  readonly statusDisabled = signal(true);
  readonly regionHidden = signal(false);
  readonly model = signal({
    input: 'Test',
    status: 'offen',
    region: 'Nord',
    versteckt: '',
    datum: null as string | null,
    extra: 'ohne Filterelement'
  });
  readonly form = form(this.model, (path) => {
    required(path.input);
    required(path.versteckt);
    disabled(path.status, () => this.statusDisabled());
    hidden(path.region, () => this.regionHidden());
  });
  readonly values = signal<Record<string, unknown>>({});
  readonly emitted = signal<unknown>(undefined);
  readonly saved = signal<LuxFilter | undefined>(undefined);
  readonly filterForm = viewChild.required(LuxFilterFormComponent);
}

@Component({
  template: `
    <lux-filter-form
      luxTitle="Signal-Filter"
      [luxSignalForm]="form"
      [luxFilterValues]="values()"
      (luxOnFilter)="emitted.set($event)"
      (luxOnSave)="saved.set($event)"
    >
      <lux-input luxLabel="Input" [formField]="form.input" luxFilterItem [luxFilterDefaultValues]="['']" />
      <lux-toggle luxLabel="Toggle" [formField]="form.toggle" luxFilterItem />
      <lux-select luxLabel="Mehrfach" [luxOptions]="['One', 'Two']" [luxMultiple]="true" [formField]="form.multi" luxFilterItem />
    </lux-filter-form>
  `,
  imports: [LuxFilterFormComponent, LuxFilterItemDirective, LuxInputComponent, LuxToggleComponent, LuxSelectComponent, FormField]
})
class TestSignalFilterFormComponent {
  readonly model = signal({ input: '', toggle: false, multi: [] as string[] });
  readonly form = form(this.model, (path) => required(path.input));
  readonly values = signal<Record<string, unknown>>({});
  readonly emitted = signal<unknown>(undefined);
  readonly saved = signal<LuxFilter | undefined>(undefined);
  readonly filterForm = viewChild.required(LuxFilterFormComponent);
}

@Component({
  template: `
    <lux-filter-form
      (luxOnFilter)="onFilter($event)"
      [(luxFilterExpanded)]="expanded"
      [luxFilterValues]="initFilter()"
      (luxOnSave)="onSave($event)"
      (luxOnLoad)="onLoad($event)"
      (luxOnReset)="onReset()"
      (luxOnDelete)="onDelete()"
      [luxShowChips]="showFilterChips()"
      [luxStoredFilters]="storedFilters"
      class="lux-ml-1 lux-mr-1 lux-mb-3"
    >
      <lux-input
        luxLabel="Input"
        luxName="filter_input"
        luxAutocomplete="off"
        luxControlBinding="input"
        [luxRequired]="true"
        [luxFilterDisabled]="inputDisabled()"
        [luxFilterHidden]="inputHidden"
        luxFilterItem
      ></lux-input>
      <lux-autocomplete
        luxLabel="Autocomplete"
        [luxOptions]="autoCompleteOptions"
        luxControlBinding="autocomplete"
        [luxFilterDisabled]="autoCompleteDisabled"
        [luxFilterHidden]="autoCompleteHidden"
        luxFilterItem
      ></lux-autocomplete>
      <lux-datepicker
        luxLabel="Datepicker"
        luxName="filter_datepicker"
        luxControlBinding="datepicker"
        [luxFilterDisabled]="datepickerDisabled"
        [luxFilterHidden]="datepickerHidden"
        luxFilterItem
      ></lux-datepicker>
      <lux-timepicker
        luxLabel="Timepicker"
        luxName="filter_timepicker"
        luxControlBinding="timepicker"
        [luxFilterDisabled]="timepickerDisabled"
        [luxFilterHidden]="timepickerHidden"
        luxFilterItem
      ></lux-timepicker>
      <div>
        <div>
          <lux-datepicker
            luxLabel="Datepicker + Timepicker (Datum)"
            luxName="filter_datepicker_combined"
            luxControlBinding="combinedDateTime"
            [luxFilterDisabled]="combinedDateTimeDisabled"
            [luxFilterHidden]="combinedDateTimeHidden"
            [luxReferenceControl]="combinedTimepicker"
            luxFilterItem
            #combinedDatepicker
          ></lux-datepicker>
          <lux-timepicker
            luxLabel="Datepicker + Timepicker (Uhrzeit)"
            luxName="filter_timepicker_combined"
            luxControlBinding="combinedDateTime"
            [luxFilterDisabled]="combinedDateTimeDisabled"
            [luxFilterHidden]="combinedDateTimeHidden"
            [luxReferenceControl]="combinedDatepicker"
            luxFilterItem
            #combinedTimepicker
          ></lux-timepicker>
        </div>
      </div>
      <lux-select
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
      ></lux-select>
      <lux-select
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
      ></lux-select>
      <lux-toggle
        luxLabel="Toggle"
        luxControlBinding="toggle"
        [luxFilterRenderFn]="renderToggleFn"
        [luxFilterDisabled]="toggleSelectDisabled"
        [luxFilterHidden]="toggleSelectHidden"
        luxFilterColor="warn"
        luxFilterItem
      ></lux-toggle>
    </lux-filter-form>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    LuxFilterFormComponent,
    LuxFilterItemDirective,
    LuxToggleComponent,
    LuxSelectComponent,
    LuxInputComponent,
    LuxAutocompleteComponent,
    LuxDatepickerComponent,
    LuxTimepickerComponent
  ]
})
class TestFilterFormComponent implements OnDestroy {
  private mediaQuery = inject(LuxMediaQueryObserverService);

  readonly filterComponent = viewChild.required(LuxFilterFormComponent);

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

  initFilter = signal<any>({});
  currentFilter: any = this.initFilter();

  expanded = signal(false);
  showFilterChips = signal(true);

  storedFilters: LuxFilter[] = [];

  mediaQuerySubscription: Subscription;

  inputDisabled = signal(false);
  inputHidden = false;
  autoCompleteDisabled = false;
  autoCompleteHidden = false;
  datepickerDisabled = false;
  datepickerHidden = false;
  timepickerDisabled = false;
  timepickerHidden = false;
  combinedDateTimeDisabled = false;
  combinedDateTimeHidden = false;
  singleSelectDisabled = false;
  singleSelectHidden = false;
  multiSelectDisabled = false;
  multiSelectHidden = false;
  toggleSelectDisabled = false;
  toggleSelectHidden = false;

  constructor() {
    this.mediaQuerySubscription = this.mediaQuery.getMediaQueryChangedAsObservable().subscribe(() => {
      this.showFilterChips.set(!this.mediaQuery.isSmallerOrEqual('xs'));
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
    this.initFilter.set(this.loadFilter(filterName));
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
