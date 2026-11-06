import { inject } from '@angular/core';
import type { FieldContext, FieldValidator, PathKind } from '@angular/forms/signals';
import { TranslocoService } from '@jsverse/transloco';
import { parseLocalTime } from '../../lux-util/lux-local-date';
import { checkLocalTime } from '../lux-form-model/lux-date-time-checks';

/**
 * Optionen für luxTimeValue(). Alle Werte als Getter, passend zu den Inputs von lux-timepicker.
 */
export interface LuxTimeValueOptions {
  /** Liefert die früheste erlaubte Uhrzeit ("HH:mm", wie luxMinTime). null/undefined deaktiviert die Prüfung. */
  min?: () => string | null | undefined;
  /** Liefert die späteste erlaubte Uhrzeit ("HH:mm", wie luxMaxTime). null/undefined deaktiviert die Prüfung. */
  max?: () => string | null | undefined;
}

/**
 * Signal-Forms-Schema-Validator für ein an lux-timepicker gebundenes Feld. Prüft das Format ("HH:mm", siehe
 * LuxUtil.isLocalTime) sowie dieselben Grenzen wie luxMinTime/luxMaxTime.
 *
 * Hintergrund: Der FormUiControl-Vertrag von Signal Forms ist unidirektional (Schema -> Control). Die
 * Komponente zeigt einen falschen Wert oder eine Grenzverletzung an, kann field().valid() aber nicht selbst
 * beeinflussen. Ohne diesen Validator bleibt das Feld trotz sichtbarem Fehler gültig. Eine ungültige
 * Texteingabe meldet die Komponente dagegen selbst an das Feld.
 *
 * Die Fehler verwenden dieselben Keys wie die Komponente (matTimepickerParse, matTimepickerMin,
 * matTimepickerMax). Für den gemeinsamen Wert mit einem Datepicker gibt es luxDateTimeValue().
 *
 * @param options `min` und `max` als Getter, passend zu luxMinTime und luxMaxTime.
 * @returns Ein FieldValidator zur Verwendung mit validate() aus @angular/forms/signals.
 *
 * @example
 * ```ts
 * import { form, validate } from '@angular/forms/signals';
 * import { luxTimeValue } from '@ihk-gfi/lux-components';
 *
 * readonly signalForm = form(this.signalModel, (path) => {
 *   validate(path.beginn, luxTimeValue({ min: () => this.minTime(), max: () => this.maxTime() }));
 * });
 * ```
 */
export function luxTimeValue<TPathKind extends PathKind = PathKind.Root>(
  options: LuxTimeValueOptions = {}
): FieldValidator<string | null, TPathKind> {
  const tService = inject(TranslocoService);

  return (ctx: FieldContext<string | null, TPathKind>) => {
    const value = ctx.value();
    if (value == null || value === '') {
      return undefined;
    }

    const time = parseLocalTime(value);
    if (!time) {
      return { kind: 'matTimepickerParse', message: tService.translate('luxc.timepicker.error_message.invalid') };
    }

    return checkLocalTime(tService, time, { min: options.min?.(), max: options.max?.() });
  };
}
