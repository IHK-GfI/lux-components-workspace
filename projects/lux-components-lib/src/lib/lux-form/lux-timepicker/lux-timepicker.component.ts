import { Platform } from '@angular/cdk/platform';
import {
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
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
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
import { LuxFormInputBaseClass } from '../lux-form-model/lux-form-input-base.class';
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
  providers: [
    { provide: DateAdapter, useClass: LuxTimepickerAdapter, deps: [MAT_DATE_LOCALE, Platform] },
    { provide: MAT_DATE_FORMATS, useValue: APP_TIME_FORMATS }
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    LuxIconComponent,
    LuxFormControlWrapperComponent,
    FormsModule,
    ReactiveFormsModule,
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
export class LuxTimepickerComponent<T = any> extends LuxFormInputBaseClass<T> {
  private dateAdapter = inject<DateAdapter<Date>>(DateAdapter);
  private previousISO?: string;

  lastValue: Date | null = null;

  readonly focused = signal(false);

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

  readonly luxLocale = signal<string>('de-DE');

  readonly min = computed(() => this.parseTime(this.luxMinTime()));
  readonly max = computed(() => this.parseTime(this.luxMaxTime()));

  readonly describedBy = computed(() => {
    if (this.errorMessage()) {
      return this.uid() + '-error';
    }

    const hasHint = !!this.formHintComponent() || !!this.luxHint();
    return hasHint && (!this.luxHintShowOnlyOnFocus() || this.focused()) ? this.uid() + '-hint' : undefined;
  });

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

  constructor() {
    super();

    effect(() => {
      this.luxOpened();

      untracked(() => setTimeout(() => this.triggerOpenClose()));
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

      if (this.formControl && this.timepickerInput()) {
        this.timeInputValue = this.formatTime(this.formControl.value);
      }
    });
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
    this.previousISO = isoValue;

    if (this.formControl.value !== isoValue) {
      this.formControl.setValue(isoValue as any, {
        emitEvent: this.shouldEmitDirectly,
        emitModelToViewChange: this.shouldEmitDirectly,
        emitViewToModelChange: this.shouldEmitDirectly
      });
      this.value.set(isoValue as any);
    }

    if (this.timepickerInput() && !this.timeInputValue && isoValue) {
      this.timeInputValue = this.dateAdapter.format(isoValue as any, APP_TIME_FORMATS.display.timeInput);
    }

    const dateValue = isoValue ? new Date(isoValue) : null;
    const min = this.min();
    const max = this.max();
    const minOk = !min || !dateValue || this.dateAdapter.compareTime(min, dateValue) <= 0;
    const maxOk = !max || !dateValue || this.dateAdapter.compareTime(max, dateValue) >= 0;

    if (minOk && maxOk) {
      // ExpressionChangedError vermeiden, indem die Änderung des ValueChange-Emitters in einen Timeout gepackt wird, damit sie nach der aktuellen Änderungsschleife ausgeführt wird.
      // Wenn z.B. ein Datum mit Uhrzeit von außen übergeben wird, wird das Datum intern angepasst (z.B. auf 00:00 Uhr gesetzt), damit es im Datepicker korrekt dargestellt wird. In diesem Fall würde der ValueChange-Emitter sofort erneut getriggert werden, was zu einem ExpressionChangedError führen kann, da sich der Wert während der Änderungsschleife ändert.
      setTimeout(() => {
        this.notifyFormValueChanged(isoValue);
      });
    }
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

  private valueChangesRunning = false;

  protected override initFormValueSubscription() {
    this._formValueChangeSub = this.formControl.valueChanges.subscribe((value: any) => {
      try {
        if (!this.valueChangesRunning) {
          this.valueChangesRunning = true;
          this.updateTimeValue(value);
        }
      } finally {
        this.valueChangesRunning = false;
      }
    });

    if (this.formControl.value) {
      this.updateTimeValue(this.formControl.value);
    } else if (this._initialValue !== null && this._initialValue !== undefined) {
      this.formControl.setValue(this._initialValue);
    }

    if (!!this.luxReferenceControl() && this.inForm && this.formControl.updateOn !== 'blur') {
      console.warn(ON_UPDATE_WRONG_MODE_MSG);
    }
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

    if (LuxUtil.isDate(normalized) && this.previousISO !== normalized.toISOString()) {
      this.setISOValue(normalized.toISOString());
    }
  }

  private formatTime(date: any) {
    return this.dateAdapter.format(date, APP_TIME_FORMATS.display.timeInput);
  }
}
