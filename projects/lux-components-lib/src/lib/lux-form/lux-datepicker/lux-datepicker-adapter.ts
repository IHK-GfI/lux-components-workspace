import { getLocaleFirstDayOfWeek } from '@angular/common';
import { Injectable, inject } from '@angular/core';
import { DateAdapter, MAT_DATE_LOCALE } from '@angular/material/core';
import {
  LuxLocalDate,
  addDaysToLocalDate,
  dayOfWeekOf,
  formatLocalDate,
  getDaysInMonth,
  localDateOf,
  parseLocalDate
} from '../../lux-util/lux-local-date';
import DateTimeFormatOptions = Intl.DateTimeFormatOptions;

/**
 * Ein Kalendertag ohne Zeitzone, der Werttyp des LuxDatepickerAdapter.
 * Der Monat zählt von 1 bis 12 (wie Temporal), Angular Material zählt dagegen von 0 bis 11.
 */
export class LuxCalendarDate implements LuxLocalDate {
  constructor(
    readonly year: number,
    readonly month: number,
    readonly day: number
  ) {}

  static of(date: LuxLocalDate): LuxCalendarDate {
    return new LuxCalendarDate(date.year, date.month, date.day);
  }
}

type LuxDatePart = 'day' | 'month' | 'year';

// Tag und Monat 1- oder 2-stellig, das Jahr genau 4-stellig, getrennt durch ".", "/", "-" oder ein Leerzeichen
const DATE_INPUT_REGEXP = /^(\d{1,4})[./\-\s](\d{1,4})[./\-\s](\d{1,4})$/;

// Ohne Trenner nur mit genau 8 Ziffern, sonst wäre die Eingabe mehrdeutig (z.B. "1122029")
const DATE_INPUT_WITHOUT_SEPARATOR_REGEXP = /^\d{8}$/;

/**
 * DateAdapter der LuxDatepickerComponent für Kalendertage ohne Zeitzone.
 *
 * Gerechnet wird ohne JavaScript-Date (siehe lux-local-date.ts), deshalb gibt es keinen Tagesversatz je nach
 * Zeitzone und keine Fehler an den Tagen der Zeitumstellung. Nur für die Ausgabe über Intl wird ein Date auf
 * UTC-Mitternacht erzeugt und in UTC formatiert.
 *
 * Die Texteingabe wird nach der Reihenfolge von Tag, Monat und Jahr der aktiven Locale gelesen
 * (de: dd.MM.yyyy, en-US: MM/dd/yyyy, en-GB: dd/MM/yyyy).
 */
@Injectable()
export class LuxDatepickerAdapter extends DateAdapter<LuxCalendarDate, string> {
  private datePartOrder?: { locale: string; order: LuxDatePart[] };

  constructor() {
    super();
    this.setLocale(inject<string | null>(MAT_DATE_LOCALE, { optional: true }) ?? 'de-DE');
  }

  getYear(date: LuxCalendarDate): number {
    return date.year;
  }

  getMonth(date: LuxCalendarDate): number {
    return date.month - 1;
  }

  getDate(date: LuxCalendarDate): number {
    return date.day;
  }

  getDayOfWeek(date: LuxCalendarDate): number {
    return dayOfWeekOf(date);
  }

  getMonthNames(style: 'long' | 'short' | 'narrow'): string[] {
    const dtf = new Intl.DateTimeFormat(this.locale, { month: style, timeZone: 'UTC' });
    return Array.from({ length: 12 }, (_, month) => dtf.format(toUtcDate(2017, month + 1, 1)));
  }

  getDateNames(): string[] {
    const dtf = new Intl.DateTimeFormat(this.locale, { day: 'numeric', timeZone: 'UTC' });
    return Array.from({ length: 31 }, (_, day) => dtf.format(toUtcDate(2017, 1, day + 1)));
  }

  // Damit werden zwei Buchstaben für den Wochentag angezeigt (Mo, Di, Mi, ...)
  getDayOfWeekNames(): string[] {
    const dtf = new Intl.DateTimeFormat(this.locale, { weekday: 'short', timeZone: 'UTC' });
    // Der 01.01.2017 war ein Sonntag
    return Array.from({ length: 7 }, (_, day) => dtf.format(toUtcDate(2017, 1, day + 1)));
  }

  getYearName(date: LuxCalendarDate): string {
    return this.format(date, { year: 'numeric' });
  }

  getFirstDayOfWeek(): number {
    try {
      return getLocaleFirstDayOfWeek(this.locale);
    } catch {
      // Wie NativeDateAdapter, wenn für die Locale keine Angular-Locale-Daten registriert sind
      const locale = new Intl.Locale(this.locale) as Intl.Locale & {
        getWeekInfo?: () => { firstDay: number };
        weekInfo?: { firstDay: number };
      };
      const firstDay = (locale.getWeekInfo?.() ?? locale.weekInfo)?.firstDay ?? 0;
      return firstDay === 7 ? 0 : firstDay;
    }
  }

  getNumDaysInMonth(date: LuxCalendarDate): number {
    return getDaysInMonth(date.year, date.month);
  }

  clone(date: LuxCalendarDate): LuxCalendarDate {
    return new LuxCalendarDate(date.year, date.month, date.day);
  }

  createDate(year: number, month: number, date: number): LuxCalendarDate {
    return new LuxCalendarDate(year, month + 1, date);
  }

  today(): LuxCalendarDate {
    return LuxCalendarDate.of(localDateOf(new Date()));
  }

  /**
   * Liest die Texteingabe nach der Reihenfolge der aktiven Locale.
   * @returns den Tag, null bei einer leeren Eingabe oder einen ungültigen Wert (siehe invalid()).
   */
  parse(value: unknown): LuxCalendarDate | null {
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

    return this.parseText(text) ?? this.invalid();
  }

  format(date: LuxCalendarDate, displayFormat: DateTimeFormatOptions): string {
    if (!this.isValid(date)) {
      throw Error('LuxDatepickerAdapter: Ein ungültiges Datum kann nicht formatiert werden.');
    }

    return new Intl.DateTimeFormat(this.locale, { ...displayFormat, timeZone: 'UTC' }).format(toUtcDate(date.year, date.month, date.day));
  }

  addCalendarYears(date: LuxCalendarDate, years: number): LuxCalendarDate {
    return this.addCalendarMonths(date, years * 12);
  }

  addCalendarMonths(date: LuxCalendarDate, months: number): LuxCalendarDate {
    const monthIndex = date.year * 12 + date.month - 1 + months;
    const year = Math.floor(monthIndex / 12);
    const month = monthIndex - year * 12 + 1;

    // Bei einem Überlauf (z.B. 31.01. + 1 Monat) wird der letzte Tag des Zielmonats verwendet
    return new LuxCalendarDate(year, month, Math.min(date.day, getDaysInMonth(year, month)));
  }

  addCalendarDays(date: LuxCalendarDate, days: number): LuxCalendarDate {
    return LuxCalendarDate.of(addDaysToLocalDate(date, days));
  }

  toIso8601(date: LuxCalendarDate): string {
    return formatLocalDate(date);
  }

  /**
   * Wird von Material für Werte von außen verwendet (u.a. writeValue, min, max, startAt).
   * Angenommen werden ein LuxCalendarDate und ein Datum ohne Zeitzone ("yyyy-MM-dd", siehe LuxUtil.isLocalDate).
   */
  override deserialize(value: unknown): LuxCalendarDate | null {
    if (value == null || value === '') {
      return null;
    }

    if (this.isDateInstance(value)) {
      return value;
    }

    const date = parseLocalDate(value);
    return date ? LuxCalendarDate.of(date) : this.invalid();
  }

  isDateInstance(obj: unknown): obj is LuxCalendarDate {
    return obj instanceof LuxCalendarDate;
  }

  isValid(date: LuxCalendarDate): boolean {
    return (
      Number.isInteger(date.year) &&
      date.year >= 1 &&
      date.month >= 1 &&
      date.month <= 12 &&
      date.day >= 1 &&
      date.day <= getDaysInMonth(date.year, date.month)
    );
  }

  invalid(): LuxCalendarDate {
    return new LuxCalendarDate(NaN, NaN, NaN);
  }

  private parseText(text: string): LuxCalendarDate | null {
    const order = this.getDatePartOrder();
    let parts: string[];

    if (DATE_INPUT_WITHOUT_SEPARATOR_REGEXP.test(text)) {
      parts = [];
      let index = 0;
      for (const part of order) {
        const length = part === 'year' ? 4 : 2;
        parts.push(text.substring(index, index + length));
        index += length;
      }
    } else {
      const match = DATE_INPUT_REGEXP.exec(text);
      if (!match) {
        return null;
      }
      parts = [match[1], match[2], match[3]];
    }

    const values: Partial<Record<LuxDatePart, string>> = {};
    order.forEach((part, index) => (values[part] = parts[index]));

    if (values.year?.length !== 4 || values.month!.length > 2 || values.day!.length > 2) {
      return null;
    }

    const date = new LuxCalendarDate(+values.year, +values.month!, +values.day!);
    return this.isValid(date) ? date : null;
  }

  /**
   * Die Reihenfolge von Tag, Monat und Jahr in der aktiven Locale, z.B. ['day', 'month', 'year'] für "de-DE".
   */
  private getDatePartOrder(): LuxDatePart[] {
    if (this.datePartOrder?.locale !== this.locale) {
      const order = new Intl.DateTimeFormat(this.locale, { day: '2-digit', month: '2-digit', year: 'numeric', timeZone: 'UTC' })
        .formatToParts(toUtcDate(2017, 1, 1))
        .map((part) => part.type)
        .filter((type): type is LuxDatePart => type === 'day' || type === 'month' || type === 'year');
      this.datePartOrder = { locale: this.locale, order };
    }

    return this.datePartOrder.order;
  }
}

/**
 * Ein Date auf UTC-Mitternacht des Tages, nur für die Ausgabe über Intl mit timeZone 'UTC'.
 * setUTCFullYear statt Date.UTC, damit die Jahre 0-99 nicht auf 1900-1999 abgebildet werden.
 */
function toUtcDate(year: number, month: number, day: number): Date {
  const date = new Date(0);
  date.setUTCFullYear(year, month - 1, day);
  return date;
}
