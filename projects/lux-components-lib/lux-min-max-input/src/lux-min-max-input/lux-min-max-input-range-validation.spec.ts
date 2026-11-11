import { rangeErrors, toComparable } from './lux-min-max-input-range-validation';

describe('LuxMinMaxInput: toComparable', () => {
  it('Sollte null, undefined und den leeren String bei jedem Typ als leer behandeln', () => {
    for (const raw of [null, undefined, '']) {
      expect(toComparable(raw, 'number')).toBeUndefined();
      expect(toComparable(raw, 'date')).toBeUndefined();
    }
  });

  it('Sollte Zahlen und numerische Strings umwandeln', () => {
    expect(toComparable(12.5, 'number')).toBe(12.5);
    expect(toComparable('7', 'number')).toBe(7);
    expect(toComparable(0, 'number')).toBe(0);
  });

  it('Sollte ISO-Daten in Zeitstempel umwandeln', () => {
    expect(toComparable('2026-05-01T00:00:00.000Z', 'date')).toBe(Date.parse('2026-05-01T00:00:00.000Z'));
  });

  it('Sollte für ungültige Werte null liefern', () => {
    expect(toComparable('abc', 'number')).toBeNull();
    expect(toComparable('not a date', 'date')).toBeNull();
  });
});

describe('LuxMinMaxInput: rangeErrors', () => {
  it('Sollte für einen leeren eigenen Wert null liefern', () => {
    expect(rangeErrors('min', undefined, 5, { min: 10 })).toBeNull();
  });

  it('Sollte range auf beiden Seiten melden, wenn Von größer als Bis ist', () => {
    expect(rangeErrors('min', 200, 100, {})).toEqual({ range: true });
    expect(rangeErrors('max', 100, 200, {})).toEqual({ range: true });
  });

  it('Sollte gleiche Werte und eine leere Gegenseite akzeptieren', () => {
    expect(rangeErrors('min', 5, 5, {})).toBeNull();
    expect(rangeErrors('max', 5, undefined, {})).toBeNull();
  });

  it('Sollte einseitige Grenzen melden', () => {
    expect(rangeErrors('min', -1, undefined, { min: 0 })).toEqual({ belowMin: true });
    expect(rangeErrors('max', 101, undefined, { max: 100 })).toEqual({ aboveMax: true });
  });

  it('Sollte outOfBounds melden, wenn beide Grenzen gesetzt sind', () => {
    expect(rangeErrors('min', 150, undefined, { min: 0, max: 100 })).toEqual({ outOfBounds: true });
    expect(rangeErrors('min', -5, undefined, { min: 0, max: 100 })).toEqual({ outOfBounds: true });
  });

  it('Sollte Bereichs- und Grenzfehler kombinieren', () => {
    expect(rangeErrors('min', 150, 100, { min: 0, max: 120 })).toEqual({ range: true, outOfBounds: true });
  });
});
