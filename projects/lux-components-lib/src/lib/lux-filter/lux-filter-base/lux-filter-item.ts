import { Signal } from '@angular/core';
import { FormControl } from '@angular/forms';
import { LuxThemePalette } from '../../lux-util/lux-colors.enum';

/**
 * Der Ausschnitt einer LUX-FormComponent, den der Filter benötigt.
 *
 * Bewusst ein struktureller Typ statt einer Basisklasse: Die LUX-FormControls hängen inzwischen an
 * zwei Basisklassen (LuxFormComponentBase für die noch nicht migrierten, LuxFormControlBase für die
 * auf Signal Forms umgestellten). Beide erfüllen diesen Vertrag.
 */
export interface LuxFilterableFormComponent<T = any> {
  readonly luxControlBinding: Signal<string | undefined>;
  readonly luxLabel: Signal<string>;
  readonly formControl: FormControl<T>;
}

export class LuxFilterItem<T = any> {
  public static DEFAULT_VALUES = [undefined, null, false, ''];

  label: string;
  binding: string;
  component: LuxFilterableFormComponent<T>;
  defaultValues: any[] = [...LuxFilterItem.DEFAULT_VALUES];
  value: T = this.defaultValues[0];
  color: LuxThemePalette = 'primary';
  disabled = false;
  hidden = false;
  multiValueIndex = -1;
  renderFn: (filter: LuxFilterItem<T>, value: T) => string = (filterItem: LuxFilterItem<T>, value: any) => value;

  constructor(label: string, binding: string, component: LuxFilterableFormComponent<T>) {
    this.label = label;
    this.binding = binding;
    this.component = component;
  }
}
