import {
  Directive,
  ElementRef,
  InjectionToken,
  Provider,
  Signal,
  Type,
  afterNextRender,
  computed,
  contentChild,
  forwardRef,
  inject,
  input,
  linkedSignal,
  model,
  output,
  signal,
  viewChild
} from '@angular/core';
// ValidationError besitzt keinen Runtime-Wert (reines Typ-Konstrukt aus Interface + Namespace),
// deshalb zwingend als "import type".
import type { ValidationError } from '@angular/forms/signals';
import { TranslocoService } from '@jsverse/transloco';
import { v4 as uuidv4 } from 'uuid';
import { LuxConsoleService } from '../../lux-util/lux-console.service';
import { LuxUtil } from '../../lux-util/lux-util';
import { LuxFormControlWrapperComponent } from '../lux-form-control-wrapper/lux-form-control-wrapper.component';
import { LuxFormHintComponent } from '../lux-form-control/lux-form-control-subcomponents/lux-form-hint.component';
import { LuxFormLabelComponent } from '../lux-form-control/lux-form-control-subcomponents/lux-form-label.component';
// Bewusst "import type": So entsteht keine Laufzeit-Abhängigkeit der neuen Basisklasse auf die
// alte LuxFormComponentBase, die mit der Legacy-Schicht entfallen soll.
import type { LuxErrorCallbackFnType, LuxValidationErrors } from './lux-form-component-base.class';

/**
 * Zustand, den eine Legacy-Brücke (Reactive Forms per luxControlBinding oder per
 * formControlName/ControlValueAccessor) über die Vertrags-Inputs stellt.
 *
 * Im Signal-Forms-Betrieb ist dieses Objekt immer undefined - dort füllt die
 * [formField]-Direktive die Vertrags-Inputs direkt.
 */
export interface LuxControlStateOverride {
  disabled?: boolean;
  readonly?: boolean;
  required?: boolean;
  touched?: boolean;
  dirty?: boolean;
  invalid?: boolean;
  /**
   * Die Fehler des gebundenen AbstractControls, bewusst in der klassischen ValidationErrors-Form.
   *
   * Ein Umweg über ValidationError[] wäre verlustbehaftet: Reactive-Forms-Fehler tragen Details wie
   * minlength.actualLength, die es in Signal Forms nicht gibt - bestehende luxErrorCallback-
   * Implementierungen lesen genau diese Felder aber aus.
   */
  legacyErrors?: LuxValidationErrors | null;
}

/**
 * Der Zustand, den LuxFormControlWrapperComponent für die Darstellung braucht.
 *
 * Bewusst ein einziges gebündeltes Member statt vieler Einzel-Signale: Der Wrapper bedient sowohl
 * LuxFormControlBase als auch die noch nicht migrierte LuxFormComponentBase, und Einzelnamen wie
 * "isDisabled" kollidieren dort mit vorhandener Komponenten-API (z.B. LuxRadioComponent.isDisabled(option)).
 */
export interface LuxFormControlWrapperState {
  readonly disabled: boolean;
  readonly readonly: boolean;
  readonly required: boolean;
  readonly showError: boolean;
}

/**
 * Token, über das die Legacy-Brücken die LUX-FormComponent ihres Host-Elements erhalten.
 * Jede FormComponent stellt es per provideLuxFormControl() bereit.
 */
export const LUX_FORM_CONTROL = new InjectionToken<LuxFormControlBase>('LUX_FORM_CONTROL');

/**
 * Stellt die FormComponent unter LUX_FORM_CONTROL bereit, damit die Legacy-Brücken (z.B. die
 * ControlValueAccessor-Direktive für formControlName) sie am selben Element finden.
 *
 * Aufruf mit einer Factory statt der Klasse selbst, weil das Provider-Array im @Component-Decorator
 * ausgewertet wird, bevor die Klasse existiert.
 *
 * @example providers: [provideLuxFormControl(() => LuxInputComponent)]
 */
export function provideLuxFormControl(controlType: () => Type<LuxFormControlBase<any>>): Provider {
  return { provide: LUX_FORM_CONTROL, useExisting: forwardRef(() => controlType()) };
}

/**
 * Basisklasse aller LUX-FormControls.
 *
 * Implementiert den in Angular 22 eingeführten FormUiControl-Vertrag aus @angular/forms/signals:
 * Die Inputs disabled, readonly, required, invalid, pending, dirty, touched, name und errors sowie
 * der Output touch werden von der [formField]-Direktive automatisch verdrahtet.
 *
 * WICHTIG: Die Namen dieser Vertrags-Properties sind bindend. Angular schlägt sie zur Laufzeit über
 * den öffentlichen Input-Namen nach (ControlDirectiveHostImpl.setInputOnDirectives), ein alias:
 * würde den Vertrag also unbrauchbar machen. LUX-eigene Properties tragen deshalb wie gehabt das
 * lux-Präfix, die Vertrags-Properties bewusst nicht.
 *
 * Die Klasse enthält keine Lifecycle-Hooks, kein RxJS und keine Timer - der gesamte Zustand ist
 * entweder ein Input oder daraus abgeleitet.
 */
@Directive({
  host: {
    '[class.lux-form-control-readonly]': 'isReadonly()'
  }
})
export abstract class LuxFormControlBase<T = unknown> {
  // --- Signal-Forms-Vertrag (Namen nicht ändern, siehe Klassenkommentar) ---
  readonly disabled = input(false);
  readonly readonly = input(false);
  readonly required = input(false);
  readonly invalid = input(false);
  readonly pending = input(false);
  readonly dirty = input(false);
  readonly touched = input(false);
  readonly name = input('');
  // Der Typ muss exakt dem FormUiControl-Vertrag entsprechen: InputSignal<T> ist über sein
  // Write-Type-Brand invariant, ein "engerer" Typ wäre deshalb nicht zuweisbar.
  readonly errors = input<readonly ValidationError.WithOptionalFieldTree[]>([]);

  // --- LUX-Aliase der Vertrags-Zustände ---
  // Diese drei sind die von der bisherigen API gewohnten Namen. Sie bleiben erhalten, damit
  // bestehende Templates unverändert funktionieren, und werden von isDisabled()/isRequired()/
  // isReadonly() mit den gleichnamigen Vertrags-Inputs verodert.
  /**
   * Im Signal-Form über die disabled()-Regel des Schemas steuern - dort wird dieser Alias nicht
   * gebraucht. Im schemalosen [(value)]-Betrieb (kein [formField], siehe LuxLegacyFormBridge) ist
   * er weiterhin erforderlich: Nur luxDisabled schaltet dort das synthetische FormControl der
   * Brücke disabled, der Vertrags-Input disabled() bleibt dort wirkungslos. Deshalb bewusst NICHT
   * &#64;deprecated - das würde Tooling/Codemods dazu verleiten, ihn überall durch disabled() zu
   * ersetzen und damit den [(value)]-Betrieb zu brechen.
   */
  readonly luxDisabled = model(false);
  /**
   * Im Signal-Form über die required()-Regel des Schemas steuern - dort wird dieser Alias nicht
   * gebraucht. Im schemalosen [(value)]-Betrieb (kein [formField], siehe LuxLegacyFormBridge) ist
   * er weiterhin erforderlich: Nur luxRequired schaltet dort den Validators.required am
   * synthetischen FormControl der Brücke scharf, der Vertrags-Input required() bleibt dort
   * wirkungslos. Deshalb bewusst NICHT &#64;deprecated - das würde Tooling/Codemods dazu verleiten,
   * ihn überall durch required() zu ersetzen und damit den [(value)]-Betrieb zu brechen.
   */
  readonly luxRequired = model(false);
  /**
   * @deprecated Im Signal-Form über readonly() bzw. die readonly()-Regel des Schemas steuern. Im
   * schemalosen [(value)]-Betrieb genauso gut durch den Vertrags-Input readonly() ersetzbar - die
   * LuxLegacyFormBridge kennt readonly gar nicht, es gibt also keine funktionale Abhängigkeit wie
   * bei luxDisabled/luxRequired.
   */
  readonly luxReadonly = input(false);

  // --- LUX-Präsentation ---
  readonly luxId = input('');
  /**
   * Sichtbares Label des Controls. Als Model ausgelegt, damit ableitende Komponenten das Label
   * über eigene Aliase (z.B. luxInputLabel bei lux-chips) setzen können.
   */
  readonly luxLabel = model('');
  readonly luxLabelLongFormat = input(false);
  readonly luxHint = input('');
  readonly luxHintShowOnlyOnFocus = input(false);
  readonly luxDense = input(false);
  /**
   * Setzt "aria-label" auf dem nativen Eingabeelement. Nur für Felder gedacht, die kein sichtbares
   * Label besitzen. Ein abweichendes aria-label überschreibt ein sichtbares Label (WCAG 2.5.3),
   * siehe die Warnung in checkA11yName().
   */
  readonly luxAriaLabel = input<string | undefined>(undefined);
  /** Verweist auf ein externes Label-Element. Hat Vorrang vor luxAriaLabel und luxLabel. */
  readonly luxAriaLabelledby = input<string | undefined>(undefined);
  /**
   * Blendet das obere Label nur visuell aus (lux-sr-only). Das <label> bleibt im DOM, der
   * zugängliche Name des Controls bleibt erhalten (Issue #267).
   */
  readonly luxNoTopLabel = input(false);
  /**
   * Entfernt den unteren Bereich (Hint, Fehlermeldung, Counter) aus dem DOM. Damit entfällt auch
   * die per aria-describedby referenzierte Fehlermeldung - nur einsetzen, wenn Fehler an anderer
   * Stelle wahrnehmbar gemacht werden.
   */
  readonly luxNoBottomLabel = input(false);
  /** Kombination aus luxNoTopLabel und luxNoBottomLabel. */
  readonly luxNoLabels = input(false);

  // --- LUX-Fehlertexte ---
  readonly luxErrorMessage = input<string | undefined>(undefined);
  readonly luxErrorCallback = input<LuxErrorCallbackFnType>(() => undefined);

  readonly touch = output<void>();
  readonly luxFocusIn = output<FocusEvent>();
  readonly luxFocusOut = output<FocusEvent>();

  readonly formLabelComponent = contentChild(LuxFormLabelComponent);
  readonly formHintComponent = contentChild(LuxFormHintComponent);

  readonly formControlWrapperComponent = viewChild(LuxFormControlWrapperComponent);
  readonly formControlWrapperComponentRef = viewChild(LuxFormControlWrapperComponent, { read: ElementRef });

  /**
   * Wird ausschließlich von den Legacy-Brücken gesetzt (siehe LuxControlStateOverride).
   * Ist im Signal-Forms-Betrieb und beim reinen 2-Way-Binding immer undefined.
   */
  readonly stateOverride = signal<LuxControlStateOverride | undefined>(undefined);

  /**
   * Meldet an, dass eine Legacy-Brücke den stateOverride schreibt.
   *
   * Verhindert, dass sich zwei Brücken gegenseitig überschreiben: Bindet jemand
   * <lux-input formControlName="x">, übernimmt die ControlValueAccessor-Direktive den Zustand, und
   * das synthetische FormControl der LuxLegacyFormBridge darf ihn nicht mehr überstimmen.
   */
  readonly stateOverrideClaimed = signal(false);

  /**
   * Fehlerlage, die eine Komponente rein intern (unabhängig vom Formular-Modus) ermittelt - z.B.
   * luxMinTime/luxMaxTime bei LuxTimepickerComponent. Solche Grenzen kennt weder ein Signal-Forms-
   * Schema noch eine Legacy-Brücke (stateOverride bleibt im Signal-Forms-/Freistehend-Betrieb bewusst
   * undefined, siehe LuxLegacyFormBridge.engaged) - ohne diesen zusätzlichen, IMMER wirksamen Kanal
   * bliebe die Prüfung in genau diesen beiden Betriebsarten unsichtbar. Mit Wertgleichheit, damit ein
   * bei jedem updateValueAndValidity() frisch erzeugtes, aber inhaltlich unverändertes Fehlerobjekt
   * nicht unnötig errorMessage()/errorDismissed() invalidiert (siehe mergeErrors()/errorsEqual() unten).
   */
  protected readonly internalErrors = signal<LuxValidationErrors | null>(null, { equal: errorsEqual });

  /** Ob das Control gerade den Fokus hat. Steuert u.a. luxHintShowOnlyOnFocus. */
  readonly focused = signal(false);

  protected readonly elementRef = inject(ElementRef);
  protected readonly logger = inject(LuxConsoleService);
  protected readonly tService = inject(TranslocoService);

  /** Blur- bzw. eingabegetriebener Zustand für den Betrieb ohne Formular. */
  private readonly touchedInternal = signal(false);
  private readonly dirtyInternal = signal(false);
  private readonly generatedUid = 'lux-form-control-' + uuidv4();
  private a11yNameChecked = false;

  readonly uid = computed(() => this.luxId() || this.generatedUid);

  // Auflösungsreihenfolge: Was eine Legacy-Brücke meldet, gewinnt (dort ist das AbstractControl die
  // Wahrheit). Sonst gilt der Vertrags-Input ODER der gleichbedeutende LUX-Alias.
  readonly isDisabled = computed(() => this.stateOverride()?.disabled ?? (this.disabled() || this.luxDisabled()));
  readonly isReadonly = computed(() => this.stateOverride()?.readonly ?? (this.readonly() || this.luxReadonly()));
  readonly isRequired = computed(() => this.stateOverride()?.required ?? (this.required() || this.luxRequired()));
  readonly isInvalid = computed(() => (this.stateOverride()?.invalid ?? this.invalid()) || !!this.internalErrors());
  readonly isTouched = computed(() => this.stateOverride()?.touched ?? (this.touched() || this.touchedInternal()));
  readonly isDirty = computed(() => this.stateOverride()?.dirty ?? (this.dirty() || this.dirtyInternal()));

  /**
   * Die Fehler aus Signal Forms. Im Legacy-Betrieb leer - dort ist legacyErrors() die Quelle,
   * und klassische Reactive-Forms-Fehler tragen ohnehin keine schema-seitige message.
   */
  readonly resolvedErrors = computed<readonly ValidationError.WithOptionalFieldTree[]>(() => (this.stateOverride() ? [] : this.errors()));

  /**
   * Die Fehler in der klassischen ValidationErrors-Form - die gemeinsame Grundlage für
   * luxErrorCallback, errorMessageModifier und die Standard-Fehlertexte, damit deren Signaturen
   * über beide Betriebsarten hinweg unverändert bleiben.
   */
  readonly legacyErrors = computed<LuxValidationErrors | null>(() => {
    const override = this.stateOverride();
    const base = override ? (override.legacyErrors ?? null) : LuxUtil.toLegacyValidationErrors(this.errors());
    return mergeErrors(base, this.internalErrors());
  });

  /**
   * Wird true, wenn der Nutzer die Fehlermeldung über den Schließen-Button ausblendet, und fällt
   * automatisch auf false zurück, sobald sich die Fehlerlage ändert.
   */
  readonly errorDismissed = linkedSignal<LuxValidationErrors | null, boolean>({
    source: () => this.legacyErrors(),
    computation: () => false
  });

  readonly errorMessage = computed<string | undefined>(() => {
    if (this.errorDismissed()) {
      return undefined;
    }

    const errors = this.legacyErrors();
    if (!errors) {
      return undefined;
    }

    const value = this.controlValue();

    const custom = this.luxErrorMessage();
    if (custom) {
      return custom;
    }

    const fromCallback = this.luxErrorCallback()(value, errors);
    if (fromCallback) {
      return fromCallback;
    }

    // Der im Schema hinterlegte Text, z.B. required(path.name, { message: 'Bitte ausfüllen' }).
    // Er ist bewusst spezifischer als der generische Transloco-Default, aber schwächer als die
    // beiden LUX-Übersteuerungen darüber.
    const fromSchema = this.resolvedErrors().find((error) => !!error.message)?.message;
    if (fromSchema) {
      return fromSchema;
    }

    const fromModifier = this.errorMessageModifier(value, errors);
    if (fromModifier) {
      return fromModifier;
    }

    return LuxUtil.getErrorMessageForErrors(this.tService, errors) || undefined;
  });

  /**
   * Ob die Fehlermeldung dargestellt werden soll. Unberührte und readonly-Felder zeigen keinen
   * Fehler an - dieselbe Regel wie vor der Signal-Forms-Umstellung.
   */
  readonly showError = computed(() => !!this.errorMessage() && this.isTouched() && !this.isReadonly());

  readonly wrapperState = computed<LuxFormControlWrapperState>(() => ({
    disabled: this.isDisabled(),
    readonly: this.isReadonly(),
    required: this.isRequired(),
    showError: this.showError()
  }));

  /**
   * Der Wert für "aria-describedby": Fehlermeldung vor Hint. undefined bedeutet, dass das Attribut
   * entfernt wird.
   */
  readonly describedBy = computed(() => {
    if (this.showError()) {
      return this.uid() + '-error';
    }

    const hasHint = !!this.formHintComponent() || !!this.luxHint();
    if (!hasHint || this.luxNoBottomLabel() || this.luxNoLabels()) {
      return undefined;
    }

    // Ein nur bei Fokus sichtbarer Hint darf auch nur dann referenziert werden.
    return !this.luxHintShowOnlyOnFocus() || this.focused() ? this.uid() + '-hint' : undefined;
  });

  /**
   * Der aktuelle Wert des Controls. Wird von den beiden Vertrags-Basisklassen auf value bzw.
   * checked gelegt.
   *
   * Hinweis: Das Feld wird erst vom Subklassen-Initializer belegt, also NACH den Feldern dieser
   * Klasse. Es darf deshalb nur aus computed()s / Methoden gelesen werden, nie aus einem
   * Field-Initializer dieser Klasse heraus.
   */
  abstract readonly controlValue: Signal<T>;

  /**
   * Schreibt den Wert in das Vertrags-Model (value bzw. checked). Wird von den Legacy-Brücken
   * genutzt, die die konkrete Ausprägung der Komponente nicht kennen.
   */
  abstract writeControlValue(value: T): void;

  constructor() {
    // afterNextRender statt eines Lifecycle-Hooks: Die Prüfung braucht die aufgelöste
    // contentChild-Query und die fertig geschriebenen Inputs, läuft genau einmal und nur im
    // Browser. So bleibt diese Klasse frei von Lifecycle-Hooks.
    afterNextRender(() => this.checkA11yName());
  }

  /**
   * Liefert den Wert für "aria-labelledby" gemäß der Namenskaskade:
   * luxAriaLabelledby vor luxAriaLabel vor luxLabel (uid + '-label').
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

  /**
   * Teil des FormUiControl-Vertrags: Signal Forms fokussiert das Control hierüber, z.B. beim
   * Absenden eines ungültigen Formulars. Ohne diese Methode würde Angular das Host-Element
   * fokussieren, das bei einem Wrapper nicht fokussierbar ist.
   */
  focus(options?: FocusOptions) {
    this.focusTarget()?.focus(options);
  }

  /** Teil des FormUiControl-Vertrags: Zurücksetzen des reinen UI-Zustands. */
  reset() {
    this.touchedInternal.set(false);
    this.dirtyInternal.set(false);
    this.errorDismissed.set(false);
  }

  /** Blendet die aktuell sichtbare Fehlermeldung aus (Schließen-Button im Wrapper). */
  dismissError() {
    this.errorDismissed.set(true);
  }

  /**
   * Markiert das Control als berührt - im Formular über den touch-Output, ohne Formular über den
   * internen Zustand.
   */
  markAsTouched() {
    this.touchedInternal.set(true);
    this.touch.emit();
  }

  /**
   * Markiert das Control als vom Nutzer verändert. Von den Komponenten aus ihren
   * Eingabe-Handlern aufzurufen - NICHT beim programmatischen Setzen eines Werts.
   *
   * Im Signal Form leitet Angular dirty selbst aus der Wertänderung ab; der Aufruf ist dort
   * folgenlos. Im Formular-Betrieb spiegeln die Legacy-Brücken ihn in das AbstractControl
   * zurück - das erledigte früher Angulars Value-Accessor am nativen Input.
   */
  markAsDirty() {
    this.dirtyInternal.set(true);
  }

  /** Von den Templates an das native Eingabeelement zu binden. */
  onBlur() {
    this.markAsTouched();
  }

  /**
   * Method-Stub für ableitende Komponenten, um komponentenspezifische Fehlermeldungen zu ergänzen.
   * Die Signatur ist bewusst unverändert geblieben, damit bestehende Overrides weiter greifen.
   */
  protected errorMessageModifier(value: unknown, errors: LuxValidationErrors): string | undefined {
    return undefined;
  }

  /** Das Element, das fokussiert wird. Ableitende Komponenten können es gezielter bestimmen. */
  protected focusTarget(): HTMLElement | undefined {
    const host = this.elementRef.nativeElement as HTMLElement;
    return host.querySelector<HTMLElement>('input, textarea, select, [tabindex]:not([tabindex="-1"])') ?? undefined;
  }

  /**
   * Prüft, ob das Control einen zugänglichen Namen besitzt bzw. ob ein abweichendes luxAriaLabel
   * ein sichtbares Label überschreibt (WCAG 2.5.3). Nur im Debug-Modus sichtbar und nur einmal
   * pro Komponenteninstanz.
   */
  private checkA11yName() {
    if (this.a11yNameChecked) {
      return;
    }
    this.a11yNameChecked = true;

    const hasVisibleLabel = !!this.formLabelComponent() || !!this.luxLabel();
    const controlName = this.name() || 'ohne Namen';

    if (!hasVisibleLabel && !this.luxAriaLabel() && !this.luxAriaLabelledby()) {
      this.logger.warn(
        `A11y: Das Formularelement (${controlName}) besitzt keinen zugänglichen Namen. ` +
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
        `A11y: Das Formularelement (${controlName}) besitzt ein sichtbares Label und ein davon ` +
          `abweichendes luxAriaLabel. Das aria-label überschreibt das sichtbare Label (WCAG 2.5.3 "Label in Name").`
      );
    }
  }
}

/**
 * Führt die schema-/legacy-seitigen Fehler mit internalErrors() zusammen - bewusst referenzstabil, wenn
 * eine Quelle leer ist (liefert dann die ANDERE Quelle unverändert zurück statt eines frischen
 * Spread-Objekts), aus demselben Grund wie die gleichnamige Problematik bei
 * LuxLegacyFormBridge.mergeLegacyErrors(): Ein bei jedem Aufruf neu gespreadetes, aber inhaltlich
 * unverändertes Objekt würde errorMessage()/errorDismissed() unnötig neu auswerten.
 */
function mergeErrors(base: LuxValidationErrors | null, internal: LuxValidationErrors | null): LuxValidationErrors | null {
  if (!internal) {
    return base;
  }
  if (!base) {
    return internal;
  }
  return { ...base, ...internal };
}

/**
 * Wertgleichheit statt Referenzgleichheit für internalErrors() - siehe die gleichnamige Funktion in
 * LuxLegacyFormBridge für die ausführliche Begründung (dort ist derselbe Mechanismus für
 * stateOverride().legacyErrors nötig).
 */
function errorsEqual(a: LuxValidationErrors | null, b: LuxValidationErrors | null): boolean {
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
