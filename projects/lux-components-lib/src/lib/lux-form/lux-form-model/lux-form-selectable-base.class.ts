import { Directive, computed, input, output } from '@angular/core';
import { LuxFormComponentBase } from './lux-form-component-base.class';

export declare type LuxPickValueFnType<O = any, V = any> = ((option: O) => V) | undefined;
export declare type LuxCompareWithFnType<O = any> = ((o1: O, o2: O) => boolean) | undefined;

const defaultCompareWithFn = (o1: any, o2: any) => o1 === o2;

/**
 * Basis-Klasse für FormComponents, die einen ähnlichen Grundaufbau für die Auswahl von
 * Optionen aus einem Array anbieten (Radio-Buttons und Selects z.B.).
 * @param O Optionstyp (z.B Land)
 * @param V Werttyp (z.B. Land, Land[], string, string[],...)
 * @param P PickValueFn-Typ (z.B. string, number,...)
 */
@Directive()
export abstract class LuxFormSelectableBase<O = any, V = any, P = any> extends LuxFormComponentBase<V> {
  readonly luxOptionLabelProp = input<string, string | undefined>('', { transform: (labelProp) => labelProp ?? '' });
  readonly luxTagId = input<string | undefined>(undefined);
  readonly luxOptions = input<any[]>([]);
  readonly luxPickValue = input<LuxPickValueFnType<O, P>>(undefined);

  readonly luxCompareWith = input<(o1: O, o2: O) => boolean, LuxCompareWithFnType<O>>(defaultCompareWithFn, {
    transform: (compareFn) => compareFn ?? defaultCompareWithFn
  });

  /**
   * Der von außen gesetzte Wert. Die Quelle der Wahrheit bleibt das FormControl; den aktuellen
   * Wert liefern das Signal value() bzw. getValue().
   */
  readonly luxSelected = input<V | null>(null);
  readonly luxSelectedChange = output<any>();

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

  constructor() {
    super();

    this.syncValueInputToFormControl(this.luxSelected);
  }

  override ngOnInit() {
    // Den gebundenen Startwert übernehmen, bevor das FormControl initialisiert wird. Dadurch
    // löst der Initialwert - wie bisher - noch kein luxSelectedChange aus.
    this._initialValue = this.luxSelected();

    super.ngOnInit();
  }

  override notifyFormValueChanged(formValue: any) {
    this.checkSelectedAndUpdate(formValue);
  }

  /**
   * Versucht, wenn Options und FormControl vorhanden sind, den selected-Wert mit den Options
   * zu vergleichen und wenn möglich als luxSelected-Wert zu sichern.
   * @param selected
   */
  private checkSelectedAndUpdate(selected: any) {
    const options = this.luxOptions();
    const pickValueFn = this.luxPickValue();

    if (options && options.length > 0 && this.formControl) {
      if (pickValueFn && selected instanceof Object && !Array.isArray(selected)) {
        // Wenn der Wert zufälligerweise noch ein Objekt sein sollte, versuchen den Key auszulesen
        selected = pickValueFn(selected);

        // Da der Wert neu gesetzt wurde, diesen im nächsten Zyklus erst in die Werte schreiben
        setTimeout(() => {
          this.checkSelectedAndUpdate(selected);
        });
      } else {
        // Für den Fall, dass der eingesetzte Wert sich doch noch vom FormControl-Value unterscheidet,
        // diesen ergänzen.
        if (this.getValue() !== selected) {
          this.setValue(selected);
        }

        this.luxSelectedChange.emit(selected);
      }
    }
  }
}
