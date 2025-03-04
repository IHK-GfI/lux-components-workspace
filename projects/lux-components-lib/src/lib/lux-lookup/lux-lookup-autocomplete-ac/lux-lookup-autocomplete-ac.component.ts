import { NgClass, NgStyle } from '@angular/common';
import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatAutocomplete, MatAutocompleteSelectedEvent, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { MatOption } from '@angular/material/core';
import { MatInput } from '@angular/material/input';
import { debounceTime, distinctUntilChanged, map, startWith } from 'rxjs/operators';
import { LuxAriaDescribedbyDirective } from '../../lux-directives/lux-aria/lux-aria-describedby.directive';
import { LuxTagIdDirective } from '../../lux-directives/lux-tag-id/lux-tag-id.directive';
import { LuxFormControlWrapperComponent } from '../../lux-form/lux-form-control-wrapper/lux-form-control-wrapper.component';
import { LuxValidationErrors } from '../../lux-form/lux-form-model/lux-form-component-base.class';
import { LuxLookupComponent } from '../lux-lookup-model/lux-lookup-component';
import { LuxLookupErrorStateMatcher } from '../lux-lookup-model/lux-lookup-error-state-matcher';
import { LuxLookupTableEntry } from '../lux-lookup-model/lux-lookup-table-entry';
import { LuxAutocompleteErrorStateMatcherAc } from './lux-autocomplete-error-state-matcher-ac';
@Component({
  selector: 'lux-lookup-autocomplete-ac',
  templateUrl: './lux-lookup-autocomplete-ac.component.html',
  styleUrls: ['./lux-lookup-autocomplete-ac.component.scss'],
  imports: [
    LuxFormControlWrapperComponent,
    ReactiveFormsModule,
    MatInput,
    MatAutocompleteTrigger,
    LuxTagIdDirective,
    LuxAriaDescribedbyDirective,
    MatAutocomplete,
    MatOption,
    NgClass,
    NgStyle
  ]
})
export class LuxLookupAutocompleteAcComponent<T = LuxLookupTableEntry | null>
  extends LuxLookupComponent<T>
  implements OnInit, AfterViewInit
{
  filtered: LuxLookupTableEntry[] = [];
  entriesCount = 0;
  latestSearchValue?: string;
  stateMatcher: LuxLookupErrorStateMatcher;

  @Input() luxDebounceTime = 250;
  @Input() luxMaximumDisplayed = 50;
  @Input() luxNoLabels = false;
  @Input() luxNoTopLabel = false;
  @Input() luxNoBottomLabel = false;

  @Output() luxBlur = new EventEmitter<FocusEvent>();
  @Output() luxFocus = new EventEmitter<FocusEvent>();

  @ViewChild('autoCompleteInput', { read: ElementRef }) matInput!: ElementRef;
  @ViewChild(MatAutocomplete) matAutocomplete?: MatAutocomplete;
  @ViewChild(MatAutocompleteTrigger) matAutocompleteTrigger?: MatAutocompleteTrigger;

  constructor() {
    super();

    this.stateMatcher = new LuxAutocompleteErrorStateMatcherAc(this, this.entries);
  }

  ngAfterViewInit() {
    this.cdr.detectChanges();
  }

  override ngOnInit() {
    super.ngOnInit();

    this.subscriptions.push(
      this.formControl.valueChanges
        .pipe(
          debounceTime(this.luxDebounceTime),
          distinctUntilChanged(),
          startWith<any>(''),
          map((value: any) => {
            const searchValue = typeof value === 'string' ? value : this.displayFn(value);
            return this.findFilteredOptions(searchValue);
          })
        )
        .subscribe((filtered: LuxLookupTableEntry[]) => {
          this.filtered = filtered;
        })
    );
  }

  protected override setLookupData(entries: LuxLookupTableEntry[]) {
    super.setLookupData(entries);

    const searchValue = typeof this.formControl.value === 'string' ? this.formControl.value : this.displayFn(this.formControl.value as any);
    this.filtered = this.findFilteredOptions(searchValue);
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
      return (this.luxRenderProp as (currentOption: LuxLookupTableEntry) => string)(option);
    } else if (option && typeof this.luxRenderProp === 'string') {
      const optionElement = option as any;
      return optionElement[this.luxRenderProp] ?? 'Fehler beim Auslesen (Property unbekannt)';
    } else {
      return '';
    }
  }

  /**
   * Wird beim Klick auf das Input Feld aufgerufen.
   * @param clickEvent
   */
  onClick(clickEvent: any) {
    if (!this.luxReadonly && !this.luxDisabled) {
      clickEvent.target.setSelectionRange(0, clickEvent.target.value.length);
      // Beim Klick, wenn kein Wert gesetzt ist, das Panel öffnen
      if (!this.luxValue && this.matAutocompleteTrigger) {
        this.matAutocompleteTrigger._onChange('');
        this.matAutocompleteTrigger.openPanel();
      }
    }
  }

  /**
   * Setzt den aktuellen Value-Wert auf den ausgewählten Wert.
   * @param MatAutocompleteSelectedEvent event
   * @param event
   */
  selected(event: MatAutocompleteSelectedEvent) {
    this.luxValue = event.option.value;
    if (this.inForm) {
      this.formControl.setValue(this.luxValue);
    }
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
      return $localize`:@@luxc.lookup-autocomplete.error_message.not_available:Der eingegebene Eintrag ist nicht Teil der Schlüsseltabelle.`;
    }
    return undefined;
  }

  private findFilteredOptions(searchValue: string): LuxLookupTableEntry[] {
    this.latestSearchValue = searchValue;
    let filteredValues = searchValue ? this.filter(searchValue) : this.entries ? this.entries.slice() : [];
    this.entriesCount = filteredValues.length;
    if (this.entriesCount > this.luxMaximumDisplayed) {
      filteredValues = filteredValues.splice(0, this.luxMaximumDisplayed);
    }
    return filteredValues;
  }
}
