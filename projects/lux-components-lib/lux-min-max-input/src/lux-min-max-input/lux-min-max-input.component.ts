import { ChangeDetectionStrategy, Component, computed, effect, inject, input, model, signal, untracked } from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import {
  AbstractControl,
  ControlValueAccessor,
  FormControl,
  FormGroup,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
  ValidationErrors,
  Validator,
  ValidatorFn
} from '@angular/forms';
import {
  LuxDatepickerAcComponent,
  LuxErrorCallbackFnType,
  LuxIconComponent,
  LuxInputAcComponent,
  LuxInputAcSuffixComponent
} from '@ihk-gfi/lux-components';
import { translateSignal, TranslocoPipe, TranslocoService } from '@jsverse/transloco';
import { isEmpty, rangeErrors, toComparable } from './lux-min-max-input-range-validation';
import { LuxMinMaxBounds, LuxMinMaxType, LuxMinMaxValue } from './lux-min-max-input-types';

type Side = 'min' | 'max';
type Limits = LuxMinMaxBounds<number | string>;

/** Aktuelle Meldung: Übersetzungs-Key, betroffene Seite und Rohwerte; formatiert wird erst bei der Anzeige. */
interface Message {
  key: string;
  side: Side;
  values: { min?: unknown; max?: unknown };
}

const SIDES: readonly Side[] = ['min', 'max'];
const RANGE_KEYS = ['range', 'belowMin', 'aboveMax', 'outOfBounds'] as const;
const BOUND_KEYS: Record<(typeof RANGE_KEYS)[number], string> = {
  range: 'range',
  belowMin: 'below_min',
  aboveMax: 'above_max',
  outOfBounds: 'out_of_bounds'
};

const sameRange = (a: LuxMinMaxValue<number | string>, b: LuxMinMaxValue<number | string>): boolean => a.min === b.min && a.max === b.max;

/**
 * Bereichseingabe "Von / Bis" mit wählbarem Feldtyp: Zahlenfeld (lux-input-ac) oder Datepicker (lux-datepicker-ac).
 *
 * Die Komponente kümmert sich nur um die Bereichslogik: leer heißt unbegrenzt, Von nicht größer als Bis, Grenzen gesamt
 * oder je Seite, eine gemeinsame Meldung unter beiden Feldern, Prüfung erst beim Verlassen eines Feldes. Formatierung und
 * Eingabefilterung übernehmen die Felder. Der Wert steht als Two-Way-Model `luxValue` und als ControlValueAccessor
 * (Reactive Forms, ngModel) zur Verfügung. Als Validator meldet sie dem FormControl den Fehler `luxMinMaxInput`,
 * solange ein Feld einen Bereichs-, Grenz- oder Datumsfehler hat.
 *
 * Der Typparameter T ist der Werttyp der Felder (number bei luxType="number", string bei luxType="date") und wird aus der
 * Bindung abgeleitet, damit enger typisierte Signale der Anwendung mit [(luxValue)] funktionieren.
 */
@Component({
  selector: 'lux-min-max-input',
  imports: [LuxInputAcComponent, LuxInputAcSuffixComponent, LuxDatepickerAcComponent, LuxIconComponent, TranslocoPipe],
  templateUrl: './lux-min-max-input.component.html',
  styleUrl: './lux-min-max-input.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'lux-min-max-input'
  },
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: LuxMinMaxInputComponent,
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: LuxMinMaxInputComponent,
      multi: true
    }
  ]
})
export class LuxMinMaxInputComponent<T extends number | string = number | string> implements ControlValueAccessor, Validator {
  private static nextUniqueId = 0;

  /** Feldtyp beider Seiten: Zahlenfeld oder Datepicker. */
  readonly luxType = input<LuxMinMaxType>('number');
  /** Aktueller Bereich; ein leeres Feld fehlt im Objekt. Ändert sich nur bei gültigem Bereich. Zahl als number, Datum als ISO-String. */
  readonly luxValue = model<LuxMinMaxValue<T>>({});
  /** Sichtbare Gruppenlegende; ohne Angabe nur für Screenreader ("Wertebereich"). */
  readonly luxLabel = input<string>('');
  /** Label des Von-Felds, Standard aus der Übersetzung ("Von"). */
  readonly luxMinLabel = input<string>('');
  /** Label des Bis-Felds, Standard aus der Übersetzung ("Bis"). */
  readonly luxMaxLabel = input<string>('');
  /** Einheit als Suffix beider Zahlenfelder, z.B. "kg"; bei luxType="date" ohne Wirkung. */
  readonly luxUnit = input<string>('');
  /** Zulässiger Bereich für beide Felder; Werte außerhalb erzeugen eine Meldung, die den Bereich nennt. */
  readonly luxBounds = input<LuxMinMaxBounds<T>>({});
  /** Zusätzliche Grenzen des Von-Felds; je Seite gewinnt die engere Grenze (Schnittmenge mit luxBounds). */
  readonly luxMinFieldBounds = input<LuxMinMaxBounds<T> | undefined>(undefined);
  /** Zusätzliche Grenzen des Bis-Felds; je Seite gewinnt die engere Grenze (Schnittmenge mit luxBounds). */
  readonly luxMaxFieldBounds = input<LuxMinMaxBounds<T> | undefined>(undefined);
  /** Schrittweite des Zahlenfelds für Pfeiltasten und Spinner; bei luxType="date" ohne Wirkung. */
  readonly luxStep = input<number>(1);
  /** Deaktiviert beide Felder. Model, damit setDisabledState() des ControlValueAccessors den Zustand zurückschreiben kann. */
  readonly luxDisabled = model<boolean>(false);
  /** Präfix für die Tag-Ids der Felder (Suffixe "-min" und "-max"). */
  readonly luxTagId = input<string | undefined>(undefined);
  /** Präfix für die DOM-Ids; ohne Angabe eine eigene Id je Instanz. Die Meldung bekommt die Id "<luxId>-message". */
  readonly luxId = input<string | undefined>(undefined);

  protected readonly sides = SIDES;
  protected readonly uid = computed(() => this.luxId() || `lux-min-max-input-${this.uniqueId}`);
  protected readonly messageId = computed(() => this.uid() + '-message');
  protected readonly message = signal<Message | null>(null);

  // Zuletzt verlassenes Feld und sein Vergleichswert in dem Moment; Bereichsfehler gibt es nur für dieses Feld.
  private checked: { side: Side; comparable: number | undefined | null } | null = null;
  protected readonly form = new FormGroup({
    min: new FormControl<unknown>(null, { validators: [this.sideValidator('min')] }),
    max: new FormControl<unknown>(null, { validators: [this.sideValidator('max')] })
  });

  private readonly uniqueId = LuxMinMaxInputComponent.nextUniqueId++;
  private readonly translocoService = inject(TranslocoService);
  private readonly lang = toSignal(this.translocoService.langChanges$, { initialValue: this.translocoService.getActiveLang() });
  private readonly defaultMinLabel = translateSignal<string>('luxc.min-max-input.min_label');
  private readonly defaultMaxLabel = translateSignal<string>('luxc.min-max-input.max_label');

  protected readonly labels = computed<Record<Side, string>>(() => ({
    min: this.luxMinLabel() || this.defaultMinLabel(),
    max: this.luxMaxLabel() || this.defaultMaxLabel()
  }));

  private readonly effectiveBounds = computed<Record<Side, Limits>>(() => {
    const shared = this.luxBounds();
    const intersect = (own: Limits | undefined): Limits => ({
      min: this.tighter(shared.min, own?.min, 'lower'),
      max: this.tighter(shared.max, own?.max, 'upper')
    });
    return { min: intersect(this.luxMinFieldBounds()), max: intersect(this.luxMaxFieldBounds()) };
  });

  // Grenzen je Feld, zusätzlich eingeengt durch den gültigen Wert des Nachbarfelds.
  private readonly neighbourLimits = computed<Record<Side, Limits>>(() => {
    const bounds = this.effectiveBounds();
    const { min, max } = this.luxValue();
    return {
      min: { min: bounds.min.min, max: this.tighter(bounds.min.max, max, 'upper') },
      max: { min: this.tighter(bounds.max.min, min, 'lower'), max: bounds.max.max }
    };
  });

  // Für den Datepicker als ISO-String; null hebt eine Kalendersperre wieder auf.
  protected readonly dateLimits = computed(() => this.limitsFor('date', (bound) => (typeof bound === 'string' ? bound : null)));

  // Für das Zahlenfeld als min/max-Attribut; undefined entfernt das Attribut.
  protected readonly numberLimits = computed(() => this.limitsFor('number', (bound) => (typeof bound === 'number' ? bound : undefined)));

  // Parameter der Meldung, formatiert mit der aktuellen Sprache; ein Sprachwechsel stellt Text und Werte zusammen um.
  protected readonly messageParams = computed((): Record<string, string> => {
    const current = this.message();
    if (!current) {
      return {};
    }
    const labels = this.labels();
    return {
      label: labels[current.side],
      minLabel: labels.min,
      maxLabel: labels.max,
      min: this.formatValue(current.values.min),
      max: this.formatValue(current.values.max)
    };
  });

  private readonly messageText = computed(() => {
    const current = this.message();
    return current ? this.translocoService.translate(`luxc.min-max-input.errors.${current.key}`, this.messageParams()) : '';
  });

  private previousType: LuxMinMaxType | undefined;
  private previousValue: LuxMinMaxValue<T> | undefined;
  private lastEmitted: LuxMinMaxValue<T> | undefined;
  private onChange: (value: LuxMinMaxValue<T>) => void = () => {};
  private onTouched: () => void = () => {};
  private onValidatorChange: () => void = () => {};
  private lastValidationKey = 'null';

  constructor() {
    effect(() => {
      const type = this.luxType();
      const value = this.luxValue();
      untracked(() => this.sync(type, value));
    });

    effect(() => {
      this.effectiveBounds();
      // Neue Grenzen können einen zurückgehaltenen Wert gültig machen oder eine Seite ungültig werden lassen.
      untracked(() => {
        this.revalidate();
        this.emitIfValid();
      });
    });

    effect(() => {
      const disabled = this.luxDisabled();
      untracked(() => (disabled ? this.form.disable() : this.form.enable()));
    });

    for (const side of SIDES) {
      this.form.controls[side].valueChanges.pipe(takeUntilDestroyed()).subscribe(() => this.refreshMessage(side));
    }
    this.form.valueChanges.pipe(takeUntilDestroyed()).subscribe(() => this.emitIfValid());
  }

  // LUX markiert ein Feld nur rot, wenn es einen Fehlertext hat; luxNoBottomLabel hält diesen Text unsichtbar.
  protected readonly fieldErrorText: LuxErrorCallbackFnType = (_value, errors) =>
    RANGE_KEYS.some((key) => errors[key]) ? this.messageText() : undefined;

  protected tagIdFor(side: Side): string | undefined {
    const tagId = this.luxTagId();
    return tagId ? `${tagId}-${side}` : undefined;
  }

  protected onBlur(side: Side): void {
    const control = this.form.controls[side];
    const otherSide = this.other(side);
    const otherControl = this.form.controls[otherSide];
    const previous = this.checked;
    const current = { side, comparable: toComparable(control.value, this.luxType()) };
    this.checked = current;
    control.updateValueAndValidity({ emitEvent: false });
    control.markAsTouched();
    this.onTouched();
    if (!control.errors && previous?.side === otherSide && this.message()) {
      // Ein fehlerfreies Feld zu verlassen, lässt die Meldung des anderen Feldes stehen, solange dessen Fehler gilt.
      this.checked = previous;
      otherControl.updateValueAndValidity({ emitEvent: false });
      if (otherControl.errors) {
        this.message.set(this.messageFor(otherSide, otherControl.errors));
        return;
      }
      this.checked = current;
    }
    otherControl.updateValueAndValidity({ emitEvent: false });
    this.message.set(this.messageFor(side, control.errors));
  }

  // ControlValueAccessor

  writeValue(value: LuxMinMaxValue<T> | null): void {
    this.luxValue.set(value ?? {});
  }

  registerOnChange(fn: (value: LuxMinMaxValue<T>) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.luxDisabled.set(isDisabled);
  }

  // Validator

  /** Fehler je Seite, solange ein Feld einen Bereichs-, Grenz- oder Datumsfehler hat; unabhängig von der Anzeige. */
  validate(): ValidationErrors | null {
    const errors: Partial<Record<Side, ValidationErrors>> = {};
    for (const side of SIDES) {
      const sideErrors = this.fieldErrors(side);
      if (sideErrors) {
        errors[side] = sideErrors;
      }
    }
    return Object.keys(errors).length > 0 ? { luxMinMaxInput: errors } : null;
  }

  registerOnValidatorChange(fn: () => void): void {
    this.onValidatorChange = fn;
  }

  // Beim Tippen kann eine Meldung nur verschwinden oder sich ändern; neue entstehen beim Verlassen.
  private refreshMessage(changed: Side): void {
    const checked = this.checked;
    if (!checked) {
      return;
    }
    const control = this.form.controls[checked.side];
    if (control.disabled) {
      // disable() räumt die Validatorfehler ab; die Meldung bleibt stehen und wird nach enable() neu bewertet.
      return;
    }
    if (changed === checked.side && toComparable(control.value, this.luxType()) !== checked.comparable) {
      // Eine Änderung im geprüften Feld hebt die Prüfung bis zum nächsten Verlassen auf.
      this.checked = null;
      control.updateValueAndValidity({ emitEvent: false });
      this.message.set(null);
      return;
    }
    if (!this.message()) {
      return;
    }
    control.updateValueAndValidity({ emitEvent: false });
    this.message.set(this.messageFor(checked.side, control.errors));
  }

  private messageFor(side: Side, errors: ValidationErrors | null): Message | null {
    if (!errors) {
      return null;
    }
    const { min, max } = this.form.controls;
    if (errors['matDatepickerParse']) {
      return { key: 'invalid_date', side, values: {} };
    }
    if (errors['range']) {
      return { key: side === 'min' ? 'range_min' : 'range_max', side, values: { min: min.value, max: max.value } };
    }
    const key = (['outOfBounds', 'belowMin', 'aboveMax'] as const).find((candidate) => errors[candidate]);
    if (key) {
      const bounds = this.effectiveBounds()[side];
      return { key: BOUND_KEYS[key], side, values: { min: bounds.min, max: bounds.max } };
    }
    // Kalendersperre aus dem Nachbarwert; kann veraltet sein, solange der Nachbar ungültig ist.
    const limits = this.dateLimits()[side];
    if (errors['matDatepickerMin']) {
      return { key: 'below_min', side, values: { min: limits.min } };
    }
    if (errors['matDatepickerMax']) {
      return { key: 'above_max', side, values: { max: limits.max } };
    }
    return null;
  }

  private formatValue(raw: unknown): string {
    if (raw === undefined || raw === null || raw === '') {
      return '';
    }
    const lang = this.lang();
    if (this.luxType() === 'date') {
      // LUX speichert Kalendertage als UTC-Mitternacht.
      return new Intl.DateTimeFormat(lang, { dateStyle: 'short', timeZone: 'UTC' }).format(new Date(raw as string | number));
    }
    // Ohne Rundung, sonst nennt die Meldung einen anderen Grenzwert als den geprüften.
    return new Intl.NumberFormat(lang, { maximumFractionDigits: 20 }).format(Number(raw));
  }

  private sideValidator(side: Side): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const own = toComparable(control.value, this.luxType());
      if (this.checked?.side !== side || own === null) {
        return null;
      }
      return this.rangeErrorsOf(side, own, control.parent?.get(this.other(side))?.value);
    };
  }

  private rangeErrorsOf(side: Side, own: number | undefined, otherRaw: unknown): ValidationErrors | null {
    return rangeErrors(side, own, toComparable(otherRaw, this.luxType()) ?? undefined, this.comparableBounds(side));
  }

  private comparableBounds(side: Side): { min?: number; max?: number } {
    const type = this.luxType();
    const { min, max } = this.effectiveBounds()[side];
    return { min: toComparable(min, type) ?? undefined, max: toComparable(max, type) ?? undefined };
  }

  private tighter(a: number | string | undefined, b: number | string | undefined, kind: 'lower' | 'upper'): number | string | undefined {
    const type = this.luxType();
    const first = toComparable(a, type);
    const second = toComparable(b, type);
    if (second === undefined || second === null) {
      return a;
    }
    if (first === undefined || first === null) {
      return b;
    }
    return (kind === 'upper' ? first <= second : first >= second) ? a : b;
  }

  private other(side: Side): Side {
    return side === 'min' ? 'max' : 'min';
  }

  // Grenzen je Feld für den angegebenen Feldtyp; bei anderem Typ überall der Leerwert von pick().
  private limitsFor<E>(type: LuxMinMaxType, pick: (bound: number | string | undefined) => E): Record<Side, { min: E; max: E }> {
    const limits = this.luxType() === type ? this.neighbourLimits() : { min: {}, max: {} };
    return {
      min: { min: pick(limits.min.min), max: pick(limits.min.max) },
      max: { min: pick(limits.max.min), max: pick(limits.max.max) }
    };
  }

  private revalidate(): void {
    this.form.controls.min.updateValueAndValidity({ emitEvent: false });
    this.form.controls.max.updateValueAndValidity({ emitEvent: false });
    const checked = this.checked;
    this.message.set(checked ? this.messageFor(checked.side, this.form.controls[checked.side].errors) : null);
    this.notifyValidatorChange();
  }

  // Lässt das FormControl die Validatoren neu auswerten, wenn sich der Fehlerzustand geändert hat.
  private notifyValidatorChange(): void {
    const key = JSON.stringify(this.validate());
    if (key !== this.lastValidationKey) {
      this.lastValidationKey = key;
      this.onValidatorChange();
    }
  }

  private resetChecked(): void {
    this.checked = null;
    this.message.set(null);
  }

  private sync(type: LuxMinMaxType, value: LuxMinMaxValue<T>): void {
    const typeChanged = this.previousType !== undefined && this.previousType !== type;
    const valueChanged = value !== this.previousValue;
    this.previousType = type;
    this.previousValue = value;
    if (typeChanged) {
      this.resetChecked();
      this.form.reset({ min: null, max: null }, { emitEvent: false });
      if (!valueChanged && (value.min !== undefined || value.max !== undefined)) {
        // Nur der Typ hat gewechselt: alte Werte passen nicht zum neuen Feldtyp.
        const cleared: LuxMinMaxValue<T> = {};
        this.previousValue = cleared;
        this.lastEmitted = cleared;
        this.luxValue.set(cleared);
        this.onChange(cleared);
        return;
      }
    }
    this.writeControls(value);
  }

  private writeControls(value: LuxMinMaxValue<number | string>): void {
    // Der erste Lauf nach einer eigenen Emission ist ihr Echo, eventuell vom Elternteil geklont.
    const isEcho = this.lastEmitted !== undefined && sameRange(value, this.lastEmitted);
    this.lastEmitted = undefined;
    if (isEcho) {
      return;
    }
    this.resetChecked();
    for (const side of SIDES) {
      const control = this.form.controls[side];
      const next = value[side] ?? null;
      if ((control.value ?? null) !== next && !(isEmpty(control.value) && next === null)) {
        control.setValue(next, { emitEvent: false });
      }
    }
    this.revalidate();
  }

  // Unabhängig von der Anzeige: die Validatoren der Controls sind absichtlich unvollständig.
  private emitIfValid(): void {
    this.notifyValidatorChange();
    if (this.form.disabled) {
      return;
    }
    const next = this.acceptedRange();
    if (!next) {
      return;
    }
    const current = this.luxValue();
    if (current.min === next.min && current.max === next.max) {
      return;
    }
    this.lastEmitted = next;
    this.luxValue.set(next);
    this.onChange(next);
  }

  /**
   * Der zu emittierende Bereich: nur Seiten, die in sich gültig sind (lesbar und innerhalb der Grenzen); eine Seite
   * mit Grenzfehler fehlt. Widersprechen sich beide gültigen Seiten (Von größer Bis), gibt es keinen neuen Bereich (null)
   * und der letzte gültige bleibt stehen.
   */
  private acceptedRange(): LuxMinMaxValue<T> | null {
    const accepted = {} as LuxMinMaxValue<T>;
    const comparable: Partial<Record<Side, number>> = {};
    for (const side of SIDES) {
      const control = this.form.controls[side];
      const own = toComparable(control.value, this.luxType());
      if (own === undefined || own === null || control.errors?.['matDatepickerParse']) {
        continue;
      }
      if (rangeErrors(side, own, undefined, this.comparableBounds(side))) {
        continue;
      }
      accepted[side] = control.value as T;
      comparable[side] = own;
    }
    if (comparable.min !== undefined && comparable.max !== undefined && comparable.min > comparable.max) {
      return null;
    }
    return accepted;
  }

  // Fehler eines Feldes für den Validator: unlesbarer Wert, Bereichs- oder Grenzfehler.
  private fieldErrors(side: Side): ValidationErrors | null {
    const control = this.form.controls[side];
    if (control.errors?.['matDatepickerParse']) {
      return { matDatepickerParse: true };
    }
    const own = toComparable(control.value, this.luxType());
    if (own === null) {
      return { invalidValue: true };
    }
    return this.rangeErrorsOf(side, own, this.form.controls[this.other(side)].value);
  }
}
