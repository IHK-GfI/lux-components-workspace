import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { Component } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { LuxTestHelper } from '@ihk-gfi/lux-components/test-utils';
import { provideLuxTranslocoTesting } from '../../testing/transloco-test.provider';
import { LuxConsoleService } from '../lux-util/lux-console.service';
import { LuxAutocompleteAcComponent } from './lux-autocomplete-ac/lux-autocomplete-ac.component';
import { LuxCheckboxAcComponent } from './lux-checkbox-ac/lux-checkbox-ac.component';
import { LuxChipsAcComponent } from './lux-chips-ac/lux-chips-ac.component';
import { LuxDatepickerAcComponent } from './lux-datepicker-ac/lux-datepicker-ac.component';
import { LuxDatetimepickerAcComponent } from './lux-datetimepicker-ac/lux-datetimepicker-ac.component';
import { LuxFileInputAcComponent } from './lux-file/lux-file-input-ac/lux-file-input-ac.component';
import { LuxInputAcComponent } from './lux-input-ac/lux-input-ac.component';
import { LuxSelectAcComponent } from './lux-select-ac/lux-select-ac.component';
import { LuxSliderAcComponent } from './lux-slider-ac/lux-slider-ac.component';
import { LuxTextareaAcComponent } from './lux-textarea-ac/lux-textarea-ac.component';
import { LuxTimepickerComponent } from './lux-timepicker/lux-timepicker.component';
import { LuxToggleAcComponent } from './lux-toggle-ac/lux-toggle-ac.component';

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
    { selector: 'lux-input-ac', nativeSelector: 'lux-input-ac input' },
    { selector: 'lux-textarea-ac', nativeSelector: 'lux-textarea-ac textarea' },
    { selector: 'lux-autocomplete-ac', nativeSelector: 'lux-autocomplete-ac input' },
    { selector: 'lux-datepicker-ac', nativeSelector: 'lux-datepicker-ac input' },
    { selector: 'lux-datetimepicker-ac', nativeSelector: 'lux-datetimepicker-ac input' },
    { selector: 'lux-timepicker', nativeSelector: 'lux-timepicker input' },
    { selector: 'lux-file-input-ac', nativeSelector: 'lux-file-input-ac input:not([type="file"])' }
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
    LuxInputAcComponent,
    LuxTextareaAcComponent,
    LuxAutocompleteAcComponent,
    LuxDatepickerAcComponent,
    LuxDatetimepickerAcComponent,
    LuxTimepickerComponent,
    LuxFileInputAcComponent
  ],
  template: `
    <lux-input-ac [luxAriaLabel]="ariaLabel" [luxAriaLabelledby]="ariaLabelledby"></lux-input-ac>
    <lux-textarea-ac [luxAriaLabel]="ariaLabel" [luxAriaLabelledby]="ariaLabelledby"></lux-textarea-ac>
    <lux-autocomplete-ac [luxOptions]="[]" [luxAriaLabel]="ariaLabel" [luxAriaLabelledby]="ariaLabelledby"></lux-autocomplete-ac>
    <lux-datepicker-ac [luxAriaLabel]="ariaLabel" [luxAriaLabelledby]="ariaLabelledby"></lux-datepicker-ac>
    <lux-datetimepicker-ac [luxAriaLabel]="ariaLabel" [luxAriaLabelledby]="ariaLabelledby"></lux-datetimepicker-ac>
    <lux-timepicker [luxAriaLabel]="ariaLabel" [luxAriaLabelledby]="ariaLabelledby"></lux-timepicker>
    <lux-file-input-ac [luxAriaLabel]="ariaLabel" [luxAriaLabelledby]="ariaLabelledby"></lux-file-input-ac>
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

    const selectComponent = fixture.debugElement.query(By.directive(LuxSelectAcComponent)).componentInstance as LuxSelectAcComponent;
    const elementsWithUid = fixture.nativeElement.querySelectorAll(`[id="${selectComponent.uid()}"]`);
    expect(elementsWithUid.length).toBe(1);
    // Die uid gehört dem versteckten nativen <select>, auf das das Wrapper-Label per for verweist.
    expect(elementsWithUid[0].tagName.toLowerCase()).toBe('select');
  }));
});

@Component({
  imports: [LuxSelectAcComponent],
  template: `<lux-select-ac [luxLabel]="label" [luxAriaLabel]="ariaLabel" [luxOptions]="['A', 'B']"></lux-select-ac>`
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
  imports: [LuxSliderAcComponent, LuxCheckboxAcComponent, LuxToggleAcComponent],
  template: `
    <lux-slider-ac luxLabel="Pegel" [luxAriaLabel]="ariaLabel" [luxAriaLabelledby]="ariaLabelledby"></lux-slider-ac>
    <lux-checkbox-ac luxLabel="AGB" [luxAriaLabel]="ariaLabel" [luxAriaLabelledby]="ariaLabelledby"></lux-checkbox-ac>
    <lux-toggle-ac luxLabel="Aktiv" [luxAriaLabel]="ariaLabel" [luxAriaLabelledby]="ariaLabelledby"></lux-toggle-ac>
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
  imports: [LuxChipsAcComponent],
  template: `<lux-chips-ac luxLabel="Kategorien"></lux-chips-ac>`
})
class ChipsAriaTestComponent {}
