import { describe, it, beforeAll, beforeEach, afterEach, expect, vi } from 'vitest';
import { provideHttpClient, withInterceptorsFromDi, withXhr } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ChangeDetectionStrategy, Component, Type, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormField, form, required, validate } from '@angular/forms/signals';
import { By } from '@angular/platform-browser';
import { LuxA11yTestHelper, LuxOverlayHelper, LuxTestHelper } from '@ihk-gfi/lux-components/test-utils';
import { TranslocoService } from '@jsverse/transloco';
import { of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { provideLuxTranslocoTesting } from '../../../testing/transloco-test.provider';
import { LuxConsoleService } from '../../lux-util/lux-console.service';
import { LuxUtil } from '../../lux-util/lux-util';
import { LuxValidationErrors, ValidatorFnType } from '../lux-form-model/lux-form-component-base.class';
import { luxDateValue } from './lux-datepicker-validators';
import { LuxDateFilterFn, LuxDatepickerComponent } from './lux-datepicker.component';

// Werte, die bis Version 21 angenommen wurden und jetzt abgelehnt werden (siehe Update-Guide v22)
const REJECTED_VALUES: unknown[] = [
  '2029-05-26T00:00:00.000Z', // Format von Version 21 (UTC-Mitternacht)
  '2029-05-25T22:00:00.000Z', // lokale Mitternacht in Europe/Berlin
  '2029-05-26T14:15:00.000Z', // Zeitpunkt mit Uhrzeit
  '2029-05-26T23:30:00', // Datum mit Uhrzeit ungleich 00:00
  '2029-05-26T00:00:01', // Sekunden ungleich 00
  '2029-05-26T10:00:00+01:00', // Offset
  '26.05.2029', // Anzeigeformat
  '05/26/2029', // Anzeigeformat
  '2029-02-29', // kein Schaltjahr
  new Date(2029, 4, 26) // Date-Objekt
];

function displayValue(fixture: ComponentFixture<unknown>) {
  return LuxUtil.stringWithoutASCIIChars(fixture.debugElement.query(By.css('input')).nativeElement.value);
}

function errorText(fixture: ComponentFixture<unknown>) {
  return fixture.debugElement.query(By.css('mat-error'))?.nativeElement.textContent.trim();
}

describe('LuxDatepickerComponent', () => {
  beforeEach(async () => {
    vi.useFakeTimers();
    TestBed.configureTestingModule({
      providers: [
        LuxConsoleService,
        provideHttpClient(withXhr(), withInterceptorsFromDi()),
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

  describe('Validatoren', () => {
    let fixture: ComponentFixture<LuxFormCustomValidatorComponent>;
    let testComponent: LuxFormCustomValidatorComponent;
    let datepickerComponent: LuxDatepickerComponent;

    beforeEach(async () => {
      fixture = TestBed.createComponent(LuxFormCustomValidatorComponent);
      testComponent = fixture.componentInstance;
      datepickerComponent = fixture.debugElement.query(By.directive(LuxDatepickerComponent)).componentInstance;
      await LuxTestHelper.wait(fixture);
    });

    it('Sollte mehrere Validatoren (Standard- und Custom-Validatoren) unterstützen', async () => {
      // Vorbedingungen testen
      expect(testComponent.formControl.value).toBeFalsy();
      expect(datepickerComponent.value()).toBeFalsy();
      expect(errorText(fixture)).toBeUndefined();

      // Änderungen durchführen
      testComponent.formControl.setValue('');
      testComponent.formControl.markAsTouched();
      await LuxTestHelper.wait(fixture);

      // Nachbedingungen testen
      expect(errorText(fixture)).toEqual('Darf nicht leer sein');

      // Änderungen durchführen
      testComponent.formControl.setValue('2019-01-01');
      testComponent.formControl.markAsTouched();
      await LuxTestHelper.wait(fixture);

      // Nachbedingungen testen
      expect(displayValue(fixture)).toEqual('01.01.2019');
      expect(errorText(fixture)).toEqual('Das Jahr 2019 darf nicht verwendet werden');

      // Änderungen durchführen
      const datepickerEl = fixture.debugElement.query(By.css('input'));
      LuxTestHelper.typeInElement(datepickerEl.nativeElement, '01.01.2020', false);
      await LuxTestHelper.wait(fixture);

      // Nachbedingungen testen
      expect(testComponent.formControl.value).toEqual('2020-01-01');
      expect(errorText(fixture)).toBeUndefined();

      // Änderungen durchführen: zweistellige Jahre werden nicht angenommen
      LuxTestHelper.typeInElement(datepickerEl.nativeElement, '01.01.20', false);
      await LuxTestHelper.wait(fixture);

      // Nachbedingungen testen
      expect(testComponent.formControl.value).toBeNull();
      expect(errorText(fixture)).toEqual('Darf nicht leer sein');
    });

    it('Sollte luxRequired auch bei per Validators.compose() gesetztem Validators.required erkennen (Issue #318)', async () => {
      fixture.detectChanges();
      await LuxTestHelper.wait(fixture);

      expect(datepickerComponent.luxRequired()).toBe(true);

      const labelEl = fixture.debugElement.query(By.css('.lux-form-label-authentic'));
      expect(labelEl.nativeElement.innerHTML).toContain('*');
    });
  });

  describe('innerhalb eines Formulars', () => {
    let fixture: ComponentFixture<LuxFormTestComponent>;
    let testComponent: LuxFormTestComponent;
    let datepickerComponent: LuxDatepickerComponent;

    beforeEach(async () => {
      fixture = TestBed.createComponent(LuxFormTestComponent);
      testComponent = fixture.componentInstance;
      datepickerComponent = fixture.debugElement.query(By.directive(LuxDatepickerComponent)).componentInstance;
      await LuxTestHelper.wait(fixture);
    });

    it('Sollte einen Wert nach dem Rendern besitzen', async () => {
      // Vorbedingungen testen
      expect(testComponent.formControl.value).toBeFalsy();
      expect(datepickerComponent.value()).toBeFalsy();

      // Änderungen durchführen
      testComponent.formControl.setValue('2015-06-10');
      await LuxTestHelper.wait(fixture);

      // Nachbedingungen testen
      expect(displayValue(fixture)).toEqual('10.06.2015');
      expect(datepickerComponent.value()).toEqual('2015-06-10');
    });

    it('Sollte die Anzeige leeren, wenn ein eingetippter Wert von außen zurückgesetzt wird', async () => {
      const inputEl: HTMLInputElement = fixture.debugElement.query(By.css('input')).nativeElement;
      LuxTestHelper.typeInElement(inputEl, '10.06.2015');
      LuxTestHelper.dispatchEvent(inputEl, new Event('focusout'));
      await LuxTestHelper.wait(fixture);
      expect(testComponent.formControl.value).toEqual('2015-06-10');

      testComponent.formControl.setValue(null);
      await LuxTestHelper.wait(fixture);

      expect(inputEl.value).toEqual('');
      expect(datepickerComponent.value()).toBeFalsy();
    });

    it('Sollte den Wert aktualisieren', async () => {
      // Änderungen durchführen
      testComponent.formControl.setValue('2015-06-10');
      await LuxTestHelper.wait(fixture);

      // Nachbedingungen testen
      expect(displayValue(fixture)).toEqual('10.06.2015');
      expect(datepickerComponent.value()).toEqual('2015-06-10');

      // Änderungen durchführen
      testComponent.formControl.setValue('2015-07-10');
      await LuxTestHelper.wait(fixture);

      // Nachbedingungen testen
      expect(displayValue(fixture)).toEqual('10.07.2015');
      expect(datepickerComponent.value()).toEqual('2015-07-10');
    });

    it('Sollte eine Eingabe ohne Trenner (ddMMyyyy) übernehmen', async () => {
      // Änderungen durchführen
      LuxTestHelper.typeInElement(fixture.debugElement.query(By.css('input')).nativeElement, '01122020');
      await LuxTestHelper.wait(fixture);

      // Nachbedingungen testen
      expect(testComponent.formControl.value).toEqual('2020-12-01');
    });

    it('Sollte eine Eingabe mit einstelligem Tag und Monat übernehmen', async () => {
      // Änderungen durchführen
      LuxTestHelper.typeInElement(fixture.debugElement.query(By.css('input')).nativeElement, '1.2.2020');
      await LuxTestHelper.wait(fixture);

      // Nachbedingungen testen
      expect(testComponent.formControl.value).toEqual('2020-02-01');
    });

    it('Sollte ungültige Eingaben (31.02., zweistelliges Jahr) als Fehler melden', async () => {
      const inputEl = fixture.debugElement.query(By.css('input')).nativeElement;

      for (const text of ['31.02.2029', '29.02.2029', '26.05.29', '2029-05-26']) {
        // Änderungen durchführen
        LuxTestHelper.typeInElement(inputEl, text);
        await LuxTestHelper.wait(fixture);

        // Nachbedingungen testen
        expect(testComponent.formControl.value, text).toBeNull();
        expect(datepickerComponent.formControl.errors, text).toEqual({ matDatepickerParse: { text } });
      }
    });

    it('Sollte Mitternacht ohne Zeitzone (Java LocalDateTime) annehmen und nicht umschreiben', async () => {
      for (const value of ['2027-03-13T00:00', '2027-03-13T00:00:00']) {
        // Änderungen durchführen
        testComponent.formControl.setValue(value);
        await LuxTestHelper.wait(fixture);

        // Nachbedingungen testen
        expect(displayValue(fixture), value).toEqual('13.03.2027');
        expect(testComponent.formControl.value, value).toEqual(value);
        expect(testComponent.formControl.dirty, value).toBe(false);
        expect(datepickerComponent.formControl.errors, value).toBeNull();
      }
    });

    it('Sollte nach einer Eingabe immer "yyyy-MM-dd" schreiben', async () => {
      // Vorbedingungen testen
      testComponent.formControl.setValue('2027-03-13T00:00:00');
      await LuxTestHelper.wait(fixture);

      // Änderungen durchführen
      LuxTestHelper.typeInElement(fixture.debugElement.query(By.css('input')).nativeElement, '14.03.2027');
      await LuxTestHelper.wait(fixture);

      // Nachbedingungen testen
      expect(testComponent.formControl.value).toEqual('2027-03-14');
    });

    it('Sollte Werte in einem anderen Format ablehnen, unverändert lassen und warnen', async () => {
      const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);

      for (const value of REJECTED_VALUES) {
        const context = value instanceof Date ? `Date-Objekt ${value.toISOString()}` : String(value);
        warn.mockClear();

        // Änderungen durchführen
        testComponent.formControl.setValue(value);
        await LuxTestHelper.wait(fixture);

        // Nachbedingungen testen
        expect(testComponent.formControl.value, context).toBe(value);
        expect(datepickerComponent.formControl.errors?.['matDatepickerParse'], context).toBeDefined();
        expect(warn, context).toHaveBeenCalledTimes(1);
        expect(String(warn.mock.calls[0][0]), context).toContain("lux-datepicker: Erwartet 'yyyy-MM-dd'");
      }
    });

    it('Sollte einen abgelehnten Wert unverändert anzeigen', async () => {
      vi.spyOn(console, 'warn').mockImplementation(() => undefined);

      // Änderungen durchführen
      testComponent.formControl.setValue('2029-05-26T00:00:00.000Z');
      testComponent.formControl.markAsTouched();
      await LuxTestHelper.wait(fixture);

      // Nachbedingungen testen
      expect(displayValue(fixture)).toEqual('2029-05-26T00:00:00.000Z');
      expect(errorText(fixture)).toEqual('Das Datum ist ungültig');
    });

    it('Sollte einen abgelehnten Wert beim Leeren von außen nicht stehen lassen', async () => {
      vi.spyOn(console, 'warn').mockImplementation(() => undefined);
      testComponent.formControl.setValue('2029-05-26T00:00:00.000Z');
      await LuxTestHelper.wait(fixture);

      // Änderungen durchführen
      testComponent.formControl.setValue(null);
      await LuxTestHelper.wait(fixture);

      // Nachbedingungen testen
      expect(displayValue(fixture)).toEqual('');
      expect(datepickerComponent.formControl.errors).toBeNull();
    });

    describe('Ereignisse des FormControls', () => {
      function input(): HTMLInputElement {
        return fixture.debugElement.query(By.css('input')).nativeElement;
      }

      it('Sollte valueChanges bei einer Nutzereingabe genau einmal auslösen', async () => {
        const values: unknown[] = [];
        testComponent.form.valueChanges.subscribe((value) => values.push(value['datepicker']));

        LuxTestHelper.typeInElement(input(), '26.05.2029');
        await LuxTestHelper.wait(fixture);

        expect(values).toEqual(['2029-05-26']);
      });

      it('Sollte statusChanges auch bei einer ungültigen Eingabe ohne Wertänderung auslösen', async () => {
        const statuses: string[] = [];
        testComponent.form.statusChanges.subscribe((status) => statuses.push(status));

        LuxTestHelper.typeInElement(input(), '31.02.2029');
        await LuxTestHelper.wait(fixture);
        expect(testComponent.form.status).toEqual('INVALID');
        expect(statuses.at(-1)).toEqual('INVALID');

        LuxTestHelper.typeInElement(input(), '');
        await LuxTestHelper.wait(fixture);
        expect(testComponent.form.status).toEqual('VALID');
        expect(statuses.at(-1)).toEqual('VALID');
      });

      it('Sollte statusChanges auslösen, wenn sich eine Regel ändert', async () => {
        const fixtureMin = TestBed.createComponent(LuxDatepickerToggledTestComponent);
        fixtureMin.componentInstance.form.get('datum')!.setValue('2029-05-26');
        await LuxTestHelper.wait(fixtureMin);
        const statuses: string[] = [];
        fixtureMin.componentInstance.form.statusChanges.subscribe((status) => statuses.push(status));

        fixtureMin.componentInstance.minDate.set('2029-06-01');
        await LuxTestHelper.wait(fixtureMin);

        expect(statuses).toEqual(['INVALID']);
      });

      it('Sollte luxValueChange nach einem stillen setValue() auch beim Zurück auf den alten Wert auslösen', async () => {
        testComponent.formControl.setValue('2029-01-01');
        await LuxTestHelper.wait(fixture);
        const spy = vi.spyOn(datepickerComponent, 'notifyFormValueChanged');

        // Durch den Nutzer
        testComponent.formControl.setValue('2029-02-02', { emitEvent: false });
        await LuxTestHelper.wait(fixture);
        expect(spy).not.toHaveBeenCalled();
        LuxTestHelper.typeInElement(input(), '01.01.2029');
        await LuxTestHelper.wait(fixture);
        expect(spy).toHaveBeenCalledTimes(1);
        await LuxTestHelper.wait(fixture);

        // Durch die Anwendung
        input().blur();
        LuxTestHelper.dispatchFakeEvent(input(), 'focusout');
        testComponent.formControl.setValue('2029-02-02', { emitEvent: false });
        await LuxTestHelper.wait(fixture);
        testComponent.formControl.setValue('2029-01-01');
        await LuxTestHelper.wait(fixture);
        expect(spy).toHaveBeenCalledTimes(2);
      });

      it('Sollte für den Startwert und reine Neuprüfungen kein luxValueChange auslösen', async () => {
        // Am Prototyp, damit auch ein Aufruf beim ersten Rendern erfasst wird
        const spy = vi.spyOn(LuxDatepickerComponent.prototype, 'notifyFormValueChanged');
        const localFixture = TestBed.createComponent(LuxDatepickerToggledTestComponent);
        const host = localFixture.componentInstance;
        host.form.get('datum')!.setValue('2029-05-26');

        await LuxTestHelper.wait(localFixture);
        expect(spy).not.toHaveBeenCalled();

        host.minDate.set('2029-06-01');
        await LuxTestHelper.wait(localFixture);
        host.form.get('datum')!.updateValueAndValidity();
        await LuxTestHelper.wait(localFixture);
        expect(spy).not.toHaveBeenCalled();
      });

      it('Sollte luxValueChange bei einem Wert von außen nur einmal auslösen', async () => {
        const spy = vi.spyOn(datepickerComponent, 'notifyFormValueChanged');

        testComponent.formControl.setValue('2029-05-26');
        await LuxTestHelper.wait(fixture);

        expect(spy).toHaveBeenCalledTimes(1);
      });
    });

    describe('Wert von außen, während das Feld den Fokus hat', () => {
      function input(): HTMLInputElement {
        return fixture.debugElement.query(By.css('input')).nativeElement;
      }

      it('Sollte einen neuen Wert sofort anzeigen', async () => {
        input().focus();
        await LuxTestHelper.wait(fixture);

        testComponent.formControl.setValue('2029-05-26');
        await LuxTestHelper.wait(fixture);

        expect(displayValue(fixture)).toEqual('26.05.2029');
      });

      it('Sollte die laufende Eingabe nicht überschreiben, wenn die Anwendung denselben Wert erneut setzt', async () => {
        testComponent.formControl.valueChanges.subscribe((value) => testComponent.formControl.setValue(value, { emitEvent: false }));

        LuxTestHelper.typeInElement(input(), '1.9.2029');
        await LuxTestHelper.wait(fixture);

        expect(testComponent.formControl.value).toEqual('2029-09-01');
        expect(displayValue(fixture)).toEqual('1.9.2029');
      });

      it('Sollte einen ungültig getippten Text bei form.reset() leeren', async () => {
        LuxTestHelper.typeInElement(input(), '31.02.2029');
        await LuxTestHelper.wait(fixture);

        testComponent.form.reset();
        await LuxTestHelper.wait(fixture);

        expect(displayValue(fixture)).toEqual('');
        expect(datepickerComponent.formControl.errors).toBeNull();
        expect(testComponent.form.valid).toBe(true);
      });
    });

    it('Sollte aria-invalid nur setzen, solange der Fehler angezeigt wird', async () => {
      const inputEl = fixture.debugElement.query(By.css('input')).nativeElement;
      expect(inputEl.getAttribute('aria-invalid')).toEqual('false');

      // Änderungen durchführen: Während der ersten Eingabe ist das Feld noch unberührt
      LuxTestHelper.typeInElement(inputEl, '31.02.2029');
      await LuxTestHelper.wait(fixture);
      expect(inputEl.getAttribute('aria-invalid')).toEqual('false');

      LuxTestHelper.dispatchFakeEvent(inputEl, 'focusout');
      inputEl.blur();
      await LuxTestHelper.wait(fixture);
      expect(inputEl.getAttribute('aria-invalid')).toEqual('true');

      LuxTestHelper.typeInElement(inputEl, '26.05.2029');
      await LuxTestHelper.wait(fixture);
      expect(inputEl.getAttribute('aria-invalid')).toEqual('false');
    });

    it('Sollte einen ungültig getippten Text bei form.reset() leeren', async () => {
      // form.reset() schreibt den Wert wie ControlValueAccessor.writeValue() neu, auch wenn er schon null war
      const inputEl = fixture.debugElement.query(By.css('input')).nativeElement;
      LuxTestHelper.typeInElement(inputEl, '31.02.2029');
      await LuxTestHelper.wait(fixture);
      LuxTestHelper.dispatchFakeEvent(inputEl, 'focusout');
      inputEl.blur();
      await LuxTestHelper.wait(fixture);
      expect(datepickerComponent.formControl.errors?.['matDatepickerParse']).toBeDefined();

      // Änderungen durchführen
      testComponent.form.reset();
      await LuxTestHelper.wait(fixture);

      // Nachbedingungen testen
      expect(displayValue(fixture)).toEqual('');
      expect(datepickerComponent.formControl.errors).toBeNull();
    });

    it('Sollte required sein', async () => {
      testComponent.formControl.setValidators(Validators.required);
      await LuxTestHelper.wait(fixture);
      // Vorbedingungen testen
      let matErrorEl = fixture.debugElement.query(By.css('mat-error'));
      expect(matErrorEl).toBeFalsy();

      // Änderungen durchführen
      testComponent.formControl.markAsTouched();
      await LuxTestHelper.wait(fixture);

      // Nachbedingungen testen
      matErrorEl = fixture.debugElement.query(By.css('mat-error'));
      expect(matErrorEl).toBeDefined();
      expect(datepickerComponent.formControl.invalid).toBeTruthy();
    });

    it('Sollte den korrekten Wert nach asynchronem Aufruf besitzen', async () => {
      // Vorbedingungen testen
      await LuxTestHelper.wait(fixture);
      expect(testComponent.formControl.value).toBeFalsy();
      expect(datepickerComponent.value()).toBeFalsy();
      expect(datepickerComponent.formControl.value).toBeFalsy();

      // Änderungen durchführen
      of('2005-02-05')
        .pipe(delay(20))
        .subscribe((value) => testComponent.formControl.setValue(value));
      await LuxTestHelper.wait(fixture, 100);

      // Nachbedingungen testen
      expect(testComponent.formControl.value).toEqual('2005-02-05');
      expect(datepickerComponent.value()).toEqual('2005-02-05');
      expect(datepickerComponent.formControl.value).toEqual('2005-02-05');
    });
  });

  describe('außerhalb eines Formulars', () => {
    let fixture: ComponentFixture<LuxNoFormAttributeTestComponent>;
    let testComponent: LuxNoFormAttributeTestComponent;
    let datepickerComponent: LuxDatepickerComponent;
    let overlayHelper: LuxOverlayHelper;

    beforeEach(async () => {
      fixture = TestBed.createComponent(LuxNoFormAttributeTestComponent);
      testComponent = fixture.componentInstance;
      datepickerComponent = fixture.debugElement.query(By.directive(LuxDatepickerComponent)).componentInstance;
      overlayHelper = new LuxOverlayHelper();

      await LuxTestHelper.wait(fixture);
    });

    it('sollte "de-DE" als Default-Locale haben', async () => {
      testComponent.value.set('2019-03-05');
      await LuxTestHelper.wait(fixture);

      expect(datepickerComponent['dateAdapter']['locale']).toEqual('de-DE');
      expect(displayValue(fixture)).toEqual('05.03.2019');
    });

    it('LuxValue Simple', async () => {
      // Vorbedingungen testen
      expect(testComponent.value()).toBeFalsy();
      expect(datepickerComponent.value()).toBeFalsy();

      // Änderungen durchführen
      testComponent.value.set('2015-07-10');
      await LuxTestHelper.wait(fixture);

      // Nachbedingungen testen
      expect(displayValue(fixture)).toEqual('10.07.2015');
      expect(datepickerComponent.value()).toEqual('2015-07-10');
      expect(testComponent.value()).toEqual('2015-07-10');
    });

    describe('Locale', () => {
      const cases = [
        { lang: 'de-DE', display: '10.06.2015', input: '25.09.2026', invalidInput: '09/25/2026' },
        { lang: 'en-US', display: '06/10/2015', input: '09/25/2026', invalidInput: '25/09/2026' },
        { lang: 'en-GB', display: '10/06/2015', input: '25/09/2026', invalidInput: '09/25/2026' }
      ];

      for (const { lang, display, input, invalidInput } of cases) {
        it(`Sollte in ${lang} nach der Locale anzeigen`, async () => {
          TestBed.inject(TranslocoService).setActiveLang(lang);
          testComponent.value.set('2015-06-10');
          await LuxTestHelper.wait(fixture);

          expect(displayValue(fixture)).toEqual(display);
        });

        it(`Sollte in ${lang} die Eingabe nach der Locale lesen`, async () => {
          TestBed.inject(TranslocoService).setActiveLang(lang);
          await LuxTestHelper.wait(fixture);
          const inputEl = fixture.debugElement.query(By.css('input')).nativeElement;

          // Änderungen durchführen
          LuxTestHelper.typeInElement(inputEl, input);
          await LuxTestHelper.wait(fixture);

          // Nachbedingungen testen
          expect(testComponent.value()).toEqual('2026-09-25');

          // Änderungen durchführen: Reihenfolge einer anderen Locale
          LuxTestHelper.typeInElement(inputEl, invalidInput);
          await LuxTestHelper.wait(fixture);

          // Nachbedingungen testen
          expect(testComponent.value()).toBeNull();
          expect(datepickerComponent.formControl.errors?.['matDatepickerParse']).toBeDefined();
        });
      }
    });

    it('LuxDisabled', async () => {
      // Vorbedingungen testen
      const inputEl = fixture.debugElement.query(By.css('input')).nativeElement;
      const buttonEl = fixture.debugElement.query(By.css('button')).nativeElement;

      expect(testComponent.disabled()).toBeFalsy();
      expect(inputEl.disabled).toBeFalsy();
      expect(buttonEl.disabled).toBeFalsy();

      // Änderungen durchführen
      testComponent.disabled.set(true);
      await LuxTestHelper.wait(fixture);

      // Nachbedingungen testen
      expect(testComponent.disabled()).toBeTruthy();
      expect(inputEl.disabled).toBeTruthy();
      expect(buttonEl.disabled).toBeTruthy();
    });

    it('LuxMinDate und LuxMaxDate', async () => {
      // Vorbedingungen testen
      expect(errorText(fixture)).toBeUndefined();

      // Änderungen durchführen
      testComponent.minDate.set('2015-10-20');
      testComponent.maxDate.set('2015-10-25');
      testComponent.value.set('2015-10-23');
      await LuxTestHelper.wait(fixture);

      // Nachbedingungen testen
      expect(errorText(fixture)).toBeUndefined();

      // Änderungen durchführen: die Grenzen selbst sind erlaubt
      for (const value of ['2015-10-20', '2015-10-25']) {
        testComponent.value.set(value);
        await LuxTestHelper.wait(fixture);
        datepickerComponent.formControl.markAsTouched();
        await LuxTestHelper.wait(fixture);

        expect(errorText(fixture), value).toBeUndefined();
      }

      // Änderungen durchführen
      testComponent.value.set('2015-10-19');
      await LuxTestHelper.wait(fixture);
      datepickerComponent.formControl.markAsTouched();
      await LuxTestHelper.wait(fixture);

      // Nachbedingungen testen
      expect(errorText(fixture)).toEqual('Das Datum unterschreitet den Minimalwert');

      // Änderungen durchführen
      testComponent.value.set('2015-10-26');
      await LuxTestHelper.wait(fixture);

      // Nachbedingungen testen
      expect(errorText(fixture)).toEqual('Das Datum überschreitet den Maximalwert');
    });

    it('Sollte einen ungültig getippten Text bei geänderten Regeln mit seinem Fehler behalten', async () => {
      // Geänderte Regeln prüfen nur neu (wie bei MatDatepickerInput), eine Eingabe des Nutzers geht nicht verloren
      const inputEl = fixture.debugElement.query(By.css('input')).nativeElement;
      LuxTestHelper.typeInElement(inputEl, '31.02.2029');
      await LuxTestHelper.wait(fixture);
      LuxTestHelper.dispatchFakeEvent(inputEl, 'focusout');
      inputEl.blur();
      await LuxTestHelper.wait(fixture);

      const changes: [string, () => void][] = [
        ['luxMinDate', () => testComponent.minDate.set('2029-01-01')],
        ['luxMaxDate', () => testComponent.maxDate.set('2029-12-31')],
        ['luxCustomFilter', () => testComponent.customFilter.set(() => true)],
        ['luxRequired', () => testComponent.required.set(true)]
      ];
      for (const [name, change] of changes) {
        // Änderungen durchführen
        change();
        await LuxTestHelper.wait(fixture);

        // Nachbedingungen testen
        expect(displayValue(fixture), name).toEqual('31.02.2029');
        expect(datepickerComponent.formControl.errors?.['matDatepickerParse'], name).toBeDefined();
        expect(errorText(fixture), name).toEqual('Das Datum ist ungültig');
      }
    });

    it('LuxMinDate und LuxMaxDate über den Jahreswechsel', async () => {
      // Änderungen durchführen
      testComponent.minDate.set('2027-12-31');
      testComponent.maxDate.set('2028-01-01');
      testComponent.value.set('2028-01-01');
      await LuxTestHelper.wait(fixture);
      datepickerComponent.formControl.markAsTouched();
      await LuxTestHelper.wait(fixture);

      // Nachbedingungen testen
      expect(errorText(fixture)).toBeUndefined();

      // Änderungen durchführen
      testComponent.value.set('2028-01-02');
      await LuxTestHelper.wait(fixture);

      // Nachbedingungen testen
      expect(errorText(fixture)).toEqual('Das Datum überschreitet den Maximalwert');
    });

    it('Sollte luxMinDate in einem anderen Format ignorieren und warnen', async () => {
      const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);

      // Änderungen durchführen
      testComponent.minDate.set('2027-12-31T23:00:00.000Z');
      testComponent.value.set('2000-01-01');
      await LuxTestHelper.wait(fixture);

      // Nachbedingungen testen
      expect(datepickerComponent.formControl.errors).toBeNull();
      expect(warn).toHaveBeenCalledWith(
        "lux-datepicker: luxMinDate erwartet 'yyyy-MM-dd', erhalten '2027-12-31T23:00:00.000Z' (siehe Update-Guide v22)."
      );
    });

    it('LuxCustomFilter mit Wochenend-Filter', async () => {
      // Änderungen durchführen: Samstag und Sonntag sind nicht erlaubt
      const filterSpy = vi.fn((date: string) => ![0, 6].includes(LuxUtil.getDayOfWeek(date)!));
      testComponent.customFilter.set(filterSpy);
      testComponent.value.set('2018-12-22');
      await LuxTestHelper.wait(fixture);
      datepickerComponent.formControl.markAsTouched();
      await LuxTestHelper.wait(fixture);

      // Nachbedingungen testen: 22.12.2018 ist ein Samstag
      expect(filterSpy).toHaveBeenCalledWith('2018-12-22');
      expect(datepickerComponent.formControl.errors).toEqual({ matDatepickerFilter: true });
      expect(errorText(fixture)).toEqual('Das Datum ist ungültig');

      // Änderungen durchführen: 18.12.2018 ist ein Dienstag
      testComponent.value.set('2018-12-18');
      await LuxTestHelper.wait(fixture);

      // Nachbedingungen testen
      expect(datepickerComponent.formControl.errors).toBeNull();
    });

    it('LuxCustomFilter im Kalender', async () => {
      // Änderungen durchführen
      testComponent.customFilter.set((date: string) => ![0, 6].includes(LuxUtil.getDayOfWeek(date)!));
      testComponent.value.set('2018-12-18');
      testComponent.opened.set(true);
      await LuxTestHelper.wait(fixture);

      // Nachbedingungen testen: Samstag, 22.12.2018 ist deaktiviert, Freitag, 21.12.2018 nicht
      const cells: HTMLElement[] = Array.from(overlayHelper.selectAllFromOverlay('.mat-calendar-body-cell'));
      const cellFor = (day: string) => cells.find((cell) => cell.textContent?.trim() === day)!;
      expect(cellFor('22').getAttribute('aria-disabled')).toEqual('true');
      expect(cellFor('21').getAttribute('aria-disabled')).toBeNull();

      testComponent.opened.set(false);
      await LuxTestHelper.wait(fixture);
    });

    it('LuxRequired', async () => {
      // Vorbedingungen testen
      testComponent.required.set(true);
      let matErrorEl = fixture.debugElement.query(By.css('mat-error'));
      expect(matErrorEl).toBeFalsy();

      // Änderungen durchführen
      datepickerComponent.formControl.markAsTouched();
      await LuxTestHelper.wait(fixture);

      // Nachbedingungen testen
      matErrorEl = fixture.debugElement.query(By.css('mat-error'));
      expect(matErrorEl).toBeDefined();
      expect(datepickerComponent.luxRequired()).toBeTruthy();
      expect(datepickerComponent.formControl.invalid).toBeTruthy();

      await LuxTestHelper.wait(fixture);
    });

    it('LuxReadonly', async () => {
      // Vorbedingungen testen
      testComponent.readonly.set(true);
      const inputEl = fixture.debugElement.query(By.css('input'));
      const toggleEl = fixture.debugElement.query(By.css('button')).nativeElement;
      expect(inputEl.attributes['readonly']).toBeFalsy();
      expect(toggleEl.disabled).toBeFalsy();

      // Änderungen durchführen
      testComponent.readonly.set(true);
      await LuxTestHelper.wait(fixture);

      // Nachbedingungen testen
      expect(inputEl.attributes['readonly']).toBeTruthy();
      expect(toggleEl.disabled).toBeTruthy();
      expect(datepickerComponent.luxReadonly()).toBeTruthy();
      expect(datepickerComponent.matDatepicker()!.disabled).toBeTruthy();
    });

    it('LuxValidators', async () => {
      // Vorbedingungen testen
      let matError = fixture.debugElement.query(By.css('mat-error'));

      expect(datepickerComponent.formControl.valid).toBe(true);
      expect(matError).toBeNull();

      // Änderungen durchführen
      testComponent.validators.set([Validators.required]);
      await LuxTestHelper.wait(fixture);
      datepickerComponent.formControl.markAsTouched();
      datepickerComponent.formControl.updateValueAndValidity();
      await LuxTestHelper.wait(fixture);

      // Nachbedingungen testen
      matError = fixture.debugElement.query(By.css('mat-error'));

      expect(datepickerComponent.formControl.valid).toBe(false);
      expect(datepickerComponent.formControl.errors!['required']).toBeDefined();
      expect(matError).not.toBeNull();

      await LuxTestHelper.wait(fixture);
    });

    it('LuxValidators und Datumsprüfung zusammen', async () => {
      // Änderungen durchführen: luxControlValidators ersetzt die Validatoren des FormControls, die
      // Datumsprüfung muss trotzdem erhalten bleiben und ohne weiteren Anstoß wieder greifen
      testComponent.minDate.set('2015-10-20');
      testComponent.value.set('2015-10-19');
      await LuxTestHelper.wait(fixture);
      testComponent.validators.set([Validators.maxLength(20)]);
      await LuxTestHelper.wait(fixture);

      // Nachbedingungen testen
      expect(datepickerComponent.formControl.errors?.['matDatepickerMin']).toEqual({ min: '2015-10-20', actual: '2015-10-19' });
    });

    it('LuxErrorMessage', async () => {
      // Vorbedingungen testen
      let matError = fixture.debugElement.query(By.css('mat-error'));

      expect(matError).toBeNull();

      // Änderungen durchführen
      testComponent.errorMessage.set('Ein Fehler sie zu knechten');
      testComponent.validators.set([Validators.required]);
      await LuxTestHelper.wait(fixture);
      datepickerComponent.formControl.markAsTouched();
      datepickerComponent.formControl.updateValueAndValidity();
      await LuxTestHelper.wait(fixture);

      // Nachbedingungen testen
      matError = fixture.debugElement.query(By.css('mat-error'));

      expect(matError).not.toBeNull();
      expect(matError.nativeElement.textContent.trim()).toEqual('Ein Fehler sie zu knechten');

      await LuxTestHelper.wait(fixture);
    });

    it('LuxErrorMessageCallback', async () => {
      // Vorbedingungen testen
      let matError = fixture.debugElement.query(By.css('mat-error'));
      expect(matError).toBeNull();

      // Änderungen durchführen
      const spy = vi.fn().mockName('errorCb').mockReturnValue('Achtung, das ist ein Fehler');
      testComponent.errorCb.set(spy);

      testComponent.validators.set([Validators.required]);
      await LuxTestHelper.wait(fixture);
      datepickerComponent.formControl.markAsTouched();
      datepickerComponent.formControl.updateValueAndValidity();
      await LuxTestHelper.wait(fixture);

      // Nachbedingungen testen
      matError = fixture.debugElement.query(By.css('mat-error'));

      expect(matError).not.toBeNull();
      expect(matError.nativeElement.textContent.trim()).toEqual('Achtung, das ist ein Fehler');
      expect(spy).toHaveBeenCalled();

      await LuxTestHelper.wait(fixture);
    });

    it('LuxOpened', async () => {
      // Vorbedingungen testen
      let calendar = overlayHelper.selectOneFromOverlay('mat-calendar');
      expect(calendar).toBeNull();

      // Änderungen durchführen
      testComponent.opened.set(true);
      await LuxTestHelper.wait(fixture);

      // Nachbedingungen testen
      calendar = overlayHelper.selectOneFromOverlay('mat-calendar');
      expect(calendar).not.toBeNull();

      // Änderungen durchführen
      testComponent.opened.set(false);
      // Zwei Aufrufe, weil sonst der Calendar nicht rechtzeitig geschlossen wird
      await LuxTestHelper.wait(fixture);

      // Nachbedingungen testen
      calendar = overlayHelper.selectOneFromOverlay('mat-calendar');
      expect(calendar).toBeNull();

      await LuxTestHelper.wait(fixture);
    });

    it('Sollte im Kalender den gespeicherten Tag markieren', async () => {
      // Änderungen durchführen
      testComponent.value.set('2029-05-26');
      await LuxTestHelper.wait(fixture);
      testComponent.opened.set(true);
      await LuxTestHelper.wait(fixture);

      // Nachbedingungen testen
      const selectedCell = overlayHelper.selectOneFromOverlay('.mat-calendar-body-selected');
      expect(selectedCell).not.toBeNull();
      expect(selectedCell.textContent?.trim()).toEqual('26');

      // Änderungen durchführen
      testComponent.opened.set(false);
      // Zwei Aufrufe, weil sonst der Calendar nicht rechtzeitig geschlossen wird
      await LuxTestHelper.wait(fixture);
      await LuxTestHelper.wait(fixture);
    });

    for (const [label, now] of [
      ['kurz nach Mitternacht', new Date(2029, 4, 26, 0, 0, 1)],
      ['kurz vor Mitternacht', new Date(2029, 4, 26, 23, 59, 59)]
    ] as const) {
      it(`Sollte im Kalender heute aus Sicht des Nutzers markieren (${label})`, async () => {
        // Änderungen durchführen
        vi.setSystemTime(now);
        testComponent.opened.set(true);
        await LuxTestHelper.wait(fixture);

        // Nachbedingungen testen
        const todayCell = overlayHelper.selectOneFromOverlay('.mat-calendar-body-today');
        expect(todayCell).not.toBeNull();
        expect(todayCell.textContent?.trim()).toEqual('26');

        testComponent.opened.set(false);
        await LuxTestHelper.wait(fixture);
      });
    }

    it('Sollte einen im Kalender ausgewählten Tag als "yyyy-MM-dd" übernehmen', async () => {
      // Änderungen durchführen
      testComponent.startDate.set('2027-03-01');
      testComponent.opened.set(true);
      await LuxTestHelper.wait(fixture);
      const cells: HTMLElement[] = Array.from(overlayHelper.selectAllFromOverlay('.mat-calendar-body-cell'));
      // 28.03.2027 ist der Tag der Umstellung auf die Sommerzeit
      cells.find((cell) => cell.textContent?.trim() === '28')!.click();
      await LuxTestHelper.wait(fixture);

      // Nachbedingungen testen
      expect(testComponent.value()).toEqual('2027-03-28');
      expect(displayValue(fixture)).toEqual('28.03.2027');
    });

    it('Sollte luxValueChange angemessen oft aufrufen', async () => {
      // Vorbedingungen testen
      const spy = vi.spyOn(testComponent, 'valueChanged').mockReturnValue(undefined);
      await LuxTestHelper.wait(fixture);

      expect(spy).toHaveBeenCalledTimes(0);

      // Änderungen durchführen
      testComponent.value.set('2015-10-19');
      await LuxTestHelper.wait(fixture);

      // Nachbedingungen prüfen
      expect(spy).toHaveBeenCalledTimes(1);

      // Änderungen durchführen
      testComponent.value.set('2015-10-20');
      await LuxTestHelper.wait(fixture);

      // Nachbedingungen prüfen
      expect(spy).toHaveBeenCalledTimes(2);

      // Änderungen durchführen
      // Absichtlich denselben Wert nochmal, sollte nichts auslösen
      testComponent.value.set('2015-10-20');
      await LuxTestHelper.wait(fixture);

      // Nachbedingungen prüfen
      expect(spy).toHaveBeenCalledTimes(2);

      // Änderungen durchführen: ein abgelehnter Wert löst kein luxValueChange aus
      vi.spyOn(console, 'warn').mockImplementation(() => undefined);
      testComponent.value.set('2015-10-21T00:00:00.000Z');
      await LuxTestHelper.wait(fixture);

      // Nachbedingungen prüfen
      expect(spy).toHaveBeenCalledTimes(2);
    });

    it('Sollte Werte in einem anderen Format ablehnen und unverändert lassen', async () => {
      vi.spyOn(console, 'warn').mockImplementation(() => undefined);

      for (const value of REJECTED_VALUES) {
        const context = value instanceof Date ? `Date-Objekt ${value.toISOString()}` : String(value);

        // Änderungen durchführen
        testComponent.value.set(value);
        await LuxTestHelper.wait(fixture);

        // Nachbedingungen prüfen
        expect(testComponent.value(), context).toBe(value);
        expect(datepickerComponent.value(), context).toBe(value);
        expect(datepickerComponent.formControl.errors?.['matDatepickerParse'], context).toBeDefined();
      }
    });

    it('Sollte den korrekten Wert nach asynchronem Aufruf besitzen', async () => {
      // Vorbedingungen testen
      await LuxTestHelper.wait(fixture);
      expect(testComponent.value()).toBeFalsy();
      expect(datepickerComponent.value()).toBeFalsy();
      expect(datepickerComponent.formControl.value).toBeFalsy();

      // Änderungen durchführen
      of('2005-02-05')
        .pipe(delay(20))
        .subscribe((value) => testComponent.value.set(value));
      await LuxTestHelper.wait(fixture, 100);

      // Nachbedingungen testen
      expect(testComponent.value()).toEqual('2005-02-05');
      expect(datepickerComponent.value()).toEqual('2005-02-05');
      expect(datepickerComponent.formControl.value).toEqual('2005-02-05');
    });

    it('Sollte nicht rekursiv Wertaktualisierungen vornehmen', async () => {
      // Vorbedingungen testen
      const spy = vi.spyOn(datepickerComponent, 'notifyFormValueChanged').mockReturnValue(undefined);
      await LuxTestHelper.wait(fixture);
      expect(datepickerComponent.value()).toBeFalsy();
      expect(datepickerComponent.formControl.value).toBeFalsy();
      expect(spy).toHaveBeenCalledTimes(0);

      // Änderungen durchführen
      for (let i = 0; i < 251; i++) {
        if (i % 2 === 0) {
          datepickerComponent.formControl.setValue(1950 + i + '-01-01');
        } else {
          testComponent.value.set(1950 + i + '-01-01');
        }
        fixture.detectChanges();
        await vi.advanceTimersByTimeAsync(0);
        fixture.detectChanges();
      }

      // Nachbedingungen prüfen
      expect(datepickerComponent.value()).toEqual('2200-01-01');
      expect(datepickerComponent.formControl.value).toEqual('2200-01-01');
      expect(spy).toHaveBeenCalledTimes(251);
    }, 15000);
  });

  describe('Zerstören der Komponente', () => {
    // In Reactive Forms überlebt das FormControl die Komponente, z.B. in einem @if, Tab oder Stepper
    let fixture: ComponentFixture<LuxDatepickerToggledTestComponent>;
    let testComponent: LuxDatepickerToggledTestComponent;

    beforeEach(async () => {
      fixture = TestBed.createComponent(LuxDatepickerToggledTestComponent);
      testComponent = fixture.componentInstance;
      await LuxTestHelper.wait(fixture);
    });

    async function setVisible(visible: boolean) {
      testComponent.visible.set(visible);
      await LuxTestHelper.wait(fixture);
    }

    it('Sollte einen ungültig getippten Text das FormControl nicht weiter blockieren lassen', async () => {
      // Änderungen durchführen
      LuxTestHelper.typeInElement(fixture.debugElement.query(By.css('input')).nativeElement, '31.02.2029');
      await LuxTestHelper.wait(fixture);
      expect(testComponent.form.valid).toBe(false);

      await setVisible(false);

      // Nachbedingungen testen
      expect(testComponent.form.valid).toBe(true);

      // Änderungen durchführen
      await setVisible(true);
      LuxTestHelper.typeInElement(fixture.debugElement.query(By.css('input')).nativeElement, '26.05.2029');
      await LuxTestHelper.wait(fixture);

      // Nachbedingungen testen
      expect(testComponent.form.get('datum')!.value).toEqual('2029-05-26');
      expect(testComponent.form.valid).toBe(true);
    });

    it('Sollte alte Grenzen nicht weiter prüfen', async () => {
      // Änderungen durchführen
      testComponent.minDate.set('2029-06-01');
      testComponent.form.get('datum')!.setValue('2029-05-26');
      await LuxTestHelper.wait(fixture);
      expect(testComponent.form.valid).toBe(false);

      await setVisible(false);
      testComponent.minDate.set('2029-01-01');
      await setVisible(true);

      // Nachbedingungen testen
      expect(testComponent.form.valid).toBe(true);
    });

    it('Sollte Validatoren der Anwendung behalten', async () => {
      // Änderungen durchführen
      const control = testComponent.form.get('datum')!;
      control.addValidators(Validators.required);
      control.updateValueAndValidity();

      await setVisible(false);

      // Nachbedingungen testen
      expect(control.hasValidator(Validators.required)).toBe(true);
      expect(control.errors).toEqual({ required: true });
    });
  });

  describe('Signal Forms', () => {
    let fixture: ComponentFixture<LuxDatepickerSignalFormComponent>;
    let testComponent: LuxDatepickerSignalFormComponent;

    beforeEach(async () => {
      fixture = TestBed.createComponent(LuxDatepickerSignalFormComponent);
      testComponent = fixture.componentInstance;
      await LuxTestHelper.wait(fixture);
    });

    it('Sollte einen Wert anzeigen und eine Eingabe als "yyyy-MM-dd" übernehmen', async () => {
      // Änderungen durchführen
      testComponent.model.set({ datum: '2029-05-26' });
      await LuxTestHelper.wait(fixture);

      // Nachbedingungen testen
      expect(displayValue(fixture)).toEqual('26.05.2029');
      expect(testComponent.testForm().valid()).toBe(true);

      // Änderungen durchführen
      LuxTestHelper.typeInElement(fixture.debugElement.query(By.css('input')).nativeElement, '27.05.2029');
      await LuxTestHelper.wait(fixture);

      // Nachbedingungen testen
      expect(testComponent.model().datum).toEqual('2029-05-27');
    });

    it('Sollte einen Wert im falschen Format über luxDateValue ungültig machen', async () => {
      vi.spyOn(console, 'warn').mockImplementation(() => undefined);

      // Änderungen durchführen
      testComponent.model.set({ datum: '2029-05-26T00:00:00.000Z' });
      await LuxTestHelper.wait(fixture);

      // Nachbedingungen testen
      expect(testComponent.model().datum).toEqual('2029-05-26T00:00:00.000Z');
      expect(testComponent.testForm.datum().valid()).toBe(false);
      expect(testComponent.testForm.datum().errors()[0].kind).toEqual('matDatepickerParse');
    });

    it('Sollte min und max über luxDateValue prüfen', async () => {
      // Änderungen durchführen
      testComponent.model.set({ datum: '2029-04-30' });
      await LuxTestHelper.wait(fixture);

      // Nachbedingungen testen
      expect(testComponent.testForm.datum().errors()[0].kind).toEqual('matDatepickerMin');

      // Änderungen durchführen
      testComponent.model.set({ datum: '2029-05-01' });
      await LuxTestHelper.wait(fixture);

      // Nachbedingungen testen
      expect(testComponent.testForm.datum().valid()).toBe(true);
    });

    it('Sollte eine ungültige Texteingabe als Fehler an das Feld melden', async () => {
      // Änderungen durchführen
      LuxTestHelper.typeInElement(fixture.debugElement.query(By.css('input')).nativeElement, '31.06.2029');
      await LuxTestHelper.wait(fixture);

      // Nachbedingungen testen
      expect(testComponent.testForm.datum().valid()).toBe(false);
      expect(
        testComponent.testForm
          .datum()
          .errors()
          .map((error) => error.kind)
      ).toContain('matDatepickerParse');

      // Änderungen durchführen
      LuxTestHelper.typeInElement(fixture.debugElement.query(By.css('input')).nativeElement, '30.06.2029');
      await LuxTestHelper.wait(fixture);

      // Nachbedingungen testen
      expect(testComponent.model().datum).toEqual('2029-06-30');
      expect(testComponent.testForm.datum().valid()).toBe(true);
    });

    for (const focused of [false, true]) {
      it(`Sollte einen ungültig getippten Text bei form().reset() leeren (${focused ? 'mit' : 'ohne'} Fokus)`, async () => {
        // Vorbedingungen herstellen
        const datepickerComponent: LuxDatepickerComponent = fixture.debugElement.query(
          By.directive(LuxDatepickerComponent)
        ).componentInstance;
        const inputEl = fixture.debugElement.query(By.css('input')).nativeElement;
        LuxTestHelper.typeInElement(inputEl, '31.02.2029');
        await LuxTestHelper.wait(fixture);
        if (!focused) {
          LuxTestHelper.dispatchFakeEvent(inputEl, 'focusout');
          inputEl.blur();
          await LuxTestHelper.wait(fixture);
        }

        // Änderungen durchführen
        testComponent.testForm().reset();
        await LuxTestHelper.wait(fixture);

        // Nachbedingungen testen
        expect(displayValue(fixture)).toEqual('');
        expect(datepickerComponent.formControl.errors).toBeNull();
        expect(datepickerComponent.isInvalid()).toBe(false);
        expect(datepickerComponent.errorMessage()).toBeUndefined();
        expect(testComponent.testForm.datum().valid()).toBe(true);
      });
    }

    it('Sollte bei form().reset(wert) den neuen Wert auch mit Fokus anzeigen', async () => {
      // Vorbedingungen herstellen
      testComponent.model.set({ datum: '2029-05-26' });
      await LuxTestHelper.wait(fixture);
      fixture.debugElement.query(By.css('input')).nativeElement.focus();
      await LuxTestHelper.wait(fixture);

      // Änderungen durchführen
      testComponent.testForm().reset({ datum: '2030-01-02' });
      await LuxTestHelper.wait(fixture);

      // Nachbedingungen testen
      expect(displayValue(fixture)).toEqual('02.01.2030');
    });

    it('Sollte bei einer ungültigen Eingabe den eigenen Text einem required-Text aus dem Schema vorziehen', async () => {
      const localFixture = TestBed.createComponent(LuxDatepickerRequiredSignalFormComponent);
      await LuxTestHelper.wait(localFixture);
      const datepickerComponent: LuxDatepickerComponent = localFixture.debugElement.query(
        By.directive(LuxDatepickerComponent)
      ).componentInstance;

      LuxTestHelper.typeInElement(localFixture.debugElement.query(By.css('input')).nativeElement, '31.02.2029');
      await LuxTestHelper.wait(localFixture);

      expect(datepickerComponent.errorMessage()).toEqual('Das Datum ist ungültig');
    });

    it('Sollte einen Wert von außen nicht umschreiben und das Feld nicht dirty markieren', async () => {
      // Änderungen durchführen
      testComponent.model.set({ datum: '2029-05-26T00:00:00' });
      await LuxTestHelper.wait(fixture);

      // Nachbedingungen testen
      expect(testComponent.model().datum).toEqual('2029-05-26T00:00:00');
      expect(testComponent.testForm.datum().dirty()).toBe(false);
      expect(testComponent.testForm.datum().valid()).toBe(true);
    });
  });

  describe('Geteiltes FormControl (mehrere Instanzen)', () => {
    // Regressionstest für Issue #289: Zwei lux-datepicker-Instanzen, die per luxControlBinding an
    // dasselbe FormControl gebunden sind (z.B. Normal-/Spalten-Ansicht derselben Form), lösten eine
    // Endlosschleife über formControl.valueChanges aus. Der reine Ablauf dieses Tests (kein Timeout,
    // kein "Maximum call stack size exceeded") ist die eigentliche Absicherung.
    let fixture: ComponentFixture<LuxDatepickerSharedControlComponent>;
    let testComponent: LuxDatepickerSharedControlComponent;
    let datepickerComponents: LuxDatepickerComponent[];

    beforeEach(async () => {
      fixture = TestBed.createComponent(LuxDatepickerSharedControlComponent);
      testComponent = fixture.componentInstance;
      await LuxTestHelper.wait(fixture);
      datepickerComponents = fixture.debugElement
        .queryAll(By.directive(LuxDatepickerComponent))
        .map((debugEl) => debugEl.componentInstance as LuxDatepickerComponent);
    });

    it('sollte mit einem vorbelegten Wert rendern, ohne in eine Endlosschleife zu laufen', async () => {
      expect(datepickerComponents.length).toEqual(2);
      expect(testComponent.form.get('datepicker')!.value).toEqual('2020-01-01');
      expect(datepickerComponents[0].value()).toEqual('2020-01-01');
      expect(datepickerComponents[1].value()).toEqual('2020-01-01');
    });

    it('sollte einen über die erste Instanz gesetzten Wert an die zweite Instanz weitergeben', async () => {
      // Änderungen durchführen
      testComponent.form.get('datepicker')!.setValue('2021-05-10');
      await LuxTestHelper.wait(fixture);

      // Nachbedingungen testen
      expect(datepickerComponents[0].value()).toEqual('2021-05-10');
      expect(datepickerComponents[1].value()).toEqual('2021-05-10');
    });
  });

  describe('Ausgaben enthalten nur Strings', () => {
    // Alles, was der Datepicker in Formular, Model oder Outputs schreibt, ist "yyyy-MM-dd" oder null - nie ein
    // Date-Objekt oder ein Objekt des DateAdapters (siehe Update-Guide v22).
    const hosts: { name: string; type: Type<LuxDatepickerOutputHost> }[] = [
      { name: 'Reactive Form (luxControlBinding)', type: LuxDatepickerOutputReactiveComponent },
      { name: 'Signal Form ([formField])', type: LuxDatepickerOutputSignalFormComponent },
      { name: 'ohne Formular ([(value)])', type: LuxDatepickerOutputValueComponent },
      { name: 'ohne Formular ([(luxValue)])', type: LuxDatepickerOutputLuxValueComponent }
    ];

    for (const { name, type } of hosts) {
      describe(name, () => {
        let fixture: ComponentFixture<LuxDatepickerOutputHost>;
        let host: LuxDatepickerOutputHost;

        beforeEach(async () => {
          fixture = TestBed.createComponent(type);
          host = fixture.componentInstance;
          await LuxTestHelper.wait(fixture);
        });

        async function typeIn(text: string) {
          LuxTestHelper.typeInElement(fixture.debugElement.query(By.css('input')).nativeElement, text);
          await LuxTestHelper.wait(fixture);
        }

        async function selectInCalendar(day: string) {
          host.opened.set(true);
          await LuxTestHelper.wait(fixture);
          const cells: HTMLElement[] = Array.from(new LuxOverlayHelper().selectAllFromOverlay('.mat-calendar-body-cell'));
          cells.find((cell) => cell.textContent?.trim() === day)!.click();
          host.opened.set(false);
          await LuxTestHelper.wait(fixture);
        }

        it('Sollte nur "yyyy-MM-dd" oder null ausgeben', async () => {
          const steps: [string, () => Promise<void>, string | null][] = [
            ['Eingabe', () => typeIn('26.05.2029'), '2029-05-26'],
            ['Auswahl im Kalender', () => selectInCalendar('28'), '2029-05-28'],
            ['Eingabe ohne Trenner', () => typeIn('01062029'), '2029-06-01'],
            ['ungültige Eingabe', () => typeIn('31.02.2029'), null],
            ['Eingabe nach ungültiger Eingabe', () => typeIn('02.06.2029'), '2029-06-02'],
            ['Leeren', () => typeIn(''), null]
          ];

          for (const [step, action, expected] of steps) {
            await action();
            expect(host.current(), step).toBe(expected);
          }

          expectOnlyOutputFormat(host, /^\d{4}-\d{2}-\d{2}$/);
        });
      });
    }
  });

  describe('A11y', () => {
    let fixture: ComponentFixture<LuxDatepickerA11yComponent>;
    let testComponent: LuxDatepickerA11yComponent;

    beforeAll(() => {
      LuxA11yTestHelper.addA11yMatchers();
    });

    beforeEach(async () => {
      fixture = TestBed.createComponent(LuxDatepickerA11yComponent);
      await LuxTestHelper.wait(fixture);
      testComponent = fixture.componentInstance;
    });

    it('sollte keine Barrierefreiheitsverletzungen haben (leer)', async () => {
      await LuxTestHelper.wait(fixture);
      await LuxA11yTestHelper.expectNoA11yViolations(fixture.nativeElement);
    });

    it('sollte keine Barrierefreiheitsverletzungen haben (disabled)', async () => {
      testComponent.disabled.set(true);
      await LuxTestHelper.wait(fixture);
      await LuxA11yTestHelper.expectNoA11yViolations(fixture.nativeElement);
    });

    it('sollte keine Barrierefreiheitsverletzungen haben (readonly)', async () => {
      testComponent.readonly.set(true);
      await LuxTestHelper.wait(fixture);
      await LuxA11yTestHelper.expectNoA11yViolations(fixture.nativeElement);
    });

    it('sollte keine Barrierefreiheitsverletzungen haben (required)', async () => {
      testComponent.required.set(true);
      await LuxTestHelper.wait(fixture);
      await LuxA11yTestHelper.expectNoA11yViolations(fixture.nativeElement);
    });
  });
});

@Component({
  template: `
    <lux-datepicker
      luxLabel="Datum"
      [(luxValue)]="value"
      [luxDisabled]="disabled()"
      [luxReadonly]="readonly()"
      [luxRequired]="required()"
      [luxMinDate]="minDate()"
      [luxMaxDate]="maxDate()"
      [luxCustomFilter]="customFilter()"
      [luxStartDate]="startDate()"
      [luxShowToggle]="showToggle"
      [luxErrorMessage]="errorMessage()"
      [luxErrorCallback]="errorCb()"
      [luxControlValidators]="validators()"
      [luxOpened]="opened()"
      (luxValueChange)="valueChanged()"
    ></lux-datepicker>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [LuxDatepickerComponent]
})
class LuxNoFormAttributeTestComponent {
  value = signal<any>(undefined);
  disabled = signal<boolean>(false);
  readonly = signal(false);
  required = signal(false);
  minDate = signal<string | null>(null);
  maxDate = signal<string | null>(null);
  startDate = signal<string | null>(null);
  customFilter = signal<LuxDateFilterFn | undefined>(undefined);
  showToggle = true;
  errorMessage = signal<string | undefined>(undefined);
  validators = signal<ValidatorFnType | undefined>(undefined);
  opened = signal(false);
  errorCb = signal<(value: any, errors: LuxValidationErrors) => string | undefined>(() => undefined);

  valueChanged() {}
}

export const Validator2019NotAllowed = (control: AbstractControl) => {
  if ('value' in control && typeof control.value === 'string' && (control.value as string).indexOf('2019') !== -1) {
    return { NotAllowed2019: true };
  }

  return null;
};

export const exampleErrorCallback = (value: any, errors: LuxValidationErrors) => {
  if (errors['required']) {
    return 'Darf nicht leer sein';
  } else if (errors['NotAllowed2019']) {
    return 'Das Jahr 2019 darf nicht verwendet werden';
  }
  return 'Es ist ein Fehler aufgetreten';
};

@Component({
  template: `
    <div [formGroup]="form">
      <lux-datepicker luxLabel="Datum" luxControlBinding="datepicker" [luxErrorCallback]="errorCallBack"></lux-datepicker>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, LuxDatepickerComponent]
})
class LuxFormCustomValidatorComponent {
  form: FormGroup;
  formControl: AbstractControl;

  errorCallBack = exampleErrorCallback;

  constructor() {
    this.form = new FormGroup<any>({
      datepicker: new FormControl<string>('', {
        validators: Validators.compose([Validator2019NotAllowed, Validators.required]),
        nonNullable: true
      })
    });
    this.formControl = this.form.get('datepicker')!;
  }
}

@Component({
  template: `
    <div [formGroup]="form">
      <lux-datepicker luxLabel="Datum" luxControlBinding="datepicker"></lux-datepicker>
      {{ formControl.value }}
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, LuxDatepickerComponent]
})
class LuxFormTestComponent {
  form: FormGroup;
  formControl: AbstractControl;

  constructor() {
    this.form = new FormGroup<any>({
      datepicker: new FormControl<unknown>(null)
    });
    this.formControl = this.form.get('datepicker')!;
  }
}

@Component({
  template: `
    <div [formGroup]="form">
      @if (visible()) {
        <lux-datepicker luxLabel="Datum" luxControlBinding="datum" [luxMinDate]="minDate()" />
      }
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, LuxDatepickerComponent]
})
class LuxDatepickerToggledTestComponent {
  readonly visible = signal(true);
  readonly minDate = signal<string | null>(null);
  readonly form = new FormGroup({
    datum: new FormControl<string | null>(null)
  });
}

@Component({
  selector: 'lux-datepicker-required-signal-form',
  template: `<lux-datepicker luxLabel="Datum" [formField]="testForm.datum" />`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [LuxDatepickerComponent, FormField]
})
class LuxDatepickerRequiredSignalFormComponent {
  readonly model = signal<{ datum: string | null }>({ datum: null });
  readonly testForm = form(this.model, (path) => {
    required(path.datum, { message: 'Bitte ausfüllen' });
  });
}

@Component({
  template: `<lux-datepicker luxLabel="Datum" luxMinDate="2029-05-01" [formField]="testForm.datum" />`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormField, LuxDatepickerComponent]
})
class LuxDatepickerSignalFormComponent {
  readonly model = signal<{ datum: string | null }>({ datum: null });
  readonly testForm = form(this.model, (path) => {
    validate(path.datum, luxDateValue({ min: () => '2029-05-01' }));
  });
}

@Component({
  template: `
    <div [formGroup]="form">
      <lux-datepicker luxLabel="Datum (Ansicht 1)" luxControlBinding="datepicker"></lux-datepicker>
      <lux-datepicker luxLabel="Datum (Ansicht 2)" luxControlBinding="datepicker"></lux-datepicker>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, LuxDatepickerComponent]
})
class LuxDatepickerSharedControlComponent {
  readonly form = new FormGroup({
    datepicker: new FormControl<string | null>('2020-01-01')
  });
}

@Component({
  template: `
    <lux-datepicker luxLabel="Datum" [luxDisabled]="disabled()" [luxReadonly]="readonly()" [luxRequired]="required()"></lux-datepicker>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [LuxDatepickerComponent]
})
class LuxDatepickerA11yComponent {
  disabled = signal(false);
  readonly = signal(false);
  required = signal(false);
}

/**
 * Sammelt alles, was der Datepicker nach außen gibt. channels nennt die Ausgaben, die der Host abhört.
 */
abstract class LuxDatepickerOutputHost {
  abstract readonly channels: string[];
  readonly emitted: { channel: string; value: unknown }[] = [];
  readonly opened = signal(false);

  abstract current(): unknown;

  record(channel: string, value: unknown) {
    this.emitted.push({ channel, value });
  }
}

/**
 * Jede Ausgabe ist null oder ein String im erwarteten Format, und jede abgehörte Ausgabe wurde mindestens einmal
 * ausgelöst. Sonst bliebe unbemerkt, wenn ein Kanal gar nichts liefert.
 */
function expectOnlyOutputFormat(host: LuxDatepickerOutputHost, format: RegExp) {
  for (const { channel, value } of host.emitted) {
    const context = `${channel}: ${value instanceof Date ? 'Date-Objekt' : JSON.stringify(value)}`;
    expect(value === null || (typeof value === 'string' && format.test(value)), context).toBe(true);
  }

  expect([...new Set(host.emitted.map(({ channel }) => channel))].sort()).toEqual([...host.channels].sort());
}

@Component({
  template: `
    <div [formGroup]="form">
      <lux-datepicker
        luxLabel="Datum"
        luxControlBinding="datum"
        [luxOpened]="opened()"
        (valueChange)="record('valueChange', $event)"
        (luxValueChange)="record('luxValueChange', $event)"
      />
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, LuxDatepickerComponent]
})
class LuxDatepickerOutputReactiveComponent extends LuxDatepickerOutputHost {
  readonly channels = ['form.valueChanges', 'control.valueChanges', 'valueChange', 'luxValueChange'];
  readonly form = new FormGroup({
    datum: new FormControl<string | null>(null)
  });

  constructor() {
    super();
    this.form.valueChanges.subscribe((value) => this.record('form.valueChanges', value.datum));
    this.form.controls.datum.valueChanges.subscribe((value) => this.record('control.valueChanges', value));
  }

  current() {
    return this.form.controls.datum.value;
  }
}

@Component({
  template: `
    <lux-datepicker
      luxLabel="Datum"
      [formField]="testForm.datum"
      [luxOpened]="opened()"
      (valueChange)="record('valueChange', $event)"
      (luxValueChange)="record('luxValueChange', $event)"
    />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormField, LuxDatepickerComponent]
})
class LuxDatepickerOutputSignalFormComponent extends LuxDatepickerOutputHost {
  readonly channels = ['valueChange', 'luxValueChange'];
  readonly model = signal<{ datum: string | null }>({ datum: null });
  readonly testForm = form(this.model);

  current() {
    return this.model().datum;
  }
}

@Component({
  template: `
    <lux-datepicker
      luxLabel="Datum"
      [(value)]="value"
      [luxOpened]="opened()"
      (valueChange)="record('valueChange', $event)"
      (luxValueChange)="record('luxValueChange', $event)"
    />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [LuxDatepickerComponent]
})
class LuxDatepickerOutputValueComponent extends LuxDatepickerOutputHost {
  readonly channels = ['valueChange', 'luxValueChange'];
  readonly value = signal<string | null>(null);

  current() {
    return this.value();
  }
}

@Component({
  template: `
    <lux-datepicker
      luxLabel="Datum"
      [(luxValue)]="value"
      [luxOpened]="opened()"
      (valueChange)="record('valueChange', $event)"
      (luxValueChange)="record('luxValueChange', $event)"
    />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [LuxDatepickerComponent]
})
class LuxDatepickerOutputLuxValueComponent extends LuxDatepickerOutputHost {
  readonly channels = ['valueChange', 'luxValueChange'];
  readonly value = signal<string | null>(null);

  current() {
    return this.value();
  }
}
