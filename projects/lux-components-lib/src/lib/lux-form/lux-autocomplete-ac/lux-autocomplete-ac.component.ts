import { NgTemplateOutlet } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ContentChild,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild
} from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocomplete, MatAutocompleteSelectedEvent, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { MatOption } from '@angular/material/core';
import { MatPrefix, MatSuffix } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { ReplaySubject, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged, map, startWith } from 'rxjs/operators';
import { LuxAriaDescribedbyDirective } from '../../lux-directives/lux-aria/lux-aria-describedby.directive';
import { LuxTagIdDirective } from '../../lux-directives/lux-tag-id/lux-tag-id.directive';
import { LuxRenderPropertyPipe } from '../../lux-pipes/lux-render-property/lux-render-property.pipe';
import { LuxFormControlWrapperComponent } from '../lux-form-control-wrapper/lux-form-control-wrapper.component';
import { LuxNameDirectiveDirective } from '../lux-form-control/lux-form-directives/lux-name/lux-name-directive.directive';
import { LuxFormComponentBase, LuxValidationErrors } from '../lux-form-model/lux-form-component-base.class';
import { LuxInputAcPrefixComponent } from '../lux-input-ac/lux-input-ac-subcomponents/lux-input-ac-prefix.component';
import { LuxInputAcSuffixComponent } from '../lux-input-ac/lux-input-ac-subcomponents/lux-input-ac-suffix.component';

@Component({
  selector: 'lux-autocomplete-ac',
  templateUrl: './lux-autocomplete-ac.component.html',
  styleUrls: ['./lux-autocomplete-ac.component.scss'],
  imports: [
    LuxFormControlWrapperComponent,
    FormsModule,
    ReactiveFormsModule,
    MatPrefix,
    MatInput,
    MatAutocompleteTrigger,
    LuxNameDirectiveDirective,
    MatSuffix,
    MatAutocomplete,
    MatOption,
    NgTemplateOutlet,
    LuxAriaDescribedbyDirective,
    LuxTagIdDirective,
    LuxRenderPropertyPipe
  ]
})
export class LuxAutocompleteAcComponent<V = any, O = any> extends LuxFormComponentBase<V> implements OnInit, OnDestroy, AfterViewInit {
  private selected$: ReplaySubject<any> = new ReplaySubject<any>(1);
  private subscriptions: Subscription[] = [];
  private valueChangeSubscription?: Subscription;

  filteredOptions: O[] = [];
  displayedOptions: O[] = [];
  loadingRunning = false;
  activeIndex = -1;
  focused = false;
  _luxOptions: O[] = [];
  autoFillObserver = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (this.luxStrict && mutation.attributeName === 'class') {
        const targetElement = mutation.target as HTMLElement;
        if (targetElement.classList && targetElement.classList.contains('cdk-text-field-autofilled')) {
          this.updateFormControlValue();
          this.formControl.markAsTouched();
        }
      }
    });
  });

  @Input() luxPlaceholder = '';
  @Input() luxOptionLabelProp = 'label';
  @Input() luxLookupDelay = 500;
  @Input()
  luxErrorMessageNotAnOption = $localize`:@@luxc.autocomplete.error_message.not_an_option:Der eingegebene Wert ist nicht Teil der Auswahl.`;
  @Input() luxTagId?: string;
  @Input() luxSelectAllOnClick = true;
  @Input() luxStrict = true;
  @Input() luxName?: string;
  @Input() luxPickValue?: ((selected: O | null | undefined) => V) | undefined;
  @Input() luxFilterFn?: (filterTerm: string, label: string, option: any) => boolean;
  @Input() luxPanelWidth: string | number = '';
  @Input() luxNoLabels = false;
  @Input() luxNoTopLabel = false;
  @Input() luxNoBottomLabel = false;
  @Input() luxOptionBlockSize = 500;

  @Output() luxValueChange = new EventEmitter<V | null>();
  @Output() luxOptionSelected = new EventEmitter<V | null>();
  @Output() luxBlur = new EventEmitter<FocusEvent>();
  @Output() luxFocus = new EventEmitter<FocusEvent>();

  @ContentChild(LuxInputAcPrefixComponent) inputPrefix?: LuxInputAcPrefixComponent;
  @ContentChild(LuxInputAcSuffixComponent) inputSuffix?: LuxInputAcSuffixComponent;

  @ViewChild('autoCompleteInput', { read: MatAutocompleteTrigger }) matAutoComplete!: MatAutocompleteTrigger;
  @ViewChild('autoCompleteInput', { read: ElementRef }) matInput!: ElementRef;
  @ViewChild(MatAutocomplete) matAutocompleteComponent!: MatAutocomplete;

  get luxValue(): V {
    return this.getValue();
  }

  @Input() set luxValue(value: V) {
    if (value instanceof Object && !!this.luxPickValue) {
      this.setValue(this.luxPickValue(value as any));
    } else {
      this.setValue(value);
    }
  }

  get luxOptions(): O[] {
    return this._luxOptions;
  }

  @Input()
  set luxOptions(options: O[]) {
    this._luxOptions = options ? options : [];

    if (this.formControl) {
      this.updateFilterOptions();
      this.registerNewValueChangesListener();
    }
  }

  override ngOnInit() {
    super.ngOnInit();

    this.subscriptions.push(
      this.selected$.pipe(distinctUntilChanged()).subscribe((value) => {
        if (this.luxStrict) {
          if (value === '' || value === null || value === undefined) {
            this.luxOptionSelected.emit(null);
            this.luxValueChange.emit(null);
          } else {
            const selectedOption = this.getPickValueOption(value);

            let selected: V | null;
            if (selectedOption instanceof Object && !!this.luxPickValue) {
              selected = this.luxPickValue(selectedOption);
            } else {
              selected = selectedOption as any;
            }

            if (selected) {
              this.luxOptionSelected.emit(selected);
              this.luxValueChange.emit(selected);
            }
          }
        } else {
          this.luxOptionSelected.emit(value);
          this.luxValueChange.emit(value);
        }
      })
    );
  }

  override ngOnDestroy() {
    super.ngOnDestroy();

    this.subscriptions.forEach((sub) => sub.unsubscribe());
    this.valueChangeSubscription?.unsubscribe();

    try {
      this.autoFillObserver.disconnect();
    } catch (error) {
      // Nothing to do
    }
  }

  ngAfterViewInit() {
    this.subscriptions.push(
      this.matAutoComplete.panelClosingActions.pipe(debounceTime(this.luxLookupDelay)).subscribe(() => {
        this.updateFormControlValue();
      })
    );

    this.subscriptions.push(
      this.matAutocompleteComponent._keyManager.change.subscribe((index) => {
        if (this.loadingRunning && index === -1) {
          // Workaround: Bei Änderungen an den Optionen wird der Aktivindex zurückgesetzt!
          //
          // Beim Nachladen werden die Optionen verändert und der Aktivindex
          // im KeyManager wird zurückgesetzt. D.h. der nächste Klick auf die
          // Pfeiltaste (nach unten) aktiviert nicht die nächste Option, sondern
          // die erste Option am Anfang der Liste. Aus diesem Grund wird hier
          // der letzte Aktivindex wiederhergestellt, damit der Benutzer dort
          // weitermachen kann, wo er aufgehört hat.
          //
          // Siehe: _MatAutocompleteTriggerBase._subscribeToClosingActions
          // this._resetActiveItem();
          setTimeout(() => {
            this.matAutocompleteComponent._keyManager.setActiveItem(this.activeIndex!);
            this.loadingRunning = false;
          });
        }
      })
    );

    this.subscriptions.push(
      this.matAutocompleteComponent.opened.subscribe(() => {
        setTimeout(() => {
          if (this.matAutocompleteComponent.panel) {
            this.matAutocompleteComponent.panel.nativeElement.addEventListener('scroll', this.loadOnScroll.bind(this));
          }
        });
      })
    );

    this.subscriptions.push(
      this.matAutocompleteComponent.closed.subscribe(() => {
        this.updateFilterOptions();
        this.matAutocompleteComponent.panel.nativeElement.removeEventListener('scroll', this.loadOnScroll);
      })
    );

    this.registerNewValueChangesListener();

    this.autoFillObserver.observe(this.matInput.nativeElement, {
      attributes: true,
      childList: false,
      characterData: false
    });
  }

  /**
   * Stößt das Nachladen von Elementen an, wenn ein bestimmter Scrollwert erreicht wurde.
   * @param event - ScrollEvent
   */
  private loadOnScroll(event: Event) {
    const position = event.target as any;
    if (position && (position.scrollTop + position.clientHeight) / position.scrollHeight > 85 / 100) {
      this.updateDisplayedEntries();
    }
  }

  /**
   * Läd den nächsten Block Daten aus den Entries nach.
   */
  updateDisplayedEntries() {
    if (this.filteredOptions.length > 0) {
      this.loadingRunning = true;
      this.activeIndex = this.matAutocompleteComponent._keyManager.activeItemIndex ?? -1;
      const start = 0;
      const end = Math.min(this.luxOptionBlockSize, this.filteredOptions.length);
      this.displayedOptions.push(...this.filteredOptions.splice(start, end));
    }
  }

  /**
   * @override
   * @param value
   * @param errors
   */
  override errorMessageModifier(value: any, errors: LuxValidationErrors): string | undefined {
    if (errors['incorrect']) {
      return this.luxErrorMessageNotAnOption;
    }
    return undefined;
  }

  /**
   * Regelt die Darstellung der gewählten Option im Normalfall.
   * (Ausnahme: Focus-Verlust)
   * @param value
   * @returns string
   */
  displayFn(value: any): string {
    let selected;
    if (this.luxStrict && !!this.luxPickValue) {
      selected = this.getPickValueOption(value);
    } else {
      selected = this.luxValue;
    }
    return this.getOptionLabel(selected);
  }

  /**
   * Filtert das Options-Array nach dem filterTerm und
   * gibt das Ergebnis als Array zurück.
   * @param filterTerm
   * @returns any[]
   */
  filter(filterTerm: any) {
    return this.luxOptions.filter((option) => {
      const filterText = filterTerm.trim().toLowerCase();
      const optionLabel = this.getOptionLabel(option).trim().toLowerCase();

      if (this.luxFilterFn) {
        return this.luxFilterFn(filterText, optionLabel, option);
      } else {
        return optionLabel.indexOf(filterText) > -1;
      }
    });
  }

  /**
   * Click-Event Handling
   * selektiert den gesamten Text im Input, wenn selectAllOnClick = true ist.
   * @param clickEvent
   */
  onClick(clickEvent: any) {
    if (this.luxSelectAllOnClick) {
      clickEvent.target.setSelectionRange(0, clickEvent.target.value.length);
    }
  }

  /**
   * Gibt den darzustellenden Wert einer Option bzw.
   * die Option selbst (wenn string) wider.
   * @param option
   * @returns any
   */
  getOptionLabel(option: any) {
    if (typeof option === 'string') {
      return option;
    } else if (!option) {
      return '';
    } else {
      return option[this.luxOptionLabelProp];
    }
  }

  selected(selectedEvent: MatAutocompleteSelectedEvent) {
    if (this.luxStrict && !!this.luxPickValue) {
      this.luxValue = this.luxPickValue(selectedEvent.option.value);
    } else {
      this.luxValue = selectedEvent.option.value;
    }
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
    this.updateFormControlValue();
    this.focused = false;
    this.luxFocusOut.emit(e);
  }

  descripedBy() {
    if (this.errorMessage) {
      return this.uid + '-error';
    } else {
      return (this.formHintComponent || this.luxHint) && (!this.luxHintShowOnlyOnFocus || (this.luxHintShowOnlyOnFocus && this.focused))
        ? this.uid + '-hint'
        : undefined;
    }
  }

  private handleErrors() {
    const errors = this.formControl ? this.formControl.errors : null;
    if (
      this.luxOptions.indexOf(this.luxStrict ? this.getPickValueOption(this.luxValue as any) : (this.luxValue as any)) > -1 ||
      (!!errors && Object.keys(errors).length > 0 && errors['required'])
    ) {
      this.handleOtherErrors(errors);
    } else {
      this.handleIncorrectError(errors);
    }
  }

  private handleOtherErrors(errors: any) {
    if (errors && errors['incorrect']) {
      delete errors['incorrect'];
    }

    this.formControl.setErrors(errors && Object.keys(errors).length !== 0 ? errors : null);
  }

  private handleIncorrectError(errors: any) {
    if (this.luxStrict && this.luxValue) {
      errors = errors ? errors : {};
      if (!errors['incorrect']) {
        errors['incorrect'] = true;
      }
      this.formControl.setErrors(errors);
    }
  }

  override notifyFormValueChanged(formValue: any) {
    let newValue;
    if (this.luxStrict) {
      newValue = formValue instanceof Object && !!this.luxPickValue ? this.luxPickValue(formValue) : formValue;
    } else {
      newValue = formValue;
    }

    this.selected$.next(newValue);

    if (this.matInput && this.matInput.nativeElement && newValue) {
      if ((typeof newValue === 'string' || newValue instanceof String) && newValue) {
        this.matInput.nativeElement.value = newValue;
      } else if (newValue[this.luxOptionLabelProp]) {
        this.matInput.nativeElement.value = newValue[this.luxOptionLabelProp];
      }
    }
  }

  private getPickValueOption(value: O): O | null {
    const pickValue = value instanceof Object && !!this.luxPickValue ? this.luxPickValue(value) : value;
    const found = this.luxOptions.find((currentOption) => {
      const pickOptionValue = currentOption instanceof Object && !!this.luxPickValue ? this.luxPickValue(currentOption) : currentOption;
      return pickValue === pickOptionValue;
    });

    return found ?? null;
  }

  private updateFilterOptions() {
    this.filteredOptions = this.filterOptions();
    this.displayedOptions = [];
    this.updateDisplayedEntries();
  }

  private registerNewValueChangesListener() {
    // Die alte Subscription entfernen.
    if (this.valueChangeSubscription) {
      this.valueChangeSubscription.unsubscribe();
    }

    // Eine neue Subscription hinzufügen.
    this.valueChangeSubscription = this.formControl.valueChanges
      .pipe(
        startWith(''),
        debounceTime(this.luxLookupDelay),
        map(() => {
          return this.filterOptions();
        })
      )
      .subscribe((result) => {
        this.filteredOptions = result;
        this.displayedOptions = [];
        this.updateDisplayedEntries();
      });
  }

  private filterOptions() {
    const filterLabel = this.matInput.nativeElement.value;
    return filterLabel ? this.filter(filterLabel) : [...this.luxOptions];
  }

  private updateFormControlValue() {
    if (this.luxStrict) {
      const filterResult = this.filter(this.matInput.nativeElement.value);

      if (filterResult.length === 1) {
        let selected;
        if (this.luxStrict && !!this.luxPickValue) {
          selected = this.luxPickValue(filterResult[0]);
        } else {
          selected = filterResult[0];
        }
        this.formControl.setValue(selected as any);
      }

      this.handleErrors();
    }
  }
}
