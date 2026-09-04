import { JsonPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormArray, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  LuxAutocompleteAcComponent,
  LuxButtonComponent,
  LuxCardComponent,
  LuxCardContentComponent,
  LuxDatepickerAcComponent,
  LuxInputAcComponent
} from '@ihk-gfi/lux-components';
import { debounceTime } from 'rxjs';
import { FormExampleSnapshot, FormExampleStateService } from '../form-example-state.service';
import { ICountry } from '../model/country.interface';
import { FormBase } from '../model/form-base.class';
import { TableExampleDataProviderService } from '../table-example-data-provider.service';

interface FormDualDummyForm {
  customerDetails: FormGroup<FormDualCustomerForm>;
  orderDetails: FormGroup<FormDualOrderForm>;
}

type FormDualState = FormExampleSnapshot<ReturnType<FormGroup<FormDualDummyForm>['getRawValue']>>;

interface FormDualCustomerForm {
  name: FormControl<string>;
  zip: FormControl<string>;
  town: FormControl<string | null>;
  country: FormControl<string | null>;
  streets: FormArray<FormGroup<FormDualStreetForm>>;
}

interface FormDualOrderForm {
  orderNo: FormControl<string>;
  validDate: FormControl<string>;
  validTime: FormControl<string | null>;
  value: FormControl<string>;
}

interface FormDualStreetForm {
  streetName: FormControl<string>;
  nr: FormControl<string>;
}

@Component({
  selector: 'app-form-dual-col',
  templateUrl: './form-dual-col.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    LuxButtonComponent,
    LuxCardContentComponent,
    LuxCardComponent,
    LuxInputAcComponent,
    LuxDatepickerAcComponent,
    LuxAutocompleteAcComponent,
    ReactiveFormsModule,
    JsonPipe
  ]
})
export class FormDualColComponent extends FormBase {
  myGroup: FormGroup<FormDualDummyForm>;
  streetsFormArray: FormArray<FormGroup<FormDualStreetForm>>;
  countries: ICountry[] = [];

  private dataProvider = inject(TableExampleDataProviderService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly state = inject(FormExampleStateService);

  constructor() {
    super();

    this.myGroup = new FormGroup<FormDualDummyForm>({
      customerDetails: new FormGroup<FormDualCustomerForm>({
        name: new FormControl<string>('', { validators: Validators.required, nonNullable: true }),
        zip: new FormControl<string>('', { validators: Validators.required, nonNullable: true }),
        town: new FormControl<string | null>(null),
        country: new FormControl<string | null>(null),
        streets: new FormArray<FormGroup<FormDualStreetForm>>([this.createStreetFormGroup()])
      }),
      orderDetails: new FormGroup<FormDualOrderForm>({
        orderNo: new FormControl<string>('', { validators: Validators.required, nonNullable: true }),
        validDate: new FormControl<string>('', { validators: Validators.required, nonNullable: true }),
        validTime: new FormControl<string | null>(null),
        value: new FormControl<string>('', { validators: Validators.compose([Validators.min(1), Validators.max(1000)]), nonNullable: true })
      })
    });
    this.streetsFormArray = (this.myGroup.get('customerDetails') as FormGroup).get('streets') as FormArray<FormGroup<FormDualStreetForm>>;

    this.countries = this.dataProvider.countries;
    this.restoreState();
    this.myGroup.valueChanges.pipe(debounceTime(300), takeUntilDestroyed(this.destroyRef)).subscribe(() => this.saveState());
    this.destroyRef.onDestroy(() => this.saveState());
  }

  hasUnsavedData(): boolean {
    return this.myGroup.dirty;
  }

  addStreet() {
    this.streetsFormArray.push(this.createStreetFormGroup());
  }

  removeStreet(index: number) {
    this.streetsFormArray.removeAt(index);
  }

  latestStreetGroupValid() {
    if (this.streetsFormArray && this.streetsFormArray.length > 0) {
      return this.streetsFormArray.at(this.streetsFormArray.length - 1).valid;
    }
    return true;
  }

  createStreetFormGroup(): FormGroup<FormDualStreetForm> {
    return new FormGroup<FormDualStreetForm>({
      streetName: new FormControl('', { validators: Validators.required, nonNullable: true }),
      nr: new FormControl('', { validators: Validators.min(1), nonNullable: true })
    });
  }

  private restoreState(): void {
    const snapshot = this.state.get<FormDualState>('dual');
    if (!snapshot) {
      return;
    }

    const streetCount = snapshot.rawValue.customerDetails.streets.length;
    while (this.streetsFormArray.length < streetCount) {
      this.streetsFormArray.push(this.createStreetFormGroup(), { emitEvent: false });
    }
    while (this.streetsFormArray.length > streetCount) {
      this.streetsFormArray.removeAt(this.streetsFormArray.length - 1, { emitEvent: false });
    }

    this.myGroup.patchValue(snapshot.rawValue, { emitEvent: false });
    if (snapshot.dirty) {
      this.myGroup.markAsDirty({ emitEvent: false });
    }
  }

  private saveState(): void {
    this.state.save<FormDualState>('dual', { rawValue: this.myGroup.getRawValue(), dirty: this.myGroup.dirty });
  }
}
