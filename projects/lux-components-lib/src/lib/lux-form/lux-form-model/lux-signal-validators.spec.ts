import type { FieldContext } from '@angular/forms/signals';
import { describe, expect, it } from 'vitest';
import { luxRequiredArray } from './lux-signal-validators';

function ctxFor(value: unknown): FieldContext<unknown> {
  return { value: () => value } as FieldContext<unknown>;
}

describe('luxRequiredArray', () => {
  it('sollte invalid sein, wenn required und der Wert ein leeres Array ist', () => {
    const validator = luxRequiredArray({ when: () => true });
    expect(validator(ctxFor([]))).toEqual({ kind: 'required' });
  });

  it('sollte valid sein, wenn required und das Array Einträge enthält', () => {
    const validator = luxRequiredArray({ when: () => true });
    expect(validator(ctxFor([1]))).toBeUndefined();
  });

  it('sollte valid sein, wenn nicht required, auch bei leerem Array', () => {
    const validator = luxRequiredArray({ when: () => false });
    expect(validator(ctxFor([]))).toBeUndefined();
  });

  it('sollte ohne when-Option required sein', () => {
    const validator = luxRequiredArray();
    expect(validator(ctxFor([]))).toEqual({ kind: 'required' });
  });

  it('sollte valid sein, wenn der Wert kein Array ist (required() aus @angular/forms/signals deckt diesen Fall ab)', () => {
    const validator = luxRequiredArray({ when: () => true });
    expect(validator(ctxFor(null))).toBeUndefined();
    expect(validator(ctxFor(''))).toBeUndefined();
  });
});
