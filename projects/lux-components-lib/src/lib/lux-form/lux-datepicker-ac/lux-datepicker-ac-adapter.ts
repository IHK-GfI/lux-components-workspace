import { getLocaleFirstDayOfWeek } from '@angular/common';
import { Injectable } from '@angular/core';
import { NativeDateAdapter } from '@angular/material/core';
import { LuxUtil } from '../../lux-util/lux-util';
import DateTimeFormatOptions = Intl.DateTimeFormatOptions;

@Injectable()
export class LuxDatepickerAcAdapter extends NativeDateAdapter {
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

  override format(date: Date | string, displayFormat: DateTimeFormatOptions): string {
    let result: string;
    if (date) {
      if (displayFormat) {
        if (typeof date === 'string') {
          date = new Date(date);
        }
        result = date.toLocaleDateString(this.locale, displayFormat);
      } else {
        result = (date as Date).toLocaleDateString(this.locale);
      }
    } else {
      result = '';
    }
    return result;
  }

  override parse(value: string): Date | null {
    let result: Date | null;
    if (value) {
      // Prüfen, ob der Wert ein ISO-String ist
      if (LuxUtil.ISO_8601_FULL.test(value)) {
        result = new Date(value);
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
    return date.getFullYear() && date.getFullYear().toString().length === 4;
  }

  // Damit werden zwei Buchstaben für den Wochentag angezeigt (Mo, Di, Mi, ...)
  override getDayOfWeekNames() {
    return super.getDayOfWeekNames('short');
  }
}
