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
    const referenceValue = this.luxReferenceControl()?.formControl?.value;
    if (event?.value && this.formControl && referenceValue) {
      const newDate: Date = new Date(event.value);
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

      this.updateTimeValue(newDate);
    }

    this.matTimepicker()?.close();
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
    const min = this.min();
    const max = this.max();
    const minOk = !min || !dateValue || this.dateAdapter.compareTime(min, dateValue) <= 0;
    const maxOk = !max || !dateValue || this.dateAdapter.compareTime(max, dateValue) >= 0;

    if (minOk && maxOk && valueGenuinelyChanged) {
      // ExpressionChangedError vermeiden, indem die Änderung des ValueChange-Emitters in einen Timeout gepackt wird, damit sie nach der aktuellen Änderungsschleife ausgeführt wird.
      // Wenn z.B. ein Datum mit Uhrzeit von außen übergeben wird, wird das Datum intern angepasst (z.B. auf 00:00 Uhr gesetzt), damit es im Datepicker korrekt dargestellt wird. In diesem Fall würde der ValueChange-Emitter sofort erneut getriggert werden, was zu einem ExpressionChangedError führen kann, da sich der Wert während der Änderungsschleife ändert.
      this.notifyFormValueChangedTimeout = setTimeout(() => {
        this.notifyFormValueChanged(isoValue as T);
      });
    }
  }

  /**
   * Registriert MatTimepickerInput.validate() (deckt matTimepickerMin/-Max/-Parse ab) als regulären
   * Validator auf dem FormControl - siehe LuxDatepickerComponent.syncDatepickerValidation() für die
   * ausführliche Begründung (ohne [formControl]/NgControl komponiert Angular NG_VALIDATORS nicht
   * mehr automatisch).
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
      this.formControl.addValidators((control) => inputDirective.validate(control));
    }

    inputDirective.writeValue(this.formControl.value);
    this.formControl.updateValueAndValidity();
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
