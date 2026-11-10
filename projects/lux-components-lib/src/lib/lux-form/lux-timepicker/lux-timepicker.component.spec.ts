import { describe, it, beforeAll, beforeEach, afterEach, expect, vi } from 'vitest';
import { DOWN_ARROW } from '@angular/cdk/keycodes';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { Component, Type, WritableSignal, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormField, form, required, validate } from '@angular/forms/signals';
import { By } from '@angular/platform-browser';
import { LuxA11yTestHelper, LuxOverlayHelper, LuxTestHelper } from '@ihk-gfi/lux-components/test-utils';
import { provideLuxTranslocoTesting } from '../../../testing/transloco-test.provider';
import { LuxUtil } from '../../lux-util/lux-util';
import { luxDateTimeValue } from '../lux-datepicker/lux-datepicker-validators';
import { LuxDatepickerComponent } from '../lux-datepicker/lux-datepicker.component';
import { luxTimeValue } from './lux-timepicker-validators';
import { LuxTimepickerComponent } from './lux-timepicker.component';

// Werte, die bis Version 21 angenommen wurden und jetzt abgelehnt werden (siehe Update-Guide v22)
const REJECTED_VALUES: unknown[] = [
  '1970-01-01T14:15:00.000Z', // Format von Version 21
  '2026-06-18T14:15', // Datum mit Uhrzeit ohne gemeinsamen Wert
  '14:15:30', // Sekunden ungleich 00
  '24:00',
  '4:15',
  '14.15', // Anzeigeformat
  new Date(Date.UTC(1970, 0, 1, 14, 15)) // Date-Objekt
];

function inputs(fixture: ComponentFixture<unknown>): HTMLInputElement[] {
  return fixture.debugElement.queryAll(By.css('input')).map((debugEl) => debugEl.nativeElement);
}

function component<C>(fixture: ComponentFixture<unknown>, type: Type<C>): C {
  return fixture.debugElement.query(By.directive(type)).componentInstance as C;
}

describe('LuxTimepickerComponent', () => {
  beforeEach(async () => {
    vi.useFakeTimers();
    TestBed.configureTestingModule({
      providers: [provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting(), provideLuxTranslocoTesting()]
    }).compileComponents();
  });

  afterEach(async () => {
    if (vi.isFakeTimers()) {
      await vi.runAllTimersAsync();
    }
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  describe('Uhrzeit allein', () => {
    let fixture: ComponentFixture<LuxTimepickerFormTestComponent>;
    let testComponent: LuxTimepickerFormTestComponent;
    let timepickerComponent: LuxTimepickerComponent;

    beforeEach(async () => {
      fixture = TestBed.createComponent(LuxTimepickerFormTestComponent);
      testComponent = fixture.componentInstance;
      timepickerComponent = component(fixture, LuxTimepickerComponent);
      await LuxTestHelper.wait(fixture);
    });

    it('sollte eine Uhrzeit aus dem Formular anzeigen und beibehalten', async () => {
      testComponent.formControl.setValue('14:15');
      await LuxTestHelper.wait(fixture);

      expect(testComponent.formControl.value).toEqual('14:15');
      expect(timepickerComponent.value()).toEqual('14:15');
      expect(inputs(fixture)[0].value).toEqual('14:15');
    });

    it('sollte die Anzeige leeren, wenn eine eingetippte Uhrzeit von außen zurückgesetzt wird', async () => {
      const inputEl = inputs(fixture)[0];
      LuxTestHelper.typeInElement(inputEl, '14:15');
      inputEl.blur();
      await LuxTestHelper.wait(fixture);
      expect(testComponent.formControl.value).toEqual('14:15');

      const spy = vi.spyOn(timepickerComponent, 'notifyFormValueChanged');
      testComponent.formControl.setValue(null);
      await LuxTestHelper.wait(fixture);

      expect(inputEl.value).toEqual('');
      expect(timepickerComponent.value()).toBeFalsy();
      expect(testComponent.formControl.errors).toBeNull();
      expect(spy).toHaveBeenCalledWith(null);
    });

    it('sollte Sekunden ":00" annehmen und den Wert nicht umschreiben', async () => {
      testComponent.formControl.setValue('14:15:00');
      await LuxTestHelper.wait(fixture);

      expect(testComponent.formControl.value).toEqual('14:15:00');
      expect(testComponent.formControl.dirty).toBe(false);
      expect(testComponent.formControl.errors).toBeNull();
      expect(inputs(fixture)[0].value).toEqual('14:15');
    });

    it('sollte Werte in einem anderen Format ablehnen, unverändert lassen und warnen', async () => {
      const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);

      for (const value of REJECTED_VALUES) {
        const context = value instanceof Date ? `Date-Objekt ${value.toISOString()}` : String(value);
        warn.mockClear();

        testComponent.formControl.setValue(value as string);
        await LuxTestHelper.wait(fixture);

        expect(testComponent.formControl.value, context).toBe(value);
        expect(timepickerComponent.formControl.errors?.['matTimepickerParse'], context).toBeDefined();
        expect(warn, context).toHaveBeenCalledTimes(1);
        expect(String(warn.mock.calls[0][0]), context).toContain("lux-timepicker: Erwartet 'HH:mm'");
      }
    });

    it('sollte einen abgelehnten Wert auch nach einer gültigen Uhrzeit unverändert anzeigen', async () => {
      // Regressionstest: MatTimepickerInput formatiert die Anzeige in einem effect() neu, sobald sich sein Model
      // ändert. Das leerte den roh angezeigten Wert wieder.
      vi.spyOn(console, 'warn').mockImplementation(() => undefined);

      for (const value of ['10:00:15', '1970-01-01T10:00:00.000Z']) {
        testComponent.formControl.setValue('10:00');
        await LuxTestHelper.wait(fixture);
        testComponent.formControl.setValue(value);
        await LuxTestHelper.wait(fixture);

        expect(inputs(fixture)[0].value, value).toEqual(value);
        expect(timepickerComponent.formControl.errors?.['matTimepickerParse'], value).toBeDefined();
      }
    });

    it('sollte einen abgelehnten Wert beim Leeren von außen nicht stehen lassen', async () => {
      vi.spyOn(console, 'warn').mockImplementation(() => undefined);
      testComponent.formControl.setValue('10:00:15');
      await LuxTestHelper.wait(fixture);

      testComponent.formControl.setValue(null);
      await LuxTestHelper.wait(fixture);

      expect(inputs(fixture)[0].value).toEqual('');
      expect(timepickerComponent.formControl.errors).toBeNull();
    });

    describe('Ereignisse des FormControls', () => {
      it('sollte valueChanges bei einer Nutzereingabe genau einmal auslösen', async () => {
        const values: unknown[] = [];
        testComponent.form.valueChanges.subscribe((value) => values.push(value.time));

        LuxTestHelper.typeInElement(inputs(fixture)[0], '14:30');
        await LuxTestHelper.wait(fixture);

        expect(values).toEqual(['14:30']);
      });

      it('sollte statusChanges auch bei einer ungültigen Eingabe ohne Wertänderung auslösen', async () => {
        const statuses: string[] = [];
        testComponent.form.statusChanges.subscribe((status) => statuses.push(status));

        LuxTestHelper.typeInElement(inputs(fixture)[0], '24:00');
        await LuxTestHelper.wait(fixture);
        expect(testComponent.form.status).toEqual('INVALID');
        expect(statuses.at(-1)).toEqual('INVALID');

        LuxTestHelper.typeInElement(inputs(fixture)[0], '');
        await LuxTestHelper.wait(fixture);
        expect(testComponent.form.status).toEqual('VALID');
        expect(statuses.at(-1)).toEqual('VALID');
      });

      it('sollte luxValueChange nach einem stillen setValue() auch beim Zurück auf den alten Wert auslösen', async () => {
        testComponent.formControl.setValue('10:00');
        await LuxTestHelper.wait(fixture);
        const spy = vi.spyOn(timepickerComponent, 'notifyFormValueChanged');

        // Durch den Nutzer
        testComponent.formControl.setValue('11:00', { emitEvent: false });
        await LuxTestHelper.wait(fixture);
        expect(spy).not.toHaveBeenCalled();
        LuxTestHelper.typeInElement(inputs(fixture)[0], '10:00');
        await LuxTestHelper.wait(fixture);
        expect(spy).toHaveBeenCalledTimes(1);

        // Durch die Anwendung
        inputs(fixture)[0].blur();
        LuxTestHelper.dispatchFakeEvent(inputs(fixture)[0], 'focusout');
        testComponent.formControl.setValue('11:00', { emitEvent: false });
        await LuxTestHelper.wait(fixture);
        testComponent.formControl.setValue('10:00');
        await LuxTestHelper.wait(fixture);
        expect(spy).toHaveBeenCalledTimes(2);
      });

      it('sollte für den Startwert und reine Neuprüfungen kein luxValueChange auslösen', async () => {
        // Am Prototyp, damit auch ein Aufruf beim ersten Rendern erfasst wird
        const spy = vi.spyOn(LuxTimepickerComponent.prototype, 'notifyFormValueChanged');
        const localFixture = TestBed.createComponent(LuxTimepickerToggledTestComponent);
        const host = localFixture.componentInstance;
        host.form.get('time')!.setValue('09:00');

        await LuxTestHelper.wait(localFixture);
        expect(spy).not.toHaveBeenCalled();

        host.minTime.set('10:00');
        await LuxTestHelper.wait(localFixture);
        host.form.get('time')!.updateValueAndValidity();
        await LuxTestHelper.wait(localFixture);
        expect(spy).not.toHaveBeenCalled();
      });

      it('sollte luxValueChange bei einem Wert von außen nur einmal auslösen', async () => {
        const spy = vi.spyOn(timepickerComponent, 'notifyFormValueChanged');

        testComponent.formControl.setValue('14:30');
        await LuxTestHelper.wait(fixture);

        expect(spy).toHaveBeenCalledTimes(1);
      });
    });

    describe('Wert von außen, während das Feld den Fokus hat', () => {
      it('sollte einen neuen Wert sofort anzeigen', async () => {
        inputs(fixture)[0].focus();
        await LuxTestHelper.wait(fixture);

        testComponent.formControl.setValue('14:30');
        await LuxTestHelper.wait(fixture);

        expect(inputs(fixture)[0].value).toEqual('14:30');
      });

      it('sollte die laufende Eingabe nicht überschreiben, wenn die Anwendung denselben Wert erneut setzt', async () => {
        testComponent.formControl.valueChanges.subscribe((value) => testComponent.formControl.setValue(value, { emitEvent: false }));

        LuxTestHelper.typeInElement(inputs(fixture)[0], '9.15');
        await LuxTestHelper.wait(fixture);

        expect(testComponent.formControl.value).toEqual('09:15');
        expect(inputs(fixture)[0].value).toEqual('9.15');
      });

      it('sollte einen ungültig getippten Text bei form.reset() leeren', async () => {
        LuxTestHelper.typeInElement(inputs(fixture)[0], '24:00');
        await LuxTestHelper.wait(fixture);

        testComponent.form.reset();
        await LuxTestHelper.wait(fixture);

        expect(inputs(fixture)[0].value).toEqual('');
        expect(timepickerComponent.formControl.errors).toBeNull();
        expect(testComponent.form.valid).toBe(true);
      });
    });

    it('sollte aria-invalid nur setzen, solange der Fehler angezeigt wird', async () => {
      const inputEl = inputs(fixture)[0];
      expect(inputEl.getAttribute('aria-invalid')).toEqual('false');

      // Während der ersten Eingabe ist das Feld noch unberührt
      LuxTestHelper.typeInElement(inputEl, '24:00');
      await LuxTestHelper.wait(fixture);
      expect(inputEl.getAttribute('aria-invalid')).toEqual('false');

      LuxTestHelper.dispatchFakeEvent(inputEl, 'focusout');
      inputEl.blur();
      await LuxTestHelper.wait(fixture);
      expect(inputEl.getAttribute('aria-invalid')).toEqual('true');

      LuxTestHelper.typeInElement(inputEl, '14:00');
      await LuxTestHelper.wait(fixture);
      expect(inputEl.getAttribute('aria-invalid')).toEqual('false');
    });

    it('sollte einen ungültig getippten Text bei form.reset() leeren', async () => {
      // form.reset() schreibt den Wert wie ControlValueAccessor.writeValue() neu, auch wenn er schon null war
      const inputEl = inputs(fixture)[0];
      LuxTestHelper.typeInElement(inputEl, '24:00');
      await LuxTestHelper.wait(fixture);
      LuxTestHelper.dispatchFakeEvent(inputEl, 'focusout');
      inputEl.blur();
      await LuxTestHelper.wait(fixture);
      expect(timepickerComponent.formControl.errors?.['matTimepickerParse']).toBeDefined();

      testComponent.form.reset();
      await LuxTestHelper.wait(fixture);

      expect(inputEl.value).toEqual('');
      expect(timepickerComponent.formControl.errors).toBeNull();
    });

    it('sollte eine manuelle Texteingabe als "HH:mm" übernehmen und dirty markieren', async () => {
      // Regressionstest: MatTimepickerInput legt getippte Werte ausschließlich in seinem eigenen value-Model ab.
      testComponent.formControl.setValue('14:15');
      await LuxTestHelper.wait(fixture);
      expect(testComponent.formControl.dirty).toBe(false);

      LuxTestHelper.typeInElement(inputs(fixture)[0], '09:15');
      await LuxTestHelper.wait(fixture);

      expect(testComponent.formControl.value).toEqual('09:15');
      expect(testComponent.formControl.dirty).toBe(true);
    });

    it('sollte Eingaben wie bisher lesen', async () => {
      for (const [text, expected] of [
        ['9.15', '09:15'],
        ['2:30 PM', '14:30'],
        ['14:30 Uhr', '14:30'],
        ['14:30:00', '14:30']
      ]) {
        LuxTestHelper.typeInElement(inputs(fixture)[0], text);
        await LuxTestHelper.wait(fixture);

        expect(testComponent.formControl.value, text).toEqual(expected);
      }
    });

    it('sollte ungültige Eingaben (24:00, Sekunden) als Fehler melden', async () => {
      for (const text of ['24:00', '14:60', '14:30:15', 'abc']) {
        LuxTestHelper.typeInElement(inputs(fixture)[0], '10:00');
        await LuxTestHelper.wait(fixture);
        LuxTestHelper.typeInElement(inputs(fixture)[0], text);
        await LuxTestHelper.wait(fixture);

        expect(testComponent.formControl.value, text).toBeNull();
        expect(timepickerComponent.formControl.errors, text).toEqual({ matTimepickerParse: { text } });
      }
    });

    it('sollte Uhrzeiten an den Tagen der Zeitumstellung unverändert anzeigen', async () => {
      // In Europe/Berlin gibt es 02:30 am 28.03.2027 nicht und 02:30 am 31.10.2027 doppelt. Eine Uhrzeit ohne
      // Zeitzone ist davon nicht betroffen.
      for (const value of ['02:30', '00:30', '23:30']) {
        testComponent.formControl.setValue(value);
        await LuxTestHelper.wait(fixture);

        expect(inputs(fixture)[0].value, value).toEqual(value);
      }
    });
  });

  it('sollte luxMinTime/luxMaxTime auch ohne Formular (Freistehend) als Fehler melden', async () => {
    const fixture = TestBed.createComponent(LuxTimepickerMinMaxTestComponent);
    const timepickerComponent = component(fixture, LuxTimepickerComponent);
    await LuxTestHelper.wait(fixture);
    const inputEl = inputs(fixture)[0];

    for (const [text, invalid] of [
      ['20:00', true],
      ['19:01', true],
      ['05:00', true],
      ['07:59', true],
      ['08:00', false],
      ['19:00', false],
      ['10:00', false]
    ] as const) {
      LuxTestHelper.typeInElement(inputEl, text);
      await LuxTestHelper.wait(fixture);

      expect(timepickerComponent.isInvalid(), text).toBe(invalid);
      expect(!!timepickerComponent.errorMessage(), text).toBe(invalid);
    }

    expect(timepickerComponent.formControl.errors).toBeNull();
    LuxTestHelper.typeInElement(inputEl, '05:00');
    await LuxTestHelper.wait(fixture);
    expect(timepickerComponent.formControl.errors).toEqual({ matTimepickerMin: { min: '08:00', actual: '05:00' } });
  });

  describe('Optionen', () => {
    let fixture: ComponentFixture<LuxTimepickerOptionsTestComponent>;
    let testComponent: LuxTimepickerOptionsTestComponent;
    let overlayHelper: LuxOverlayHelper;

    beforeEach(async () => {
      fixture = TestBed.createComponent(LuxTimepickerOptionsTestComponent);
      testComponent = fixture.componentInstance;
      overlayHelper = new LuxOverlayHelper();
      await LuxTestHelper.wait(fixture);
    });

    async function openOptions(): Promise<string[]> {
      testComponent.opened.set(true);
      await LuxTestHelper.wait(fixture);
      const labels = Array.from(overlayHelper.selectAllFromOverlay('mat-option')).map((option) =>
        (option as HTMLElement).textContent!.trim()
      );
      testComponent.opened.set(false);
      await LuxTestHelper.wait(fixture);
      return labels;
    }

    it('sollte die Optionen bis zum Ende des Tages erzeugen (keine Endlosschleife über Mitternacht)', async () => {
      const labels = await openOptions();

      expect(labels.length).toEqual(48);
      expect(labels[0]).toEqual('00:00');
      expect(labels[labels.length - 1]).toEqual('23:30');
    });

    it('sollte die Optionen auf luxMinTime/luxMaxTime begrenzen', async () => {
      testComponent.minTime.set('08:00');
      testComponent.maxTime.set('19:00');
      testComponent.interval.set('1h');

      const labels = await openOptions();

      expect(labels).toEqual(['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00']);
    });

    it('sollte luxInterval mit Sekunden ablehnen und das Standardintervall verwenden', async () => {
      const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
      testComponent.interval.set('90s');

      const labels = await openOptions();

      expect(warn).toHaveBeenCalledWith(
        "lux-timepicker: luxInterval muss ganze Minuten ergeben, erhalten '90s'. Es gilt das Standardintervall."
      );
      expect(labels.length).toEqual(48);
    });

    it('sollte luxInterval mit ganzen Minuten trotz Gleitkomma-Rest annehmen', async () => {
      // 1.1 * 3600 ergibt 3960.0000000000005, 4.1 * 3600 ergibt 14759.999999999998
      const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);

      for (const [interval, secondOption] of [
        ['1.1h', '01:06'],
        ['4.1h', '04:06']
      ]) {
        testComponent.interval.set(interval);

        const labels = await openOptions();

        expect(labels[1], interval).toEqual(secondOption);
      }
      expect(warn).not.toHaveBeenCalled();
    });

    it('sollte einen abgelehnten Wert auch nach einer Änderung von luxMinTime unverändert anzeigen', async () => {
      vi.spyOn(console, 'warn').mockImplementation(() => undefined);
      testComponent.value.set('10:00:15');
      await LuxTestHelper.wait(fixture);

      testComponent.minTime.set('08:00');
      await LuxTestHelper.wait(fixture);

      expect(inputs(fixture)[0].value).toEqual('10:00:15');
    });

    it('sollte einen ungültig getippten Text bei geänderten Regeln mit seinem Fehler behalten', async () => {
      // Geänderte Regeln prüfen nur neu, eine Eingabe des Nutzers geht nicht verloren
      const timepickerComponent = component(fixture, LuxTimepickerComponent);
      const inputEl = inputs(fixture)[0];
      LuxTestHelper.typeInElement(inputEl, '24:00');
      await LuxTestHelper.wait(fixture);
      LuxTestHelper.dispatchFakeEvent(inputEl, 'focusout');
      inputEl.blur();
      await LuxTestHelper.wait(fixture);

      const changes: [string, () => void][] = [
        ['luxMinTime', () => testComponent.minTime.set('08:00')],
        ['luxMaxTime', () => testComponent.maxTime.set('18:00')]
      ];
      for (const [name, change] of changes) {
        change();
        await LuxTestHelper.wait(fixture);

        expect(inputEl.value, name).toEqual('24:00');
        expect(timepickerComponent.formControl.errors?.['matTimepickerParse'], name).toBeDefined();
      }
    });

    it('sollte eine Auswahl in der Liste als "HH:mm" übernehmen', async () => {
      testComponent.opened.set(true);
      await LuxTestHelper.wait(fixture);

      const option = Array.from(overlayHelper.selectAllFromOverlay('mat-option')).find(
        (element) => (element as HTMLElement).textContent?.trim() === '09:30'
      ) as HTMLElement;
      option.click();
      await LuxTestHelper.wait(fixture);

      expect(testComponent.value()).toEqual('09:30');
    });
  });

  describe('Zerstören der Komponente', () => {
    // In Reactive Forms überlebt das FormControl die Komponente, z.B. in einem @if, Tab oder Stepper
    let fixture: ComponentFixture<LuxTimepickerToggledTestComponent>;
    let testComponent: LuxTimepickerToggledTestComponent;

    beforeEach(async () => {
      fixture = TestBed.createComponent(LuxTimepickerToggledTestComponent);
      testComponent = fixture.componentInstance;
      await LuxTestHelper.wait(fixture);
    });

    async function setVisible(visible: boolean) {
      testComponent.visible.set(visible);
      await LuxTestHelper.wait(fixture);
    }

    it('sollte einen ungültig getippten Text das FormControl nicht weiter blockieren lassen', async () => {
      LuxTestHelper.typeInElement(inputs(fixture)[0], '24:00');
      await LuxTestHelper.wait(fixture);
      expect(testComponent.form.valid).toBe(false);

      await setVisible(false);

      expect(testComponent.form.valid).toBe(true);

      await setVisible(true);
      LuxTestHelper.typeInElement(inputs(fixture)[0], '09:30');
      await LuxTestHelper.wait(fixture);

      expect(testComponent.form.get('time')!.value).toEqual('09:30');
      expect(testComponent.form.valid).toBe(true);
    });

    it('sollte alte Grenzen nicht weiter prüfen', async () => {
      testComponent.minTime.set('10:00');
      testComponent.form.get('time')!.setValue('09:00');
      await LuxTestHelper.wait(fixture);
      expect(testComponent.form.valid).toBe(false);

      await setVisible(false);
      testComponent.minTime.set('08:00');
      await setVisible(true);

      expect(testComponent.form.valid).toBe(true);
    });

    it('sollte Validatoren der Anwendung behalten', async () => {
      const control = testComponent.form.get('time')!;
      control.addValidators(Validators.required);
      control.updateValueAndValidity();

      await setVisible(false);

      expect(control.hasValidator(Validators.required)).toBe(true);
      expect(control.errors).toEqual({ required: true });
    });
  });

  describe('Signal Forms', () => {
    let fixture: ComponentFixture<LuxTimepickerSignalFormTestComponent>;
    let testComponent: LuxTimepickerSignalFormTestComponent;

    beforeEach(async () => {
      fixture = TestBed.createComponent(LuxTimepickerSignalFormTestComponent);
      testComponent = fixture.componentInstance;
      await LuxTestHelper.wait(fixture);
    });

    it('sollte einen Wert im falschen Format und min/max über luxTimeValue ungültig machen', async () => {
      vi.spyOn(console, 'warn').mockImplementation(() => undefined);

      testComponent.model.set({ beginn: '1970-01-01T14:15:00.000Z' });
      await LuxTestHelper.wait(fixture);
      expect(testComponent.testForm.beginn().errors()[0].kind).toEqual('matTimepickerParse');

      testComponent.model.set({ beginn: '07:30' });
      await LuxTestHelper.wait(fixture);
      expect(testComponent.testForm.beginn().errors()[0].kind).toEqual('matTimepickerMin');

      testComponent.model.set({ beginn: '08:30' });
      await LuxTestHelper.wait(fixture);
      expect(testComponent.testForm.beginn().valid()).toBe(true);
    });

    it('sollte eine ungültige Texteingabe als Fehler an das Feld melden', async () => {
      LuxTestHelper.typeInElement(inputs(fixture)[0], '24:00');
      await LuxTestHelper.wait(fixture);

      expect(
        testComponent.testForm
          .beginn()
          .errors()
          .map((error) => error.kind)
      ).toContain('matTimepickerParse');

      LuxTestHelper.typeInElement(inputs(fixture)[0], '09:00');
      await LuxTestHelper.wait(fixture);

      expect(testComponent.model().beginn).toEqual('09:00');
      expect(testComponent.testForm.beginn().valid()).toBe(true);
    });

    it('sollte bei form().reset(wert) den neuen Wert auch mit Fokus anzeigen', async () => {
      testComponent.model.set({ beginn: '10:00' });
      await LuxTestHelper.wait(fixture);
      inputs(fixture)[0].focus();
      await LuxTestHelper.wait(fixture);

      testComponent.testForm().reset({ beginn: '15:45' });
      await LuxTestHelper.wait(fixture);

      expect(inputs(fixture)[0].value).toEqual('15:45');
    });

    it('sollte bei einer ungültigen Eingabe den eigenen Text einem required-Text aus dem Schema vorziehen', async () => {
      const localFixture = TestBed.createComponent(LuxTimepickerRequiredSignalFormTestComponent);
      await LuxTestHelper.wait(localFixture);

      LuxTestHelper.typeInElement(inputs(localFixture)[0], '24:00');
      await LuxTestHelper.wait(localFixture);

      expect(component(localFixture, LuxTimepickerComponent).errorMessage()).toEqual('Die Zeit ist ungültig');
    });

    for (const focused of [false, true]) {
      it(`sollte einen ungültig getippten Text bei form().reset() leeren (${focused ? 'mit' : 'ohne'} Fokus)`, async () => {
        const timepickerComponent = component(fixture, LuxTimepickerComponent);
        const inputEl = inputs(fixture)[0];
        LuxTestHelper.typeInElement(inputEl, '24:00');
        await LuxTestHelper.wait(fixture);
        if (!focused) {
          LuxTestHelper.dispatchFakeEvent(inputEl, 'focusout');
          inputEl.blur();
          await LuxTestHelper.wait(fixture);
        }

        testComponent.testForm().reset();
        await LuxTestHelper.wait(fixture);

        expect(inputEl.value).toEqual('');
        expect(timepickerComponent.formControl.errors).toBeNull();
        expect(timepickerComponent.isInvalid()).toBe(false);
        expect(timepickerComponent.errorMessage()).toBeUndefined();
        expect(testComponent.testForm.beginn().valid()).toBe(true);
      });
    }
  });

  describe('Datum und Uhrzeit mit gemeinsamem Wert', () => {
    const hosts: { name: string; type: Type<LuxDateTimeHost> }[] = [
      { name: 'Reactive Form (luxControlBinding)', type: LuxDateTimeReactiveTestComponent },
      { name: 'ohne Formular ([(luxValue)])', type: LuxDateTimeNoFormTestComponent },
      { name: 'Signal Form ([formField])', type: LuxDateTimeSignalFormTestComponent }
    ];

    for (const { name, type } of hosts) {
      describe(name, () => {
        let fixture: ComponentFixture<LuxDateTimeHost>;
        let host: LuxDateTimeHost;
        let datepickerComponent: LuxDatepickerComponent;
        let timepickerComponent: LuxTimepickerComponent;

        beforeEach(async () => {
          fixture = TestBed.createComponent(type);
          host = fixture.componentInstance;
          datepickerComponent = component(fixture, LuxDatepickerComponent);
          timepickerComponent = component(fixture, LuxTimepickerComponent);
          await LuxTestHelper.wait(fixture);
        });

        async function setValue(value: string | null) {
          host.setTermin(value);
          await LuxTestHelper.wait(fixture);
        }

        async function typeIn(index: number, text: string) {
          LuxTestHelper.typeInElement(inputs(fixture)[index], text);
          await LuxTestHelper.wait(fixture);
        }

        async function leave(index: number) {
          LuxTestHelper.dispatchFakeEvent(inputs(fixture)[index], 'focusout');
          inputs(fixture)[index].blur();
          await LuxTestHelper.wait(fixture);
        }

        it('sollte Datum und Uhrzeit anzeigen und den Wert nicht umschreiben', async () => {
          await setValue('2026-06-18T14:15:00');

          expect(LuxUtil.stringWithoutASCIIChars(inputs(fixture)[0].value)).toEqual('18.06.2026');
          expect(inputs(fixture)[1].value).toEqual('14:15');
          expect(host.termin()).toEqual('2026-06-18T14:15:00');
        });

        it('sollte ohne Datum den Timepicker nur in der Oberfläche deaktivieren', async () => {
          expect(host.termin()).toBeNull();
          expect(inputs(fixture)[1].disabled).toBe(true);
          expect(inputs(fixture)[1].placeholder).toEqual('Bitte zuerst ein Datum wählen');
          expect(inputs(fixture)[0].disabled).toBe(false);
          expect(datepickerComponent.isDisabled()).toBe(false);
          expect(timepickerComponent.isDisabled()).toBe(false);
        });

        it('sollte beim ersten Datum die Standarduhrzeit setzen', async () => {
          await typeIn(0, '18.06.2026');

          expect(host.termin()).toEqual('2026-06-18T00:00');
          expect(inputs(fixture)[1].disabled).toBe(false);
          expect(inputs(fixture)[1].value).toEqual('00:00');
        });

        it('sollte beim ersten Datum luxDefaultTime verwenden', async () => {
          host.defaultTime.set('08:00');
          await LuxTestHelper.wait(fixture);

          await typeIn(0, '18.06.2026');

          expect(host.termin()).toEqual('2026-06-18T08:00');
        });

        it('sollte beim Ändern des Datums die Uhrzeit erhalten', async () => {
          await setValue('2026-06-18T14:15');
          await typeIn(0, '19.06.2026');

          expect(host.termin()).toEqual('2026-06-19T14:15');
        });

        it('sollte bei einer ungültigen Datumseingabe den Wert unverändert lassen', async () => {
          await setValue('2026-06-18T14:15');
          await typeIn(0, '31.06.2026');

          expect(host.termin()).toEqual('2026-06-18T14:15');
          expect(datepickerComponent.formControl.errors?.['matDatepickerParse']).toBeDefined();
          expect(inputs(fixture)[1].disabled).toBe(false);
        });

        it('sollte beim Ändern der Uhrzeit das Datum erhalten', async () => {
          await setValue('2026-06-18T14:15');
          await typeIn(1, '09:30');

          expect(host.termin()).toEqual('2026-06-18T09:30');
          expect(LuxUtil.stringWithoutASCIIChars(inputs(fixture)[0].value)).toEqual('18.06.2026');
        });

        it('sollte beim Leeren des Datums den Wert auf null setzen', async () => {
          await setValue('2026-06-18T14:15');
          await typeIn(0, '');
          await leave(0);

          expect(host.termin()).toBeNull();
          expect(inputs(fixture)[0].value).toEqual('');
          expect(inputs(fixture)[1].value).toEqual('');
          expect(inputs(fixture)[1].disabled).toBe(true);
        });

        it('sollte eine geleerte Uhrzeit erst beim Verlassen durch die Standarduhrzeit ersetzen', async () => {
          await setValue('2026-06-18T14:15');
          await typeIn(1, '');

          // Während der Eingabe bleibt der Wert unverändert
          expect(host.termin()).toEqual('2026-06-18T14:15');

          await leave(1);

          expect(host.termin()).toEqual('2026-06-18T00:00');
          expect(inputs(fixture)[1].value).toEqual('00:00');
        });

        it('sollte nach einer ungültigen Uhrzeit die Korrektur auf die bisherige Uhrzeit annehmen', async () => {
          // Regressionstest: Das Model von MatTimepickerInput wurde nach der ungültigen Eingabe auf die bisherige
          // Uhrzeit zurückgesetzt. Die Korrektur war für Material deshalb keine Änderung, der Fehler blieb stehen.
          await setValue('2026-06-18T14:15');
          await typeIn(1, '24:15');
          expect(timepickerComponent.formControl.errors?.['matTimepickerParse']).toBeDefined();

          await typeIn(1, '14:15');
          await leave(1);

          expect(host.termin()).toEqual('2026-06-18T14:15');
          expect(timepickerComponent.formControl.errors).toBeNull();
          expect(timepickerComponent.errorMessage()).toBeFalsy();
        });

        it('sollte nach dem Leeren die Auswahl der bisherigen Uhrzeit in der Liste übernehmen', async () => {
          // Regressionstest: Nach dem Leeren stand das Model von MatTimepickerInput wieder auf der bisherigen
          // Uhrzeit. Deren Auswahl war für Material deshalb keine Änderung, beim Verlassen galt luxDefaultTime.
          await setValue('2026-06-18T14:30');
          await typeIn(1, '');
          LuxTestHelper.dispatchKeyboardEvent(inputs(fixture)[1], 'keydown', DOWN_ARROW);
          await LuxTestHelper.wait(fixture);

          const option = Array.from(new LuxOverlayHelper().selectAllFromOverlay('mat-option')).find(
            (element) => (element as HTMLElement).textContent?.trim() === '14:30'
          ) as HTMLElement;
          option.click();
          await LuxTestHelper.wait(fixture);
          await leave(1);

          expect(host.termin()).toEqual('2026-06-18T14:30');
          expect(inputs(fixture)[1].value).toEqual('14:30');
        });

        it('sollte Tage der Zeitumstellung unverändert behandeln', async () => {
          // 02:30 gibt es am 28.03.2027 in Europe/Berlin nicht, am 31.10.2027 doppelt
          for (const value of ['2027-03-28T02:30', '2027-10-31T02:30']) {
            await setValue(value);

            expect(LuxUtil.stringWithoutASCIIChars(inputs(fixture)[0].value), value).toEqual(
              value === '2027-03-28T02:30' ? '28.03.2027' : '31.10.2027'
            );
            expect(inputs(fixture)[1].value, value).toEqual('02:30');
            expect(host.termin(), value).toEqual(value);
          }
        });

        it('sollte Werte in einem anderen Format ablehnen und warnen', async () => {
          const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);

          for (const value of ['2026-06-18T14:15:00.000Z', '2026-06-18', '14:15', '2026-06-18T14:15:30']) {
            warn.mockClear();
            await setValue(value);

            expect(host.termin(), value).toEqual(value);
            expect(datepickerComponent.formControl.errors?.['matDatepickerParse'], value).toBeDefined();
            expect(timepickerComponent.formControl.errors?.['matTimepickerParse'], value).toBeDefined();
            expect(inputs(fixture)[1].disabled, value).toBe(true);
            expect(warn.mock.calls.map((call) => String(call[0])).join(), value).toContain("Erwartet 'yyyy-MM-ddTHH:mm'");
          }
        });
      });
    }

    it('sollte bei form.reset() beide Felder leeren', async () => {
      const fixture = TestBed.createComponent(LuxDateTimeReactiveTestComponent);
      const host = fixture.componentInstance;
      await LuxTestHelper.wait(fixture);
      host.setTermin('2026-06-18T14:15');
      await LuxTestHelper.wait(fixture);

      host.form.reset();
      await LuxTestHelper.wait(fixture);

      expect(host.termin()).toBeNull();
      expect(inputs(fixture)[0].value).toEqual('');
      expect(inputs(fixture)[1].value).toEqual('');
      expect(inputs(fixture)[1].disabled).toBe(true);
    });

    it('sollte beide Felder leeren, wenn der Wert von außen zurückgesetzt wird', async () => {
      const fixture = TestBed.createComponent(LuxDateTimeReactiveTestComponent);
      const host = fixture.componentInstance;
      await LuxTestHelper.wait(fixture);
      host.setTermin('2026-06-18T14:15');
      await LuxTestHelper.wait(fixture);
      expect(inputs(fixture)[1].value).toEqual('14:15');

      host.setTermin(null);
      await LuxTestHelper.wait(fixture);

      expect(inputs(fixture)[0].value).toEqual('');
      expect(inputs(fixture)[1].value).toEqual('');
      expect(host.form.get('termin')!.errors).toBeNull();

      // Ein Verlassen des Feldes darf die alte Uhrzeit nicht wiederherstellen.
      inputs(fixture)[1].dispatchEvent(new Event('blur'));
      await LuxTestHelper.wait(fixture);
      expect(inputs(fixture)[1].value).toEqual('');
    });

    it('sollte warnen, wenn luxDefaultTime außerhalb von luxMinTime/luxMaxTime liegt', async () => {
      const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
      const fixture = TestBed.createComponent(LuxDateTimeReactiveTestComponent);
      fixture.componentInstance.minTime.set('08:00');
      await LuxTestHelper.wait(fixture);

      expect(warn).toHaveBeenCalledWith(
        "lux-timepicker: luxDefaultTime '00:00' liegt außerhalb von luxMinTime/luxMaxTime. Ein Wert mit dieser Uhrzeit ist ungültig."
      );
    });

    it('sollte den gemeinsamen Wert im Signal Form über luxDateTimeValue prüfen', async () => {
      const fixture = TestBed.createComponent(LuxDateTimeSignalFormTestComponent);
      const host = fixture.componentInstance;
      await LuxTestHelper.wait(fixture);

      host.setTermin('2026-06-18T07:00');
      await LuxTestHelper.wait(fixture);
      expect(host.testForm.termin().errors()[0].kind).toEqual('matTimepickerMin');

      host.setTermin('2026-06-18T09:00');
      await LuxTestHelper.wait(fixture);
      expect(host.testForm.termin().valid()).toBe(true);
    });

    it('sollte bei form().reset() eine ungültige Uhrzeit verwerfen und die bisherige anzeigen', async () => {
      const fixture = TestBed.createComponent(LuxDateTimeSignalFormTestComponent);
      const host = fixture.componentInstance;
      const timepickerComponent = component(fixture, LuxTimepickerComponent);
      await LuxTestHelper.wait(fixture);
      host.setTermin('2026-06-18T14:15');
      await LuxTestHelper.wait(fixture);
      LuxTestHelper.typeInElement(inputs(fixture)[1], '24:15');
      await LuxTestHelper.wait(fixture);

      // Das Feld hat beim Zurücksetzen noch den Fokus
      host.testForm().reset();
      await LuxTestHelper.wait(fixture);

      expect(inputs(fixture)[1].value).toEqual('14:15');
      expect(timepickerComponent.formControl.errors).toBeNull();
      expect(timepickerComponent.isInvalid()).toBe(false);
      expect(host.termin()).toEqual('2026-06-18T14:15');
    });

    describe('Fehler nur am betroffenen Feld', () => {
      function setup<H extends LuxDateTimeHost>(type: Type<H>) {
        const fixture = TestBed.createComponent(type);
        return {
          fixture,
          host: fixture.componentInstance,
          datepickerComponent: component(fixture, LuxDatepickerComponent),
          timepickerComponent: component(fixture, LuxTimepickerComponent)
        };
      }

      function expectErrorOnlyAt(
        wrong: LuxDatepickerComponent | LuxTimepickerComponent,
        right: LuxDatepickerComponent | LuxTimepickerComponent
      ) {
        expect(wrong.showError(), 'betroffenes Feld zeigt den Fehler').toBe(true);
        expect(right.isTouched(), 'anderes Feld berührt').toBe(true);
        expect(right.showError(), 'anderes Feld ohne Fehler').toBe(false);
        expect(right.errorMessage(), 'anderes Feld ohne Text').toBeUndefined();
      }

      it('sollte einen Zeitfehler im Reactive Form nur am Timepicker zeigen', async () => {
        vi.spyOn(console, 'warn').mockImplementation(() => undefined);
        const { fixture, host, datepickerComponent, timepickerComponent } = setup(LuxDateTimeReactiveTestComponent);
        host.minTime.set('08:00');
        await LuxTestHelper.wait(fixture);

        host.setTermin('2026-06-18T07:00');
        host.form.markAllAsTouched();
        await LuxTestHelper.wait(fixture);

        expectErrorOnlyAt(timepickerComponent, datepickerComponent);
        expect(host.form.invalid).toBe(true);
      });

      it('sollte einen Zeitfehler im Signal Form nur am Timepicker zeigen', async () => {
        const { fixture, host, datepickerComponent, timepickerComponent } = setup(LuxDateTimeSignalFormTestComponent);
        await LuxTestHelper.wait(fixture);

        host.setTermin('2026-06-18T07:00');
        host.testForm.termin().markAsTouched();
        await LuxTestHelper.wait(fixture);

        expectErrorOnlyAt(timepickerComponent, datepickerComponent);
        expect(host.testForm.termin().invalid()).toBe(true);
      });

      for (const { name, type } of [
        { name: 'Reactive Form', type: LuxDateTimeReactiveTestComponent },
        { name: 'Signal Form', type: LuxDateTimeSignalFormTestComponent }
      ] as { name: string; type: Type<LuxDateTimeHost> }[]) {
        it(`sollte eine ungültige Datumseingabe im ${name} nur am Datepicker zeigen`, async () => {
          const { fixture, host, datepickerComponent, timepickerComponent } = setup(type);
          await LuxTestHelper.wait(fixture);
          host.setTermin('2026-06-18T14:15');
          await LuxTestHelper.wait(fixture);

          LuxTestHelper.typeInElement(inputs(fixture)[0], '31.06.2026');
          await LuxTestHelper.wait(fixture);
          LuxTestHelper.dispatchFakeEvent(inputs(fixture)[0], 'focusout');
          inputs(fixture)[0].blur();
          timepickerComponent.markAsTouched();
          await LuxTestHelper.wait(fixture);

          expectErrorOnlyAt(datepickerComponent, timepickerComponent);
        });
      }

      it('sollte aria-invalid nur am betroffenen Feld setzen', async () => {
        const { fixture, host } = setup(LuxDateTimeSignalFormTestComponent);
        await LuxTestHelper.wait(fixture);

        host.setTermin('2026-06-18T07:00');
        host.testForm.termin().markAsTouched();
        await LuxTestHelper.wait(fixture);

        expect(inputs(fixture)[0].getAttribute('aria-invalid')).toEqual('false');
        expect(inputs(fixture)[1].getAttribute('aria-invalid')).toEqual('true');
      });

      it('sollte Fehler ohne Zuordnung an beiden Feldern zeigen', async () => {
        const { fixture, host, datepickerComponent, timepickerComponent } = setup(LuxDateTimeReactiveTestComponent);
        await LuxTestHelper.wait(fixture);
        host.setTermin('2026-06-18T14:15');
        host.form.get('termin')!.addValidators(() => ({ eigenerFehler: true }));
        host.form.get('termin')!.updateValueAndValidity();
        await LuxTestHelper.wait(fixture);

        expect(Object.keys(datepickerComponent.legacyErrors()!)).toEqual(['eigenerFehler']);
        expect(Object.keys(timepickerComponent.legacyErrors()!)).toEqual(['eigenerFehler']);
      });

      it('sollte beide Felder zeigen, wenn beide einen eigenen Fehler haben', async () => {
        vi.spyOn(console, 'warn').mockImplementation(() => undefined);
        const { fixture, host, datepickerComponent, timepickerComponent } = setup(LuxDateTimeReactiveTestComponent);
        await LuxTestHelper.wait(fixture);

        host.setTermin('2026-06-18T14:15:30');
        host.form.markAllAsTouched();
        await LuxTestHelper.wait(fixture);

        expect(datepickerComponent.errorMessage()).toEqual('Das Datum ist ungültig');
        expect(timepickerComponent.errorMessage()).toEqual('Die Zeit ist ungültig');
      });
    });
  });

  describe('Geteiltes FormControl (mehrere Instanzen)', () => {
    // Regressionstest: Zwei lux-timepicker-Instanzen an demselben luxControlBinding-Control lösten einen
    // synchronen Stack-Overflow aus. Der reine Ablauf dieses Tests ist die eigentliche Absicherung.
    it('sollte mit einem vorbelegten Wert rendern, ohne in eine Endlosschleife zu laufen', async () => {
      const fixture = TestBed.createComponent(LuxTimepickerSharedControlComponent);
      const testComponent = fixture.componentInstance;
      await LuxTestHelper.wait(fixture);

      const timepickerComponents = fixture.debugElement
        .queryAll(By.directive(LuxTimepickerComponent))
        .map((debugEl) => debugEl.componentInstance as LuxTimepickerComponent);
      expect(timepickerComponents.length).toEqual(2);
      expect(testComponent.form.get('time')!.value).toEqual('14:15');
      expect(timepickerComponents[0].value()).toEqual('14:15');
      expect(timepickerComponents[1].value()).toEqual('14:15');
    });

    it('sollte eine Texteingabe in der ersten Instanz im gemeinsamen FormControl übernehmen, ohne in eine Endlosschleife zu laufen', async () => {
      const fixture = TestBed.createComponent(LuxTimepickerSharedControlComponent);
      const testComponent = fixture.componentInstance;
      await LuxTestHelper.wait(fixture);

      LuxTestHelper.typeInElement(inputs(fixture)[0], '09:15');
      await LuxTestHelper.wait(fixture);

      expect(testComponent.form.get('time')!.value).toEqual('09:15');
    });
  });

  describe('Ausgaben enthalten nur Strings', () => {
    // Alles, was Timepicker und Datepicker in Formular, Model oder Outputs schreiben, ist "HH:mm" bzw. beim
    // gemeinsamen Wert "yyyy-MM-ddTHH:mm" oder null - nie ein Date-Objekt oder ein Objekt des DateAdapters
    // (siehe Update-Guide v22).
    const variants: { name: string; time: Type<LuxTimepickerOutputHost>; dateTime: Type<LuxTimepickerOutputHost> }[] = [
      {
        name: 'Reactive Form (luxControlBinding)',
        time: LuxTimepickerOutputReactiveComponent,
        dateTime: LuxDateTimeOutputReactiveComponent
      },
      { name: 'Signal Form ([formField])', time: LuxTimepickerOutputSignalFormComponent, dateTime: LuxDateTimeOutputSignalFormComponent },
      { name: 'ohne Formular ([(value)])', time: LuxTimepickerOutputValueComponent, dateTime: LuxDateTimeOutputValueComponent },
      { name: 'ohne Formular ([(luxValue)])', time: LuxTimepickerOutputLuxValueComponent, dateTime: LuxDateTimeOutputLuxValueComponent }
    ];

    for (const { name, time, dateTime } of variants) {
      describe(name, () => {
        let fixture: ComponentFixture<LuxTimepickerOutputHost>;
        let host: LuxTimepickerOutputHost;

        async function create(type: Type<LuxTimepickerOutputHost>) {
          fixture = TestBed.createComponent(type);
          host = fixture.componentInstance;
          await LuxTestHelper.wait(fixture);
        }

        async function typeIn(index: number, text: string) {
          LuxTestHelper.typeInElement(inputs(fixture)[index], text);
          await LuxTestHelper.wait(fixture);
        }

        async function leave(index: number) {
          LuxTestHelper.dispatchFakeEvent(inputs(fixture)[index], 'focusout');
          inputs(fixture)[index].blur();
          await LuxTestHelper.wait(fixture);
        }

        async function selectInList(label: string) {
          host.opened.set(true);
          await LuxTestHelper.wait(fixture);
          const options = Array.from(new LuxOverlayHelper().selectAllFromOverlay('mat-option')) as HTMLElement[];
          options.find((option) => option.textContent?.trim() === label)!.click();
          host.opened.set(false);
          await LuxTestHelper.wait(fixture);
        }

        async function selectInCalendar(day: string) {
          host.dateOpened.set(true);
          await LuxTestHelper.wait(fixture);
          const cells = Array.from(new LuxOverlayHelper().selectAllFromOverlay('.mat-calendar-body-cell')) as HTMLElement[];
          cells.find((cell) => cell.textContent?.trim() === day)!.click();
          host.dateOpened.set(false);
          await LuxTestHelper.wait(fixture);
        }

        it('sollte allein nur "HH:mm" oder null ausgeben', async () => {
          await create(time);
          const steps: [string, () => Promise<void>, string | null][] = [
            ['Eingabe', () => typeIn(0, '14:30'), '14:30'],
            ['Auswahl in der Liste', () => selectInList('09:30'), '09:30'],
            ['ungültige Eingabe', () => typeIn(0, '24:00'), null],
            ['Eingabe nach ungültiger Eingabe', () => typeIn(0, '08:15'), '08:15'],
            ['Leeren', () => typeIn(0, ''), null]
          ];

          for (const [step, action, expected] of steps) {
            await action();
            expect(host.current(), step).toBe(expected);
          }

          expectOnlyOutputFormat(host, /^\d{2}:\d{2}$/);
        });

        it('sollte mit gemeinsamem Wert nur "yyyy-MM-ddTHH:mm" oder null ausgeben', async () => {
          await create(dateTime);
          const steps: [string, () => Promise<void>, string | null][] = [
            ['erstes Datum mit Standarduhrzeit', () => typeIn(0, '18.06.2026'), '2026-06-18T00:00'],
            ['Eingabe der Uhrzeit', () => typeIn(1, '09:30'), '2026-06-18T09:30'],
            ['Auswahl in der Liste', () => selectInList('10:00'), '2026-06-18T10:00'],
            ['Auswahl im Kalender', () => selectInCalendar('19'), '2026-06-19T10:00'],
            ['ungültiges Datum', () => typeIn(0, '31.06.2026'), '2026-06-19T10:00'],
            ['Datum nach ungültigem Datum', () => typeIn(0, '20.06.2026'), '2026-06-20T10:00'],
            ['ungültige Uhrzeit', () => typeIn(1, '24:00'), '2026-06-20T10:00'],
            ['Uhrzeit leeren und verlassen', () => typeIn(1, '').then(() => leave(1)), '2026-06-20T00:00'],
            ['Datum leeren', () => typeIn(0, '').then(() => leave(0)), null]
          ];

          for (const [step, action, expected] of steps) {
            await action();
            expect(host.current(), step).toBe(expected);
          }

          expectOnlyOutputFormat(host, /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/);
        });
      });
    }
  });

  describe('A11y', () => {
    let fixture: ComponentFixture<LuxTimepickerA11yComponent>;
    let testComponent: LuxTimepickerA11yComponent;

    beforeAll(() => {
      LuxA11yTestHelper.addA11yMatchers();
    });

    beforeEach(async () => {
      fixture = TestBed.createComponent(LuxTimepickerA11yComponent);
      await LuxTestHelper.wait(fixture);
      testComponent = fixture.componentInstance;
    });

    it('sollte keine Barrierefreiheitsverletzungen haben (leer)', async () => {
      await LuxTestHelper.wait(fixture);
      await LuxA11yTestHelper.expectNoA11yViolations(fixture.nativeElement);
    });

    it('sollte keine Barrierefreiheitsverletzungen haben (disabled)', async () => {
      testComponent.disabled = true;
      await LuxTestHelper.wait(fixture);
      await LuxA11yTestHelper.expectNoA11yViolations(fixture.nativeElement);
    });

    it('sollte keine Barrierefreiheitsverletzungen haben (readonly)', async () => {
      testComponent.readonly = true;
      await LuxTestHelper.wait(fixture);
      await LuxA11yTestHelper.expectNoA11yViolations(fixture.nativeElement);
    });

    it('sollte keine Barrierefreiheitsverletzungen haben (required)', async () => {
      testComponent.required = true;
      await LuxTestHelper.wait(fixture);
      await LuxA11yTestHelper.expectNoA11yViolations(fixture.nativeElement);
    });
  });
});

@Component({
  template: `
    <div [formGroup]="form">
      <lux-timepicker luxLabel="Zeit" luxControlBinding="time"></lux-timepicker>
    </div>
  `,
  imports: [ReactiveFormsModule, LuxTimepickerComponent]
})
class LuxTimepickerFormTestComponent {
  form = new FormGroup({
    time: new FormControl<string | null>(null)
  });

  get formControl() {
    return this.form.get('time') as FormControl<string | null>;
  }
}

@Component({
  template: `
    <div [formGroup]="form">
      @if (visible()) {
        <lux-timepicker luxLabel="Zeit" luxControlBinding="time" [luxMinTime]="minTime()" />
      }
    </div>
  `,
  imports: [ReactiveFormsModule, LuxTimepickerComponent]
})
class LuxTimepickerToggledTestComponent {
  readonly visible = signal(true);
  readonly minTime = signal<string | null>(null);
  readonly form = new FormGroup({
    time: new FormControl<string | null>(null)
  });
}

@Component({
  template: `<lux-timepicker luxLabel="Zeit" [(value)]="value" luxMinTime="08:00" luxMaxTime="19:00"></lux-timepicker>`,
  imports: [LuxTimepickerComponent]
})
class LuxTimepickerMinMaxTestComponent {
  value: string | null = null;
}

@Component({
  template: `
    <lux-timepicker
      luxLabel="Zeit"
      [(value)]="value"
      [luxInterval]="interval()"
      [luxMinTime]="minTime()"
      [luxMaxTime]="maxTime()"
      [luxOpened]="opened()"
    />
  `,
  imports: [LuxTimepickerComponent]
})
class LuxTimepickerOptionsTestComponent {
  readonly value = signal<string | null>(null);
  readonly interval = signal<string | number | null>('30m');
  readonly minTime = signal<string | null>(null);
  readonly maxTime = signal<string | null>(null);
  readonly opened = signal(false);
}

@Component({
  template: `<lux-timepicker luxLabel="Beginn" luxMinTime="08:00" [formField]="testForm.beginn" />`,
  imports: [LuxTimepickerComponent, FormField]
})
class LuxTimepickerSignalFormTestComponent {
  readonly model = signal<{ beginn: string | null }>({ beginn: null });
  readonly testForm = form(this.model, (path) => {
    validate(path.beginn, luxTimeValue({ min: () => '08:00' }));
  });
}

@Component({
  selector: 'lux-timepicker-required-signal-form',
  template: `<lux-timepicker luxLabel="Beginn" [formField]="testForm.beginn" />`,
  imports: [LuxTimepickerComponent, FormField]
})
class LuxTimepickerRequiredSignalFormTestComponent {
  readonly model = signal<{ beginn: string | null }>({ beginn: null });
  readonly testForm = form(this.model, (path) => {
    required(path.beginn, { message: 'Bitte ausfüllen' });
  });
}

interface LuxDateTimeHost {
  readonly defaultTime: WritableSignal<string>;
  termin(): string | null;
  setTermin(value: string | null): void;
}

@Component({
  template: `
    <div [formGroup]="form">
      <lux-datepicker luxLabel="Datum" luxControlBinding="termin" [luxReferenceControl]="timepicker" #datepicker />
      <lux-timepicker
        luxLabel="Zeit"
        luxControlBinding="termin"
        [luxReferenceControl]="datepicker"
        [luxDefaultTime]="defaultTime()"
        [luxMinTime]="minTime()"
        #timepicker
      />
    </div>
  `,
  imports: [ReactiveFormsModule, LuxDatepickerComponent, LuxTimepickerComponent]
})
class LuxDateTimeReactiveTestComponent implements LuxDateTimeHost {
  readonly defaultTime = signal('00:00');
  readonly minTime = signal<string | null>(null);
  readonly form = new FormGroup({
    termin: new FormControl<string | null>(null)
  });

  termin() {
    return this.form.get('termin')!.value;
  }

  setTermin(value: string | null) {
    this.form.get('termin')!.setValue(value);
  }
}

@Component({
  template: `
    <lux-datepicker luxLabel="Datum" [(luxValue)]="value" [luxReferenceControl]="timepicker" #datepicker />
    <lux-timepicker luxLabel="Zeit" [(luxValue)]="value" [luxReferenceControl]="datepicker" [luxDefaultTime]="defaultTime()" #timepicker />
  `,
  imports: [LuxDatepickerComponent, LuxTimepickerComponent]
})
class LuxDateTimeNoFormTestComponent implements LuxDateTimeHost {
  readonly defaultTime = signal('00:00');
  readonly value = signal<string | null>(null);

  termin() {
    return this.value();
  }

  setTermin(value: string | null) {
    this.value.set(value);
  }
}

@Component({
  template: `
    <lux-datepicker luxLabel="Datum" [formField]="testForm.termin" [luxReferenceControl]="timepicker" #datepicker />
    <lux-timepicker
      luxLabel="Zeit"
      [formField]="testForm.termin"
      [luxReferenceControl]="datepicker"
      [luxDefaultTime]="defaultTime()"
      #timepicker
    />
  `,
  imports: [LuxDatepickerComponent, LuxTimepickerComponent, FormField]
})
class LuxDateTimeSignalFormTestComponent implements LuxDateTimeHost {
  readonly defaultTime = signal('00:00');
  readonly model = signal<{ termin: string | null }>({ termin: null });
  readonly testForm = form(this.model, (path) => {
    validate(path.termin, luxDateTimeValue({ minTime: () => '08:00' }));
  });

  termin() {
    return this.model().termin;
  }

  setTermin(value: string | null) {
    this.model.set({ termin: value });
  }
}

@Component({
  template: `
    <div [formGroup]="form">
      <lux-timepicker luxLabel="Zeit (Ansicht 1)" luxControlBinding="time"></lux-timepicker>
      <lux-timepicker luxLabel="Zeit (Ansicht 2)" luxControlBinding="time"></lux-timepicker>
    </div>
  `,
  imports: [ReactiveFormsModule, LuxTimepickerComponent]
})
class LuxTimepickerSharedControlComponent {
  readonly form = new FormGroup({
    time: new FormControl<string | null>('14:15')
  });
}

@Component({
  template: `
    <lux-timepicker luxLabel="Zeit" [luxDisabled]="disabled" [luxReadonly]="readonly" [luxRequired]="required"></lux-timepicker>
  `,
  imports: [LuxTimepickerComponent]
})
class LuxTimepickerA11yComponent {
  disabled = false;
  readonly = false;
  required = false;
}

/**
 * Sammelt alles, was Timepicker und Datepicker nach außen geben. channels nennt die Ausgaben, die der Host abhört.
 */
abstract class LuxTimepickerOutputHost {
  abstract readonly channels: string[];
  readonly emitted: { channel: string; value: unknown }[] = [];
  readonly opened = signal(false);
  readonly dateOpened = signal(false);

  abstract current(): unknown;

  record(channel: string, value: unknown) {
    this.emitted.push({ channel, value });
  }
}

/**
 * Jede Ausgabe ist null oder ein String im erwarteten Format, und jede abgehörte Ausgabe wurde mindestens einmal
 * ausgelöst. Sonst bliebe unbemerkt, wenn ein Kanal gar nichts liefert.
 */
function expectOnlyOutputFormat(host: LuxTimepickerOutputHost, format: RegExp) {
  for (const { channel, value } of host.emitted) {
    const context = `${channel}: ${value instanceof Date ? 'Date-Objekt' : JSON.stringify(value)}`;
    expect(value === null || (typeof value === 'string' && format.test(value)), context).toBe(true);
  }

  expect([...new Set(host.emitted.map(({ channel }) => channel))].sort()).toEqual([...host.channels].sort());
}

const PICKER_CHANNELS = ['valueChange', 'luxValueChange'];
const SHARED_PICKER_CHANNELS = [
  'datepicker.valueChange',
  'datepicker.luxValueChange',
  'timepicker.valueChange',
  'timepicker.luxValueChange'
];

@Component({
  template: `
    <div [formGroup]="form">
      <lux-timepicker
        luxLabel="Zeit"
        luxControlBinding="time"
        [luxOpened]="opened()"
        (valueChange)="record('valueChange', $event)"
        (luxValueChange)="record('luxValueChange', $event)"
      />
    </div>
  `,
  imports: [ReactiveFormsModule, LuxTimepickerComponent]
})
class LuxTimepickerOutputReactiveComponent extends LuxTimepickerOutputHost {
  readonly channels = ['form.valueChanges', 'control.valueChanges', ...PICKER_CHANNELS];
  readonly form = new FormGroup({
    time: new FormControl<string | null>(null)
  });

  constructor() {
    super();
    this.form.valueChanges.subscribe((value) => this.record('form.valueChanges', value.time));
    this.form.controls.time.valueChanges.subscribe((value) => this.record('control.valueChanges', value));
  }

  current() {
    return this.form.controls.time.value;
  }
}

@Component({
  template: `
    <lux-timepicker
      luxLabel="Zeit"
      [formField]="testForm.time"
      [luxOpened]="opened()"
      (valueChange)="record('valueChange', $event)"
      (luxValueChange)="record('luxValueChange', $event)"
    />
  `,
  imports: [LuxTimepickerComponent, FormField]
})
class LuxTimepickerOutputSignalFormComponent extends LuxTimepickerOutputHost {
  readonly channels = PICKER_CHANNELS;
  readonly model = signal<{ time: string | null }>({ time: null });
  readonly testForm = form(this.model);

  current() {
    return this.model().time;
  }
}

@Component({
  template: `
    <lux-timepicker
      luxLabel="Zeit"
      [(value)]="value"
      [luxOpened]="opened()"
      (valueChange)="record('valueChange', $event)"
      (luxValueChange)="record('luxValueChange', $event)"
    />
  `,
  imports: [LuxTimepickerComponent]
})
class LuxTimepickerOutputValueComponent extends LuxTimepickerOutputHost {
  readonly channels = PICKER_CHANNELS;
  readonly value = signal<string | null>(null);

  current() {
    return this.value();
  }
}

@Component({
  template: `
    <lux-timepicker
      luxLabel="Zeit"
      [(luxValue)]="value"
      [luxOpened]="opened()"
      (valueChange)="record('valueChange', $event)"
      (luxValueChange)="record('luxValueChange', $event)"
    />
  `,
  imports: [LuxTimepickerComponent]
})
class LuxTimepickerOutputLuxValueComponent extends LuxTimepickerOutputHost {
  readonly channels = PICKER_CHANNELS;
  readonly value = signal<string | null>(null);

  current() {
    return this.value();
  }
}

@Component({
  template: `
    <div [formGroup]="form">
      <lux-datepicker
        luxLabel="Datum"
        luxControlBinding="termin"
        [luxReferenceControl]="timepicker"
        [luxOpened]="dateOpened()"
        (valueChange)="record('datepicker.valueChange', $event)"
        (luxValueChange)="record('datepicker.luxValueChange', $event)"
        #datepicker
      />
      <lux-timepicker
        luxLabel="Zeit"
        luxControlBinding="termin"
        [luxReferenceControl]="datepicker"
        [luxOpened]="opened()"
        (valueChange)="record('timepicker.valueChange', $event)"
        (luxValueChange)="record('timepicker.luxValueChange', $event)"
        #timepicker
      />
    </div>
  `,
  imports: [ReactiveFormsModule, LuxDatepickerComponent, LuxTimepickerComponent]
})
class LuxDateTimeOutputReactiveComponent extends LuxTimepickerOutputHost {
  readonly channels = ['form.valueChanges', 'control.valueChanges', ...SHARED_PICKER_CHANNELS];
  readonly form = new FormGroup({
    termin: new FormControl<string | null>(null)
  });

  constructor() {
    super();
    this.form.valueChanges.subscribe((value) => this.record('form.valueChanges', value.termin));
    this.form.controls.termin.valueChanges.subscribe((value) => this.record('control.valueChanges', value));
  }

  current() {
    return this.form.controls.termin.value;
  }
}

@Component({
  template: `
    <lux-datepicker
      luxLabel="Datum"
      [formField]="testForm.termin"
      [luxReferenceControl]="timepicker"
      [luxOpened]="dateOpened()"
      (valueChange)="record('datepicker.valueChange', $event)"
      (luxValueChange)="record('datepicker.luxValueChange', $event)"
      #datepicker
    />
    <lux-timepicker
      luxLabel="Zeit"
      [formField]="testForm.termin"
      [luxReferenceControl]="datepicker"
      [luxOpened]="opened()"
      (valueChange)="record('timepicker.valueChange', $event)"
      (luxValueChange)="record('timepicker.luxValueChange', $event)"
      #timepicker
    />
  `,
  imports: [LuxDatepickerComponent, LuxTimepickerComponent, FormField]
})
class LuxDateTimeOutputSignalFormComponent extends LuxTimepickerOutputHost {
  readonly channels = SHARED_PICKER_CHANNELS;
  readonly model = signal<{ termin: string | null }>({ termin: null });
  readonly testForm = form(this.model);

  current() {
    return this.model().termin;
  }
}

@Component({
  template: `
    <lux-datepicker
      luxLabel="Datum"
      [(value)]="value"
      [luxReferenceControl]="timepicker"
      [luxOpened]="dateOpened()"
      (valueChange)="record('datepicker.valueChange', $event)"
      (luxValueChange)="record('datepicker.luxValueChange', $event)"
      #datepicker
    />
    <lux-timepicker
      luxLabel="Zeit"
      [(value)]="value"
      [luxReferenceControl]="datepicker"
      [luxOpened]="opened()"
      (valueChange)="record('timepicker.valueChange', $event)"
      (luxValueChange)="record('timepicker.luxValueChange', $event)"
      #timepicker
    />
  `,
  imports: [LuxDatepickerComponent, LuxTimepickerComponent]
})
class LuxDateTimeOutputValueComponent extends LuxTimepickerOutputHost {
  readonly channels = SHARED_PICKER_CHANNELS;
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
      [luxReferenceControl]="timepicker"
      [luxOpened]="dateOpened()"
      (valueChange)="record('datepicker.valueChange', $event)"
      (luxValueChange)="record('datepicker.luxValueChange', $event)"
      #datepicker
    />
    <lux-timepicker
      luxLabel="Zeit"
      [(luxValue)]="value"
      [luxReferenceControl]="datepicker"
      [luxOpened]="opened()"
      (valueChange)="record('timepicker.valueChange', $event)"
      (luxValueChange)="record('timepicker.luxValueChange', $event)"
      #timepicker
    />
  `,
  imports: [LuxDatepickerComponent, LuxTimepickerComponent]
})
class LuxDateTimeOutputLuxValueComponent extends LuxTimepickerOutputHost {
  readonly channels = SHARED_PICKER_CHANNELS;
  readonly value = signal<string | null>(null);

  current() {
    return this.value();
  }
}
