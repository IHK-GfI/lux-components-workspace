import { Directive, EventEmitter, Input, Output } from '@angular/core';
import { ValidatorFn, Validators } from '@angular/forms';
import { LuxFormComponentBase, LuxValidationErrors } from './lux-form-component-base.class';

/**
 * Basis-Klasse für FormComponents, die einen ähnlichen Grundaufbau für das Aktivieren eines Boolean-Wertes besitzen
 * (LuxToggle und LuxCheckbox z.B.).
 */
@Directive()
export abstract class LuxFormCheckableBaseClass<T> extends LuxFormComponentBase<T> {
  @Output() luxCheckedChange = new EventEmitter<boolean>();

  @Input() luxTagId?: string;

  get luxChecked() {
    return this.getValue();
  }

  @Input() set luxChecked(checked: T) {
    this.setValue(checked);
  }

  override notifyFormValueChanged(formValue: boolean) {
    // Aktualisierungen an dem FormControl-Value sollen auch via EventEmitter bekannt gemacht werden
    this.luxCheckedChange.emit(formValue);

    // Bei luxRequired = true && einem false-Wert entsprechend einen Fehler setzen
    if (formValue === false && this.luxRequired && this.formControl.errors === null) {
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
