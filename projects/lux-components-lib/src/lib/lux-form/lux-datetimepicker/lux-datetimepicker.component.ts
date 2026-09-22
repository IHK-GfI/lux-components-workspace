import { Platform } from '@angular/cdk/platform';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  computed,
  effect,
  inject,
  input,
  signal,
  untracked,
  viewChild
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ValidationErrors, ValidatorFn } from '@angular/forms';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { DateFilterFn, MatDatepickerToggle, MatDatepickerToggleIcon } from '@angular/material/datepicker';
import { MatInput } from '@angular/material/input';
import { Observable } from 'rxjs';
import { LuxAriaDescribedbyDirective } from '../../lux-directives/lux-aria/lux-aria-describedby.directive';
import { LuxAriaLabelDirective } from '../../lux-directives/lux-aria/lux-aria-label.directive';
import { LuxAriaLabelledbyDirective } from '../../lux-directives/lux-aria/lux-aria-labelledby.directive';
import { LuxTagIdDirective } from '../../lux-directives/lux-tag-id/lux-tag-id.directive';
import { LuxIconComponent } from '../../lux-icon/lux-icon/lux-icon.component';
import { LuxThemePalette } from '../../lux-util/lux-colors.enum';
import { LuxUtil } from '../../lux-util/lux-util';
import { LuxDateFilterFn, LuxStartView } from '../lux-datepicker/lux-datepicker.component';
import { LuxFormControlWrapperComponent } from '../lux-form-control-wrapper/lux-form-control-wrapper.component';
import { LuxValidationErrors } from '../lux-form-model/lux-form-component-base.class';
import { provideLuxFormControl } from '../lux-form-model/lux-form-control-base.class';
import { LuxFormLegacyValueBase } from '../lux-form-model/lux-form-legacy/lux-form-legacy-value-base.class';
import { LuxDatetimeOverlayComponent } from './lux-datetime-overlay/lux-datetime-overlay.component';
import { LuxDatetimepickerAdapter } from './lux-datetimepicker-adapter';

export const APP_DATE_TIME_FORMATS_AC = {
  parse: {
    dateInput: { month: '2-digit', year: 'numeric', day: '2-digit', hour: '2-digit', minute: '2-digit', hour12: false }
  },
  display: {
    dateInput: { month: '2-digit', year: 'numeric', day: '2-digit', hour: '2-digit', minute: '2-digit', hour12: false },
    monthYearLabel: { year: 'numeric', month: 'long' },
    dateA11yLabel: { year: 'numeric', month: 'long', day: 'numeric' },
    monthYearA11yLabel: { year: 'numeric', month: 'long' }
  }
};
/**
 * @deprecated Diese Klasse ist veraltet und sollte nicht mehr verwendet werden.
 * Verwende stattdessen `LuxDatepickerComponent` in Kombination mit `LuxTimepickerComponent`.
 */
@Component({
  selector: 'lux-datetimepicker, lux-datetimepicker-ac',
  templateUrl: './lux-datetimepicker.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    { provide: DateAdapter, useClass: LuxDatetimepickerAdapter, deps: [MAT_DATE_LOCALE, Platform] },
    { provide: MAT_DATE_FORMATS, useValue: APP_DATE_TIME_FORMATS_AC },
    provideLuxFormControl(() => LuxDatetimepickerComponent)
  ],
  imports: [
    LuxIconComponent,
    LuxFormControlWrapperComponent,
    MatInput,
    MatDatepickerToggle,
    MatDatepickerToggleIcon,
    LuxDatetimeOverlayComponent,
    LuxAriaDescribedbyDirective,
    LuxAriaLabelDirective,
    LuxAriaLabelledbyDirective,
    LuxTagIdDirective
  ]
})
export class LuxDatetimepickerComponent<T = any> extends LuxFormLegacyValueBase<T> implements OnInit, AfterViewInit, OnDestroy {
  readonly luxStartView = input<LuxStartView>('month');
  readonly luxOpened = input(false);
  readonly luxStartDate = input<string | undefined>(undefined);
  readonly luxStartTime = input<number[]>([]);
  readonly luxShowToggle = input(true);
  readonly luxCustomFilter = input<LuxDateFilterFn | undefined>(undefined);
  readonly luxMaxDate = input<string | undefined>(undefined);
  readonly luxMinDate = input<string | undefined>(undefined);

  // Der Standard-Wert für Autocomplete wird für den Datetimepicker ausgeschaltet.
  override readonly luxAutocomplete = input('off');

  readonly dateTimeOverlayComponent = viewChild(LuxDatetimeOverlayComponent);
  readonly dateTimePickerInputEl = viewChild<ElementRef>('dateTimePickerInput');

  readonly luxLocale = signal<string>('de-DE');

  dateTimeValidator: ValidatorFn = (): ValidationErrors | null => {
    let result = null;

    const min = this.min();
    const max = this.max();

    if (this.dateTimeInputValue) {
      const date = this.parseDateTime(this.dateTimeInputValue);

      const filterFn = this.luxCustomFilter();

      if (date === null) {
        result = { matDatepickerParse: { text: this.dateTimeInputValue } };
      } else if (min && this.compareDateWithTime(min, date) > 0) {
        result = { matDatepickerMin: { min, actual: this.dateTimeInputValue } };
      } else if (max && this.compareDateWithTime(date, max) > 0) {
        result = { matDatepickerMax: { max, actual: this.dateTimeInputValue } };
      } else if (filterFn && !filterFn(date)) {
        result = { matDatepickerFilter: true };
      }
    } else {
      if (!this.inForm) {
        if (this.isRequired()) {
          result = { required: true };
        }
      }
    }

    return result;
  };

  // Code des Interfaces "MatDatepickerControl" - Start
  // "disabled" kollidiert mit dem gleichnamigen Vertrags-Input der neuen Basisklasse, daher
  // umbenannt - dieses Feld wird nirgends gelesen oder geschrieben (die Klasse implementiert
  // MatDatepickerControl nicht wirklich, nur strukturell ähnlich benannt).
  datepickerControlDisabled = false;
  dateFilter?: DateFilterFn<any>;
  stateChanges?: Observable<void>;
  // Code des Interfaces "MatDatepickerControl" - Ende

  get selectedDate(): string | undefined {
    return typeof this.formControl.value === 'string' ? this.formControl.value : undefined;
  }

  get dateTimeInputValue() {
    return this.dateTimePickerInputEl()?.nativeElement.value;
  }

  set dateTimeInputValue(newValue: string) {
    const inputEl = this.dateTimePickerInputEl();

    if (inputEl) {
      inputEl.nativeElement.value = newValue;
    }
  }

  private dateTimeAdapter = inject<DateAdapter<Date>>(DateAdapter);

  private previousISO?: string;
  private triggerOpenCloseTimeout?: ReturnType<typeof setTimeout>;
  private notifyFormValueChangedTimeout?: ReturnType<typeof setTimeout>;

  readonly min = computed(() => this.parseDateTimeInput(this.luxMinDate()));
  readonly max = computed(() => this.parseDateTimeInput(this.luxMaxDate()));

  readonly start = computed(() => {
    const startDate = this.luxStartDate();

    if (typeof startDate !== 'string') {
      return null;
    }

    const startDateArr = startDate.trim().split('.');
    if (startDateArr.length !== 3) {
      return null;
    }

    const start = new Date(0);
    start.setUTCFullYear(+startDateArr[2], +startDateArr[1] - 1, +startDateArr[0]);
    return start;
  });

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
      this.dateTimeAdapter.setLocale(this.luxLocale());

      // Input-Feld neu formatieren. formControl.value ist ein ISO-String, kein Date - vor dem
      // Formatieren erst deserialisieren (siehe LuxDatepickerComponent für dieselbe Korrektur).
      if (this.formControl && this.dateTimePickerInputEl()) {
        this.dateTimeInputValue = this.formatDateTime(this.dateTimeAdapter.deserialize(this.formControl.value));
      }
    });

    effect(() => {
      this.luxOpened();

      // Eventuell gibt es ohne das Timeout sonst Fehler, weil die OverlayComponent noch nicht gesetzt ist
      untracked(() => (this.triggerOpenCloseTimeout = setTimeout(() => this.triggerOpenClose())));
    });

    // dateTimeValidator erneut registrieren, nachdem die Legacy-Bridge auf luxControlValidators-
    // bzw. luxRequired-Änderungen reagiert hat: Deren updateValidators() ruft formControl.
    // setValidators() auf, was die gesamte Validator-Liste (inkl. dateTimeValidator) ersetzt statt
    // nur zu ergänzen. addValidators() mit derselben (stabilen) Funktionsreferenz ist idempotent,
    // ein erneuter Aufruf hier fügt also keine Duplikate hinzu.
    effect(() => {
      this.luxControlValidators();
      this.luxRequired();

      untracked(() => {
        if (this.formControl) {
          this.formControl.addValidators(this.dateTimeValidator);
        }
      });
    });
  }

  override ngOnInit() {
    super.ngOnInit();

    if (this.formControl.value !== null && this.formControl.value !== undefined) {
      // Ein bereits vorhandener FormControl-Wert (z.B. aus einer Reactive Form) wurde von der
      // Brücke nicht automatisch verarbeitet - sie schreibt nur einen echten luxValue-Initialwert,
      // nicht einen bereits vorhandenen Fremd-Wert. Einmalige Normalisierung nachholen.
      this.updateDateValue(this.formControl.value);
      // Siehe LuxDatepickerComponent.ngOnInit() für die Begründung: eine interne Normalisierung darf
      // vor der ersten Interaktion kein dirty auslösen.
      this.resetFieldTouchedAndDirty();
    }
  }

  ngAfterViewInit() {
    this.dateTimeInputValue = this.formatDateTime(this.dateTimeAdapter.deserialize(this.formControl.value));
    this.formControl.addValidators(this.dateTimeValidator);
  }

  ngOnDestroy() {
    clearTimeout(this.notifyFormValueChangedTimeout);
    clearTimeout(this.triggerOpenCloseTimeout);
  }

  // Code des Interfaces "MatDatepickerControl" - Start
  getStartValue() {
    return this.luxStartDate();
  }

  getThemePalette(): LuxThemePalette {
    return undefined;
  }

  getConnectedOverlayOrigin(): ElementRef {
    return this.dateTimePickerInputEl()!;
  }

  getOverlayLabelId() {
    return null;
  }
  // Code des Interfaces "MatDatepickerControl" - Ende

  onOk(date: Date) {
    const selected = new Date(date.getTime());

    if (LuxUtil.isDate(selected)) {
      this.setISOValue(selected.toISOString());
    }

    this.dateTimeInputValue = this.formatDateTime(selected);
  }

  onFocus(e: FocusEvent) {
    this.focused.set(true);
    this.luxFocus.emit(e);
  }

  onFocusIn(e: FocusEvent) {
    this.focused.set(true);
    this.luxFocusIn.emit(e);
  }

  onFocusOut(event: FocusEvent) {
    if (this.formControl.value) {
      const formattedDate = this.formatDateTime(this.parseDateTime(this.formControl.value as any));

      if (this.dateTimeInputValue !== formattedDate) {
        this.dateTimeInputValue = formattedDate;
      }
    }
    // Ersetzt die früher von [formControl] übernommene automatische Touched-Markierung beim Blur.
    this.onBlur();
    this.focused.set(false);
    this.luxFocusOut.emit(event);
  }

  onInput(event: Event) {
    this.markAsDirty();
    this.formControl.setValue((event.target as HTMLInputElement).value as T);
  }

  override errorMessageModifier(_value: any, errors: LuxValidationErrors): string | undefined {
    if (errors['matDatepickerMin']) {
      return this.tService.translate('luxc.datetimepicker.error_message.min');
    } else if (errors['matDatepickerMax']) {
      return this.tService.translate('luxc.datetimepicker.error_message.max');
    } else if (errors['matDatepickerParse'] || errors['matDatepickerFilter']) {
      return this.tService.translate('luxc.datetimepicker.error_message.invalid');
    } else if (errors['required']) {
      if (this.dateTimeInputValue) {
        return this.tService.translate('luxc.datetimepicker.error_message.invalid');
      } else {
        return this.tService.translate('luxc.datetimepicker.error_message.empty');
      }
    }

    return undefined;
  }

  /**
   * Jede Wertänderung von außen (über [(value)]/[formField] oder ein reales FormControl) läuft
   * hier zusammen.
   */
  override emitValueChange(formValue: any) {
    this.updateDateValue(formValue);

    // NUR während das Feld NICHT fokussiert ist: Während echter Tastatureingabe läuft onInput() ->
    // formControl.setValue() -> (über die LuxLegacyFormBridge) synchron wieder hier herein, auch für
    // JEDEN Zwischenzustand. Lässt sich ein unfertiger Zwischenwert (z.B. "7.09.2026, 12:15" nach dem
    // Löschen der führenden "1" aus "17.09.2026, 12:15") bereits zu einem vollständigen Datum
    // parsen, würde setISOValue() -> updateValueAndValidity() (siehe dort, bewusst OHNE
    // emitEvent:false) diesen Callback ein zweites Mal mit dem kanonisch reformatierten ISO-Wert
    // durchlaufen - die Anzeige spränge dabei sofort zu z.B. "07.09.2026, 12:15", bevor der Nutzer
    // die Ersatzziffer tippen kann. Siehe LuxDatepickerComponent.syncDatepickerValidation() für
    // dieselbe "Fokus-Bremse" bei genau diesem Problem.
    if (this.focused()) {
      return;
    }

    if (LuxUtil.ISO_8601_FULL.test(formValue)) {
      this.dateTimeInputValue = this.formatDateTime(this.dateTimeAdapter.deserialize(formValue));
    } else if (typeof formValue === 'string') {
      // Entspricht dem früheren ControlValueAccessor (writeValue), der bei JEDER Wertänderung den
      // Rohwert unverändert in die Anzeige spiegelte - unabhängig davon, ob updateDateValue() ihn
      // selbst in ein ISO-Datum umwandeln konnte (z.B. ein Datum ohne Uhrzeit wie "10.07.2015").
      this.dateTimeInputValue = formValue;
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

  private parseDateTimeInput(value: string | undefined): Date | null {
    return typeof value === 'string' ? this.parseDateTime(value) : null;
  }

  private compareDateWithTime(first: Date, second: Date): number {
    return (
      this.dateTimeAdapter.compareDate(first, second) || first.getHours() - second.getHours() || first.getMinutes() - second.getMinutes()
    );
  }

  private setISOValue(isoValue: string) {
    this.notifyFormValueChangedTimeout = setTimeout(() => {
      // Siehe LuxDatepickerComponent.setISOValue(): Der valueInput-Effect der Legacy-Bridge wendet
      // einen unveränderten luxValue-Rohwert beim allerersten Lauf trotzdem erneut an, was hier zu
      // einer doppelten (redundanten) luxValueChange-Emission führen würde, wäre diese nicht gegen
      // den zuletzt tatsächlich emittierten ISO-Wert abgesichert.
      const valueGenuinelyChanged = this.previousISO !== isoValue;
      this.previousISO = isoValue;

      const min = this.min();
      const max = this.max();

      let minOk = true;
      if (min && isoValue && this.dateTimeAdapter.compareDate(new Date(isoValue), min) < 0) {
        minOk = false;
      }

      let maxOk = true;
      if (max && isoValue && this.dateTimeAdapter.compareDate(new Date(isoValue), max) > 0) {
        maxOk = false;
      }

      if (minOk && maxOk && valueGenuinelyChanged) {
        this.notifyFormValueChanged(isoValue as T);
      }

      if (this.formControl.value !== isoValue) {
        // "silently" den FormControl auf den (potenziell) geänderten Wert aktualisieren
        this.formControl.setValue(isoValue as any, {
          emitEvent: false,
          emitModelToViewChange: false,
          emitViewToModelChange: false
        });
        // emitEvent: false unterdrückt auch formControl.events, wodurch weder die Brücke ihren
        // stateOverride nachzieht noch diese OnPush-Komponente als zu prüfen markiert wird (siehe
        // LuxDatepickerComponent.syncDatepickerValidation() für dasselbe Muster). Ohne den erneuten,
        // NICHT unterdrückten Aufruf hier bliebe z.B. ein durch die Normalisierung neu entstandener
        // matDatepickerParse/required-Fehler unsichtbar, bis irgendein anderer Trigger die
        // Komponente zufällig erneut prüft.
        this.formControl.updateValueAndValidity();
      }
      // Signal-Schreibzugriff - markiert diese OnPush-Komponente automatisch als zu prüfen (kein
      // manuelles markForCheck() mehr nötig, siehe LuxLegacyFormBridge/LuxFormControlBase).
      this.value.set(isoValue as any);

      if (!this.dateTimeInputValue && isoValue) {
        // Per Hand dem Input-Element einen formatierten String übergeben
        this.dateTimeInputValue = this.formatDateTime(this.dateTimeAdapter.deserialize(isoValue));
      }
    });
  }

  private triggerOpenClose() {
    if (this.luxOpened()) {
      this.dateTimeOverlayComponent()?.open();
    } else {
      this.dateTimeOverlayComponent()?.close();
    }
  }

  private formatDateTime(date: any) {
    return this.dateTimeAdapter.format(date, APP_DATE_TIME_FORMATS_AC.display.dateInput);
  }

  private parseDateTime(date: string) {
    return this.dateTimeAdapter.parse(date, APP_DATE_TIME_FORMATS_AC.parse.dateInput);
  }

  private updateDateValue(value: any) {
    if (typeof value === 'string') {
      value = this.parseDateTime(value);
    }

    if (!value) {
      // Nur benachrichtigen, wenn tatsächlich ein Wert gelöscht wurde. Ohne diesen Guard löst z.B.
      // ein reines Neu-Validieren (updateValueAndValidity() nach Validator-Änderungen) über
      // formControl.valueChanges eine falsche/leere Wertänderungs-Meldung aus, obwohl der Wert nie
      // gesetzt war.
      //
      // Bewusst gegen previousISO statt gegen this.value() geprüft: Die LuxLegacyFormBridge
      // registriert einen eigenen, synchronen onChange-Callback direkt am FormControl
      // (publishValue()), der bei engagierter Brücke (z.B. luxValue/luxControlBinding) diesen
      // Modell-Signal-Wert bereits VOR diesem Guard auf den neuen (leeren) Rohwert setzt. Eine
      // Prüfung gegen this.value() sähe das Feld dadurch fälschlich schon als geleert an und würde
      // setISOValue() nie aufrufen - luxValueChange bliebe beim Leeren des Felds aus. previousISO
      // wird ausschließlich von setISOValue() selbst geschrieben und bleibt von dieser Race
      // unberührt.
      if (this.previousISO) {
        this.setISOValue(value);
      }
      return;
    }

    // Sicherheitshalber noch einmal prüfen, kann vorkommen das ein unsinniger Wert eingetragen wird
    // z.B. 'asdf', das führt zu InvalidDate's
    if (LuxUtil.isDate(value)) {
      this.setISOValue(value.toISOString());
    }
  }
}
