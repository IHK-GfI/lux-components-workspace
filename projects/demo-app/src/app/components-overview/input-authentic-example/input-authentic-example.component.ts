import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, ValidatorFn, Validators } from '@angular/forms';
import {
    LuxAutofocusDirective,
    LuxButtonComponent,
    LuxCardActionsComponent,
    LuxCardComponent,
    LuxCardContentComponent,
    LuxDatepickerAcComponent,
    LuxFormHintComponent,
    LuxIconComponent,
    LuxInputAcComponent,
    LuxInputAcPrefixComponent,
    LuxInputAcSuffixComponent,
    LuxLinkPlainComponent,
    LuxSelectAcComponent,
    LuxToggleAcComponent
} from '@ihk-gfi/lux-components';
import { ExampleBaseContentComponent } from '../../example-base/example-base-root/example-base-subcomponents/example-base-content/example-base-content.component';
import { ExampleBaseAdvancedOptionsComponent } from '../../example-base/example-base-root/example-base-subcomponents/example-base-options/example-base-advanced-options.component';
import { ExampleBaseSimpleOptionsComponent } from '../../example-base/example-base-root/example-base-subcomponents/example-base-options/example-base-simple-options.component';
import { ExampleBaseStructureComponent } from '../../example-base/example-base-root/example-base-subcomponents/example-base-structure/example-base-structure.component';
import {
    emptyErrorCallback,
    exampleErrorCallback,
    logResult,
    setRequiredValidatorForFormControl
} from '../../example-base/example-base-util/example-base-helper';
import { ExampleFormDisableComponent } from '../../example-base/example-form-disable/example-form-disable.component';
import { ExampleFormValueComponent } from '../../example-base/example-form-value/example-form-value.component';
import { ExampleValueComponent } from '../../example-base/example-value/example-value.component';

interface InputDummyForm {
  inputExample: FormControl<string | null>;
}

@Component({
  selector: 'lux-input-ac-example',
  templateUrl: './input-authentic-example.component.html',
  styleUrls: ['./input-authentic-example.component.scss'],
  imports: [
    LuxIconComponent,
    LuxLinkPlainComponent,
    LuxButtonComponent,
    LuxCardActionsComponent,
    LuxCardContentComponent,
    LuxCardComponent,
    LuxToggleAcComponent,
    LuxSelectAcComponent,
    LuxInputAcSuffixComponent,
    LuxInputAcPrefixComponent,
    LuxInputAcComponent,
    LuxFormHintComponent,
    LuxDatepickerAcComponent,
    ExampleBaseStructureComponent,
    ExampleBaseContentComponent,
    ExampleValueComponent,
    ReactiveFormsModule,
    ExampleFormValueComponent,
    ExampleBaseSimpleOptionsComponent,
    ExampleFormDisableComponent,
    ExampleBaseAdvancedOptionsComponent,
    LuxAutofocusDirective
  ]
})
export class InputAuthenticExampleComponent {
  longLabel =
    'Lorem ipsum dolor sit amet consectetur adipisicing elit. Error, laudantium sequi quo mollitia id magnam voluptatum suscipit assumenda perspiciatis ab! Sit voluptas qui sed quas, sapiente ea officia nesciunt eveniet obcaecati dolorem nostrum commodi temporibus esse minus, corrupti repellat hic consequatur pariatur!';
  longHint =
    'Sit voluptas qui sed quas, sapiente ea officia nesciunt eveniet obcaecati dolorem nostrum commodi temporibus esse minus, corrupti repellat hic consequatur pariatur! Ducimus adipisci qui officia. Sit voluptas qui sed quas, sapiente ea officia nesciunt eveniet obcaecati dolorem nostrum commodi temporibus esse minus, corrupti repellat hic consequatur pariatur! Ducimus adipisci qui officia.';

  showSuffix = false;
  showPrefix = false;
  useErrorMessage = true;
  showOutputEvents = false;
  validatorOptions = [
    { value: Validators.minLength(3), label: 'Validators.minLength(3)' },
    { value: Validators.maxLength(10), label: 'Validators.maxLength(10)' },
    { value: Validators.email, label: 'Validators.email' }
  ];
  typeOptions = ['text', 'number', 'email', 'time', 'password', 'color'];
  autocompleteOptions = ['on', 'off'];
  form: FormGroup<InputDummyForm>;
  log = logResult;
  value: any;
  controlBinding = 'inputExample';
  disabled = false;
  readonly = false;
  required = false;
  numberLeft = false;
  label = 'Label';
  hint = 'Optionaler Zusatztext';
  hintShowOnlyOnFocus = false;
  placeholder = 'Placeholder';
  controlValidators: ValidatorFn[] = [];
  errorMessage = 'Das Feld enthält keinen gültigen Wert';
  autocomplete = 'off';
  inputType = 'text';
  errorCallback = exampleErrorCallback;
  emptyCallback = emptyErrorCallback;
  errorCallbackString = this.errorCallback + '';
  maxLength = 0;
  hideCounterLabel = false;
  labelLongFormat = false;
  denseFormat = false;
  exampleCompany = '';
  exampleDate = '';
  exampleStreet = '';
  exampleNumber = '';

  constructor() {
    this.form = new FormGroup<InputDummyForm>({
      inputExample: new FormControl<string | null>(null)
    });
  }

  changeRequired(required: boolean) {
    this.required = required;
    setRequiredValidatorForFormControl(required, this.form, this.controlBinding);
  }

  pickValidatorValueFn(selected: any) {
    return selected.value;
  }
}
