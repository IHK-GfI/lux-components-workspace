import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  LuxAutofocusDirective,
  LuxDatepickerAcComponent,
  LuxFormHintComponent,
  LuxInputAcComponent,
  LuxTimepickerComponent,
  LuxToggleAcComponent
} from '@ihk-gfi/lux-components';
import { ExampleBaseContentComponent } from '../../example-base/example-base-root/example-base-subcomponents/example-base-content/example-base-content.component';
import { ExampleBaseAdvancedOptionsComponent } from '../../example-base/example-base-root/example-base-subcomponents/example-base-options/example-base-advanced-options.component';
import { ExampleBaseSimpleOptionsComponent } from '../../example-base/example-base-root/example-base-subcomponents/example-base-options/example-base-simple-options.component';
import { ExampleBaseStructureComponent } from '../../example-base/example-base-root/example-base-subcomponents/example-base-structure/example-base-structure.component';
import { emptyErrorCallback, exampleErrorCallback, logResult } from '../../example-base/example-base-util/example-base-helper';
import { ExampleFormDisableComponent } from '../../example-base/example-form-disable/example-form-disable.component';
import { ExampleFormValueComponent } from '../../example-base/example-form-value/example-form-value.component';
import { ExampleValueComponent } from '../../example-base/example-value/example-value.component';

interface TimepickerDummyForm {
  timepickerExample: FormControl<string | null>;
  combinedIsoExample: FormControl<string | null>;
}

@Component({
  selector: 'lux-timepicker-authentic-example',
  templateUrl: './timepicker-authentic-example.component.html',
  imports: [
    LuxToggleAcComponent,
    LuxInputAcComponent,
    LuxFormHintComponent,
    LuxDatepickerAcComponent,
    LuxTimepickerComponent,
    LuxAutofocusDirective,
    ExampleBaseStructureComponent,
    ExampleBaseContentComponent,
    ExampleValueComponent,
    ReactiveFormsModule,
    ExampleFormValueComponent,
    ExampleBaseSimpleOptionsComponent,
    ExampleFormDisableComponent,
    ExampleBaseAdvancedOptionsComponent
  ]
})
export class TimepickerAuthenticExampleComponent {
  useErrorMessage = true;
  showOutputEvents = false;
  form: FormGroup<TimepickerDummyForm>;
  controlBinding = 'timepickerExample';
  controlBindingCombined = 'combinedIsoExample';
  value = '2026-06-18T14:30:00.000Z';
  combinedISO = '2026-06-18T14:30:00.000Z';

  disabled = false;
  readonly = false;
  required = false;
  label = 'Label';
  hint = 'Optionaler Zusatztext';
  hintShowOnlyOnFocus = false;
  placeholder = 'Placeholder';
  errorMessage = 'Das Feld enthält keinen gültigen Wert';
  showToggle = true;
  opened = false;
  denseFormat = false;
  interval = '30m';
  minTime = '08:00';
  maxTime = '19:00';
  log = logResult;
  errorCallback = exampleErrorCallback;
  emptyCallback = emptyErrorCallback;
  errorCallbackString = this.errorCallback + '';

  constructor() {
    this.form = new FormGroup<TimepickerDummyForm>({
      timepickerExample: new FormControl<string | null>(new Date(Date.UTC(2026, 5, 18, 14, 30)) as any),
      combinedIsoExample: new FormControl<string | null>('2026-06-18T14:30:00.000Z', { updateOn: 'blur' })
    });
  }

  changeRequired(required: boolean) {
    this.required = required;

    const control = this.form.get(this.controlBinding);
    if (control) {
      control.setValidators(required ? [Validators.required] : []);
      control.updateValueAndValidity();
    }

    const combinedControl = this.form.get(this.controlBindingCombined);
    if (combinedControl) {
      combinedControl.setValidators(required ? [Validators.required] : []);
      combinedControl.updateValueAndValidity();
    }
  }
}
