import { JsonPipe } from '@angular/common';
import { Component, signal, ChangeDetectionStrategy } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, ValidatorFn } from '@angular/forms';
import {
  LuxAutofocusDirective,
  LuxButtonComponent,
  LuxFormHintComponent,
  LuxFormSelectableBase,
  LuxInputAcComponent,
  LuxSelectAcComponent,
  LuxToggleAcComponent,
  LuxTooltipDirective
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

interface SelectDummyForm {
  selectExample: FormControl<any>;
}

@Component({
  selector: 'lux-select-authentic-example',
  templateUrl: './select-authentic-example.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    LuxButtonComponent,
    LuxToggleAcComponent,
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
    ExampleBaseOptionsActionsComponent,
    LuxTooltipDirective,
    StatusMarkerComponent,
    JsonPipe
  ]
})
export class SelectAuthenticExampleComponent {
  readonly markerTypeNew = DemoMarkerType.New;
  readonly markerTypeUpdated = DemoMarkerType.Updated;
  readonly useErrorMessage = signal(true);
  readonly useCompareWithFn = signal(false);
  readonly useValueFn = signal(false);
  readonly useSimpleArray = signal(false);
  readonly showOutputEvents = signal(false);
  readonly enableFilter = signal(true);
  readonly filterPlaceholder = signal('Filter');
  readonly filterValue = signal('');
  readonly filterClearAriaLabel = signal('Clear filter');
  readonly visibleOptionCount = signal(0);
  readonly keepOptionOrder = signal(false);
  // prettier-ignore
  options: { label: string; value: number }[] = [
    { label: 'Argentinien, Bolivien, Chile, Costa Rica, Dominikanische Republik, Ecuador, El Salvador, Guatemala, Honduras, Kolumbien, Kuba, Mexiko', value: 0 },
    { label: 'Afghanistan, Afghanistan, Afghanistan, Afghanistan, Afghanistan, Afghanistan, Afghanistan, Afghanistan, Afghanistan, Afghanistan', value: 1 },
    { label: 'Albanien', value: 2 },
    { label: 'Algerien, Algerien, Algerien, Algerien, Algerien, Algerien, Algerien, Algerien, Algerien', value: 3 },
    { label: 'Bahamas', value: 4 },
    { label: 'Belgien', value: 5 },
    { label: 'Brasilien', value: 6 },
    { label: 'China', value: 7 },
    { label: 'Deutschland', value: 8 },
    { label: 'Dominikanische Republik', value: 9 },
    { label: 'Elfenbeinküste ', value: 10 },
    { label: 'Gabun', value: 11 },
    { label: 'Griechenland', value: 12 },
    { label: 'Honduras', value: 13 },
    { label: 'Jamaika', value: 14 },
    { label: 'Japan', value: 15 },
    { label: 'Kanada', value: 16 },
    { label: 'Libyen', value: 17 },
    { label: 'Mexiko', value: 18 },
    { label: 'Montenegro', value: 19 },
    { label: 'Neuseeland', value: 20 },
    { label: 'Niederlande', value: 21 },
    { label: 'Norwegen', value: 22 },
    { label: 'Österreich', value: 23 },
    { label: 'Peru', value: 24 },
    { label: 'Polen', value: 25 },
    { label: 'Portugal', value: 26 },
    { label: 'Rumänien', value: 27 },
    { label: 'Russland', value: 28 },
    { label: 'San Marino', value: 29 },
    { label: 'Schweden', value: 30 },
    { label: 'Schweiz', value: 31 },
    { label: 'Singapur', value: 32 },
    { label: 'Spanien', value: 33 },
    { label: 'Südafrika', value: 34 },
    { label: 'Taiwan', value: 35 },
    { label: 'Thailand', value: 36 },
    { label: 'Türkei', value: 37 },
    { label: 'Ukraine', value: 38 },
    { label: 'Vereinigte Staaten', value: 39 },
    { label: 'Weihnachtsinsel', value: 40 },
    { label: 'Zypern', value: 41 }
  ];
  optionsPrimitive: string[] = ['Option #1', 'Option #2', 'Option #3'];
  form: FormGroup<SelectDummyForm>;
  log = logResult;
  readonly labelLongFormat = signal(false);
  controlBinding = 'selectExample';
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
  readonly placeholder = signal('Placeholder');
  readonly controlValidators = signal<ValidatorFn[]>([]);
  readonly errorMessage = signal('Das Feld enthält keinen gültigen Wert');
  readonly value = signal<any>(null);
  readonly multiselectValue = signal<any>(null);
  readonly templateValue = signal<any>(null);
  errorCallback = exampleErrorCallback;
  emptyCallback = emptyErrorCallback;
  pickValueFn = examplePickValueFn;
  compareWithFn = exampleCompareWithFn;
  pickValueFnString: string;
  compareWithFnString: string;
  errorCallbackString: string;
  defaultCompareWith = (o1: any, o2: any) => o1 === o2;

  constructor() {
    this.form = new FormGroup<SelectDummyForm>({
      selectExample: new FormControl<any>(null)
    });

    this.pickValueFnString = '' + this.pickValueFn;
    this.compareWithFnString = '' + this.compareWithFn;
    this.errorCallbackString = '' + this.errorCallback;
  }

  showErrors(...comps: LuxFormSelectableBase[]) {
    this.value.set(null);
    this.multiselectValue.set(null);
    this.templateValue.set(null);
    this.form.get(this.controlBinding)!.setValue(null);

    this.changeRequired(true);

    comps.forEach((comp: LuxFormSelectableBase) => {
      comp.formControl.markAsTouched();
    });
  }

  changeRequired(required: boolean) {
    this.required.set(required);
    setRequiredValidatorForFormControl(required, this.form, this.controlBinding);
  }

  pickValidatorValueFn(selected: any) {
    return selected.value;
  }

  changeUseSimpleArray(useSimpleArray: boolean) {
    this.reset();
    if (useSimpleArray) {
      this.useValueFn.set(false);
      this.useCompareWithFn.set(false);
    }
  }

  changeUseValueFn(useValueFn: boolean) {
    this.reset();
    if (useValueFn) {
      this.useSimpleArray.set(false);
      this.useCompareWithFn.set(false);
    }
  }

  changeCompareWithFn(useCompareWithfn: boolean) {
    this.reset();
    if (useCompareWithfn) {
      this.useSimpleArray.set(false);
      this.useValueFn.set(false);
    }
  }

  reset(...comps: LuxFormSelectableBase[]) {
    this.value.set(undefined);
    this.multiselectValue.set(undefined);
    this.templateValue.set(undefined);
    this.form.get(this.controlBinding)!.setValue(undefined);

    comps.forEach((comp: LuxFormSelectableBase) => {
      comp.formControl.markAsUntouched();
    });
  }
}
