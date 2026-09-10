import { DestroyRef, ModelSignal, Signal, WritableSignal, effect, inject, untracked } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AbstractControl, ControlContainer, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { LuxConsoleService } from '../../../lux-util/lux-console.service';
import { LuxValidationErrors, ValidatorFnType } from '../lux-form-component-base.class';
import { LuxControlStateOverride } from '../lux-form-control-base.class';

const DEFAULT_CTRL_NAME = 'control';

/**
 * Die Seite der FormComponent, die die Brücke kennen muss.
 */
export interface LuxLegacyBridgeHost<T> {
  readonly stateOverride: WritableSignal<LuxControlStateOverride | undefined>;
  readonly stateOverrideClaimed: WritableSignal<boolean>;
  readonly luxControlBinding: Signal<string | undefined>;
  readonly luxFormGroup: Signal<FormGroup | undefined>;
  readonly luxFormControl: Signal<FormControl<T> | undefined>;
  readonly luxControlValidators: Signal<ValidatorFnType>;
  readonly luxDisabled: ModelSignal<boolean>;
  readonly luxRequired: ModelSignal<boolean>;
  /** Das Vertrags-Model der Komponente: value bzw. checked. */
  readonly modelValue: ModelSignal<T>;
  /** Der Alt-Input: luxValue bzw. luxChecked. */
  readonly valueInput: Signal<T>;
  /** Feuert luxValueChange bzw. luxCheckedChange. */
  emitValueChange(value: T): void;
  /** Validators.required bzw. Validators.requiredTrue. */
  getRequiredValidator(): ValidatorFn;
}

/**
 * Verbindet eine LUX-FormComponent mit einem klassischen Reactive-Forms-AbstractControl.
 *
 * Das ist die vollständige Alt-Mechanik der LUX-FormControls, bewusst an genau einer Stelle
 * gebündelt statt über die Basisklasse verteilt: Auflösung des FormControls über den injizierten
 * ControlContainer und luxControlBinding, das synthetische FormControl für den Betrieb ohne
 * Formular, die Wert- und Status-Subscriptions sowie die Validator-Behandlung.
 *
 * Die Komponente selbst weiß davon nichts - sie liest ausschließlich isDisabled(), isRequired(),
 * isTouched(), errorMessage() usw. aus der Basisklasse. Damit ist diese Datei mit dem Wegfall der
 * Alt-API ersatzlos löschbar.
 *
 * @deprecated Übergangslösung. Neue Formulare binden per [formField] an ein Signal Form.
 */
export class LuxLegacyFormBridge<T> {
  inForm = false;
  formGroup!: FormGroup;
  formControl!: FormControl<T>;

  private readonly controlContainer = inject(ControlContainer, { optional: true });
  private readonly destroyRef = inject(DestroyRef);
  private readonly logger = inject(LuxConsoleService);

  private initialValue?: T;
  private validatorsInitialized = false;
  private initialized = false;
  /** Verhindert die Rückkopplung modelValue -> FormControl -> modelValue. */
  private applyingFromFormControl = false;
  /** Markiert einen Schreibzugriff der Brücke selbst, siehe registerOnChange-Callback in init(). */
  private applyingToFormControl = false;
  /** Wird true, sobald der Alt-Input luxValue/luxChecked jemals einen echten Wert geliefert hat. */
  private legacyValueSeen = false;

  constructor(private readonly host: LuxLegacyBridgeHost<T>) {
    // Reine Validator-Änderungen dürfen den Required-Validator nicht anfassen, sonst würde ein
    // per luxRequired gesetzter Validator beim Setzen von luxControlValidators wieder entfernt.
    effect(() => {
      const validators = this.host.luxControlValidators();

      untracked(() => {
        if (this.validatorsInitialized) {
          this.updateValidators(validators, false);
        }
      });
    });

    // luxRequired-Änderungen (und die Initialisierung) beziehen den Required-Validator mit ein.
    effect(() => {
      const required = this.host.luxRequired();

      untracked(() => {
        if (this.inForm && required !== hasRequiredValidator(this.formControl)) {
          this.logger.error(
            `Attention: Use the Required-Validator instead of the ` +
              `Property "luxRequired" for components within ReactiveForms..\n` +
              `Affected component: ${this.host.luxControlBinding() ?? 'No binding found'}`
          );
        }

        this.validatorsInitialized = true;
        this.updateValidators(this.host.luxControlValidators(), true);
      });
    });

    effect(() => {
      this.host.luxDisabled();

      untracked(() => {
        if (this.formControl) {
          this.handleFormDisabledState();
        }
      });
    });

    // Der Alt-Input luxValue/luxChecked schreibt in das FormControl. Der erste Lauf überschreibt
    // einen bereits vorhandenen FormControl-Wert (z.B. aus einer Reactive Form) nicht, solange von
    // aussen kein Wert gebunden wurde.
    let initialRun = true;
    effect(() => {
      const value = this.host.valueInput();

      untracked(() => {
        if (initialRun) {
          initialRun = false;

          // Ein null/undefined-Wert beim allerersten Lauf ist mehrdeutig: Entweder wurde der
          // Alt-Input nie gebunden (dann bleibt er bei seinem eigenen Default), oder er wurde
          // bewusst auf null/undefined gesetzt - das lässt sich hier nicht unterscheiden. Ein
          // bereits vorhandener FormControl-Wert (z.B. aus einer Reactive Form) darf deshalb nicht
          // überschrieben werden.
          if (value === undefined || value === null) {
            return;
          }
        }

        // Jede Änderung nach dem ersten Lauf ist eindeutig: Nur eine echte Bindung (Alt-API oder
        // Two-Way) kann den Alt-Input überhaupt verändern - anders als beim ersten Lauf ist ein
        // null/undefined-Wert hier also genauso aussagekräftig wie jeder andere.
        this.legacyValueSeen = true;

        this.setValue(value);
      });
    });

    // Das Vertrags-Model (value/checked) schreibt ebenfalls in das FormControl - so funktioniert
    // [(value)] auch dann, wenn die Komponente an einer Reactive Form hängt.
    effect(() => {
      const value = this.host.modelValue();

      untracked(() => {
        if (!this.initialized || this.applyingFromFormControl) {
          return;
        }

        this.setValue(value);
      });
    });
  }

  /** Aus ngOnInit der FormComponent aufzurufen. */
  init() {
    this.initFormControl();

    // Synchronisiert die Anzeige auch bei einem direkten setValue() auf das AbstractControl mit
    // { emitEvent: false } (z.B. um eine Two-Way-Binding-Loop zu brechen): Anders als valueChanges
    // feuert dieser Callback unabhängig von emitEvent - exakt der Mechanismus, über den früher der
    // ControlValueAccessor (writeValue) die Anzeige synchron hielt.
    //
    // Ein Aufruf, der nicht von der Brücke selbst kommt (applyingToFormControl), bedeutet: Jemand
    // bedient das AbstractControl direkt an der Brücke vorbei - z.B. ein reales luxFormControl/
    // luxFormGroup oder ein manuelles setValue() in einem Test. Das zählt wie ein echter
    // luxValue/luxChecked-Wert als Alt-API-Nutzung, sonst bliebe die Brücke "nicht zuständig"
    // (engaged === false) und der Wert würde nie im Vertrags-Model ankommen.
    this.formControl.registerOnChange((value: T) => {
      if (!this.applyingToFormControl) {
        this.legacyValueSeen = true;
      }
      this.publishValue(value);
    });

    this.formControl.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((value: T) => {
      this.host.emitValueChange(value);
    });

    this.formControl.statusChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((status) => {
      if (status === 'DISABLED' && !this.host.luxDisabled()) {
        this.host.luxDisabled.set(true);
      } else if ((status === 'VALID' || status === 'INVALID') && this.host.luxDisabled()) {
        this.host.luxDisabled.set(false);
      }
    });

    // formControl.events deckt TouchedChangeEvent/StatusChangeEvent/ValueChangeEvent ab und feuert
    // auch bei direkten Aufrufen wie markAsTouched() oder formGroup.markAllAsTouched().
    //
    // Das war bisher nicht sicher möglich: events feuert synchron mit dem auslösenden Aufruf, also
    // potenziell bevor Angular geänderte Inputs (z.B. luxErrorMessage) geschrieben hat - eine
    // eifrige Neuberechnung der Fehlermeldung hätte dort veraltete Inputs gesehen. Inzwischen wird
    // hier nur noch Rohzustand gespiegelt; die Fehlermeldung berechnet ein computed() der
    // Basisklasse, das erst beim Rendern und damit nach dem Input-Update ausgewertet wird.
    //
    // Die Signal-Schreibweise markiert die OnPush-Komponente automatisch als zu prüfen - ein
    // manuelles markForCheck() beim Aufrufer ist damit nicht mehr nötig.
    this.formControl.events.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => this.syncState());

    this.initialized = true;

    if (this.initialValue !== null && this.initialValue !== undefined) {
      this.setValue(this.initialValue);
    }

    // Die Validator-Effects können bereits gelaufen sein, als es noch kein FormControl gab.
    this.validatorsInitialized = true;
    this.updateValidators(this.host.luxControlValidators(), true);

    this.syncState();
  }

  /**
   * Aus ngDoCheck der FormComponent aufzurufen.
   *
   * Bewusst ngDoCheck und nicht formControl.events: events feuert synchron MIT dem auslösenden
   * Aufruf (z.B. markAsTouched()), also potenziell BEVOR Angular in derselben Change-Detection-
   * Runde geänderte Inputs in die Komponente geschrieben hat. ngDoCheck läuft dagegen garantiert
   * erst nach der Input-Aktualisierung.
   *
   * Hier wird ausschliesslich Rohzustand gespiegelt - die Fehlermeldung selbst berechnet die
   * Basisklasse in einem computed(), das erst beim Rendern ausgewertet wird.
   */
  check() {
    if (this.inForm) {
      this.host.luxRequired.set(hasRequiredValidator(this.formControl));
    }

    this.syncState();
  }

  /**
   * Ob die Alt-Mechanik überhaupt zuständig ist.
   *
   * Wird die Komponente über [formField] oder [(value)] genutzt, ist das synthetische FormControl
   * bedeutungslos - es dürfte sonst mit seinem leeren, validatorlosen Zustand den vom
   * Signal-Forms-Vertrag gelieferten Zustand überschreiben.
   *
   * Bewusst bei jedem Aufruf neu ausgewertet: luxRequired oder luxControlValidators können auch
   * nachträglich gesetzt werden.
   */
  get engaged(): boolean {
    // Die ControlValueAccessor-Direktive (formControlName) hat Vorrang.
    if (this.host.stateOverrideClaimed()) {
      return false;
    }
    if (this.inForm || this.legacyValueSeen || this.host.luxRequired()) {
      return true;
    }

    const validators = this.host.luxControlValidators();
    return Array.isArray(validators) ? validators.length > 0 : !!validators;
  }

  /**
   * Meldet eine Nutzer-Interaktion an das gebundene AbstractControl weiter.
   *
   * Vor der Signal-Forms-Umstellung erledigte das Angulars Value-Accessor-Maschinerie, die über
   * [formControl] am nativen Eingabeelement hing (markAsTouched beim Blur, markAsDirty bei jeder
   * Eingabe). Diese Bindung gibt es nicht mehr, also muss die Brücke es selbst tun - sonst blieben
   * formGroup.touched und formGroup.dirty dauerhaft false.
   */
  markAsTouched() {
    if (this.engaged && this.formControl && !this.formControl.touched) {
      this.formControl.markAsTouched();
    }
  }

  markAsDirty() {
    if (this.engaged && this.formControl && !this.formControl.dirty) {
      this.formControl.markAsDirty();
    }
  }

  getValue(): T {
    return this.formControl ? this.formControl.value : (this.initialValue as T);
  }

  setValue(value: T) {
    if (!this.formControl) {
      this.initialValue = value;
      this.publishValue(value);
      return;
    }

    if (value === this.formControl.value) {
      this.publishValue(value);
      return;
    }

    this.applyingToFormControl = true;
    try {
      this.formControl.setValue(value);
    } finally {
      this.applyingToFormControl = false;
    }
  }

  /** Den (noch nicht initialisierten) Startwert setzen, ohne ein Change-Event auszulösen. */
  setInitialValue(value: T) {
    this.initialValue = value;

    if (value !== undefined && value !== null) {
      this.legacyValueSeen = true;
    }
  }

  private initFormControl() {
    const boundFormGroup = this.host.luxFormGroup();
    const boundFormControl = this.host.luxFormControl();

    if (boundFormGroup) {
      this.formGroup = boundFormGroup;
    }

    if (boundFormControl) {
      this.formControl = boundFormControl;
    }

    const controlBinding = this.host.luxControlBinding();
    this.inForm = (!!this.controlContainer || !!this.formGroup) && !!controlBinding;

    if (this.inForm && controlBinding) {
      if (!this.formGroup) {
        this.formGroup = this.controlContainer?.control as FormGroup;
      }
      if (!this.formControl) {
        this.formControl = this.formGroup.controls[controlBinding] as FormControl<T>;
      }
      this.host.luxRequired.set(hasRequiredValidator(this.formControl));
    } else {
      if (!this.formGroup) {
        this.formGroup = new FormGroup({ control: new FormControl() });
        this.formControl = this.formGroup.get(DEFAULT_CTRL_NAME) as FormControl<T>;
      }

      // Ist die Alt-Mechanik nicht zuständig ([formField] oder [(value)]), ist das Model die
      // Quelle - das synthetische FormControl darf den gebundenen Wert nicht überschreiben.
      this.formControl.setValue(this.engaged ? (this.initialValue as T) : this.host.modelValue());
    }

    if (this.host.luxDisabled()) {
      this.formControl.disable();
    }

    this.host.luxDisabled.set(this.formControl.disabled);
    this.publishValue(this.formControl.value);
  }

  /** Spiegelt den Rohzustand des FormControls in den stateOverride der Basisklasse. */
  private syncState() {
    // Hat die ControlValueAccessor-Direktive den Zustand übernommen (formControlName am Element),
    // ist das hiesige FormControl nur noch ein Wert-Spiegel und darf den Zustand nicht überschreiben.
    if (!this.engaged) {
      // Beim Übergang von zuständig zu nicht zuständig (z.B. luxRequired wird wieder false) muss
      // der eigene Zustand geräumt werden, sonst bliebe er stehen und würde die Vertrags-Inputs
      // dauerhaft überstimmen. Einen von der CVA-Direktive beanspruchten Zustand nicht anfassen.
      if (!this.host.stateOverrideClaimed() && this.host.stateOverride() !== undefined) {
        this.host.stateOverride.set(undefined);
      }
      return;
    }

    const current = this.host.stateOverride();
    const next: LuxControlStateOverride = {
      disabled: this.formControl.disabled,
      required: hasRequiredValidator(this.formControl),
      touched: this.formControl.touched,
      dirty: this.formControl.dirty,
      invalid: this.formControl.invalid,
      legacyErrors: this.formControl.errors
    };

    if (
      current &&
      current.disabled === next.disabled &&
      current.required === next.required &&
      current.touched === next.touched &&
      current.dirty === next.dirty &&
      current.invalid === next.invalid &&
      errorsEqual(current.legacyErrors, next.legacyErrors)
    ) {
      return;
    }

    this.host.stateOverride.set(next);
  }

  /** Schreibt einen Wert aus dem FormControl in das Vertrags-Model, ohne zurückzuschreiben. */
  private publishValue(value: T) {
    // Ist die Alt-Mechanik nicht zuständig, ist das Model die Quelle und nicht das FormControl.
    if (!this.engaged || this.host.modelValue() === value) {
      return;
    }

    this.applyingFromFormControl = true;
    try {
      this.host.modelValue.set(value);
    } finally {
      this.applyingFromFormControl = false;
    }
  }

  private handleFormDisabledState() {
    if (this.host.luxDisabled() && !this.formControl.disabled) {
      this.formControl.disable();
    }

    if (!this.host.luxDisabled() && this.formControl.disabled) {
      this.formControl.enable();
    }
  }

  private updateValidators(validators: ValidatorFnType, checkRequiredValidator: boolean) {
    // Vor init() gibt es noch kein FormControl. init() holt die Validatoren am Ende selbst nach.
    if (!this.formControl) {
      return;
    }

    const hasValidators = (!Array.isArray(validators) && !!validators) || (Array.isArray(validators) && validators.length > 0);
    const requiredValidator = this.host.getRequiredValidator();
    const controlHasRequired = !!this.formControl && this.formControl.hasValidator(requiredValidator);
    const shouldHandleRequired = checkRequiredValidator && (this.host.luxRequired() || controlHasRequired);

    if (!hasValidators && !shouldHandleRequired) {
      return;
    }

    if (!this.inForm) {
      // Bewusst synchron - anders als früher, wo das in einem setTimeout lief, um abzuwarten, ob
      // sich inForm noch ändert. init() läuft in ngOnInit und damit garantiert vor jedem Effect,
      // sodass inForm hier bereits feststeht.
      //
      // Die Verzögerung war bisher unauffällig, weil das alte Template mit [formControl] und
      // [required] Angulars eigenen RequiredValidator einschleuste, der den Fehler sofort setzte
      // (genau der Zirkelbezug aus Issue #240). Ohne diese Kopplung muss der Validator hier
      // unmittelbar greifen.
      this.formControl.setValidators(validators ?? null);

      if (checkRequiredValidator) {
        if (this.host.luxRequired()) {
          this.formControl.addValidators(requiredValidator);
        } else {
          this.formControl.removeValidators(requiredValidator);
        }
      }

      this.formControl.updateValueAndValidity();
      this.syncState();
    } else if (hasValidators) {
      this.logger.warn(
        `
Die Validatoren des Formularelements (luxControlBinding=${this.host.luxControlBinding()}) können ausschließlich über das Formular gesetzt werden,
aber nicht über das Property 'luxControlValidators'. Dieser Aufruf wurde ignoriert!`
      );
    }
  }
}

/**
 * Prüft, ob das Control einen required-Validator besitzt.
 *
 * Hinweis: Prüft gezielt auf die beiden Validator-Referenzen, statt den komponierten Validator
 * auszuführen. Ein Verhaltens-Check würde auch den von der nativen [required]-Bindung
 * eingeschleusten Angular-RequiredValidator erkennen, dessen Zustand selbst wieder von luxRequired
 * abhängt (Zirkelbezug, siehe Issue #240).
 */
export function hasRequiredValidator(control: AbstractControl | undefined): boolean {
  if (!control) {
    return false;
  }
  return control.hasValidator(Validators.required) || control.hasValidator(Validators.requiredTrue);
}

/**
 * Wertgleichheit statt Referenzgleichheit für ValidationErrors.
 *
 * `AbstractControl.updateValueAndValidity()` lässt die Validatoren jedes Mal neu laufen und erzeugt
 * dabei ein frisches Fehler-Objekt, selbst wenn sich inhaltlich nichts geändert hat (z.B.
 * Validators.required liefert immer ein neues { required: true }). Ein Referenzvergleich in
 * syncState() würde das als Änderung werten und den stateOverride unnötig neu setzen - das
 * invalidiert das errorMessage()-computed der Basisklasse und ruft luxErrorCallback ein zweites Mal
 * auf, obwohl sich die Fehlerlage nicht geändert hat.
 */
function errorsEqual(a: LuxValidationErrors | null | undefined, b: LuxValidationErrors | null | undefined): boolean {
  if (a === b) {
    return true;
  }
  if (!a || !b) {
    return false;
  }

  const aKeys = Object.keys(a);
  const bKeys = Object.keys(b);
  if (aKeys.length !== bKeys.length) {
    return false;
  }

  return aKeys.every((key) => JSON.stringify(a[key]) === JSON.stringify(b[key]));
}
