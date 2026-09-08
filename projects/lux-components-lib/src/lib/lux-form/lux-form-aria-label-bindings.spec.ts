import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
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

  beforeEach(async () => {
    TestBed.configureTestingModule({
      providers: [
        LuxConsoleService,
        provideNoopAnimations(),
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
        provideLuxTranslocoTesting()
      ]
    }).compileComponents();
  });

  // Jeder Testfall bekommt seine eigene, schlanke Host-Komponente mit nur dem jeweils relevanten
  // Control. Zuvor rendersierte eine gemeinsame Host-Komponente immer alle 7 Form-Controls
  // (inkl. Autocomplete/Datepicker/Datetimepicker/Timepicker/File-Input) für jeden der 14 Tests
  // mit, was die Kosten pro Test ca. versiebenfacht hat, obwohl nur ein Control geprüft wird.
  const cases: { selector: string; nativeSelector: string; componentType: new () => AriaBindingsTestComponent }[] = [
    { selector: 'lux-input', nativeSelector: 'lux-input input', componentType: LuxInputAriaBindingsTestComponent },
    { selector: 'lux-textarea', nativeSelector: 'lux-textarea textarea', componentType: LuxTextareaAriaBindingsTestComponent },
    { selector: 'lux-autocomplete', nativeSelector: 'lux-autocomplete input', componentType: LuxAutocompleteAriaBindingsTestComponent },
    { selector: 'lux-datepicker', nativeSelector: 'lux-datepicker input', componentType: LuxDatepickerAriaBindingsTestComponent },
    {
      selector: 'lux-datetimepicker',
      nativeSelector: 'lux-datetimepicker input',
      componentType: LuxDatetimepickerAriaBindingsTestComponent
    },
    { selector: 'lux-timepicker', nativeSelector: 'lux-timepicker input', componentType: LuxTimepickerAriaBindingsTestComponent },
    {
      selector: 'lux-file-input',
      nativeSelector: 'lux-file-input input:not([type="file"])',
      componentType: LuxFileInputAriaBindingsTestComponent
    }
  ];

  for (const c of cases) {
    it(`${c.selector}: luxAriaLabel landet als aria-label am nativen Element`, async () => {
      fixture = TestBed.createComponent(c.componentType);
      testComponent = fixture.componentInstance;
      testComponent.ariaLabel = 'Suchbegriff eingeben';
      fixture.detectChanges();
      await LuxTestHelper.wait(fixture);

      const nativeEl = fixture.debugElement.query(By.css(c.nativeSelector));
      expect(nativeEl.nativeElement.getAttribute('aria-label')).toBe('Suchbegriff eingeben');
    });

    it(`${c.selector}: luxAriaLabelledby landet als aria-labelledby am nativen Element`, async () => {
      fixture = TestBed.createComponent(c.componentType);
      testComponent = fixture.componentInstance;
      testComponent.ariaLabelledby = 'externes-label-id';
      fixture.detectChanges();
      await LuxTestHelper.wait(fixture);

      const nativeEl = fixture.debugElement.query(By.css(c.nativeSelector));
      expect(nativeEl.nativeElement.getAttribute('aria-labelledby')).toBe('externes-label-id');
    });
  }
});

abstract class AriaBindingsTestComponent {
  ariaLabel?: string;
  ariaLabelledby?: string;
}

@Component({
  imports: [LuxInputComponent],
  template: `<lux-input [luxAriaLabel]="ariaLabel" [luxAriaLabelledby]="ariaLabelledby"></lux-input>`
})
class LuxInputAriaBindingsTestComponent extends AriaBindingsTestComponent {}

@Component({
  imports: [LuxTextareaComponent],
  template: `<lux-textarea [luxAriaLabel]="ariaLabel" [luxAriaLabelledby]="ariaLabelledby"></lux-textarea>`
})
class LuxTextareaAriaBindingsTestComponent extends AriaBindingsTestComponent {}

@Component({
  imports: [LuxAutocompleteComponent],
  template: `<lux-autocomplete [luxOptions]="[]" [luxAriaLabel]="ariaLabel" [luxAriaLabelledby]="ariaLabelledby"></lux-autocomplete>`
})
class LuxAutocompleteAriaBindingsTestComponent extends AriaBindingsTestComponent {}

@Component({
  imports: [LuxDatepickerComponent],
  template: `<lux-datepicker [luxAriaLabel]="ariaLabel" [luxAriaLabelledby]="ariaLabelledby"></lux-datepicker>`
})
class LuxDatepickerAriaBindingsTestComponent extends AriaBindingsTestComponent {}

@Component({
  imports: [LuxDatetimepickerComponent],
  template: `<lux-datetimepicker [luxAriaLabel]="ariaLabel" [luxAriaLabelledby]="ariaLabelledby"></lux-datetimepicker>`
})
class LuxDatetimepickerAriaBindingsTestComponent extends AriaBindingsTestComponent {}

@Component({
  imports: [LuxTimepickerComponent],
  template: `<lux-timepicker [luxAriaLabel]="ariaLabel" [luxAriaLabelledby]="ariaLabelledby"></lux-timepicker>`
})
class LuxTimepickerAriaBindingsTestComponent extends AriaBindingsTestComponent {}

@Component({
  imports: [LuxFileInputComponent],
  template: `<lux-file-input [luxAriaLabel]="ariaLabel" [luxAriaLabelledby]="ariaLabelledby"></lux-file-input>`
})
class LuxFileInputAriaBindingsTestComponent extends AriaBindingsTestComponent {}

describe('Form-Controls - Namenskaskade bei aria-labelledby-Controls (Select)', () => {
  let fixture: ComponentFixture<SelectAriaTestComponent>;
  let testComponent: SelectAriaTestComponent;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      providers: [
        LuxConsoleService,
        provideNoopAnimations(),
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
        provideLuxTranslocoTesting()
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectAriaTestComponent);
    testComponent = fixture.componentInstance;
  });

  it('mit luxLabel: aria-labelledby verweist auf das Wrapper-Label', async () => {
    testComponent.label = 'Anrede';
    fixture.detectChanges();
    await LuxTestHelper.wait(fixture);

    const matSelectEl = fixture.debugElement.query(By.css('mat-select'));
    const labelEl = fixture.debugElement.query(By.css('label.lux-form-label-authentic'));
    expect(matSelectEl.nativeElement.getAttribute('aria-labelledby')).toBe(labelEl.nativeElement.id);
  });

  it('ohne luxLabel, mit luxAriaLabel: kein toter labelledby-Verweis, aria-label greift', async () => {
    testComponent.ariaLabel = 'Liste sortieren nach';
    fixture.detectChanges();
    await LuxTestHelper.wait(fixture);

    const matSelectEl = fixture.debugElement.query(By.css('mat-select'));
    expect(matSelectEl.nativeElement.getAttribute('aria-labelledby')).toBeNull();
    expect(matSelectEl.nativeElement.getAttribute('aria-label')).toBe('Liste sortieren nach');
  });

  it('ohne jegliches Label: aria-labelledby wird nicht gesetzt (kein toter Verweis)', async () => {
    fixture.detectChanges();
    await LuxTestHelper.wait(fixture);

    const matSelectEl = fixture.debugElement.query(By.css('mat-select'));
    expect(matSelectEl.nativeElement.getAttribute('aria-labelledby')).toBeNull();
  });

  it('vergibt die uid nur einmal im DOM (keine doppelte id)', async () => {
    testComponent.label = 'Anrede';
    fixture.detectChanges();
    await LuxTestHelper.wait(fixture);

    const selectComponent = fixture.debugElement.query(By.directive(LuxSelectComponent)).componentInstance as LuxSelectComponent;
    const elementsWithUid = fixture.nativeElement.querySelectorAll(`[id="${selectComponent.uid()}"]`);
    expect(elementsWithUid.length).toBe(1);
    // Die uid gehört dem versteckten nativen <select>, auf das das Wrapper-Label per for verweist.
    expect(elementsWithUid[0].tagName.toLowerCase()).toBe('select');
  });
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

  beforeEach(async () => {
    TestBed.configureTestingModule({
      providers: [
        LuxConsoleService,
        provideNoopAnimations(),
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
        provideLuxTranslocoTesting()
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CheckableAriaTestComponent);
    testComponent = fixture.componentInstance;
  });

  it('Slider: luxAriaLabel hat Vorrang vor dem luxLabel-Fallback', async () => {
    testComponent.ariaLabel = 'Lautstärke';
    fixture.detectChanges();
    await LuxTestHelper.wait(fixture);

    const sliderInputEl = fixture.debugElement.query(By.css('mat-slider input'));
    expect(sliderInputEl.nativeElement.getAttribute('aria-label')).toBe('Lautstärke');
  });

  it('Slider: ohne luxAriaLabel bleibt luxLabel der aria-label-Fallback', async () => {
    fixture.detectChanges();
    await LuxTestHelper.wait(fixture);

    const sliderInputEl = fixture.debugElement.query(By.css('mat-slider input'));
    expect(sliderInputEl.nativeElement.getAttribute('aria-label')).toBe('Pegel');
  });

  it('Slider: luxAriaLabelledby landet als aria-labelledby am Thumb-Input', async () => {
    testComponent.ariaLabelledby = 'externes-label-id';
    fixture.detectChanges();
    await LuxTestHelper.wait(fixture);

    const sliderInputEl = fixture.debugElement.query(By.css('mat-slider input'));
    expect(sliderInputEl.nativeElement.getAttribute('aria-labelledby')).toBe('externes-label-id');
  });

  it('Checkbox: luxAriaLabel landet am nativen input', async () => {
    testComponent.ariaLabel = 'AGB akzeptieren';
    fixture.detectChanges();
    await LuxTestHelper.wait(fixture);

    const checkboxInputEl = fixture.debugElement.query(By.css('mat-checkbox input[type="checkbox"]'));
    expect(checkboxInputEl.nativeElement.getAttribute('aria-label')).toBe('AGB akzeptieren');
  });

  it('Checkbox: luxAriaLabelledby landet als aria-labelledby am nativen input', async () => {
    testComponent.ariaLabelledby = 'externes-label-id';
    fixture.detectChanges();
    await LuxTestHelper.wait(fixture);

    const checkboxInputEl = fixture.debugElement.query(By.css('mat-checkbox input[type="checkbox"]'));
    expect(checkboxInputEl.nativeElement.getAttribute('aria-labelledby')).toBe('externes-label-id');
  });

  it('Toggle: luxAriaLabel landet am Switch-Button', async () => {
    testComponent.ariaLabel = 'Benachrichtigungen';
    fixture.detectChanges();
    await LuxTestHelper.wait(fixture);

    const switchEl = fixture.debugElement.query(By.css('mat-slide-toggle button[role="switch"]'));
    expect(switchEl.nativeElement.getAttribute('aria-label')).toBe('Benachrichtigungen');
  });

  it('Toggle: luxAriaLabelledby landet als aria-labelledby am Switch-Button', async () => {
    testComponent.ariaLabelledby = 'externes-label-id';
    fixture.detectChanges();
    await LuxTestHelper.wait(fixture);

    const switchEl = fixture.debugElement.query(By.css('mat-slide-toggle button[role="switch"]'));
    expect(switchEl.nativeElement.getAttribute('aria-labelledby')).toBe('externes-label-id');
  });
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

  beforeEach(async () => {
    TestBed.configureTestingModule({
      providers: [
        LuxConsoleService,
        provideNoopAnimations(),
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
        provideLuxTranslocoTesting()
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChipsAriaTestComponent);
  });

  it('Standardkonfiguration (nur luxLabel gesetzt) besitzt kein aria-labelledby, da der Wrapper kein Label rendert', async () => {
    fixture.detectChanges();
    await LuxTestHelper.wait(fixture);

    const chipGridEl = fixture.debugElement.query(By.css('mat-chip-grid'));
    expect(chipGridEl.nativeElement.getAttribute('aria-labelledby')).toBeNull();
  });
});

@Component({
  imports: [LuxChipsComponent],
  template: `<lux-chips luxLabel="Kategorien"></lux-chips>`
})
class ChipsAriaTestComponent {}
