import { Platform } from '@angular/cdk/platform';
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
  signal,
  untracked,
  viewChild
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AbstractControl } from '@angular/forms';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatInput } from '@angular/material/input';
import { MatTimepicker, MatTimepickerInput, MatTimepickerSelected, MatTimepickerToggle } from '@angular/material/timepicker';
import { LuxAriaDescribedbyDirective } from '../../lux-directives/lux-aria/lux-aria-describedby.directive';
import { LuxAriaLabelDirective } from '../../lux-directives/lux-aria/lux-aria-label.directive';
import { LuxAriaLabelledbyDirective } from '../../lux-directives/lux-aria/lux-aria-labelledby.directive';
import { LuxTagIdDirective } from '../../lux-directives/lux-tag-id/lux-tag-id.directive';
import { LuxIconComponent } from '../../lux-icon/lux-icon/lux-icon.component';
import { LuxUtil } from '../../lux-util/lux-util';
import { LuxFormControlWrapperComponent } from '../lux-form-control-wrapper/lux-form-control-wrapper.component';
import { LuxValidationErrors } from '../lux-form-model/lux-form-component-base.class';
import { provideLuxFormControl } from '../lux-form-model/lux-form-control-base.class';
import { LuxFormLegacyValueBase } from '../lux-form-model/lux-form-legacy/lux-form-legacy-value-base.class';
import { LuxReferenceControl } from '../lux-form-model/lux-reference-control.interface';
import { LuxTimepickerAdapter } from './lux-timepicker-adapter';

const ON_UPDATE_WRONG_MODE_MSG = `Das Timepicker-FormControl sollte auf "updateOn: blur" gesetzt werden,
wenn ein referenziertes Datepicker-FormControl verwendet wird, um unerwartete Verhalten zu vermeiden.
Z.B. new FormControl<...>(..., { updateOn: 'blur' })"`;

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

@Component({
  selector: 'lux-timepicker',
  templateUrl: './lux-timepicker.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    { provide: DateAdapter, useClass: LuxTimepickerAdapter, deps: [MAT_DATE_LOCALE, Platform] },
    { provide: MAT_DATE_FORMATS, useValue: APP_TIME_FORMATS },
    provideLuxFormControl(() => LuxTimepickerComponent)
  ],
  imports: [
    LuxIconComponent,
    LuxFormControlWrapperComponent,
    MatInput,
    MatTimepicker,
    MatTimepickerInput,
    MatTimepickerToggle,
    LuxAriaDescribedbyDirective,
    LuxAriaLabelDirective,
    LuxAriaLabelledbyDirective,
    LuxTagIdDirective
  ]
})
export class LuxTimepickerComponent<T = any> extends LuxFormLegacyValueBase<T> implements AfterViewInit, OnDestroy {
  readonly luxOpened = input(false);
  readonly luxShowToggle = input(true);
  readonly luxInterval = input<string | number | null>('30m');
  readonly luxMinTime = input<string | null>(null);
  readonly luxMaxTime = input<string | null>(null);
  readonly luxReferenceControl = input<LuxReferenceControl | undefined>(undefined);

  // Der Standard-Wert für Autocomplete wird für den Timepicker ausgeschaltet.
  override readonly luxAutocomplete = input('off');

  readonly matTimepicker = viewChild(MatTimepicker);
  readonly timepickerInput = viewChild<ElementRef>('timepickerInput');
  readonly timepickerInputDirective = viewChild('timepickerInput', { read: MatTimepickerInput });

  lastValue: Date | null = null;

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

  get shouldEmitDirectly() {
    return !!this.luxReferenceControl() && this.inForm;
  }

  private dateAdapter = inject<DateAdapter<Date>>(DateAdapter);
  private previousISO?: string;
  private valueChangesRunning = false;
  private triggerOpenCloseTimeout?: ReturnType<typeof setTimeout>;
  private notifyFormValueChangedTimeout?: ReturnType<typeof setTimeout>;
  private timepickerValidatorRegistered = false;
  /**
   * Verhindert die Rückkopplung inputDirective.writeValue() -> (valueChange) -> onTimeInputValueChange().
   * MatTimepickerInput.value ist ein ModelSignal - anders als bei MatDatepickerInput/writeValue() gibt
   * es dort keine getrennte "nur Anzeige, kein Event"-Variante: Jedes .set() (auch unser eigenes
   * writeValue() in syncTimepickerValidation(), das nur die Anzeige synchron halten soll) löst
   * (valueChange) genauso aus wie eine echte Nutzereingabe. Ohne dieses Flag ruft syncTimepickerValidation()
   * über onTimeInputValueChange() wieder setISOValue() auf, das seinerseits wieder syncTimepickerValidation()
   * aufruft - ein synchroner Stack-Overflow.
   */
  private applyingToInput = false;

  readonly min = computed(() => this.parseTime(this.luxMinTime()));
  readonly max = computed(() => this.parseTime(this.luxMaxTime()));

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

      this.dateAdapter.setLocale(this.luxLocale());

      // formControl.value ist ein ISO-String, kein Date - vor dem Formatieren erst deserialisieren
      // (siehe LuxDatepickerComponent für dieselbe Korrektur).
      if (this.formControl && this.timepickerInput()) {
        this.timeInputValue = this.formatTime(this.dateAdapter.deserialize(this.formControl.value));
      }
    });

    // MatTimepickerInput.validate() neu auswerten, wenn sich min/max ändern - nicht nur wenn sich
    // der Wert selbst ändert (siehe syncTimepickerValidation()).
    effect(() => {
      this.min();
      this.max();

      untracked(() => this.syncTimepickerValidation());
    });
  }

  override ngOnInit() {
    super.ngOnInit();

    if (this.formControl.value) {
      // Ein bereits vorhandener FormControl-Wert (z.B. aus einer Reactive Form) wurde von der
      // Brücke nicht automatisch verarbeitet - sie schreibt nur einen echten luxValue-Initialwert,
      // nicht einen bereits vorhandenen Fremd-Wert. Einmalige Normalisierung nachholen.
      this.updateTimeValue(this.formControl.value);
      // Siehe LuxDatepickerComponent.ngOnInit() für die Begründung: eine interne Normalisierung darf
      // vor der ersten Interaktion kein dirty auslösen.
      this.resetFieldTouchedAndDirty();
    }

    if (!!this.luxReferenceControl() && this.inForm && this.formControl.updateOn !== 'blur') {
      console.warn(ON_UPDATE_WRONG_MODE_MSG);
    }
  }

  ngAfterViewInit() {
    // Nachholende Anzeige-/Validitätssynchronisation, siehe LuxDatepickerComponent.ngAfterViewInit().
    this.syncTimepickerValidation();
  }

  ngOnDestroy() {
    clearTimeout(this.notifyFormValueChangedTimeout);
    clearTimeout(this.triggerOpenCloseTimeout);
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

  onFocus(e: FocusEvent) {
    this.focused.set(true);
    this.luxFocus.emit(e);
  }

  onFocusIn(e: FocusEvent) {
    this.focused.set(true);
    this.luxFocusIn.emit(e);
  }

  onFocusOut(e: FocusEvent) {
    // Ersetzt die früher von [formControl] übernommene automatische Touched-Markierung beim Blur.
    this.onBlur();
    this.focused.set(false);
    this.luxFocusOut.emit(e);
  }

  onTimeOptionSelected(event: MatTimepickerSelected<Date>) {
    // Bewusst nur bei vorhandenem luxReferenceControl aktiv: Ohne Referenz-Datepicker übernimmt
    // bereits onTimeInputValueChange() die Auswahl (MatTimepickerInput spiegelt eine Panel-Auswahl
    // ebenfalls in sein eigenes value-Model, das (valueChange) auslöst) - ein zusätzlicher Aufruf
    // hier wäre redundant. Nur die Referenzdatum-Übernahme erledigt ausschließlich diese Methode.
    // Siehe applyReferenceDate() für die Begründung, warum lastValue Vorrang vor formControl.value hat.
    const referenceValue = this.luxReferenceControl()?.lastValue ?? this.luxReferenceControl()?.formControl?.value;
    if (event?.value && this.formControl && referenceValue) {
      this.updateTimeValue(this.applyReferenceDate(event.value));
    }

    this.matTimepicker()?.close();
  }

  /**
   * Wird bei jeder manuellen Texteingabe im Feld ausgeführt - MatTimepickerInput hat (anders als
   * MatDatepickerInput) keine (dateInput)/(dateChange)-Outputs, sondern legt den geparsten Wert
   * ausschließlich in seinem eigenen value-Model ab. Ohne diesen Handler kommt eine per Tastatur
   * eingetragene Uhrzeit nie im FormControl an - ein bereits gesetzter Wert ließe sich dann nicht
   * mehr überschreiben, und mangels Wertänderung würde auch nie neu validiert (keine Fehlermeldung).
   */
  onTimeInputValueChange(value: Date | null) {
    if (this.applyingToInput) {
      return;
    }

    this.markAsDirty();
    this.updateTimeValue(value ? this.applyReferenceDate(value) : value);
  }

  /**
   * Übernimmt das Datum des über luxReferenceControl verbundenen Datepickers in eine neu erfasste
   * Uhrzeit - gemeinsame Grundlage für Auswahl im Panel (onTimeOptionSelected) und Texteingabe
   * (onTimeInputValueChange).
   */
  private applyReferenceDate(value: Date): Date {
    // Bewusst zuerst lastValue statt formControl.value: Teilen sich Datepicker und Timepicker (z.B.
    // im Reactive-Form-Betrieb über dasselbe luxControlBinding) dasselbe FormControl, setzt das
    // Leeren des Zeit-Felds dessen Wert kurzzeitig auf null (siehe updateTimeValue()) - genau in
    // diesem Moment gelesen, ginge das zuvor gesetzte Datum unwiederbringlich verloren, obwohl der
    // Datepicker es über lastValue weiterhin unverändert kennt. lastValue wird ausschließlich vom
    // Datepicker selbst gepflegt und bleibt von dieser Race unberührt - siehe
    // LuxDatepickerComponent.referenceTimeProvider für dasselbe Muster.
    const referenceValue = this.luxReferenceControl()?.lastValue ?? this.luxReferenceControl()?.formControl?.value;
    const newDate = new Date(value);

    if (referenceValue instanceof Date && LuxUtil.isDate(referenceValue)) {
      newDate.setUTCFullYear(referenceValue.getUTCFullYear(), referenceValue.getUTCMonth(), referenceValue.getUTCDate());
    }
    if (typeof referenceValue === 'string' && LuxUtil.ISO_8601_FULL.test(referenceValue)) {
      newDate.setUTCFullYear(
        new Date(referenceValue).getUTCFullYear(),
        new Date(referenceValue).getUTCMonth(),
        new Date(referenceValue).getUTCDate()
      );
    }

    return newDate;
  }

  /**
   * Jede Wertänderung von außen (über [(value)]/[formField] oder ein reales FormControl) läuft
   * hier zusammen.
   */
  override emitValueChange(formValue: any) {
    try {
      if (!this.valueChangesRunning) {
        this.valueChangesRunning = true;
        this.updateTimeValue(formValue);
      }
    } finally {
      this.valueChangesRunning = false;
    }
  }

  /**
   * Die eigentliche luxValueChange-Emission, entkoppelt von emitValueChange() (das hier bereits als
   * "irgendein Wert hat sich geändert"-Hook der Brücke belegt ist, siehe oben). Wird ausschließlich
   * verzögert aus setISOValue() aufgerufen, wenn der neue Wert innerhalb von min/max liegt.
   */
  notifyFormValueChanged(value: T) {
    super.emitValueChange(value);
  }

  private parseTime(value: string | null): Date | null {
    return typeof value === 'string' ? this.dateAdapter.parse(value, {}) : null;
  }

  private checkMinMax(dateValue: Date | null): { minOk: boolean; maxOk: boolean } {
    const min = this.min();
    const max = this.max();
    const minOk = !min || !dateValue || this.dateAdapter.compareTime(min, dateValue) <= 0;
    const maxOk = !max || !dateValue || this.dateAdapter.compareTime(max, dateValue) >= 0;
    return { minOk, maxOk };
  }

  /**
   * Eigenständige Ersetzung von MatTimepickerInput.validate(): Dessen zusammengesetzter Validator
   * liest ausschließlich interne Flags (_lastValueValid/_minValid/_maxValid), die alle drei nur von
   * einem effect() aktualisiert werden (siehe timepicker.mjs, _updateFormsState()). Dieser effect()
   * läuft asynchron NACH einem .set() auf MatTimepickerInput.value, nicht synchron davor - ruft man
   * (wie syncTimepickerValidation() es tut) direkt danach formControl.updateValueAndValidity() auf,
   * liest der Validator daher immer den Stand VOR der aktuellen Änderung. In der Praxis bedeutete das:
   * matTimepickerMax/-Min wurden nie gemeldet (immer "eine Änderung zu spät" geprüft), während
   * matTimepickerParse teils fälschlich mit dem vorherigen Zwischenstand des Texts auftauchte (z.B.
   * "20:0" statt "20:00", weil die letzte Ziffer noch nicht in die gecachten Flags eingeflossen war).
   * Diese Prüfung liest stattdessen direkt formControl.value/timeInputValue/min()/max() - alle drei
   * bereits aktuell, wenn updateValueAndValidity() läuft.
   */
  private validateTime = (control: AbstractControl): LuxValidationErrors | null => {
    if (!control.value) {
      // Kein geparster Wert vorhanden - ungültig NUR, wenn tatsächlich (nicht parsbarer) Text im
      // Feld steht. Ein leeres Feld ist für sich genommen gültig, required wird separat geprüft.
      return this.timeInputValue ? { matTimepickerParse: { text: this.timeInputValue } } : null;
    }

    const value = this.dateAdapter.deserialize(control.value);
    if (!value || !this.dateAdapter.isValid(value)) {
      return { matTimepickerParse: { text: this.timeInputValue } };
    }

    const { minOk, maxOk } = this.checkMinMax(value);
    if (!minOk) {
      return { matTimepickerMin: { min: this.min(), actual: value } };
    }
    if (!maxOk) {
      return { matTimepickerMax: { max: this.max(), actual: value } };
    }

    return null;
  };

  private triggerOpenClose() {
    if (this.luxOpened()) {
      this.matTimepicker()?.open();
    } else {
      this.matTimepicker()?.close();
    }
  }

  private setISOValue(isoValue: string) {
    // Siehe LuxDatepickerComponent.setISOValue(): Der valueInput-Effect der Legacy-Bridge wendet
    // einen unveränderten luxValue-Rohwert beim allerersten Lauf trotzdem erneut an, was hier zu
    // einer doppelten (redundanten) luxValueChange-Emission führen würde, wäre diese nicht gegen
    // den zuletzt tatsächlich emittierten ISO-Wert abgesichert.
    const valueGenuinelyChanged = this.previousISO !== isoValue;
    this.previousISO = isoValue;

    if (this.formControl.value !== isoValue) {
      this.formControl.setValue(isoValue as any, {
        emitEvent: this.shouldEmitDirectly,
        emitModelToViewChange: this.shouldEmitDirectly,
        emitViewToModelChange: this.shouldEmitDirectly
      });
      this.value.set(isoValue as any);
    }

    if (!this.shouldEmitDirectly) {
      // Stößt bei einer stillen (emitEvent:false) Korrektur oben die sonst unterdrückte
      // Zustandssynchronisation der Brücke wieder an (siehe LuxDatepickerComponent.
      // syncDatepickerValidation() bzw. die entsprechende Erkenntnis bei lux-datetimepicker).
      // NUR im "silent"-Fall nötig: Ist shouldEmitDirectly true, feuert formControl.setValue() oben
      // bereits regulär events - ein zusätzlicher Aufruf hier verursachte im Szenario "Datepicker
      // und Timepicker teilen sich ein FormControl über luxReferenceControl" einen Stack-Overflow
      // (beide Komponenten validieren dasselbe FormControl, wodurch sich wiederholte
      // updateValueAndValidity()-Aufrufe gegenseitig aufschaukelten).
      this.syncTimepickerValidation();
    }

    if (this.timepickerInput() && !this.timeInputValue && isoValue) {
      this.timeInputValue = this.dateAdapter.format(isoValue as any, APP_TIME_FORMATS.display.timeInput);
    }

    const dateValue = isoValue ? new Date(isoValue) : null;
    const { minOk, maxOk } = this.checkMinMax(dateValue);

    if (minOk && maxOk && valueGenuinelyChanged) {
      // ExpressionChangedError vermeiden, indem die Änderung des ValueChange-Emitters in einen Timeout gepackt wird, damit sie nach der aktuellen Änderungsschleife ausgeführt wird.
      // Wenn z.B. ein Datum mit Uhrzeit von außen übergeben wird, wird das Datum intern angepasst (z.B. auf 00:00 Uhr gesetzt), damit es im Datepicker korrekt dargestellt wird. In diesem Fall würde der ValueChange-Emitter sofort erneut getriggert werden, was zu einem ExpressionChangedError führen kann, da sich der Wert während der Änderungsschleife ändert.
      this.notifyFormValueChangedTimeout = setTimeout(() => {
        this.notifyFormValueChanged(isoValue as T);
      });
    }
  }

  /**
   * Registriert validateTime() (deckt matTimepickerMin/-Max/-Parse ab) als regulären Validator auf
   * dem FormControl - siehe LuxDatepickerComponent.syncDatepickerValidation() für die ausführliche
   * Begründung (ohne [formControl]/NgControl komponiert Angular NG_VALIDATORS nicht mehr
   * automatisch). Bewusst NICHT inputDirective.validate() selbst (siehe validateTime()-Kommentar für
   * dessen Stale-Cache-Problematik).
   *
   * BEWUSST OHNE inputDirective.registerOnValidatorChange(): Ein erster Versuch, darüber bei einer
   * MatTimepickerInput-internen Gültigkeitsänderung updateValueAndValidity() anzustoßen, verursachte
   * einen Stack-Overflow im Szenario "Datepicker und Timepicker teilen sich ein FormControl über
   * luxReferenceControl" (Test "...mit gemeinsamem Control synchron halten") - beide Komponenten
   * validieren dasselbe FormControl, updateValueAndValidity() reevaluiert dabei auch den jeweils
   * anderen Validator, was sich in dieser Konstellation aufschaukelte. Kein Spec-Fall benötigt die
   * automatische Revalidierung bei einer reinen min/max-Änderung ohne begleitende Wertänderung.
   */
  private syncTimepickerValidation() {
    const inputDirective = this.timepickerInputDirective();
    if (!inputDirective || !this.formControl) {
      return;
    }

    if (!this.timepickerValidatorRegistered) {
      this.timepickerValidatorRegistered = true;
      this.formControl.addValidators(this.validateTime);
    }

    this.applyingToInput = true;
    try {
      inputDirective.writeValue(this.formControl.value);
    } finally {
      this.applyingToInput = false;
    }

    // Bewusst OHNE Event-Emission - siehe LuxDatepickerComponent.syncDatepickerValidation() für die
    // ausführliche Begründung. Ohne emitEvent:false feuert updateValueAndValidity() IMMER erneut
    // formControl.valueChanges/events, auch ohne echte Änderung. Da syncTimepickerValidation() aus
    // setISOValue() heraus praktisch bei jedem Aufruf läuft, schaukelt sich das über die
    // LuxLegacyFormBridge-Subscription selbst hoch - reproduzierbar u.a. wenn zwei
    // lux-timepicker-Instanzen per luxControlBinding an dasselbe FormControl gebunden sind (jede
    // Instanz hat ihren eigenen valueChangesRunning-Reentrancy-Guard, der die jeweils ANDERE Instanz
    // nicht vor der Rückkopplung schützt) - endet dort in einem synchronen Stack-Overflow. Die
    // Validatoren laufen trotzdem synchron neu; touched/dirty/invalid/errorMessage bleiben aktuell,
    // weil LuxLegacyFormBridge.check() ohnehin bei jedem ngDoCheck() syncState() aufruft.
    this.formControl.updateValueAndValidity({ emitEvent: false });

    // Im Signal-Forms- und Freistehend-Betrieb bleibt stateOverride bewusst undefined (die
    // Legacy-Brücke ist dort nicht "engaged", siehe LuxLegacyFormBridge.engaged) - ohne diese
    // zusätzliche Meldung an internalErrors() käme luxMinTime/luxMaxTime in genau diesen beiden
    // Betriebsarten nie in isInvalid()/errorMessage() an.
    this.internalErrors.set(this.formControl.errors as LuxValidationErrors | null);
  }

  private updateTimeValue(value: any) {
    if (!value || (value instanceof Date && isNaN(value.getTime()))) {
      this.setISOValue(null as any);
      return;
    }

    if (typeof value === 'string') {
      value = this.dateAdapter.parse(value, {});
    }

    if (!LuxUtil.isDate(value)) {
      return;
    }

    const eventDate: Date = value;
    const normalized = new Date(0);
    normalized.setUTCFullYear(eventDate.getUTCFullYear(), eventDate.getUTCMonth(), eventDate.getUTCDate());
    normalized.setUTCHours(eventDate.getUTCHours(), eventDate.getUTCMinutes(), eventDate.getUTCSeconds(), 0);
    this.lastValue = normalized;

    // Bewusst OHNE zusätzlichen "bereits verarbeitet"-Vergleich gegen previousISO - siehe
    // LuxDatepickerComponent.updateDateValue() für die ausführliche Begründung. setISOValue() selbst
    // ist idempotent (prüft gegen formControl.value) und regelt die Emissions-Dedupe separat über
    // valueGenuinelyChanged.
    if (LuxUtil.isDate(normalized)) {
      this.setISOValue(normalized.toISOString());
    }
  }

  private formatTime(date: any) {
    return this.dateAdapter.format(date, APP_TIME_FORMATS.display.timeInput);
  }
}
