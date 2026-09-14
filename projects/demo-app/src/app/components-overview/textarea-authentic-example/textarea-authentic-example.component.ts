import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, ValidatorFn, Validators } from '@angular/forms';
import { FormField, disabled, form, maxLength as maxLengthValidator, minLength, readonly, required } from '@angular/forms/signals';
import {
  LuxAutofocusDirective,
  LuxFormHintComponent,
  LuxInputComponent,
  LuxSelectComponent,
  LuxTextareaComponent,
  LuxToggleComponent
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

interface TextareaDummyForm {
  textareaExample: FormControl<string | null>;
}

@Component({
  selector: 'lux-textarea-authentic-example',
  templateUrl: './textarea-authentic-example.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    LuxToggleComponent,
    LuxTextareaComponent,
    LuxSelectComponent,
    LuxInputComponent,
    LuxFormHintComponent,
    LuxAutofocusDirective,
    ExampleBaseStructureComponent,
    ExampleBaseContentComponent,
    ExampleValueComponent,
    ReactiveFormsModule,
    ExampleFormValueComponent,
    ExampleSignalFormValueComponent,
    ExampleBaseSimpleOptionsComponent,
    ExampleFormDisableComponent,
    ExampleBaseAdvancedOptionsComponent,
    StatusMarkerComponent,
    FormField
  ]
})
export class TextareaAuthenticExampleComponent {
  // 1. Signal Form - der empfohlene Weg.
  readonly signalModel = signal({ textareaValue: '' });
  readonly signalForm = form(this.signalModel, (path) => {
    disabled(path.textareaValue, { when: () => this.disabled() });
    readonly(path.textareaValue, { when: () => this.readonly() });
    required(path.textareaValue, { message: 'Bitte einen Wert eingeben', when: () => this.required() });
    minLength(path.textareaValue, () => (this.controlValidators().includes(this.validatorOptions[0].value) ? 3 : undefined));
    maxLengthValidator(path.textareaValue, () => (this.controlValidators().includes(this.validatorOptions[1].value) ? 10 : undefined));
  });

  // 2. Freistehend, ohne jedes Formular.
  readonly plainValue = signal('');

  readonly useErrorMessage = signal(true);
  readonly showOutputEvents = signal(false);
  validatorOptions = [
    { value: Validators.minLength(3), label: 'Validators.minLength(3)' },
    { value: Validators.maxLength(10), label: 'Validators.maxLength(10)' },
    { value: Validators.email, label: 'Validators.email' }
  ];
  autocompleteOptions = ['on', 'off', 'name'];
  form: FormGroup<TextareaDummyForm>;
  log = logResult;
  readonly value = signal<string | null>(null);
  controlBinding = 'textareaExample';
  readonly disabled = signal(false);
  readonly readonly = signal(false);
  readonly required = signal(false);
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
  readonly max = signal(-1);
  readonly min = signal(1);
  errorCallback = exampleErrorCallback;
  emptyCallback = emptyErrorCallback;
  errorCallbackString = this.errorCallback + '';
  readonly maxLength = signal(0);
  readonly hideCounterLabel = signal(false);
  readonly labelLongFormat = signal(false);
  readonly denseFormat = signal(false);

  constructor() {
    this.form = new FormGroup<TextareaDummyForm>({
      textareaExample: new FormControl<string | null>(null)
    });
  }

  changeRequired(required: boolean) {
    this.required.set(required);
    setRequiredValidatorForFormControl(required, this.form, this.controlBinding);
  }

  pickValidatorValueFn(selected: any) {
    return selected.value;
  }
}
