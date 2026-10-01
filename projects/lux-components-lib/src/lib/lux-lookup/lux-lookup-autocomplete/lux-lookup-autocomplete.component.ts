import { NgClass, NgStyle } from '@angular/common';
import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, OnInit, input, signal, viewChild } from '@angular/core';
import { ValidatorFn } from '@angular/forms';
import { MatAutocomplete, MatAutocompleteSelectedEvent, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { MatOption } from '@angular/material/core';
import { MatSuffix } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { TranslocoPipe } from '@jsverse/transloco';
import { debounceTime, distinctUntilChanged, map, startWith } from 'rxjs/operators';
import { LuxButtonComponent } from '../../lux-action/lux-button/lux-button.component';
import { LuxAriaDescribedbyDirective } from '../../lux-directives/lux-aria/lux-aria-describedby.directive';
import { LuxAriaLabelDirective } from '../../lux-directives/lux-aria/lux-aria-label.directive';
import { LuxAriaLabelledbyDirective } from '../../lux-directives/lux-aria/lux-aria-labelledby.directive';
import { LuxTagIdDirective } from '../../lux-directives/lux-tag-id/lux-tag-id.directive';
import { LuxFormControlWrapperComponent } from '../../lux-form/lux-form-control-wrapper/lux-form-control-wrapper.component';
import { LuxValidationErrors } from '../../lux-form/lux-form-model/lux-form-component-base.class';
import { provideLuxFormControl } from '../../lux-form/lux-form-model/lux-form-control-base.class';
import { LuxLookupComponent } from '../lux-lookup-model/lux-lookup-component';
import { LuxLookupTableEntry } from '../lux-lookup-model/lux-lookup-table-entry';
@Component({
  selector: 'lux-lookup-autocomplete, lux-lookup-autocomplete-ac',
  templateUrl: './lux-lookup-autocomplete.component.html',
  styleUrls: ['./lux-lookup-autocomplete.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [provideLuxFormControl(() => LuxLookupAutocompleteComponent)],
  imports: [
    LuxFormControlWrapperComponent,
    MatInput,
    MatAutocompleteTrigger,
    LuxTagIdDirective,
    LuxAriaDescribedbyDirective,
    LuxAriaLabelDirective,
    LuxAriaLabelledbyDirective,
    MatAutocomplete,
    MatOption,
    NgClass,
    NgStyle,
    MatSuffix,
    LuxButtonComponent,
    TranslocoPipe
  ]
})
export class LuxLookupAutocompleteComponent<T = LuxLookupTableEntry | null> extends LuxLookupComponent<T> implements OnInit, AfterViewInit {
  readonly luxDebounceTime = input(250);
  readonly luxMaximumDisplayed = input(50);
  readonly luxClearable = input(false);
  readonly luxClearAriaLabel = input('');

  readonly matInput = viewChild('autoCompleteInput', { read: ElementRef });
  readonly matAutocomplete = viewChild(MatAutocomplete);
  readonly matAutocompleteTrigger = viewChild(MatAutocompleteTrigger);

  readonly filtered = signal<LuxLookupTableEntry[]>([]);
  readonly entriesCount = signal(0);
  readonly latestSearchValue = signal<string | undefined>(undefined);

  /**
   * Der zuletzt verarbeitete Rohtext des Eingabefelds - siehe LuxAutocompleteComponent für die
   * ausführliche Begründung (ersetzt das _previousValue-Guard-Verhalten, das früher
   * MatAutocompleteTrigger._handleInput() über [formControl] automatisch übernahm).
   */
  private previousInputValue?: string;

  private noResultValidatorRegistered = false;

  private readonly noResultValidator: ValidatorFn = (control) => {
    const value = control.value;
    return typeof value === 'string' && value.length > 0 ? { noResult: true } : null;
  };

  override ngOnInit() {
    super.ngOnInit();

    this.subscriptions.push(
      this.formControl.valueChanges
        .pipe(
          debounceTime(this.luxDebounceTime()),
          distinctUntilChanged(),
          startWith<any>(''),
          map((value: any) => {
            const searchValue = typeof value === 'string' ? value : this.displayFn(value);
            return this.findFilteredOptions(searchValue);
          })
        )
        .subscribe((filtered: LuxLookupTableEntry[]) => {
          this.filtered.set(filtered);
        })
    );
  }

  ngAfterViewInit() {
    // Initiale Anzeige nachholen: emitValueChange() lief ggf. bereits in ngOnInit, bevor das
    // Input-Element existierte (viewChild löst matInput() erst ab hier auf).
    this.updateInputDisplayValue(this.getValue());
  }

  /**
   * Vergleicht den eingegebenen Wert mit den Display-Werten der Einträge.
   * @param filterTerm
   * @returns LuxLookupTableEntry[]
   */
  filter(filterTerm: any): LuxLookupTableEntry[] {
    return this.entries.filter((option) => {
      const compareValue = this.displayFn(option);
      return compareValue.trim().toLowerCase().indexOf(filterTerm.trim().toLowerCase()) > -1;
    });
  }

  /**
   * Bestimmt wie eingegebene Optionen dargestellt werden.
   * @param option
   * @returns string
   */
  displayFn(option: LuxLookupTableEntry | string): string {
    if (typeof option === 'string') {
      return option;
    } else if (this.isRenderPropAFunction()) {
      return (this.luxRenderProp() as (currentOption: LuxLookupTableEntry) => string)(option);
    } else if (option && typeof this.luxRenderProp() === 'string') {
      const optionElement = option as any;
      return optionElement[this.luxRenderProp() as string] ?? 'Fehler beim Auslesen (Property unbekannt)';
    } else {
      return '';
    }
  }

  /**
   * Wird beim Klick auf das Input Feld aufgerufen.
   * @param clickEvent
   */
  onClick(clickEvent: any) {
    if (!this.isReadonly() && !this.isDisabled()) {
      clickEvent.target.setSelectionRange(0, clickEvent.target.value.length);
      // Beim Klick, wenn kein Wert gesetzt ist, das Panel öffnen
      const matAutocompleteTrigger = this.matAutocompleteTrigger();
      if (!this.value() && matAutocompleteTrigger) {
        matAutocompleteTrigger._onChange('');
        matAutocompleteTrigger.openPanel();
      }
    }
  }

  /**
   * Wrapper-Klick: Fokus setzen und Panel öffnen (falls erlaubt).
   * Verwendet mousedown statt click, um Event-Bubbling nicht zu stören.
   */
  onWrapperClick(event: MouseEvent) {
    if (this.isDisabled() || this.isReadonly()) {
      return;
    }

    if (this.ignoreWrapperClick(event)) {
      return;
    }

    // Fokus auf Input
    try {
      this.matInput()?.nativeElement?.focus();
    } catch {
      // Ignorieren, falls ElementRef nicht verfügbar
    }

    // Panel nur öffnen, wenn noch nicht offen
    const matAutocompleteTrigger = this.matAutocompleteTrigger();
    if (matAutocompleteTrigger && !matAutocompleteTrigger.panelOpen) {
      matAutocompleteTrigger.openPanel();
    }
  }

  protected override setLookupData(entries: LuxLookupTableEntry[]) {
    super.setLookupData(entries);

    const searchValue = typeof this.formControl.value === 'string' ? this.formControl.value : this.displayFn(this.formControl.value as any);
    this.filtered.set(this.findFilteredOptions(searchValue));
  }

  showClearButton(): boolean {
    if (!this.luxClearable() || this.isReadonly() || this.isDisabled()) {
      return false;
    }

    const value = this.value();
    return value !== null && value !== undefined && (value as unknown) !== '';
  }

  onClearMouseDown(event: MouseEvent) {
    event.preventDefault();
    event.stopPropagation();
  }

  clearInputValue(event: Event) {
    event.preventDefault();
    event.stopPropagation();

    const inputElement = this.matInput()?.nativeElement as HTMLInputElement | undefined;

    this.markAsDirty();
    this.setValue(null as T);
    this.matAutocompleteTrigger()?.closePanel();

    try {
      inputElement?.focus({ preventScroll: true });
    } catch {
      // Ignorieren
    }
  }

  /**
   * Setzt den aktuellen Value-Wert auf den ausgewählten Wert.
   * @param MatAutocompleteSelectedEvent event
   * @param event
   */
  selected(event: MatAutocompleteSelectedEvent) {
    this.markAsDirty();
    this.setValue(event.option.value);
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
   * Wird bei jeder Eingabe im Textfeld ausgeführt und schreibt den rohen Text synchron in das
   * FormControl - das übernahm früher automatisch der ControlValueAccessor von [formControl].
   * Der previousInputValue-Guard bildet nach, dass MatAutocompleteTrigger._handleInput() den Wert
   * ebenfalls nur bei einer tatsächlichen Textänderung committet (siehe LuxAutocompleteComponent).
   */
  onInput(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    if (this.previousInputValue === value) {
      return;
    }

    this.previousInputValue = value;
    this.markAsDirty();
    this.formControl.setValue(value as T);
  }

  /**
   * Jede Wertänderung (intern wie extern) läuft hier zusammen: aktualisiert die Anzeige und prüft
   * auf einen nicht aufgelösten Rohtext (siehe LuxAutocompleteErrorStateMatcher, früher an
   * [errorStateMatcher]/NgControl gekoppelt, das ohne [formControl] nicht mehr automatisch läuft).
   *
   * Reentrancy-geschützt (emitValueChangeRunning, geerbt von LuxLookupComponent): syncNoResultValidator()
   * ruft formControl.updateValueAndValidity() OHNE {emitEvent:false} auf, was auch valueChanges
   * erneut feuert und sonst sofort wieder hierher zurückriefe (siehe LuxLookupComponent.
   * emitValueChange() für dasselbe Muster).
   */
  override emitValueChange(formValue: any) {
    if (this.emitValueChangeRunning) {
      return;
    }

    try {
      this.emitValueChangeRunning = true;
      this.syncNoResultValidator();
      this.updateInputDisplayValue(formValue);
    } finally {
      this.emitValueChangeRunning = false;
    }

    super.emitValueChange(formValue);
  }

  /**
   * @override
   * @param value
   * @param errors
   */
  override errorMessageModifier(value: any, errors: LuxValidationErrors): string | undefined {
    const msg = super.errorMessageModifier(value, errors);
    if (msg) {
      return msg;
    }

    if (errors['noResult']) {
      return this.tService.translate(`luxc.lookup-autocomplete.error_message.not_available`);
    }
    return undefined;
  }

  /**
   * Prüft auf einen nicht aufgelösten Rohtext im FormControl. Der Aufrufer (emitValueChange()) trägt
   * die Reentrancy-Absicherung für den updateValueAndValidity()-Aufruf hier.
   */
  private syncNoResultValidator() {
    if (!this.formControl) {
      return;
    }

    if (!this.noResultValidatorRegistered) {
      this.noResultValidatorRegistered = true;
      this.formControl.addValidators(this.noResultValidator);
    }

    this.formControl.updateValueAndValidity();
  }

  /**
   * Schreibt den darzustellenden Text direkt in das native Eingabeelement, analog zu dem, was
   * früher writeValue() des MatAutocompleteTrigger-ControlValueAccessor übernahm - inklusive der
   * previousInputValue-Baseline, damit die nächste Texteingabe korrekt dagegen verglichen wird
   * (siehe LuxAutocompleteComponent für die ausführliche Begründung).
   */
  private updateInputDisplayValue(newValue: any) {
    const matInput = this.matInput();
    if (!matInput || !matInput.nativeElement) {
      return;
    }

    const resolved = this.displayFn(newValue);
    const displayValue = resolved || (typeof newValue === 'string' || newValue instanceof String ? (newValue as string) : '');
    matInput.nativeElement.value = displayValue;
    this.previousInputValue = displayValue;
  }

  private ignoreWrapperClick(event: MouseEvent): boolean {
    const target = event.target as HTMLElement | null;
    if (!target) {
      return false;
    }

    return !!target.closest('mat-option, .lux-input-clear-btn-container, .lux-input-clear-btn');
  }

  private findFilteredOptions(searchValue: string): LuxLookupTableEntry[] {
    this.latestSearchValue.set(searchValue);
    let filteredValues = searchValue ? this.filter(searchValue) : this.entries ? this.entries.slice() : [];
    this.entriesCount.set(filteredValues.length);
    if (this.entriesCount() > this.luxMaximumDisplayed()) {
      filteredValues = filteredValues.splice(0, this.luxMaximumDisplayed());
    }
    return filteredValues;
  }
}
