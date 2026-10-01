import { JsonPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { applyEach, form, FormField, maxError, min, minError, required, validate } from '@angular/forms/signals';
import {
  LuxAutocompleteComponent,
  LuxButtonComponent,
  LuxCardComponent,
  LuxCardContentComponent,
  LuxDatepickerComponent,
  LuxInputComponent
} from '@ihk-gfi/lux-components';
import { debounceTime } from 'rxjs';
import { FormExampleSnapshot, FormExampleStateService } from '../form-example-state.service';
import { ICountry } from '../model/country.interface';
import { FormBase } from '../model/form-base.class';
import { TableExampleDataProviderService } from '../table-example-data-provider.service';

interface FormDualStreet {
  streetName: string;
  nr: number | null;
}

interface FormDualModel {
  customerDetails: {
    name: string;
    zip: string;
    town: string | null;
    country: string | null;
    streets: FormDualStreet[];
  };
  orderDetails: {
    orderNo: string;
    validDate: string;
    validTime: string | null;
    value: string;
  };
}

type FormDualState = FormExampleSnapshot<FormDualModel>;

@Component({
  selector: 'app-form-dual-col',
  templateUrl: './form-dual-col.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    LuxButtonComponent,
    LuxCardContentComponent,
    LuxCardComponent,
    LuxInputComponent,
    LuxDatepickerComponent,
    LuxAutocompleteComponent,
    FormField,
    JsonPipe
  ]
})
export class FormDualColComponent extends FormBase {
  private dataProvider = inject(TableExampleDataProviderService);

  countries: ICountry[] = this.dataProvider.countries;

  readonly model = signal<FormDualModel>({
    customerDetails: { name: '', zip: '', town: null, country: null, streets: [this.createStreet()] },
    orderDetails: { orderNo: '', validDate: '', validTime: null, value: '' }
  });

  readonly myForm = form(this.model, (path) => {
    required(path.customerDetails.name, { message: 'Bitte einen Namen eingeben' });
    required(path.customerDetails.zip, { message: 'Bitte eine PLZ eingeben' });
    applyEach(path.customerDetails.streets, (street) => {
      required(street.streetName, { message: 'Bitte eine Straße eingeben' });
      min(street.nr, 1);
    });
    required(path.orderDetails.orderNo, { message: 'Bitte eine Bestellnr. eingeben' });
    required(path.orderDetails.validDate, { message: 'Bitte ein Datum auswählen' });
    // luxType="text" -> das Feld ist bewusst string-typisiert, die Wertgrenzen werden daher
    // manuell statt über min()/max() (die einen number-Pfad erwarten) geprüft.
    validate(path.orderDetails.value, ({ value }) => {
      const numericValue = Number(value());
      if (value() === '' || Number.isNaN(numericValue)) {
        return undefined;
      }
      if (numericValue < 1) {
        return minError(1);
      }
      if (numericValue > 1000) {
        return maxError(1000);
      }
      return undefined;
    });
  });

  private readonly destroyRef = inject(DestroyRef);
  private readonly state = inject(FormExampleStateService);

  constructor() {
    super();

    const snapshot = this.state.get<FormDualState>('dual');
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

  addStreet() {
    this.model.update((m) => ({
      ...m,
      customerDetails: { ...m.customerDetails, streets: [...m.customerDetails.streets, this.createStreet()] }
    }));
  }

  removeStreet(index: number) {
    this.model.update((m) => ({
      ...m,
      customerDetails: { ...m.customerDetails, streets: m.customerDetails.streets.filter((_street, i) => i !== index) }
    }));
  }

  latestStreetGroupValid(): boolean {
    const streets = this.myForm.customerDetails.streets;
    if (streets.length > 0) {
      return streets[streets.length - 1]().valid();
    }
    return true;
  }

  private createStreet(): FormDualStreet {
    return { streetName: '', nr: null };
  }

  private saveState(): void {
    this.state.save<FormDualState>('dual', { rawValue: this.model(), dirty: this.myForm().dirty() });
  }
}
