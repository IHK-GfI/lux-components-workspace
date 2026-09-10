import { DestroyRef, Directive, OnInit, effect, inject, untracked } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AbstractControl, ControlValueAccessor, NgControl } from '@angular/forms';
import { LUX_FORM_CONTROL } from '../lux-form-control-base.class';
import { hasRequiredValidator } from './lux-legacy-form-bridge';

/**
 * Die Element-Selektoren, an denen die ControlValueAccessor-Brücke greift.
 *
 * Bewusst nach Element UND Formular-Attribut gekoppelt, statt die Komponente selbst zum
 * ControlValueAccessor zu machen: Die [formField]-Direktive von Signal Forms prüft
 * NG_VALUE_ACCESSOR am eigenen Element VOR dem Custom-Control-Vertrag
 * (siehe FormField.ngControlCreate). Läge die CVA auf der Komponente, würde jedes [formField]
 * still in den CVA-Pfad fallen und die automatische Bindung von errors, touched, required und
 * disabled verlieren.
 *
 * Beim Migrieren einer weiteren FormComponent ist sie hier zu ergänzen.
 */
export const LUX_CVA_SELECTOR =
  'lux-input[formControlName], lux-input[formControl], lux-input[ngModel], ' +
  'lux-input-ac[formControlName], lux-input-ac[formControl], lux-input-ac[ngModel], ' +
  'lux-checkbox[formControlName], lux-checkbox[formControl], lux-checkbox[ngModel], ' +
  'lux-checkbox-ac[formControlName], lux-checkbox-ac[formControl], lux-checkbox-ac[ngModel]';

/**
 * Verbindet eine LUX-FormComponent mit klassischen Reactive Forms bzw. ngModel.
 *
 * Damit funktioniert <lux-input formControlName="name" /> genau wie ein natives Eingabefeld,
 * ohne dass die Komponente selbst etwas davon wissen muss.
 *
 * Muss vom Consumer importiert werden - am einfachsten über LUX_FORMS_COMPAT.
 *
 * @deprecated Übergangslösung. Neue Formulare binden per [formField] an ein Signal Form; für
 * bestehende Reactive Forms bietet Angular ausserdem compatForm() und SignalFormControl aus
 * @angular/forms/signals/compat an.
 */
@Directive({ selector: LUX_CVA_SELECTOR })
export class LuxControlValueAccessorDirective implements ControlValueAccessor, OnInit {
  private readonly formControlComponent = inject(LUX_FORM_CONTROL);
  /**
   * Bewusst direkt injiziert, statt NG_VALUE_ACCESSOR bereitzustellen (das Muster von Angular
   * Materials MatInput):
   *
   * - Es entsteht keine zirkuläre Abhängigkeit, weil diese Direktive nicht über NG_VALUE_ACCESSOR
   *   aufgelöst wird, sondern sich unten selbst als valueAccessor einträgt.
   * - Vor allem aber existiert dadurch am Element gar kein NG_VALUE_ACCESSOR, den die
   *   [formField]-Direktive fälschlich bevorzugen könnte (siehe LUX_CVA_SELECTOR).
   */
  private readonly ngControl = inject(NgControl, { self: true, optional: true });
  private readonly destroyRef = inject(DestroyRef);

  private onChange: (value: unknown) => void = () => undefined;
  private onTouched: () => void = () => undefined;
  /**
   * Verhindert, dass ein writeValue() sofort wieder als Nutzeränderung zurückgemeldet wird.
   *
   * Ein reiner Boolean-Flag funktioniert hier nicht: effect() läuft immer verzögert nach dem
   * aktuellen Change-Detection-Durchlauf, also ist ein synchron in writeValue() gesetztes und
   * wieder zurückgesetztes Flag beim tatsächlichen Lauf des Effects längst wieder false. Stattdessen
   * wird der zuletzt per writeValue() geschriebene Wert gemerkt und mit dem Wert verglichen, den der
   * Effect sieht.
   */
  private pendingFormValue: { value: unknown } | undefined;
  private disabledFromForm = false;

  constructor() {
    // Muss im Konstruktor passieren: FormControlName sucht seinen ValueAccessor bereits in
    // ngOnChanges, also vor jedem ngOnInit.
    if (this.ngControl) {
      this.ngControl.valueAccessor = this;
    }

    // Ab jetzt bestimmt diese Direktive den Zustand, nicht das synthetische FormControl der
    // LuxLegacyFormBridge.
    this.formControlComponent.stateOverrideClaimed.set(true);

    this.formControlComponent.touch.subscribe(() => this.onTouched());

    effect(() => {
      const value = this.formControlComponent.controlValue();

      untracked(() => {
        const pending = this.pendingFormValue;
        this.pendingFormValue = undefined;

        if (!pending || !Object.is(pending.value, value)) {
          this.onChange(value);
        }
      });
    });
  }

  ngOnInit() {
    // Erst hier verfügbar: FormControlName verknüpft sein AbstractControl in ngOnChanges.
    const control = this.ngControl?.control;

    if (!control) {
      return;
    }

    this.syncState(control);
    control.events.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => this.syncState(control));
  }

  writeValue(value: unknown) {
    this.pendingFormValue = { value };
    this.formControlComponent.writeControlValue(value);
  }

  registerOnChange(fn: (value: unknown) => void) {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void) {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean) {
    this.disabledFromForm = isDisabled;

    const current = this.formControlComponent.stateOverride();
    this.formControlComponent.stateOverride.set({ ...current, disabled: isDisabled });
  }

  private syncState(control: AbstractControl) {
    this.formControlComponent.stateOverride.set({
      disabled: control.disabled || this.disabledFromForm,
      required: hasRequiredValidator(control),
      touched: control.touched,
      dirty: control.dirty,
      invalid: control.invalid,
      legacyErrors: control.errors
    });
  }
}

/**
 * Alles, was ein Consumer importieren muss, damit LUX-FormControls in klassischen Reactive Forms
 * bzw. mit ngModel funktionieren.
 *
 * @example imports: [LuxInputComponent, ReactiveFormsModule, ...LUX_FORMS_COMPAT]
 */
export const LUX_FORMS_COMPAT = [LuxControlValueAccessorDirective] as const;
