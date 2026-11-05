import type { FieldContext, FieldValidator, PathKind } from '@angular/forms/signals';
import { requiredError } from '@angular/forms/signals';

/**
 * Optionen für luxRequiredArray().
 */
export interface LuxRequiredArrayOptions {
  /** Ob das Feld aktuell required ist. Ohne Angabe gilt die Prüfung immer. */
  when?: () => boolean;
}

/**
 * Signal-Forms-Schema-Validator, der ein leeres Array als "nicht ausgefüllt" behandelt - z.B. bei
 * einem Mehrfachauswahl-lux-select (luxMultiple) oder bei lux-chips.
 *
 * Hintergrund: Angulars eigener required()-Validator (siehe @angular/forms/signals) erkennt nur '',
 * false und null/undefined als "leer" - ein leeres Array gilt ihm bereits als gefüllt. Ohne diesen
 * zusätzlichen Validator bliebe ein leeres Array-Feld daher fälschlich valid. Ergänzt required()
 * also, ersetzt es nicht.
 *
 * @param options `when`, analog zum when der übrigen Signal-Forms-Validatoren.
 * @returns Ein FieldValidator zur Verwendung mit validate() aus @angular/forms/signals.
 *
 * @example
 * ```ts
 * import { form, required, validate } from '@angular/forms/signals';
 * import { luxRequiredArray } from '@ihk-gfi/lux-components';
 *
 * readonly signalForm = form(this.signalModel, (path) => {
 *   required(path.selectValue, { when: () => this.required() });
 *   validate(path.selectValue, luxRequiredArray({ when: () => this.required() }));
 * });
 * ```
 */
export function luxRequiredArray<TValue = unknown, TPathKind extends PathKind = PathKind.Root>(
  options: LuxRequiredArrayOptions = {}
): FieldValidator<TValue, TPathKind> {
  return (ctx: FieldContext<TValue, TPathKind>) => {
    const isRequired = options.when ? options.when() : true;
    const value = ctx.value();

    if (isRequired && Array.isArray(value) && value.length === 0) {
      return requiredError();
    }

    return undefined;
  };
}
