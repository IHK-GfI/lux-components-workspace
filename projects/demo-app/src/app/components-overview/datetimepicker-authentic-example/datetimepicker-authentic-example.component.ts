import { Component, ViewChild } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, ValidatorFn, Validators } from '@angular/forms';
import {
  LuxAutofocusDirective,
  LuxDatetimepickerAcComponent,
  LuxFormHintComponent,
  LuxInputAcComponent,
  LuxSelectAcComponent,
  LuxStartAcView,
  LuxToggleAcComponent
} from 'lux-components-lib';
import { ExampleBaseContentComponent } from '../../example-base/example-base-root/example-base-subcomponents/example-base-content/example-base-content.component';
import { ExampleBaseAdvancedOptionsComponent } from '../../example-base/example-base-root/example-base-subcomponents/example-base-options/example-base-advanced-options.component';
import { ExampleBaseSimpleOptionsComponent } from '../../example-base/example-base-root/example-base-subcomponents/example-base-options/example-base-simple-options.component';
import { ExampleBaseStructureComponent } from '../../example-base/example-base-root/example-base-subcomponents/example-base-structure/example-base-structure.component';
import { emptyErrorCallback, exampleErrorCallback, logResult } from '../../example-base/example-base-util/example-base-helper';
import { ExampleFormDisableComponent } from '../../example-base/example-form-disable/example-form-disable.component';
import { ExampleFormValueComponent } from '../../example-base/example-form-value/example-form-value.component';
import { ExampleValueComponent } from '../../example-base/example-value/example-value.component';

interface DatetimeDummyForm {
  datepickerExample: FormControl<string | null>;
}

@Component({
  selector: 'app-datetimepicker-authentic-example',
  templateUrl: './datetimepicker-authentic-example.component.html',
  imports: [
    LuxToggleAcComponent,
    LuxSelectAcComponent,
    LuxInputAcComponent,
    LuxFormHintComponent,
    LuxDatetimepickerAcComponent,
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
export class DatetimepickerAuthenticExampleComponent {
  @ViewChild('test2') dateTimeInFormComponent!: LuxDatetimepickerAcComponent;
  useCustomFilter = false;
  useErrorMessage = true;
  showOutputEvents = false;
  form: FormGroup<DatetimeDummyForm>;
  log = logResult;
  validatorOptions = [
    { value: Validators.minLength(3), label: 'Validators.minLength(3)' },
    { value: Validators.maxLength(10), label: 'Validators.maxLength(10)' }
  ];
  value?: string;
  controlBinding = 'datepickerExample';
  disabled = false;
  readonly = false;
  required = false;
  denseFormat = false;
  label = 'Label';
  hint = 'Optionaler Zusatztext';
  hintShowOnlyOnFocus = false;
  placeholder = 'Placeholder';
  controlValidators: ValidatorFn[] = [];
  errorMessage = 'Das Feld enthält keinen gültigen Wert';
  showToggle = true;
  opened = false;
  labelLongFormat = false;
  minDate = '01.01.2000, 00:00';
  maxDate = '31.12.2100, 23:59';
  startView: LuxStartAcView = 'month';
  startDate = '';
  startTime: number[] = [];
  _startTimeAsString?: string;

  get startTimeAsString(): string | undefined {
    return this._startTimeAsString;
  }

  set startTimeAsString(startTime) {
    this._startTimeAsString = startTime;

    if (startTime && startTime.indexOf(':') >= 0) {
      const timeArr = startTime.trim().split(':');
      if (timeArr.length === 2) {
        this.startTime = [+timeArr[0], +timeArr[1]];
      } else {
        this.startTime = [];
      }
    } else {
      this.startTime = [];
    }
  }
  customFilterString = this.customFilter + '';
  errorCallback = exampleErrorCallback;
  emptyCallback = emptyErrorCallback;
  errorCallbackString = this.errorCallback + '';

  constructor() {
    this.form = new FormGroup<DatetimeDummyForm>({
      datepickerExample: new FormControl<string | null>(null)
    });
  }

  changeRequired(required: boolean) {
    this.required = required;
    if (required) {
      this.form.get(this.controlBinding)!.setValidators([Validators.required, this.dateTimeInFormComponent.dateTimeValidator]);
    } else {
      this.form.get(this.controlBinding)!.setValidators(this.dateTimeInFormComponent.dateTimeValidator);
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
