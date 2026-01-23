import { getLocaleFirstDayOfWeek } from '@angular/common';
import { Injectable } from '@angular/core';
import { NativeDateAdapter } from '@angular/material/core';
import { LuxUtil } from '../../lux-util/lux-util';

@Injectable()
export class LuxDateTimePickerAcAdapter extends NativeDateAdapter {
  // dd.MM.yyyy
  private readonly dotRegExp = new RegExp(/\d{1,2}\.\d{1,2}\.\d{4},\W*\d{1,2}:\d{1,2}/);
  // MM/dd/yyyy
  private readonly backslashRegExp = new RegExp(/\d{1,2}\/\d{1,2}\/\d{4},\W*\d{1,2}:\d{1,2}/);
  // dd-MM-yyyy
  private readonly hyphenRegExp = new RegExp(/\d{1,2}-\d{1,2}-\d{4},\W*\d{1,2}:\d{1,2}/);
  // yyyy-MM-dd
  private readonly hyphenRegExp_1 = new RegExp(/\d{4}-\d{1,2}-\d{1,2},\W*\d{1,2}:\d{1,2}/);
  // ddMMyyyy
  private readonly noSeparatorRegExp = new RegExp(/\d{1,2}\d{1,2}\d{4},\W*\d{1,2}:\d{1,2}/);

  override format(date: Date | string, displayFormat: object): string {
    let dateAsString = '';

    if (date) {
      const newDate = typeof date === 'string' ? new Date(date) : new Date(date.getTime());
      newDate.setMinutes(newDate.getMinutes() + newDate.getTimezoneOffset());

      if (displayFormat) {
        dateAsString = newDate.toLocaleDateString(this.locale, displayFormat);
      } else {
        dateAsString = newDate.toLocaleDateString(this.locale);
      }
    }

    return dateAsString;
  }

  override parse(dateAsString: string): Date | null {
    let result = null;

    if (dateAsString) {
      if (LuxUtil.ISO_8601_FULL.test(dateAsString)) {
        const newDate = new Date(dateAsString);
        newDate.setSeconds(0);
        newDate.setMilliseconds(0);
        result = newDate;
      } else {
        const dateTimeArr = dateAsString.split(',');

        if (dateTimeArr.length === 1) {
          dateTimeArr.push('00:00');
        }

        for (let i = 0; i < dateTimeArr.length; i++) {
          dateTimeArr[i] = dateTimeArr[i].trim();
        }

        const dateValue = dateTimeArr[0];
        const timeValue = dateTimeArr[1];

        // Hat der String das Format dd.MM.YYYY ?
        if (this.dotRegExp.test(dateAsString)) {
          result = this.getUTCNulled_ddMMYYYY(dateValue, timeValue, '.');
        } else if (this.backslashRegExp.test(dateAsString)) {
          result = this.getUTCNulled_MMddYYY(dateValue, timeValue, '/');
        } else if (this.hyphenRegExp.test(dateAsString)) {
          result = this.getUTCNulled_ddMMYYYY(dateValue, timeValue, '-');
        } else if (this.hyphenRegExp_1.test(dateAsString)) {
          result = this.getUTCNulled_YYYYMMdd(dateValue, timeValue, '-');
        } else if (this.noSeparatorRegExp.test(dateAsString)) {
          return this.getUTCNulled_ddMMYYYYNoSeparator(dateValue, timeValue);
        }
      }
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

  override getDayOfWeekNames() {
    // Zeige zwei Buchstaben für den Wochentag an (Mo, Di, Mi, ...)
    return super.getDayOfWeekNames('short');
  }

  /**
   * UTC Date mit 0-Werten für Time aus einem ddMMYYYY-String erhalten.
   * @param dateString
   * @param timeString
   * @param separator
   */
  private getUTCNulled_ddMMYYYY(dateString: string, timeString: string, separator: string) {
    const splitDate = dateString.split(separator);
    const splitTime = timeString.split(':');

    const date = new Date(0);
    date.setUTCFullYear(+splitDate[2], this.calculateMonth(+splitDate[1]), +splitDate[0]);
    date.setUTCHours(+splitTime[0], +splitTime[1], 0, 0);

    return date;
  }

  /**
   * UTC Date mit 0-Werten für Time aus einem YYYYMMdd-String erhalten.
   * @param dateString
   * @param timeString
   * @param separator
   */
  private getUTCNulled_YYYYMMdd(dateString: string, timeString: string, separator: string) {
    const splitDate = dateString.split(separator);
    const splitTime = timeString.split(':');

    const date = new Date(0);
    date.setUTCFullYear(+splitDate[0], this.calculateMonth(+splitDate[1]), +splitDate[2]);
    date.setUTCHours(+splitTime[0], +splitTime[1], 0, 0);

    return date;
  }

  /**
   * UTC Date mit 0-Werten für Time aus einem MMddYYYY-String erhalten.
   * @param dateString
   * @param timeString
   * @param separator
   */
  private getUTCNulled_MMddYYY(dateString: string, timeString: string, separator: string) {
    const splitDate = dateString.split(separator);
    const splitTime = timeString.split(':');

    const date = new Date(0);
    date.setUTCFullYear(+splitDate[2], this.calculateMonth(+splitDate[0]), +splitDate[1]);
    date.setUTCHours(+splitTime[0], +splitTime[1], 0, 0);

    return date;
  }

  /**
   * UTC Date mit 0-Werten für Time aus einem ddMMYYYY-String erhalten.
   * @param dateString
   * @param timeString
   */
  private getUTCNulled_ddMMYYYYNoSeparator(dateString: string, timeString: string) {
    const splitTime = timeString.split(':');

    const tempDate = new Date(0);
    tempDate.setUTCFullYear(+dateString.substring(4, 8), this.calculateMonth(+dateString.substring(2, 4)), +dateString.substring(0, 2));
    tempDate.setUTCHours(+splitTime[0], +splitTime[1], 0, 0);
    return tempDate;
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
}
