import { Directive, DoCheck, ModelSignal, OnInit, Signal, input, output } from '@angular/core';
import { FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { ValidatorFnType } from '../lux-form-component-base.class';
import { LuxFormSelectableControlBase } from '../lux-form-selectable-control-base.class';
import { LuxLegacyBridgeHost, LuxLegacyFormBridge } from './lux-legacy-form-bridge';

/**
 * Übergangs-Basisklasse für die auswahlbasierten LUX-FormControls (Radio, Select).
 *
 * Identisches Prinzip zu LuxFormLegacyValueBase, nur mit luxSelected/luxSelectedChange statt
 * luxValue/luxValueChange - das ist der historisch gewachsene Alt-Name dieser beiden Controls.
 *
 * @deprecated Übergangslösung, entfällt mit der nächsten Major-Version.
 */
@Directive()
export abstract class LuxFormLegacySelectableBase<O = any, V = any, P = any>
  extends LuxFormSelectableControlBase<O, V, P>
  implements LuxLegacyBridgeHost<V>, OnInit, DoCheck
{
  /**
   * @deprecated Stattdessen [formField] nutzen.
   */
  readonly luxControlBinding = input<string | undefined>(undefined);
  /**
   * @deprecated Stattdessen [formField] nutzen.
   */
  readonly luxFormGroup = input<FormGroup | undefined>(undefined);
  /**
   * @deprecated Stattdessen [formField] nutzen.
   */
  readonly luxFormControl = input<FormControl<V> | undefined>(undefined);
  /**
   * Im Signal-Form die Validatoren direkt im Schema definieren - dort wird dieser Input nicht
   * gebraucht. Im schemalosen [(value)]-Betrieb (kein [formField], siehe LuxLegacyFormBridge) ist
   * er weiterhin erforderlich: Nur luxControlValidators hängt Validatoren an das synthetische
   * FormControl der Brücke, es gibt dafür keinen Vertrags-Input-Ersatz. Deshalb bewusst NICHT
   * &#64;deprecated - das würde Tooling/Codemods dazu verleiten, ihn ersatzlos zu entfernen und damit
   * den [(value)]-Betrieb zu brechen.
   */
  readonly luxControlValidators = input<ValidatorFnType>(undefined);
  /**
   * Der von aussen gesetzte Wert. Den aktuellen Wert liefern value() bzw. getValue().
   * @deprecated Stattdessen [(value)] oder [formField] nutzen.
   */
  readonly luxSelected = input<V | null | undefined>(undefined);

  readonly luxSelectedChange = output<V>();
  readonly luxBlur = output<FocusEvent>();
  readonly luxFocus = output<FocusEvent>();

  protected readonly bridge = new LuxLegacyFormBridge<V>(this);

  get inForm(): boolean {
    return this.bridge.inForm;
  }

  get formGroup(): FormGroup {
    return this.bridge.formGroup;
  }

  get formControl(): FormControl<V> {
    return this.bridge.formControl;
  }

  get modelValue(): ModelSignal<V> {
    return this.value;
  }

  get valueInput(): Signal<V> {
    return this.luxSelected as Signal<V>;
  }

  ngOnInit() {
    this.bridge.setInitialValue(this.luxSelected() as V);
    this.bridge.init();
  }

  ngDoCheck() {
    this.bridge.check();
  }

  override markAsTouched() {
    super.markAsTouched();
    this.bridge.markAsTouched();
  }

  override markAsDirty() {
    super.markAsDirty();
    this.bridge.markAsDirty();
  }

  getValue(): V {
    return this.bridge.getValue();
  }

  setValue(value: V) {
    this.bridge.setValue(value);
  }

  /**
   * Versucht, wenn Options und FormControl vorhanden sind, den geänderten Wert mit den Options zu
   * vergleichen und als luxSelected-Wert zu melden. Ohne Options passiert bewusst nichts - das
   * entspricht dem bisherigen Verhalten.
   */
  emitValueChange(value: V) {
    this.checkSelectedAndUpdate(value);
  }

  getRequiredValidator(): ValidatorFn {
    return Validators.required;
  }

  private checkSelectedAndUpdate(selected: any) {
    const options = this.luxOptions();
    const pickValueFn = this.luxPickValue();

    if (options && options.length > 0 && this.formControl) {
      if (pickValueFn && selected instanceof Object && !Array.isArray(selected)) {
        // Wenn der Wert zufälligerweise noch ein Objekt sein sollte, versuchen den Key auszulesen.
        selected = pickValueFn(selected);

        // Da der Wert neu gesetzt wurde, diesen im nächsten Zyklus erst in die Werte schreiben.
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
