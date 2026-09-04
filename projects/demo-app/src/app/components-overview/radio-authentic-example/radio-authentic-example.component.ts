import { JsonPipe } from '@angular/common';
import { Component, signal, ChangeDetectionStrategy } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import {
  LuxAutofocusDirective,
  LuxButtonComponent,
  LuxFormHintComponent,
  LuxInputComponent,
  LuxRadioComponent,
  LuxToggleComponent
} from '@ihk-gfi/lux-components';
import { StatusMarkerComponent } from '../../base/status-marker/status-marker.component';
import { DemoMarkerType } from '../../base/status-marker/status-marker.model';
import { ExampleBaseContentComponent } from '../../example-base/example-base-root/example-base-subcomponents/example-base-content/example-base-content.component';
import { ExampleBaseAdvancedOptionsComponent } from '../../example-base/example-base-root/example-base-subcomponents/example-base-options/example-base-advanced-options.component';
import { ExampleBaseOptionsActionsComponent } from '../../example-base/example-base-root/example-base-subcomponents/example-base-options/example-base-options-actions.component';
import { ExampleBaseSimpleOptionsComponent } from '../../example-base/example-base-root/example-base-subcomponents/example-base-options/example-base-simple-options.component';
import { ExampleBaseStructureComponent } from '../../example-base/example-base-root/example-base-subcomponents/example-base-structure/example-base-structure.component';
import {
  emptyErrorCallback,
  exampleCompareWithFn,
  exampleErrorCallback,
  examplePickValueFn,
  logResult,
  setRequiredValidatorForFormControl
} from '../../example-base/example-base-util/example-base-helper';
import { ExampleFormDisableComponent } from '../../example-base/example-form-disable/example-form-disable.component';
import { ExampleFormValueComponent } from '../../example-base/example-form-value/example-form-value.component';
import { ExampleValueComponent } from '../../example-base/example-value/example-value.component';

interface RadioDummyForm {
  radioExample: FormControl;
}

@Component({
  selector: 'lux-radio-authentic-example',
  templateUrl: './radio-authentic-example.component.html',
  styleUrls: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    LuxButtonComponent,
    LuxToggleComponent,
    LuxRadioComponent,
    LuxInputComponent,
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
    ExampleBaseOptionsActionsComponent,
    JsonPipe,
    StatusMarkerComponent
  ]
})
export class RadioAuthenticExampleComponent {
  readonly useErrorMessage = signal(true);
  readonly useTemplatesForLabels = signal(false);
  readonly useCompareWithFn = signal(false);
  readonly useValueFn = signal(false);
  readonly useSimpleArray = signal(false);
  readonly showOutputEvents = signal(false);
  options: { label: string; value: number; disabled?: boolean }[] = [
    { label: 'Option #1', value: 1, disabled: true },
    { label: 'Option #2', value: 2 },
    { label: 'Option #3', value: 3 }
  ];
  readonly optionsPrimitive: string[] = ['Option #1', 'Option #2', 'Option #3'];
  readonly form: FormGroup<RadioDummyForm>;
  log = logResult;
  readonly controlBinding = 'radioExample';
  readonly disabled = signal(false);
  readonly disabledFirst = signal(true);
  readonly readonly = signal(false);
  readonly required = signal(false);
  readonly isVertical = signal(false);
  readonly label = signal('Label');
  readonly hint = signal('Optionaler Zusatztext');
  readonly hintShowOnlyOnFocus = signal(false);
  readonly noTopLabel = signal(false);
  readonly noBottomLabel = signal(false);
  readonly noLabels = signal(false);
  readonly markerTypeUpdated = DemoMarkerType.Updated;
  readonly errorMessage = signal('Das Feld enthält keinen gültigen Wert');
  readonly value = signal<any>(undefined);
  readonly groupNameReactive = signal('reactiveGroup');
  readonly groupNameNormal = signal('normalGroup');
  readonly errorCallback = exampleErrorCallback;
  readonly emptyCallback = emptyErrorCallback;
  readonly pickValueFn = examplePickValueFn;
  readonly compareWithFn = exampleCompareWithFn;
  readonly pickValueFnString: string;
  readonly compareWithFnString: string;
  readonly errorCallbackString: string;
  readonly labelLongFormat = signal(false);
  readonly denseFormat = signal(false);

  constructor() {
    this.form = new FormGroup<RadioDummyForm>({
      radioExample: new FormControl()
    });

    this.pickValueFnString = '' + this.pickValueFn;
    this.compareWithFnString = '' + this.compareWithFn;
    this.errorCallbackString = '' + this.errorCallback;
  }

  showErrors(...radioComponents: LuxRadioComponent[]) {
    this.value.set(null);
    this.form.get('radioExample')!.setValue(null);

    this.changeRequired(true);

    radioComponents.forEach((comp: LuxRadioComponent) => {
      comp.formControl.markAsTouched();
    });
  }

  changeRequired(required: boolean) {
    this.required.set(required);
    setRequiredValidatorForFormControl(required, this.form, this.controlBinding);
  }

  changeUseSimpleArray($event: boolean) {
    this.reset();
    if ($event === true) {
      this.useValueFn.set(false);
      this.useCompareWithFn.set(false);
      this.disabledFirst.set(false);
    }
  }

  changeUseValueFn($event: boolean) {
    this.reset();
    if ($event === true) {
      this.useSimpleArray.set(false);
      this.useCompareWithFn.set(false);
    }
  }

  changeCompareWithFn($event: boolean) {
    this.reset();
    if ($event === true) {
      this.useSimpleArray.set(false);
      this.useValueFn.set(false);
    }
  }

  reset(...radioComponents: LuxRadioComponent[]) {
    this.value.set(undefined);
    this.form.get(this.controlBinding)!.setValue(undefined);
    this.disabledFirst.set(false);

    radioComponents.forEach((comp: LuxRadioComponent) => {
      comp.formControl.markAsUntouched();
    });
  }

  onToggleDisabledFirst() {
    this.options[0].disabled = this.disabledFirst();
  }

  onRefresh() {
    this.options = JSON.parse(JSON.stringify(this.options));
  }
}
