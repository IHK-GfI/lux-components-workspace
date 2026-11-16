import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  OnDestroy,
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
import {
  MatDatepicker,
  MatDatepickerInput,
  MatDatepickerInputEvent,
  MatDatepickerToggle,
  MatDatepickerToggleIcon
} from '@angular/material/datepicker';
import { MatInput } from '@angular/material/input';
import { LuxAriaDescribedbyDirective } from '../../lux-directives/lux-aria/lux-aria-describedby.directive';
import { LuxAriaLabelDirective } from '../../lux-directives/lux-aria/lux-aria-label.directive';
import { LuxAriaLabelledbyDirective } from '../../lux-directives/lux-aria/lux-aria-labelledby.directive';
import { LuxTagIdDirective } from '../../lux-directives/lux-tag-id/lux-tag-id.directive';
import { LuxIconComponent } from '../../lux-icon/lux-icon/lux-icon.component';
import { LuxThemeService } from '../../lux-theme/lux-theme.service';
import {
  LuxLocalDate,
  compareLocalDate,
  formatLocalDate,
  formatLocalDateTime,
  parseLocalDate,
  parseLocalDateTime,
  parseLocalTime
} from '../../lux-util/lux-local-date';
import { LuxMediaQueryObserverService } from '../../lux-util/lux-media-query-observer.service';
import { LuxFormControlWrapperComponent } from '../lux-form-control-wrapper/lux-form-control-wrapper.component';
import { LuxValidationErrors } from '../lux-form-model/lux-form-component-base.class';
import { provideLuxFormControl } from '../lux-form-model/lux-form-control-base.class';
import { LuxFormLegacyValueBase } from '../lux-form-model/lux-form-legacy/lux-form-legacy-value-base.class';
import { LuxReferenceControl } from '../lux-form-model/lux-reference-control.interface';
import { LuxMatInputErrorDirective } from '../lux-form-model/lux-mat-input-error.directive';
import { LuxCalendarDate, LuxDatepickerAdapter } from './lux-datepicker-adapter';
import { LuxDatepickerCustomHeaderComponent } from './lux-datepicker-custom-header/lux-datepicker-custom-header.component';

export const APP_DATE_FORMATS_AC = {
  parse: {
    dateInput: { month: '2-digit', year: 'numeric', day: '2-digit' }
  },
  display: {
    dateInput: { month: '2-digit', year: 'numeric', day: '2-digit' },
    monthYearLabel: { year: 'numeric', month: 'long' },
    dateA11yLabel: { year: 'numeric', month: 'long', day: 'numeric' },
    monthYearA11yLabel: { year: 'numeric', month: 'long' }
  }
};

/**
 * Filter für auswählbare Tage. Der Tag kommt als "yyyy-MM-dd", den Wochentag liefert LuxUtil.getDayOfWeek().
 */
export declare type LuxDateFilterFn = (date: string) => boolean;
export declare type LuxStartView = 'month' | 'year' | 'multi-year';

const defaultDateFilterFn: LuxDateFilterFn = () => true;

/**
 * Datepicker für einen Kalendertag ohne Zeitzone. Der Wert ist immer "yyyy-MM-dd" (z.B. "2029-05-26").
 * Beim Einlesen wird zusätzlich Mitternacht ohne Zeitzone angenommen ("2029-05-26T00:00:00"), alle anderen
 * Formate werden mit einem Validierungsfehler abgelehnt (siehe Update-Guide v22).
 *
 * Mit luxReferenceControl teilt sich der Datepicker mit einem lux-timepicker einen Wert "yyyy-MM-ddTHH:mm".
 * Er ändert dann nur das Datum, beim ersten Datum gilt die Standarduhrzeit des Timepickers (luxDefaultTime).
 */
@Component({
  selector: 'lux-datepicker, lux-datepicker-ac',
  templateUrl: './lux-datepicker.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    { provide: DateAdapter, useClass: LuxDatepickerAdapter },
    { provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS_AC },
    provideLuxFormControl(() => LuxDatepickerComponent)
  ],
  imports: [
    LuxIconComponent,
    LuxFormControlWrapperComponent,
    MatInput,
    LuxMatInputErrorDirective,
    MatDatepickerInput,
    MatDatepickerToggle,
    MatDatepickerToggleIcon,
    MatDatepicker,
    LuxAriaDescribedbyDirective,
    LuxAriaLabelDirective,
    LuxAriaLabelledbyDirective,
    LuxTagIdDirective
  ]
})
export class LuxDatepickerComponent<T = any> extends LuxFormLegacyValueBase<T> implements LuxReferenceControl, AfterViewInit, OnDestroy {
  readonly luxStartView = input<LuxStartView>('month');
  readonly luxTouchUi = input(false);
  readonly luxOpened = input(false);
  readonly luxStartDate = input<string | null>(null);
  readonly luxShowToggle = input(true);
  readonly luxMaxDate = input<string | null>(null);
  readonly luxMinDate = input<string | null>(null);
  readonly luxReferenceControl = input<LuxReferenceControl | undefined>(undefined);

  // Der Standard-Wert für Autocomplete wird für den Datepicker ausgeschaltet.
  override readonly luxAutocomplete = input('off');

  readonly luxCustomFilter = input<LuxDateFilterFn, LuxDateFilterFn | undefined>(defaultDateFilterFn, {
    transform: (customFilterFn) => customFilterFn ?? defaultDateFilterFn
  });

  readonly matDatepicker = viewChild(MatDatepicker);
  readonly datepickerInput = viewChild<ElementRef>('datepickerInput');
  readonly datepickerInputDirective = viewChild('datepickerInput', { read: MatDatepickerInput });

  readonly smallScreen = signal(false);

  readonly luxLocale = signal<string>('de-DE');

  get dateInputValue() {
    return this.datepickerInput()?.nativeElement.value;
  }

  set dateInputValue(newValue: string) {
    const datepickerInput = this.datepickerInput();

    if (datepickerInput) {
      datepickerInput.nativeElement.value = newValue;
    }
  }

  /**
   * Ob eine Nutzereingabe Ereignisse am FormControl auslöst. An einem realen FormControl gehören valueChanges und
   * statusChanges der Anwendung, das synthetische FormControl wird still mitgeführt.
   */
  get shouldEmitDirectly() {
    return this.inForm;
  }

  private dateAdapter = inject<DateAdapter<LuxCalendarDate>>(DateAdapter);
  private mediaObserver = inject(LuxMediaQueryObserverService);
  private themeService = inject(LuxThemeService);

  private previousValue?: unknown;
  private lastRejectedValue?: unknown;
  private valueChangesRunning = false;
  private viewInitialized = false;
  private triggerOpenCloseTimeout?: ReturnType<typeof setTimeout>;
  private notifyFormValueChangedTimeout?: ReturnType<typeof setTimeout>;

  /**
   * Ob der Text im Eingabefeld kein gültiges Datum ist (z.B. "31.02.2029" oder "26.05.29"). Material meldet
   * eine solche Eingabe nicht immer über (dateInput), z.B. wenn vorher kein Wert gesetzt war.
   */
  private inputTextInvalid = false;

  /**
   * Meldet eine ungültige Texteingabe im Signal-Forms-Betrieb als Parse-Fehler an das Feld, damit es ungültig
   * wird. Der Wert selbst wird hierüber nicht geschrieben.
   */
  private readonly inputText = transformedValue<T, string>(this.value, {
    parse: () => (this.inputTextInvalid ? { error: { kind: 'matDatepickerParse' } } : {}),
    format: () => ''
  });

  readonly min = computed(() => this.toCalendarDate(this.luxMinDate(), 'luxMinDate'));
  readonly max = computed(() => this.toCalendarDate(this.luxMaxDate(), 'luxMaxDate'));
  readonly start = computed(() => this.toCalendarDate(this.luxStartDate(), 'luxStartDate'));

  /**
   * luxCustomFilter für Material: Material übergibt einen LuxCalendarDate, der Filter erwartet "yyyy-MM-dd".
   */
  readonly dateFilter = computed(() => {
    const filter = this.luxCustomFilter();
    return (date: LuxCalendarDate | null) => !date || filter(formatLocalDate(date));
  });

  /** Ob sich der Datepicker mit einem Timepicker einen Wert "yyyy-MM-ddTHH:mm" teilt. */
  readonly sharedValue = computed(() => !!this.luxReferenceControl());

  /**
   * Auf kleinen Bildschirmen wird die TouchUI unabhängig von luxTouchUi aktiviert.
   */
  readonly touchUi = computed(() => this.luxTouchUi() || this.smallScreen());

  constructor() {
    super();

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
      // MatDatepickerInput formatiert die Anzeige daraufhin selbst neu (localeChanges).
      this.dateAdapter.setLocale(this.luxLocale());
      // Ein abgelehnter Wert wird roh angezeigt und muss danach wiederhergestellt werden.
      this.displayValue();
    });

    this.mediaObserver
      .getMediaQueryChangedAsObservable()
      .pipe(takeUntilDestroyed())
      .subscribe(() => this.smallScreen.set(this.mediaObserver.isXS() || this.mediaObserver.isSM()));

    effect(() => {
      this.luxOpened();

      // Eventuell gibt es ohne das Timeout sonst Fehler, weil der matDatepicker noch nicht gesetzt ist
      untracked(() => (this.triggerOpenCloseTimeout = setTimeout(() => this.triggerOpenClose())));
    });

    // Die Datumsprüfung neu auswerten, wenn sich min/max/Filter ändern - nicht nur wenn sich der Wert selbst
    // ändert. Ein ungültig getippter Text bleibt dabei mit seinem Fehler stehen (siehe revalidate()).
    effect(() => {
      this.min();
      this.max();
      this.luxCustomFilter();

      untracked(() => this.revalidateAndNotify());
    });

    // LuxLegacyFormBridge.updateValidators() ersetzt bei jeder luxControlValidators-/luxRequired-Änderung
    // außerhalb eines Formulars die komplette Validator-Liste - und damit auch validateDate. Danach wird neu
    // geprüft, sonst fehlten die Fehler von validateDate bis zur nächsten Änderung.
    effect(() => {
      this.luxControlValidators();
      this.luxRequired();

      untracked(() => this.revalidateAndNotify());
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
    // Anzeige und Prüfung für einen bereits vorhandenen Wert nachholen: Beim ersten Durchlauf in ngOnInit()
    // existierte das Input-Element noch nicht (viewChild löst datepickerInputDirective() erst ab hier auf).
    this.displayValue();
    this.viewInitialized = true;
  }

  ngOnDestroy() {
    clearTimeout(this.notifyFormValueChangedTimeout);
    clearTimeout(this.triggerOpenCloseTimeout);

    // In Reactive Forms überlebt das FormControl die Komponente. Ohne das Entfernen würde es weiter mit dem Stand
    // dieser Instanz geprüft (ungültiger Text, min/max/Filter) und bliebe evtl. dauerhaft ungültig.
    if (this.formControl?.hasValidator(this.validateDate)) {
      this.formControl.removeValidators(this.validateDate);
      this.formControl.updateValueAndValidity({ emitEvent: false });
    }
  }

  /**
   * Erzeugt für die Unter- bzw. Überschreitung
   * @param value
   * @param errors
   */
  override errorMessageModifier(value: any, errors: LuxValidationErrors): string | undefined {
    if (errors['matDatepickerMin']) {
      return this.tService.translate('luxc.datepicker.error_message.min');
    } else if (errors['matDatepickerMax']) {
      return this.tService.translate('luxc.datepicker.error_message.max');
    } else if (errors['matDatepickerParse'] || errors['matDatepickerFilter']) {
      return this.tService.translate('luxc.datepicker.error_message.invalid');
    } else if (errors['required']) {
      if (this.datepickerInput()?.nativeElement.value) {
        return this.tService.translate('luxc.datepicker.error_message.invalid');
      } else {
        return this.tService.translate('luxc.datepicker.error_message.empty');
      }
    }

    return undefined;
  }

  /** Beim gemeinsamen Wert zeigt der Timepicker seine Fehler selbst an. */
  protected override isForeignError(kind: string): boolean {
    return this.sharedValue() && kind.startsWith('matTimepicker');
  }

  /** Bei einer ungültigen Eingabe ist der Wert null, ein required-Text aus dem Schema passt dann nicht. */
  protected override hasPriorityError(errors: LuxValidationErrors): boolean {
    return !!errors['matDatepickerParse'];
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
    this.onBlur();
    this.focused.set(false);
    this.luxFocusOut.emit(e);
  }

  /**
   * Jede Texteingabe, auch eine, die Material nicht als (dateInput) meldet.
   */
  onTextInput() {
    this.updateInputTextInvalid();
    this.revalidateAndNotify();
    this.inputText.set(this.dateInputValue ?? '');
  }

  /**
   * Eine Änderung durch den Nutzer (Texteingabe oder Auswahl im Kalender).
   */
  onDateChange(event: MatDatepickerInputEvent<LuxCalendarDate>) {
    this.markAsDirty();
    // Material meldet (dateInput) vor onTextInput(). Die Prüfung im setValue() braucht den aktuellen Stand.
    this.updateInputTextInvalid();

    const date = event.value;
    if (!this.sharedValue()) {
      this.processValueChange(() => this.setDateValue(date ? formatLocalDate(date) : null));
    } else if (date) {
      // Beim gemeinsamen Wert bleibt die Uhrzeit erhalten, beim ersten Datum gilt die Standarduhrzeit
      const time = parseLocalDateTime(this.formControl.value)?.time ?? this.defaultTime();
      this.processValueChange(() => this.setDateValue(formatLocalDateTime({ date, time })));
    } else if ((this.dateInputValue ?? '').trim() === '') {
      // Datum geleert: Der gemeinsame Wert wird null, beide Felder sind leer
      this.processValueChange(() => this.setDateValue(null));
    } else {
      // Ungültige oder unvollständige Eingabe: Der gemeinsame Wert bleibt unverändert
      this.revalidateAndNotify();
    }

    this.inputText.set(this.dateInputValue ?? '');
  }

  // für dem Customheader für das "Green"-Theme
  getHeaderByTheme(): any {
    const customHeader = LuxDatepickerCustomHeaderComponent;
    return this.themeService.getTheme().name === 'green' ? customHeader : null;
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
    this.revalidate();
  }

  /**
   * Gemeinsamer Einstiegspunkt für onDateChange() (Nutzereingabe) und emitValueChange() (jede externe
   * Änderung) - beide teilen sich denselben valueChangesRunning-Reentrancy-Guard, damit ein von
   * setDateValue() selbst ausgelöster Wert nicht rekursiv erneut verarbeitet wird.
   */
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
   * @param newValue "yyyy-MM-dd", beim gemeinsamen Wert "yyyy-MM-ddTHH:mm", oder null.
   */
  private setDateValue(newValue: string | null) {
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
      // Signal-Schreibzugriff - markiert diese OnPush-Komponente automatisch als zu prüfen, auch
      // wenn formControl.events wegen shouldEmitDirectly=false nicht feuert.
      this.value.set(newValue as T);
    }

    this.displayValue();

    if (controlChanged) {
      this.notifyIfValid(newValue);
    } else {
      // z.B. nach einer ungültigen Eingabe wieder derselbe Tag: setValue() hat dann keine Ereignisse ausgelöst
      this.notifyStatusChange(status);
    }
  }

  /**
   * luxValueChange wird nur ausgelöst, wenn der Wert leer oder ein gültiges Datum innerhalb von min/max ist.
   */
  private notifyIfValid(value: unknown) {
    if (value != null && value !== '') {
      const date = this.dateOf(value);
      const min = this.min();
      const max = this.max();

      if (!date || (min && compareLocalDate(date, min) < 0) || (max && compareLocalDate(date, max) > 0)) {
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
   * Prüft Wert und Texteingabe (Format, min/max, luxCustomFilter). Ersetzt MatDatepickerInput.validate(), das
   * nur seinen eigenen Wert kennt und den Filter mit einem LuxCalendarDate statt "yyyy-MM-dd" aufrufen würde.
   */
  private validateDate = (control: AbstractControl): LuxValidationErrors | null => {
    if (this.inputTextInvalid) {
      return { matDatepickerParse: { text: this.dateInputValue } };
    }

    const value = control.value;
    if (value == null || value === '') {
      return null;
    }

    const date = this.dateOf(value);
    if (!date) {
      return { matDatepickerParse: { text: String(value) } };
    }

    const min = this.min();
    if (min && compareLocalDate(date, min) < 0) {
      return { matDatepickerMin: { min: formatLocalDate(min), actual: formatLocalDate(date) } };
    }

    const max = this.max();
    if (max && compareLocalDate(date, max) > 0) {
      return { matDatepickerMax: { max: formatLocalDate(max), actual: formatLocalDate(date) } };
    }

    if (!this.luxCustomFilter()(formatLocalDate(date))) {
      return { matDatepickerFilter: true };
    }

    return null;
  };

  private registerDateValidator() {
    if (this.formControl && !this.formControl.hasValidator(this.validateDate)) {
      this.formControl.addValidators(this.validateDate);
    }
  }

  /**
   * Zeigt den aktuellen Wert an und prüft ihn. Für jeden neuen Wert, ob von außen gesetzt oder vom Nutzer
   * übernommen: Wie bei ControlValueAccessor.writeValue() ersetzt er einen ungültig getippten Text.
   *
   * Die Anzeige wird NUR geschrieben, während das Feld NICHT fokussiert ist: Sonst würde jede Wertänderung
   * die gerade laufende Eingabe des Nutzers mit dem formatierten Wert überschreiben (z.B. sprang "1.09.2026"
   * sofort zu "01.09.2026"). MatDatepickerInput hält die Anzeige während der Eingabe selbst aktuell.
   */
  private displayValue() {
    if (!this.focused()) {
      this.writeValueToInput();
    }

    this.revalidate();
  }

  private writeValueToInput() {
    const inputDirective = this.datepickerInputDirective();
    if (!inputDirective || !this.formControl) {
      return;
    }

    const value = this.formControl.value;
    const date = this.toDisplayDate(value);
    inputDirective.writeValue(date);
    this.inputTextInvalid = false;

    if (!date) {
      // MatDatepickerInput.writeValue() formatiert nur bei einem anderen Wert neu. Bei null bliebe ein
      // abgelehnter Wert oder ungültig getippter Text sonst stehen.
      this.dateInputValue = '';
    } else if (!this.dateAdapter.isValid(date)) {
      // Einen abgelehnten Wert roh anzeigen, damit sichtbar ist, was nicht stimmt
      this.dateInputValue = typeof value === 'string' ? value : String(value);
    }
  }

  private updateInputTextInvalid() {
    const date = this.dateAdapter.parse(this.dateInputValue ?? '', APP_DATE_FORMATS_AC.parse.dateInput);
    this.inputTextInvalid = !!date && !this.dateAdapter.isValid(date);
  }

  /**
   * Wie revalidate(), meldet einen geänderten Status aber an der Reactive Form. Nicht für Schreibzugriffe von außen:
   * Deren setValue() löst die Ereignisse selbst aus.
   */
  private revalidateAndNotify() {
    const status = this.formControl?.status;
    this.revalidate();
    this.notifyStatusChange(status);
  }

  /**
   * Meldet einen still (emitEvent: false) geänderten Status an der Reactive Form, damit z.B. form.statusChanges
   * aktuell bleibt. Wie bei MatDatepickerInput erhält die Anwendung dabei auch ein valueChanges mit unverändertem
   * Wert. Die Brücke gibt das nicht als Wertänderung weiter (siehe LuxLegacyFormBridge.forwardValueChange()).
   * Beim ersten Rendern bleibt es still, wie bei einem [formControl].
   */
  private notifyStatusChange(previousStatus: string | undefined) {
    if (this.viewInitialized && this.inForm && previousStatus !== this.formControl.status) {
      this.formControl.updateValueAndValidity();
    }
  }

  /**
   * Prüft Wert und Texteingabe neu, ohne den Wert neu anzuzeigen. Für Texteingaben und geänderte Regeln
   * (min/max/Filter, Validatoren): Ein ungültig getippter Text bleibt wie bei MatDatepickerInput mit seinem
   * Fehler stehen, bis der Nutzer ihn korrigiert oder ein neuer Wert gesetzt wird.
   */
  private revalidate() {
    if (!this.datepickerInputDirective() || !this.formControl) {
      return;
    }

    this.registerDateValidator();

    // Bewusst OHNE Event-Emission: updateValueAndValidity() feuert value-/statusChanges/events IMMER
    // neu, auch wenn sich weder Wert noch Status geändert haben (siehe notifyStatusChange()). Die Anzeige von touched/dirty/invalid/errorMessage bleibt aktuell, weil
    // LuxLegacyFormBridge.check() ohnehin bei jedem ngDoCheck() syncState() aufruft.
    this.formControl.updateValueAndValidity({ emitEvent: false });

    // Im Signal-Forms- und Freistehend-Betrieb bleibt stateOverride bewusst undefined (die Legacy-Brücke ist
    // dort nicht "engaged", siehe LuxLegacyFormBridge.engaged) - ohne diese zusätzliche Meldung an
    // internalErrors() käme die Datumsprüfung in genau diesen beiden Betriebsarten nie in
    // isInvalid()/errorMessage() an.
    this.internalErrors.set(this.formControl.errors as LuxValidationErrors | null);
  }

  /**
   * Liest luxMinDate, luxMaxDate bzw. luxStartDate ("yyyy-MM-dd").
   */
  private toCalendarDate(value: string | null, inputName: string): LuxCalendarDate | null {
    if (value == null || value === '') {
      return null;
    }

    const date = parseLocalDate(value);
    if (!date) {
      if (isDevMode()) {
        console.warn(`lux-datepicker: ${inputName} erwartet 'yyyy-MM-dd', erhalten '${value}' (siehe Update-Guide v22).`);
      }
      return null;
    }

    return LuxCalendarDate.of(date);
  }

  /**
   * Gibt im Dev-Modus eine Warnung für einen abgelehnten Wert aus, je Wert nur einmal.
   */
  private warnIfRejected(value: unknown) {
    if (value == null || value === '' || this.dateOf(value) || value === this.lastRejectedValue) {
      return;
    }

    this.lastRejectedValue = value;
    if (isDevMode()) {
      const expected = this.sharedValue() ? 'yyyy-MM-ddTHH:mm' : 'yyyy-MM-dd';
      const conversion = this.sharedValue() ? 'LuxUtil.fromV21DateTime()' : 'LuxUtil.fromV21Date()';
      console.warn(
        `lux-datepicker: Erwartet '${expected}', erhalten ${describeValue(value)}. ` +
          `Für Werte im Format von Version 21 gibt es ${conversion} (siehe Update-Guide v22).`
      );
    }
  }

  /**
   * Der Tag eines Werts: "yyyy-MM-dd" bzw. beim gemeinsamen Wert der Tag aus "yyyy-MM-ddTHH:mm".
   */
  private dateOf(value: unknown): LuxLocalDate | null {
    return this.sharedValue() ? (parseLocalDateTime(value)?.date ?? null) : parseLocalDate(value);
  }

  private toDisplayDate(value: unknown): LuxCalendarDate | null {
    if (value == null || value === '') {
      return null;
    }

    const date = this.dateOf(value);
    return date ? LuxCalendarDate.of(date) : this.dateAdapter.invalid();
  }

  /**
   * Die Standarduhrzeit des verknüpften Timepickers (luxDefaultTime), sonst 00:00.
   */
  private defaultTime() {
    return parseLocalTime(this.luxReferenceControl()?.luxDefaultTime?.()) ?? { hour: 0, minute: 0 };
  }

  /**
   * Führt .open() bzw. .close() vom MatDatepicker aus, abhängig vom Wert für luxOpened.
   */
  private triggerOpenClose() {
    if (this.luxOpened()) {
      this.matDatepicker()?.open();
    } else {
      this.matDatepicker()?.close();
    }
  }
}

function describeValue(value: unknown): string {
  if (value instanceof Date) {
    return `ein Date-Objekt (${isNaN(value.getTime()) ? 'Invalid Date' : value.toISOString()})`;
  }

  return typeof value === 'string' ? `'${value}'` : String(value);
}
