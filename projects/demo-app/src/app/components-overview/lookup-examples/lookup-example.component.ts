import { Directive, inject, signal, OnInit } from '@angular/core';
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
  readonly useErrorMessage = signal(true);
  readonly showOutputEvents = signal(false);
  readonly useRenderFn = signal(false);
  log = logResult;
  form: FormGroup<LookupDummyForm>;
  renderFnString = this.renderFn + '';
  readonly renderProp = signal('kurzText');
  readonly renderPropNoPropertyLabel = signal('---');
  readonly parameters = signal<LuxLookupParameters | undefined>(undefined);
  readonly customStyle = signal<object | null>(null);
  readonly customInvalidStyle = signal<object | null>(null);
  readonly behandlungUngueltige = signal<LuxBehandlungsOptionenUngueltige>(LuxBehandlungsOptionenUngueltige.ausgrauen);
  readonly disabled = signal(false);
  controlBinding = 'lookup';
  readonly readonly = signal(false);
  readonly required = signal(false);
  readonly tableNo = signal('1002');
  readonly label = signal('Label');
  readonly hint = signal('Optionaler Zusatztext');
  readonly hintShowOnlyOnFocus = signal(false);
  readonly placeholder = signal('Placeholder');
  readonly controlValidators = signal<ValidatorFn[]>([]);
  readonly errorMessage = signal('Das Feld enthält keinen gültigen Wert');
  readonly value = signal<LuxLookupTableEntry | LuxLookupTableEntry[] | null>(null);
  errorCallback = exampleErrorCallback;
  emptyCallback = emptyErrorCallback;
  errorCallbackString = this.errorCallback + '';
  readonly compareFn = signal<LuxLookupCompareFn | undefined>(undefined);

  protected lookupHandler = inject(LuxLookupHandlerService);

  constructor() {
    this.form = new FormGroup<LookupDummyForm>({
      lookup: new FormControl<LuxLookupTableEntry | LuxLookupTableEntry[] | null>(null)
    });
  }

  ngOnInit() {
    this.parameters.set(
      new LuxLookupParameters({
        knr: 101,
        fields: [LuxFieldValues.kurz, LuxFieldValues.lang1, LuxFieldValues.lang2]
      })
    );
  }

  reloadData() {
    setTimeout(() => {
      this.reloadDataIntern();
    });
  }

  toggleCompareFn(toggle: boolean) {
    this.compareFn.set(toggle ? luxLookupCompareKurzTextFn : luxLookupCompareKeyFn);

    this.reloadData();
  }

  renderFn(entry: LuxLookupTableEntry) {
    return '[RenderFn] ' + entry.kurzText;
  }

  changeCustomStyle(event: any) {
    if (event) {
      this.customStyle.set({ 'text-decoration': 'underline', color: 'green' });
    } else {
      this.customStyle.set(null);
    }
  }

  changeCustomInvalidStyle(event: any) {
    if (event) {
      this.customInvalidStyle.set({ 'text-decoration': 'line-through', color: 'red' });
    } else {
      this.customInvalidStyle.set(null);
    }
  }

  changeOptionUngueltig(event: any) {
    const found = this.options.find((option) => option.value === +event.value);
    if (found) {
      this.behandlungUngueltige.set(found.label);
    }
  }

  changeRequired(required: boolean) {
    this.required.set(required);
    setRequiredValidatorForFormControl(required, this.form, this.controlBinding);
  }

  pickValidatorValueFn(selected: any) {
    return selected.value;
  }

  abstract reloadDataIntern(): void;
}
