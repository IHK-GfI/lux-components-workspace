import { Signal } from '@angular/core';

/**
 * Verknüpft lux-datepicker und lux-timepicker, die sich einen Wert "yyyy-MM-ddTHH:mm" teilen
 * (siehe luxReferenceControl). Erfüllt von LuxDatepickerComponent und LuxTimepickerComponent.
 */
export interface LuxReferenceControl {
  /** Die Verknüpfung der Gegenseite. */
  readonly luxReferenceControl: Signal<LuxReferenceControl | undefined>;

  /** Die Uhrzeit ("HH:mm"), die der Datepicker beim ersten Datum setzt. Nur beim Timepicker vorhanden. */
  readonly luxDefaultTime?: Signal<string>;
}
