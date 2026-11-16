import { afterEach, describe, expect, it, vi } from 'vitest';
import { LuxUtil } from './lux-util';

/**
 * Alle Tage von 1900 bis 2099 als Vergleichswerte, berechnet über Date.UTC und die UTC-Methoden von Date.
 */
function utcDaysSince1900() {
  const start = Date.UTC(1900, 0, 1);
  return Array.from({ length: 200 * 366 }, (_, days) => {
    const date = new Date(start + days * 86_400_000);
    const isoString = date.toISOString();
    return { days, isoString, isoDate: isoString.substring(0, 10), dayOfWeek: date.getUTCDay() };
  });
}

// Die Funktionen arbeiten ohne Date und müssen in jeder Zeitzone dasselbe Ergebnis liefern. Werte "aus Sicht des
// Nutzers" (heute, toLocalDate) werden deshalb mit lokalen Date-Konstruktoren erzeugt.
describe('LuxUtil - Datums- und Zeitwerte ohne Zeitzone', () => {
  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  describe('isLocalDate', () => {
    it('Sollte gültige Daten annehmen', () => {
      expect(LuxUtil.isLocalDate('2029-05-26')).toBe(true);
      expect(LuxUtil.isLocalDate('2029-12-31')).toBe(true);
      expect(LuxUtil.isLocalDate('0001-01-01')).toBe(true);
      expect(LuxUtil.isLocalDate('9999-12-31')).toBe(true);
    });

    it('Sollte den 29.02. nur in Schaltjahren annehmen', () => {
      expect(LuxUtil.isLocalDate('2028-02-29')).toBe(true);
      expect(LuxUtil.isLocalDate('2000-02-29')).toBe(true);
      expect(LuxUtil.isLocalDate('2029-02-29')).toBe(false);
      expect(LuxUtil.isLocalDate('1900-02-29')).toBe(false);
    });

    it('Sollte Mitternacht ohne Zeitzone tolerieren', () => {
      expect(LuxUtil.isLocalDate('2029-05-26T00:00')).toBe(true);
      expect(LuxUtil.isLocalDate('2029-05-26T00:00:00')).toBe(true);
    });

    it('Sollte ungültige Daten ablehnen', () => {
      expect(LuxUtil.isLocalDate('2029-02-31')).toBe(false);
      expect(LuxUtil.isLocalDate('2029-04-31')).toBe(false);
      expect(LuxUtil.isLocalDate('2029-13-01')).toBe(false);
      expect(LuxUtil.isLocalDate('2029-00-10')).toBe(false);
      expect(LuxUtil.isLocalDate('2029-05-00')).toBe(false);
      expect(LuxUtil.isLocalDate('0000-01-01')).toBe(false);
    });

    it('Sollte andere Formate ablehnen', () => {
      [
        '2029-5-26',
        '29-05-26',
        '26.05.2029',
        ' 2029-05-26',
        '2029-05-26T00:00:00.000Z',
        '2029-05-26T00:00:00Z',
        '2029-05-25T22:00:00.000Z',
        '2029-05-26T00:00+01:00',
        '2029-05-26T23:30:00',
        '2029-05-26T00:00:01',
        '2029-05-26T00:00:00.000',
        '2029-05-26t00:00',
        ''
      ].forEach((value) => expect(LuxUtil.isLocalDate(value), value).toBe(false));
    });

    it('Sollte Werte ablehnen, die kein String sind', () => {
      expect(LuxUtil.isLocalDate(null)).toBe(false);
      expect(LuxUtil.isLocalDate(undefined)).toBe(false);
      expect(LuxUtil.isLocalDate(new Date(2029, 4, 26))).toBe(false);
      expect(LuxUtil.isLocalDate(20290526)).toBe(false);
    });
  });

  describe('isLocalTime', () => {
    it('Sollte gültige Uhrzeiten annehmen', () => {
      expect(LuxUtil.isLocalTime('00:00')).toBe(true);
      expect(LuxUtil.isLocalTime('14:30')).toBe(true);
      expect(LuxUtil.isLocalTime('23:59')).toBe(true);
    });

    it('Sollte Sekunden ":00" tolerieren', () => {
      expect(LuxUtil.isLocalTime('14:30:00')).toBe(true);
    });

    it('Sollte ungültige Uhrzeiten und andere Formate ablehnen', () => {
      ['24:00', '14:60', '4:30', '14:30:01', '14:30:00.000', '14.30', '14:30Z', '1970-01-01T14:30:00.000Z', '2029-05-26T14:30', ''].forEach(
        (value) => expect(LuxUtil.isLocalTime(value), value).toBe(false)
      );
      expect(LuxUtil.isLocalTime(null)).toBe(false);
    });
  });

  describe('isLocalDateTime', () => {
    it('Sollte Datum und Uhrzeit annehmen', () => {
      expect(LuxUtil.isLocalDateTime('2029-05-26T14:30')).toBe(true);
      expect(LuxUtil.isLocalDateTime('2029-05-26T00:00')).toBe(true);
      expect(LuxUtil.isLocalDateTime('2028-02-29T23:59')).toBe(true);
    });

    it('Sollte Sekunden ":00" tolerieren', () => {
      expect(LuxUtil.isLocalDateTime('2029-05-26T14:30:00')).toBe(true);
    });

    it('Sollte ungültige Werte und andere Formate ablehnen', () => {
      [
        '2029-05-26',
        '2029-05-26T24:00',
        '2029-02-29T10:00',
        '2029-05-26T14:30:15',
        '2029-05-26T14:30:00.000Z',
        '2029-05-26T14:30+02:00',
        '2029-05-26 14:30',
        '14:30'
      ].forEach((value) => expect(LuxUtil.isLocalDateTime(value), value).toBe(false));
      expect(LuxUtil.isLocalDateTime(undefined)).toBe(false);
    });
  });

  describe('todayAsLocalDate', () => {
    it('Sollte kurz nach Mitternacht den heutigen Tag liefern', () => {
      vi.useFakeTimers();
      vi.setSystemTime(new Date(2029, 4, 26, 0, 0, 1));

      expect(LuxUtil.todayAsLocalDate()).toEqual('2029-05-26');
    });

    it('Sollte kurz vor Mitternacht den heutigen Tag liefern', () => {
      vi.useFakeTimers();
      vi.setSystemTime(new Date(2029, 4, 26, 23, 59, 59));

      expect(LuxUtil.todayAsLocalDate()).toEqual('2029-05-26');
    });

    it('Sollte am Jahresende den richtigen Tag liefern', () => {
      vi.useFakeTimers();
      vi.setSystemTime(new Date(2029, 11, 31, 23, 59, 59));

      expect(LuxUtil.todayAsLocalDate()).toEqual('2029-12-31');
    });
  });

  describe('toLocalDate', () => {
    it('Sollte den lokalen Tag liefern', () => {
      expect(LuxUtil.toLocalDate(new Date(2029, 4, 26))).toEqual('2029-05-26');
      expect(LuxUtil.toLocalDate(new Date(2029, 4, 26, 23, 59, 59))).toEqual('2029-05-26');
      expect(LuxUtil.toLocalDate(new Date(2028, 1, 29, 12, 0))).toEqual('2028-02-29');
    });

    it('Sollte an den Tagen der Zeitumstellung den lokalen Tag liefern', () => {
      expect(LuxUtil.toLocalDate(new Date(2027, 2, 28, 0, 30))).toEqual('2027-03-28');
      expect(LuxUtil.toLocalDate(new Date(2027, 2, 28, 3, 0))).toEqual('2027-03-28');
      expect(LuxUtil.toLocalDate(new Date(2027, 9, 31, 2, 30))).toEqual('2027-10-31');
      expect(LuxUtil.toLocalDate(new Date(2027, 9, 31, 23, 59))).toEqual('2027-10-31');
    });

    it('Sollte Jahre unter 1000 vierstellig ausgeben', () => {
      const date = new Date(2029, 0, 1);
      date.setFullYear(99, 0, 1);

      expect(LuxUtil.toLocalDate(date)).toEqual('0099-01-01');
    });

    it('Sollte für null, undefined und ein ungültiges Date null liefern', () => {
      expect(LuxUtil.toLocalDate(null)).toBeNull();
      expect(LuxUtil.toLocalDate(undefined)).toBeNull();
      expect(LuxUtil.toLocalDate(new Date(NaN))).toBeNull();
    });
  });

  describe('toLocalTime', () => {
    it('Sollte die lokale Uhrzeit ohne Sekunden liefern', () => {
      expect(LuxUtil.toLocalTime(new Date(2029, 4, 26))).toEqual('00:00');
      expect(LuxUtil.toLocalTime(new Date(2029, 4, 26, 9, 5))).toEqual('09:05');
      expect(LuxUtil.toLocalTime(new Date(2029, 4, 26, 23, 59, 59, 999))).toEqual('23:59');
    });

    it('Sollte für null, undefined und ein ungültiges Date null liefern', () => {
      expect(LuxUtil.toLocalTime(null)).toBeNull();
      expect(LuxUtil.toLocalTime(undefined)).toBeNull();
      expect(LuxUtil.toLocalTime(new Date(NaN))).toBeNull();
    });
  });

  describe('toLocalDateTime', () => {
    it('Sollte Datum und Uhrzeit aus Sicht des Nutzers ohne Sekunden liefern', () => {
      expect(LuxUtil.toLocalDateTime(new Date(2029, 4, 26, 14, 30))).toEqual('2029-05-26T14:30');
      expect(LuxUtil.toLocalDateTime(new Date(2029, 4, 26, 14, 30, 59))).toEqual('2029-05-26T14:30');
      expect(LuxUtil.toLocalDateTime(new Date(2029, 11, 31, 23, 59))).toEqual('2029-12-31T23:59');
      expect(LuxUtil.toLocalDateTime(new Date(2028, 1, 29))).toEqual('2028-02-29T00:00');
    });

    it('Sollte einen Zeitpunkt in die Zeitzone des Nutzers umrechnen', () => {
      // Erwartet wird die lokale Uhrzeit, nicht die UTC-Uhrzeit wie bei fromV21DateTime()
      for (const instant of ['2029-05-26T12:30:00Z', '2029-12-31T23:30:00.000Z', '2027-03-28T01:30:00Z', '2027-10-31T00:30:00Z']) {
        const date = new Date(instant);
        const termin = LuxUtil.toLocalDateTime(date);

        expect(termin, instant).toEqual(`${LuxUtil.toLocalDate(date)}T${LuxUtil.toLocalTime(date)}`);
        expect(LuxUtil.isLocalDateTime(termin), instant).toBe(true);
        expect(new Date(termin!).toISOString(), instant).toEqual(new Date(instant).toISOString());
      }
    });

    it('Sollte für null, undefined und ein ungültiges Date null liefern', () => {
      expect(LuxUtil.toLocalDateTime(null)).toBeNull();
      expect(LuxUtil.toLocalDateTime(undefined)).toBeNull();
      expect(LuxUtil.toLocalDateTime(new Date(NaN))).toBeNull();
    });
  });

  describe('addDays', () => {
    it('Sollte über Monats- und Jahreswechsel rechnen', () => {
      expect(LuxUtil.addDays('2029-05-26', 1)).toEqual('2029-05-27');
      expect(LuxUtil.addDays('2029-05-31', 1)).toEqual('2029-06-01');
      expect(LuxUtil.addDays('2029-12-31', 1)).toEqual('2030-01-01');
      expect(LuxUtil.addDays('2030-01-01', -1)).toEqual('2029-12-31');
      expect(LuxUtil.addDays('2029-05-26', 0)).toEqual('2029-05-26');
    });

    it('Sollte den 29.02. nur in Schaltjahren berücksichtigen', () => {
      expect(LuxUtil.addDays('2028-02-28', 1)).toEqual('2028-02-29');
      expect(LuxUtil.addDays('2029-02-28', 1)).toEqual('2029-03-01');
      expect(LuxUtil.addDays('2028-03-01', -1)).toEqual('2028-02-29');
      expect(LuxUtil.addDays('2028-02-29', 365)).toEqual('2029-02-28');
    });

    it('Sollte über die Tage der Zeitumstellung rechnen', () => {
      expect(LuxUtil.addDays('2027-03-27', 1)).toEqual('2027-03-28');
      expect(LuxUtil.addDays('2027-03-28', 1)).toEqual('2027-03-29');
      expect(LuxUtil.addDays('2027-10-30', 1)).toEqual('2027-10-31');
      expect(LuxUtil.addDays('2027-10-31', 1)).toEqual('2027-11-01');
    });

    it('Sollte die Toleranz annehmen und "yyyy-MM-dd" ausgeben', () => {
      expect(LuxUtil.addDays('2029-05-26T00:00:00', 1)).toEqual('2029-05-27');
    });

    it('Sollte für null und undefined null liefern', () => {
      expect(LuxUtil.addDays(null, 1)).toBeNull();
      expect(LuxUtil.addDays(undefined, 1)).toBeNull();
    });

    it('Sollte bei einem ungültigen Datum oder einer Kommazahl einen Fehler werfen', () => {
      expect(() => LuxUtil.addDays('2029-02-30', 1)).toThrowError(/Erwartet 'yyyy-MM-dd', erhalten '2029-02-30'/);
      expect(() => LuxUtil.addDays('2029-05-26T00:00:00.000Z', 1)).toThrowError(/Erwartet 'yyyy-MM-dd'/);
      expect(() => LuxUtil.addDays('2029-05-26', 1.5)).toThrowError(/Erwartet eine ganze Zahl/);
    });

    it('Sollte über 200 Jahre mit Date.UTC übereinstimmen', () => {
      // Abweichungen sammeln statt je Tag ein expect(), sonst dauert der Test in langsamen Umgebungen zu lange
      const mismatches = utcDaysSince1900().filter(({ days, isoDate }) => LuxUtil.addDays('1900-01-01', days) !== isoDate);

      expect(mismatches).toEqual([]);
    });
  });

  describe('compareLocalDates', () => {
    it('Sollte zwei Daten vergleichen', () => {
      expect(LuxUtil.compareLocalDates('2029-05-26', '2029-05-27')).toBeLessThan(0);
      expect(LuxUtil.compareLocalDates('2029-05-26', '2029-05-26')).toEqual(0);
      expect(LuxUtil.compareLocalDates('2030-01-01', '2029-12-31')).toBeGreaterThan(0);
      expect(LuxUtil.compareLocalDates('2029-06-01', '2029-05-31')).toBeGreaterThan(0);
    });

    it('Sollte die Toleranz wie den gleichen Tag behandeln', () => {
      expect(LuxUtil.compareLocalDates('2029-05-26T00:00:00', '2029-05-26')).toEqual(0);
    });

    it('Sollte bei ungültigen Werten und null einen Fehler werfen', () => {
      expect(() => LuxUtil.compareLocalDates('2029-05-26', '26.05.2029')).toThrowError(/compareLocalDates/);
      expect(() => LuxUtil.compareLocalDates(null as any, '2029-05-26')).toThrowError(/compareLocalDates/);
    });
  });

  describe('getDayOfWeek', () => {
    it('Sollte den Wochentag liefern (0 = Sonntag bis 6 = Samstag)', () => {
      expect(LuxUtil.getDayOfWeek('1970-01-01')).toEqual(4);
      expect(LuxUtil.getDayOfWeek('2000-01-01')).toEqual(6);
      expect(LuxUtil.getDayOfWeek('2027-03-28')).toEqual(0);
      expect(LuxUtil.getDayOfWeek('2027-10-31')).toEqual(0);
      expect(LuxUtil.getDayOfWeek('2028-02-29')).toEqual(2);
    });

    it('Sollte sich für einen Wochenend-Filter eignen', () => {
      const weekdaysOnly = (date: string) => ![0, 6].includes(LuxUtil.getDayOfWeek(date)!);
      const week = ['2029-05-21', '2029-05-22', '2029-05-23', '2029-05-24', '2029-05-25', '2029-05-26', '2029-05-27'];

      expect(week.filter(weekdaysOnly)).toEqual(['2029-05-21', '2029-05-22', '2029-05-23', '2029-05-24', '2029-05-25']);
    });

    it('Sollte über 200 Jahre mit Date.getUTCDay() übereinstimmen', () => {
      const mismatches = utcDaysSince1900().filter(({ isoDate, dayOfWeek }) => LuxUtil.getDayOfWeek(isoDate) !== dayOfWeek);

      expect(mismatches).toEqual([]);
    });

    it('Sollte für null null liefern und bei einem ungültigen Datum einen Fehler werfen', () => {
      expect(LuxUtil.getDayOfWeek(null)).toBeNull();
      expect(() => LuxUtil.getDayOfWeek('2029-02-29')).toThrowError(/getDayOfWeek/);
    });
  });

  describe('combineDateTime und splitDateTime', () => {
    it('Sollte Datum und Uhrzeit zusammenführen', () => {
      expect(LuxUtil.combineDateTime('2029-05-26', '14:30')).toEqual('2029-05-26T14:30');
      expect(LuxUtil.combineDateTime('2029-05-26T00:00:00', '14:30:00')).toEqual('2029-05-26T14:30');
    });

    it('Sollte null liefern, wenn Datum oder Uhrzeit fehlt', () => {
      expect(LuxUtil.combineDateTime(null, '14:30')).toBeNull();
      expect(LuxUtil.combineDateTime('2029-05-26', undefined)).toBeNull();
    });

    it('Sollte beim Zusammenführen ungültiger Werte einen Fehler werfen', () => {
      expect(() => LuxUtil.combineDateTime('2029-05-26', '24:00')).toThrowError(/Erwartet 'HH:mm', erhalten '24:00'/);
      expect(() => LuxUtil.combineDateTime('2029-02-29', '14:30')).toThrowError(/Erwartet 'yyyy-MM-dd'/);
    });

    it('Sollte Datum und Uhrzeit trennen', () => {
      expect(LuxUtil.splitDateTime('2029-05-26T14:30')).toEqual({ date: '2029-05-26', time: '14:30' });
      expect(LuxUtil.splitDateTime('2029-05-26T14:30:00')).toEqual({ date: '2029-05-26', time: '14:30' });
      expect(LuxUtil.splitDateTime(null)).toBeNull();
    });

    it('Sollte beim Trennen ungültiger Werte einen Fehler werfen', () => {
      expect(() => LuxUtil.splitDateTime('2029-05-26')).toThrowError(/Erwartet 'yyyy-MM-ddTHH:mm'/);
      expect(() => LuxUtil.splitDateTime('2029-05-26T14:30:00.000Z')).toThrowError(/splitDateTime/);
    });
  });

  describe('Umrechnung vom v21-Format', () => {
    it('Sollte UTC-Mitternacht in den UTC-Tag umrechnen', () => {
      expect(LuxUtil.fromV21Date('2029-05-26T00:00:00.000Z')).toEqual('2029-05-26');
      expect(LuxUtil.fromV21Date('2029-12-31T00:00:00.000Z')).toEqual('2029-12-31');
      expect(LuxUtil.fromV21Date('2028-02-29T00:00:00.000Z')).toEqual('2028-02-29');
      expect(LuxUtil.fromV21Date('2027-03-28T00:00:00.000Z')).toEqual('2027-03-28');
      expect(LuxUtil.fromV21Date('2027-10-31T00:00:00.000Z')).toEqual('2027-10-31');
    });

    it('Sollte Millisekunden optional annehmen (z.B. Java Instant)', () => {
      expect(LuxUtil.fromV21Date('2029-05-26T00:00:00Z')).toEqual('2029-05-26');
      expect(LuxUtil.fromV21Date('2029-05-26T00:00:00.0Z')).toEqual('2029-05-26');
    });

    it('Sollte die UTC-Uhrzeit umrechnen und den Datumsteil ignorieren', () => {
      expect(LuxUtil.fromV21Time('1970-01-01T14:30:00.000Z')).toEqual('14:30');
      expect(LuxUtil.fromV21Time('1970-01-01T00:00:00Z')).toEqual('00:00');
      expect(LuxUtil.fromV21Time('1970-01-01T23:59:00.000Z')).toEqual('23:59');
      expect(LuxUtil.fromV21Time('2026-06-18T14:30:00.000Z')).toEqual('14:30');
    });

    it('Sollte Datum und Uhrzeit aus den UTC-Werten umrechnen', () => {
      expect(LuxUtil.fromV21DateTime('2029-05-26T14:30:00.000Z')).toEqual('2029-05-26T14:30');
      expect(LuxUtil.fromV21DateTime('2029-05-26T00:00:00Z')).toEqual('2029-05-26T00:00');
      expect(LuxUtil.fromV21DateTime('2029-12-31T23:59:00.000Z')).toEqual('2029-12-31T23:59');
    });

    it('Sollte null, undefined und "" in null umrechnen', () => {
      [LuxUtil.fromV21Date, LuxUtil.fromV21Time, LuxUtil.fromV21DateTime].forEach((convert) => {
        expect(convert(null)).toBeNull();
        expect(convert(undefined)).toBeNull();
        expect(convert('')).toBeNull();
      });
    });

    it('Sollte unpassende Datumswerte unverändert durchreichen und warnen', () => {
      const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
      [
        '2029-05-25T22:00:00.000Z',
        '2029-05-26T00:00:00.001Z',
        '2029-05-26T00:00:00+00:00',
        '2029-05-26T00:00:00.000z',
        '2029-05-26T00:00:00',
        '2029-05-26',
        '2029-02-29T00:00:00.000Z',
        '2020-05-28T14:15:00.000Z'
      ].forEach((value) => expect(LuxUtil.fromV21Date(value), value).toEqual(value));

      expect(warn).toHaveBeenCalledTimes(8);
      expect(warn).toHaveBeenCalledWith(
        "LuxUtil.fromV21Date(): Erwartet 'yyyy-MM-ddT00:00:00.000Z', erhalten '2029-05-25T22:00:00.000Z'. " +
          'Der Wert wird unverändert zurückgegeben (siehe Update-Guide v22).'
      );
    });

    it('Sollte Uhrzeiten mit Sekunden ungleich 00 unverändert durchreichen', () => {
      const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);

      expect(LuxUtil.fromV21Time('1970-01-01T14:30:15.000Z')).toEqual('1970-01-01T14:30:15.000Z');
      expect(LuxUtil.fromV21Time('1970-01-01T14:30:00.500Z')).toEqual('1970-01-01T14:30:00.500Z');
      expect(LuxUtil.fromV21Time('14:30')).toEqual('14:30');
      expect(LuxUtil.fromV21DateTime('2029-05-26T14:30:15.000Z')).toEqual('2029-05-26T14:30:15.000Z');
      expect(warn).toHaveBeenCalledTimes(4);
    });
  });

  describe('Umrechnung in das v21-Format', () => {
    it('Sollte ein Datum in UTC-Mitternacht umrechnen', () => {
      expect(LuxUtil.toV21Date('2029-05-26')).toEqual('2029-05-26T00:00:00.000Z');
      expect(LuxUtil.toV21Date('2028-02-29')).toEqual('2028-02-29T00:00:00.000Z');
      expect(LuxUtil.toV21Date('2029-05-26T00:00:00')).toEqual('2029-05-26T00:00:00.000Z');
    });

    it('Sollte eine Uhrzeit mit dem Datum 1970-01-01 umrechnen', () => {
      expect(LuxUtil.toV21Time('14:30')).toEqual('1970-01-01T14:30:00.000Z');
      expect(LuxUtil.toV21Time('14:30:00')).toEqual('1970-01-01T14:30:00.000Z');
      expect(LuxUtil.toV21Time('00:00')).toEqual('1970-01-01T00:00:00.000Z');
    });

    it('Sollte Datum und Uhrzeit umrechnen', () => {
      expect(LuxUtil.toV21DateTime('2029-05-26T14:30')).toEqual('2029-05-26T14:30:00.000Z');
      expect(LuxUtil.toV21DateTime('2029-12-31T23:59:00')).toEqual('2029-12-31T23:59:00.000Z');
    });

    it('Sollte dasselbe Ergebnis wie toISOString() eines UTC-Datums liefern', () => {
      const mismatches = utcDaysSince1900().filter(({ isoDate, isoString }) => LuxUtil.toV21Date(isoDate) !== isoString);

      expect(mismatches).toEqual([]);
    });

    it('Sollte unpassende Werte unverändert durchreichen und warnen', () => {
      const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);

      expect(LuxUtil.toV21Date('2029-02-29')).toEqual('2029-02-29');
      expect(LuxUtil.toV21Date('2029-05-26T00:00:00.000Z')).toEqual('2029-05-26T00:00:00.000Z');
      expect(LuxUtil.toV21Time('24:00')).toEqual('24:00');
      expect(LuxUtil.toV21DateTime('2029-05-26')).toEqual('2029-05-26');
      expect(warn).toHaveBeenCalledTimes(4);
      expect(warn).toHaveBeenCalledWith(
        "LuxUtil.toV21Time(): Erwartet 'HH:mm', erhalten '24:00'. Der Wert wird unverändert zurückgegeben (siehe Update-Guide v22)."
      );
    });

    it('Sollte in beiden Richtungen verlustfrei umrechnen', () => {
      ['2029-05-26', '2028-02-29', '2027-03-28', '2027-10-31', '2029-12-31'].forEach((date) =>
        expect(LuxUtil.fromV21Date(LuxUtil.toV21Date(date))).toEqual(date)
      );
      ['00:00', '14:30', '23:59'].forEach((time) => expect(LuxUtil.fromV21Time(LuxUtil.toV21Time(time))).toEqual(time));
      ['2029-05-26T14:30', '2027-03-28T02:30', '2027-10-31T02:30'].forEach((dateTime) =>
        expect(LuxUtil.fromV21DateTime(LuxUtil.toV21DateTime(dateTime))).toEqual(dateTime)
      );
    });
  });
});
