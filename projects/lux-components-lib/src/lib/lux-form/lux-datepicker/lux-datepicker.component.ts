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
import { LuxMediaQueryObserverService } from '../../lux-util/lux-media-query-observer.service';
import { LuxUtil } from '../../lux-util/lux-util';
import { LuxFormControlWrapperComponent } from '../lux-form-control-wrapper/lux-form-control-wrapper.component';
import { LuxValidationErrors } from '../lux-form-model/lux-form-component-base.class';
import { provideLuxFormControl } from '../lux-form-model/lux-form-control-base.class';
import { LuxFormLegacyValueBase } from '../lux-form-model/lux-form-legacy/lux-form-legacy-value-base.class';
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
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    { provide: DateAdapter, useClass: LuxDatepickerAdapter, deps: [MAT_DATE_LOCALE, Platform] },
    { provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS_AC },
    provideLuxFormControl(() => LuxDatepickerComponent)
  ],
  imports: [
    LuxIconComponent,
    LuxFormControlWrapperComponent,
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
export class LuxDatepickerComponent<T = any> extends LuxFormLegacyValueBase<T> implements AfterViewInit, OnDestroy {
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

  lastValue: Date | null = null;

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
  private triggerOpenCloseTimeout?: ReturnType<typeof setTimeout>;
  private notifyFormValueChangedTimeout?: ReturnType<typeof setTimeout>;
  private datepickerValidatorRegistered = false;

  readonly min = computed(() => this.parseDate(this.luxMinDate()));
  readonly max = computed(() => this.parseDate(this.luxMaxDate()));
  readonly start = computed(() => this.parseDate(this.luxStartDate()));

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
      this.dateAdapter.setLocale(this.luxLocale());

      // Input-Feld neu formatieren. formControl.value ist ein ISO-String, kein Date - vor dem
      // Formatieren erst deserialisieren (das übernahm früher unbemerkt der
      // ControlValueAccessor, der beim Neuformatieren selbst nochmal writeValue()/_formatValue()
      // mit einem bereits geparsten Date aufrief und diesen Aufruf hier faktisch überschrieb).
      if (this.formControl && this.datepickerInput()) {
        this.dateInputValue = this.formatDateTime(this.dateAdapter.deserialize(this.formControl.value));
      }
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

    // MatDatepickerInput.validate() neu auswerten, wenn sich min/max/Filter ändern - nicht nur wenn
    // sich der Wert selbst ändert (siehe syncDatepickerValidation()).
    effect(() => {
      this.min();
      this.max();
      this.luxCustomFilter();

      untracked(() => this.syncDatepickerValidation());
    });
  }

  override ngOnInit() {
    super.ngOnInit();

    if (this.formControl.value) {
      // Ein bereits vorhandener FormControl-Wert (z.B. aus einer Reactive Form) wurde von der
      // Brücke nicht automatisch verarbeitet - sie schreibt nur einen echten luxValue-Initialwert,
      // nicht einen bereits vorhandenen Fremd-Wert. Einmalige Normalisierung nachholen.
      this.updateDateValue(this.formControl.value);
    }

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

  ngAfterViewInit() {
    // Nachholende Anzeige-/Validitätssynchronisation: War der Startwert bereits über luxValue/eine
    // reale Reactive Form gesetzt, lief der Normalisierungs-Durchlauf in ngOnInit(), bevor das
    // Input-Element existierte (viewChild löst datepickerInputDirective() erst ab hier auf) - die
    // Anzeige (und die matDatepickerParse/-Min/-Max/-Filter-Validierung) blieb dadurch bislang
    // unformatiert.
    this.syncDatepickerValidation();
  }

  ngOnDestroy() {
    clearTimeout(this.notifyFormValueChangedTimeout);
    clearTimeout(this.triggerOpenCloseTimeout);
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
    this.onBlur();
    this.focused.set(false);
    this.luxFocusOut.emit(e);
  }

  onDateChange(event: MatDatepickerInputEvent<any>) {
    this.markAsDirty();
    this.processValueChange(event.value);
  }

  // für dem Customheader für das "Green"-Theme
  getHeaderByTheme(): any {
    const customHeader = LuxDatepickerCustomHeaderComponent;
    return this.themeService.getTheme().name === 'green' ? customHeader : null;
  }

  /**
   * Jede Wertänderung von außen (über [(value)]/[formField] oder ein reales FormControl) läuft
   * hier zusammen.
   */
  override emitValueChange(formValue: any) {
    this.processValueChange(formValue);
  }

  /**
   * Gemeinsamer Einstiegspunkt für onDateChange() (Nutzereingabe) und emitValueChange() (jede
   * externe Änderung) - beide teilen sich denselben valueChangesRunning-Reentrancy-Guard, damit ein
   * von updateDateValue()/setISOValue() selbst ausgelöster (normalisierter) Wert nicht rekursiv
   * erneut verarbeitet wird.
   */
  private processValueChange(value: any) {
    try {
      if (!this.valueChangesRunning) {
        this.valueChangesRunning = true;
        this.updateDateValue(value);
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
    // Getrennt von der formControl.value-Korrektur unten: Die Legacy-Bridge wendet ihren
    // valueInput-Effect (luxValue) beim allerersten Lauf immer an, auch wenn sich dessen Rohwert
    // (hier: ein noch nicht normalisiertes Datumsformat) seit dem letzten Durchlauf inhaltlich
    // nicht geändert hat - das lässt formControl.value auf den Rohwert zurückfallen. Ein erneuter
    // Durchlauf hier MUSS das korrigieren (siehe unten), darf dafür aber kein zweites
    // luxValueChange auslösen, wenn der (bereits normalisierte) ISO-Wert unverändert ist.
    const valueGenuinelyChanged = this.previousISO !== isoValue;
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
      // Signal-Schreibzugriff - markiert diese OnPush-Komponente automatisch als zu prüfen, auch
      // wenn formControl.events wegen shouldEmitDirectly=false nicht feuert (kein manuelles
      // markForCheck() mehr nötig, siehe LuxLegacyFormBridge/LuxFormControlBase).
      this.value.set(isoValue as any);
    }

    this.syncDatepickerValidation();

    // Der luxValueChange-Output wird nur anstoßen, wenn das Datum innerhalb der Grenzen (min und max)
    // liegt UND sich der normalisierte Wert tatsächlich geändert hat (siehe valueGenuinelyChanged oben).
    if (minOk && maxOk && valueGenuinelyChanged) {
      // ExpressionChangedError vermeiden, indem die Änderung in einen Timeout gepackt wird, damit sie nach der aktuellen Änderungsschleife ausgeführt wird.
      // Wenn z.B. ein Datum mit Uhrzeit von außen übergeben wird, wird das Datum intern angepasst (z.B. auf 00:00 Uhr gesetzt), damit es im Datepicker korrekt dargestellt wird. In diesem Fall würde luxValueChange sofort erneut getriggert werden, was zu einem ExpressionChangedError führen kann, da sich der Wert während der Änderungsschleife ändert.
      this.notifyFormValueChangedTimeout = setTimeout(() => {
        this.notifyFormValueChanged(isoValue as T);
      });
    }
  }

  /**
   * Registriert MatDatepickerInput.validate() (deckt matDatepickerParse/-Min/-Max/-Filter ab) als
   * regulären Validator auf dem FormControl. Ohne [formControl]/NgControl auf dem <input> komponiert
   * Angular NG_VALIDATORS nicht mehr automatisch (das war früher exakt die Funktion, die
   * formControl.setValidators() beim Binden der Reactive-Forms-Direktive übernahm).
   *
   * Bewusst als ECHTER Validator registriert statt die Fehler nur einmalig per setErrors() zu
   * setzen: Ein reines setErrors() wird vom nächsten updateValueAndValidity()-Aufruf (der die
   * REGISTRIERTEN Validatoren neu auswertet) sofort wieder überschrieben/verworfen - genau das tut
   * z.B. LuxLegacyFormBridge beim Verarbeiten von luxControlValidators. Die Validator-Funktionen
   * selbst lesen ausschließlich control.value (Min/Max/Filter) bzw. den internen Parse-Status des
   * Inputs (Parse), beides unabhängig von einem ControlValueAccessor, daher funktioniert die
   * Registrierung ohne CVA unverändert.
   */
  private syncDatepickerValidation() {
    const inputDirective = this.datepickerInputDirective();
    if (!inputDirective || !this.formControl) {
      return;
    }

    if (!this.datepickerValidatorRegistered) {
      this.datepickerValidatorRegistered = true;
      this.formControl.addValidators((control) => inputDirective.validate(control));
    }

    // Synchronisiert MatDatepickerInputBase._lastValueValid (bestimmt den matDatepickerParse-Fehler)
    // sowie die Anzeige - das übernahm früher automatisch der ControlValueAccessor von [formControl]
    // (writeValue() wird von Angular immer mindestens einmal aufgerufen, auch für einen leeren
    // Initialwert; ohne diesen Aufruf bliebe _lastValueValid dauerhaft bei seinem Default false
    // stehen und ein völlig unberührtes, leeres Feld würde fälschlich als "ungültiges Datum"
    // gemeldet). writeValue() reformatiert die Anzeige NUR, wenn sich der Wert von dem
    // unterscheidet, den die Direktive intern bereits kennt - beim Tippen hat _onInput() das schon
    // selbst aktualisiert, sodass hier keine laufende Eingabe überschrieben wird.
    inputDirective.writeValue(this.formControl.value);

    this.formControl.updateValueAndValidity();
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
    // z.B. 'asdf', das führt zu InvalidDate's.
    //
    // Bewusst OHNE zusätzlichen "bereits verarbeitet"-Vergleich gegen previousISO: setISOValue()
    // selbst prüft bereits gegen formControl.value (die maßgebliche Quelle) und ist dadurch
    // idempotent. Ein Vergleich hier gegen previousISO wäre zu aggressiv - die Legacy-Bridge wendet
    // z.B. luxValue erneut (mit dem noch unnormalisierten Rohwert) an, sobald ihr eigener
    // valueInput-Effect zum ersten Mal läuft, was den FormControl-Wert wieder auf den unnormierten
    // String zurückfallen lassen könnte; nur der erneute setISOValue()-Durchlauf korrigiert das.
    if (LuxUtil.isDate(newDate)) {
      this.setISOValue(newDate.toISOString());
    }
  }

  private formatDateTime(date: any) {
    return this.dateAdapter.format(date, APP_DATE_FORMATS_AC.display.dateInput);
  }
}
