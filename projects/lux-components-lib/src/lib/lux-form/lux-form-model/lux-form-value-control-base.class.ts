import { Directive, Signal, model } from '@angular/core';
import type { FormValueControl } from '@angular/forms/signals';
import { LuxFormControlBase } from './lux-form-control-base.class';

/**
 * Basisklasse für alle wertbasierten LUX-FormControls (Input, Textarea, Select, Datepicker, ...).
 *
 * Erfüllt den FormValueControl-Vertrag aus @angular/forms/signals. Das value-Model deckt beide
 * Nutzungsarten mit derselben Property ab:
 *
 *   <lux-input [(value)]="name" />          freistehend, reines 2-Way-Binding
 *   <lux-input [formField]="form.name" />   im Signal-Form, von [formField] verdrahtet
 *
 * Der Name "value" ist bindend: Angular schreibt den Feldwert zur Laufzeit in einen Input namens
 * literal 'value' und hört auf den Output 'valueChange' (ControlDirectiveHostImpl). Ein alias:
 * würde den Vertrag brechen.
 */
@Directive()
export abstract class LuxFormValueControlBase<T> extends LuxFormControlBase<T> implements FormValueControl<T> {
  readonly value = model<T>(undefined as T);

  readonly controlValue: Signal<T> = this.value;

  writeControlValue(value: T) {
    this.value.set(value);
  }
}
