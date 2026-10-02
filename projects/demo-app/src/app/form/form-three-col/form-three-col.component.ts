import { JsonPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { form, FormField, required } from '@angular/forms/signals';
import {
  LuxAutocompleteComponent,
  LuxCardComponent,
  LuxCardContentComponent,
  LuxCheckboxComponent,
  LuxInputComponent,
  LuxRadioComponent,
  LuxTextareaComponent
} from '@ihk-gfi/lux-components';
import { debounceTime } from 'rxjs';
import { FormExampleSnapshot, FormExampleStateService } from '../form-example-state.service';
import { ICompanyType } from '../model/company-type.interface';
import { ICountry } from '../model/country.interface';
import { FormBase } from '../model/form-base.class';
import { IGender } from '../model/gender.interface';
import { TableExampleDataProviderService } from '../table-example-data-provider.service';

interface FormThreeColModel {
  customer: {
    name: string;
    surname: string | null;
    gender: string;
  };
  address: {
    zip: string;
    town: string | null;
    country: string | null;
    street: string | null;
  };
  feedback: {
    rating: string;
    comment: string | null;
    anonymous: boolean;
  };
}

type FormThreeColState = FormExampleSnapshot<FormThreeColModel>;

@Component({
  selector: 'app-form-three-col',
  templateUrl: './form-three-col.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    LuxCardContentComponent,
    LuxCardComponent,
    LuxTextareaComponent,
    LuxRadioComponent,
    LuxInputComponent,
    LuxCheckboxComponent,
    LuxAutocompleteComponent,
    FormField,
    JsonPipe
  ]
})
export class FormThreeColComponent extends FormBase {
  private dataProvider = inject(TableExampleDataProviderService);

  countries: ICountry[] = this.dataProvider.countries;
  types: ICompanyType[] = this.dataProvider.companyTypes;
  genders: IGender[] = this.dataProvider.genders;
  readonly pickGenderValue = (gender: IGender) => gender.short;

  readonly model = signal<FormThreeColModel>({
    customer: { name: '', surname: null, gender: this.genders[0].short },
    address: { zip: '', town: null, country: null, street: null },
    feedback: { rating: '', comment: null, anonymous: false }
  });

  readonly myForm = form(this.model, (path) => {
    required(path.customer.name, { message: 'Bitte einen Namen eingeben' });
    required(path.address.zip, { message: 'Bitte eine PLZ eingeben' });
    required(path.feedback.rating, { message: 'Bitte eine Bewertung eingeben' });
  });

  private readonly destroyRef = inject(DestroyRef);
  private readonly state = inject(FormExampleStateService);

  constructor() {
    super();

    const snapshot = this.state.get<FormThreeColState>('three');
    if (snapshot) {
      this.model.set(snapshot.rawValue);
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

  private saveState(): void {
    this.state.save<FormThreeColState>('three', { rawValue: this.model(), dirty: this.myForm().dirty() });
  }
}
