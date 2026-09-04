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
import { MatDatepicker, MatDatepickerInput, MatDatepickerToggle, MatDatepickerToggleIcon } from '@angular/material/datepicker';
import { MatInput } from '@angular/material/input';
import { LuxAriaDescribedbyDirective } from '../../lux-directives/lux-aria/lux-aria-describedby.directive';
import { LuxAriaLabelDirective } from '../../lux-directives/lux-aria/lux-aria-label.directive';
import { LuxAriaLabelledbyDirective } from '../../lux-directives/lux-aria/lux-aria-labelledby.directive';
import { LuxTagIdDirective } from '../../lux-directives/lux-tag-id/lux-tag-id.directive';
import { LuxIconComponent } from '../../lux-icon/lux-icon/lux-icon.component';
import { LuxThemeService } from '../../lux-theme/lux-theme.service';
import { LuxMediaQueryObserverService } from '../../lux-util/lux-media-query-observer.service';
import { LuxUtil } from '../../lux-util/lux-util';
import { LuxFormControlWrapperComponent } from '../lux-form-control-wrapper/lux-form-control-wrapper.component';
import { LuxValidationErrors } from '../lux-form-model/lux-form-component-base.class';
import { LuxFormInputBaseClass } from '../lux-form-model/lux-form-input-base.class';
import { LuxReferenceControl } from '../lux-form-model/lux-reference-control.interface';
import { LuxDatepickerAdapter } from './lux-datepicker-adapter';
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

export declare type LuxDateFilterFn = (date: Date | null) => boolean;
export declare type LuxStartView = 'month' | 'year' | 'multi-year';

const defaultDateFilterFn: LuxDateFilterFn = () => true;

@Component({
  selector: 'lux-datepicker, lux-datepicker-ac',
  templateUrl: './lux-datepicker.component.html',
  providers: [
    { provide: DateAdapter, useClass: LuxDatepickerAdapter, deps: [MAT_DATE_LOCALE, Platform] },
    { provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS_AC }
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    LuxIconComponent,
    LuxFormControlWrapperComponent,
    FormsModule,
    ReactiveFormsModule,
    MatInput,
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
export class LuxDatepickerComponent<T = any> extends LuxFormInputBaseClass<T> {
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

  lastValue: Date | null = null;

  readonly focused = signal(false);
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

  get shouldEmitDirectly() {
    return !!this.luxReferenceControl() && this.inForm;
  }

  private dateAdapter = inject<DateAdapter<Date>>(DateAdapter);
  private mediaObserver = inject(LuxMediaQueryObserverService);
  private themeService = inject(LuxThemeService);

  private previousISO?: string;
  private valueChangesRunning = false;

  readonly min = computed(() => this.parseDate(this.luxMinDate()));
  readonly max = computed(() => this.parseDate(this.luxMaxDate()));
  readonly start = computed(() => this.parseDate(this.luxStartDate()));

  /**
   * Auf kleinen Bildschirmen wird die TouchUI unabhängig von luxTouchUi aktiviert.
   */
  readonly touchUi = computed(() => this.luxTouchUi() || this.smallScreen());

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
      this.dateAdapter.setLocale(this.luxLocale());

      // Input-Feld neu formatieren
      if (this.formControl && this.datepickerInput()) {
        this.dateInputValue = this.formatDateTime(this.formControl.value);
      }
    });

    this.mediaObserver
      .getMediaQueryChangedAsObservable()
      .pipe(takeUntilDestroyed())
      .subscribe(() => this.smallScreen.set(this.mediaObserver.isXS() || this.mediaObserver.isSM()));

    effect(() => {
      this.luxOpened();

      // Eventuell gibt es ohne das Timeout sonst Fehler, weil der matDatepicker noch nicht gesetzt ist
      untracked(() => setTimeout(() => this.triggerOpenClose()));
    });
  }

  override ngOnInit() {
    super.ngOnInit();

    (this.dateAdapter as LuxDatepickerAdapter).referenceTimeProvider = () => {
      const referenceValue = this.luxReferenceControl()?.lastValue;
      if (referenceValue instanceof Date && LuxUtil.isDate(referenceValue)) {
        return referenceValue;
      }
      if (this.previousISO && LuxUtil.ISO_8601_FULL.test(this.previousISO)) {
        return new Date(this.previousISO);
      }
      return null;
    };
  }

  override ngOnDestroy() {
    super.ngOnDestroy();
    (this.dateAdapter as LuxDatepickerAdapter).referenceTimeProvider = null;
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
    } else if (errors['matDatepickerParse']) {
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

  // für dem Customheader für das "Green"-Theme
  getHeaderByTheme(): any {
    const customHeader = LuxDatepickerCustomHeaderComponent;
    return this.themeService.getTheme().name === 'green' ? customHeader : null;
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
    // Aktualisierungen an dem FormControl-Value sollen auch nach außen bekannt gemacht werden
    this._formValueChangeSub = this.formControl.valueChanges.subscribe((value: any) => {
      try {
        if (!this.valueChangesRunning) {
          this.valueChangesRunning = true;
          this.updateDateValue(value);
        }
      } finally {
        this.valueChangesRunning = false;
      }
    });

    if (this.formControl.value) {
      // Es kann vorkommen, dass der initiale Wert nicht im ISO-Format angegeben ist.
      // Dann muss der Wert noch umgewandelt werden.
      this.updateDateValue(this.formControl.value);
    } else if (this._initialValue !== null && this._initialValue !== undefined) {
      // Vorhandenen Initialwert setzen
      this.formControl.setValue(this._initialValue);
    }
  }

  private parseDate(value: string | null): Date | null {
    return typeof value === 'string' ? this.dateAdapter.parse(value, {}) : null;
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

  /**
   * Aktualisiert den FormControl-Value und den Wert im Parent über luxValueChange mithilfe des übergebenen ISO-Strings.
   * @param isoValue
   */
  private setISOValue(isoValue: string) {
    this.previousISO = isoValue;

    const min = this.min();
    const max = this.max();

    let minOk = true;
    if (min && isoValue && this.dateAdapter.compareDate(new Date(isoValue), min) < 0) {
      minOk = false;
    }

    let maxOk = true;
    if (max && isoValue && this.dateAdapter.compareDate(new Date(isoValue), max) > 0) {
      maxOk = false;
    }

    if (this.formControl.value !== isoValue) {
      // "silently" den FormControl auf den (potenziell) geänderten Wert aktualisieren,
      // damit die Änderung nicht erneut über valueChanges getriggert wird.
      // Damit wird auch verhindert, dass beim Tippen ins Input-Feld der Wert sofort vervollständigt wird.
      this.formControl.setValue(isoValue as any, {
        emitEvent: this.shouldEmitDirectly,
        emitModelToViewChange: this.shouldEmitDirectly,
        emitViewToModelChange: this.shouldEmitDirectly
      });
      this.value.set(isoValue as any);

      // Ohne shouldEmitDirectly feuert formControl.events NICHT, wodurch die automatische
      // markForCheck()-Kopplung in LuxFormComponentBase (ngOnInit) ausbleibt. Ohne diesen
      // manuellen Aufruf würde ngDoCheck() (und damit die Fehlermeldungs-Anzeige) bei dieser
      // OnPush-Komponente erst bei einer zufällig ausgelösten Prüfung nachziehen.
      if (!this.shouldEmitDirectly) {
        this.cdr.markForCheck();
      }
    }

    const datepickerInput = this.datepickerInput();

    // Per Hand dem Input-Element einen formatierten String übergeben
    if (datepickerInput && !datepickerInput.nativeElement.value && isoValue) {
      datepickerInput.nativeElement.value = this.dateAdapter.format(isoValue as any, APP_DATE_FORMATS_AC.display.dateInput);
    }

    // Der luxValueChange-Output wird nur anstoßen, wenn das Datum innerhalb der Grenzen (min und max) liegt.
    if (minOk && maxOk) {
      // ExpressionChangedError vermeiden, indem die Änderung in einen Timeout gepackt wird, damit sie nach der aktuellen Änderungsschleife ausgeführt wird.
      // Wenn z.B. ein Datum mit Uhrzeit von außen übergeben wird, wird das Datum intern angepasst (z.B. auf 00:00 Uhr gesetzt), damit es im Datepicker korrekt dargestellt wird. In diesem Fall würde luxValueChange sofort erneut getriggert werden, was zu einem ExpressionChangedError führen kann, da sich der Wert während der Änderungsschleife ändert.
      setTimeout(() => {
        this.notifyFormValueChanged(isoValue);
      });
    }
  }

  private updateDateValue(value: any) {
    if (!value) {
      this.setISOValue(value);
      return;
    }

    // Nachfolgend erstellen
    if (typeof value === 'string') {
      value = this.dateAdapter.parse(value, {});
    }

    if (!LuxUtil.isDate(value)) {
      return;
    }

    const eventDate: Date = value;
    const newDate = new Date(0);
    newDate.setUTCFullYear(eventDate.getUTCFullYear(), eventDate.getUTCMonth(), eventDate.getUTCDate());
    if (this.luxReferenceControl()) {
      newDate.setUTCHours(eventDate.getUTCHours(), eventDate.getUTCMinutes(), eventDate.getUTCSeconds(), 0);
    } else {
      newDate.setUTCHours(0, 0, 0, 0);
    }
    this.lastValue = newDate;

    // Sicherheitshalber noch einmal prüfen, kann vorkommen das ein unsinniger Wert eingetragen wird
    // z.B. 'asdf', das führt zu InvalidDate's
    if (LuxUtil.isDate(newDate) && this.previousISO !== newDate.toISOString()) {
      this.setISOValue(newDate.toISOString());
    }
  }

  private formatDateTime(date: any) {
    return this.dateAdapter.format(date, APP_DATE_FORMATS_AC.display.dateInput);
  }
}
