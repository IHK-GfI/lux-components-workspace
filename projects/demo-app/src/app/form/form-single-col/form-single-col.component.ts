import { JsonPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { disabled, email, form, FormField, max, min, minLength, pattern, required, validate } from '@angular/forms/signals';
import {
  LuxAutocompleteComponent,
  LuxCardComponent,
  LuxCardContentComponent,
  LuxChipComponent,
  LuxChipsComponent,
  LuxDatepickerComponent,
  LuxIconComponent,
  luxRequiredArray,
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

interface FormSingleModel {
  user: {
    name: string;
    email: string;
    password: string | null;
    salutation: string | null;
    gender: string;
    age: number | null;
    country: string | null;
    deactivated: string;
  };
  date: string;
  roles: string[];
  eula: boolean;
}

interface FormSingleState extends FormExampleSnapshot<FormSingleModel> {
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
    FormField,
    JsonPipe
  ]
})
export class FormSingleColComponent extends FormBase {
  private dataProvider = inject(TableExampleDataProviderService);

  readonly roles = signal<IRole[]>(this.dataProvider.roles);
  countries: ICountry[] = this.dataProvider.countries;
  genders: IGender[] = this.dataProvider.genders;
  salutations: string[] = this.dataProvider.salutations;
  readonly pickGenderValue = (gender: IGender) => gender.short;

  readonly model = signal<FormSingleModel>({
    user: {
      name: '',
      email: '',
      password: '',
      salutation: '',
      gender: '',
      age: null,
      country: null,
      deactivated: 'deaktiviertes Element'
    },
    date: '',
    roles: [],
    eula: false
  });

  readonly myForm = form(this.model, (path) => {
    required(path.user.name, { message: 'Bitte einen Namen eingeben' });
    minLength(path.user.name, 3);
    pattern(path.user.name, /^[a-zA-Z0-9]*$/);
    required(path.user.email, { message: 'Bitte eine E-Mail-Adresse eingeben' });
    email(path.user.email);
    required(path.user.gender, { message: 'Bitte ein Geschlecht auswählen' });
    min(path.user.age, 18);
    max(path.user.age, 100);
    disabled(path.user.deactivated);
    required(path.date, { message: 'Bitte ein Datum auswählen' });
    validate(path.roles, luxRequiredArray());
    required(path.eula, { message: 'Bitte den AGBs zustimmen' });
  });

  private readonly destroyRef = inject(DestroyRef);
  private readonly state = inject(FormExampleStateService);

  constructor() {
    super();

    const snapshot = this.state.get<FormSingleState>('single');
    if (snapshot) {
      this.model.set(snapshot.rawValue);
      this.roles.set(snapshot.roles);
      if (snapshot.dirty) {
        this.myForm().markAsDirty();
      }
    }

    toObservable(this.model)
      .pipe(debounceTime(300), takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.saveState());
    this.destroyRef.onDestroy(() => this.saveState());
  }

  hasUnsavedData(): boolean {
    return this.myForm().dirty();
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
      rawValue: this.model(),
      dirty: this.myForm().dirty(),
      roles: this.roles()
    });
  }
}
