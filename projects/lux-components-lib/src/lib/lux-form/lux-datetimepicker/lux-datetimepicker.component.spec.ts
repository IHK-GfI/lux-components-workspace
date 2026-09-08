// noinspection DuplicatedCode

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_DATE_LOCALE } from '@angular/material/core';

import { provideHttpClient, withInterceptorsFromDi, withXhr } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ChangeDetectionStrategy, Component, LOCALE_ID, signal } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { LuxA11yTestHelper, LuxOverlayHelper, LuxTestHelper } from '@ihk-gfi/lux-components/test-utils';
import { of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { provideLuxTranslocoTesting } from '../../../testing/transloco-test.provider';
import { LuxConsoleService } from '../../lux-util/lux-console.service';
import { LuxUtil } from '../../lux-util/lux-util';
import { LuxDateFilterFn } from '../lux-datepicker/lux-datepicker.component';
import { LuxValidationErrors, ValidatorFnType } from '../lux-form-model/lux-form-component-base.class';
import { LuxDatetimepickerComponent } from './lux-datetimepicker.component';

describe('LuxDatetimepickerComponent', () => {
  const usedLocale = 'de-DE';

  beforeEach(async () => {
    TestBed.configureTestingModule({
      providers: [
        LuxConsoleService,
        provideNoopAnimations(),
        provideHttpClient(withXhr(), withInterceptorsFromDi()),
        provideHttpClientTesting(),
        provideLuxTranslocoTesting()
      ]
    }).compileComponents();
  });

  describe('Validatoren', () => {
    let fixture: ComponentFixture<LuxFormCustomValidatorComponent>;
    let testComponent: LuxFormCustomValidatorComponent;
    let datepickerComponent: LuxDatetimepickerComponent;

    beforeEach(async () => {
      TestBed.configureTestingModule({
        providers: [
          { provide: LOCALE_ID, useValue: usedLocale },
          { provide: MAT_DATE_LOCALE, useValue: usedLocale }
        ]
      });
      fixture = TestBed.createComponent(LuxFormCustomValidatorComponent);
      testComponent = fixture.componentInstance;
      datepickerComponent = fixture.debugElement.query(By.directive(LuxDatetimepickerComponent)).componentInstance;
      await new Promise((resolve) => setTimeout(resolve, 0));
      fixture.detectChanges();
    });

    it('Sollte mehrere Validatoren (Standard- und Custom-Validatoren) unterstützen', async () => {
      // Vorbedingungen testen
      let matErrorEl = fixture.debugElement.query(By.css('mat-error'));
      expect(testComponent.formControl.value).toBeFalsy();
      expect(datepickerComponent.value()).toBeFalsy();
      expect(matErrorEl).toBeFalsy();

      // Änderungen durchführen
      testComponent.formControl.setValue('');
      testComponent.formControl.markAsTouched();
      await LuxTestHelper.wait(fixture);

      // Nachbedingungen testen
      matErrorEl = fixture.debugElement.query(By.css('mat-error'));
      expect(matErrorEl).not.toBeNull();
      expect(matErrorEl.nativeElement.innerHTML.trim()).toEqual('Darf nicht leer sein');

      // Änderungen durchführen
      testComponent.formControl.setValue('2019-01-01T00:00:00.000Z');
      testComponent.formControl.markAsTouched();
      await LuxTestHelper.wait(fixture);

      // Nachbedingungen testen
      const datepickerEl = fixture.debugElement.query(By.css('input'));
      expect(LuxUtil.stringWithoutASCIIChars(datepickerEl.nativeElement.value)).toEqual('01.01.2019, 00:00');

      matErrorEl = fixture.debugElement.query(By.css('mat-error'));
      expect(matErrorEl).not.toBeNull();
      expect(matErrorEl.nativeElement.innerHTML.trim()).toEqual('Das Jahr 2019 darf nicht verwendet werden');

      // Änderungen durchführen
      LuxTestHelper.typeInElement(datepickerEl.nativeElement, '01.01.2020, 00:00', false);
      await LuxTestHelper.wait(fixture);

      // Nachbedingungen testen
      matErrorEl = fixture.debugElement.query(By.css('mat-error'));
      expect(matErrorEl).toBeNull();

      // Änderungen durchführen
      LuxTestHelper.typeInElement(datepickerEl.nativeElement, '01.01.20, 00:00', false);
      await LuxTestHelper.wait(fixture);

      // Nachbedingungen testen
      matErrorEl = fixture.debugElement.query(By.css('mat-error'));
      expect(matErrorEl).not.toBeNull();
      expect(matErrorEl.nativeElement.innerHTML.trim()).toEqual('Darf nicht leer sein');
    });
  });

  describe('innerhalb eines Formulars', () => {
    let fixture: ComponentFixture<LuxFormTestComponent>;
    let testComponent: LuxFormTestComponent;
    let datepickerComponent: LuxDatetimepickerComponent;

    beforeEach(async () => {
      TestBed.configureTestingModule({
        providers: [
          { provide: LOCALE_ID, useValue: usedLocale },
          { provide: MAT_DATE_LOCALE, useValue: usedLocale }
        ]
      });
      fixture = TestBed.createComponent(LuxFormTestComponent);
      testComponent = fixture.componentInstance;
      datepickerComponent = fixture.debugElement.query(By.directive(LuxDatetimepickerComponent)).componentInstance;
      await new Promise((resolve) => setTimeout(resolve, 0));
      fixture.detectChanges();
    });

    it('Sollte einen Wert nach dem Rendern besitzen', async () => {
      // Vorbedingungen testen
      expect(testComponent.formControl.value).toBeFalsy();
      expect(datepickerComponent.value()).toBeFalsy();

      // Änderungen durchführen
      testComponent.formControl.setValue('2015-06-10T01:23:00.000Z');
      await LuxTestHelper.wait(fixture);

      // Nachbedingungen testen
      const utcNullifiedDate = new Date(0);
      utcNullifiedDate.setUTCFullYear(2015, 5, 10);
      utcNullifiedDate.setUTCHours(1, 23, 0, 0);
      const datepickerEl = fixture.debugElement.query(By.css('input'));
      expect(LuxUtil.stringWithoutASCIIChars(datepickerEl.nativeElement.value)).toEqual('10.06.2015, 01:23');
      expect(datepickerComponent.value()).toEqual(utcNullifiedDate.toISOString());
    });

    it('Sollte den Wert aktualisieren', async () => {
      fixture.detectChanges();
      // Vorbedingungen testen
      expect(testComponent.formControl.value).toBeFalsy();
      expect(datepickerComponent.value()).toBeFalsy();

      // Änderungen durchführen
      testComponent.formControl.setValue('2015-06-10T00:00:00.000Z');
      await LuxTestHelper.wait(fixture);

      // Nachbedingungen testen
      const utcNullifiedDate = new Date(0);
      utcNullifiedDate.setUTCFullYear(2015, 5, 10);
      utcNullifiedDate.setUTCHours(0, 0, 0, 0);
      let datepickerEl = fixture.debugElement.query(By.css('input'));
      expect(LuxUtil.stringWithoutASCIIChars(datepickerEl.nativeElement.value)).toEqual('10.06.2015, 00:00');
      expect(datepickerComponent.value()).toEqual(utcNullifiedDate.toISOString());

      // Änderungen durchführen
      testComponent.formControl.setValue('2015-07-10T12:15:00.000Z');
      await LuxTestHelper.wait(fixture);

      // Nachbedingungen testen
      utcNullifiedDate.setUTCMonth(6);
      utcNullifiedDate.setUTCHours(12, 15, 0, 0);
      datepickerEl = fixture.debugElement.query(By.css('input'));
      expect(LuxUtil.stringWithoutASCIIChars(datepickerEl.nativeElement.value)).toEqual('10.07.2015, 12:15');
      expect(datepickerComponent.value()).toEqual(utcNullifiedDate.toISOString());
    });

    it('Sollte das Datum 01.0.2020 in 01.01.2020 umwandeln und nicht in 01.12.2019', async () => {
      fixture.detectChanges();
      // Vorbedingungen testen
      expect(testComponent.formControl.value).toBeFalsy();
      expect(datepickerComponent.value()).toBeFalsy();

      // Änderungen durchführen
      const datepickerEl = fixture.debugElement.query(By.css('input'));
      LuxTestHelper.typeInElement(datepickerEl.nativeElement, '01.0.2020, 00:00', false);
      LuxTestHelper.dispatchEvent(datepickerEl.nativeElement, new Event('focusout'));
      await LuxTestHelper.wait(fixture);

      // Nachbedingungen testen
      const utcNullifiedDate = new Date(0);
      utcNullifiedDate.setUTCFullYear(2020, 0, 1);
      utcNullifiedDate.setUTCHours(0, 0);

      expect(LuxUtil.stringWithoutASCIIChars(datepickerEl.nativeElement.value)).toEqual('01.01.2020, 00:00');
      expect(datepickerComponent.value()).toEqual(utcNullifiedDate.toISOString());
    });

    it('Sollte den korrekten mit Nullen aufgefüllten UTC-Wert ausgeben', async () => {
      const utcDate = new Date(0);
      utcDate.setUTCFullYear(2000, 0, 1);
      utcDate.setUTCHours(9, 15, 0, 0);
      // Vorbedingungen testen
      expect(testComponent.formControl.value).toBeFalsy();
      expect(datepickerComponent.value()).toBeFalsy();

      // Änderungen durchführen
      testComponent.formControl.setValue('2000-01-01T10:15:23.000+01:00');
      await LuxTestHelper.wait(fixture);

      // Nachbedingungen testen
      expect(testComponent.formControl.value).toEqual(utcDate.toISOString());
      expect(datepickerComponent.value()).toEqual(utcDate.toISOString());
    });

    it('Sollte required sein', async () => {
      testComponent.formControl.setValidators(Validators.required);
      fixture.detectChanges();
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
      of('2005-02-05, 00:00')
        .pipe(delay(2000))
        .subscribe((value) => testComponent.formControl.setValue(value));
      await LuxTestHelper.wait(fixture, 2500);

      // Nachbedingungen testen
      const expectedDate = '2005-02-05T00:00:00.000Z';
      expect(testComponent.formControl.value).toEqual(expectedDate);
      expect(datepickerComponent.value()).toEqual(expectedDate);
      expect(datepickerComponent.formControl.value).toEqual(expectedDate);
    });
  });

  describe('außerhalb eines Formulars', () => {
    let fixture: ComponentFixture<LuxNoFormAttributeTestComponent>;
    let testComponent: LuxNoFormAttributeTestComponent;
    let datepickerComponent: LuxDatetimepickerComponent;
    let overlayHelper: LuxOverlayHelper;

    beforeEach(async () => {
      TestBed.configureTestingModule({
        providers: [
          { provide: LOCALE_ID, useValue: usedLocale },
          { provide: MAT_DATE_LOCALE, useValue: usedLocale }
        ]
      });
      fixture = TestBed.createComponent(LuxNoFormAttributeTestComponent);
      testComponent = fixture.componentInstance;
      datepickerComponent = fixture.debugElement.query(By.directive(LuxDatetimepickerComponent)).componentInstance;
      overlayHelper = new LuxOverlayHelper();

      fixture.detectChanges();
      await new Promise((resolve) => setTimeout(resolve, 0));
      fixture.detectChanges();
    });

    it('LuxValue Simple', async () => {
      // Vorbedingungen testen
      expect(testComponent.value()).toBeFalsy();
      expect(datepickerComponent.value()).toBeFalsy();

      // Änderungen durchführen
      testComponent.value.set('10.07.2015');
      await LuxTestHelper.wait(fixture);

      // Nachbedingungen testen
      const datepickerEl = fixture.debugElement.query(By.css('input'));
      expect(LuxUtil.stringWithoutASCIIChars(datepickerEl.nativeElement.value)).toEqual('10.07.2015');
      expect(datepickerComponent.value()).toEqual(testComponent.value());

      await new Promise((resolve) => setTimeout(resolve, 0));
      fixture.detectChanges();
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
      let matErrorEl = fixture.debugElement.query(By.css('mat-error'));
      expect(matErrorEl).toBeFalsy();

      // Änderungen durchführen
      testComponent.minDate.set('20.10.2015, 00:00');
      testComponent.maxDate.set('25.10.2015, 23:59');
      testComponent.value.set(new Date(2015, 9, 23).toISOString());
      await LuxTestHelper.wait(fixture);

      matErrorEl = fixture.debugElement.query(By.css('mat-error'));

      // Nachbedingungen testen
      expect(matErrorEl).toBeFalsy();

      // Änderungen durchführen
      testComponent.value.set('2015-10-19T23:59:00.000Z');
      await LuxTestHelper.wait(fixture);
      datepickerComponent.formControl.markAsTouched();
      datepickerComponent.formControl.updateValueAndValidity();
      await LuxTestHelper.wait(fixture);
      matErrorEl = fixture.debugElement.query(By.css('mat-error'));

      // Nachbedingungen testen
      expect(matErrorEl).not.toBeNull();
      expect(matErrorEl.nativeElement.innerText.trim()).toEqual('Das Datum unterschreitet den Minimalwert');

      // // Änderungen durchführen
      testComponent.value.set('2015-10-26T00:00:00.000Z');
      await LuxTestHelper.wait(fixture);
      datepickerComponent.formControl.markAsTouched();
      datepickerComponent.formControl.updateValueAndValidity();
      await LuxTestHelper.wait(fixture);
      matErrorEl = fixture.debugElement.query(By.css('mat-error'));

      // Nachbedingungen testen
      expect(matErrorEl.nativeElement.innerText.trim()).toEqual('Das Datum überschreitet den Maximalwert');
    });

    it('LuxCustomFilter', async () => {
      // Vorbedingungen testen
      let matErrorEl = fixture.debugElement.query(By.css('mat-error'));
      expect(matErrorEl).toBeFalsy();

      // Änderungen durchführen
      testComponent.customFilter.set((d: Date | null): boolean => {
        const day = d ? d.getDay() : 0;
        // Prevent Saturday and Sunday from being selected.
        return day !== 0 && day !== 6;
      });
      await LuxTestHelper.wait(fixture);
      testComponent.value.set(new Date(2018, 11, 18).toISOString());
      await LuxTestHelper.wait(fixture);
      matErrorEl = fixture.debugElement.query(By.css('mat-error'));

      // Nachbedingungen testen
      expect(matErrorEl).toBeDefined();

      await new Promise((resolve) => setTimeout(resolve, 0));
      fixture.detectChanges();
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

      await new Promise((resolve) => setTimeout(resolve, 0));
      fixture.detectChanges();
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

      expect(datepickerComponent.formControl!.valid).toBe(false);
      expect(datepickerComponent.formControl.errors!['required']).toBeDefined();
      expect(matError).not.toBeNull();

      await new Promise((resolve) => setTimeout(resolve, 0));
      fixture.detectChanges();
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

      await new Promise((resolve) => setTimeout(resolve, 0));
      fixture.detectChanges();
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

      await new Promise((resolve) => setTimeout(resolve, 0));
      fixture.detectChanges();
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
      await LuxTestHelper.wait(fixture);

      // Nachbedingungen testen
      calendar = overlayHelper.selectOneFromOverlay('mat-calendar');
      expect(calendar).toBeNull();

      await new Promise((resolve) => setTimeout(resolve, 0));
      fixture.detectChanges();
    });

    it('Sollte beim Öffnen den korrekten Monat anzeigen, wenn der 1. eines Monats ausgewählt ist', async () => {
      // Vorbedingungen testen
      expect(testComponent.value()).toBeFalsy();

      // Änderungen durchführen: Wert auf den 1. April setzen (UTC Mitternacht)
      testComponent.value.set('2024-04-01T00:00:00.000Z');
      testComponent.opened.set(true);
      await LuxTestHelper.wait(fixture);

      // Nachbedingungen testen: Die ausgewählte Zelle muss "April" enthalten (nicht "März")
      const selectedCell = overlayHelper.selectOneFromOverlay('.mat-calendar-body-selected');
      expect(selectedCell).not.toBeNull();
      // Die aria-label der ausgewählten Zelle muss April enthalten
      const ariaLabel = selectedCell?.closest('button')?.getAttribute('aria-label') ?? selectedCell?.getAttribute('aria-label') ?? '';
      expect(ariaLabel).toContain('April');

      testComponent.opened.set(false);
      await LuxTestHelper.wait(fixture);
      await LuxTestHelper.wait(fixture);

      await new Promise((resolve) => setTimeout(resolve, 0));
      fixture.detectChanges();
    });

    it('Sollte luxValueChange angemessen oft aufrufen', async () => {
      // Vorbedingungen testen
      const spy = vi.spyOn(testComponent, 'valueChanged').mockReturnValue(undefined);
      await LuxTestHelper.wait(fixture);

      expect(spy).toHaveBeenCalledTimes(0);

      // Änderungen durchführen
      testComponent.value.set(new Date(2015, 9, 19).toISOString());
      await LuxTestHelper.wait(fixture);

      // Nachbedingungen prüfen
      expect(spy).toHaveBeenCalledTimes(1);

      // Änderungen durchführen
      testComponent.value.set(new Date(2015, 9, 20).toISOString());
      await LuxTestHelper.wait(fixture);

      // Nachbedingungen prüfen
      expect(spy).toHaveBeenCalledTimes(2);

      // Änderungen durchführen
      // Absichtlich denselben Wert nochmal, sollte nichts auslösen
      testComponent.value.set(new Date(2015, 9, 20).toISOString());
      await LuxTestHelper.wait(fixture);

      // Nachbedingungen prüfen
      expect(spy).toHaveBeenCalledTimes(2);

      await new Promise((resolve) => setTimeout(resolve, 0));
      fixture.detectChanges();
    });

    it('Sollte verschiedene Eingabewerte erlauben', async () => {
      // Vorbedingungen testen
      await LuxTestHelper.wait(fixture);
      expect(testComponent.value()).toBeFalsy();
      expect(datepickerComponent.value()).toBeFalsy();
      expect(datepickerComponent.formControl.value).toBeFalsy();

      // Änderungen durchführen
      // ISO-String
      const testDate = new Date(2000, 5, 10, 10, 15, 0);
      testDate.setMinutes(testDate.getMinutes() - testDate.getTimezoneOffset());
      testComponent.value.set(testDate.toISOString());
      await LuxTestHelper.wait(fixture);

      // Nachbedingungen prüfen
      let expectedDate = '2000-06-10T10:15:00.000Z';
      expect(testComponent.value()).toEqual(expectedDate);
      expect(datepickerComponent.value()).toEqual(expectedDate);
      expect(datepickerComponent.formControl.value).toEqual(expectedDate);

      // Änderungen durchführen
      // Date
      const tempDate = new Date(0);
      tempDate.setUTCFullYear(2001, 5, 10);
      tempDate.setUTCHours(10, 15, 0);
      testComponent.value.set(tempDate as any);
      await LuxTestHelper.wait(fixture);

      // Nachbedingungen prüfen
      expectedDate = '2001-06-10T10:15:00.000Z';
      expect(testComponent.value()).toEqual(expectedDate);
      expect(datepickerComponent.value()).toEqual(expectedDate);
      expect(datepickerComponent.formControl.value).toEqual(expectedDate);

      // Änderungen durchführen
      // MM/dd/yyyy
      testComponent.value.set('06/10/2002, 00:00');
      await LuxTestHelper.wait(fixture);

      // Nachbedingungen prüfen
      expectedDate = '2002-06-10T00:00:00.000Z';
      expect(testComponent.value()).toEqual(expectedDate);
      expect(datepickerComponent.value()).toEqual(expectedDate);
      expect(datepickerComponent.formControl.value).toEqual(expectedDate);

      // Änderungen durchführen
      // dd.MM.yyyy
      testComponent.value.set('10.06.2003, 00:00');
      await LuxTestHelper.wait(fixture);

      // Nachbedingungen prüfen
      expectedDate = '2003-06-10T00:00:00.000Z';
      expect(testComponent.value()).toEqual(expectedDate);
      expect(datepickerComponent.value()).toEqual(expectedDate);
      expect(datepickerComponent.formControl.value).toEqual(expectedDate);

      // Änderungen durchführen
      // dd-MM-yyyy
      testComponent.value.set('10-06-2004, 00:00');
      await LuxTestHelper.wait(fixture);

      // Nachbedingungen prüfen
      expectedDate = '2004-06-10T00:00:00.000Z';
      expect(testComponent.value()).toEqual(expectedDate);
      expect(datepickerComponent.value()).toEqual(expectedDate);
      expect(datepickerComponent.formControl.value).toEqual(expectedDate);

      // Änderungen durchführen
      // yyyy-MM-dd
      testComponent.value.set('2005-06-10, 00:00');
      await LuxTestHelper.wait(fixture);

      // Nachbedingungen prüfen
      expectedDate = '2005-06-10T00:00:00.000Z';
      expect(testComponent.value()).toEqual(expectedDate);
      expect(datepickerComponent.value()).toEqual(expectedDate);
      expect(datepickerComponent.formControl.value).toEqual(expectedDate);
    });

    it('Sollte den korrekten Wert nach asynchronem Aufruf besitzen', async () => {
      // Vorbedingungen testen
      await LuxTestHelper.wait(fixture);
      expect(testComponent.value()).toBeFalsy();
      expect(datepickerComponent.value()).toBeFalsy();
      expect(datepickerComponent.formControl.value).toBeFalsy();

      // Änderungen durchführen
      of('2005-02-05, 00:00')
        .pipe(delay(2000))
        .subscribe((value) => testComponent.value.set(value));
      await LuxTestHelper.wait(fixture, 2500);
      await new Promise((resolve) => setTimeout(resolve, 0));
      fixture.detectChanges();

      // Nachbedingungen testen
      const expectedDate = '2005-02-05T00:00:00.000Z';
      expect(testComponent.value()).toEqual(expectedDate);
      expect(datepickerComponent.value()).toEqual(expectedDate);
      expect(datepickerComponent.formControl.value).toEqual(expectedDate);
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
          datepickerComponent.formControl.setValue('01/01/' + (1950 + i) + ', 00:00');
        } else {
          testComponent.value.set('01/01/' + (1950 + i) + ', 00:00');
        }
        await LuxTestHelper.wait(fixture);
      }

      // Nachbedingungen prüfen
      const expectedDate = '2200-01-01T00:00:00.000Z';
      expect(datepickerComponent.value()).toEqual(expectedDate);
      expect(datepickerComponent.formControl.value).toEqual(expectedDate);
      expect(spy).toHaveBeenCalledTimes(251);
    });
  });

  describe('A11y', () => {
    let fixture: ComponentFixture<LuxDatetimepickerA11yComponent>;
    let testComponent: LuxDatetimepickerA11yComponent;

    beforeAll(() => {
      LuxA11yTestHelper.addA11yMatchers();
    });

    beforeEach(async () => {
      fixture = TestBed.createComponent(LuxDatetimepickerA11yComponent);
      fixture.detectChanges();
      testComponent = fixture.componentInstance;
    });

    it('sollte keine Barrierefreiheitsverletzungen haben (leer)', async () => {
      fixture.detectChanges();
      await LuxA11yTestHelper.expectNoA11yViolations(fixture.nativeElement);
    });

    it('sollte keine Barrierefreiheitsverletzungen haben (disabled)', async () => {
      testComponent.disabled.set(true);
      fixture.detectChanges();
      await LuxA11yTestHelper.expectNoA11yViolations(fixture.nativeElement);
    });

    it('sollte keine Barrierefreiheitsverletzungen haben (readonly)', async () => {
      testComponent.readonly.set(true);
      fixture.detectChanges();
      await LuxA11yTestHelper.expectNoA11yViolations(fixture.nativeElement);
    });

    it('sollte keine Barrierefreiheitsverletzungen haben (required)', async () => {
      testComponent.required.set(true);
      fixture.detectChanges();
      await LuxA11yTestHelper.expectNoA11yViolations(fixture.nativeElement);
    });
  });
});

@Component({
  template: `
    <lux-datetimepicker
      luxLabel="Datum"
      [(luxValue)]="value"
      [luxDisabled]="disabled()"
      [luxReadonly]="readonly()"
      [luxRequired]="required()"
      [luxMinDate]="minDate()"
      [luxMaxDate]="maxDate()"
      [luxCustomFilter]="customFilter()"
      [luxStartDate]="startDate"
      [luxShowToggle]="showToggle"
      [luxErrorMessage]="errorMessage()"
      [luxErrorCallback]="errorCb()"
      [luxControlValidators]="validators()"
      [luxOpened]="opened()"
      (luxValueChange)="valueChanged()"
    ></lux-datetimepicker>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [LuxDatetimepickerComponent]
})
class LuxNoFormAttributeTestComponent {
  value = signal<string | undefined>(undefined);
  disabled = signal<boolean | undefined>(undefined);
  readonly = signal(false);
  required = signal(false);
  minDate = signal<string | undefined>(undefined);
  maxDate = signal<string | undefined>(undefined);
  startDate?: string;
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
      <lux-datetimepicker luxLabel="Datum" luxControlBinding="datepicker" [luxErrorCallback]="errorCallBack"></lux-datetimepicker>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, LuxDatetimepickerComponent]
})
class LuxFormCustomValidatorComponent {
  form: FormGroup;
  formControl: AbstractControl;

  errorCallBack = exampleErrorCallback;

  constructor() {
    this.form = new FormGroup<any>({
      datepicker: new FormControl('', { validators: Validators.compose([Validator2019NotAllowed, Validators.required]), nonNullable: true })
    });
    this.formControl = this.form.get('datepicker')!;
  }
}

@Component({
  template: `
    <div [formGroup]="form">
      <lux-datetimepicker luxLabel="Datum" luxControlBinding="datepicker"></lux-datetimepicker>
      {{ formControl.value }}
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, LuxDatetimepickerComponent]
})
class LuxFormTestComponent {
  form: FormGroup;
  formControl: AbstractControl;

  constructor() {
    this.form = new FormGroup<any>({
      datepicker: new FormControl<string | null>(null)
    });
    this.formControl = this.form.get('datepicker')!;
  }
}

@Component({
  template: `
    <lux-datetimepicker
      luxLabel="Datum"
      [luxDisabled]="disabled()"
      [luxReadonly]="readonly()"
      [luxRequired]="required()"
    ></lux-datetimepicker>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [LuxDatetimepickerComponent]
})
class LuxDatetimepickerA11yComponent {
  disabled = signal(false);
  readonly = signal(false);
  required = signal(false);
}
