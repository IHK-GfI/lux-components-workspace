import { Directive, computed, input } from '@angular/core';
import { LuxCompareWithFnType, LuxPickValueFnType } from './lux-form-selectable-base.class';
import { LuxFormValueControlBase } from './lux-form-value-control-base.class';

const defaultCompareWithFn = (o1: any, o2: any) => o1 === o2;

/**
 * Basisklasse für die auswahlbasierten LUX-FormControls (Radio, Select).
 *
 * Erfüllt wie LuxFormValueControlBase den FormValueControl-Vertrag (value-Model), ergänzt um die
 * für eine Optionsliste gemeinsame API (luxOptions, luxPickValue, luxCompareWith).
 */
@Directive()
export abstract class LuxFormSelectableControlBase<O = any, V = any, P = any> extends LuxFormValueControlBase<V> {
  readonly luxOptionLabelProp = input<string, string | undefined>('', { transform: (labelProp) => labelProp ?? '' });
  readonly luxTagId = input<string | undefined>(undefined);
  readonly luxOptions = input<any[]>([]);
  readonly luxPickValue = input<LuxPickValueFnType<O, P>>(undefined);

  readonly luxCompareWith = input<(o1: O, o2: O) => boolean, LuxCompareWithFnType<O>>(defaultCompareWithFn, {
    transform: (compareFn) => compareFn ?? defaultCompareWithFn
  });

  /**
   * Kapselung von der übergebenen luxCompareWith-Funktion.
   * Fängt undefinierte Objekte ab und returned stattdessen false.
   * @param o1
   * @param o2
   */
  compareObjects = (o1: O, o2: O) => {
    if ((!o1 && o2) || (o1 && !o2)) {
      return false;
    } else {
      return this.luxCompareWith()(o1, o2);
    }
  };

  /**
   * Die über luxPickValue aus luxOptions abgeleiteten Werte.
   */
  readonly luxOptionsPickValue = computed(() => {
    const pickValueFn = this.luxPickValue();
    const options = this.luxOptions();

    return pickValueFn && options ? options.map((option) => pickValueFn(option)) : [];
  });
}
