import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import {
    LuxAutofocusDirective,
    LuxButtonComponent,
    LuxCheckboxAcComponent,
    LuxFormHintComponent,
    LuxInputAcComponent,
    LuxTextboxComponent,
    LuxToggleAcComponent
} from '@ihk-gfi/lux-components';
import { ExampleBaseContentComponent } from '../../example-base/example-base-root/example-base-subcomponents/example-base-content/example-base-content.component';
import { ExampleBaseSimpleOptionsComponent } from '../../example-base/example-base-root/example-base-subcomponents/example-base-options/example-base-simple-options.component';
import { ExampleBaseStructureComponent } from '../../example-base/example-base-root/example-base-subcomponents/example-base-structure/example-base-structure.component';
import { emptyErrorCallback, exampleErrorCallback } from '../../example-base/example-base-util/example-base-helper';
import { ExampleFormDisableComponent } from '../../example-base/example-form-disable/example-form-disable.component';
import { ExampleFormValueComponent } from '../../example-base/example-form-value/example-form-value.component';
import { ExampleValueComponent } from '../../example-base/example-value/example-value.component';

interface CheckboxDummyForm {
  checkboxExample: FormControl<boolean | null>;
}

interface CheckboxAgbDummyForm {
  checkbox1: FormControl<boolean>;
  checkbox2: FormControl<boolean>;
  checkbox3: FormControl<boolean>;
}

@Component({
  selector: 'lux-checkbox-authentic-example',
  templateUrl: './checkbox-authentic-example.component.html',
  styleUrls: ['./checkbox-authentic-example.component.scss'],
  imports: [
    LuxTextboxComponent,
    LuxButtonComponent,
    LuxToggleAcComponent,
    LuxInputAcComponent,
    LuxFormHintComponent,
    LuxCheckboxAcComponent,
    LuxAutofocusDirective,
    ExampleBaseStructureComponent,
    ExampleBaseContentComponent,
    ExampleValueComponent,
    ReactiveFormsModule,
    ExampleFormValueComponent,
    ExampleBaseSimpleOptionsComponent,
    ExampleFormDisableComponent
  ]
})
export class CheckboxAuthenticExampleComponent {
  useErrorMessage = true;
  form: FormGroup<CheckboxDummyForm>;
  agb: FormGroup<CheckboxAgbDummyForm>;
  exampleText =
    'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr.';
  value = false;
  controlBinding = 'checkboxExample';
  label = 'Labeltext';
  hint = 'Optionaler Zusatztext';
  hintShowOnlyOnFocus = false;
  disabled = false;
  readonly = false;
  required = false;
  denseFormat = false;
  errorMessage = 'Das Feld enthält keinen gültigen Wert';
  errorCallback = exampleErrorCallback;
  emptyCallback = emptyErrorCallback;

  constructor() {
    this.form = new FormGroup<CheckboxDummyForm>({
      checkboxExample: new FormControl<boolean | null>(null)
    });
    this.agb = new FormGroup<CheckboxAgbDummyForm>({
      checkbox1: new FormControl<boolean>(false, { validators: Validators.required, nonNullable: true }),
      checkbox2: new FormControl<boolean>(false, { validators: Validators.required, nonNullable: true }),
      checkbox3: new FormControl<boolean>(false, { validators: Validators.required, nonNullable: true })
    });
  }

  changeRequired(required: boolean) {
    this.required = required;
    if (required) {
      this.form.get(this.controlBinding)!.setValidators(Validators.requiredTrue);
    } else {
      this.form.get(this.controlBinding)!.setValidators(null);
    }
    this.form.get(this.controlBinding)!.updateValueAndValidity();
  }

  exampleValidator(showError: boolean) {
    Object.keys(this.agb.controls).forEach((key) => {
      if (showError) {
        this.agb.get(key)!.markAsTouched();
      } else {
        this.agb.get(key)!.markAsUntouched();
      }
      this.agb.get(key)!.updateValueAndValidity();
    });
  }
}
