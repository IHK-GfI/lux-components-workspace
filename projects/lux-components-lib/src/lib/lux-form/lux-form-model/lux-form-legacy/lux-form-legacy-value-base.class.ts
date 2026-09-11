import { Directive, DoCheck, ModelSignal, OnInit, Signal, input, output } from '@angular/core';
import { FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { ValidatorFnType } from '../lux-form-component-base.class';
import { LuxFormValueControlBase } from '../lux-form-value-control-base.class';
import { LuxLegacyBridgeHost, LuxLegacyFormBridge } from './lux-legacy-form-bridge';

/**
 * Übergangs-Basisklasse für wertbasierte LUX-FormControls.
 *
 * Erweitert LuxFormValueControlBase um die bisherige Reactive-Forms-API (luxControlBinding,
 * luxFormGroup, luxFormControl, luxControlValidators, luxValue/luxValueChange). Bestehende
 * Templates funktionieren damit unverändert weiter, während dieselbe Komponente gleichzeitig
 * per [formField] an ein Signal Form und per [(value)] freistehend gebunden werden kann.
 *
 * Beim Wegfall der Alt-API ändert sich pro Komponente genau ein Wort: extends
 * LuxFormLegacyValueBase wird zu extends LuxFormValueControlBase, und dieser Ordner entfällt.
 *
 * @deprecated Übergangslösung, entfällt mit der nächsten Major-Version.
 */
@Directive()
export abstract class LuxFormLegacyValueBase<T> extends LuxFormValueControlBase<T> implements LuxLegacyBridgeHost<T>, OnInit, DoCheck {
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
  readonly luxFormControl = input<FormControl<T> | undefined>(undefined);
  /**
   * @deprecated Stattdessen die Validatoren direkt am Signal Form definieren.
   */
  readonly luxControlValidators = input<ValidatorFnType>(undefined);
  /**
   * Der von aussen gesetzte Wert. Den aktuellen Wert liefern value() bzw. getValue().
   * @deprecated Stattdessen [(value)] oder [formField] nutzen.
   */
  readonly luxValue = input<T>(undefined as T);
  readonly luxPlaceholder = input('');
  readonly luxTagId = input<string | undefined>(undefined);
  readonly luxName = input<string | undefined>(undefined);
  readonly luxAutocomplete = input('on');

  readonly luxValueChange = output<T>();
  readonly luxBlur = output<FocusEvent>();
  readonly luxFocus = output<FocusEvent>();

  protected readonly bridge = new LuxLegacyFormBridge<T>(this);

  get inForm(): boolean {
    return this.bridge.inForm;
  }

  get formGroup(): FormGroup {
    return this.bridge.formGroup;
  }

  get formControl(): FormControl<T> {
    return this.bridge.formControl;
  }

  get modelValue(): ModelSignal<T> {
    return this.value;
  }

  get valueInput(): Signal<T> {
    return this.luxValue;
  }

  ngOnInit() {
    // Den gebundenen Startwert übernehmen, bevor das FormControl initialisiert wird. Dadurch löst
    // der Initialwert - wie bisher - noch kein luxValueChange aus.
    this.bridge.setInitialValue(this.luxValue());
    this.bridge.init();
  }

  ngDoCheck() {
    this.bridge.check();
  }

  // Bewusst synchrone Weitergabe statt eines effect()s: Der Zustand des gebundenen FormControls
  // soll unmittelbar mit der Interaktion stimmen, nicht erst im nächsten Change-Detection-Lauf.
  override markAsTouched() {
    super.markAsTouched();
    this.bridge.markAsTouched();
  }

  override markAsDirty() {
    super.markAsDirty();
    this.bridge.markAsDirty();
  }

  getValue(): T {
    return this.bridge.getValue();
  }

  setValue(value: T) {
    this.bridge.setValue(value);
  }

  emitValueChange(value: T) {
    this.luxValueChange.emit(value);
  }

  getRequiredValidator(): ValidatorFn {
    return Validators.required;
  }
}
