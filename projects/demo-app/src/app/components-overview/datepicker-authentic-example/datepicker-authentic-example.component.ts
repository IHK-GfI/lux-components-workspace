import { ChangeDetectorRef, Component, inject, LOCALE_ID } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, ValidatorFn, Validators } from '@angular/forms';
import {
  LuxAutofocusDirective,
  LuxDateFilterAcFn,
  LuxDatepickerAcComponent,
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
  imports: [
    LuxToggleAcComponent,
    LuxSelectAcComponent,
    LuxInputAcComponent,
    LuxFormHintComponent,
    LuxDatepickerAcComponent,
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
export class DatepickerAuthenticExampleComponent {
  private matDateLocale = inject(LOCALE_ID);
  private cdr = inject(ChangeDetectorRef);

  useCustomFilter = false;
  useErrorMessage = true;
  showOutputEvents = false;
  form: FormGroup<DatepickerDummyForm>;
  log = logResult;
  validatorOptions = [
    { value: Validators.minLength(3), label: 'Validators.minLength(3)' },
    { value: Validators.maxLength(10), label: 'Validators.maxLength(10)' }
  ];
  value = '2020-05-28T14:15:00.000Z';
  controlBinding = 'datepickerExample';
  disabled = false;
  readonly = false;
  required = false;
  label = 'Label';
  hint = 'Optionaler Zusatztext';
  hintShowOnlyOnFocus = false;
  placeholder = 'Placeholder';
  controlValidators: ValidatorFn[] = [];
  errorMessage = 'Das Feld enthält keinen gültigen Wert';
  showToggle = true;
  opened = false;
  startDate: string | null = null;
  locale = 'de-DE';
  minDate: string | null = null;
  maxDate: string | null = null;
  startView: LuxStartAcView = 'month';
  touchUi = false;
  labelLongFormat = false;
  denseFormat = false;
  customFilterString = this.weekendFilterFn + '';
  errorCallback = exampleErrorCallback;
  emptyCallback = emptyErrorCallback;
  errorCallbackString = this.errorCallback + '';
  customFilter?: LuxDateFilterAcFn;

  constructor() {
    const matDateLocale = this.matDateLocale;

    this.locale = matDateLocale === 'en' ? 'en-US' : matDateLocale;
    switch (matDateLocale) {
      case 'de':
        this.locale = 'de-De';
        break;
      case 'en':
        this.locale = 'en-US';
        break;
      case 'fr':
        this.locale = 'fr-FR';
        break;
      default:
        this.locale = matDateLocale;
    }

    this.form = new FormGroup<DatepickerDummyForm>({
      datepickerExample: new FormControl<string | null>(new Date(2020, 5, 28, 14, 15) as any) // Das FormControl wandelt das Date-Objekt in einen String um -> ['2021-09-07T23:00:00.000Z']
    });
  }

  changeRequired(required: boolean) {
    this.required = required;
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

  toggleCustomFilter() {
    this.customFilter = this.customFilter ? undefined : this.weekendFilterFn;
    this.cdr.detectChanges();
  }
}
