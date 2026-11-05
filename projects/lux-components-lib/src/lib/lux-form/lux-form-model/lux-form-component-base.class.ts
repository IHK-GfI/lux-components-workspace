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
  viewChild,
  viewChildren
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  AbstractControl,
  ControlContainer,
  FormControl,
  FormGroup,
  NgControl,
  ValidationErrors,
  ValidatorFn,
  Validators
} from '@angular/forms';
import { TranslocoService } from '@jsverse/transloco';
import { Subscription } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';
import { LuxComponentsConfigService } from '../../lux-components-config/lux-components-config.service';
import { LuxConsoleService } from '../../lux-util/lux-console.service';
import { LuxUtil } from '../../lux-util/lux-util';
import { LuxFormControlWrapperComponent } from '../lux-form-control-wrapper/lux-form-control-wrapper.component';
import type { LuxFormControlWrapperState } from './lux-form-control-base.class';
import { LuxFormHintComponent } from '../lux-form-control/lux-form-control-subcomponents/lux-form-hint.component';
import { LuxFormLabelComponent } from '../lux-form-control/lux-form-control-subcomponents/lux-form-label.component';

export declare type LuxValidationErrors = ValidationErrors;
export declare type ValidatorFnType = ValidatorFn | ValidatorFn[] | null | undefined;
export declare type LuxErrorCallbackFnType = (value: any, errors: LuxValidationErrors) => string | undefined;

/** Stand von notifiedVersion, solange noch keine Wertänderung ausgeliefert wurde. */
const NOT_NOTIFIED = -1;

@Directive({
  host: {
    '[class.lux-form-control-readonly]': 'luxReadonly()'
  }
})
export abstract class LuxFormComponentBase<T = any> implements OnInit, DoCheck, OnDestroy {
  protected static readonly DEFAULT_CTRL_NAME: string = 'control';

  // Validatoren, die die Formular-Direktiven in den Templates aller LUX-Komponenten an ein Control gehängt
  // haben. Ist dasselbe FormControl an mehrere LUX-Komponenten gebunden, muss jede Komponente auch die
  // [required]-Validatoren der anderen ausklammern (siehe getAppValidator()).
  private static readonly templateValidatorsByControl = new WeakMap<AbstractControl, Set<ValidatorFn>>();

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

  readonly luxFocusIn = output<FocusEvent>();
  readonly luxFocusOut = output<FocusEvent>();

  readonly formLabelComponent = contentChild(LuxFormLabelComponent);
  readonly formHintComponent = contentChild(LuxFormHintComponent);

  readonly formControlWrapperComponent = viewChild(LuxFormControlWrapperComponent);
  readonly formControlWrapperComponentRef = viewChild(LuxFormControlWrapperComponent, { read: ElementRef });
  // Formular-Direktiven ([formControl]) im eigenen Template, siehe registerTemplateValidators().
  private readonly templateNgControls = viewChildren(NgControl);

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

  inForm = false;
  formGroup!: FormGroup;
  formControl!: FormControl<T>;

  protected _formValueChangeSub?: Subscription;
  protected _formStatusChangeSub?: Subscription;
  protected _configSubscription?: Subscription;

  protected latestErrors: any = null;
  protected _initialValue?: any;
  private a11yNameCheckTimeout?: ReturnType<typeof setTimeout>;
  // Von Subklassen (z.B. Datepicker/Datetimepicker/Timepicker) genutzt, um den ValueChange-Emit
  // in einen setTimeout auszulagern (vermeidet ExpressionChangedAfterChecked, siehe dortige
  // notifyFormValueChanged-Overrides) und diesen beim Zerstören der Komponente abzubrechen.
  protected notifyFormValueChangedTimeout?: ReturnType<typeof setTimeout>;
  // Von Time-/Datetimepicker genutzt, um das Öffnen/Schließen des Overlays (abhängig von
  // luxOpened) in einen setTimeout auszulagern, da die Overlay-Komponente zum Zeitpunkt des
  // Effects noch nicht gesetzt sein kann.
  protected triggerOpenCloseTimeout?: ReturnType<typeof setTimeout>;
  private validatorsInitialized = false;
  private readonly generatedUid = 'lux-form-control-' + uuidv4();
  private initialDeliveryTimeout?: ReturnType<typeof setTimeout>;

  /** Der zuletzt beobachtete Wert des FormControls (siehe observeValue). */
  private lastSeenValue: any;
  /** Zählt jede beobachtete Wertänderung, auch stille. */
  private valueVersion = 0;
  /** Stand von valueVersion bei der letzten Auslieferung an notifyFormValueChanged(). */
  private notifiedVersion = NOT_NOTIFIED;

  /**
   * Schreibt jede Wertänderung des FormControls mit - auch eine stille.
   *
   * Angular ruft die per registerOnChange() angemeldeten Funktionen in setValue() auf, und zwar
   * unabhängig von { emitEvent: false }. Da patchValue(), reset() und die Aktualisierung durch eine
   * FormGroup ebenfalls über setValue() laufen, wird hier jeder Schreibvorgang sichtbar.
   */
  private readonly valueObserver = (value: any) => this.observeValue(value);

  // Zwischenspeicher für hasComposedRequiredValidator(): Validator-Stand und Ergebnis der letzten Prüfung.
  private requiredCheckValidatorFn?: ValidatorFn | null;
  private requiredCheckResult = false;
  private requiredCheckRunning = false;
  private requiredProbe?: FormControl;
  // Eigene Einträge in templateValidatorsByControl, damit sie beim Zerstören wieder entfernt werden.
  private registeredTemplateValidators = new Set<ValidatorFn>();

  protected controlContainer = inject(ControlContainer, { optional: true });
  protected destroyRef = inject(DestroyRef);
  protected cdr = inject(ChangeDetectorRef);
  protected logger = inject(LuxConsoleService);
  protected configService = inject(LuxComponentsConfigService);
  protected tService = inject(TranslocoService);

  readonly uid = computed(() => this.luxId() || this.generatedUid);

  // Gemeinsame Schnittstelle mit LuxFormControlBase, damit LuxFormControlWrapperComponent beide
  // Basisklassen bedienen kann (siehe LuxFormControlWrapperHost).
  readonly wrapperState = computed<LuxFormControlWrapperState>(() => ({
    disabled: this.luxDisabled(),
    readonly: this.luxReadonly(),
    required: this.luxRequired(),
    showError: !!this.errorMessage() && this.touched() && !this.luxReadonly()
  }));

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
        this.scheduleInitialDelivery();
      });
    });
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

    if (this.initialDeliveryTimeout) {
      clearTimeout(this.initialDeliveryTimeout);
    }

    clearTimeout(this.notifyFormValueChangedTimeout);
    clearTimeout(this.triggerOpenCloseTimeout);

    // In Reactive Forms überlebt das FormControl diese Komponente. Ohne das Abmelden würde sich
    // bei jedem Neuaufbau (z.B. über @if) ein weiterer Beobachter ansammeln.
    // _unregisterOnChange ist internes Angular-API, deshalb defensiv aufgerufen.
    const control = this.formControl as unknown as { _unregisterOnChange?: (fn: unknown) => void };
    if (typeof control?._unregisterOnChange === 'function') {
      control._unregisterOnChange(this.valueObserver);
    }

    this.unregisterTemplateValidators();
  }

  /**
   * Liefert den Wert für "aria-labelledby" gemäß der Namenskaskade:
   * luxAriaLabelledby vor luxAriaLabel vor luxLabel (uid + '-label').
   * undefined bedeutet: kein aria-labelledby setzen (die Aria-Direktiven
   * entfernen das Attribut dann), damit ein gesetztes luxAriaLabel greifen kann.
   */
  /** Blendet die aktuell sichtbare Fehlermeldung aus (Schließen-Button im Wrapper). */
  dismissError() {
    this.errorMessage.set(undefined);
    this.formControl.updateValueAndValidity();
  }

  labelledBy(): string | undefined {
    if (this.luxAriaLabelledby()) {
      return this.luxAriaLabelledby();
    }
    if (this.luxAriaLabel()) {
      return undefined;
    }
    return this.formLabelComponent() || this.luxLabel() ? this.uid() + '-label' : undefined;
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
   * Validators.requiredTrue) besitzt. Erkannt wird er auch innerhalb eines komponierten
   * Validators, z.B. Validators.compose([Validators.required, ...]) (Issue #318).
   * @param abstractControl
   */
  protected hasRequiredValidator(abstractControl: AbstractControl) {
    if (abstractControl.hasValidator(Validators.required) || abstractControl.hasValidator(Validators.requiredTrue)) {
      return true;
    }

    return this.hasComposedRequiredValidator(abstractControl);
  }

  /**
   * Führt die Validatoren der Anwendung gegen ein leeres Hilfs-Control aus und prüft, ob dabei
   * ein required-Fehler entsteht. Das ist nötig, weil ein komponierter Validator eine neue Funktion
   * ist, in der hasValidator() die Referenz auf Validators.required nicht findet.
   *
   * Das Ergebnis wird zwischengespeichert, weil diese Prüfung aus ngDoCheck heraus aufgerufen wird.
   * Neu geprüft wird bei einem neuen Validator-Stand (setValidators(), addValidators(),
   * removeValidators()) und nach jedem Statuswechsel (siehe initFormStateSubscription()). Letzteres
   * erfasst bedingte Validatoren, deren Ergebnis sich ohne neuen Validator-Stand ändert.
   * @param control
   */
  private hasComposedRequiredValidator(control: AbstractControl): boolean {
    // Revalidiert ein Validator während der Probe andere Controls (z.B. über eine Closure), kann das
    // über deren Statuswechsel wieder hierher führen. Dann gilt das bisherige Ergebnis.
    if (control.validator === this.requiredCheckValidatorFn || this.requiredCheckRunning) {
      return this.requiredCheckResult;
    }

    this.requiredCheckRunning = true;
    let result = false;

    try {
      const appValidator = this.getAppValidator(control);

      if (appValidator) {
        // Bewusst ohne Parent: Validatoren mit Seiteneffekten auf andere Controls (z.B. setErrors()
        // am Nachbarfeld) sollen mit dem Wert null nicht das echte Formular verändern.
        this.requiredProbe ??= new FormControl(null);
        result = !!appValidator(this.requiredProbe)?.['required'];
      }
    } catch {
      // Ein Validator, der mit dem Hilfs-Control nicht zurechtkommt (z.B. control.parent!.get(...)),
      // soll die Komponente nicht lahmlegen. Das Feld gilt dann als nicht required.
      result = false;
    } finally {
      this.requiredCheckRunning = false;
    }

    this.requiredCheckValidatorFn = control.validator;
    this.requiredCheckResult = result;

    return result;
  }

  /**
   * Liefert den Validator des Controls ohne die Validatoren, die die Formular-Direktiven in den Templates
   * der Komponenten beigesteuert haben. Dazu gehört vor allem der Angular-RequiredValidator der nativen
   * [required]-Bindung. Dessen Zustand hängt selbst wieder von luxRequired ab. Würde er mitgeprüft,
   * könnte ein einmal gesetztes luxRequired nie wieder zurückgesetzt werden (Zirkelbezug, Issue #240).
   *
   * Angular bietet keine lesende API für die einzelnen Validatoren eines Controls. Deshalb werden die
   * Template-Validatoren kurz entfernt und wieder hinzugefügt. setValidators() löst dabei weder eine
   * Validierung noch Events aus.
   * @param control
   */
  private getAppValidator(control: AbstractControl): ValidatorFn | null {
    const templateValidators = [...(LuxFormComponentBase.templateValidatorsByControl.get(control) ?? [])].filter((validator) =>
      control.hasValidator(validator)
    );

    if (templateValidators.length === 0) {
      return control.validator;
    }

    control.removeValidators(templateValidators);
    const appValidator = control.validator;
    control.addValidators(templateValidators);

    return appValidator;
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
    this.lastSeenValue = this.formControl.value;
    this.formControl.registerOnChange(this.valueObserver);

    if (this._initialValue !== null && this._initialValue !== undefined) {
      this.setValue(this._initialValue);
    }

    // Aktualisierungen an dem FormControl-Value sollen auch nach außen bekannt gemacht werden.
    this._formValueChangeSub = this.formControl.valueChanges.subscribe((value: any) => {
      this.forwardFormValueChange(value);
    });
  }

  /**
   * Schreibt eine Wertänderung des FormControls mit. Idempotent, darf also beliebig oft je
   * Änderung aufgerufen werden.
   */
  private observeValue(value: any) {
    if (!Object.is(value, this.lastSeenValue)) {
      this.lastSeenValue = value;
      this.valueVersion++;
    }
  }

  /**
   * Reicht eine Emission des valueChanges-Observables an notifyFormValueChanged() weiter, sofern
   * sich der Wert seit der letzten Auslieferung geändert hat.
   *
   * Maßgeblich ist bewusst der Zähler und nicht der Wert selbst. Ein Wertvergleich - so wie ihn das
   * frühere distinctUntilChanged() angestellt hat - bemerkt nicht, dass der Wert zwischendurch still
   * (emitEvent: false) auf etwas anderes und wieder zurück gesetzt wurde, und verschluckt die
   * Änderung (Issue #284). Der Zähler steigt bei jeder Änderung, auch bei einer stillen.
   *
   * Umgekehrt emittiert updateValueAndValidity() auch dann ein valueChanges, wenn nur die
   * Validatoren neu ausgewertet wurden. Dabei bleibt der Zähler stehen, sodass daraus kein Event
   * wird - und ein Zyklus, in dem Change-Handler einander über updateValueAndValidity() aufrufen,
   * bricht nach dem ersten Durchlauf ab (Issue #307).
   */
  private forwardFormValueChange(value: any) {
    // Fallback: Ein setValue(..., { emitModelToViewChange: false }) übergeht die per
    // registerOnChange() angemeldeten Funktionen, der Beobachter läuft dann nicht.
    this.observeValue(value);

    if (this.valueVersion === this.notifiedVersion) {
      return;
    }

    this.notifiedVersion = this.valueVersion;
    this.notifyFormValueChanged(value);
  }

  /**
   * Der Startzustand gilt nach der Initialisierung als ausgeliefert, auch wenn gar nichts
   * ausgeliefert wurde. Ohne das bliebe der Merker auf NOT_NOTIFIED stehen und die erste spätere
   * Emission käme durch - auch eine reine Neubewertung, etwa durch ein nachträglich gesetztes
   * luxRequired. Der Timeout muss nach dem von updateValidators() laufen, deshalb wird er erst
   * im Anschluss an dessen ersten Aufruf eingeplant.
   */
  private scheduleInitialDelivery() {
    if (this.initialDeliveryTimeout) {
      return;
    }

    this.initialDeliveryTimeout = setTimeout(() => {
      if (this.notifiedVersion === NOT_NOTIFIED) {
        this.notifiedVersion = this.valueVersion;
      }
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

      if (this.inForm && (status === 'VALID' || status === 'INVALID')) {
        // Bedingte Validatoren (z.B. required nur bei gesetztem Flag) liefern nach einer Revalidierung
        // evtl. ein anderes Ergebnis. Deshalb hier sofort neu prüfen, obwohl sich der Status selbst
        // nicht geändert haben muss.
        this.requiredCheckValidatorFn = undefined;
        this.updateValidatorsInForm();
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

  /**
   * Validatoren, die diese Komponente unabhängig von luxControlValidators immer benötigt
   * (z.B. eine Formatprüfung). Unterklassen überschreiben das, statt updateValidators() zu kopieren.
   */
  protected getAdditionalValidators(): ValidatorFn[] {
    return [];
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
    const additionalValidators = this.getAdditionalValidators();

    if (!hasValidators && !shouldHandleRequired && additionalValidators.length === 0) {
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

        if (additionalValidators.length > 0) {
          this.formControl.addValidators(additionalValidators);
        }

        if (checkRequiredValidator) {
          if (this.luxRequired()) {
            this.formControl.addValidators(requiredValidator);
          } else {
            this.formControl.removeValidators(requiredValidator);
          }
        }

        // Bewusst mit Event: Ableitende Komponenten können ihren Initialwert an genau dieser Emission
        // aufbereiten. Dass daraus kein Value-Change wird, obwohl sich der Wert nicht geändert hat,
        // stellt forwardFormValueChange() sicher.
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
    this.registerTemplateValidators();
    const hasRequiredValidator = this.hasRequiredValidator(this.formControl);

    if (this.luxRequired() !== hasRequiredValidator) {
      this.luxRequired.set(hasRequiredValidator);
      // Eine [required]-Bindung im Template sofort übernehmen: Deren RequiredValidator validiert das Control neu.
      // Liefe das erst im nächsten Durchlauf, wären dort bereits ausgewertete Bindungen auf formControl.invalid
      // veraltet (ExpressionChangedAfterItHasBeenCheckedError).
      if (this.templateNgControls().length > 0) {
        this.cdr.detectChanges();
      }
    }
  }

  /**
   * Trägt die Validatoren der Formular-Direktiven ([formControl]) aus dem eigenen Template in
   * templateValidatorsByControl ein. Läuft bei jeder required-Prüfung, weil die Direktiven erst mit dem
   * View entstehen und durch @if-Blöcke wechseln können.
   */
  private registerTemplateValidators() {
    this.templateNgControls().forEach((ngControl) => {
      const validator = ngControl.validator;

      if (validator && ngControl.control === this.formControl && !this.registeredTemplateValidators.has(validator)) {
        let registered = LuxFormComponentBase.templateValidatorsByControl.get(this.formControl);
        if (!registered) {
          registered = new Set<ValidatorFn>();
          LuxFormComponentBase.templateValidatorsByControl.set(this.formControl, registered);
        }

        registered.add(validator);
        this.registeredTemplateValidators.add(validator);
      }
    });
  }

  private unregisterTemplateValidators() {
    const registered = this.formControl ? LuxFormComponentBase.templateValidatorsByControl.get(this.formControl) : undefined;
    this.registeredTemplateValidators.forEach((validator) => registered?.delete(validator));
    this.registeredTemplateValidators.clear();
  }
}
