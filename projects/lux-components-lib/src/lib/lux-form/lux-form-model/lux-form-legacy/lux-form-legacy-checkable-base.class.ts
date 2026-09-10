import { Directive, DoCheck, ModelSignal, OnInit, Signal, input, output } from '@angular/core';
import { FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { LuxValidationErrors, ValidatorFnType } from '../lux-form-component-base.class';
import { LuxFormCheckboxControlBase } from '../lux-form-checkbox-control-base.class';
import { LuxLegacyBridgeHost, LuxLegacyFormBridge } from './lux-legacy-form-bridge';

/**
 * Übergangs-Basisklasse für die ankreuzbaren LUX-FormControls (Checkbox, Toggle).
 *
 * Siehe LuxFormLegacyValueBase - identisches Prinzip, nur mit luxChecked/luxCheckedChange
 * statt luxValue/luxValueChange und Validators.requiredTrue als Required-Validator.
 *
 * @deprecated Übergangslösung, entfällt mit der nächsten Major-Version.
 */
@Directive()
export abstract class LuxFormLegacyCheckableBase<T = boolean>
  extends LuxFormCheckboxControlBase
  implements LuxLegacyBridgeHost<boolean>, OnInit, DoCheck
{
  readonly luxControlBinding = input<string | undefined>(undefined);
  readonly luxFormGroup = input<FormGroup | undefined>(undefined);
  readonly luxFormControl = input<FormControl<boolean> | undefined>(undefined);
  readonly luxControlValidators = input<ValidatorFnType>(undefined);
  /**
   * Der von aussen gesetzte Zustand.
   *
   * Der Default ist bewusst null und nicht false: Nur so erkennt die Brücke beim ersten Lauf, dass
   * von aussen gar kein Wert gebunden wurde, und lässt einen bereits vorhandenen FormControl-Wert
   * (z.B. aus einer Reactive Form) unangetastet.
   *
   * Bleibt generisch, obwohl das Vertrags-Model checked auf boolean festgelegt ist: Angular leitet
   * den Typparameter der Komponente aus den Template-Bindings ab, sodass bestehende Aufrufe wie
   * [(luxChecked)]="einBooleanOderUndefined" weiter typprüfen.
   *
   * @deprecated Stattdessen [(checked)] oder [formField] nutzen.
   */
  readonly luxChecked = input<T>(null as T);
  readonly luxTagId = input<string | undefined>(undefined);
  readonly luxName = input<string | undefined>(undefined);

  readonly luxCheckedChange = output<boolean>();
  readonly luxBlur = output<FocusEvent>();
  readonly luxFocus = output<FocusEvent>();

  protected readonly bridge = new LuxLegacyFormBridge<boolean>(this);

  get inForm(): boolean {
    return this.bridge.inForm;
  }

  get formGroup(): FormGroup {
    return this.bridge.formGroup;
  }

  get formControl(): FormControl<boolean> {
    return this.bridge.formControl;
  }

  get modelValue(): ModelSignal<boolean> {
    return this.checked;
  }

  get valueInput(): Signal<boolean> {
    // luxChecked ist nur wegen der Template-Typinferenz generisch (siehe dort); fachlich ist es
    // immer ein Boolean bzw. null.
    return this.luxChecked as Signal<boolean>;
  }

  ngOnInit() {
    this.bridge.setInitialValue(this.luxChecked() as boolean);
    this.bridge.init();
  }

  ngDoCheck() {
    this.bridge.check();
  }

  // Siehe LuxFormLegacyValueBase: synchrone Weitergabe der Nutzer-Interaktion an das FormControl.
  override markAsTouched() {
    super.markAsTouched();
    this.bridge.markAsTouched();
  }

  override markAsDirty() {
    super.markAsDirty();
    this.bridge.markAsDirty();
  }

  getValue(): boolean {
    return this.bridge.getValue();
  }

  setValue(value: boolean) {
    this.bridge.setValue(value);
  }

  emitValueChange(value: boolean) {
    this.luxCheckedChange.emit(value);

    // Ein abgewähltes Pflicht-Ankreuzfeld ist ungültig, auch wenn requiredTrue (etwa ohne Formular)
    // nicht greift. Verhalten aus LuxFormCheckableBaseClass übernommen.
    if (value === false && this.isRequired() && this.formControl.errors === null) {
      this.formControl.setErrors({ required: true });
    }
  }

  getRequiredValidator(): ValidatorFn {
    return Validators.requiredTrue;
  }

  protected override errorMessageModifier(value: unknown, errors: LuxValidationErrors): string | undefined {
    if (errors['required']) {
      return this.tService.translate('luxc.form-checkable-base.error_message.required');
    }
    return undefined;
  }
}
