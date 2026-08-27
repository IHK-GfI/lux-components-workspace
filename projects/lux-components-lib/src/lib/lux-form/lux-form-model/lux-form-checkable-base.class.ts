import { Directive, input, output } from '@angular/core';
import { ValidatorFn, Validators } from '@angular/forms';
import { LuxFormComponentBase, LuxValidationErrors } from './lux-form-component-base.class';

/**
 * Basis-Klasse für FormComponents, die einen ähnlichen Grundaufbau für das Aktivieren eines Boolean-Wertes besitzen
 * (LuxToggle und LuxCheckbox z.B.).
 */
@Directive()
export abstract class LuxFormCheckableBaseClass<T> extends LuxFormComponentBase<T> {
  readonly luxTagId = input<string | undefined>(undefined);

  /**
   * Der von außen gesetzte Wert. Die Quelle der Wahrheit bleibt das FormControl; den aktuellen
   * Wert liefern das Signal value() bzw. getValue().
   */
  readonly luxChecked = input<T>(null as T);
  readonly luxCheckedChange = output<boolean>();

  constructor() {
    super();

    this.syncValueInputToFormControl(this.luxChecked);
  }

  override ngOnInit() {
    // Den gebundenen Startwert übernehmen, bevor das FormControl initialisiert wird. Dadurch
    // löst der Initialwert - wie bisher - noch kein luxCheckedChange aus.
    this._initialValue = this.luxChecked();

    super.ngOnInit();
  }

  override notifyFormValueChanged(formValue: boolean) {
    // Aktualisierungen an dem FormControl-Value sollen auch nach außen bekannt gemacht werden.
    this.luxCheckedChange.emit(formValue);

    // Bei luxRequired = true && einem false-Wert entsprechend einen Fehler setzen
    if (formValue === false && this.luxRequired() && this.formControl.errors === null) {
      this.formControl.setErrors({ required: true });
    }
  }

  override errorMessageModifier(value: any, errors: LuxValidationErrors): string | undefined {
    if (errors['required']) {
      return this.tService.translate(`luxc.form-checkable-base.error_message.required`);
    }
    return undefined;
  }

  protected override getRequiredValidator(): ValidatorFn {
    return Validators.requiredTrue;
  }
}
