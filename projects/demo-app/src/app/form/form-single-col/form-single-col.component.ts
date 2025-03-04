import { JsonPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  LuxAutocompleteAcComponent,
  LuxCardComponent,
  LuxCardContentComponent,
  LuxChipAcComponent,
  LuxChipsAcComponent,
  LuxDatepickerAcComponent,
  LuxIconComponent,
  LuxInputAcComponent,
  LuxInputAcSuffixComponent,
  LuxRadioAcComponent,
  LuxSelectAcComponent,
  LuxToggleAcComponent
} from 'lux-components-lib';
import { ICountry } from '../model/country.interface';
import { FormBase } from '../model/form-base.class';
import { IGender } from '../model/gender.interface';
import { IRole } from '../model/roles.interface';
import { TableExampleDataProviderService } from '../table-example-data-provider.service';

interface FormSingleDummyForm {
  user: FormGroup<FormSingleUserForm>;
  date: FormControl<string>;
  roles: FormControl<string>;
  eula: FormControl<boolean>;
}

interface FormSingleUserForm {
  name: FormControl<string>;
  email: FormControl<string>;
  password: FormControl<string | null>;
  salutation: FormControl<string | null>;
  gender: FormControl<string>;
  age: FormControl<number | null>;
  country: FormControl<string | null>;
  deactivated: FormControl<string>;
}

@Component({
  selector: 'app-form-single-col',
  templateUrl: './form-single-col.component.html',
  imports: [
    LuxIconComponent,
    LuxCardContentComponent,
    LuxCardComponent,
    LuxToggleAcComponent,
    LuxSelectAcComponent,
    LuxRadioAcComponent,
    LuxInputAcSuffixComponent,
    LuxInputAcComponent,
    LuxDatepickerAcComponent,
    LuxChipsAcComponent,
    LuxChipAcComponent,
    LuxAutocompleteAcComponent,
    ReactiveFormsModule,
    JsonPipe
  ]
})
export class FormSingleColComponent extends FormBase {
  private dataProvider = inject(TableExampleDataProviderService);

  myGroup: FormGroup<FormSingleDummyForm>;
  roles: IRole[] = [];
  countries: ICountry[] = [];
  genders: IGender[] = [];
  salutations: string[] = [];

  constructor() {
    super();

    this.roles = this.dataProvider.roles;
    this.countries = this.dataProvider.countries;
    this.genders = this.dataProvider.genders;
    this.salutations = this.dataProvider.salutations;

    this.myGroup = new FormGroup<FormSingleDummyForm>({
      user: new FormGroup<FormSingleUserForm>({
        name: new FormControl<string>('', {
          validators: Validators.compose([Validators.required, Validators.minLength(3), Validators.pattern('[a-zA-Z0-9]*')]),
          nonNullable: true
        }),
        email: new FormControl<string>('', { validators: Validators.compose([Validators.required, Validators.email]), nonNullable: true }),
        password: new FormControl<string | null>(''),
        salutation: new FormControl<string | null>(''),
        gender: new FormControl<string>('', { validators: Validators.required, nonNullable: true }),
        age: new FormControl<number | null>(null, { validators: Validators.compose([Validators.min(18), Validators.max(100)]) }),
        country: new FormControl<string | null>(null),
        deactivated: new FormControl<string>('deaktiviertes Element', { nonNullable: true })
      }),
      date: new FormControl<string>('', { validators: Validators.required, nonNullable: true }),
      roles: new FormControl<string>('', { validators: Validators.required, nonNullable: true }),
      eula: new FormControl<boolean>(false, { validators: Validators.requiredTrue, nonNullable: true })
    });
  }

  hasUnsavedData(): boolean {
    return this.myGroup.dirty;
  }

  addRole(name: string) {
    this.roles.push({ name });
  }

  removeRole(i: number) {
    this.roles = this.roles.filter((_role, index) => index !== i);
  }
}
