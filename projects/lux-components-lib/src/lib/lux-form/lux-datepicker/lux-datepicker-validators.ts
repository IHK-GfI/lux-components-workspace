import { inject } from '@angular/core';
import type { FieldContext, FieldValidator, PathKind } from '@angular/forms/signals';
import { TranslocoService } from '@jsverse/transloco';
import { parseLocalDate, parseLocalDateTime } from '../../lux-util/lux-local-date';
import { checkLocalDate, checkLocalTime } from '../lux-form-model/lux-date-time-checks';
import type { LuxDateFilterFn } from './lux-datepicker.component';

/**
 * Optionen für luxDateValue(). Alle Werte als Getter, passend zu den Inputs von lux-datepicker.
 */
export interface LuxDateValueOptions {
  /** Liefert den frühesten erlaubten Tag ("yyyy-MM-dd", wie luxMinDate). null/undefined deaktiviert die Prüfung. */
  min?: () => string | null | undefined;
  /** Liefert den spätesten erlaubten Tag ("yyyy-MM-dd", wie luxMaxDate). null/undefined deaktiviert die Prüfung. */
  max?: () => string | null | undefined;
  /** Liefert den Filter für erlaubte Tage (wie luxCustomFilter). */
  filter?: () => LuxDateFilterFn | null | undefined;
}

/**
 * Optionen für luxDateTimeValue(). Alle Werte als Getter, passend zu den Inputs von lux-datepicker und
 * lux-timepicker.
 */
export interface LuxDateTimeValueOptions {
  /** Liefert den frühesten erlaubten Tag ("yyyy-MM-dd", wie luxMinDate). */
  minDate?: () => string | null | undefined;
  /** Liefert den spätesten erlaubten Tag ("yyyy-MM-dd", wie luxMaxDate). */
  maxDate?: () => string | null | undefined;
  /** Liefert den Filter für erlaubte Tage (wie luxCustomFilter). */
  filter?: () => LuxDateFilterFn | null | undefined;
  /** Liefert die früheste erlaubte Uhrzeit ("HH:mm", wie luxMinTime). */
  minTime?: () => string | null | undefined;
  /** Liefert die späteste erlaubte Uhrzeit ("HH:mm", wie luxMaxTime). */
  maxTime?: () => string | null | undefined;
}

/**
 * Signal-Forms-Schema-Validator für ein an lux-datepicker gebundenes Feld. Prüft das Format ("yyyy-MM-dd",
 * siehe LuxUtil.isLocalDate) sowie dieselben Grenzen und denselben Filter wie die Inputs der Komponente.
 *
 * Hintergrund: Der FormUiControl-Vertrag von Signal Forms ist unidirektional (Schema -> Control). Die
 * Komponente zeigt einen falschen Wert oder eine Grenzverletzung an, kann field().valid() aber nicht selbst
 * beeinflussen. Ohne diesen Validator bleibt das Feld trotz sichtbarem Fehler gültig. Eine ungültige
 * Texteingabe meldet die Komponente dagegen selbst an das Feld.
 *
 * Die Fehler verwenden dieselben Keys wie die Komponente (matDatepickerParse, matDatepickerMin,
 * matDatepickerMax, matDatepickerFilter), damit luxErrorCallback und die Fehlertexte in beiden Fällen gleich
 * funktionieren.
 *
 * Die message folgt einem Sprachwechsel: Der Validator liest TranslocoService.activeLang() und wird
 * dadurch bei einem Sprachwechsel neu ausgewertet (benötigt Transloco >= 8.3.0).
 *
 * @param options `min`, `max` und `filter` als Getter, passend zu luxMinDate, luxMaxDate und luxCustomFilter.
 * @returns Ein FieldValidator zur Verwendung mit validate() aus @angular/forms/signals.
 *
 * @example
 * ```ts
 * import { form, validate } from '@angular/forms/signals';
 * import { luxDateValue } from '@ihk-gfi/lux-components';
 *
 * readonly signalForm = form(this.signalModel, (path) => {
 *   validate(path.datum, luxDateValue({ min: () => this.minDate(), max: () => this.maxDate() }));
 * });
 * ```
 */
export function luxDateValue<TPathKind extends PathKind = PathKind.Root>(
  options: LuxDateValueOptions = {}
): FieldValidator<string | null, TPathKind> {
  const tService = inject(TranslocoService);

  return (ctx: FieldContext<string | null, TPathKind>) => {
    const value = ctx.value();
    if (value == null || value === '') {
      return undefined;
    }

    // Abhängigkeit auf die Sprache, damit die übersetzte message einem Sprachwechsel folgt.
    tService.activeLang();

    const date = parseLocalDate(value);
    if (!date) {
      return { kind: 'matDatepickerParse', message: tService.translate('luxc.datepicker.error_message.invalid') };
    }

    return checkLocalDate(tService, date, { min: options.min?.(), max: options.max?.(), filter: options.filter?.() });
  };
}

/**
 * Signal-Forms-Schema-Validator für ein Feld, das sich lux-datepicker und lux-timepicker über
 * luxReferenceControl teilen. Prüft das Format ("yyyy-MM-ddTHH:mm", siehe LuxUtil.isLocalDateTime), den Tag
 * wie luxDateValue() und die Uhrzeit wie luxTimeValue().
 *
 * Die message folgt wie bei luxDateValue() einem Sprachwechsel.
 *
 * @param options Grenzen und Filter als Getter, passend zu den Inputs der beiden Komponenten.
 * @returns Ein FieldValidator zur Verwendung mit validate() aus @angular/forms/signals.
 *
 * @example
 * ```ts
 * readonly signalForm = form(this.signalModel, (path) => {
 *   validate(path.termin, luxDateTimeValue({ minDate: () => '2029-01-01', minTime: () => '08:00', maxTime: () => '18:00' }));
 * });
 * ```
 */
export function luxDateTimeValue<TPathKind extends PathKind = PathKind.Root>(
  options: LuxDateTimeValueOptions = {}
): FieldValidator<string | null, TPathKind> {
  const tService = inject(TranslocoService);

  return (ctx: FieldContext<string | null, TPathKind>) => {
    const value = ctx.value();
    if (value == null || value === '') {
      return undefined;
    }

    // Abhängigkeit auf die Sprache, damit die übersetzte message einem Sprachwechsel folgt.
    tService.activeLang();

    const dateTime = parseLocalDateTime(value);
    if (!dateTime) {
      return { kind: 'matDatepickerParse', message: tService.translate('luxc.datepicker.error_message.invalid') };
    }

    return (
      checkLocalDate(tService, dateTime.date, { min: options.minDate?.(), max: options.maxDate?.(), filter: options.filter?.() }) ??
      checkLocalTime(tService, dateTime.time, { min: options.minTime?.(), max: options.maxTime?.() })
    );
  };
}
