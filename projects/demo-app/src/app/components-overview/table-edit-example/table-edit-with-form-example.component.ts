import { JsonPipe, NgClass } from '@angular/common';
import { Component, effect, input } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import {
  LuxAriaLabelDirective,
  LuxButtonComponent,
  LuxFormComponentBase,
  LuxInputAcComponent,
  LuxTableColumnComponent,
  LuxTableColumnContentComponent,
  LuxTableColumnHeaderComponent,
  LuxTableComponent,
  LuxUtil
} from '@ihk-gfi/lux-components';

interface AddressForm {
  streetName: FormControl<string | null>;
  nr: FormControl<string | null>;
}

interface TableForm {
  addresses: FormArray<FormGroup<AddressForm>>;
}

@Component({
  selector: 'app-table-edit-with-form-example',
  imports: [
    LuxButtonComponent,
    LuxTableColumnContentComponent,
    LuxTableColumnHeaderComponent,
    LuxTableColumnComponent,
    LuxTableComponent,
    LuxAriaLabelDirective,
    LuxInputAcComponent,
    JsonPipe,
    NgClass
  ],
  templateUrl: './table-edit-with-form-example.component.html',
  styleUrl: './table-edit-with-form-example.component.scss'
})
export class TableEditWithFormExampleComponent {
  validationEnabled = input<boolean>(false);

  addressInitData = [
    { streetName: 'Hauptstraße', nr: '24' },
    { streetName: 'Hörder Hafenstraße', nr: '5' }
  ];
  initAdressData = false;

  editRow = -1;
  myTableForm!: FormGroup<TableForm>;
  dataSource!: FormGroup<AddressForm>[];

  constructor() {
    this.myTableForm = new FormGroup<TableForm>({
      addresses: new FormArray<FormGroup<AddressForm>>([])
    });

    this.addressInitData.forEach((address) => {
      this.getAddressFormArray().push(
        new FormGroup<AddressForm>({
          streetName: this.createFormControlStreet(address.streetName),
          nr: new FormControl(address.nr)
        })
      );
    });

    this.dataSource = this.getAddressFormArray().controls;

    effect(() => {
      this.getAddressFormArray().controls.forEach((formGroup: FormGroup<AddressForm>) => {
        this.updateValidators(formGroup.get('streetName')! as FormControl<string | null>);
      });
    });
  }

  onAddRow(event: Event) {
    if (!this.isEditMode()) {
      this.getAddressFormArray().push(
        new FormGroup<AddressForm>({
          streetName: this.createFormControlStreet(''),
          nr: new FormControl('')
        })
      );

      this.dataSource = [...this.getAddressFormArray().controls];
      this.editRow = this.dataSource.length - 1;
    }
    LuxUtil.stopEventPropagation(event);
  }

  onStartEditMode(event: { event: Event; rowItem: FormGroup; rowIndex: number }) {
    if (this.isEnterKey(event)) {
      // Markiert alle Controls als touched, damit Validierungsfehler angezeigt werden
      event.rowItem.markAllAsTouched();

      if (this.editRow === event.rowIndex) {
        if (event.rowItem.valid) {
          this.stopEditMode();
        }
      } else {
        this.editRow = event.rowIndex;
      }
    } else {
      if (this.editRow !== event.rowIndex) {
        if (this.isEditMode()) {
          if (this.dataSource[this.editRow].valid) {
            // Nur wechseln, wenn die aktuell editierte Zeile valide ist
            this.editRow = event.rowIndex;
          }
        } else {
          // Einfach wechseln, da gerade keine Zeile editiert wird
          this.editRow = event.rowIndex;
        }
      } else {
        // Wenn es dieselbe Zeile, nicht ändern.
      }
    }
    LuxUtil.stopEventPropagation(event.event);
  }

  onStopEditMode(event: Event, element: LuxFormComponentBase, rowItem: FormGroup) {
    if (this.isEditMode() && !this.checkIfTargetIsInEditRow(element, event)) {
      if (rowItem.valid) {
        // Das Editieren nur beenden, wenn die Zeile valide ist und das Event-Target außerhalb der Zeile liegt
        this.stopEditMode();
      }
    }
  }

  onEscape() {
    if (this.isEditMode()) {
      if (this.isRowValid(this.editRow)) {
        this.stopEditMode();
      } else {
        // Der Edit-Modus bleibt aktiv.
        // Markiert alle Controls als touched, damit Validierungsfehler angezeigt werden
        this.dataSource[this.editRow].markAllAsTouched();
      }
    } else {
      this.stopEditMode();
    }
  }

  private isRowValid(rowIndex: number): boolean {
    return this.dataSource[rowIndex].valid;
  }

  private checkIfTargetIsInEditRow(element: LuxFormComponentBase<any>, event: Event) {
    return element.formControlWrapperComponentRef?.nativeElement.contains(event.target);
  }

  private isEnterKey(event: { event: Event; rowItem: FormGroup; rowIndex: number }) {
    return event.event instanceof KeyboardEvent && event.event.key === 'Enter';
  }

  private stopEditMode() {
    this.editRow = -1;
  }

  private createFormControlStreet(streetName: string | null): FormControl<string | null> {
    return new FormControl(streetName, { validators: this.validationEnabled() ? [Validators.required] : [] });
  }

  private getAddressFormArray() {
    return this.myTableForm.get('addresses') as FormArray<FormGroup<AddressForm>>;
  }

  private isEditMode() {
    return this.editRow >= 0;
  }

  private updateValidators(control: FormControl<string | null>) {
    if (this.validationEnabled()) {
      control.setValidators([Validators.required]);
    } else {
      control.clearValidators();
    }
    control.updateValueAndValidity();
  }
}
