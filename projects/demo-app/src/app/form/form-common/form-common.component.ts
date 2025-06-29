import { JsonPipe, LowerCasePipe, UpperCasePipe } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import {
    LuxAutocompleteAcComponent,
    LuxAutofocusDirective,
    LuxCardComponent,
    LuxCardContentComponent,
    LuxCheckboxAcComponent,
    LuxChipAcComponent,
    LuxChipAcGroupComponent,
    LuxChipsAcComponent,
    LuxConsoleService,
    LuxDatepickerAcComponent,
    LuxIconComponent,
    LuxInputAcComponent,
    LuxInputAcPrefixComponent,
    LuxInputAcSuffixComponent,
    LuxRadioAcComponent,
    LuxSelectAcComponent,
    LuxTextareaAcComponent,
    LuxToggleAcComponent
} from '@ihk-gfi/lux-components';
import { FormBase } from '../model/form-base.class';

interface FormCommonOption {
  label: string;
  value: string;
}

interface FormCommonDummy {
  user: FormGroup<FormCommonUser>;
  description: FormControl<string | null>;
  newsletter: FormControl<boolean | null>;
  hobbies: FormControl<string[] | null>;
  donation: FormControl<number | null>;
  hungry: FormControl<boolean | null>;
  chipsDeletable: FormControl<string[] | null>;
  chipsFix: FormControl<string[] | null>;
  radio: FormControl<FormCommonOption | null>;
  datepicker: FormControl<string | null>;
  autocomplete: FormControl<string>;
}

interface FormCommonUser {
  firstname: FormControl<string>;
  lastname: FormControl<string>;
  email: FormControl<string>;
  password: FormControl<string>;
}

@Component({
  selector: 'app-form-common',
  templateUrl: './form-common.component.html',
  imports: [
    LuxIconComponent,
    LuxCardContentComponent,
    LuxCardComponent,
    LuxToggleAcComponent,
    LuxTextareaAcComponent,
    LuxSelectAcComponent,
    LuxRadioAcComponent,
    LuxInputAcSuffixComponent,
    LuxInputAcPrefixComponent,
    LuxInputAcComponent,
    LuxDatepickerAcComponent,
    LuxChipsAcComponent,
    LuxChipAcGroupComponent,
    LuxChipAcComponent,
    LuxCheckboxAcComponent,
    LuxAutocompleteAcComponent,
    LuxAutofocusDirective,
    ReactiveFormsModule,
    UpperCasePipe,
    LowerCasePipe,
    JsonPipe
  ]
})
export class FormCommonComponent extends FormBase implements OnInit {
  private logger = inject(LuxConsoleService);

  myGroup!: FormGroup<FormCommonDummy>;

  hobbies: FormCommonOption[] = [
    { label: 'Reiten', value: 'r' },
    { label: 'Fußball', value: 'f' },
    { label: 'Handball', value: 'h' },
    { label: 'Stricken', value: 's' }
  ];
  chipItems: string[] = [];
  chipItems2: string[] = [];

  constructor() {
    super();

    this.chipItems = ['Chip #1', 'Chip #2'];
    this.chipItems2 = ['Chip #3', 'Chip #4'];
  }

  ngOnInit() {
    this.myGroup = new FormGroup<FormCommonDummy>({
      user: new FormGroup<FormCommonUser>({
        firstname: new FormControl<string>('', { validators: Validators.pattern('[a-zA-Z0-9]*'), nonNullable: true }),
        lastname: new FormControl<string>('', {
          validators: Validators.compose([Validators.required, Validators.minLength(3)]),
          nonNullable: true
        }),
        email: new FormControl<string>('', { validators: Validators.compose([Validators.required, Validators.email]), nonNullable: true }),
        password: new FormControl<string>('', { nonNullable: true })
      }),
      description: new FormControl<string | null>(''),
      newsletter: new FormControl<boolean | null>(true),
      hobbies: new FormControl<string[] | null>([]),
      donation: new FormControl<number | null>(0, Validators.compose([Validators.min(0), Validators.max(1000)])),
      hungry: new FormControl<boolean | null>(true),
      chipsDeletable: new FormControl<string[] | null>([...this.chipItems]),
      chipsFix: new FormControl<string[] | null>([...this.chipItems2]),
      radio: new FormControl<FormCommonOption | null>(this.hobbies[2]),
      datepicker: new FormControl<string | null>(new Date(2018, 11, 1).toISOString()),
      autocomplete: new FormControl<string>(this.chipItems2[1], { validators: Validators.required, nonNullable: true })
    });
    this.myGroup.get('description')?.disable();
  }

  hasUnsavedData(): boolean {
    return this.myGroup.dirty;
  }

  show() {
    this.logger.log(this.myGroup.value);
  }

  chipItemClicked(index: number) {
    this.logger.log(index);
    this.logger.log(this.myGroup.value);
  }
}
