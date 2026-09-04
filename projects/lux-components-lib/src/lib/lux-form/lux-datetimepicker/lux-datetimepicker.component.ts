import { Platform } from '@angular/cdk/platform';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  computed,
  effect,
  inject,
  input,
  signal,
  untracked,
  viewChild
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule, ReactiveFormsModule, ValidationErrors, ValidatorFn } from '@angular/forms';
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
import { LuxDatetimeOverlayComponent } from '../lux-datetimepicker/lux-datetime-overlay/lux-datetime-overlay.component';
import { LuxFormControlWrapperComponent } from '../lux-form-control-wrapper/lux-form-control-wrapper.component';
import { LuxValidationErrors, ValidatorFnType } from '../lux-form-model/lux-form-component-base.class';
import { LuxFormInputBaseClass } from '../lux-form-model/lux-form-input-base.class';
import { LuxDatetimeOverlayComponent as LuxDatetimeOverlayComponent_1 } from './lux-datetime-overlay/lux-datetime-overlay.component';
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
  providers: [
    { provide: DateAdapter, useClass: LuxDatetimepickerAdapter, deps: [MAT_DATE_LOCALE, Platform] },
    { provide: MAT_DATE_FORMATS, useValue: APP_DATE_TIME_FORMATS_AC }
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    LuxIconComponent,
    LuxFormControlWrapperComponent,
    FormsModule,
    ReactiveFormsModule,
    MatInput,
    MatDatepickerToggle,
    MatDatepickerToggleIcon,
    LuxDatetimeOverlayComponent_1,
    LuxAriaDescribedbyDirective,
    LuxAriaLabelDirective,
    LuxAriaLabelledbyDirective,
    LuxTagIdDirective
  ]
})
export class LuxDatetimepickerComponent<T = any> extends LuxFormInputBaseClass<T> implements AfterViewInit {
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

  readonly focused = signal(false);

  dateTimeValidator: ValidatorFn = (): ValidationErrors | null => {
    let result = null;

    const min = this.min();
    const max = this.max();

    if (this.dateTimeInputValue) {
      const date = this.parseDateTime(this.dateTimeInputValue);

      if (date === null) {
        result = { matDatepickerParse: { text: this.dateTimeInputValue } };
      } else if (min && this.compareDateWithTime(min, date) > 0) {
        result = { matDatepickerMin: { min, actual: this.dateTimeInputValue } };
      } else if (max && this.compareDateWithTime(date, max) > 0) {
        result = { matDatepickerMax: { max, actual: this.dateTimeInputValue } };
      }
    } else {
      if (!this.inForm) {
        if (this.luxRequired()) {
          result = { required: true };
        }
      }
    }

    return result;
  };

  // Code des Interfaces "MatDatepickerControl" - Start
  disabled = false;
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

  readonly describedBy = computed(() => {
    if (this.errorMessage()) {
      return this.uid() + '-error';
    }

    const hasHint = !!this.formHintComponent() || !!this.luxHint();
    return hasHint && (!this.luxHintShowOnlyOnFocus() || this.focused()) ? this.uid() + '-hint' : undefined;
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

      // Input-Feld neu formatieren
      if (this.formControl && this.dateTimePickerInputEl()) {
        this.dateTimeInputValue = this.formatDateTime(this.formControl.value);
      }
    });

    effect(() => {
      this.luxOpened();

      // Eventuell gibt es ohne das Timeout sonst Fehler, weil die OverlayComponent noch nicht gesetzt ist
      untracked(() => setTimeout(() => this.triggerOpenClose()));
    });
  }

  ngAfterViewInit() {
    this.dateTimeInputValue = this.formatDateTime(this.formControl.value);
    this.formControl.addValidators(this.dateTimeValidator);
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
    this.focused.set(false);
    this.luxFocusOut.emit(event);
  }

  override errorMessageModifier(_value: any, errors: LuxValidationErrors): string | undefined {
    if (errors['matDatepickerMin']) {
      return this.tService.translate('luxc.datetimepicker.error_message.min');
    } else if (errors['matDatepickerMax']) {
      return this.tService.translate('luxc.datetimepicker.error_message.max');
    } else if (errors['matDatepickerParse']) {
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

  override setValue(value: any) {
    if (value !== this.getValue()) {
      if (!this.formControl) {
        this._initialValue = value;
        return;
      }
      this.formControl.setValue(value);
    }
  }

  protected override initFormValueSubscription() {
    this._formValueChangeSub = this.formControl.valueChanges.subscribe((value: any) => {
      this.updateDateValue(value);

      if (LuxUtil.ISO_8601_FULL.test(value)) {
        this.dateTimeInputValue = this.formatDateTime(this.formControl.value);
      }
    });

    if (this.formControl.value !== null && this.formControl.value !== undefined) {
      // Es kann vorkommen, dass der initiale Wert nicht im ISO-Format angegeben ist.
      // Dann muss der Wert noch umgewandelt werden.
      this.updateDateValue(this.formControl.value);
    } else if (this._initialValue !== null && this._initialValue !== undefined) {
      // Vorhandenen Initialwert setzen
      this.formControl.setValue(this._initialValue);
    }
  }

  protected override updateValidators(validators: ValidatorFnType, checkRequiredValidator: boolean) {
    const hasValidators = (!Array.isArray(validators) && !!validators) || (Array.isArray(validators) && validators.length > 0);

    if (!this.inForm) {
      setTimeout(() => {
        // Der setTimeout-Callback feuert asynchron. Zu diesem Zeitpunkt kann inForm bereits true
        // sein, falls die Komponente an eine Reactive Form gebunden ist. Ohne diesen Guard würde
        // setValidators() die Validatoren des FormControls überschreiben.
        if (this.inForm) {
          return;
        }

        this.formControl.setValidators(validators ?? null);
        this.formControl.addValidators(this.dateTimeValidator);

        if (checkRequiredValidator) {
          if (this.luxRequired()) {
            this.formControl.addValidators(this.getRequiredValidator());
          } else {
            this.formControl.removeValidators(this.getRequiredValidator());
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

  private parseDateTimeInput(value: string | undefined): Date | null {
    return typeof value === 'string' ? this.parseDateTime(value) : null;
  }

  private compareDateWithTime(first: Date, second: Date): number {
    return (
      this.dateTimeAdapter.compareDate(first, second) || first.getHours() - second.getHours() || first.getMinutes() - second.getMinutes()
    );
  }

  private setISOValue(isoValue: string) {
    setTimeout(() => {
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

      if (minOk && maxOk) {
        this.notifyFormValueChanged(isoValue);
      }

      // "silently" den FormControl auf den (potenziell) geänderten Wert aktualisieren
      this.formControl.setValue(isoValue as any, {
        emitEvent: false,
        emitModelToViewChange: false,
        emitViewToModelChange: false
      });
      this.value.set(isoValue as any);

      // emitEvent: false löst KEIN formControl.events aus, wodurch die automatische
      // markForCheck()-Kopplung in LuxFormComponentBase (ngOnInit) ausbleibt. Ohne diesen
      // manuellen Aufruf würde ngDoCheck() (und damit die Fehlermeldungs-Anzeige) bei dieser
      // OnPush-Komponente erst bei einer zufällig ausgelösten Prüfung nachziehen.
      this.cdr.markForCheck();

      if (!this.dateTimeInputValue && isoValue) {
        // Per Hand dem Input-Element einen formatierten String übergeben
        this.dateTimeInputValue = this.formatDateTime(isoValue);
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
      this.setISOValue(value);
      return;
    }

    // Sicherheitshalber noch einmal prüfen, kann vorkommen das ein unsinniger Wert eingetragen wird
    // z.B. 'asdf', das führt zu InvalidDate's
    if (LuxUtil.isDate(value)) {
      this.setISOValue(value.toISOString());
    }
  }
}
