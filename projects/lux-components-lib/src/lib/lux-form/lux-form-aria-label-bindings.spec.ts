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
import { LuxDatepickerAcComponent } from './lux-datepicker-ac/lux-datepicker-ac.component';
import { LuxDatetimepickerAcComponent } from './lux-datetimepicker-ac/lux-datetimepicker-ac.component';
import { LuxFileInputAcComponent } from './lux-file/lux-file-input-ac/lux-file-input-ac.component';
import { LuxInputAcComponent } from './lux-input-ac/lux-input-ac.component';
import { LuxSelectAcComponent } from './lux-select-ac/lux-select-ac.component';
import { LuxTextareaAcComponent } from './lux-textarea-ac/lux-textarea-ac.component';
import { LuxTimepickerComponent } from './lux-timepicker/lux-timepicker.component';

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
});

@Component({
  imports: [LuxSelectAcComponent],
  template: `<lux-select-ac [luxLabel]="label" [luxAriaLabel]="ariaLabel" [luxOptions]="['A', 'B']"></lux-select-ac>`
})
class SelectAriaTestComponent {
  label = '';
  ariaLabel?: string;
}
