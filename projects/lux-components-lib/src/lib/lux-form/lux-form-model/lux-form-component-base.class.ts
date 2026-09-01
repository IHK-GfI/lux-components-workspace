import {
  ChangeDetectorRef,
  DestroyRef,
  Directive,
  DoCheck,
  ElementRef,
  OnDestroy,
  OnInit,
  computed,
  contentChild,
  effect,
  inject,
  input,
  model,
  output,
  Signal,
  signal,
  untracked,
  viewChild
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AbstractControl, ControlContainer, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { TranslocoService } from '@jsverse/transloco';
import { Subscription } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';
import { LuxComponentsConfigService } from '../../lux-components-config/lux-components-config.service';
import { LuxConsoleService } from '../../lux-util/lux-console.service';
import { LuxUtil } from '../../lux-util/lux-util';
import { LuxFormControlWrapperComponent } from '../lux-form-control-wrapper/lux-form-control-wrapper.component';
import { LuxFormHintComponent } from '../lux-form-control/lux-form-control-subcomponents/lux-form-hint.component';
import { LuxFormLabelComponent } from '../lux-form-control/lux-form-control-subcomponents/lux-form-label.component';

export declare type LuxValidationErrors = ValidationErrors;
export declare type ValidatorFnType = ValidatorFn | ValidatorFn[] | null | undefined;
export declare type LuxErrorCallbackFnType = (value: any, errors: LuxValidationErrors) => string | undefined;

@Directive({
  host: {
    '[class.lux-form-control-readonly]': 'luxReadonly()'
  }
})
export abstract class LuxFormComponentBase<T = any> implements OnInit, DoCheck, OnDestroy {
  protected static readonly DEFAULT_CTRL_NAME: string = 'control';

  protected _formValueChangeSub?: Subscription;
  protected _formStatusChangeSub?: Subscription;
  protected _configSubscription?: Subscription;

  protected latestErrors: any = null;
  protected _initialValue?: any;
  private a11yNameCheckTimeout?: ReturnType<typeof setTimeout>;
  private validatorsInitialized = false;
  private readonly generatedUid = 'lux-form-control-' + uuidv4();

  readonly errorMessage = signal<string | undefined>(undefined);

  /**
   * Reaktive Spiegelung von formControl.touched bzw. formControl.invalid. Das FormControl
   * selbst ist nicht signalbasiert, deshalb bekämen OnPush-Templates Änderungen an diesen
   * beiden Zuständen sonst nicht mit. Die eigentliche Synchronisation läuft weiterhin über
   * ngDoCheck() (nicht über formControl.events direkt): formControl.events feuert synchron
   * MIT dem auslösenden Aufruf (z.B. markAsTouched()), also potenziell BEVOR Angular in
   * derselben Change-Detection-Runde bereits geänderte Inputs (z.B. luxErrorMessage) in diese
   * Komponente geschrieben hat - ngDoCheck() läuft dagegen garantiert erst NACH der
   * Input-Aktualisierung. formControl.events wird unten nur genutzt, um markForCheck()
   * auszulösen, damit ngDoCheck() bei einem direkten FormControl-Aufruf überhaupt läuft.
   *
   * Achtung: Diese Kopplung greift nur, wenn formControl.events tatsächlich feuert. Ruft eine
   * abgeleitete Komponente setValue()/updateValueAndValidity() mit { emitEvent: false } auf (z.B.
   * um ein "stilles" internes Nachziehen ohne doppeltes valueChanges-Event umzusetzen), bleibt
   * markForCheck() aus - die Komponente muss dann selbst this.cdr.markForCheck() aufrufen, sonst
   * bleiben touched/invalid/errorMessage bis zur nächsten zufällig ausgelösten Prüfung veraltet.
   * Siehe lux-chips-ac.component.ts (syncFormControlWithStandaloneChips) sowie
   * lux-datepicker-ac.component.ts/lux-datetimepicker-ac.component.ts (setISOValue) als Beispiele.
   */
  readonly touched = signal(false);
  readonly invalid = signal(false);

  /**
   * Reaktive Spiegelung von formControl.value. Anders als die Wert-Inputs (luxValue, luxChecked,
   * luxSelected) folgt dieses Signal immer dem FormControl - auch dann, wenn der Wert
   * ausschließlich über eine Reactive Form gesetzt wurde.
   */
  readonly value = signal<T>(null as T);

  protected controlContainer = inject(ControlContainer, { optional: true });
  protected destroyRef = inject(DestroyRef);
  protected cdr = inject(ChangeDetectorRef);
  protected logger = inject(LuxConsoleService);
  protected configService = inject(LuxComponentsConfigService);
  protected tService = inject(TranslocoService);

  inForm = false;
  formGroup!: FormGroup;
  formControl!: FormControl<T>;

  readonly formLabelComponent = contentChild(LuxFormLabelComponent);
  readonly formHintComponent = contentChild(LuxFormHintComponent);

  readonly formControlWrapperComponent = viewChild(LuxFormControlWrapperComponent);
  readonly formControlWrapperComponentRef = viewChild(LuxFormControlWrapperComponent, { read: ElementRef });

  readonly luxFocusIn = output<FocusEvent>();
  readonly luxFocusOut = output<FocusEvent>();

  readonly luxId = input('');
  readonly luxHint = input('');
  readonly luxHintShowOnlyOnFocus = input(false);
  /**
   * Sichtbares Label des Controls. Als Model ausgelegt, damit ableitende Komponenten das Label
   * über eigene Aliase (z.B. luxInputLabel bei lux-chips-ac) setzen können.
   */
  readonly luxLabel = model('');
  readonly luxLabelLongFormat = input(false);
  /**
   * Setzt "aria-label" auf dem nativen Eingabeelement. Nur für Felder gedacht,
   * die kein sichtbares Label besitzen (z.B. Suchfeld). Hat ein Control ein
   * sichtbares Label, überschreibt ein abweichendes aria-label den sichtbaren
   * Text (WCAG 2.5.3 "Label in Name") - siehe Warnung in checkA11yName().
   */
  readonly luxAriaLabel = input<string | undefined>(undefined);
  /**
   * Setzt "aria-labelledby" auf dem nativen Eingabeelement und verweist damit
   * auf ein eigenes, externes Label-Element. Hat Vorrang vor luxAriaLabel und luxLabel.
   */
  readonly luxAriaLabelledby = input<string | undefined>(undefined);
  /**
   * Blendet das obere Label nur visuell aus (lux-sr-only). Das <label> bleibt im DOM,
   * der zugängliche Name des Controls bleibt erhalten (Issue #267).
   * Wirkt auch ohne gesetztes luxLabel: Dann entfällt die leere Label-Zeile visuell,
   * die sonst für die Flucht mit sichtbar gelabelten Nachbarfeldern reserviert bleibt.
   */
  readonly luxNoTopLabel = input(false);
  /**
   * Entfernt den unteren Bereich (Hint, Fehlermeldung, Counter) aus dem DOM.
   * Achtung, bewusste Entscheidung: Damit entfällt auch die per aria-describedby
   * referenzierte Fehlermeldung. Nur einsetzen, wenn Fehler an anderer Stelle
   * wahrnehmbar gemacht werden.
   */
  readonly luxNoBottomLabel = input(false);
  /**
   * Kombination aus luxNoTopLabel und luxNoBottomLabel: Das Label wird nur visuell
   * versteckt, der untere Bereich inklusive Fehlermeldung wird entfernt.
   * Siehe die Hinweise an den beiden Einzel-Inputs.
   */
  readonly luxNoLabels = input(false);

  readonly luxControlBinding = input<string | undefined>(undefined);
  readonly luxErrorMessage = input<string | undefined>(undefined);
  readonly luxErrorCallback = input<LuxErrorCallbackFnType>(() => undefined);
  readonly luxDense = input(false);

  readonly luxFormControl = input<FormControl<T> | undefined>(undefined);
  readonly luxFormGroup = input<FormGroup | undefined>(undefined);
  readonly luxControlValidators = input<ValidatorFnType>(undefined);

  readonly luxDisabled = model(false);
  readonly luxReadonly = input(false);
  /**
   * Innerhalb von Reactive Forms wird dieser Zustand aus dem Required-Validator des
   * FormControls abgeleitet und pro Change-Detection-Zyklus nachgezogen (siehe ngDoCheck).
   */
  readonly luxRequired = model(false);

  readonly uid = computed(() => this.luxId() || this.generatedUid);

  constructor() {
    effect(() => {
      this.luxDisabled();

      untracked(() => {
        if (this.formControl) {
          this.handleFormDisabledState();
        }
      });
    });

    // Reine Validator-Änderungen dürfen den Required-Validator nicht anfassen, sonst würde ein
    // per luxRequired gesetzter Validator beim Setzen von luxControlValidators wieder entfernt.
    effect(() => {
      const validators = this.luxControlValidators();

      untracked(() => {
        if (this.validatorsInitialized) {
          this.updateValidators(validators, false);
        }
      });
    });

    // luxRequired-Änderungen (und die Initialisierung) beziehen den Required-Validator mit ein.
    effect(() => {
      const required = this.luxRequired();

      untracked(() => {
        if (this.inForm && required !== this.hasRequiredValidator(this.formControl)) {
          this.logger.error(
            `Attention: Use the Required-Validator instead of the ` +
              `Property "luxRequired" for components within ReactiveForms..\n` +
              `Affected component: ${this.luxControlBinding() ?? 'No binding found'}`
          );
        }

        this.validatorsInitialized = true;
        this.updateValidators(this.luxControlValidators(), true);
      });
    });
  }

  /**
   * Liefert den Wert für "aria-labelledby" gemäß der Namenskaskade:
   * luxAriaLabelledby vor luxAriaLabel vor luxLabel (uid + '-label').
   * undefined bedeutet: kein aria-labelledby setzen (die Aria-Direktiven
   * entfernen das Attribut dann), damit ein gesetztes luxAriaLabel greifen kann.
   */
  labelledBy(): string | undefined {
    if (this.luxAriaLabelledby()) {
      return this.luxAriaLabelledby();
    }
    if (this.luxAriaLabel()) {
      return undefined;
    }
    return this.formLabelComponent() || this.luxLabel() ? this.uid() + '-label' : undefined;
  }

  ngOnInit() {
    this.initFormControl();

    // Den reaktiven Spiegel des FormControl-Werts unabhängig von den (überschreibbaren)
    // Wert-Subscriptions der ableitenden Klassen aktuell halten.
    this.formControl.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((value) => this.value.set(value));

    this.initFormValueSubscription();
    this.initFormStateSubscription();

    // formControl.events deckt u.a. TouchedChangeEvent/StatusChangeEvent/ValueChangeEvent ab und
    // feuert per Default (emitEvent: true) auch bei direkten Aufrufen wie markAsTouched()/
    // updateValueAndValidity() - unabhängig davon, ob diese OnPush-Komponente ohnehin gerade
    // geprüft wird. markForCheck() sorgt dafür, dass ngDoCheck() (siehe unten) in diesem Fall
    // überhaupt läuft, statt erst auf die nächste zufällig ausgelöste Prüfung zu warten.
    this.formControl.events.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => this.cdr.markForCheck());

    // Verzögert prüfen, damit die contentChild-Query formLabelComponent bereits aufgelöst ist.
    this.a11yNameCheckTimeout = setTimeout(() => this.checkA11yName());
  }

  ngDoCheck() {
    // Required-Validator kann sich ändern, ohne dass sich der FormControl-Status ändert.
    // Deshalb in Reactive Forms den luxRequired-Status pro Check synchronisieren.
    if (this.inForm) {
      this.updateValidatorsInForm();
    }

    this.touched.set(this.formControl.touched);
    this.invalid.set(this.formControl.invalid);
    this.value.set(this.formControl.value);

    // Prüfen, ob es neue Fehlermeldungen gibt, wenn ja diese laden und speichern.
    if (this.latestErrors !== this.formControl.errors && this.formControl.touched) {
      this.latestErrors = this.formControl.errors;
      this.errorMessage.set(this.fetchErrorMessage());
    }
  }

  ngOnDestroy() {
    if (this._formValueChangeSub) {
      this._formValueChangeSub.unsubscribe();
    }

    if (this._formStatusChangeSub) {
      this._formStatusChangeSub.unsubscribe();
    }

    if (this._configSubscription) {
      this._configSubscription.unsubscribe();
    }

    if (this.a11yNameCheckTimeout) {
      clearTimeout(this.a11yNameCheckTimeout);
    }
  }

  /**
   * Versucht eine Fehlermeldung für diese Komponente auszulesen und gibt diese zurück.
   * Wenn das Element nicht den "touched"-Zustand besitzt, wird keine Fehlermeldung zurückgegeben.
   */
  protected fetchErrorMessage(): string | undefined {
    // Control undefined/null oder unberührt? Keinen Fehler ausgeben
    if (!this.formControl || !this.formControl.touched) {
      return undefined;
    }
    const { value, errors } = this.formControl;

    let errorMsg = undefined;
    if (errors) {
      // Gibt der Callback bereits einen User-definierten Fehler wieder? Diesen zurückgeben.
      const errorCallback = this.luxErrorCallback();
      errorMsg = this.luxErrorMessage() ? this.luxErrorMessage() : errorCallback ? errorCallback(value, errors || {}) : undefined;
      if (errors && errorMsg) {
        return errorMsg;
      }

      // Eventuell falls vorhanden Fehlerbehandlung der ableitenden Komponente aufrufen
      errorMsg = this.errorMessageModifier(value, errors || {});
      if (errorMsg) {
        return errorMsg;
      }
      // Last-but-not-least => versuchen einen Standardfehler auszulesen
      errorMsg = LuxUtil.getErrorMessage(this.tService, this.formControl as FormControl<T>);
    }

    return errorMsg;
  }

  /**
   * Überträgt den Input-Wert aus disabled auf das FormControl.
   */
  protected handleFormDisabledState() {
    if (this.luxDisabled() && !this.formControl.disabled) {
      this.formControl.disable();
    }

    if (!this.luxDisabled() && this.formControl.disabled) {
      this.formControl.enable();
    }
  }

  /**
   * Method-Stub der von ableitenden Klassen genutzt werden kann, um
   * weitergreifende Fehlermeldungen anzugeben.
   * @param value
   * @param errors
   */
  protected errorMessageModifier(value: any, errors: LuxValidationErrors): string | undefined {
    return undefined;
  }

  /**
   * Prüft, ob das Control einen zugänglichen Namen besitzt bzw. ob ein
   * abweichendes luxAriaLabel ein sichtbares Label überschreibt (WCAG 2.5.3),
   * und gibt andernfalls eine Warnung aus (nur im Debug-Modus sichtbar).
   * Die Prüfung läuft einmalig bei der Initialisierung; spätere dynamische
   * Änderungen an den betroffenen Inputs werden nicht erneut geprüft.
   */
  protected checkA11yName() {
    const hasVisibleLabel = !!this.formLabelComponent() || !!this.luxLabel();

    if (!hasVisibleLabel && !this.luxAriaLabel() && !this.luxAriaLabelledby()) {
      this.logger.warn(
        `A11y: Das Formularelement (luxControlBinding=${this.luxControlBinding() ?? 'ohne Binding'}) besitzt keinen zugänglichen Namen. ` +
          `Bitte luxLabel (ggf. mit luxNoTopLabel), luxAriaLabel oder luxAriaLabelledby setzen.`
      );
    } else if (
      // Bei projiziertem <lux-form-label> ist der Text hier nicht auslesbar; um falsche Alarme zu
      // vermeiden, wird in diesem Fall keine 2.5.3-Warnung ausgegeben.
      !!this.luxLabel() &&
      !!this.luxAriaLabel() &&
      this.luxAriaLabel() !== this.luxLabel()
    ) {
      this.logger.warn(
        `A11y: Das Formularelement (luxControlBinding=${this.luxControlBinding() ?? 'ohne Binding'}) besitzt ein sichtbares Label ` +
          `und ein davon abweichendes luxAriaLabel. Das aria-label überschreibt das sichtbare Label (WCAG 2.5.3 "Label in Name").`
      );
    }
  }

  /**
   * Liefert den aktuellen Wert dieser FormComponent (ersetzt den früheren luxValue-Getter).
   */
  getValue(): T {
    return this.formControl ? this.formControl.value : this._initialValue;
  }

  /**
   * Setzt den aktuellen Wert dieser FormComponent (ersetzt den früheren luxValue-Setter).
   * @param value
   */
  setValue(value: T) {
    this.value.set(value);

    // Wenn noch kein FormControl vorhanden, den init-Wert merken und Fn beenden
    if (!this.formControl) {
      this._initialValue = value;
      return;
    }

    // Wenn der Wert bereits in dem FormControl bekannt ist, die Fn beenden
    if (value === this.formControl.value) {
      return;
    }
    // Den Wert im FormControl merken
    this.formControl.setValue(value);
  }

  /**
   * Wird nach der Aktualisierung des Wertes aufgerufen.
   * Hier kann z.B. luxValueChange.emit() ausgeführt werden.
   * @param formValue
   */
  protected notifyFormValueChanged(formValue: any) {}

  /**
   * Wird nach der Aktualisierung des Status aufgerufen.
   * @param formStatus
   */
  protected notifyFormStatusChanged(formStatus: any) {}

  /**
   * Prüft, ob das übergebene Control einen required-Validator (Validators.required oder
   * Validators.requiredTrue) besitzt.
   *
   * Hinweis: Prüft gezielt auf diese beiden Validator-Referenzen, statt den komponierten
   * Validator gegen ein Dummy-Control auszuführen. Ein Verhaltens-Check (Aufruf des
   * komponierten Validators) würde hier fälschlicherweise auch den von der nativen
   * [required]-Bindung eingeschleusten Angular-RequiredValidator erkennen, dessen Zustand
   * selbst wieder von luxRequired abhängt (Zirkelbezug: das eigentlich gewollte Entfernen
   * von required würde dadurch nie erkannt werden, siehe Issue #240).
   * @param abstractControl
   */
  protected hasRequiredValidator(abstractControl: AbstractControl) {
    return abstractControl.hasValidator(Validators.required) || abstractControl.hasValidator(Validators.requiredTrue);
  }

  /**
   * Initialisiert die FormGroup und das FormControl abhängig davon, ob es sich um eine ReactiveForm-Component
   * handelt.
   */
  protected initFormControl() {
    const boundFormGroup = this.luxFormGroup();
    const boundFormControl = this.luxFormControl();

    if (boundFormGroup) {
      this.formGroup = boundFormGroup;
    }

    if (boundFormControl) {
      this.formControl = boundFormControl;
    }

    const controlBinding = this.luxControlBinding();
    this.inForm = (!!this.controlContainer || !!this.formGroup) && !!controlBinding;

    if (this.inForm && controlBinding) {
      if (!this.formGroup) {
        this.formGroup = this.controlContainer?.control as FormGroup;
      }
      if (!this.formControl) {
        this.formControl = this.formGroup.controls[controlBinding] as FormControl<T>;
      }
      this.updateValidatorsInForm();
    } else {
      if (!this.formGroup) {
        this.formGroup = new FormGroup({
          control: new FormControl()
        });
        this.formControl = this.formGroup.get(LuxFormComponentBase.DEFAULT_CTRL_NAME) as FormControl<T>;
      }
      this.formControl.setValue(this._initialValue);
    }

    if (this.luxDisabled()) {
      this.formControl.disable();
    }

    this.luxDisabled.set(this.formControl.disabled);
    this.value.set(this.formControl.value);
  }

  /**
   * Initialisiert das Handling von Wertaktualisierungen.
   * Setzt den (optional vorhanden) Initial-Wert und folgende Änderungen über das FormControl.
   */
  protected initFormValueSubscription() {
    if (this._initialValue !== null && this._initialValue !== undefined) {
      this.setValue(this._initialValue);
    }

    // Aktualisierungen an dem FormControl-Value sollen auch nach außen bekannt gemacht werden.
    this._formValueChangeSub = this.formControl.valueChanges.subscribe((value: any) => {
      this.notifyFormValueChanged(value);
    });
  }

  /**
   * Initialisiert das Handling von Statusaktualisierungen.
   */
  protected initFormStateSubscription() {
    this._formStatusChangeSub = this.formControl.statusChanges.subscribe((status: any) => {
      if (status === 'DISABLED' && !this.luxDisabled()) {
        // Das FormControl hat den Zustand "DISABLED", aber die Property "luxDisabled"
        // hat noch den Wert "false". D.h. der FormControl-Status und die Property
        // sind nicht mehr synchron.
        this.luxDisabled.set(true);
      } else if ((status === 'VALID' || status === 'INVALID') && this.luxDisabled()) {
        // Das FormControl hat den Zustand "VALID" oder "INVALID" und ist aktiv,
        // aber die Property "luxDisabled" hat noch den Wert "true".
        // D.h. der FormControl-Status und die Property sind nicht mehr synchron.
        this.luxDisabled.set(false);
      }

      this.notifyFormStatusChanged(status);
    });
  }

  /**
   * Verbindet einen Wert-Input (luxValue, luxChecked, luxSelected) mit dem FormControl.
   * Der erste Lauf überschreibt einen bereits vorhandenen FormControl-Wert (z.B. aus einer
   * Reactive Form) nicht, solange von außen kein Wert gebunden wurde.
   */
  protected syncValueInputToFormControl(valueInput: Signal<unknown>) {
    let initialRun = true;

    effect(() => {
      const value = valueInput();

      untracked(() => {
        // Ohne gebundenen Startwert bleibt der (z.B. aus einer Reactive Form stammende)
        // FormControl-Wert maßgeblich.
        if (initialRun) {
          initialRun = false;

          if (value === undefined || value === null) {
            return;
          }
        }

        this.applyValueInput(value as T);
      });
    });
  }

  /**
   * Überträgt einen Wert aus dem Wert-Input in das FormControl. Ableitende Komponenten können
   * hier zusätzliche Regeln ergänzen (z.B. eine Umwandlung oder einen Readonly-Schutz).
   */
  protected applyValueInput(value: T) {
    this.setValue(value);
  }

  protected getRequiredValidator(): ValidatorFn {
    return Validators.required;
  }

  /**
   * Versucht die Validatoren für diese Komponente zu setzen.
   * Ist nur erfolgreich, wenn es sich hierbei nicht um eine ReactiveForm-Komponente handelt.
   * @param validators
   * @param checkRequiredValidator
   */
  protected updateValidators(validators: ValidatorFnType, checkRequiredValidator: boolean) {
    const hasValidators = (!Array.isArray(validators) && !!validators) || (Array.isArray(validators) && validators.length > 0);
    const requiredValidator = this.getRequiredValidator();
    const hasRequiredValidator = !!this.formControl && this.formControl.hasValidator(requiredValidator);
    const shouldHandleRequired = checkRequiredValidator && (this.luxRequired() || hasRequiredValidator);

    if (!hasValidators && !shouldHandleRequired) {
      return;
    }

    if (!this.inForm) {
      setTimeout(() => {
        // Der setTimeout-Callback feuert asynchron. Zu diesem Zeitpunkt kann inForm bereits true
        // sein, falls die Komponente an eine Reactive Form gebunden ist. Ohne diesen Guard würde
        // setValidators() die Validatoren des FormControls überschreiben.
        if (this.inForm) {
          return;
        }

        this.formControl.setValidators(validators ?? null);

        if (checkRequiredValidator) {
          if (this.luxRequired()) {
            this.formControl.addValidators(requiredValidator);
          } else {
            this.formControl.removeValidators(requiredValidator);
          }
        }

        this.formControl.updateValueAndValidity();
      });
    } else if (hasValidators) {
      this.logger.warn(
        `
Die Validatoren des Formularelements (luxControlBinding=${this.luxControlBinding()}) können ausschließlich über das Formular gesetzt werden,
aber nicht über das Property 'luxControlValidators'. Dieser Aufruf wurde ignoriert!`
      );
    }
  }

  private updateValidatorsInForm() {
    this.luxRequired.set(this.hasRequiredValidator(this.formControl));
  }
}
