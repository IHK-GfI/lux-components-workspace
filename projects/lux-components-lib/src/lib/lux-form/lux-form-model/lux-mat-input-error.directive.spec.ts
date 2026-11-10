import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { Component, Type, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { FormField, form, minError, required, validate } from '@angular/forms/signals';
import { By } from '@angular/platform-browser';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { LuxTestHelper } from '@ihk-gfi/lux-components/test-utils';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { provideLuxTranslocoTesting } from '../../../testing/transloco-test.provider';
import { LuxAutocompleteComponent } from '../lux-autocomplete/lux-autocomplete.component';
import { LuxDatepickerComponent } from '../lux-datepicker/lux-datepicker.component';
import { LuxFileInputComponent } from '../lux-file/lux-file-input/lux-file-input.component';
import { LuxInputComponent } from '../lux-input/lux-input.component';
import { LuxTextareaComponent } from '../lux-textarea/lux-textarea.component';
import { LuxTimepickerComponent } from '../lux-timepicker/lux-timepicker.component';

abstract class LuxErrorHost {
  readonly hasError = signal(true);
  readonly model = signal<{ value: any }>({ value: null });
  readonly testForm = form(this.model, (path) => {
    validate(path.value, () => (this.hasError() ? minError(5, { message: 'Fehler' }) : undefined));
  });
}

@Component({
  selector: 'lux-test-input-host',
  template: `<lux-input luxLabel="Feld" [formField]="testForm.value" />`,
  imports: [FormField, LuxInputComponent]
})
class InputHost extends LuxErrorHost {}

@Component({
  selector: 'lux-test-textarea-host',
  template: `<lux-textarea luxLabel="Feld" [formField]="testForm.value" />`,
  imports: [FormField, LuxTextareaComponent]
})
class TextareaHost extends LuxErrorHost {}

@Component({
  selector: 'lux-test-autocomplete-host',
  template: `<lux-autocomplete luxLabel="Feld" [formField]="testForm.value" />`,
  imports: [FormField, LuxAutocompleteComponent]
})
class AutocompleteHost extends LuxErrorHost {}

@Component({
  selector: 'lux-test-file-input-host',
  template: `<lux-file-input luxLabel="Feld" [formField]="testForm.value" />`,
  imports: [FormField, LuxFileInputComponent]
})
class FileInputHost extends LuxErrorHost {}

@Component({
  selector: 'lux-test-datepicker-host',
  template: `<lux-datepicker luxLabel="Feld" [formField]="testForm.value" />`,
  imports: [FormField, LuxDatepickerComponent]
})
class DatepickerHost extends LuxErrorHost {}

@Component({
  selector: 'lux-test-timepicker-host',
  template: `<lux-timepicker luxLabel="Feld" [formField]="testForm.value" />`,
  imports: [FormField, LuxTimepickerComponent]
})
class TimepickerHost extends LuxErrorHost {}

@Component({
  selector: 'lux-test-required-input-host',
  template: `<lux-input luxLabel="Feld" [formField]="testForm.value" />`,
  imports: [FormField, LuxInputComponent]
})
class RequiredInputHost {
  readonly model = signal({ value: '' });
  readonly testForm = form(this.model, (path) => {
    required(path.value, { message: 'Pflichtfeld' });
  });
}

const HOSTS: { name: string; type: Type<LuxErrorHost> }[] = [
  { name: 'lux-input', type: InputHost },
  { name: 'lux-textarea', type: TextareaHost },
  { name: 'lux-autocomplete', type: AutocompleteHost },
  { name: 'lux-file-input', type: FileInputHost },
  { name: 'lux-datepicker', type: DatepickerHost },
  { name: 'lux-timepicker', type: TimepickerHost }
];

describe('LuxMatInputErrorDirective', () => {
  beforeEach(async () => {
    vi.useFakeTimers();
    TestBed.configureTestingModule({
      providers: [
        provideNoopAnimations(),
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
        provideLuxTranslocoTesting()
      ]
    }).compileComponents();
  });

  afterEach(async () => {
    if (vi.isFakeTimers()) {
      await vi.runAllTimersAsync();
    }
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  for (const { name, type } of HOSTS) {
    it(`Sollte aria-invalid bei ${name} dem angezeigten Fehler folgen lassen`, async () => {
      const fixture = TestBed.createComponent(type);
      await LuxTestHelper.wait(fixture);
      const inputEl: HTMLElement = fixture.debugElement.query(By.css('.mat-mdc-input-element')).nativeElement;

      // Unberührt: Der Fehler wird noch nicht angezeigt
      expect(inputEl.getAttribute('aria-invalid'), 'unberührt').toEqual('false');

      // Wie beim Verlassen des Feldes
      fixture.debugElement.children[0].componentInstance.markAsTouched();
      await LuxTestHelper.wait(fixture);
      expect(inputEl.getAttribute('aria-invalid'), 'mit Fehler').toEqual('true');

      fixture.componentInstance.hasError.set(false);
      await LuxTestHelper.wait(fixture);
      expect(inputEl.getAttribute('aria-invalid'), 'ohne Fehler').toEqual('false');
    });
  }

  it('Sollte aria-invalid bei einem leeren Pflichtfeld wie MatInput weglassen', async () => {
    const fixture = TestBed.createComponent(RequiredInputHost);
    await LuxTestHelper.wait(fixture);
    fixture.componentInstance.testForm.value().markAsTouched();
    await LuxTestHelper.wait(fixture);

    const inputEl: HTMLInputElement = fixture.debugElement.query(By.css('input')).nativeElement;
    expect(inputEl.hasAttribute('aria-invalid')).toBe(false);
    expect(inputEl.getAttribute('aria-describedby')).toContain('-error');
  });
});
