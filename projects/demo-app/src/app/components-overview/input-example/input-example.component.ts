import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, ValidatorFn, Validators } from '@angular/forms';
import { FormField, disabled, email, form, maxLength, minLength, readonly, required } from '@angular/forms/signals';
import {
  LuxAutofocusDirective,
  LuxFormHintComponent,
  LuxIconComponent,
  LuxInputComponent,
  LuxInputPrefixComponent,
  LuxInputSuffixComponent,
  LuxLinkPlainComponent,
  LuxSelectComponent,
  LuxToggleComponent,
  LuxValidators
} from '@ihk-gfi/lux-components';
import { StatusMarkerComponent } from '../../base/status-marker/status-marker.component';
import { DemoMarkerType } from '../../base/status-marker/status-marker.model';
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
import { ExampleSignalFormValueComponent } from '../../example-base/example-signal-form-value/example-signal-form-value.component';
import { ExampleValueComponent } from '../../example-base/example-value/example-value.component';

interface InputDummyForm {
  inputExample: FormControl<string | null>;
}

@Component({
  selector: 'lux-input-example',
  templateUrl: './input-example.component.html',
  styleUrls: ['./input-example.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    LuxIconComponent,
    LuxLinkPlainComponent,
    LuxToggleComponent,
    LuxSelectComponent,
    LuxInputSuffixComponent,
    LuxInputPrefixComponent,
    LuxInputComponent,
    LuxFormHintComponent,
    ExampleBaseStructureComponent,
    ExampleBaseContentComponent,
    ExampleValueComponent,
    ReactiveFormsModule,
    ExampleFormValueComponent,
    ExampleSignalFormValueComponent,
    ExampleBaseSimpleOptionsComponent,
    ExampleFormDisableComponent,
    ExampleBaseAdvancedOptionsComponent,
    LuxAutofocusDirective,
    StatusMarkerComponent,
    FormField
  ]
})
export class InputExampleComponent {
  // 1. Signal Form - der empfohlene Weg.
  readonly signalModel = signal({ inputValue: '' });
  readonly signalForm = form(this.signalModel, (path) => {
    disabled(path.inputValue, { when: () => this.disabled() });
    readonly(path.inputValue, { when: () => this.readonly() });
    required(path.inputValue, { message: 'Bitte einen Wert eingeben', when: () => this.required() });
    minLength(path.inputValue, () => (this.controlValidators().includes(this.validatorOptions[0].value) ? 3 : undefined));
    maxLength(path.inputValue, () => (this.controlValidators().includes(this.validatorOptions[1].value) ? 10 : undefined));
    email(path.inputValue, { when: () => this.controlValidators().includes(this.validatorOptions[2].value) });
  });

  // 2. Freistehend, ohne jedes Formular.
  readonly plainValue = signal('');

  readonly showSuffix = signal(false);
  readonly showPrefix = signal(false);
  readonly useErrorMessage = signal(true);
  readonly showOutputEvents = signal(false);
  validatorOptions = [
    { value: Validators.minLength(3), label: 'Validators.minLength(3)' },
    { value: Validators.maxLength(10), label: 'Validators.maxLength(10)' },
    { value: LuxValidators.email, label: 'LuxValidators.email' }
  ];
  typeOptions = ['text', 'number', 'email', 'time', 'password', 'color'];
  autocompleteOptions = ['on', 'off'];
  form: FormGroup<InputDummyForm>;
  log = logResult;
  readonly value = signal<any>(undefined);
  controlBinding = 'inputExample';
  readonly disabled = signal(false);
  readonly readonly = signal(false);
  readonly required = signal(false);
  readonly numberLeft = signal(false);
  readonly label = signal('Label');
  readonly hint = signal('Optionaler Zusatztext');
  readonly hintShowOnlyOnFocus = signal(false);
  readonly noTopLabel = signal(false);
  readonly noBottomLabel = signal(false);
  readonly noLabels = signal(false);
  readonly markerTypeUpdated = DemoMarkerType.Updated;
  readonly placeholder = signal('Placeholder');
  readonly controlValidators = signal<ValidatorFn[]>([]);
  readonly errorMessage = signal('Das Feld enthält keinen gültigen Wert');
  readonly autocomplete = signal('off');
  readonly inputType = signal('text');
  errorCallback = exampleErrorCallback;
  emptyCallback = emptyErrorCallback;
  errorCallbackString = this.errorCallback + '';
  readonly maxLength = signal(0);
  readonly hideCounterLabel = signal(false);
  readonly labelLongFormat = signal(false);
  readonly denseFormat = signal(false);
  readonly clearable = signal(false);
  readonly extraValidators = signal(false);
  minLengthValidator = Validators.minLength(3);
  maxLengthValidator = Validators.maxLength(10);

  constructor() {
    this.form = new FormGroup<InputDummyForm>({
      inputExample: new FormControl<string | null>('')
    });
  }

  changeRequired(required: boolean) {
    this.required.set(required);
    setRequiredValidatorForFormControl(required, this.form, this.controlBinding);
  }

  changeExtraValidators(enabled: boolean) {
    this.extraValidators.set(enabled);
    const control = this.form.get(this.controlBinding);
    if (control) {
      if (enabled) {
        control.addValidators([this.minLengthValidator, this.maxLengthValidator]);
      } else {
        control.removeValidators([this.minLengthValidator, this.maxLengthValidator]);
      }
      control.updateValueAndValidity();
    }
  }

  pickValidatorValueFn(selected: any) {
    return selected.value;
  }
}
