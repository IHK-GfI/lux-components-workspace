import { Directive, Signal, model } from '@angular/core';
import type { FormCheckboxControl } from '@angular/forms/signals';
import { LuxFormControlBase } from './lux-form-control-base.class';

/**
 * Basisklasse für die ankreuzbaren LUX-FormControls (Checkbox, Toggle).
 *
 * Erfüllt den FormCheckboxControl-Vertrag aus @angular/forms/signals. Angular unterscheidet die
 * beiden Verträge allein anhand der Property: Eine Komponente mit "checked" wird als Checkbox
 * gebunden, eine mit "value" als normales Eingabefeld - beide Namen gleichzeitig sind laut Vertrag
 * ausdrücklich verboten (checked?: undefined bzw. value?: undefined).
 */
@Directive()
export abstract class LuxFormCheckboxControlBase extends LuxFormControlBase<boolean> implements FormCheckboxControl {
  readonly checked = model(false);

  readonly controlValue: Signal<boolean> = this.checked;

  writeControlValue(value: boolean) {
    this.checked.set(value);
  }
}
