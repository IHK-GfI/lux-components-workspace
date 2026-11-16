import { TestBed } from '@angular/core/testing';
import type { FieldContext } from '@angular/forms/signals';
import { TranslocoService } from '@jsverse/transloco';
import { beforeEach, describe, expect, it } from 'vitest';
import { provideLuxTranslocoTesting } from '../../../testing/transloco-test.provider';
import { LuxUtil } from '../../lux-util/lux-util';
import { luxDateTimeValue, luxDateValue } from './lux-datepicker-validators';

function ctxFor(value: string | null): FieldContext<string | null> {
  return { value: () => value } as FieldContext<string | null>;
}

describe('luxDateValue', () => {
  let tService: TranslocoService;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideLuxTranslocoTesting()] });
    tService = TestBed.inject(TranslocoService);
  });

  // Der Validator injiziert TranslocoService für die message - muss deshalb innerhalb eines
  // Injection-Context erzeugt werden, genau wie im echten Einsatz innerhalb eines form()-Schemas.
  function createValidator(options: Parameters<typeof luxDateValue>[0] = {}) {
    return TestBed.runInInjectionContext(() => luxDateValue(options));
  }

  it('sollte valid sein, wenn kein Wert gesetzt ist', () => {
    const validator = createValidator();
    expect(validator(ctxFor(null))).toBeUndefined();
    expect(validator(ctxFor(''))).toBeUndefined();
  });

  it('sollte ein Datum ohne Zeitzone und Mitternacht ohne Zeitzone annehmen', () => {
    const validator = createValidator();
    expect(validator(ctxFor('2029-05-26'))).toBeUndefined();
    expect(validator(ctxFor('2029-05-26T00:00:00'))).toBeUndefined();
  });

  it('sollte andere Formate mit übersetzter message ablehnen', () => {
    const validator = createValidator();

    ['2029-05-26T00:00:00.000Z', '2029-05-25T22:00:00.000Z', '2029-05-26T23:30:00', '26.05.2029', '2029-02-29'].forEach((value) =>
      expect(validator(ctxFor(value)), value).toEqual({
        kind: 'matDatepickerParse',
        message: tService.translate('luxc.datepicker.error_message.invalid')
      })
    );
  });

  it('sollte min und max prüfen, die Grenzen selbst sind erlaubt', () => {
    const validator = createValidator({ min: () => '2029-05-20', max: () => '2029-05-31' });

    expect(validator(ctxFor('2029-05-20'))).toBeUndefined();
    expect(validator(ctxFor('2029-05-31'))).toBeUndefined();
    expect(validator(ctxFor('2029-05-19'))).toEqual({
      kind: 'matDatepickerMin',
      message: tService.translate('luxc.datepicker.error_message.min')
    });
    expect(validator(ctxFor('2029-06-01'))).toEqual({
      kind: 'matDatepickerMax',
      message: tService.translate('luxc.datepicker.error_message.max')
    });
  });

  it('sollte über Monats- und Jahreswechsel richtig vergleichen', () => {
    const validator = createValidator({ min: () => '2029-12-31', max: () => '2030-01-01' });

    expect(validator(ctxFor('2029-12-31'))).toBeUndefined();
    expect(validator(ctxFor('2030-01-01'))).toBeUndefined();
    expect(validator(ctxFor('2029-12-30'))).toMatchObject({ kind: 'matDatepickerMin' });
    expect(validator(ctxFor('2030-01-02'))).toMatchObject({ kind: 'matDatepickerMax' });
  });

  it('sollte den Filter mit "yyyy-MM-dd" aufrufen', () => {
    const weekdaysOnly = (date: string) => ![0, 6].includes(LuxUtil.getDayOfWeek(date)!);
    const validator = createValidator({ filter: () => weekdaysOnly });

    // 25.05.2029 ist ein Freitag, 26.05.2029 ein Samstag
    expect(validator(ctxFor('2029-05-25'))).toBeUndefined();
    expect(validator(ctxFor('2029-05-26'))).toEqual({
      kind: 'matDatepickerFilter',
      message: tService.translate('luxc.datepicker.error_message.invalid')
    });
  });

  it('sollte fehlende oder unpassende Grenzen ignorieren', () => {
    expect(createValidator({ min: () => null, max: () => undefined })(ctxFor('2029-05-26'))).toBeUndefined();
    expect(createValidator({ min: () => '2029-05-26T00:00:00.000Z' })(ctxFor('2000-01-01'))).toBeUndefined();
  });

  it('sollte auf geänderte Grenzen reagieren, da die Optionen bei jedem Aufruf neu gelesen werden', () => {
    let min = '2029-05-20';
    const validator = createValidator({ min: () => min });

    expect(validator(ctxFor('2029-05-25'))).toBeUndefined();
    min = '2029-05-30';
    expect(validator(ctxFor('2029-05-25'))).toMatchObject({ kind: 'matDatepickerMin' });
  });
});

describe('luxDateTimeValue', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideLuxTranslocoTesting()] });
  });

  function createValidator(options: Parameters<typeof luxDateTimeValue>[0] = {}) {
    return TestBed.runInInjectionContext(() => luxDateTimeValue(options));
  }

  it('sollte Datum und Uhrzeit ohne Zeitzone annehmen', () => {
    const validator = createValidator();
    expect(validator(ctxFor(null))).toBeUndefined();
    expect(validator(ctxFor('2029-05-26T14:30'))).toBeUndefined();
    expect(validator(ctxFor('2029-05-26T14:30:00'))).toBeUndefined();
  });

  it('sollte andere Formate ablehnen', () => {
    const validator = createValidator();

    ['2029-05-26T14:30:00.000Z', '2029-05-26', '14:30', '2029-05-26T24:00', '2029-02-29T10:00'].forEach((value) =>
      expect(validator(ctxFor(value)), value).toMatchObject({ kind: 'matDatepickerParse' })
    );
  });

  it('sollte Tag und Uhrzeit getrennt gegen ihre Grenzen prüfen', () => {
    const validator = createValidator({
      minDate: () => '2029-05-20',
      maxDate: () => '2029-05-31',
      minTime: () => '08:00',
      maxTime: () => '18:00'
    });

    expect(validator(ctxFor('2029-05-20T08:00'))).toBeUndefined();
    expect(validator(ctxFor('2029-05-31T18:00'))).toBeUndefined();
    expect(validator(ctxFor('2029-05-19T12:00'))).toMatchObject({ kind: 'matDatepickerMin' });
    expect(validator(ctxFor('2029-06-01T12:00'))).toMatchObject({ kind: 'matDatepickerMax' });
    expect(validator(ctxFor('2029-05-25T07:59'))).toMatchObject({ kind: 'matTimepickerMin' });
    expect(validator(ctxFor('2029-05-25T18:01'))).toMatchObject({ kind: 'matTimepickerMax' });
  });

  it('sollte den Filter mit dem Tag aufrufen', () => {
    const validator = createValidator({ filter: () => (date: string) => ![0, 6].includes(LuxUtil.getDayOfWeek(date)!) });

    expect(validator(ctxFor('2029-05-25T14:30'))).toBeUndefined();
    expect(validator(ctxFor('2029-05-26T14:30'))).toMatchObject({ kind: 'matDatepickerFilter' });
  });
});
