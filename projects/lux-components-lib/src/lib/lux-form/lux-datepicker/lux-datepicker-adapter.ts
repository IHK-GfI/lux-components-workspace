import { getLocaleFirstDayOfWeek } from '@angular/common';
import { Injectable } from '@angular/core';
import { NativeDateAdapter } from '@angular/material/core';
import { LuxUtil } from '../../lux-util/lux-util';
import DateTimeFormatOptions = Intl.DateTimeFormatOptions;

/**
 * DateAdapter der LuxDatepickerComponent.
 *
 * Der Datepicker speichert ein Datum immer als UTC-Mitternacht (z.B. "2029-05-26T00:00:00.000Z").
 * Damit in jeder Zeitzone genau der gespeicherte Tag angezeigt wird, arbeitet dieser Adapter - anders als
 * der NativeDateAdapter - bei Anzeige, Kalender und Vergleichen durchgehend mit den UTC-Datumsbestandteilen.
 * Welcher Tag mit einem übergebenen Wert gemeint ist, bestimmt toCalendarDay().
 */
@Injectable()
export class LuxDatepickerAdapter extends NativeDateAdapter {
  // UTC-Zeitpunkt im ISO-Format ("...Z")
  private readonly utcRegExp = new RegExp(/Z$/i);

  // dd.MM.yyyy
  private readonly dotRegExp = new RegExp(/\d{1,2}\.\d{1,2}\.\d{4}/);

  // MM/dd/yyyy
  private readonly backslashRegExp = new RegExp(/\d{1,2}\/\d{1,2}\/\d{4}/);

  // dd-MM-yyyy
  private readonly hyphenRegExp = new RegExp(/\d{1,2}-\d{1,2}-\d{4}/);

  // yyyy-MM-dd
  private readonly hyphenRegExp_1 = new RegExp(/\d{4}-\d{1,2}-\d{1,2}/);

  // ddMMyyyy
  private readonly noSeparatorRegExp = new RegExp(/\d{1,2}\d{1,2}\d{4}/);

  referenceTimeProvider: (() => Date | null) | null = null;

  // Liefert true, wenn der Datepicker mit einem Timepicker kombiniert ist (luxReferenceControl).
  // Dann bilden Datum und Uhrzeit zusammen einen UTC-Zeitpunkt und der Tag wird immer über UTC bestimmt.
  combinedWithTimeProvider: (() => boolean) | null = null;

  /**
   * Bestimmt den gemeinten Kalendertag eines Wertes und liefert ihn als UTC-Mitternacht (so speichert der Datepicker).
   *
   * - Ein Datum ohne Zeitzone (z.B. "2029-05-26", "26.05.2029" oder "2029-05-26T23:30:00") oder ein ISO-String mit
   *   Offset (z.B. "2029-05-26T23:30:00+02:00"): der geschriebene Tag.
   * - Ein UTC-Zeitpunkt ("...Z") oder ein Date-Objekt genau auf UTC-Mitternacht: der UTC-Tag.
   * - Ein UTC-Zeitpunkt oder ein Date-Objekt mit anderer Uhrzeit: wie bis Version 21.4.0 der lokale Tag des Nutzers
   *   (z.B. lokale Mitternacht "2029-05-25T22:00:00.000Z" bzw. new Date(2029, 4, 26) in Europe/Berlin => 26.05.2029).
   * @param value ein String oder ein Date-Objekt.
   * @returns den Kalendertag als UTC-Mitternacht oder null, wenn der Wert kein gültiges Datum ist.
   */
  toCalendarDay(value: unknown): Date | null {
    let date: Date | null = null;
    let isInstant = false;

    if (value instanceof Date) {
      date = value;
      isInstant = true;
    } else if (typeof value === 'string' && LuxUtil.ISO_8601_FULL.test(value)) {
      date = LuxUtil.parseISO8601AsUTC(value);
      isInstant = this.utcRegExp.test(value);
      if (!isInstant && LuxUtil.isDate(date)) {
        // Ohne Zeitzone oder mit Offset: der geschriebene Tag (die ersten zehn Zeichen "yyyy-MM-dd")
        date = LuxUtil.parseISO8601AsUTC(value.substring(0, 10) + 'T00:00:00');
      }
    } else if (typeof value === 'string') {
      // Andere Formate (z.B. "26.05.2029") bezeichnen den geschriebenen Tag
      date = this.parse(value);
    }

    if (!date || !LuxUtil.isDate(date)) {
      return null;
    }

    const result = new Date(0);
    if (isInstant && !this.isUTCMidnight(date)) {
      result.setUTCFullYear(date.getFullYear(), date.getMonth(), date.getDate());
    } else {
      result.setUTCFullYear(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate());
    }
    return result;
  }

  override createDate(year: number, month: number, date: number): Date {
    // Create UTC-Date
    const result = new Date(Date.UTC(year, month, date));
    const refTime = this.referenceTimeProvider?.();
    if (refTime) {
      result.setUTCHours(refTime.getUTCHours(), refTime.getUTCMinutes(), refTime.getUTCSeconds(), 0);
    } else {
      result.setUTCHours(0, 0, 0, 0);
    }
    return result;
  }

  override getYear(date: Date): number {
    return date.getUTCFullYear();
  }

  override getMonth(date: Date): number {
    return date.getUTCMonth();
  }

  override getDate(date: Date): number {
    return date.getUTCDate();
  }

  override getDayOfWeek(date: Date): number {
    return date.getUTCDay();
  }

  override getYearName(date: Date): string {
    return this.format(date, { year: 'numeric' });
  }

  override getNumDaysInMonth(date: Date): number {
    // Tag 0 des Folgemonats entspricht dem letzten Tag des Monats
    return this.getDate(this.createUTCDateWithOverflow(this.getYear(date), this.getMonth(date) + 1, 0));
  }

  override addCalendarMonths(date: Date, months: number): Date {
    let newDate = this.createUTCDateWithOverflow(this.getYear(date), this.getMonth(date) + months, this.getDate(date));

    // Bei einem Überlauf (z.B. 31.01. + 1 Monat) wird der letzte Tag des Zielmonats verwendet
    if (this.getMonth(newDate) !== (((this.getMonth(date) + months) % 12) + 12) % 12) {
      newDate = this.createUTCDateWithOverflow(this.getYear(newDate), this.getMonth(newDate), 0);
    }

    return newDate;
  }

  override addCalendarDays(date: Date, days: number): Date {
    return this.createUTCDateWithOverflow(this.getYear(date), this.getMonth(date), this.getDate(date) + days);
  }

  override today(): Date {
    // Der heutige Tag aus Sicht des Nutzers (lokale Zeitzone) als UTC-Mitternacht
    const now = new Date();
    return this.createUTCDateWithOverflow(now.getFullYear(), now.getMonth(), now.getDate());
  }

  override format(date: Date | string, displayFormat: DateTimeFormatOptions): string {
    if (!date) {
      return '';
    }

    if (typeof date === 'string') {
      date = LuxUtil.parseISO8601AsUTC(date);
    }

    return date.toLocaleDateString(this.locale, { ...displayFormat, timeZone: 'UTC' });
  }

  // Wird u.a. von Material intern (z.B. MatDatepickerInput#writeValue) statt parse() verwendet,
  // um Werte aus dem FormControl in ein Date zu konvertieren.
  override deserialize(value: any): Date | null {
    // Ohne Timepicker wird der gemeinte Kalendertag verwendet (siehe toCalendarDay).
    // Ein reines Datum (z.B. "2029-05-26") interpretiert der native Parser bereits als UTC-Mitternacht.
    if (!this.combinedWithTimeProvider?.() && (value instanceof Date || (typeof value === 'string' && LuxUtil.ISO_8601_FULL.test(value)))) {
      return this.toCalendarDay(value) ?? this.invalid();
    }

    // Ein ISO-String ohne Zeitzoneninfo (z.B. "2027-03-13T00:00:00") würde vom NativeDateAdapter als lokale Zeit interpretiert
    if (LuxUtil.isISO8601WithoutTimezone(value)) {
      return LuxUtil.parseISO8601AsUTC(value);
    }
    return super.deserialize(value);
  }

  override parse(value: string): Date | null {
    let result: Date | null;
    if (value) {
      // Prüfen, ob der Wert ein ISO-String ist
      if (LuxUtil.ISO_8601_FULL.test(value)) {
        result = LuxUtil.parseISO8601AsUTC(value);
      } else if (this.dotRegExp.test(value)) {
        // Hat der String das Format dd.MM.YYYY ?
        result = this.getUTCNulled_ddMMYYYY(value, '.');
      } else if (this.backslashRegExp.test(value)) {
        result = this.getUTCNulled_MMddYYY(value, '/');
      } else if (this.hyphenRegExp.test(value)) {
        result = this.getUTCNulled_ddMMYYYY(value, '-');
      } else if (this.hyphenRegExp_1.test(value)) {
        result = this.getUTCNulled_YYYYMMdd(value, '-');
      } else if (this.noSeparatorRegExp.test(value)) {
        result = this.getUTCNulled_ddMMYYYYNoSeparator(value);
      } else {
        // Dies ist nötig, damit die Fehlermeldung "Das Feld enthält keinen gültigen Wert" angezeigt wird,
        // wenn der String nicht geparst werden kann.
        result = value as any;
      }
    } else {
      result = null;
    }
    return result;
  }

  override getFirstDayOfWeek(): number {
    let startDay;
    try {
      startDay = getLocaleFirstDayOfWeek(this.locale);
    } catch (e) {
      startDay = super.getFirstDayOfWeek();
    }
    return startDay;
  }

  /**
   * UTC Date mit 0-Werten für Time erhalten. Werte außerhalb des gültigen Bereichs laufen über
   * (z.B. Tag 0 => letzter Tag des Vormonats).
   * @param year
   * @param month
   * @param date
   */
  private createUTCDateWithOverflow(year: number, month: number, date: number): Date {
    const result = new Date(0);
    result.setUTCFullYear(year, month, date);
    return result;
  }

  private isUTCMidnight(date: Date): boolean {
    return date.getUTCHours() === 0 && date.getUTCMinutes() === 0 && date.getUTCSeconds() === 0 && date.getUTCMilliseconds() === 0;
  }

  private applyReferenceTime(date: Date): Date {
    const refTime = this.referenceTimeProvider?.();
    if (refTime) {
      date.setUTCHours(refTime.getUTCHours(), refTime.getUTCMinutes(), refTime.getUTCSeconds(), 0);
    }
    return date;
  }

  /**
   * UTC Date mit 0-Werten für Time aus einem ddMMYYYY-String erhalten.
   * @param dateString
   * @param separator
   */
  private getUTCNulled_ddMMYYYY(dateString: string, separator: string) {
    const splitDate = dateString.split(separator);
    const tempDate = new Date(0);
    tempDate.setUTCFullYear(+splitDate[2], this.calculateMonth(+splitDate[1]), +splitDate[0]);
    return this.applyReferenceTime(tempDate);
  }

  /**
   * UTC Date mit 0-Werten für Time aus einem ddMMYYYY-String erhalten.
   * @param dateString
   */
  private getUTCNulled_ddMMYYYYNoSeparator(dateString: string) {
    const tempDate = new Date(0);
    tempDate.setUTCFullYear(+dateString.substring(4, 8), this.calculateMonth(+dateString.substring(2, 4)), +dateString.substring(0, 2));
    return this.applyReferenceTime(tempDate);
  }

  /**
   * UTC Date mit 0-Werten für Time aus einem YYYYMMdd-String erhalten.
   * @param dateString
   * @param separator
   */
  private getUTCNulled_YYYYMMdd(dateString: string, separator: string) {
    const splitDate = dateString.split(separator);
    const tempDate = new Date(0);
    tempDate.setUTCFullYear(+splitDate[0], this.calculateMonth(+splitDate[1]), +splitDate[2]);
    return this.applyReferenceTime(tempDate);
  }

  /**
   * UTC Date mit 0-Werten für Time aus einem MMddYYYY-String erhalten.
   * @param dateString
   * @param separator
   */
  private getUTCNulled_MMddYYY(dateString: string, separator: string) {
    const splitDate = dateString.split(separator);
    const tempDate = new Date(0);
    tempDate.setUTCFullYear(+splitDate[2], this.calculateMonth(+splitDate[0]), +splitDate[1]);
    return this.applyReferenceTime(tempDate);
  }

  override isValid(date: any) {
    return LuxUtil.isDate(date) && this.isValidYear(date);
  }

  private calculateMonth(month: number) {
    let newMonth: number;

    if (month <= 0) {
      newMonth = 0;
    } else if (month >= 12) {
      newMonth = 11;
    } else {
      newMonth = month - 1;
    }

    return newMonth;
  }

  private isValidYear(date: any) {
    // Prüfen, ob das Jahr auch aus genau vier Stellen (z.B. 2020) besteht.
    // Ohne diesen Check würden auch 5- oder 6-stellige Jahreszahlen akzeptiert.
    return date.getUTCFullYear() && date.getUTCFullYear().toString().length === 4;
  }

  // Damit werden zwei Buchstaben für den Wochentag angezeigt (Mo, Di, Mi, ...)
  override getDayOfWeekNames() {
    return super.getDayOfWeekNames('short');
  }
}
