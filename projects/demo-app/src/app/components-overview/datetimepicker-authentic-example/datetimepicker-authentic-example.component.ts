import { Component, signal, viewChild, ChangeDetectionStrategy } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, ValidatorFn, Validators } from '@angular/forms';
import {
  LuxAutofocusDirective,
  LuxDatetimepickerComponent,
  LuxFormHintComponent,
  LuxInputComponent,
  LuxSelectComponent,
  LuxStartView,
  LuxToggleComponent
} from '@ihk-gfi/lux-components';
import { ExampleBaseContentComponent } from '../../example-base/example-base-root/example-base-subcomponents/example-base-content/example-base-content.component';
import { ExampleBaseAdvancedOptionsComponent } from '../../example-base/example-base-root/example-base-subcomponents/example-base-options/example-base-advanced-options.component';
import { ExampleBaseSimpleOptionsComponent } from '../../example-base/example-base-root/example-base-subcomponents/example-base-options/example-base-simple-options.component';
import { ExampleBaseStructureComponent } from '../../example-base/example-base-root/example-base-subcomponents/example-base-structure/example-base-structure.component';
import { emptyErrorCallback, exampleErrorCallback, logResult } from '../../example-base/example-base-util/example-base-helper';
import { ExampleFormDisableComponent } from '../../example-base/example-form-disable/example-form-disable.component';
import { ExampleFormValueComponent } from '../../example-base/example-form-value/example-form-value.component';
import { ExampleValueComponent } from '../../example-base/example-value/example-value.component';
import { StatusMarkerComponent } from '../../base/status-marker/status-marker.component';
import { DemoMarkerType } from '../../base/status-marker/status-marker.model';

interface DatetimeDummyForm {
  datepickerExample: FormControl<string | null>;
}

@Component({
  selector: 'app-datetimepicker-authentic-example',
  templateUrl: './datetimepicker-authentic-example.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    LuxToggleComponent,
    LuxSelectComponent,
    LuxInputComponent,
    LuxFormHintComponent,
    LuxDatetimepickerComponent,
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
export class DatetimepickerAuthenticExampleComponent {
  readonly dateTimeInFormComponent = viewChild.required<LuxDatetimepickerComponent>('test2');

  readonly useCustomFilter = signal(false);
  readonly useErrorMessage = signal(true);
  readonly showOutputEvents = signal(false);
  readonly form = new FormGroup<DatetimeDummyForm>({
    datepickerExample: new FormControl<string | null>(null)
  });
  readonly log = logResult;
  readonly validatorOptions = [
    { value: Validators.minLength(3), label: 'Validators.minLength(3)' },
    { value: Validators.maxLength(10), label: 'Validators.maxLength(10)' }
  ];
  readonly value = signal<string | undefined>(undefined);
  readonly controlBinding = 'datepickerExample';
  readonly disabled = signal(false);
  readonly readonly = signal(false);
  readonly required = signal(false);
  readonly denseFormat = signal(false);
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
  readonly labelLongFormat = signal(false);
  readonly minDate = signal('01.01.2000, 00:00');
  readonly maxDate = signal('31.12.2100, 23:59');
  readonly startView = signal<LuxStartView>('month');
  readonly startDate = signal('');
  readonly startTime = signal<number[]>([]);
  readonly customFilterString = this.customFilter + '';
  readonly errorCallback = exampleErrorCallback;
  readonly emptyCallback = emptyErrorCallback;
  readonly errorCallbackString = this.errorCallback + '';

  private readonly _startTimeAsString = signal<string | undefined>(undefined);

  get startTimeAsString(): string | undefined {
    return this._startTimeAsString();
  }

  set startTimeAsString(startTime) {
    this._startTimeAsString.set(startTime);

    if (startTime && startTime.indexOf(':') >= 0) {
      const timeArr = startTime.trim().split(':');
      if (timeArr.length === 2) {
        this.startTime.set([+timeArr[0], +timeArr[1]]);
      } else {
        this.startTime.set([]);
      }
    } else {
      this.startTime.set([]);
    }
  }

  changeRequired(required: boolean) {
    this.required.set(required);
    if (required) {
      this.form.get(this.controlBinding)!.setValidators([Validators.required, this.dateTimeInFormComponent().dateTimeValidator]);
    } else {
      this.form.get(this.controlBinding)!.setValidators(this.dateTimeInFormComponent().dateTimeValidator);
    }
    this.form.get(this.controlBinding)!.updateValueAndValidity();
  }

  pickValidatorValueFn(selected: any) {
    return selected.value;
  }

  customFilter(d: Date | null): boolean {
    let result;
    if (d) {
      const day = d.getDay();
      // Samstage und Sonntage als Auswahl unterbinden
      result = day !== 0 && day !== 6;
    } else {
      result = false;
    }

    return result;
  }
}
