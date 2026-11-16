import { inject } from '@angular/core';
import type { FieldContext, FieldValidator, PathKind } from '@angular/forms/signals';
import { TranslocoService } from '@jsverse/transloco';
import { LuxUtil } from '../../lux-util/lux-util';

/**
 * Optionen für luxTimepickerMinMax().
 */
export interface LuxTimepickerMinMaxOptions {
  /** Liefert die minimal erlaubte Uhrzeit, z.B. "08:00". null/undefined deaktiviert die Prüfung. */
  min?: () => string | null | undefined;
  /** Liefert die maximal erlaubte Uhrzeit, z.B. "19:00". null/undefined deaktiviert die Prüfung. */
  max?: () => string | null | undefined;
}

/**
 * Signal-Forms-Schema-Validator, der ein an lux-timepicker gebundenes Feld gegen dieselbe
 * min/max-Grenze prüft wie die luxMinTime/luxMaxTime-Inputs der Komponente.
 *
 * Hintergrund: Der FormUiControl-Vertrag von Signal Forms ist rein unidirektional (Schema -> Control,
 * siehe die Inputs in node_modules/@angular/forms/types/signals.d.ts) - LuxTimepickerComponent kann
 * eine luxMinTime/luxMaxTime-Verletzung daher nur visuell anzeigen (LuxTimepickerComponent.
 * syncTimepickerValidation()), aber niemals selbst field().valid() beeinflussen. Ohne diesen
 * zusätzlichen, im Schema deklarierten Validator bleibt ein Signal-Form-Feld trotz sichtbarem Fehler
 * "valid".
 *
 * Die message der zurückgegebenen Fehler wird bewusst über dieselben luxc.timepicker.error_message.
 * min/max-Keys übersetzt, die auch LuxTimepickerComponent.errorMessageModifier() für die visuelle
 * Anzeige nutzt (siehe luxc-de.json/luxc-en.json) - beide beschreiben inhaltlich denselben Sachverhalt
 * ("Die Zeit unterschreitet/überschreitet den Minimal-/Maximalwert"), eine zweite, eigene Textvariante
 * wäre reine Dopplung. Normalerweise wird diese message ohnehin nie sichtbar (LuxTimepickerComponent
 * zeigt ihre eigene, bereits korrekt übersetzte internalErrors-Meldung), sie greift nur, falls das Feld
 * je an ein anderes Control gebunden wird, das seine Fehlertexte direkt aus den Signal-Forms-Errors
 * liest statt über LuxFormControlBase.errorMessage().
 *
 * Bewusst NICHT reaktiv auf Sprachwechsel: TranslocoService.translate() liefert eine Momentaufnahme,
 * kein Signal, ein späterer Sprachwechsel löst daher keine Revalidierung aus (die message bleibt bis
 * zur nächsten Wertänderung in der zuvor aktiven Sprache) - LuxTimepickerComponent selbst löst das für
 * die eigene Anzeige separat über ein explizites langChanges$-Abonnement.
 *
 * @param options `min`/`max` als Getter, passend zu den luxMinTime/luxMaxTime-Inputs.
 * @returns Ein FieldValidator zur Verwendung mit validate() aus @angular/forms/signals.
 *
 * @remarks
 * `min`/`max` bewusst als `() => this.minTime()`/`() => this.maxTime()` übergeben, nicht als direkte
 * Signal-Referenz (`min: this.minTime`): Wird der Validator - wie üblich - im Initializer eines
 * `form()`-Feldes registriert, das VOR dem min/max-Signal deklariert ist, läuft die
 * Feldinitialisierung der Klasse zu diesem Zeitpunkt noch nicht bis zum Signal durch - eine direkt
 * eingefangene Referenz wäre dann dauerhaft `undefined`. Der Getter verzögert den Zugriff bis zur
 * tatsächlichen (späteren) Validierung.
 *
 * @example
 * ```ts
 * import { form, validate } from '@angular/forms/signals';
 * import { luxTimepickerMinMax } from '@ihk-gfi/lux-components';
 *
 * readonly signalForm = form(this.signalModel, (path) => {
 *   validate(path.timepickerValue, luxTimepickerMinMax({ min: () => this.minTime(), max: () => this.maxTime() }));
 * });
 * ```
 */
export function luxTimepickerMinMax<TPathKind extends PathKind = PathKind.Root>(
  options: LuxTimepickerMinMaxOptions
): FieldValidator<string | null, TPathKind> {
  const tService = inject(TranslocoService);

  return (ctx: FieldContext<string | null, TPathKind>) => {
    const value = ctx.value();
    if (!value) {
      return undefined;
    }

    const date = new Date(value);
    if (isNaN(date.getTime())) {
      return undefined;
    }

    const valueSeconds = date.getUTCHours() * 3600 + date.getUTCMinutes() * 60 + date.getUTCSeconds();

    const minSeconds = LuxUtil.parseTimeToSeconds(options.min?.());
    if (minSeconds !== null && valueSeconds < minSeconds) {
      return { kind: 'luxTimepickerMin', message: tService.translate('luxc.timepicker.error_message.min') };
    }

    const maxSeconds = LuxUtil.parseTimeToSeconds(options.max?.());
    if (maxSeconds !== null && valueSeconds > maxSeconds) {
      return { kind: 'luxTimepickerMax', message: tService.translate('luxc.timepicker.error_message.max') };
    }

    return undefined;
  };
}
