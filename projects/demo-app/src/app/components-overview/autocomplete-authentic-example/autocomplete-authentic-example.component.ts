import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, ValidatorFn, Validators } from '@angular/forms';
import {
    LuxAutocompleteAcComponent,
    LuxAutofocusDirective,
    LuxFormHintComponent,
    LuxIconComponent,
    LuxInputAcComponent,
    LuxInputAcPrefixComponent,
    LuxInputAcSuffixComponent,
    LuxSelectAcComponent,
    LuxToggleAcComponent
} from '@ihk-gfi/lux-components';
import { ExampleBaseContentComponent } from '../../example-base/example-base-root/example-base-subcomponents/example-base-content/example-base-content.component';
import { ExampleBaseAdvancedOptionsComponent } from '../../example-base/example-base-root/example-base-subcomponents/example-base-options/example-base-advanced-options.component';
import { ExampleBaseSimpleOptionsComponent } from '../../example-base/example-base-root/example-base-subcomponents/example-base-options/example-base-simple-options.component';
import { ExampleBaseStructureComponent } from '../../example-base/example-base-root/example-base-subcomponents/example-base-structure/example-base-structure.component';
import {
    emptyErrorCallback,
    exampleErrorCallback,
    examplePickValueFn,
    logResult,
    setRequiredValidatorForFormControl
} from '../../example-base/example-base-util/example-base-helper';
import { ExampleFormDisableComponent } from '../../example-base/example-form-disable/example-form-disable.component';
import { ExampleFormValueComponent } from '../../example-base/example-form-value/example-form-value.component';
import { ExampleValueComponent } from '../../example-base/example-value/example-value.component';
import { AutocompleteAcExampleOption } from './autocomplete-authentic-example-option';
import { RenderPropertyItem } from './render-property-item';

interface AutocompleteForm {
  autocompleteExample: FormControl<string | null>;
}

@Component({
  selector: 'lux-autocomplete-authentic-example',
  templateUrl: './autocomplete-authentic-example.component.html',
  styleUrls: [],
  imports: [
    LuxIconComponent,
    ExampleBaseStructureComponent,
    ExampleBaseContentComponent,
    ExampleValueComponent,
    ReactiveFormsModule,
    ExampleFormValueComponent,
    ExampleBaseSimpleOptionsComponent,
    ExampleFormDisableComponent,
    ExampleBaseAdvancedOptionsComponent,
    LuxAutocompleteAcComponent,
    LuxFormHintComponent,
    LuxInputAcComponent,
    LuxInputAcPrefixComponent,
    LuxInputAcSuffixComponent,
    LuxSelectAcComponent,
    LuxToggleAcComponent,
    LuxAutofocusDirective
  ]
})
export class AutocompleteAuthenticExampleComponent {
  useErrorMessage = true;
  showOutputEvents = false;
  showPrefix = false;
  showSuffix = false;
  useStringValues = false;
  denseFormat = false;
  longOptionLabel =
    'Lorem ipsum dolor \n sit amet consectetur adipisicing elit. Nulla officiis consectetur natus id iusto asperiores cum eum sint esse in?';
  toggleOptions = true;
  optionBlockSize = 500;
  options: AutocompleteAcExampleOption[] = this.createOption();
  options2: AutocompleteAcExampleOption[] = [
    { label: 'Meine Aufgaben 2', short: 'MA2', value: 'A2' },
    { label: 'Gruppenaufgaben 2', short: 'GA2', value: 'B2' },
    { label: 'Zurückgestellte Aufgaben 2', short: 'ZA2', value: 'C2' },
    { label: 'Vertretungsaufgaben 2', short: 'VA2', value: 'D2' }
  ];
  stringOptions = this.options.map((o) => o.label);
  stringOptions2 = this.options2.map((o) => o.label);

  renderProperties: RenderPropertyItem[] = [
    { label: 'Bezeichnung (normal)', value: 'label' },
    { label: 'Bezeichnung (kurz)', value: 'short' },
    { label: 'Wert', value: 'value' }
  ];
  validatorOptions = [
    { value: Validators.minLength(3), label: 'Validators.minLength(3)' },
    { value: Validators.maxLength(10), label: 'Validators.maxLength(10)' },
    { value: Validators.email, label: 'Validators.email' }
  ];
  form: FormGroup<AutocompleteForm>;
  log = logResult;
  labelLongFormat = false;
  value: AutocompleteAcExampleOption | string | null = null;
  controlBinding = 'autocompleteExample';
  renderProperty = 'label';
  label = 'Label';
  hint = 'Optionaler Zusatztext';
  hintShowOnlyOnFocus = false;
  placeholder = 'Placeholder';
  disabled = false;
  readonly = false;
  required = false;
  strict = true;
  selectAllOnClick = true;
  delay = 500;
  controlValidators: ValidatorFn[] = [];
  errorMessageNotAnOption = 'Der eingegebene Wert ist nicht Teil der Auswahl.';
  errorMessage = 'Das Feld enthält keinen gültigen Wert';
  errorCallback = exampleErrorCallback;
  emptyCallback = emptyErrorCallback;
  errorCallbackString = this.errorCallback + '';
  usePickValueFn = false;
  pickValueFn = examplePickValueFn;
  useFilterFn = false;
  luxPanelWidth: string | number = '';

  constructor() {
    this.form = new FormGroup<AutocompleteForm>({
      autocompleteExample: new FormControl<string | null>(null)
    });
  }

  onRenderProperty(renderProperty: RenderPropertyItem) {
    this.renderProperty = renderProperty.value;
  }

  pickValidatorValueFn(selected: any) {
    return selected.value;
  }

  onFilter(filterText: string, optionLabel: string): boolean {
    const filterTerms = filterText.split(' ');

    let result = true;
    if (filterTerms.length > 1) {
      filterTerms.forEach((term) => (result = result && optionLabel.indexOf(term) >= 0));
    } else {
      result = optionLabel.indexOf(filterTerms[0]) >= 0;
    }

    return result;
  }

  changeRequired(required: boolean) {
    this.required = required;
    setRequiredValidatorForFormControl(required, this.form, this.controlBinding);
  }

  private createOption() {
    const options = [
      { label: 'Meine Aufgaben', short: 'MA', value: 'A' },
      { label: 'Gruppenaufgaben', short: 'GA', value: 'B' },
      { label: 'Zurückgestellte Aufgaben', short: 'ZA', value: 'C' },
      { label: this.longOptionLabel, short: 'LI', value: 'D' },
      { label: 'Vertretungsaufgaben', short: 'VA', value: 'F' },
      { label: this.longOptionLabel, short: 'L2', value: 'L2' },
      { label: this.longOptionLabel, short: 'L3', value: 'L3' },
      { label: 'Neue Aufgaben', short: 'NA', value: 'G' },
      { label: 'Extraaufgaben', short: 'EA', value: 'H' },
      { label: 'Optionale Aufgaben', short: 'ZA', value: 'I' }
    ];

    for (let i = 0; i < 2000; i++) {
      const number = `${i}`.padStart(5, '0');
      options.push({ label: 'Lorem ipsum ' + number, short: 'LI_' + number, value: 'Li_' + number });
    }

    return options;
  }

  getOptions(): any[] {
    if (this.useStringValues) return this.toggleOptions ? this.stringOptions : this.stringOptions2;
    else return this.toggleOptions ? this.options : this.options2;
  }
}
