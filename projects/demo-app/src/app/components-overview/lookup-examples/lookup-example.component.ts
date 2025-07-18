import { Directive, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import {
    LuxBehandlungsOptionenUngueltige,
    LuxFieldValues,
    LuxLookupCompareFn,
    luxLookupCompareKeyFn,
    luxLookupCompareKurzTextFn,
    LuxLookupHandlerService,
    LuxLookupParameters,
    LuxLookupTableEntry
} from '@ihk-gfi/lux-components';
import {
    emptyErrorCallback,
    exampleErrorCallback,
    logResult,
    setRequiredValidatorForFormControl
} from '../../example-base/example-base-util/example-base-helper';

interface LookupDummyForm {
  lookup: FormControl<LuxLookupTableEntry | LuxLookupTableEntry[] | null>;
}

@Directive()
export abstract class LookupExampleComponent implements OnInit {
  protected lookupHandler = inject(LuxLookupHandlerService);

  options = [
    { label: LuxBehandlungsOptionenUngueltige.ausgrauen, value: 0 },
    { label: LuxBehandlungsOptionenUngueltige.anzeigen, value: 1 },
    { label: LuxBehandlungsOptionenUngueltige.ausblenden, value: 2 }
  ];
  validatorOptions = [
    { value: Validators.minLength(3), label: 'Validators.minLength(3)' },
    { value: Validators.maxLength(10), label: 'Validators.maxLength(10)' },
    { value: Validators.email, label: 'Validators.email' }
  ];
  useErrorMessage = true;
  showOutputEvents = false;
  useRenderFn = false;
  log = logResult;
  form: FormGroup<LookupDummyForm>;
  renderFnString = this.renderFn + '';
  renderProp = 'kurzText';
  renderPropNoPropertyLabel = '---';
  parameters?: LuxLookupParameters;
  selected: any;
  customStyle: object | null = null;
  customInvalidStyle: object | null = null;
  behandlungUngueltige: LuxBehandlungsOptionenUngueltige = LuxBehandlungsOptionenUngueltige.ausgrauen;
  disabled = false;
  controlBinding = 'lookup';
  readonly = false;
  required = false;
  tableNo = '1002';
  label = 'Label';
  hint = 'Optionaler Zusatztext';
  hintShowOnlyOnFocus = false;
  placeholder = 'Placeholder';
  controlValidators: ValidatorFn[] = [];
  errorMessage = 'Das Feld enthält keinen gültigen Wert';
  value: LuxLookupTableEntry | LuxLookupTableEntry[] | null = null;
  errorCallback = exampleErrorCallback;
  emptyCallback = emptyErrorCallback;
  errorCallbackString = this.errorCallback + '';
  compareFn?: LuxLookupCompareFn;

  constructor() {
    this.form = new FormGroup<LookupDummyForm>({
      lookup: new FormControl<LuxLookupTableEntry | LuxLookupTableEntry[] | null>(null)
    });
  }

  abstract reloadDataIntern(): void;

  ngOnInit() {
    this.parameters = new LuxLookupParameters({
      knr: 101,
      fields: [LuxFieldValues.kurz, LuxFieldValues.lang1, LuxFieldValues.lang2]
    });
  }

  reloadData() {
    setTimeout(() => {
      this.reloadDataIntern();
    });
  }

  toggleCompareFn(toggle: boolean) {
    this.compareFn = toggle ? luxLookupCompareKurzTextFn : luxLookupCompareKeyFn;

    this.reloadData();
  }

  renderFn(entry: LuxLookupTableEntry) {
    return '[RenderFn] ' + entry.kurzText;
  }

  changeCustomStyle(event: any) {
    if (event) {
      this.customStyle = { 'text-decoration': 'underline', color: 'green' };
    } else {
      this.customStyle = null;
    }
  }

  changeCustomInvalidStyle(event: any) {
    if (event) {
      this.customInvalidStyle = { 'text-decoration': 'line-through', color: 'red' };
    } else {
      this.customInvalidStyle = null;
    }
  }

  changeOptionUngueltig(event: any) {
    const found = this.options.find((option) => option.value === +event.value);
    if (found) {
      this.behandlungUngueltige = found.label;
    }
  }

  changeRequired(required: boolean) {
    this.required = required;
    setRequiredValidatorForFormControl(required, this.form, this.controlBinding);
  }

  pickValidatorValueFn(selected: any) {
    return selected.value;
  }
}
