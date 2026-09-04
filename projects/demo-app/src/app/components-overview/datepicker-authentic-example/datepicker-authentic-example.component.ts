import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, ValidatorFn, Validators } from '@angular/forms';
import {
  LuxAutofocusDirective,
  LuxDateFilterFn,
  LuxDatepickerComponent,
  LuxFormHintComponent,
  LuxInputComponent,
  LuxSelectComponent,
  LuxStartView,
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
import { ExampleValueComponent } from '../../example-base/example-value/example-value.component';

interface DatepickerDummyForm {
  datepickerExample: FormControl<string | null>;
}

@Component({
  selector: 'lux-datepicker-authentic-example',
  templateUrl: './datepicker-authentic-example.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    LuxToggleComponent,
    LuxSelectComponent,
    LuxInputComponent,
    LuxFormHintComponent,
    LuxDatepickerComponent,
    LuxAutofocusDirective,
    ExampleBaseStructureComponent,
    ExampleBaseContentComponent,
    ExampleValueComponent,
    ReactiveFormsModule,
    ExampleFormValueComponent,
    ExampleBaseSimpleOptionsComponent,
    ExampleFormDisableComponent,
    ExampleBaseAdvancedOptionsComponent,
    StatusMarkerComponent
  ]
})
export class DatepickerAuthenticExampleComponent {
  readonly useCustomFilter = signal(false);
  readonly useErrorMessage = signal(true);
  readonly showOutputEvents = signal(false);
  readonly form = new FormGroup<DatepickerDummyForm>({
    datepickerExample: new FormControl<string | null>(new Date(2020, 5, 28, 14, 15) as any)
  });
  readonly log = logResult;
  readonly validatorOptions = [
    { value: Validators.minLength(3), label: 'Validators.minLength(3)' },
    { value: Validators.maxLength(10), label: 'Validators.maxLength(10)' }
  ];
  readonly value = signal('2020-05-28T14:15:00.000Z');
  readonly controlBinding = 'datepickerExample';
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
  readonly showToggle = signal(true);
  readonly opened = signal(false);
  readonly startDate = signal<string | null>(null);
  readonly minDate = signal<string | null>(null);
  readonly maxDate = signal<string | null>(null);
  readonly startView = signal<LuxStartView>('month');
  readonly touchUi = signal(false);
  readonly labelLongFormat = signal(false);
  readonly denseFormat = signal(false);
  readonly customFilterString = this.weekendFilterFn + '';
  readonly errorCallback = exampleErrorCallback;
  readonly emptyCallback = emptyErrorCallback;
  readonly errorCallbackString = this.errorCallback + '';
  readonly customFilter = computed<LuxDateFilterFn | undefined>(() => (this.useCustomFilter() ? this.weekendFilterFn : undefined));

  changeRequired(required: boolean) {
    this.required.set(required);
    setRequiredValidatorForFormControl(required, this.form, this.controlBinding);
  }

  pickValidatorValueFn(selected: any) {
    return selected.value;
  }

  weekendFilterFn(d: Date | null) {
    const day = d ? d.getDay() : 0;
    // Samstage und Sonntage als Auswahl unterbinden
    return day !== 0 && day !== 6;
  }
}
