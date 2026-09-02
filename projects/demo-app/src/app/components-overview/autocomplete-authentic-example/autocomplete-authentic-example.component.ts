import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
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
import { TranslocoDatePipe } from '@jsverse/transloco-locale';
import { StatusMarkerComponent } from '../../base/status-marker/status-marker.component';
import { DemoMarkerType } from '../../base/status-marker/status-marker.model';
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
  changeDetection: ChangeDetectionStrategy.OnPush,
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
    LuxAutofocusDirective,
    TranslocoDatePipe,
    StatusMarkerComponent
  ]
})
export class AutocompleteAuthenticExampleComponent {
  readonly useErrorMessage = signal(true);
  readonly showOutputEvents = signal(false);
  readonly showPrefix = signal(false);
  readonly showSuffix = signal(false);
  readonly useStringValues = signal(false);
  readonly denseFormat = signal(false);
  readonly clearable = signal(false);
  readonly longOptionLabel =
    'Lorem ipsum dolor \n sit amet consectetur adipisicing elit. Nulla officiis consectetur natus id iusto asperiores cum eum sint esse in?';
  readonly toggleOptions = signal(true);
  readonly optionBlockSize = signal(500);
  readonly options: AutocompleteAcExampleOption[] = this.createOption();
  readonly options2: AutocompleteAcExampleOption[] = [
    { label: 'Meine Aufgaben 2', short: 'MA2', value: 'A2', gueltigAb: new Date(2024, 0, 1) },
    { label: 'Gruppenaufgaben 2', short: 'GA2', value: 'B2', gueltigAb: new Date(2024, 0, 1) },
    { label: 'Zurückgestellte Aufgaben 2', short: 'ZA2', value: 'C2', gueltigAb: new Date(2024, 0, 1) },
    { label: 'Vertretungsaufgaben 2', short: 'VA2', value: 'D2', gueltigAb: new Date(2024, 0, 1) }
  ];
  readonly stringOptions = this.options.map((option) => option.label);
  readonly stringOptions2 = ['Nur eine Option'];
  readonly selectedOptions = computed(() => {
    if (this.useStringValues()) return this.toggleOptions() ? this.stringOptions : this.stringOptions2;

    return this.toggleOptions() ? this.options : this.options2;
  });

  readonly renderProperties: RenderPropertyItem[] = [
    { label: 'Bezeichnung (normal)', value: 'label' },
    { label: 'Bezeichnung (kurz)', value: 'short' },
    { label: 'Wert', value: 'value' }
  ];
  readonly validatorOptions = [
    { value: Validators.minLength(3), label: 'Validators.minLength(3)' },
    { value: Validators.maxLength(10), label: 'Validators.maxLength(10)' },
    { value: Validators.email, label: 'Validators.email' }
  ];
  readonly form = new FormGroup<AutocompleteForm>({
    autocompleteExample: new FormControl<string | null>(null)
  });
  readonly log = logResult;
  readonly labelLongFormat = signal(false);
  readonly value = signal<AutocompleteAcExampleOption | string | null>(null);
  readonly controlBinding = 'autocompleteExample';
  readonly renderProperty = signal('label');
  readonly label = signal('Label');
  readonly hint = signal('Optionaler Zusatztext');
  readonly hintShowOnlyOnFocus = signal(false);
  readonly noTopLabel = signal(false);
  readonly noBottomLabel = signal(false);
  readonly noLabels = signal(false);
  readonly markerTypeUpdated = DemoMarkerType.Updated;
  readonly placeholder = signal('Placeholder');
  readonly disabled = signal(false);
  readonly readonly = signal(false);
  readonly required = signal(false);
  readonly strict = signal(true);
  readonly selectAllOnClick = signal(true);
  readonly delay = signal(500);
  readonly controlValidators = signal<ValidatorFn[]>([]);
  readonly errorMessageNotAnOption = signal('Der eingegebene Wert ist nicht Teil der Auswahl.');
  readonly errorMessage = signal('Das Feld enthält keinen gültigen Wert');
  readonly errorCallback = exampleErrorCallback;
  readonly emptyCallback = emptyErrorCallback;
  readonly errorCallbackString = this.errorCallback + '';
  readonly usePickValueFn = signal(false);
  readonly pickValueFn = examplePickValueFn;
  readonly useFilterFn = signal(false);
  readonly luxPanelWidth = signal<string | number>('');
  readonly useTemplatesForLabels = signal(false);
  readonly useTranslocoDate = signal(false);

  onRenderProperty(renderProperty: RenderPropertyItem) {
    this.renderProperty.set(renderProperty.value);
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
    this.required.set(required);
    setRequiredValidatorForFormControl(required, this.form, this.controlBinding);
  }

  private createOption() {
    const options = [
      { label: 'Meine Aufgaben', short: 'MA', value: 'A', gueltigAb: new Date(2024, 0, 1) },
      { label: 'Gruppenaufgaben', short: 'GA', value: 'B', gueltigAb: new Date(2024, 0, 1) },
      { label: 'Zurückgestellte Aufgaben', short: 'ZA', value: 'C', gueltigAb: new Date(2024, 0, 1) },
      { label: this.longOptionLabel, short: 'LI', value: 'D', gueltigAb: new Date(2024, 0, 1) },
      { label: 'Vertretungsaufgaben', short: 'VA', value: 'F', gueltigAb: new Date(2024, 0, 1) },
      { label: this.longOptionLabel, short: 'L2', value: 'L2', gueltigAb: new Date(2024, 0, 1) },
      { label: this.longOptionLabel, short: 'L3', value: 'L3', gueltigAb: new Date(2024, 0, 1) },
      { label: 'Neue Aufgaben', short: 'NA', value: 'G', gueltigAb: new Date(2024, 0, 1) },
      { label: 'Extraaufgaben', short: 'EA', value: 'H', gueltigAb: new Date(2024, 0, 1) },
      { label: 'Optionale Aufgaben', short: 'ZA', value: 'I', gueltigAb: new Date(2024, 0, 1) }
    ];

    for (let i = 0; i < 2000; i++) {
      const number = `${i}`.padStart(5, '0');
      options.push({ label: 'Lorem ipsum ' + number, short: 'LI_' + number, value: 'Li_' + number, gueltigAb: new Date(2024, 0, 1) });
    }

    return options;
  }
}
