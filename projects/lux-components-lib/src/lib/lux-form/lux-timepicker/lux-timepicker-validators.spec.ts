import { TestBed } from '@angular/core/testing';
import type { FieldContext } from '@angular/forms/signals';
import { TranslocoService } from '@jsverse/transloco';
import { beforeEach, describe, expect, it } from 'vitest';
import { provideLuxTranslocoTesting } from '../../../testing/transloco-test.provider';
import { luxTimepickerMinMax } from './lux-timepicker-validators';

function ctxFor(value: string | null): FieldContext<string | null> {
  return { value: () => value } as FieldContext<string | null>;
}

describe('luxTimepickerMinMax', () => {
  let tService: TranslocoService;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideLuxTranslocoTesting()] });
    tService = TestBed.inject(TranslocoService);
  });

  // Der Validator injiziert TranslocoService für die message - muss deshalb innerhalb eines
  // Injection-Context erzeugt werden, genau wie im echten Einsatz innerhalb eines form()-Schemas.
  function createValidator(options: Parameters<typeof luxTimepickerMinMax>[0]) {
    return TestBed.runInInjectionContext(() => luxTimepickerMinMax(options));
  }

  it('sollte valid sein, wenn kein Wert gesetzt ist', () => {
    const validator = createValidator({ min: () => '08:00', max: () => '19:00' });
    expect(validator(ctxFor(null))).toBeUndefined();
  });

  it('sollte valid sein, wenn der Wert kein parsbares Datum ist', () => {
    const validator = createValidator({ min: () => '08:00', max: () => '19:00' });
    expect(validator(ctxFor('kein-datum'))).toBeUndefined();
  });

  it('sollte valid sein, wenn der Wert innerhalb von min/max liegt', () => {
    const validator = createValidator({ min: () => '08:00', max: () => '19:00' });
    expect(validator(ctxFor('2026-06-18T14:30:00.000Z'))).toBeUndefined();
  });

  it('sollte valid sein, wenn der Wert genau auf min liegt', () => {
    const validator = createValidator({ min: () => '08:00', max: () => '19:00' });
    expect(validator(ctxFor('2026-06-18T08:00:00.000Z'))).toBeUndefined();
  });

  it('sollte valid sein, wenn der Wert genau auf max liegt', () => {
    const validator = createValidator({ min: () => '08:00', max: () => '19:00' });
    expect(validator(ctxFor('2026-06-18T19:00:00.000Z'))).toBeUndefined();
  });

  it('sollte invalid sein, wenn der Wert vor min liegt, mit übersetzter message', () => {
    const validator = createValidator({ min: () => '08:00', max: () => '19:00' });
    expect(validator(ctxFor('2026-06-18T07:59:00.000Z'))).toEqual({
      kind: 'luxTimepickerMin',
      message: tService.translate('luxc.timepicker.error_message.min')
    });
  });

  it('sollte invalid sein, wenn der Wert nach max liegt, mit übersetzter message', () => {
    const validator = createValidator({ min: () => '08:00', max: () => '19:00' });
    expect(validator(ctxFor('2026-06-18T19:01:00.000Z'))).toEqual({
      kind: 'luxTimepickerMax',
      message: tService.translate('luxc.timepicker.error_message.max')
    });
  });

  it('sollte min ignorieren, wenn kein min gesetzt ist', () => {
    const validator = createValidator({ max: () => '19:00' });
    expect(validator(ctxFor('2026-06-18T00:00:00.000Z'))).toBeUndefined();
  });

  it('sollte max ignorieren, wenn kein max gesetzt ist', () => {
    const validator = createValidator({ min: () => '08:00' });
    expect(validator(ctxFor('2026-06-18T23:59:00.000Z'))).toBeUndefined();
  });

  it('sollte valid sein, wenn weder min noch max gesetzt sind', () => {
    const validator = createValidator({});
    expect(validator(ctxFor('2026-06-18T23:59:00.000Z'))).toBeUndefined();
  });

  it('sollte nicht-parsbare min/max-Strings ignorieren', () => {
    const validator = createValidator({ min: () => 'kaputt', max: () => 'kaputt' });
    expect(validator(ctxFor('2026-06-18T23:59:00.000Z'))).toBeUndefined();
  });

  it('sollte auf geänderte min/max-Werte reagieren, da die Optionen bei jedem Aufruf neu gelesen werden', () => {
    let min = '08:00';
    const validator = createValidator({ min: () => min, max: () => '19:00' });

    expect(validator(ctxFor('2026-06-18T07:30:00.000Z'))).toMatchObject({ kind: 'luxTimepickerMin' });

    min = '06:00';
    expect(validator(ctxFor('2026-06-18T07:30:00.000Z'))).toBeUndefined();
  });
});
