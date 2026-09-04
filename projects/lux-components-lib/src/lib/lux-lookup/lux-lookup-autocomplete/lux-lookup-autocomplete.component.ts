import { NgClass, NgStyle } from '@angular/common';
import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, OnInit, input, output, signal, viewChild } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
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
import { LuxLookupComponent } from '../lux-lookup-model/lux-lookup-component';
import { LuxLookupErrorStateMatcher } from '../lux-lookup-model/lux-lookup-error-state-matcher';
import { LuxLookupTableEntry } from '../lux-lookup-model/lux-lookup-table-entry';
import { LuxAutocompleteErrorStateMatcher } from './lux-autocomplete-error-state-matcher';
@Component({
  selector: 'lux-lookup-autocomplete, lux-lookup-autocomplete-ac',
  templateUrl: './lux-lookup-autocomplete.component.html',
  styleUrls: ['./lux-lookup-autocomplete.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    LuxFormControlWrapperComponent,
    ReactiveFormsModule,
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

  readonly luxBlur = output<FocusEvent>();
  readonly luxFocus = output<FocusEvent>();

  readonly matInput = viewChild('autoCompleteInput', { read: ElementRef });
  readonly matAutocomplete = viewChild(MatAutocomplete);
  readonly matAutocompleteTrigger = viewChild(MatAutocompleteTrigger);

  readonly filtered = signal<LuxLookupTableEntry[]>([]);
  readonly entriesCount = signal(0);
  readonly latestSearchValue = signal<string | undefined>(undefined);

  stateMatcher: LuxLookupErrorStateMatcher;

  constructor() {
    super();

    this.stateMatcher = new LuxAutocompleteErrorStateMatcher(this);
  }

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
    this.cdr.detectChanges();
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
    if (!this.luxReadonly() && !this.luxDisabled()) {
      clickEvent.target.setSelectionRange(0, clickEvent.target.value.length);
      // Beim Klick, wenn kein Wert gesetzt ist, das Panel öffnen
      const matAutocompleteTrigger = this.matAutocompleteTrigger();
      if (!this.luxValue() && matAutocompleteTrigger) {
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
    if (this.luxDisabled() || this.luxReadonly()) {
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
    if (!this.luxClearable() || this.luxReadonly() || this.luxDisabled()) {
      return false;
    }

    const value = this.inForm ? this.formControl?.value : this.luxValue();
    return value !== null && value !== undefined && value !== '';
  }

  onClearMouseDown(event: MouseEvent) {
    event.preventDefault();
    event.stopPropagation();
  }

  clearInputValue(event: Event) {
    event.preventDefault();
    event.stopPropagation();

    const inputElement = this.matInput()?.nativeElement as HTMLInputElement | undefined;

    if (this.inForm) {
      this.formControl.setValue(null as T);
    } else {
      this.setValue(null as T);
    }
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
    this.setValue(event.option.value);
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
