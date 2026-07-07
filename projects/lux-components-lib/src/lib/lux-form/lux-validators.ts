import { AbstractControl, FormGroup, ValidationErrors, ValidatorFn } from '@angular/forms';

// Stricter email pattern aligned with the JAST-Stack backend validation.
const LUX_EMAIL_REGEXP = /^(?=.{1,64}@)[\p{L}0-9_-]+(\.[\p{L}0-9_-]+)*@[\p{L}0-9][\p{L}0-9-]+(\.[\p{L}0-9-]+)*(\.[\p{L}]{2,})$/u;

/**
 * Prüft, ob mindestens einer der übergebenen boolean-Werte `true` ist.
 * Geeignet für Checkboxen ohne Formular (z.B. mit `[(luxChecked)]`-Binding).
 *
 * @param values Array von boolean-Werten (z.B. Komponenteneigenschaften der einzelnen Checkboxen).
 * @returns `true` wenn mindestens ein Wert `true` ist, sonst `false`.
 *
 * @example
 * ```ts
 * // Im Template:
 * // @if (!luxAtLeastOneChecked([opt1, opt2, opt3])) { ... Fehlermeldung ... }
 *
 * // In der Komponente (z.B. vor dem Absenden):
 * if (!luxAtLeastOneChecked([this.opt1, this.opt2, this.opt3])) {
 *   this.showError = true;
 *   return;
 * }
 * ```
 */
export function luxAtLeastOneChecked(values: boolean[]): boolean {
  return values.some((v) => v);
}

/**
 * FormGroup-Validator, der prüft ob mindestens eine der angegebenen Checkboxen angehakt wurde.
 *
 * @param controlNames Array mit den Namen der FormControl-Felder (lux-checkbox-ac), die geprüft werden sollen.
 * @returns ValidatorFn, der `null` zurückgibt wenn mindestens eine Checkbox `true` ist,
 *          andernfalls `{ luxAtLeastOneCheckboxChecked: true }`.
 *
 * @example
 * ```ts
 * new FormGroup(
 *   {
 *     option1: new FormControl<boolean>(false, { nonNullable: true }),
 *     option2: new FormControl<boolean>(false, { nonNullable: true }),
 *     option3: new FormControl<boolean>(false, { nonNullable: true })
 *   },
 *   { validators: luxAtLeastOneCheckboxChecked(['option1', 'option2', 'option3']) }
 * )
 * ```
 */
export function luxAtLeastOneCheckboxChecked(controlNames: string[]): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!(control instanceof FormGroup)) {
      return null;
    }

    const atLeastOneChecked = controlNames.some((name) => control.get(name)?.value === true);

    return atLeastOneChecked ? null : { luxAtLeastOneCheckboxChecked: true };
  };
}

/**
 * Validator für E-Mail-Adressen mit strengerer Prüfung als `Validators.email`,
 * abgestimmt auf die serverseitige JAST-Stack-Validierung.
 *
 * Fehlerkey: `luxEmail`
 *
 * @example
 * ```ts
 * new FormControl('', { validators: LuxValidators.email })
 * ```
 */
const luxEmailValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const value = control.value as string | null | undefined;
  if (!value) {
    return null;
  }
  return LUX_EMAIL_REGEXP.test(value) ? null : { mail: true };
};

/**
 * Sammlung eigener LUX-Validatoren, analog zu Angulars `Validators`-Klasse.
 *
 * @example
 * ```ts
 * new FormControl('', { validators: LuxValidators.email })
 * ```
 */
export const LuxValidators = {
  email: luxEmailValidator
} as const;
