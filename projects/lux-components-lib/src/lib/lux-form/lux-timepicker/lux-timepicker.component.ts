import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Injector,
  OnDestroy,
  afterNextRender,
  computed,
  effect,
  inject,
  input,
  isDevMode,
  signal,
  untracked,
  viewChild
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AbstractControl } from '@angular/forms';
import { transformedValue } from '@angular/forms/signals';
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { MatInput } from '@angular/material/input';
import { MatTimepicker, MatTimepickerInput, MatTimepickerToggle } from '@angular/material/timepicker';
import { TranslocoPipe } from '@jsverse/transloco';
import { LuxAriaDescribedbyDirective } from '../../lux-directives/lux-aria/lux-aria-describedby.directive';
import { LuxAriaLabelDirective } from '../../lux-directives/lux-aria/lux-aria-label.directive';
import { LuxAriaLabelledbyDirective } from '../../lux-directives/lux-aria/lux-aria-labelledby.directive';
import { LuxTagIdDirective } from '../../lux-directives/lux-tag-id/lux-tag-id.directive';
import { LuxIconComponent } from '../../lux-icon/lux-icon/lux-icon.component';
import { LuxLocalTime, formatLocalDateTime, formatLocalTime, parseLocalDateTime, parseLocalTime } from '../../lux-util/lux-local-date';
import { LuxFormControlWrapperComponent } from '../lux-form-control-wrapper/lux-form-control-wrapper.component';
import { LuxValidationErrors } from '../lux-form-model/lux-form-component-base.class';
import { provideLuxFormControl } from '../lux-form-model/lux-form-control-base.class';
import { LuxFormLegacyValueBase } from '../lux-form-model/lux-form-legacy/lux-form-legacy-value-base.class';
import { LuxReferenceControl } from '../lux-form-model/lux-reference-control.interface';
import { LuxMatInputErrorDirective } from '../lux-form-model/lux-mat-input-error.directive';
import { LuxClockTime, LuxTimepickerAdapter } from './lux-timepicker-adapter';

export const APP_TIME_FORMATS = {
  parse: {
    timeInput: { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false }
  },
  display: {
    timeInput: { hour: '2-digit', minute: '2-digit', hour12: false },
    timeOptionLabel: { hour: '2-digit', minute: '2-digit', hour12: false },
    timeA11yLabel: { hour: 'numeric', minute: 'numeric', hour12: false }
  }
};

// Wie MatTimepicker: eine Zahl (Sekunden) oder z.B. "30m", "1.5h", "90s"
const INTERVAL_REGEXP = /^(\d*\.?\d+)\s*(h|hour|hours|m|min|minute|minutes|s|second|seconds)?$/i;

/**
 * Timepicker für eine Uhrzeit ohne Zeitzone. Der Wert ist immer "HH:mm" (z.B. "14:30"), beim Einlesen werden
 * Sekunden ":00" toleriert. Alle anderen Formate werden mit einem Validierungsfehler abgelehnt (siehe
 * Update-Guide v22).
 *
 * Mit luxReferenceControl teilt sich der Timepicker mit einem lux-datepicker einen Wert "yyyy-MM-ddTHH:mm".
 * Er ändert dann nur die Uhrzeit und ist deaktiviert, solange kein Datum gewählt ist.
 */
@Component({
  selector: 'lux-timepicker',
  templateUrl: './lux-timepicker.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    { provide: DateAdapter, useClass: LuxTimepickerAdapter },
    { provide: MAT_DATE_FORMATS, useValue: APP_TIME_FORMATS },
    provideLuxFormControl(() => LuxTimepickerComponent)
  ],
  imports: [
    LuxIconComponent,
    LuxFormControlWrapperComponent,
    MatInput,
    LuxMatInputErrorDirective,
    MatTimepicker,
    MatTimepickerInput,
    MatTimepickerToggle,
    LuxAriaDescribedbyDirective,
    LuxAriaLabelDirective,
    LuxAriaLabelledbyDirective,
    LuxTagIdDirective,
    TranslocoPipe
  ]
})
export class LuxTimepickerComponent<T = any> extends LuxFormLegacyValueBase<T> implements LuxReferenceControl, AfterViewInit, OnDestroy {
  readonly luxOpened = input(false);
  readonly luxShowToggle = input(true);
  readonly luxInterval = input<string | number | null>('30m');
  readonly luxMinTime = input<string | null>(null);
  readonly luxMaxTime = input<string | null>(null);
  readonly luxReferenceControl = input<LuxReferenceControl | undefined>(undefined);
  /** Die Uhrzeit ("HH:mm"), die beim gemeinsamen Wert mit einem Datepicker gesetzt wird, solange keine gewählt ist. */
  readonly luxDefaultTime = input('00:00');

  // Der Standard-Wert für Autocomplete wird für den Timepicker ausgeschaltet.
  override readonly luxAutocomplete = input('off');

  readonly matTimepicker = viewChild(MatTimepicker);
  readonly timepickerInput = viewChild<ElementRef>('timepickerInput');
  readonly timepickerInputDirective = viewChild('timepickerInput', { read: MatTimepickerInput });

  readonly luxLocale = signal<string>('de-DE');

  get timeInputValue() {
    return this.timepickerInput()?.nativeElement.value;
  }

  set timeInputValue(newValue: string) {
    const timepickerInput = this.timepickerInput();

    if (timepickerInput) {
      timepickerInput.nativeElement.value = newValue;
    }
  }

  /**
   * Ob eine Nutzereingabe Ereignisse am FormControl auslöst (siehe LuxDatepickerComponent.shouldEmitDirectly).
   */
  get shouldEmitDirectly() {
    return this.inForm;
  }

  private dateAdapter = inject<DateAdapter<LuxClockTime>>(DateAdapter);
  private injector = inject(Injector);
  private previousValue?: unknown;
  private lastRejectedValue?: unknown;
  private valueChangesRunning = false;
  private viewInitialized = false;
  private triggerOpenCloseTimeout?: ReturnType<typeof setTimeout>;
  private notifyFormValueChangedTimeout?: ReturnType<typeof setTimeout>;

  /**
   * Verhindert die Rückkopplung inputDirective.writeValue() -> (valueChange) -> onTimeInputValueChange().
   * MatTimepickerInput.value ist ein ModelSignal - anders als bei MatDatepickerInput/writeValue() gibt
   * es dort keine getrennte "nur Anzeige, kein Event"-Variante: Jedes .set() (auch unser eigenes
   * writeValue() in displayValue()) löst (valueChange) genauso aus wie eine echte Nutzereingabe.
   */
  private applyingToInput = false;

  /** Ob der Text im Eingabefeld keine gültige Uhrzeit ist (z.B. "24:00"). */
  private inputTextInvalid = false;

  /** Der ungültige Text beim Verlassen des Feldes, siehe rawText(). */
  private invalidInputText: string | null = null;

  /**
   * Meldet eine ungültige Texteingabe im Signal-Forms-Betrieb als Parse-Fehler an das Feld, damit es ungültig
   * wird. Der Wert selbst wird hierüber nicht geschrieben.
   */
  private readonly inputText = transformedValue<T, string>(this.value, {
    parse: () => (this.inputTextInvalid ? { error: { kind: 'matTimepickerParse' } } : {}),
    format: () => ''
  });

  readonly min = computed(() => this.toClockTime(this.luxMinTime(), 'luxMinTime'));
  readonly max = computed(() => this.toClockTime(this.luxMaxTime(), 'luxMaxTime'));
  readonly interval = computed(() => this.toMinuteInterval(this.luxInterval()));

  /** Ob sich der Timepicker mit einem Datepicker einen Wert "yyyy-MM-ddTHH:mm" teilt. */
  readonly sharedValue = computed(() => !!this.luxReferenceControl());

  /**
   * Beim gemeinsamen Wert ist der Timepicker deaktiviert, solange kein Datum gewählt ist. Das gilt nur für die
   * Oberfläche: Das FormControl bzw. Feld ist geteilt, ein disable() würde auch den Datepicker deaktivieren.
   */
  readonly dateMissing = computed(() => this.sharedValue() && !parseLocalDateTime(this.value()));

  constructor() {
    super();

    effect(() => {
      this.luxOpened();

      untracked(() => (this.triggerOpenCloseTimeout = setTimeout(() => this.triggerOpenClose())));
    });

    this.tService.langChanges$.pipe(takeUntilDestroyed()).subscribe((lang) => {
      switch (lang) {
        case 'de':
          this.luxLocale.set('de-DE');
          break;
        case 'en':
          this.luxLocale.set('en-US');
          break;
        case 'fr':
          this.luxLocale.set('fr-FR');
          break;
        default:
          this.luxLocale.set(lang);
      }

      // MatTimepickerInput formatiert die Anzeige daraufhin selbst neu (localeChanges).
      this.dateAdapter.setLocale(this.luxLocale());
      // Ein abgelehnter Wert wird roh angezeigt und muss danach wiederhergestellt werden.
      this.displayValue();
    });

    // Die Prüfung neu auswerten, wenn sich min/max ändern - nicht nur wenn sich der Wert selbst ändert. Ein
    // ungültig getippter Text bleibt dabei mit seinem Fehler stehen (siehe revalidate()).
    effect(() => {
      this.min();
      this.max();

      untracked(() => this.revalidateAndNotify());
    });

    // LuxLegacyFormBridge.updateValidators() ersetzt bei jeder luxControlValidators-/luxRequired-Änderung
    // außerhalb eines Formulars die komplette Validator-Liste - und damit auch validateTime. Danach wird neu
    // geprüft, sonst fehlten die Fehler von validateTime bis zur nächsten Änderung.
    effect(() => {
      this.luxControlValidators();
      this.luxRequired();

      untracked(() => this.revalidateAndNotify());
    });

    effect(() => {
      const defaultTime = this.luxDefaultTime();
      const min = this.min();
      const max = this.max();

      untracked(() => this.checkDefaultTime(defaultTime, min, max));
    });
  }

  override ngOnInit() {
    super.ngOnInit();

    // Ein bereits vorhandener Wert (z.B. aus einer Reactive Form) wird nicht umgeschrieben. Er löst auch
    // kein luxValueChange aus, nur die Prüfung (siehe Update-Guide v22).
    this.previousValue = this.formControl.value;
    this.warnIfRejected(this.formControl.value);
  }

  ngAfterViewInit() {
    // Anzeige und Prüfung für einen bereits vorhandenen Wert nachholen, siehe LuxDatepickerComponent.ngAfterViewInit().
    this.displayValue();
    this.viewInitialized = true;
  }

  ngOnDestroy() {
    clearTimeout(this.notifyFormValueChangedTimeout);
    clearTimeout(this.triggerOpenCloseTimeout);

    // In Reactive Forms überlebt das FormControl die Komponente. Ohne das Entfernen würde es weiter mit dem Stand
    // dieser Instanz geprüft (ungültiger Text, min/max) und bliebe evtl. dauerhaft ungültig.
    if (this.formControl?.hasValidator(this.validateTime)) {
      this.formControl.removeValidators(this.validateTime);
      this.formControl.updateValueAndValidity({ emitEvent: false });
    }
  }

  override errorMessageModifier(value: any, errors: LuxValidationErrors): string | undefined {
    if (errors['matTimepickerMin']) {
      return this.tService.translate('luxc.timepicker.error_message.min');
    } else if (errors['matTimepickerMax']) {
      return this.tService.translate('luxc.timepicker.error_message.max');
    } else if (errors['matTimepickerParse']) {
      return this.tService.translate('luxc.timepicker.error_message.invalid');
    } else if (errors['required']) {
      if (this.timeInputValue) {
        return this.tService.translate('luxc.timepicker.error_message.invalid');
      } else {
        return this.tService.translate('luxc.timepicker.error_message.empty');
      }
    }

    return undefined;
  }

  /** Beim gemeinsamen Wert zeigt der Datepicker seine Fehler selbst an. */
  protected override isForeignError(kind: string): boolean {
    return this.sharedValue() && kind.startsWith('matDatepicker');
  }

  /** Bei einer ungültigen Eingabe ist der Wert null, ein required-Text aus dem Schema passt dann nicht. */
  protected override hasPriorityError(errors: LuxValidationErrors): boolean {
    return !!errors['matTimepickerParse'];
  }

  onFocus(e: FocusEvent) {
    this.focused.set(true);
    this.luxFocus.emit(e);
  }

  onFocusIn(e: FocusEvent) {
    this.focused.set(true);
    this.luxFocusIn.emit(e);
  }

  onFocusOut(e: FocusEvent) {
    this.invalidInputText = this.inputTextInvalid ? (this.timeInputValue ?? '') : null;
    this.applyDefaultTimeIfCleared();
    // Ersetzt die früher von [formControl] übernommene automatische Touched-Markierung beim Blur.
    this.onBlur();
    this.focused.set(false);
    this.luxFocusOut.emit(e);
  }

  /**
   * Eine Änderung durch den Nutzer (Texteingabe oder Auswahl in der Liste). MatTimepickerInput hat (anders als
   * MatDatepickerInput) keine (dateInput)/(dateChange)-Outputs, sondern legt den Wert ausschließlich in seinem
   * eigenen value-Model ab.
   * @param time die Uhrzeit, null bei einer leeren Eingabe oder ein ungültiger Wert (siehe LuxTimepickerAdapter).
   */
  onTimeInputValueChange(time: LuxClockTime | null) {
    if (this.applyingToInput) {
      return;
    }

    this.markAsDirty();
    this.inputTextInvalid = !!time && !this.dateAdapter.isValid(time);

    if (this.sharedValue()) {
      // Beim gemeinsamen Wert ändert sich nur die Uhrzeit. Bei einer ungültigen Eingabe bleibt der Wert
      // unverändert, eine geleerte Uhrzeit wird erst beim Verlassen des Feldes ersetzt (siehe onFocusOut()).
      const dateTime = parseLocalDateTime(this.formControl.value);
      if (dateTime && time && !this.inputTextInvalid) {
        this.processValueChange(() => this.setTimeValue(formatLocalDateTime({ date: dateTime.date, time })));
      } else {
        this.revalidateAndNotify();
      }
    } else {
      this.processValueChange(() => this.setTimeValue(time && !this.inputTextInvalid ? formatLocalTime(time) : null));
    }

    this.inputText.set(this.timeInputValue ?? '');
  }

  /**
   * Jede Wertänderung von außen (über [(value)]/[formField] oder ein reales FormControl) läuft hier zusammen.
   * Der Wert wird nicht umgeschrieben, nur angezeigt und geprüft.
   */
  override emitValueChange(formValue: any) {
    this.processValueChange(() => this.applyExternalValue(formValue));
  }

  /**
   * Die eigentliche luxValueChange-Emission, entkoppelt von emitValueChange() (das hier bereits als
   * "irgendein Wert hat sich geändert"-Hook der Brücke belegt ist, siehe oben). Wird ausschließlich
   * verzögert aufgerufen, wenn der neue Wert gültig ist und innerhalb von min/max liegt.
   */
  notifyFormValueChanged(value: T) {
    super.emitValueChange(value);
  }

  /**
   * Jedes Schreiben von außen in das FormControl, auch ohne Wertänderung (z.B. form.reset() bei leerem Wert, siehe
   * LuxLegacyBridgeHost.onFormValueWritten()). Wie bei ControlValueAccessor.writeValue() ersetzt der Wert dann
   * einen ungültig getippten Text. Das gilt auch mit Fokus: Eigene Schreibzugriffe filtert processValueChange()
   * heraus, und setzt die Anwendung nur denselben Wert erneut, bleibt die laufende Eingabe stehen.
   */
  onFormValueWritten(value: unknown) {
    this.processValueChange(() => {
      if (!this.focused() || this.inputTextInvalid || value !== this.previousValue) {
        this.writeValueToInput();
        this.keepRawText();
      }

      this.previousValue = value;
      this.revalidate();
    });
  }

  /**
   * form().reset() im Signal Form, auch ohne Wertänderung. Eine ausdrückliche Anweisung, deshalb wird die Anzeige
   * auch mit Fokus ersetzt.
   */
  override reset() {
    super.reset();
    this.writeValueToInput();
    this.keepRawText();
    this.revalidate();
  }

  private processValueChange(change: () => void) {
    if (this.valueChangesRunning) {
      return;
    }

    this.valueChangesRunning = true;
    try {
      change();
    } finally {
      this.valueChangesRunning = false;
    }
  }

  /**
   * Die Brücke ruft emitValueChange() nur bei einer echten Wertänderung auf, auch nach einem stillen setValue() von
   * außen (siehe LuxLegacyFormBridge.forwardValueChange()). Ein eigener Vergleich würde das verfälschen.
   */
  private applyExternalValue(value: unknown) {
    this.previousValue = value;

    this.warnIfRejected(value);
    this.displayValue();
    this.notifyIfValid(value);
  }

  /**
   * Schreibt eine Änderung des Nutzers in das FormControl bzw. Model und löst luxValueChange aus.
   * @param newValue "HH:mm", beim gemeinsamen Wert "yyyy-MM-ddTHH:mm", oder null.
   */
  private setTimeValue(newValue: string | null) {
    this.previousValue = newValue;

    const status = this.formControl.status;
    const controlChanged = this.formControl.value !== newValue;
    if (controlChanged) {
      this.formControl.setValue(newValue as T, {
        emitEvent: this.shouldEmitDirectly,
        emitModelToViewChange: this.shouldEmitDirectly,
        emitViewToModelChange: this.shouldEmitDirectly
      });
      this.bridge.noteSilentValue(newValue as T);
      this.value.set(newValue as T);
    }

    this.displayValue();

    if (controlChanged) {
      this.notifyIfValid(newValue);
    } else {
      // z.B. nach einer ungültigen Eingabe wieder dieselbe Uhrzeit: setValue() hat dann keine Ereignisse ausgelöst
      this.notifyStatusChange(status);
    }
  }

  /**
   * Beim gemeinsamen Wert wird eine geleerte Uhrzeit beim Verlassen des Feldes durch luxDefaultTime ersetzt,
   * damit der Wert vollständig bleibt.
   */
  private applyDefaultTimeIfCleared() {
    if (!this.sharedValue() || this.isDisabled() || this.isReadonly() || (this.timeInputValue ?? '').trim() !== '') {
      return;
    }

    const dateTime = parseLocalDateTime(this.formControl.value);
    const defaultTime = parseLocalTime(this.luxDefaultTime());
    if (dateTime && defaultTime) {
      this.focused.set(false);
      this.processValueChange(() => this.setTimeValue(formatLocalDateTime({ date: dateTime.date, time: defaultTime })));
      this.displayValue();
    }
  }

  /**
   * luxValueChange wird nur ausgelöst, wenn der Wert leer oder eine gültige Uhrzeit innerhalb von min/max ist.
   */
  private notifyIfValid(value: unknown) {
    if (value != null && value !== '') {
      const time = this.timeOf(value);
      if (!time || !this.isWithinMinMax(time)) {
        return;
      }
    }

    // ExpressionChangedError vermeiden, indem die Änderung in einen Timeout gepackt wird, damit sie nach der
    // aktuellen Änderungsschleife ausgeführt wird.
    this.notifyFormValueChangedTimeout = setTimeout(() => {
      this.notifyFormValueChanged(value as T);
    });
  }

  /**
   * Prüft Wert und Texteingabe (Format, min/max). Ersetzt MatTimepickerInput.validate(): Dessen Validator liest
   * interne Flags, die nur ein effect() asynchron NACH einer Änderung aktualisiert - direkt danach aufgerufen,
   * prüfte er immer den Stand VOR der aktuellen Änderung.
   */
  private validateTime = (control: AbstractControl): LuxValidationErrors | null => {
    if (this.inputTextInvalid) {
      return { matTimepickerParse: { text: this.timeInputValue } };
    }

    const value = control.value;
    if (value == null || value === '') {
      return null;
    }

    const time = this.timeOf(value);
    if (!time) {
      return { matTimepickerParse: { text: String(value) } };
    }

    const min = this.min();
    if (min && toMinutes(time) < toMinutes(min)) {
      return { matTimepickerMin: { min: formatLocalTime(min), actual: formatLocalTime(time) } };
    }

    const max = this.max();
    if (max && toMinutes(time) > toMinutes(max)) {
      return { matTimepickerMax: { max: formatLocalTime(max), actual: formatLocalTime(time) } };
    }

    return null;
  };

  private registerTimeValidator() {
    if (this.formControl && !this.formControl.hasValidator(this.validateTime)) {
      this.formControl.addValidators(this.validateTime);
    }
  }

  /**
   * Zeigt den aktuellen Wert an und prüft ihn (siehe LuxDatepickerComponent.displayValue()). Für jeden neuen Wert,
   * ob von außen gesetzt oder vom Nutzer übernommen: Wie bei ControlValueAccessor.writeValue() ersetzt er einen
   * ungültig getippten Text.
   *
   * Das Model von MatTimepickerInput wird NUR geschrieben, während das Feld NICHT fokussiert ist. Während der
   * Eingabe gibt es den Stand des Textes wieder (z.B. null nach dem Leeren oder eine ungültige Uhrzeit). Auf die
   * gespeicherte Uhrzeit zurückgesetzt, wäre eine erneute Eingabe oder Auswahl genau dieser Uhrzeit für Material
   * keine Änderung, und (valueChange) bliebe aus.
   */
  private displayValue() {
    if (!this.focused()) {
      this.writeValueToInput();
    }

    this.revalidate();
  }

  private writeValueToInput() {
    const inputDirective = this.timepickerInputDirective();
    if (!inputDirective || !this.formControl) {
      return;
    }

    const time = this.toDisplayTime(this.formControl.value);
    this.applyingToInput = true;
    try {
      inputDirective.writeValue(time);
    } finally {
      this.applyingToInput = false;
    }

    this.inputTextInvalid = false;

    // MatTimepickerInput formatiert die Anzeige nur bei einer Änderung seines Models und nur ohne Fokus neu. Ein
    // abgelehnter Wert oder ungültig getippter Text bliebe sonst stehen.
    this.timeInputValue =
      time && this.dateAdapter.isValid(time)
        ? this.dateAdapter.format(time, APP_TIME_FORMATS.display.timeInput as Intl.DateTimeFormatOptions)
        : '';
  }

  /**
   * Wie revalidate(), meldet einen geänderten Status aber an der Reactive Form (siehe
   * LuxDatepickerComponent.revalidateAndNotify()).
   */
  private revalidateAndNotify() {
    const status = this.formControl?.status;
    this.revalidate();
    this.notifyStatusChange(status);
  }

  /**
   * Meldet einen still geänderten Status an der Reactive Form (siehe LuxDatepickerComponent.notifyStatusChange()).
   */
  private notifyStatusChange(previousStatus: string | undefined) {
    if (this.viewInitialized && this.inForm && previousStatus !== this.formControl.status) {
      this.formControl.updateValueAndValidity();
    }
  }

  /**
   * Prüft Wert und Texteingabe neu, ohne den Wert neu anzuzeigen (siehe LuxDatepickerComponent.revalidate()). Für
   * Texteingaben und geänderte Regeln (min/max, Validatoren): Ein ungültig getippter Text bleibt mit seinem Fehler
   * stehen, bis der Nutzer ihn korrigiert oder ein neuer Wert gesetzt wird.
   *
   * BEWUSST OHNE inputDirective.registerOnValidatorChange(): Das verursachte einen Stack-Overflow im Szenario
   * "Datepicker und Timepicker teilen sich ein FormControl über luxReferenceControl" - beide Komponenten
   * validieren dasselbe FormControl, was sich in dieser Konstellation aufschaukelte.
   */
  private revalidate() {
    if (!this.timepickerInputDirective() || !this.formControl) {
      return;
    }

    this.registerTimeValidator();

    if (!this.focused()) {
      this.keepRawText();
    }

    // Bewusst OHNE Event-Emission - siehe LuxDatepickerComponent.revalidate() und notifyStatusChange().
    this.formControl.updateValueAndValidity({ emitEvent: false });

    // Im Signal-Forms- und Freistehend-Betrieb bleibt stateOverride bewusst undefined (die Legacy-Brücke ist
    // dort nicht "engaged", siehe LuxLegacyFormBridge.engaged) - ohne diese zusätzliche Meldung an
    // internalErrors() käme die Prüfung in genau diesen beiden Betriebsarten nie in isInvalid()/errorMessage() an.
    this.internalErrors.set(this.formControl.errors as LuxValidationErrors | null);
  }

  /**
   * Hält einen Text in der Anzeige, den MatTimepickerInput selbst nicht darstellt (siehe rawText()).
   *
   * Anders als MatDatepickerInput formatiert MatTimepickerInput die Anzeige in einem effect() neu, sobald sich
   * sein Model oder min/max ändern, und leert sie dabei. Dieser effect() läuft erst nach dem Aufruf hier, der
   * Text wird deshalb nach dem nächsten Rendern erneut gesetzt, sofern er dann noch gilt.
   */
  private keepRawText() {
    const text = this.rawText();
    if (text === null) {
      return;
    }

    this.timeInputValue = text;

    afterNextRender(
      () => {
        if (!this.focused() && this.rawText() === text) {
          this.timeInputValue = text;
        }
      },
      { injector: this.injector }
    );
  }

  /**
   * Der Text, den MatTimepickerInput selbst nicht darstellt: ein ungültig getippter Text oder ein abgelehnter Wert,
   * roh angezeigt, damit sichtbar ist, was nicht stimmt.
   * @returns den Text oder null, wenn MatTimepickerInput die Anzeige selbst formatiert.
   */
  private rawText(): string | null {
    if (this.inputTextInvalid) {
      return this.invalidInputText;
    }

    const value = this.formControl.value;
    const time = this.toDisplayTime(value);
    return time && !this.dateAdapter.isValid(time) ? (typeof value === 'string' ? value : String(value)) : null;
  }

  /**
   * Die Uhrzeit eines Werts: "HH:mm" bzw. beim gemeinsamen Wert die Uhrzeit aus "yyyy-MM-ddTHH:mm".
   */
  private timeOf(value: unknown): LuxLocalTime | null {
    return this.sharedValue() ? (parseLocalDateTime(value)?.time ?? null) : parseLocalTime(value);
  }

  private toDisplayTime(value: unknown): LuxClockTime | null {
    if (value == null || value === '') {
      return null;
    }

    const time = this.timeOf(value);
    return time ? LuxClockTime.of(time) : this.dateAdapter.invalid();
  }

  private isWithinMinMax(time: LuxLocalTime): boolean {
    const min = this.min();
    const max = this.max();
    return (!min || toMinutes(time) >= toMinutes(min)) && (!max || toMinutes(time) <= toMinutes(max));
  }

  /**
   * Liest luxMinTime bzw. luxMaxTime ("HH:mm").
   */
  private toClockTime(value: string | null, inputName: string): LuxClockTime | null {
    if (value == null || value === '') {
      return null;
    }

    const time = parseLocalTime(value);
    if (!time) {
      if (isDevMode()) {
        console.warn(`lux-timepicker: ${inputName} erwartet 'HH:mm', erhalten '${value}' (siehe Update-Guide v22).`);
      }
      return null;
    }

    return LuxClockTime.of(time);
  }

  /**
   * Der Timepicker speichert keine Sekunden, luxInterval muss deshalb ganze Minuten ergeben.
   * Sonst gilt das Standardintervall von MatTimepicker (30 Minuten).
   * @returns das Intervall in Sekunden, gerundet wegen Gleitkomma-Resten (4.1 * 3600 ergibt 14759.999999999998).
   * Einen Text, der kein Intervall ist, bewertet MatTimepicker selbst.
   */
  private toMinuteInterval(value: string | number | null): string | number | null {
    let seconds: number | null = null;
    if (typeof value === 'number') {
      seconds = value;
    } else if (typeof value === 'string') {
      const match = INTERVAL_REGEXP.exec(value.trim());
      if (match) {
        const amount = parseFloat(match[1]);
        const unit = match[2]?.toLowerCase() ?? 's';
        seconds = unit.startsWith('h') ? amount * 3600 : unit.startsWith('m') ? amount * 60 : amount;
      }
    }

    if (seconds === null) {
      return value;
    }

    seconds = Math.round(seconds * 1000) / 1000;
    if (seconds <= 0 || seconds % 60 !== 0) {
      if (isDevMode()) {
        console.warn(`lux-timepicker: luxInterval muss ganze Minuten ergeben, erhalten '${value}'. Es gilt das Standardintervall.`);
      }
      return null;
    }

    return seconds;
  }

  private checkDefaultTime(defaultTime: string, min: LuxClockTime | null, max: LuxClockTime | null) {
    if (!isDevMode()) {
      return;
    }

    const time = parseLocalTime(defaultTime);
    if (!time) {
      console.warn(`lux-timepicker: luxDefaultTime erwartet 'HH:mm', erhalten '${defaultTime}'.`);
    } else if ((min && toMinutes(time) < toMinutes(min)) || (max && toMinutes(time) > toMinutes(max))) {
      console.warn(
        `lux-timepicker: luxDefaultTime '${defaultTime}' liegt außerhalb von luxMinTime/luxMaxTime. ` +
          'Ein Wert mit dieser Uhrzeit ist ungültig.'
      );
    }
  }

  /**
   * Gibt im Dev-Modus eine Warnung für einen abgelehnten Wert aus, je Wert nur einmal.
   */
  private warnIfRejected(value: unknown) {
    if (value == null || value === '' || this.timeOf(value) || value === this.lastRejectedValue) {
      return;
    }

    this.lastRejectedValue = value;
    if (isDevMode()) {
      const expected = this.sharedValue() ? 'yyyy-MM-ddTHH:mm' : 'HH:mm';
      const conversion = this.sharedValue() ? 'LuxUtil.fromV21DateTime()' : 'LuxUtil.fromV21Time()';
      console.warn(
        `lux-timepicker: Erwartet '${expected}', erhalten ${describeValue(value)}. ` +
          `Für Werte im Format von Version 21 gibt es ${conversion} (siehe Update-Guide v22).`
      );
    }
  }

  private triggerOpenClose() {
    if (this.luxOpened()) {
      this.matTimepicker()?.open();
    } else {
      this.matTimepicker()?.close();
    }
  }
}

function toMinutes(time: LuxLocalTime): number {
  return time.hour * 60 + time.minute;
}

function describeValue(value: unknown): string {
  if (value instanceof Date) {
    return `ein Date-Objekt (${isNaN(value.getTime()) ? 'Invalid Date' : value.toISOString()})`;
  }

  return typeof value === 'string' ? `'${value}'` : String(value);
}
