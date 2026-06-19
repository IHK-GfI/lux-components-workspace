import { Platform } from '@angular/cdk/platform';
import { Component, ElementRef, Input, OnChanges, OnDestroy, OnInit, SimpleChanges, ViewChild, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatInput } from '@angular/material/input';
import { MatTimepicker, MatTimepickerInput, MatTimepickerSelected, MatTimepickerToggle } from '@angular/material/timepicker';
import { LuxAriaDescribedbyDirective } from '../../lux-directives/lux-aria/lux-aria-describedby.directive';
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
    LuxTagIdDirective
  ]
})
export class LuxTimepickerComponent<T = any> extends LuxFormInputBaseClass<T> implements OnInit, OnChanges, OnDestroy {
  private dateAdapter = inject<DateAdapter<Date>>(DateAdapter);
  private previousISO?: string;

  lastValue: Date | null = null;
  min: Date | null = null;
  max: Date | null = null;
  focused = false;

  @Input() luxOpened = false;
  @Input() luxShowToggle = true;
  @Input() luxInterval: string | number | null = '30m';
  @Input() luxMinTime: string | null = null;
  @Input() luxMaxTime: string | null = null;
  @Input() luxNoLabels = false;
  @Input() luxNoTopLabel = false;
  @Input() luxNoBottomLabel = false;
  @Input() luxReferenceControl?: LuxReferenceControl;

  @ViewChild(MatTimepicker) matTimepicker?: MatTimepicker<any>;
  @ViewChild('timepickerInput', { read: ElementRef }) timepickerInput?: ElementRef;

  luxLocale = signal<string>('de-DE');

  override get luxValue(): T {
    return this.getValue();
  }

  @Input() override set luxValue(value: T) {
    this.setValue(value);
  }

  get timeInputValue() {
    return this.timepickerInput?.nativeElement.value;
  }

  set timeInputValue(newValue: string) {
    this.timepickerInput!.nativeElement.value = newValue;
  }

  get shouldEmitDirectly() {
    return !!this.luxReferenceControl && this.inForm;
  }

  constructor() {
    super();
    this.luxAutocomplete = 'off';

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

      if (this.formControl && this.timepickerInput) {
        this.timeInputValue = this.formatTime(this.formControl.value);
      }
    });
  }

  ngOnChanges(simpleChanges: SimpleChanges) {
    if (simpleChanges['luxOpened']) {
      setTimeout(() => {
        this.triggerOpenClose();
      });
    }
    if (simpleChanges['luxMaxTime']) {
      if (typeof simpleChanges['luxMaxTime'].currentValue === 'string') {
        this.max = this.dateAdapter.parse(simpleChanges['luxMaxTime'].currentValue, {});
      } else if (simpleChanges['luxMaxTime'].currentValue == null) {
        this.max = null;
      }
    }
    if (simpleChanges['luxMinTime']) {
      if (typeof simpleChanges['luxMinTime'].currentValue === 'string') {
        this.min = this.dateAdapter.parse(simpleChanges['luxMinTime'].currentValue, {});
      } else if (simpleChanges['luxMinTime'].currentValue == null) {
        this.min = null;
      }
    }
  }

  override ngOnInit() {
    super.ngOnInit();
  }

  override ngOnDestroy() {
    super.ngOnDestroy();
  }

  override errorMessageModifier(value: any, errors: LuxValidationErrors): string | undefined {
    if (errors['matTimepickerMin']) {
      return this.tService.translate('luxc.timepicker.error_message.min');
    } else if (errors['matTimepickerMax']) {
      return this.tService.translate('luxc.timepicker.error_message.max');
    } else if (errors['matTimepickerParse']) {
      return this.tService.translate('luxc.timepicker.error_message.invalid');
    } else if (errors['required']) {
      if (this.timepickerInput && this.timepickerInput.nativeElement.value) {
        return this.tService.translate('luxc.timepicker.error_message.invalid');
      } else {
        return this.tService.translate('luxc.timepicker.error_message.empty');
      }
    }

    return undefined;
  }

  onFocus(e: FocusEvent) {
    this.focused = true;
    this.luxFocus.emit(e);
  }

  onFocusIn(e: FocusEvent) {
    this.focused = true;
    this.luxFocusIn.emit(e);
  }

  onFocusOut(e: FocusEvent) {
    this.focused = false;
    this.luxFocusOut.emit(e);
  }

  onTimeOptionSelected(event: MatTimepickerSelected<Date>) {
    const referenceValue = this.luxReferenceControl?.formControl?.value;
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

    this.matTimepicker?.close();
  }

  descripedBy() {
    if (this.errorMessage) {
      return this.uid + '-error';
    }

    return (this.formHintComponent || this.luxHint) && (!this.luxHintShowOnlyOnFocus || (this.luxHintShowOnlyOnFocus && this.focused))
      ? this.uid + '-hint'
      : undefined;
  }

  private triggerOpenClose() {
    if (this.luxOpened) {
      this.matTimepicker?.open();
    } else {
      this.matTimepicker?.close();
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
    }

    if (this.timepickerInput && !this.timepickerInput.nativeElement.value && isoValue) {
      this.timepickerInput.nativeElement.value = this.dateAdapter.format(isoValue as any, APP_TIME_FORMATS.display.timeInput);
    }

    const dateValue = isoValue ? new Date(isoValue) : null;
    const minOk = !this.min || !dateValue || this.dateAdapter.compareTime(this.min, dateValue) <= 0;
    const maxOk = !this.max || !dateValue || this.dateAdapter.compareTime(this.max, dateValue) >= 0;

    if (minOk && maxOk) {
      // ExpressionChangedError vermeiden, indem die Änderung des ValueChange-Emitters in einen Timeout gepackt wird, damit sie nach der aktuellen Änderungsschleife ausgeführt wird.
      // Wenn z.B. ein Datum mit Uhrzeit von außen übergeben wird, wird das Datum intern angepasst (z.B. auf 00:00 Uhr gesetzt), damit es im Datepicker korrekt dargestellt wird. In diesem Fall würde der ValueChange-Emitter sofort erneut getriggert werden, was zu einem ExpressionChangedError führen kann, da sich der Wert während der Änderungsschleife ändert.
      setTimeout(() => {
        this.notifyFormValueChanged(isoValue);
      });
    }
  }

  protected override setValue(value: any) {
    if (value !== this.luxValue) {
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

    if (!!this.luxReferenceControl && this.inForm && this.formControl.updateOn !== 'blur') {
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
