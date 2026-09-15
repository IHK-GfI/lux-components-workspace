import { Directive, DoCheck, ModelSignal, OnInit, Signal, input, output } from '@angular/core';
import { FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { LuxFormCheckboxControlBase } from '../lux-form-checkbox-control-base.class';
import { LuxValidationErrors, ValidatorFnType } from '../lux-form-component-base.class';
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
  readonly luxFormControl = input<FormControl<boolean> | undefined>(undefined);
  /**
   * Im Signal-Form die Validatoren direkt im Schema definieren - dort wird dieser Input nicht
   * gebraucht. Im schemalosen [(checked)]-Betrieb (kein [formField], siehe LuxLegacyFormBridge)
   * ist er weiterhin erforderlich: Nur luxControlValidators hängt Validatoren an das synthetische
   * FormControl der Brücke, es gibt dafür keinen Vertrags-Input-Ersatz. Deshalb bewusst NICHT
   * &#64;deprecated - das würde Tooling/Codemods dazu verleiten, ihn ersatzlos zu entfernen und damit
   * den [(checked)]-Betrieb zu brechen.
   */
  readonly luxControlValidators = input<ValidatorFnType>(undefined);
  /**
   * Der von aussen gesetzte Zustand.
   *
   * Der Default ist bewusst undefined und nicht false: Nur so erkennt die Brücke beim ersten Lauf,
   * dass von aussen gar kein Wert gebunden wurde, und lässt einen bereits vorhandenen
   * FormControl-Wert (z.B. aus einer Reactive Form) unangetastet.
   *
   * Bleibt generisch, obwohl das Vertrags-Model checked auf boolean festgelegt ist: Angular leitet
   * den Typparameter der Komponente aus den Template-Bindings ab, sodass bestehende Aufrufe wie
   * [(luxChecked)]="einBooleanOderUndefined" weiter typprüfen.
   *
   * @deprecated Stattdessen [(checked)] oder [formField] nutzen.
   */
  readonly luxChecked = input<T>(undefined as T);
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
    //
    // Bewusst zusätzlich !this.formControl.disabled geprüft: formControl.disable() setzt errors
    // selbst auf null und feuert dabei synchron einen (unveränderten) valueChanges-Event, der genau
    // hier ankommt - ohne diese Bedingung würde ein deaktiviertes Pflichtfeld seinen Fehler sofort
    // wieder selbst setzen und trotz Deaktivierung als ungültig/fehlerhaft angezeigt bleiben.
    if (value === false && this.isRequired() && this.formControl.errors === null && !this.formControl.disabled) {
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
