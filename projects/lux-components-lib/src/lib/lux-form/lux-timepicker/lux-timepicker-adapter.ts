import { Injectable } from '@angular/core';
import { NativeDateAdapter } from '@angular/material/core';
import { LuxUtil } from '../../lux-util/lux-util';
import DateTimeFormatOptions = Intl.DateTimeFormatOptions;

@Injectable()
export class LuxTimepickerAdapter extends NativeDateAdapter {
  override createDate(year: number, month: number, date: number): Date {
    return new Date(Date.UTC(year, month, date, 0, 0, 0, 0));
  }

  override format(date: Date | string, displayFormat: DateTimeFormatOptions): string {
    if (!date) {
      return '';
    }

    // Ein String kann hier auch ohne Zeitzoneninfo (kein "Z"/Offset) ankommen; daher wird für Strings
    // dieselbe UTC-sichere Parsing-Logik wie in parse() genutzt.
    const normalizedDate = typeof date === 'string' ? LuxUtil.parseISO8601AsUTC(date) : date;
    // Die Uhrzeit wird als UTC-Uhrzeit angezeigt. Die Zeitzone wird direkt beim Formatieren gesetzt, statt das Datum
    // um den Offset zu verschieben - sonst würden Uhrzeiten, die es lokal nicht gibt (Umstellung auf Sommerzeit), verschoben.
    return normalizedDate.toLocaleTimeString(this.locale, { ...displayFormat, timeZone: 'UTC' });
  }

  // Wird u.a. von Material intern (z.B. MatTimepickerInput#writeValue) statt parse() verwendet,
  // um Werte aus dem FormControl in ein Date zu konvertieren.
  override deserialize(value: any): Date | null {
    if (typeof value === 'string' && LuxUtil.ISO_8601_FULL.test(value)) {
      return LuxUtil.parseISO8601AsUTC(value);
    }
    return super.deserialize(value);
  }

  override parse(value: string): Date | null {
    if (!value) {
      return null;
    }

    if (LuxUtil.ISO_8601_FULL.test(value)) {
      return LuxUtil.parseISO8601AsUTC(value);
    }

    const timeMatch = value.trim().match(/^(\d{1,2}):(\d{2})(?::(\d{2}))?$/);
    if (!timeMatch) {
      // Dies ist nötig, damit die Fehlermeldung "Das Feld enthält keinen gültigen Wert" angezeigt wird,
      // wenn der String nicht geparst werden kann.
      return value as any;
    }

    const hours = +timeMatch[1];
    const minutes = +timeMatch[2];
    const seconds = timeMatch[3] ? +timeMatch[3] : 0;

    if (hours > 23 || minutes > 59 || seconds > 59) {
      return null;
    }

    return new Date(Date.UTC(1970, 0, 1, hours, minutes, seconds, 0));
  }

  override getHours(date: Date): number {
    return date.getUTCHours();
  }

  override getMinutes(date: Date): number {
    return date.getUTCMinutes();
  }

  override getSeconds(date: Date): number {
    return date.getUTCSeconds();
  }

  override setTime(target: Date, hours: number, minutes: number, seconds: number): Date {
    const result = new Date(target.getTime());
    result.setUTCHours(hours, minutes, seconds, 0);
    return result;
  }

  override compareTime(first: Date, second: Date): number {
    const firstSeconds = first.getUTCHours() * 3600 + first.getUTCMinutes() * 60 + first.getUTCSeconds();
    const secondSeconds = second.getUTCHours() * 3600 + second.getUTCMinutes() * 60 + second.getUTCSeconds();
    return firstSeconds - secondSeconds;
  }

  override today(): Date {
    return new Date(Date.UTC(1970, 0, 1, 0, 0, 0, 0));
  }

  override isValid(date: any) {
    return LuxUtil.isDate(date);
  }
}
