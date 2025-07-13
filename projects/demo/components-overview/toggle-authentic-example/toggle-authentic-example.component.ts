import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { LuxAutofocusDirective, LuxFormHintComponent, LuxInputAcComponent, LuxToggleAcComponent } from '@ihk-gfi/lux-components';
import { ExampleBaseContentComponent } from '../../example-base/example-base-root/example-base-subcomponents/example-base-content/example-base-content.component';
import { ExampleBaseSimpleOptionsComponent } from '../../example-base/example-base-root/example-base-subcomponents/example-base-options/example-base-simple-options.component';
import { ExampleBaseStructureComponent } from '../../example-base/example-base-root/example-base-subcomponents/example-base-structure/example-base-structure.component';
import { emptyErrorCallback, exampleErrorCallback } from '../../example-base/example-base-util/example-base-helper';
import { ExampleFormDisableComponent } from '../../example-base/example-form-disable/example-form-disable.component';
import { ExampleFormValueComponent } from '../../example-base/example-form-value/example-form-value.component';
import { ExampleValueComponent } from '../../example-base/example-value/example-value.component';

interface ToggleDummyForm {
  toggleExample: FormControl<boolean | null>;
}

@Component({
  selector: 'lux-toggle-authentic-example',
  templateUrl: './toggle-authentic-example.component.html',
  styleUrls: [],
  imports: [
    LuxToggleAcComponent,
    LuxInputAcComponent,
    LuxFormHintComponent,
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
export class ToggleAuthenticExampleComponent {
  useErrorMessage = true;
  form: FormGroup<ToggleDummyForm>;
  value = false;
  controlBinding = 'toggleExample';
  label = 'Label';
  hint = 'Hint';
  hintShowOnlyOnFocus = false;
  disabled = false;
  readonly = false;
  required = false;
  denseFormat = false;
  errorMessage = 'Das Feld enthält keinen gültigen Wert';
  errorCallback = exampleErrorCallback;
  emptyCallback = emptyErrorCallback;

  constructor() {
    this.form = new FormGroup<ToggleDummyForm>({
      toggleExample: new FormControl<boolean | null>(null)
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
}

