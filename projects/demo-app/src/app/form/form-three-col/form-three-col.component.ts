import { JsonPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  LuxAutocompleteAcComponent,
  LuxCardComponent,
  LuxCardContentComponent,
  LuxCheckboxAcComponent,
  LuxInputAcComponent,
  LuxRadioAcComponent,
  LuxTextareaAcComponent
} from '@ihk-gfi/lux-components';
import { debounceTime } from 'rxjs';
import { FormExampleSnapshot, FormExampleStateService } from '../form-example-state.service';
import { ICompanyType } from '../model/company-type.interface';
import { ICountry } from '../model/country.interface';
import { FormBase } from '../model/form-base.class';
import { IGender } from '../model/gender.interface';
import { TableExampleDataProviderService } from '../table-example-data-provider.service';

interface FormThreeColCustomer {
  name: FormControl<string>;
  surname: FormControl<string | null>;
  gender: FormControl<string>;
}

interface FormThreeColAddress {
  zip: FormControl<string>;
  town: FormControl<string | null>;
  country: FormControl<string | null>;
  street: FormControl<string | null>;
}

interface FormThreeColFeedback {
  rating: FormControl<string>;
  comment: FormControl<string | null>;
  anonymous: FormControl<boolean | null>;
}

interface FormThreeColDummyForm {
  customer: FormGroup<FormThreeColCustomer>;
  address: FormGroup<FormThreeColAddress>;
  feedback: FormGroup<FormThreeColFeedback>;
}

type FormThreeColState = FormExampleSnapshot<ReturnType<FormGroup<FormThreeColDummyForm>['getRawValue']>>;

@Component({
  selector: 'app-form-three-col',
  templateUrl: './form-three-col.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    LuxCardContentComponent,
    LuxCardComponent,
    LuxTextareaAcComponent,
    LuxRadioAcComponent,
    LuxInputAcComponent,
    LuxCheckboxAcComponent,
    LuxAutocompleteAcComponent,
    ReactiveFormsModule,
    JsonPipe
  ]
})
export class FormThreeColComponent extends FormBase {
  private dataProvider = inject(TableExampleDataProviderService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly state = inject(FormExampleStateService);

  myGroup: FormGroup<FormThreeColDummyForm>;
  countries: ICountry[] = [];
  types: ICompanyType[] = [];
  genders: IGender[] = [];
  readonly pickGenderValue = (gender: IGender) => gender.short;

  constructor() {
    super();

    this.countries = this.dataProvider.countries;
    this.types = this.dataProvider.companyTypes;
    this.genders = this.dataProvider.genders;

    this.myGroup = new FormGroup<FormThreeColDummyForm>({
      customer: new FormGroup<FormThreeColCustomer>({
        name: new FormControl<string>('', { validators: Validators.required, nonNullable: true }),
        surname: new FormControl<string | null>(null),
        gender: new FormControl<string>(this.genders[0].short, { nonNullable: true })
      }),
      address: new FormGroup<FormThreeColAddress>({
        zip: new FormControl<string>('', { validators: Validators.required, nonNullable: true }),
        town: new FormControl<string | null>(null),
        country: new FormControl<string | null>(null),
        street: new FormControl<string | null>(null)
      }),
      feedback: new FormGroup<FormThreeColFeedback>({
        rating: new FormControl<string>('', { validators: Validators.required, nonNullable: true }),
        comment: new FormControl<string | null>(null),
        anonymous: new FormControl<boolean | null>(false)
      })
    });

    const snapshot = this.state.get<FormThreeColState>('three');
    if (snapshot) {
      this.myGroup.patchValue(snapshot.rawValue, { emitEvent: false });
      if (snapshot.dirty) {
        this.myGroup.markAsDirty({ emitEvent: false });
      }
    }

    this.myGroup.valueChanges.pipe(debounceTime(300), takeUntilDestroyed(this.destroyRef)).subscribe(() => this.saveState());
    this.destroyRef.onDestroy(() => this.saveState());
  }

  hasUnsavedData(): boolean {
    return this.myGroup.dirty;
  }

  private saveState(): void {
    this.state.save<FormThreeColState>('three', { rawValue: this.myGroup.getRawValue(), dirty: this.myGroup.dirty });
  }
}
