import { TranslocoService } from '@jsverse/transloco';
import {
  LuxLocalDate,
  LuxLocalTime,
  compareLocalDate,
  formatLocalDate,
  parseLocalDate,
  parseLocalTime
} from '../../lux-util/lux-local-date';

/**
 * Gemeinsame Prüfungen der Signal-Forms-Validatoren luxDateValue(), luxTimeValue() und luxDateTimeValue().
 * Bewusst nicht im public_api: Die Fehler-Keys entsprechen denen von lux-datepicker bzw. lux-timepicker.
 */

export interface LuxDateCheckOptions {
  min?: string | null;
  max?: string | null;
  filter?: ((date: string) => boolean) | null;
}

export interface LuxTimeCheckOptions {
  min?: string | null;
  max?: string | null;
}

/**
 * Prüft einen Tag gegen min/max ("yyyy-MM-dd") und den Filter. Nicht lesbare Grenzen werden ignoriert.
 */
export function checkLocalDate(tService: TranslocoService, date: LuxLocalDate, options: LuxDateCheckOptions) {
  const min = parseLocalDate(options.min);
  if (min && compareLocalDate(date, min) < 0) {
    return { kind: 'matDatepickerMin', message: tService.translate('luxc.datepicker.error_message.min') };
  }

  const max = parseLocalDate(options.max);
  if (max && compareLocalDate(date, max) > 0) {
    return { kind: 'matDatepickerMax', message: tService.translate('luxc.datepicker.error_message.max') };
  }

  if (options.filter && !options.filter(formatLocalDate(date))) {
    return { kind: 'matDatepickerFilter', message: tService.translate('luxc.datepicker.error_message.invalid') };
  }

  return undefined;
}

/**
 * Prüft eine Uhrzeit gegen min/max ("HH:mm"). Nicht lesbare Grenzen werden ignoriert.
 */
export function checkLocalTime(tService: TranslocoService, time: LuxLocalTime, options: LuxTimeCheckOptions) {
  const minutes = toMinutes(time);

  const min = parseLocalTime(options.min);
  if (min && minutes < toMinutes(min)) {
    return { kind: 'matTimepickerMin', message: tService.translate('luxc.timepicker.error_message.min') };
  }

  const max = parseLocalTime(options.max);
  if (max && minutes > toMinutes(max)) {
    return { kind: 'matTimepickerMax', message: tService.translate('luxc.timepicker.error_message.max') };
  }

  return undefined;
}

function toMinutes(time: LuxLocalTime): number {
  return time.hour * 60 + time.minute;
}
