import { TestBed } from '@angular/core/testing';
import type { FieldContext } from '@angular/forms/signals';
import { TranslocoService } from '@jsverse/transloco';
import { beforeEach, describe, expect, it } from 'vitest';
import { provideLuxTranslocoTesting } from '../../../testing/transloco-test.provider';
import { luxTimeValue } from './lux-timepicker-validators';

function ctxFor(value: string | null): FieldContext<string | null> {
  return { value: () => value } as FieldContext<string | null>;
}

describe('luxTimeValue', () => {
  let tService: TranslocoService;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideLuxTranslocoTesting()] });
    tService = TestBed.inject(TranslocoService);
  });

  // Der Validator injiziert TranslocoService für die message - muss deshalb innerhalb eines
  // Injection-Context erzeugt werden, genau wie im echten Einsatz innerhalb eines form()-Schemas.
  function createValidator(options: Parameters<typeof luxTimeValue>[0] = {}) {
    return TestBed.runInInjectionContext(() => luxTimeValue(options));
  }

  it('sollte valid sein, wenn kein Wert gesetzt ist', () => {
    const validator = createValidator({ min: () => '08:00', max: () => '19:00' });
    expect(validator(ctxFor(null))).toBeUndefined();
    expect(validator(ctxFor(''))).toBeUndefined();
  });

  it('sollte "HH:mm" und Sekunden ":00" annehmen', () => {
    const validator = createValidator();
    expect(validator(ctxFor('14:30'))).toBeUndefined();
    expect(validator(ctxFor('14:30:00'))).toBeUndefined();
    expect(validator(ctxFor('00:00'))).toBeUndefined();
    expect(validator(ctxFor('23:59'))).toBeUndefined();
  });

  it('sollte andere Formate mit übersetzter message ablehnen', () => {
    const validator = createValidator();

    ['1970-01-01T14:30:00.000Z', '24:00', '14:30:15', '4:30', 'kein-datum'].forEach((value) =>
      expect(validator(ctxFor(value)), value).toEqual({
        kind: 'matTimepickerParse',
        message: tService.translate('luxc.timepicker.error_message.invalid')
      })
    );
  });

  it('sollte min und max prüfen, die Grenzen selbst sind erlaubt', () => {
    const validator = createValidator({ min: () => '08:00', max: () => '19:00' });

    expect(validator(ctxFor('08:00'))).toBeUndefined();
    expect(validator(ctxFor('19:00'))).toBeUndefined();
    expect(validator(ctxFor('07:59'))).toEqual({
      kind: 'matTimepickerMin',
      message: tService.translate('luxc.timepicker.error_message.min')
    });
    expect(validator(ctxFor('19:01'))).toEqual({
      kind: 'matTimepickerMax',
      message: tService.translate('luxc.timepicker.error_message.max')
    });
  });

  it('sollte fehlende oder unpassende Grenzen ignorieren', () => {
    expect(createValidator({ min: () => null, max: () => undefined })(ctxFor('14:30'))).toBeUndefined();
    expect(createValidator({ min: () => '1970-01-01T08:00:00.000Z' })(ctxFor('05:00'))).toBeUndefined();
  });

  it('sollte auf geänderte Grenzen reagieren, da die Optionen bei jedem Aufruf neu gelesen werden', () => {
    let min = '08:00';
    const validator = createValidator({ min: () => min });

    expect(validator(ctxFor('09:00'))).toBeUndefined();
    min = '10:00';
    expect(validator(ctxFor('09:00'))).toMatchObject({ kind: 'matTimepickerMin' });
  });
});
