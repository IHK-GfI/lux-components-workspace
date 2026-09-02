import { Component, signal, ChangeDetectionStrategy } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, ValidatorFn, Validators } from '@angular/forms';
import {
    LuxAutofocusDirective,
    LuxFormHintComponent,
    LuxInputAcComponent,
    LuxSelectAcComponent,
    LuxSliderAcColor,
    LuxSliderAcComponent,
    LuxToggleAcComponent
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

interface SliderDummyForm {
  sliderExample: FormControl<number | null>;
}

@Component({
  selector: 'lux-slider-authentic-example',
  templateUrl: './slider-authentic-example.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    LuxToggleAcComponent,
    LuxSliderAcComponent,
    LuxSelectAcComponent,
    LuxInputAcComponent,
    LuxFormHintComponent,
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
export class SliderAuthenticExampleComponent {
  readonly useErrorMessage = signal(true);
  readonly useDisplayFn = signal(false);
  readonly showOutputEvents = signal(false);
  colorOptions = [
    { label: 'Primary', value: 'primary' },
    { label: 'Accent', value: 'accent' },
    { label: 'Warn', value: 'warn' }
  ];
  validatorOptions = [
    { value: Validators.max(100), label: 'Validators.max(100)' },
    { value: Validators.min(25), label: 'Validators.min(25)' }
  ];
  form: FormGroup<SliderDummyForm>;
  log = logResult;
  readonly percent = signal(0);
  readonly percentReactive = signal(0);
  readonly labelLongFormat = signal(false);
  readonly value = signal(0);
  displayWithFnString: string = this.displayFn + '';
  readonly color = signal<LuxSliderAcColor>('primary');
  readonly showThumbLabel = signal(true);
  readonly step = signal(1);
  controlBinding = 'sliderExample';
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
  readonly errorMessage = signal('Das Feld enthält keinen gültigen Wert');
  readonly max = signal(100);
  readonly min = signal(0);
  readonly controlValidators = signal<ValidatorFn[]>([]);
  errorCallback = exampleErrorCallback;
  emptyCallback = emptyErrorCallback;
  errorCallbackString: string = this.errorCallback + '';

  constructor() {
    this.form = new FormGroup<SliderDummyForm>({
      sliderExample: new FormControl<number>(0)
    });
  }

  colorChanged(color: { label: string; value: LuxSliderAcColor }) {
    this.color.set(color.value);
  }

  percentChanged(percent: number) {
    this.percent.set(percent);
    this.log(this.showOutputEvents(), 'Percent changed', percent);
  }

  percentReactiveChanged(percent: number) {
    this.percentReactive.set(percent);
    this.log(this.showOutputEvents(), 'Percent (Reactive Example) changed', percent);
  }

  displayFn(value: number): string {
    if (value && value >= 1000) {
      return Math.round(value / 1000) + 'k';
    }
    return value ? '' + value : '0';
  }

  changeRequired(required: boolean) {
    this.required.set(required);
    setRequiredValidatorForFormControl(required, this.form, this.controlBinding);
  }

  pickValidatorValueFn(selected: any) {
    return selected.value;
  }
}
