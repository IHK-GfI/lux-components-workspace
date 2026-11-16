import { TestBed } from '@angular/core/testing';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { LuxUtil } from '../../lux-util/lux-util';
import { LuxCalendarDate, LuxDatepickerAdapter } from './lux-datepicker-adapter';

const DISPLAY_FORMAT: Intl.DateTimeFormatOptions = { day: '2-digit', month: '2-digit', year: 'numeric' };

// Der Adapter rechnet ohne Date und muss deshalb in jeder Zeitzone dasselbe Ergebnis liefern.
describe('LuxDatepickerAdapter', () => {
  let adapter: LuxDatepickerAdapter;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LuxDatepickerAdapter, { provide: MAT_DATE_LOCALE, useValue: 'de-DE' }]
    });
    adapter = TestBed.inject(LuxDatepickerAdapter);
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  function format(date: LuxCalendarDate) {
    return LuxUtil.stringWithoutASCIIChars(adapter.format(date, DISPLAY_FORMAT));
  }

  it('Sollte den Tag nach der Locale anzeigen', () => {
    const date = new LuxCalendarDate(2029, 5, 26);
    expect(format(date)).toEqual('26.05.2029');

    adapter.setLocale('en-US');
    expect(format(date)).toEqual('05/26/2029');

    adapter.setLocale('en-GB');
    expect(format(date)).toEqual('26/05/2029');
  });

  it('Sollte die Datumsbestandteile liefern (Monat wie bei Material ab 0)', () => {
    const date = new LuxCalendarDate(2029, 5, 26);

    expect(adapter.getYear(date)).toEqual(2029);
    expect(adapter.getMonth(date)).toEqual(4);
    expect(adapter.getDate(date)).toEqual(26);
    // 26.05.2029 ist ein Samstag
    expect(adapter.getDayOfWeek(date)).toEqual(6);
    expect(adapter.getYearName(date)).toEqual('2029');
  });

  it('Sollte ein Datum aus den Bestandteilen von Material erzeugen', () => {
    expect(adapter.createDate(2029, 4, 26)).toEqual(new LuxCalendarDate(2029, 5, 26));
    expect(adapter.toIso8601(adapter.createDate(2029, 0, 1))).toEqual('2029-01-01');
  });

  it('Sollte die Anzahl der Tage des Monats liefern', () => {
    expect(adapter.getNumDaysInMonth(new LuxCalendarDate(2028, 2, 1))).toEqual(29);
    expect(adapter.getNumDaysInMonth(new LuxCalendarDate(2029, 2, 1))).toEqual(28);
    expect(adapter.getNumDaysInMonth(new LuxCalendarDate(2029, 4, 1))).toEqual(30);
    expect(adapter.getNumDaysInMonth(new LuxCalendarDate(2029, 12, 1))).toEqual(31);
  });

  it('Sollte Tage, Monate und Jahre addieren', () => {
    expect(adapter.addCalendarDays(new LuxCalendarDate(2029, 5, 31), 1)).toEqual(new LuxCalendarDate(2029, 6, 1));
    expect(adapter.addCalendarDays(new LuxCalendarDate(2027, 3, 27), 2)).toEqual(new LuxCalendarDate(2027, 3, 29));
    expect(adapter.addCalendarMonths(new LuxCalendarDate(2029, 12, 15), 1)).toEqual(new LuxCalendarDate(2030, 1, 15));
    expect(adapter.addCalendarMonths(new LuxCalendarDate(2030, 1, 15), -1)).toEqual(new LuxCalendarDate(2029, 12, 15));
    // Bei einem Überlauf gilt der letzte Tag des Zielmonats
    expect(adapter.addCalendarMonths(new LuxCalendarDate(2029, 1, 31), 1)).toEqual(new LuxCalendarDate(2029, 2, 28));
    expect(adapter.addCalendarYears(new LuxCalendarDate(2028, 2, 29), 1)).toEqual(new LuxCalendarDate(2029, 2, 28));
    expect(adapter.addCalendarYears(new LuxCalendarDate(2028, 2, 29), 4)).toEqual(new LuxCalendarDate(2032, 2, 29));
  });

  it('Sollte als heute den Tag aus Sicht des Nutzers liefern (kurz nach und kurz vor Mitternacht)', () => {
    vi.useFakeTimers();

    vi.setSystemTime(new Date(2029, 4, 26, 0, 0, 1));
    expect(adapter.today()).toEqual(new LuxCalendarDate(2029, 5, 26));

    vi.setSystemTime(new Date(2029, 4, 26, 23, 59, 59));
    expect(adapter.today()).toEqual(new LuxCalendarDate(2029, 5, 26));
  });

  it('Sollte Montag als ersten Wochentag für de-DE liefern', () => {
    expect(adapter.getFirstDayOfWeek()).toEqual(1);
  });

  describe('getFirstDayOfWeek ohne Angular-Locale-Daten', () => {
    function mockWeekInfo(locale: object) {
      vi.spyOn(Intl, 'Locale').mockImplementation(function () {
        return locale;
      } as never);
      adapter.setLocale('xx-XX');
    }

    it('Sollte den ersten Wochentag über getWeekInfo() lesen', () => {
      mockWeekInfo({ getWeekInfo: () => ({ firstDay: 1 }) });

      expect(adapter.getFirstDayOfWeek()).toEqual(1);
    });

    it('Sollte den ersten Wochentag über den Getter weekInfo lesen (z.B. Safari)', () => {
      mockWeekInfo({ weekInfo: { firstDay: 1 } });

      expect(adapter.getFirstDayOfWeek()).toEqual(1);
    });

    it('Sollte 7 (Sonntag bei Intl) auf 0 abbilden', () => {
      mockWeekInfo({ weekInfo: { firstDay: 7 } });

      expect(adapter.getFirstDayOfWeek()).toEqual(0);
    });

    it('Sollte ohne Wochen-Informationen des Browsers Sonntag liefern', () => {
      mockWeekInfo({});

      expect(adapter.getFirstDayOfWeek()).toEqual(0);
    });
  });

  describe('parse (Texteingabe)', () => {
    it('Sollte die Eingabe nach der Reihenfolge von de-DE lesen', () => {
      const expected = new LuxCalendarDate(2029, 5, 26);

      ['26.05.2029', '26/05/2029', '26-05-2029', '26 05 2029', '26052029', ' 26.05.2029 '].forEach((text) =>
        expect(adapter.parse(text), text).toEqual(expected)
      );
      expect(adapter.parse('1.2.2029')).toEqual(new LuxCalendarDate(2029, 2, 1));
    });

    it('Sollte die Eingabe nach der Reihenfolge von en-US lesen', () => {
      adapter.setLocale('en-US');

      expect(adapter.parse('05/26/2029')).toEqual(new LuxCalendarDate(2029, 5, 26));
      expect(adapter.parse('05262029')).toEqual(new LuxCalendarDate(2029, 5, 26));
      expect(adapter.isValid(adapter.parse('26/05/2029')!)).toBe(false);
    });

    it('Sollte die Eingabe nach der Reihenfolge von en-GB lesen', () => {
      adapter.setLocale('en-GB');

      // Bisher wurde 25/09/2026 unabhängig von der Locale als MM/dd gelesen
      expect(adapter.parse('25/09/2026')).toEqual(new LuxCalendarDate(2026, 9, 25));
      expect(adapter.parse('26/05/2029')).toEqual(new LuxCalendarDate(2029, 5, 26));
    });

    it('Sollte ungültige Eingaben als ungültigen Wert liefern', () => {
      [
        '31.02.2029',
        '29.02.2029',
        '32.01.2029',
        '26.13.2029',
        '26.05.29',
        '26.5.29',
        '2029-05-26',
        '1122029',
        '26.05.2029x',
        'abc'
      ].forEach((text) => {
        const date = adapter.parse(text);
        expect(date, text).not.toBeNull();
        expect(adapter.isValid(date!), text).toBe(false);
      });
    });

    it('Sollte den 29.02. nur in Schaltjahren annehmen', () => {
      expect(adapter.parse('29.02.2028')).toEqual(new LuxCalendarDate(2028, 2, 29));
      expect(adapter.isValid(adapter.parse('29.02.2029')!)).toBe(false);
    });

    it('Sollte für eine leere Eingabe null liefern', () => {
      expect(adapter.parse('')).toBeNull();
      expect(adapter.parse('   ')).toBeNull();
      expect(adapter.parse(null)).toBeNull();
    });
  });

  describe('deserialize (Werte von außen)', () => {
    it('Sollte ein Datum ohne Zeitzone annehmen', () => {
      expect(adapter.deserialize('2029-05-26')).toEqual(new LuxCalendarDate(2029, 5, 26));
      expect(adapter.deserialize('2029-05-26T00:00')).toEqual(new LuxCalendarDate(2029, 5, 26));
      expect(adapter.deserialize('2029-05-26T00:00:00')).toEqual(new LuxCalendarDate(2029, 5, 26));
    });

    it('Sollte einen LuxCalendarDate unverändert übernehmen', () => {
      const date = new LuxCalendarDate(2029, 5, 26);
      expect(adapter.deserialize(date)).toBe(date);
    });

    it('Sollte andere Formate als ungültigen Wert liefern', () => {
      ['2029-05-26T00:00:00.000Z', '2029-05-25T22:00:00.000Z', '2029-05-26T23:30:00', '26.05.2029', new Date(2029, 4, 26)].forEach(
        (value) => {
          const date = adapter.deserialize(value);
          expect(date, String(value)).not.toBeNull();
          expect(adapter.isValid(date!), String(value)).toBe(false);
        }
      );
    });

    it('Sollte für null und einen leeren String null liefern', () => {
      expect(adapter.deserialize(null)).toBeNull();
      expect(adapter.deserialize('')).toBeNull();
    });
  });

  it('Sollte einen ungültigen Wert erkennen', () => {
    expect(adapter.isValid(adapter.invalid())).toBe(false);
    expect(adapter.isValid(new LuxCalendarDate(2029, 2, 29))).toBe(false);
    expect(adapter.isValid(new LuxCalendarDate(2028, 2, 29))).toBe(true);
    expect(adapter.isDateInstance(new LuxCalendarDate(2029, 5, 26))).toBe(true);
    expect(adapter.isDateInstance(new Date())).toBe(false);
    expect(adapter.isDateInstance('2029-05-26')).toBe(false);
  });
});
