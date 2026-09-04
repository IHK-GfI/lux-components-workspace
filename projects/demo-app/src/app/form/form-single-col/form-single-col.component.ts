import { JsonPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  LuxAutocompleteComponent,
  LuxCardComponent,
  LuxCardContentComponent,
  LuxChipComponent,
  LuxChipsComponent,
  LuxDatepickerComponent,
  LuxIconComponent,
  LuxInputComponent,
  LuxInputSuffixComponent,
  LuxRadioComponent,
  LuxSelectComponent,
  LuxToggleComponent
} from '@ihk-gfi/lux-components';
import { debounceTime } from 'rxjs';
import { FormExampleSnapshot, FormExampleStateService } from '../form-example-state.service';
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

interface FormSingleState extends FormExampleSnapshot<ReturnType<FormGroup<FormSingleDummyForm>['getRawValue']>> {
  roles: IRole[];
}

@Component({
  selector: 'app-form-single-col',
  templateUrl: './form-single-col.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    LuxIconComponent,
    LuxCardContentComponent,
    LuxCardComponent,
    LuxToggleComponent,
    LuxSelectComponent,
    LuxRadioComponent,
    LuxInputSuffixComponent,
    LuxInputComponent,
    LuxDatepickerComponent,
    LuxChipsComponent,
    LuxChipComponent,
    LuxAutocompleteComponent,
    ReactiveFormsModule,
    JsonPipe
  ]
})
export class FormSingleColComponent extends FormBase {
  myGroup: FormGroup<FormSingleDummyForm>;
  readonly roles = signal<IRole[]>([]);
  countries: ICountry[] = [];
  genders: IGender[] = [];
  salutations: string[] = [];
  readonly pickGenderValue = (gender: IGender) => gender.short;

  private dataProvider = inject(TableExampleDataProviderService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly state = inject(FormExampleStateService);

  constructor() {
    super();

    this.roles.set(this.dataProvider.roles);
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

    const snapshot = this.state.get<FormSingleState>('single');
    if (snapshot) {
      this.myGroup.patchValue(snapshot.rawValue, { emitEvent: false });
      this.roles.set(snapshot.roles);
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

  addRole(name: string) {
    this.roles.update((roles) => [...roles, { name }]);
    this.saveState();
  }

  removeRole(i: number) {
    this.roles.update((roles) => roles.filter((_role, index) => index !== i));
    this.saveState();
  }

  private saveState(): void {
    this.state.save<FormSingleState>('single', {
      rawValue: this.myGroup.getRawValue(),
      dirty: this.myGroup.dirty,
      roles: this.roles()
    });
  }
}
