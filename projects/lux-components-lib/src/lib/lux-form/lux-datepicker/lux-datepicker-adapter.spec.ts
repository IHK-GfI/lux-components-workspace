import { TestBed } from '@angular/core/testing';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { LuxUtil } from '../../lux-util/lux-util';
import { LuxDatepickerAdapter } from './lux-datepicker-adapter';

// Zwei Zeitpunkte desselben UTC-Tages (26.05.2029). In jeder Zeitzone außer UTC liegt mindestens einer
// der beiden Zeitpunkte lokal auf einem anderen Tag (östlich von UTC: LATE, westlich von UTC: EARLY).
// Ein Adapter, der mit den lokalen Datumsbestandteilen rechnet, besteht diese Tests daher nur in UTC.
const EARLY = '2029-05-26T00:30:00.000Z';
const LATE = '2029-05-26T23:30:00.000Z';

describe('LuxDatepickerAdapter', () => {
  let adapter: LuxDatepickerAdapter;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LuxDatepickerAdapter, { provide: MAT_DATE_LOCALE, useValue: 'de-DE' }]
    });
    adapter = TestBed.inject(LuxDatepickerAdapter);
  });

  it('Sollte den UTC-Tag anzeigen', () => {
    const displayFormat: Intl.DateTimeFormatOptions = { day: '2-digit', month: '2-digit', year: 'numeric' };

    [EARLY, LATE].forEach((value) => {
      expect(LuxUtil.stringWithoutASCIIChars(adapter.format(new Date(value), displayFormat)), value)
        .toEqual('26.05.2029');
      expect(LuxUtil.stringWithoutASCIIChars(adapter.format(value as any, displayFormat)), value)
        .toEqual('26.05.2029');
    });
  });

  it('Sollte die UTC-Datumsbestandteile liefern', () => {
    [EARLY, LATE].forEach((value) => {
      const date = new Date(value);

      expect(adapter.getYear(date), value).toEqual(2029);
      expect(adapter.getMonth(date), value).toEqual(4);
      expect(adapter.getDate(date), value).toEqual(26);
      // 26.05.2029 ist ein Samstag
      expect(adapter.getDayOfWeek(date), value).toEqual(6);
    });
  });

  it('Sollte zwei Zeitpunkte desselben UTC-Tages als denselben Tag ansehen', () => {
    expect(adapter.sameDate(new Date(EARLY), new Date(LATE))).toBe(true);
    expect(adapter.compareDate(new Date(EARLY), new Date(LATE))).toEqual(0);
  });

  it('Sollte den Namen des UTC-Jahres liefern', () => {
    expect(adapter.getYearName(new Date('2029-01-01T00:30:00.000Z'))).toEqual('2029');
    expect(adapter.getYearName(new Date('2029-12-31T23:30:00.000Z'))).toEqual('2029');
  });

  it('Sollte die Anzahl der Tage des UTC-Monats liefern', () => {
    expect(adapter.getNumDaysInMonth(new Date('2029-02-28T23:30:00.000Z'))).toEqual(28);
    expect(adapter.getNumDaysInMonth(new Date('2029-03-01T00:30:00.000Z'))).toEqual(31);
    expect(adapter.getNumDaysInMonth(new Date('2028-02-29T23:30:00.000Z'))).toEqual(29);
  });

  it('Sollte Tage, Monate und Jahre anhand des UTC-Tages addieren', () => {
    expect(adapter.addCalendarDays(new Date(LATE), 1).toISOString()).toEqual('2029-05-27T00:00:00.000Z');
    expect(adapter.addCalendarDays(new Date(EARLY), -26).toISOString()).toEqual('2029-04-30T00:00:00.000Z');

    // Bei einem Überlauf wird der letzte Tag des Zielmonats verwendet
    expect(adapter.addCalendarMonths(new Date('2029-01-31T23:30:00.000Z'), 1).toISOString()).toEqual('2029-02-28T00:00:00.000Z');
    expect(adapter.addCalendarMonths(new Date('2029-03-31T00:30:00.000Z'), -1).toISOString()).toEqual('2029-02-28T00:00:00.000Z');
    expect(adapter.addCalendarMonths(new Date(LATE), 12).toISOString()).toEqual('2030-05-26T00:00:00.000Z');

    expect(adapter.addCalendarYears(new Date('2028-02-29T23:30:00.000Z'), 1).toISOString()).toEqual('2029-02-28T00:00:00.000Z');
    expect(adapter.addCalendarYears(new Date(EARLY), -1).toISOString()).toEqual('2028-05-26T00:00:00.000Z');
  });

  it('Sollte ein Datum als UTC-Mitternacht erzeugen', () => {
    expect(adapter.createDate(2029, 4, 26).toISOString()).toEqual('2029-05-26T00:00:00.000Z');
  });

  it('Sollte den heutigen Tag der lokalen Zeitzone als UTC-Mitternacht liefern', () => {
    const now = new Date();
    const today = adapter.today();

    expect(today.getUTCFullYear()).toEqual(now.getFullYear());
    expect(today.getUTCMonth()).toEqual(now.getMonth());
    expect(today.getUTCDate()).toEqual(now.getDate());
    expect(today.getUTCHours()).toEqual(0);
    expect(today.getUTCMinutes()).toEqual(0);
  });

  describe('toCalendarDay', () => {
    const expectedDay = '2029-05-26T00:00:00.000Z';

    it('Sollte bei einem Datum ohne Zeitzone oder mit Offset den geschriebenen Tag liefern', () => {
      const values = [
        '2029-05-26', // z.B. java.time.LocalDate
        '26.05.2029',
        '2029-05-26T00:00:00', // z.B. java.time.LocalDateTime
        '2029-05-26T23:30:00',
        '2029-05-26T00:30:00+02:00', // z.B. java.time.OffsetDateTime
        '2029-05-26T23:30:00-05:00'
      ];

      values.forEach((value) => {
        expect(adapter.toCalendarDay(value)?.toISOString(), value).toEqual(expectedDay);
      });
    });

    it('Sollte bei einem UTC-Zeitpunkt oder Date-Objekt genau auf UTC-Mitternacht den UTC-Tag liefern', () => {
      // So speichert der Datepicker selbst
      expect(adapter.toCalendarDay('2029-05-26T00:00:00.000Z')?.toISOString()).toEqual(expectedDay);
      expect(adapter.toCalendarDay(new Date(Date.UTC(2029, 4, 26)))?.toISOString()).toEqual(expectedDay);
    });

    it('Sollte bei einem UTC-Zeitpunkt oder Date-Objekt mit anderer Uhrzeit den lokalen Tag liefern', () => {
      // Lokale Zeitpunkte am 26.05.2029 (z.B. lokale Mitternacht aus new Date(2029, 4, 26).toISOString()).
      // Außerhalb von UTC liegt ihr UTC-Tag teilweise auf dem 25. bzw. 27.05., gemeint ist aber der lokale Tag.
      const localTimes = [new Date(2029, 4, 26), new Date(2029, 4, 26, 0, 30), new Date(2029, 4, 26, 12, 0), new Date(2029, 4, 26, 23, 30)];

      localTimes.forEach((localTime) => {
        // Genau auf UTC-Mitternacht gilt der Wert als UTC-Tag, daher nur Zeitpunkte mit anderer Uhrzeit prüfen
        if (localTime.getUTCHours() === 0 && localTime.getUTCMinutes() === 0) {
          return;
        }
        expect(adapter.toCalendarDay(localTime)?.toISOString(), `Date ${localTime.toString()}`).toEqual(expectedDay);
        expect(adapter.toCalendarDay(localTime.toISOString())?.toISOString(), localTime.toISOString()).toEqual(expectedDay);
      });
    });

    it('Sollte für ungültige Werte null liefern', () => {
      expect(adapter.toCalendarDay('abc')).toBeNull();
      expect(adapter.toCalendarDay('2029-13-01T00:00:00')).toBeNull();
      expect(adapter.toCalendarDay(new Date(NaN))).toBeNull();
      expect(adapter.toCalendarDay(null)).toBeNull();
      expect(adapter.toCalendarDay(42)).toBeNull();
    });
  });

  describe('deserialize', () => {
    it('Sollte ohne Timepicker den gemeinten Kalendertag liefern', () => {
      expect(adapter.deserialize('2029-05-26')!.toISOString()).toEqual('2029-05-26T00:00:00.000Z');
      expect(adapter.deserialize('2029-05-26T23:30:00')!.toISOString()).toEqual('2029-05-26T00:00:00.000Z');
      expect(adapter.deserialize('2029-05-26T00:00:00.000Z')!.toISOString()).toEqual('2029-05-26T00:00:00.000Z');
      expect(adapter.deserialize(new Date(2029, 4, 26, 23, 30))!.toISOString()).toEqual('2029-05-26T00:00:00.000Z');
      expect(adapter.deserialize('')).toBeNull();
      expect(adapter.deserialize(null)).toBeNull();
    });

    it('Sollte mit Timepicker den UTC-Zeitpunkt liefern', () => {
      adapter.combinedWithTimeProvider = () => true;

      expect(adapter.deserialize('2029-05-26T23:30:00')!.toISOString()).toEqual(LATE);
      expect(adapter.deserialize(LATE)!.toISOString()).toEqual(LATE);
    });
  });
});
