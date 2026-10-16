import { Directive, Signal, inject, model } from '@angular/core';
import { FormField } from '@angular/forms/signals';
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

  /** Nur gesetzt, wenn die Komponente tatsächlich per [formField] gebunden ist. */
  private readonly formFieldDirective = inject(FormField, { optional: true, self: true });

  writeControlValue(value: T) {
    this.value.set(value);
  }

  /**
   * Setzt touched/dirty des gebundenen Signal-Form-Felds zurück, ohne dessen Wert zu verändern.
   *
   * Für Komponenten, die ihren eigenen Startwert einmalig intern normalisieren (z.B. Datepicker/
   * Timepicker/Datetimepicker: Uhrzeitanteil kappen o.ä.) und dafür in ngOnInit() this.value.set()
   * aufrufen, BEVOR der Nutzer überhaupt interagieren konnte. [formField] kann einen solchen rein
   * internen Schreibzugriff nicht von einer echten Nutzeränderung unterscheiden - value/valueChange
   * ist der einzige Kanal, den der FormValueControl-Vertrag dafür vorsieht (ControlDirectiveHostImpl
   * behandelt jedes .set() auf value identisch, siehe listenToCustomControlModel() in
   * @angular/forms/signals) - und markiert das Feld sonst fälschlich als dirty, obwohl es unberührt
   * ist. Nur wirksam, wenn tatsächlich [formField] gebunden ist (freistehend/luxControlBinding kennen
   * dieses dirty-Konzept ohnehin nicht, siehe LuxLegacyFormBridge).
   */
  protected resetFieldTouchedAndDirty(): void {
    this.formFieldDirective?.state().reset();
  }
}
