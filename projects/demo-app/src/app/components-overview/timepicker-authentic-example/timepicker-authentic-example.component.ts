import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { disabled, form, FormField, readonly, required, validate } from '@angular/forms/signals';
import {
  LuxAutofocusDirective,
  LuxDatepickerComponent,
  LuxFormHintComponent,
  LuxInputComponent,
  luxTimepickerMinMax,
  LuxTimepickerComponent,
  LuxToggleComponent
} from '@ihk-gfi/lux-components';
import { StatusMarkerComponent } from '../../base/status-marker/status-marker.component';
import { DemoMarkerType } from '../../base/status-marker/status-marker.model';
import { ExampleBaseContentComponent } from '../../example-base/example-base-root/example-base-subcomponents/example-base-content/example-base-content.component';
import { ExampleBaseAdvancedOptionsComponent } from '../../example-base/example-base-root/example-base-subcomponents/example-base-options/example-base-advanced-options.component';
import { ExampleBaseSimpleOptionsComponent } from '../../example-base/example-base-root/example-base-subcomponents/example-base-options/example-base-simple-options.component';
import { ExampleBaseStructureComponent } from '../../example-base/example-base-root/example-base-subcomponents/example-base-structure/example-base-structure.component';
import { emptyErrorCallback, exampleErrorCallback, logResult } from '../../example-base/example-base-util/example-base-helper';
import { ExampleFormDisableComponent } from '../../example-base/example-form-disable/example-form-disable.component';
import { ExampleFormValueComponent } from '../../example-base/example-form-value/example-form-value.component';
import { ExampleSignalFormValueComponent } from '../../example-base/example-signal-form-value/example-signal-form-value.component';
import { ExampleValueComponent } from '../../example-base/example-value/example-value.component';

interface TimepickerDummyForm {
  timepickerExample: FormControl<string | null>;
  combinedIsoExample: FormControl<string | null>;
}

@Component({
  selector: 'lux-timepicker-authentic-example',
  templateUrl: './timepicker-authentic-example.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    LuxToggleComponent,
    LuxInputComponent,
    LuxFormHintComponent,
    LuxDatepickerComponent,
    LuxTimepickerComponent,
    LuxAutofocusDirective,
    ExampleBaseStructureComponent,
    ExampleBaseContentComponent,
    ExampleValueComponent,
    ReactiveFormsModule,
    ExampleFormValueComponent,
    ExampleBaseSimpleOptionsComponent,
    ExampleFormDisableComponent,
    ExampleBaseAdvancedOptionsComponent,
    StatusMarkerComponent,
    ExampleSignalFormValueComponent,
    FormField
  ]
})
export class TimepickerAuthenticExampleComponent {
  // 1. Signal Form - der empfohlene Weg.
  readonly signalModel = signal<{ timepickerValue: string | null }>({ timepickerValue: '2026-06-18T14:30:00.000Z' });
  readonly signalForm = form(this.signalModel, (path) => {
    disabled(path.timepickerValue, { when: () => this.disabled() });
    readonly(path.timepickerValue, { when: () => this.readonly() });
    required(path.timepickerValue, { when: () => this.required() });
    validate(path.timepickerValue, luxTimepickerMinMax({ min: () => this.minTime(), max: () => this.maxTime() }));
  });
  readonly combinedSignalModel = signal<{ combinedValue: string | null }>({ combinedValue: '2026-06-18T14:30:00.000Z' });
  readonly combinedSignalForm = form(this.combinedSignalModel, (path) => {
    disabled(path.combinedValue, { when: () => this.disabled() });
    readonly(path.combinedValue, { when: () => this.readonly() });
    required(path.combinedValue, { when: () => this.required() });
    validate(path.combinedValue, luxTimepickerMinMax({ min: () => this.minTime(), max: () => this.maxTime() }));
  });

  // 2. Freistehend, ohne jedes Formular.
  readonly plainValue = signal<string | null>('2026-06-18T14:30:00.000Z');
  readonly combinedPlainValue = signal<string | null>('2026-06-18T14:30:00.000Z');

  readonly useErrorMessage = signal(true);
  readonly showOutputEvents = signal(false);
  form: FormGroup<TimepickerDummyForm>;
  controlBinding = 'timepickerExample';
  controlBindingCombined = 'combinedIsoExample';
  readonly value = signal('2026-06-18T14:30:00.000Z');
  readonly combinedISO = signal('2026-06-18T14:30:00.000Z');

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
  readonly errorMessage = signal('Das Feld enthält keinen gültigen Wert');
  readonly showToggle = signal(true);
  readonly opened = signal(false);
  readonly denseFormat = signal(false);
  readonly interval = signal('30m');
  readonly minTime = signal('08:00');
  readonly maxTime = signal('19:00');
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
    this.required.set(required);

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
