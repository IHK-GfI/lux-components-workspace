import {
  ChangeDetectorRef,
  ContentChild,
  Directive,
  DoCheck,
  ElementRef,
  EventEmitter,
  HostBinding,
  Input,
  OnDestroy,
  OnInit,
  Output,
  QueryList,
  ViewChild,
  ViewChildren,
  inject
} from '@angular/core';
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
import { LuxFormHintComponent } from '../lux-form-control/lux-form-control-subcomponents/lux-form-hint.component';
import { LuxFormLabelComponent } from '../lux-form-control/lux-form-control-subcomponents/lux-form-label.component';

export declare type LuxValidationErrors = ValidationErrors;
export declare type ValidatorFnType = ValidatorFn | ValidatorFn[] | null | undefined;
export declare type LuxErrorCallbackFnType = (value: any, errors: LuxValidationErrors) => string | undefined;

/** Stand von notifiedVersion, solange noch keine Wertänderung ausgeliefert wurde. */
const NOT_NOTIFIED = -1;

@Directive()
export abstract class LuxFormComponentBase<T = any> implements OnInit, DoCheck, OnDestroy {
  protected static readonly DEFAULT_CTRL_NAME: string = 'control';

  // Validatoren, die die Formular-Direktiven in den Templates aller LUX-Komponenten an ein Control gehängt
  // haben. Ist dasselbe FormControl an mehrere LUX-Komponenten gebunden, muss jede Komponente auch die
  // [required]-Validatoren der anderen ausklammern (siehe getAppValidator()).
  private static readonly templateValidatorsByControl = new WeakMap<AbstractControl, Set<ValidatorFn>>();

  protected _formValueChangeSub?: Subscription;
  protected _formStatusChangeSub?: Subscription;
  protected _configSubscription?: Subscription;

  protected latestErrors: any = null;
  protected _initialValue?: any;
  protected _initialDisabled?: boolean;
  protected _luxDisabled = false;
  protected _luxReadonly = false;
  protected _luxRequired = false;
  protected _luxControlValidators?: ValidatorFnType;
  private a11yNameCheckTimeout?: ReturnType<typeof setTimeout>;
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

  errorMessage: string | undefined = undefined;

  protected controlContainer = inject(ControlContainer, { optional: true });
  protected cdr = inject(ChangeDetectorRef);
  protected logger = inject(LuxConsoleService);
  protected configService = inject(LuxComponentsConfigService);
  protected tService = inject(TranslocoService);

  inForm = false;
  formGroup!: FormGroup;
  formControl!: FormControl<T>;

  uid = '';

  @ContentChild(LuxFormLabelComponent) formLabelComponent?: LuxFormLabelComponent;
  @ContentChild(LuxFormHintComponent) formHintComponent?: LuxFormHintComponent;

  @ViewChild(LuxFormControlWrapperComponent) formControlWrapperComponent?: LuxFormControlWrapperComponent;
  @ViewChild(LuxFormControlWrapperComponent, { read: ElementRef }) formControlWrapperComponentRef?: ElementRef;
  // Formular-Direktiven ([formControl]) im eigenen Template, siehe registerTemplateValidators().
  @ViewChildren(NgControl) private templateNgControls?: QueryList<NgControl>;

  @HostBinding('class.lux-form-control-readonly') cssReadonly = false;

  @Output() luxFocusIn = new EventEmitter<FocusEvent>();
  @Output() luxFocusOut = new EventEmitter<FocusEvent>();
  @Output() luxDisabledChange = new EventEmitter<boolean>();

  @Input() luxId = '';
  @Input() luxHint = '';
  @Input() luxHintShowOnlyOnFocus = false;
  @Input() luxLabel = '';
  @Input() luxLabelLongFormat = false;
  /**
   * Setzt "aria-label" auf dem nativen Eingabeelement. Nur für Felder gedacht,
   * die kein sichtbares Label besitzen (z.B. Suchfeld). Hat ein Control ein
   * sichtbares Label, überschreibt ein abweichendes aria-label den sichtbaren
   * Text (WCAG 2.5.3 "Label in Name") - siehe Warnung in checkA11yName().
   */
  @Input() luxAriaLabel?: string;
  /**
   * Setzt "aria-labelledby" auf dem nativen Eingabeelement und verweist damit
   * auf ein eigenes, externes Label-Element. Hat Vorrang vor luxAriaLabel und luxLabel.
   */
  @Input() luxAriaLabelledby?: string;
  /**
   * Blendet das obere Label nur visuell aus (lux-sr-only). Das <label> bleibt im DOM,
   * der zugängliche Name des Controls bleibt erhalten (Issue #267).
   * Wirkt auch ohne gesetztes luxLabel: Dann entfällt die leere Label-Zeile visuell,
   * die sonst für die Flucht mit sichtbar gelabelten Nachbarfeldern reserviert bleibt.
   */
  @Input() luxNoTopLabel = false;
  /**
   * Entfernt den unteren Bereich (Hint, Fehlermeldung, Counter) aus dem DOM.
   * Achtung, bewusste Entscheidung: Damit entfällt auch die per aria-describedby
   * referenzierte Fehlermeldung. Nur einsetzen, wenn Fehler an anderer Stelle
   * wahrnehmbar gemacht werden.
   */
  @Input() luxNoBottomLabel = false;
  /**
   * Kombination aus luxNoTopLabel und luxNoBottomLabel: Das Label wird nur visuell
   * versteckt, der untere Bereich inklusive Fehlermeldung wird entfernt.
   * Siehe die Hinweise an den beiden Einzel-Inputs.
   */
  @Input() luxNoLabels = false;

  @Input() luxControlBinding?: string;
  @Input() luxErrorMessage?: string;
  @Input() luxErrorCallback: LuxErrorCallbackFnType = () => undefined;
  @Input() luxDense = false;

  get luxFormControl(): FormControl<T> {
    return this.formControl;
  }

  @Input() set luxFormControl(formControl: FormControl<T>) {
    this.formControl = formControl;
  }

  /**
   * Liefert den Wert für "aria-labelledby" gemäß der Namenskaskade:
   * luxAriaLabelledby vor luxAriaLabel vor luxLabel (uid + '-label').
   * undefined bedeutet: kein aria-labelledby setzen (die Aria-Direktiven
   * entfernen das Attribut dann), damit ein gesetztes luxAriaLabel greifen kann.
   */
  labelledBy(): string | undefined {
    if (this.luxAriaLabelledby) {
      return this.luxAriaLabelledby;
    }
    if (this.luxAriaLabel) {
      return undefined;
    }
    return this.formLabelComponent || this.luxLabel ? this.uid + '-label' : undefined;
  }

  get luxFormGroup(): FormGroup {
    return this.formGroup;
  }

  @Input() set luxFormGroup(formGroup: FormGroup) {
    this.formGroup = formGroup;
  }

  get luxControlValidators(): ValidatorFnType {
    return this._luxControlValidators;
  }

  @Input() set luxControlValidators(validators: ValidatorFnType) {
    this._luxControlValidators = validators;
    this.updateValidators(validators, false);
  }

  get luxDisabled(): boolean {
    return this._luxDisabled;
  }

  @Input() set luxDisabled(disabled: boolean) {
    this._luxDisabled = disabled;
    this.cdr.detectChanges();

    if (this.formControl) {
      this.handleFormDisabledState();
    } else {
      this._initialDisabled = disabled;
    }

    this.luxDisabledChange.emit(this._luxDisabled);
  }

  get luxReadonly(): boolean {
    return this._luxReadonly;
  }

  @Input() set luxReadonly(readonly: boolean) {
    this._luxReadonly = readonly;
    this.cssReadonly = readonly;
    this.cdr.detectChanges();
  }

  get luxRequired(): boolean {
    return this._luxRequired;
  }

  @Input() set luxRequired(required: boolean) {
    if (this.inForm) {
      this.logger.error(
        `Attention: Use the Required-Validator instead of the ` +
          `Property "luxRequired" for components within ReactiveForms..\n` +
          `Affected component: ${this.luxControlBinding ? this.luxControlBinding : 'No binding found'}`
      );
    } else {
      this._luxRequired = required;
      this.updateValidators(this.luxControlValidators, true);
      this.cdr.detectChanges();
    }
  }

  ngOnInit() {
    if (this.luxId) {
      this.uid = this.luxId;
    } else {
      this.uid = 'lux-form-control-' + uuidv4();
    }

    this.initFormControl();
    this.initFormValueSubscription();
    this.initFormStateSubscription();
    this.updateValidators(this.luxControlValidators, true);

    // Der Startzustand gilt nach der Initialisierung als ausgeliefert, auch wenn gar nichts
    // ausgeliefert wurde. Ohne das bliebe der Merker auf NOT_NOTIFIED stehen und die erste spätere
    // Emission käme durch - auch eine reine Neubewertung, etwa durch ein nachträglich gesetztes
    // luxRequired. Der Timeout läuft nach dem von updateValidators(), das die Reihenfolge braucht.
    this.initialDeliveryTimeout = setTimeout(() => {
      if (this.notifiedVersion === NOT_NOTIFIED) {
        this.notifiedVersion = this.valueVersion;
      }
    });

    // Verzögert prüfen, damit der @ContentChild formLabelComponent bereits aufgelöst ist.
    this.a11yNameCheckTimeout = setTimeout(() => this.checkA11yName());
  }

  ngDoCheck() {
    // Required-Validator kann sich ändern, ohne dass sich der FormControl-Status ändert.
    // Deshalb in Reactive Forms den luxRequired-Status pro Check synchronisieren.
    if (this.inForm) {
      this.updateValidatorsInForm();
    }

    // Prüfen, ob es neue Fehlermeldungen gibt, wenn ja diese laden und speichern.
    if (this.latestErrors !== this.formControl.errors && this.formControl.touched) {
      this.latestErrors = this.formControl.errors;
      this.errorMessage = this.fetchErrorMessage();
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
      errorMsg = this.luxErrorMessage
        ? this.luxErrorMessage
        : this.luxErrorCallback
          ? this.luxErrorCallback(value, errors || {})
          : undefined;
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
    if (this.luxDisabled && !this.formControl.disabled) {
      this.formControl.disable();
    }

    if (!this.luxDisabled && this.formControl.disabled) {
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
    const hasVisibleLabel = !!this.formLabelComponent || !!this.luxLabel;

    if (!hasVisibleLabel && !this.luxAriaLabel && !this.luxAriaLabelledby) {
      this.logger.warn(
        `A11y: Das Formularelement (luxControlBinding=${this.luxControlBinding ?? 'ohne Binding'}) besitzt keinen zugänglichen Namen. ` +
          `Bitte luxLabel (ggf. mit luxNoTopLabel), luxAriaLabel oder luxAriaLabelledby setzen.`
      );
    } else if (
      // Bei projiziertem <lux-form-label> ist der Text hier nicht auslesbar; um falsche Alarme zu
      // vermeiden, wird in diesem Fall keine 2.5.3-Warnung ausgegeben.
      !!this.luxLabel &&
      !!this.luxAriaLabel &&
      this.luxAriaLabel !== this.luxLabel
    ) {
      this.logger.warn(
        `A11y: Das Formularelement (luxControlBinding=${this.luxControlBinding ?? 'ohne Binding'}) besitzt ein sichtbares Label ` +
          `und ein davon abweichendes luxAriaLabel. Das aria-label überschreibt das sichtbare Label (WCAG 2.5.3 "Label in Name").`
      );
    }
  }

  /**
   * Standard-Getter Funktion für den aktuellen Wert in dieser FormComponent.
   */
  protected getValue(): T {
    return this.formControl ? this.formControl.value : this._initialValue;
  }

  /**
   * Standard-Setter Funktion für den aktuellen Wert in dieser FormComponent.
   * @param value
   */
  protected setValue(value: T) {
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
   * Hier kann z.B. valueChange.emit() ausgeführt werden.
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
   * der LUX-Komponenten beigesteuert haben. Dazu gehört vor allem der Angular-RequiredValidator der nativen
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
    this.inForm = (!!this.controlContainer || !!this.formGroup) && !!this.luxControlBinding;

    if (this.inForm && this.luxControlBinding) {
      if (!this.formGroup) {
        this.formGroup = this.controlContainer?.control as FormGroup;
      }
      if (!this.formControl) {
        this.formControl = this.formGroup.controls[this.luxControlBinding] as FormControl<T>;
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

    if (this._initialDisabled) {
      this.formControl.disable();
    }

    this.luxDisabled = this.formControl.disabled;
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

    // Aktualisierungen an dem FormControl-Value sollen auch via EventEmitter bekannt gemacht werden.
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
   * bricht nach dem ersten Durchlauf ab.
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
   * Initialisiert das Handling von Statusaktualisierungen.
   */
  protected initFormStateSubscription() {
    this._formStatusChangeSub = this.formControl.statusChanges.subscribe((status: any) => {
      if (status === 'DISABLED' && !this.luxDisabled) {
        // Das FormControl hat den Zustand "DISABLED", aber die Property "luxDisabled"
        // hat noch den Wert "false". D.h. der FormControl-Status und die Property
        // sind nicht mehr synchron.
        this.luxDisabled = true;
      } else if ((status === 'VALID' || status === 'INVALID') && this.luxDisabled) {
        // Das FormControl hat den Zustand "VALID" oder "INVALID" und ist aktiv,
        // aber die Property "luxDisabled" hat noch den Wert "true".
        // D.h. der FormControl-Status und die Property sind nicht mehr synchron.
        this.luxDisabled = false;
      }

      if (this.inForm && (status === 'VALID' || status === 'INVALID')) {
        // Bedingte Validatoren (z.B. required nur bei gesetztem Flag) liefern nach einer Revalidierung
        // evtl. ein anderes Ergebnis. Deshalb hier sofort neu prüfen: Ändert sich luxRequired, sorgt
        // markForCheck() in updateValidatorsInForm() dafür, dass der Stern auch bei OnPush-Hosts und
        // zoneless erscheint, obwohl sich der Status selbst nicht geändert haben muss.
        this.requiredCheckValidatorFn = undefined;
        this.updateValidatorsInForm();
      }

      this.notifyFormStatusChanged(status);
    });
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
    const shouldHandleRequired = checkRequiredValidator && (this.luxRequired || hasRequiredValidator);
    const additionalValidators = this.getAdditionalValidators();

    if (!hasValidators && !shouldHandleRequired && additionalValidators.length === 0) {
      return;
    }

    // Zum Zeitpunkt dieses synchronen Aufrufs ist inForm noch false, weil Angular @Input()-Properties
    // vor ngOnInit setzt und inForm erst in ngOnInit (initFormControl) initialisiert wird.
    if (!this.inForm) {
      setTimeout(() => {
        // Der setTimeout-Callback feuert asynchron - nach ngOnInit. Zu diesem Zeitpunkt kann inForm
        // bereits true sein, falls die Komponente an eine Reactive Form gebunden ist. Ohne diesen
        // Guard würde setValidators() die Validatoren des FormControls überschreiben.
        if (this.inForm) {
          return;
        }

        this._luxControlValidators = validators;
        this.formControl.setValidators(this.luxControlValidators ?? null);

        if (additionalValidators.length > 0) {
          this.formControl.addValidators(additionalValidators);
        }

        if (checkRequiredValidator) {
          if (this.luxRequired) {
            this.formControl.addValidators(requiredValidator);
          } else {
            this.formControl.removeValidators(requiredValidator);
          }
        }

        // Bewusst mit Event: Komponenten wie lux-select-ac (luxPickValue-Normalisierung) oder die
        // Date-Picker (ISO-Konvertierung) bereiten ihren Initialwert an genau dieser Emission auf.
        // Dass daraus kein luxValueChange wird, obwohl sich der Wert nicht geändert hat, stellt
        // forwardFormValueChange() sicher.
        this.formControl.updateValueAndValidity();
      });
    } else if (hasValidators) {
      this.logger.warn(
        `
Die Validatoren des Formularelements (luxControlBinding=${this.luxControlBinding}) können ausschließlich über das Formular gesetzt werden,
aber nicht über das Property 'luxControlValidators'. Dieser Aufruf wurde ignoriert!`
      );
    }
  }

  private updateValidatorsInForm() {
    this.registerTemplateValidators();
    const hasRequiredValidator = this.hasRequiredValidator(this.formControl);

    if (this._luxRequired !== hasRequiredValidator) {
      this._luxRequired = hasRequiredValidator;
      this.cdr.markForCheck();
      // Die [required]-Bindung sofort übernehmen: Deren RequiredValidator validiert das Control neu. Liefe das
      // erst im nächsten Durchlauf, wären dort bereits ausgewertete Bindungen auf formControl.invalid (z.B.
      // aria-invalid in lux-select-ac oder lux-checkbox-ac) veraltet (ExpressionChangedAfterItHasBeenCheckedError).
      this.cdr.detectChanges();
    }
  }

  /**
   * Trägt die Validatoren der Formular-Direktiven ([formControl]) aus dem eigenen Template in
   * templateValidatorsByControl ein. Läuft bei jeder required-Prüfung, weil die Direktiven erst mit dem
   * View entstehen und durch @if-Blöcke wechseln können.
   */
  private registerTemplateValidators() {
    this.templateNgControls?.forEach((ngControl) => {
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
