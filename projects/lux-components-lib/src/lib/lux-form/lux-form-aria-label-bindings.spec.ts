import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { Component } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { LuxTestHelper } from '@ihk-gfi/lux-components/test-utils';
import { provideLuxTranslocoTesting } from '../../testing/transloco-test.provider';
import { LuxConsoleService } from '../lux-util/lux-console.service';
import { LuxAutocompleteComponent } from './lux-autocomplete/lux-autocomplete.component';
import { LuxCheckboxComponent } from './lux-checkbox/lux-checkbox.component';
import { LuxChipsComponent } from './lux-chips/lux-chips.component';
import { LuxDatepickerComponent } from './lux-datepicker/lux-datepicker.component';
import { LuxDatetimepickerComponent } from './lux-datetimepicker/lux-datetimepicker.component';
import { LuxFileInputComponent } from './lux-file/lux-file-input/lux-file-input.component';
import { LuxInputComponent } from './lux-input/lux-input.component';
import { LuxSelectComponent } from './lux-select/lux-select.component';
import { LuxSliderComponent } from './lux-slider/lux-slider.component';
import { LuxTextareaComponent } from './lux-textarea/lux-textarea.component';
import { LuxTimepickerComponent } from './lux-timepicker/lux-timepicker.component';
import { LuxToggleComponent } from './lux-toggle/lux-toggle.component';

describe('Form-Controls - aria-label/aria-labelledby am nativen Eingabefeld', () => {
  let fixture: ComponentFixture<AriaBindingsTestComponent>;
  let testComponent: AriaBindingsTestComponent;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      providers: [
        LuxConsoleService,
        provideNoopAnimations(),
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
        provideLuxTranslocoTesting()
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AriaBindingsTestComponent);
    testComponent = fixture.componentInstance;
  });

  const cases: { selector: string; nativeSelector: string }[] = [
    { selector: 'lux-input', nativeSelector: 'lux-input input' },
    { selector: 'lux-textarea', nativeSelector: 'lux-textarea textarea' },
    { selector: 'lux-autocomplete', nativeSelector: 'lux-autocomplete input' },
    { selector: 'lux-datepicker', nativeSelector: 'lux-datepicker input' },
    { selector: 'lux-datetimepicker', nativeSelector: 'lux-datetimepicker input' },
    { selector: 'lux-timepicker', nativeSelector: 'lux-timepicker input' },
    { selector: 'lux-file-input', nativeSelector: 'lux-file-input input:not([type="file"])' }
  ];

  for (const c of cases) {
    it(`${c.selector}: luxAriaLabel landet als aria-label am nativen Element`, fakeAsync(() => {
      testComponent.ariaLabel = 'Suchbegriff eingeben';
      fixture.detectChanges();
      LuxTestHelper.wait(fixture);

      const nativeEl = fixture.debugElement.query(By.css(c.nativeSelector));
      expect(nativeEl.nativeElement.getAttribute('aria-label')).toBe('Suchbegriff eingeben');
    }));

    it(`${c.selector}: luxAriaLabelledby landet als aria-labelledby am nativen Element`, fakeAsync(() => {
      testComponent.ariaLabelledby = 'externes-label-id';
      fixture.detectChanges();
      LuxTestHelper.wait(fixture);

      const nativeEl = fixture.debugElement.query(By.css(c.nativeSelector));
      expect(nativeEl.nativeElement.getAttribute('aria-labelledby')).toBe('externes-label-id');
    }));
  }
});

@Component({
  imports: [
    LuxInputComponent,
    LuxTextareaComponent,
    LuxAutocompleteComponent,
    LuxDatepickerComponent,
    LuxDatetimepickerComponent,
    LuxTimepickerComponent,
    LuxFileInputComponent
  ],
  template: `
    <lux-input [luxAriaLabel]="ariaLabel" [luxAriaLabelledby]="ariaLabelledby"></lux-input>
    <lux-textarea [luxAriaLabel]="ariaLabel" [luxAriaLabelledby]="ariaLabelledby"></lux-textarea>
    <lux-autocomplete [luxOptions]="[]" [luxAriaLabel]="ariaLabel" [luxAriaLabelledby]="ariaLabelledby"></lux-autocomplete>
    <lux-datepicker [luxAriaLabel]="ariaLabel" [luxAriaLabelledby]="ariaLabelledby"></lux-datepicker>
    <lux-datetimepicker [luxAriaLabel]="ariaLabel" [luxAriaLabelledby]="ariaLabelledby"></lux-datetimepicker>
    <lux-timepicker [luxAriaLabel]="ariaLabel" [luxAriaLabelledby]="ariaLabelledby"></lux-timepicker>
    <lux-file-input [luxAriaLabel]="ariaLabel" [luxAriaLabelledby]="ariaLabelledby"></lux-file-input>
  `
})
class AriaBindingsTestComponent {
  ariaLabel?: string;
  ariaLabelledby?: string;
}

describe('Form-Controls - Namenskaskade bei aria-labelledby-Controls (Select)', () => {
  let fixture: ComponentFixture<SelectAriaTestComponent>;
  let testComponent: SelectAriaTestComponent;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      providers: [
        LuxConsoleService,
        provideNoopAnimations(),
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
        provideLuxTranslocoTesting()
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectAriaTestComponent);
    testComponent = fixture.componentInstance;
  });

  it('mit luxLabel: aria-labelledby verweist auf das Wrapper-Label', fakeAsync(() => {
    testComponent.label = 'Anrede';
    fixture.detectChanges();
    LuxTestHelper.wait(fixture);

    const matSelectEl = fixture.debugElement.query(By.css('mat-select'));
    const labelEl = fixture.debugElement.query(By.css('label.lux-form-label-authentic'));
    expect(matSelectEl.nativeElement.getAttribute('aria-labelledby')).toBe(labelEl.nativeElement.id);
  }));

  it('ohne luxLabel, mit luxAriaLabel: kein toter labelledby-Verweis, aria-label greift', fakeAsync(() => {
    testComponent.ariaLabel = 'Liste sortieren nach';
    fixture.detectChanges();
    LuxTestHelper.wait(fixture);

    const matSelectEl = fixture.debugElement.query(By.css('mat-select'));
    expect(matSelectEl.nativeElement.getAttribute('aria-labelledby')).toBeNull();
    expect(matSelectEl.nativeElement.getAttribute('aria-label')).toBe('Liste sortieren nach');
  }));

  it('ohne jegliches Label: aria-labelledby wird nicht gesetzt (kein toter Verweis)', fakeAsync(() => {
    fixture.detectChanges();
    LuxTestHelper.wait(fixture);

    const matSelectEl = fixture.debugElement.query(By.css('mat-select'));
    expect(matSelectEl.nativeElement.getAttribute('aria-labelledby')).toBeNull();
  }));

  it('vergibt die uid nur einmal im DOM (keine doppelte id)', fakeAsync(() => {
    testComponent.label = 'Anrede';
    fixture.detectChanges();
    LuxTestHelper.wait(fixture);

    const selectComponent = fixture.debugElement.query(By.directive(LuxSelectComponent)).componentInstance as LuxSelectComponent;
    const elementsWithUid = fixture.nativeElement.querySelectorAll(`[id="${selectComponent.uid()}"]`);
    expect(elementsWithUid.length).toBe(1);
    // Die uid gehört dem versteckten nativen <select>, auf das das Wrapper-Label per for verweist.
    expect(elementsWithUid[0].tagName.toLowerCase()).toBe('select');
  }));
});

@Component({
  imports: [LuxSelectComponent],
  template: `<lux-select [luxLabel]="label" [luxAriaLabel]="ariaLabel" [luxOptions]="['A', 'B']"></lux-select>`
})
class SelectAriaTestComponent {
  label = '';
  ariaLabel?: string;
}

describe('Form-Controls - Slider/Checkbox/Toggle', () => {
  let fixture: ComponentFixture<CheckableAriaTestComponent>;
  let testComponent: CheckableAriaTestComponent;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      providers: [
        LuxConsoleService,
        provideNoopAnimations(),
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
        provideLuxTranslocoTesting()
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CheckableAriaTestComponent);
    testComponent = fixture.componentInstance;
  });

  it('Slider: luxAriaLabel hat Vorrang vor dem luxLabel-Fallback', fakeAsync(() => {
    testComponent.ariaLabel = 'Lautstärke';
    fixture.detectChanges();
    LuxTestHelper.wait(fixture);

    const sliderInputEl = fixture.debugElement.query(By.css('mat-slider input'));
    expect(sliderInputEl.nativeElement.getAttribute('aria-label')).toBe('Lautstärke');
  }));

  it('Slider: ohne luxAriaLabel bleibt luxLabel der aria-label-Fallback', fakeAsync(() => {
    fixture.detectChanges();
    LuxTestHelper.wait(fixture);

    const sliderInputEl = fixture.debugElement.query(By.css('mat-slider input'));
    expect(sliderInputEl.nativeElement.getAttribute('aria-label')).toBe('Pegel');
  }));

  it('Slider: luxAriaLabelledby landet als aria-labelledby am Thumb-Input', fakeAsync(() => {
    testComponent.ariaLabelledby = 'externes-label-id';
    fixture.detectChanges();
    LuxTestHelper.wait(fixture);

    const sliderInputEl = fixture.debugElement.query(By.css('mat-slider input'));
    expect(sliderInputEl.nativeElement.getAttribute('aria-labelledby')).toBe('externes-label-id');
  }));

  it('Checkbox: luxAriaLabel landet am nativen input', fakeAsync(() => {
    testComponent.ariaLabel = 'AGB akzeptieren';
    fixture.detectChanges();
    LuxTestHelper.wait(fixture);

    const checkboxInputEl = fixture.debugElement.query(By.css('mat-checkbox input[type="checkbox"]'));
    expect(checkboxInputEl.nativeElement.getAttribute('aria-label')).toBe('AGB akzeptieren');
  }));

  it('Checkbox: luxAriaLabelledby landet als aria-labelledby am nativen input', fakeAsync(() => {
    testComponent.ariaLabelledby = 'externes-label-id';
    fixture.detectChanges();
    LuxTestHelper.wait(fixture);

    const checkboxInputEl = fixture.debugElement.query(By.css('mat-checkbox input[type="checkbox"]'));
    expect(checkboxInputEl.nativeElement.getAttribute('aria-labelledby')).toBe('externes-label-id');
  }));

  it('Toggle: luxAriaLabel landet am Switch-Button', fakeAsync(() => {
    testComponent.ariaLabel = 'Benachrichtigungen';
    fixture.detectChanges();
    LuxTestHelper.wait(fixture);

    const switchEl = fixture.debugElement.query(By.css('mat-slide-toggle button[role="switch"]'));
    expect(switchEl.nativeElement.getAttribute('aria-label')).toBe('Benachrichtigungen');
  }));

  it('Toggle: luxAriaLabelledby landet als aria-labelledby am Switch-Button', fakeAsync(() => {
    testComponent.ariaLabelledby = 'externes-label-id';
    fixture.detectChanges();
    LuxTestHelper.wait(fixture);

    const switchEl = fixture.debugElement.query(By.css('mat-slide-toggle button[role="switch"]'));
    expect(switchEl.nativeElement.getAttribute('aria-labelledby')).toBe('externes-label-id');
  }));
});

@Component({
  imports: [LuxSliderComponent, LuxCheckboxComponent, LuxToggleComponent],
  template: `
    <lux-slider luxLabel="Pegel" [luxAriaLabel]="ariaLabel" [luxAriaLabelledby]="ariaLabelledby"></lux-slider>
    <lux-checkbox luxLabel="AGB" [luxAriaLabel]="ariaLabel" [luxAriaLabelledby]="ariaLabelledby"></lux-checkbox>
    <lux-toggle luxLabel="Aktiv" [luxAriaLabel]="ariaLabel" [luxAriaLabelledby]="ariaLabelledby"></lux-toggle>
  `
})
class CheckableAriaTestComponent {
  ariaLabel?: string;
  ariaLabelledby?: string;
}

describe('Form-Controls - Chips: kein toter aria-labelledby-Verweis', () => {
  let fixture: ComponentFixture<ChipsAriaTestComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      providers: [
        LuxConsoleService,
        provideNoopAnimations(),
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
        provideLuxTranslocoTesting()
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChipsAriaTestComponent);
  });

  it('Standardkonfiguration (nur luxLabel gesetzt) besitzt kein aria-labelledby, da der Wrapper kein Label rendert', fakeAsync(() => {
    fixture.detectChanges();
    LuxTestHelper.wait(fixture);

    const chipGridEl = fixture.debugElement.query(By.css('mat-chip-grid'));
    expect(chipGridEl.nativeElement.getAttribute('aria-labelledby')).toBeNull();
  }));
});

@Component({
  imports: [LuxChipsComponent],
  template: `<lux-chips luxLabel="Kategorien"></lux-chips>`
})
class ChipsAriaTestComponent {}
