import { Injectable, inject } from '@angular/core';
import { DateAdapter, MAT_DATE_LOCALE } from '@angular/material/core';
import { LuxLocalTime, formatLocalTime, parseLocalTime } from '../../lux-util/lux-local-date';
import DateTimeFormatOptions = Intl.DateTimeFormatOptions;

/**
 * Eine Uhrzeit ohne Zeitzone und ohne Sekunden, der Werttyp des LuxTimepickerAdapter.
 */
export class LuxClockTime implements LuxLocalTime {
  constructor(
    readonly hour: number,
    readonly minute: number
  ) {}

  static of(time: LuxLocalTime): LuxClockTime {
    return new LuxClockTime(time.hour, time.minute);
  }
}

// Wie NativeDateAdapter.parseTime(): "14:30", "14.30", "2:30 PM" usw.
const TIME_INPUT_REGEXP = /^(\d?\d)[:.](\d?\d)(?:[:.](\d?\d))?\s*(AM|PM)?$/i;

const SECONDS_PER_DAY = 24 * 60 * 60;

/**
 * DateAdapter der LuxTimepickerComponent für Uhrzeiten ohne Zeitzone.
 *
 * MatTimepicker erwartet einen DateAdapter, obwohl er nur mit Uhrzeiten arbeitet. Die Methoden für Tage
 * liefern deshalb feste Werte, alle Uhrzeiten liegen auf demselben Tag. Ein Überlauf über Mitternacht
 * (addSeconds) ergibt einen ungültigen Wert, damit MatTimepicker die Liste der Optionen dort beendet.
 */
@Injectable()
export class LuxTimepickerAdapter extends DateAdapter<LuxClockTime, string> {
  constructor() {
    super();
    this.setLocale(inject<string | null>(MAT_DATE_LOCALE, { optional: true }) ?? 'de-DE');
  }

  getYear(): number {
    return 1970;
  }

  getMonth(): number {
    return 0;
  }

  getDate(): number {
    return 1;
  }

  getDayOfWeek(): number {
    // Der 01.01.1970 war ein Donnerstag
    return 4;
  }

  getMonthNames(): string[] {
    return [];
  }

  getDateNames(): string[] {
    return [];
  }

  getDayOfWeekNames(): string[] {
    return [];
  }

  getYearName(): string {
    return '1970';
  }

  getFirstDayOfWeek(): number {
    return 1;
  }

  getNumDaysInMonth(): number {
    return 31;
  }

  clone(time: LuxClockTime): LuxClockTime {
    return new LuxClockTime(time.hour, time.minute);
  }

  createDate(): LuxClockTime {
    return this.today();
  }

  today(): LuxClockTime {
    return new LuxClockTime(0, 0);
  }

  parse(value: unknown): LuxClockTime | null {
    return this.parseTime(value);
  }

  format(time: LuxClockTime, displayFormat: DateTimeFormatOptions): string {
    if (!this.isValid(time)) {
      throw Error('LuxTimepickerAdapter: Eine ungültige Uhrzeit kann nicht formatiert werden.');
    }

    return new Intl.DateTimeFormat(this.locale, { ...displayFormat, timeZone: 'UTC' }).format(
      new Date(Date.UTC(1970, 0, 1, time.hour, time.minute))
    );
  }

  addCalendarYears(time: LuxClockTime): LuxClockTime {
    return this.clone(time);
  }

  addCalendarMonths(time: LuxClockTime): LuxClockTime {
    return this.clone(time);
  }

  addCalendarDays(time: LuxClockTime): LuxClockTime {
    return this.clone(time);
  }

  toIso8601(time: LuxClockTime): string {
    return formatLocalTime(time);
  }

  /**
   * Wird von Material für Werte von außen verwendet (u.a. writeValue).
   * Angenommen werden eine LuxClockTime und eine Uhrzeit ohne Zeitzone ("HH:mm", siehe LuxUtil.isLocalTime).
   */
  override deserialize(value: unknown): LuxClockTime | null {
    if (value == null || value === '') {
      return null;
    }

    if (this.isDateInstance(value)) {
      return value;
    }

    const time = parseLocalTime(value);
    return time ? LuxClockTime.of(time) : this.invalid();
  }

  isDateInstance(obj: unknown): obj is LuxClockTime {
    return obj instanceof LuxClockTime;
  }

  isValid(time: LuxClockTime): boolean {
    return (
      Number.isInteger(time.hour) &&
      Number.isInteger(time.minute) &&
      time.hour >= 0 &&
      time.hour <= 23 &&
      time.minute >= 0 &&
      time.minute <= 59
    );
  }

  invalid(): LuxClockTime {
    return new LuxClockTime(NaN, NaN);
  }

  override setTime(_target: LuxClockTime, hours: number, minutes: number): LuxClockTime {
    return new LuxClockTime(hours, minutes);
  }

  override getHours(time: LuxClockTime): number {
    return time.hour;
  }

  override getMinutes(time: LuxClockTime): number {
    return time.minute;
  }

  override getSeconds(): number {
    return 0;
  }

  /**
   * Liest die Texteingabe wie NativeDateAdapter.parseTime(). Sekunden sind nur als ":00" erlaubt,
   * weil der Timepicker keine Sekunden speichert.
   * @returns die Uhrzeit, null bei einer leeren Eingabe oder einen ungültigen Wert (siehe invalid()).
   */
  override parseTime(value: unknown): LuxClockTime | null {
    if (value == null) {
      return null;
    }

    if (this.isDateInstance(value)) {
      return value;
    }

    if (typeof value !== 'string') {
      return this.invalid();
    }

    const text = value.trim();
    if (text === '') {
      return null;
    }

    let result = this.parseTimeText(text);
    if (!result) {
      // Wie NativeDateAdapter: Zusätze wie "Uhr" entfernen und erneut versuchen
      const withoutExtras = text.replace(/[^0-9:(AM|PM)]/gi, '').trim();
      result = withoutExtras ? this.parseTimeText(withoutExtras) : null;
    }

    return result ?? this.invalid();
  }

  /**
   * Addiert Sekunden. Über Mitternacht hinaus (oder davor) ergibt sich ein ungültiger Wert.
   */
  override addSeconds(time: LuxClockTime, amount: number): LuxClockTime {
    const seconds = time.hour * 3600 + time.minute * 60 + amount;
    if (seconds < 0 || seconds >= SECONDS_PER_DAY) {
      return this.invalid();
    }

    return new LuxClockTime(Math.floor(seconds / 3600), Math.floor((seconds % 3600) / 60));
  }

  private parseTimeText(text: string): LuxClockTime | null {
    const match = TIME_INPUT_REGEXP.exec(text.toUpperCase());
    if (!match) {
      return null;
    }

    let hour = +match[1];
    const minute = +match[2];
    const second = match[3] == null ? 0 : +match[3];
    const amPm = match[4];

    if (hour === 12) {
      hour = amPm === 'AM' ? 0 : hour;
    } else if (amPm === 'PM') {
      hour += 12;
    }

    const time = new LuxClockTime(hour, minute);
    return second === 0 && this.isValid(time) ? time : null;
  }
}
