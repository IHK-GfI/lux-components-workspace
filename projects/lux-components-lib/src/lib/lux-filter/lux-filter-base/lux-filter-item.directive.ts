import { Directive, ElementRef, Input, OnChanges, OnInit, Renderer2, SimpleChanges, inject } from '@angular/core';
import { LuxAutocompleteAcComponent } from '../../lux-form/lux-autocomplete-ac/lux-autocomplete-ac.component';
import { LuxCheckboxAcComponent } from '../../lux-form/lux-checkbox-ac/lux-checkbox-ac.component';
import { LuxDatepickerAcComponent } from '../../lux-form/lux-datepicker-ac/lux-datepicker-ac.component';
import { LuxDatetimepickerAcComponent } from '../../lux-form/lux-datetimepicker-ac/lux-datetimepicker-ac.component';
import { LuxFormComponentBase } from '../../lux-form/lux-form-model/lux-form-component-base.class';
import { LuxFormSelectableBase } from '../../lux-form/lux-form-model/lux-form-selectable-base.class';
import { LuxInputAcComponent } from '../../lux-form/lux-input-ac/lux-input-ac.component';
import { LuxRadioAcComponent } from '../../lux-form/lux-radio-ac/lux-radio-ac.component';
import { LuxSelectAcComponent } from '../../lux-form/lux-select-ac/lux-select-ac.component';
import { LuxToggleAcComponent } from '../../lux-form/lux-toggle-ac/lux-toggle-ac.component';
import { LuxLookupAutocompleteAcComponent } from '../../lux-lookup/lux-lookup-autocomplete-ac/lux-lookup-autocomplete-ac.component';
import { LuxLookupComboboxAcComponent } from '../../lux-lookup/lux-lookup-combobox-ac/lux-lookup-combobox-ac.component';
import { LuxLookupComponent } from '../../lux-lookup/lux-lookup-model/lux-lookup-component';
import { LuxThemePalette } from '../../lux-util/lux-colors.enum';
import { LuxFilterItem } from './lux-filter-item';

export declare type LuxFilterRenderFnType<T = any> = (filter: LuxFilterItem<T>, value: T) => string;

@Directive({ selector: '[luxFilterItem]' })
export class LuxFilterItemDirective implements OnInit, OnChanges {
  inputAuthentic = inject(LuxInputAcComponent, { optional: true });
  autoCompleteAuthentic = inject(LuxAutocompleteAcComponent, { optional: true });
  autoCompleteLookupAuthentic = inject(LuxLookupAutocompleteAcComponent, { optional: true });
  datepickerAuthentic = inject(LuxDatepickerAcComponent, { optional: true });
  datetimepickerAuthentic = inject(LuxDatetimepickerAcComponent, { optional: true });
  toggleAuthentic = inject(LuxToggleAcComponent, { optional: true });
  checkboxAuthentic = inject(LuxCheckboxAcComponent, { optional: true });
  selectAuthentic = inject(LuxSelectAcComponent, { optional: true });
  selectLookupAuthentic = inject(LuxLookupComboboxAcComponent, { optional: true });
  radioAuthentic = inject(LuxRadioAcComponent, { optional: true });
  private elRef = inject(ElementRef);
  private renderer = inject(Renderer2);

  formComponent!: LuxFormComponentBase;
  filterItem!: LuxFilterItem<any>;

  @Input() luxFilterLabel = '';
  @Input() luxFilterColor: LuxThemePalette = undefined;
  @Input() luxFilterDefaultValues = [...LuxFilterItem.DEFAULT_VALUES];
  @Input() luxFilterRenderFn?: LuxFilterRenderFnType;
  @Input() luxFilterHidden = false;
  @Input() luxFilterDisabled = false;

  constructor() {
    if (this.inputAuthentic) {
      this.formComponent = this.inputAuthentic;
    } else if (this.datepickerAuthentic) {
      this.formComponent = this.datepickerAuthentic;
    } else if (this.datetimepickerAuthentic) {
      this.formComponent = this.datetimepickerAuthentic;
    } else if (this.toggleAuthentic) {
      this.formComponent = this.toggleAuthentic;
    } else if (this.checkboxAuthentic) {
      this.formComponent = this.checkboxAuthentic;
    } else if (this.selectAuthentic) {
      this.formComponent = this.selectAuthentic;
    } else if (this.autoCompleteAuthentic) {
      this.formComponent = this.autoCompleteAuthentic;
    } else if (this.autoCompleteLookupAuthentic) {
      this.formComponent = this.autoCompleteLookupAuthentic;
    } else if (this.selectLookupAuthentic) {
      this.formComponent = this.selectLookupAuthentic;
    } else if (this.radioAuthentic) {
      this.formComponent = this.radioAuthentic;
    } else {
      throw Error(`Die Formularkomponente ist unbekannt!`);
    }
  }

  ngOnInit(): void {
    if (!this.formComponent.luxControlBinding) {
      throw Error(`Die Formularkomponente "${this.formComponent.luxLabel}" hat kein Binding!`);
    }

    this.filterItem = new LuxFilterItem<any>(
      this.luxFilterLabel ? this.luxFilterLabel : this.formComponent.luxLabel,
      this.formComponent.luxControlBinding,
      this.formComponent
    );
    this.filterItem.color = this.luxFilterColor;
    this.filterItem.defaultValues = this.luxFilterDefaultValues;
    this.filterItem.value = this.luxFilterDefaultValues[0];
    this.filterItem.component.formControl.setValue(this.filterItem.value);
    this.filterItem.hidden = this.luxFilterHidden;
    this.filterItem.disabled = this.luxFilterDisabled;

    if (this.luxFilterRenderFn) {
      this.filterItem.renderFn = this.luxFilterRenderFn;
    } else {
      if (this.filterItem.component instanceof LuxToggleAcComponent || this.filterItem.component instanceof LuxCheckboxAcComponent) {
        this.filterItem.renderFn = this.renderToggleFn;
      } else if (this.filterItem.component instanceof LuxDatepickerAcComponent) {
        this.filterItem.renderFn = this.renderDateAcFn;
      } else if (this.filterItem.component instanceof LuxDatetimepickerAcComponent) {
        this.filterItem.renderFn = this.renderDateTimeAcFn;
      } else if (
        this.filterItem.component instanceof LuxSelectAcComponent ||
        this.filterItem.component instanceof LuxAutocompleteAcComponent ||
        this.filterItem.component instanceof LuxLookupComboboxAcComponent ||
        this.filterItem.component instanceof LuxLookupAutocompleteAcComponent ||
        this.filterItem.component instanceof LuxRadioAcComponent
      ) {
        this.filterItem.renderFn = this.renderLabelFn;
      } else {
        this.filterItem.renderFn = this.renderIdentityFn;
      }
    }

    this.updateHiddenState(this.luxFilterHidden);
    this.updateDisabledState(this.luxFilterDisabled);
  }

  private updateHiddenState(hidden: boolean) {
    if (this.filterItem) {
      // Wenn ein Filterelement ausgeblendet wird, wird es zusätzlich deaktiviert,
      // um es in der Filterkomponente leichter behandeln zu können. An die CSS-Klasse 'lux-display-none'
      // kommt man dynamisch nicht so einfach heran.
      if (hidden) {
        this.renderer.addClass(this.elRef.nativeElement, 'lux-display-none-important');
        this.filterItem.component.formControl.disable();
      } else {
        this.renderer.removeClass(this.elRef.nativeElement, 'lux-display-none-important');
        this.filterItem.component.formControl.enable();
      }
    }
  }

  private updateDisabledState(disabled: boolean) {
    if (this.filterItem) {
      if (disabled) {
        this.filterItem.component.formControl.disable();
      } else {
        this.filterItem.component.formControl.enable();
      }
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.filterItem) {
      if (this.filterItem.component && changes && changes['luxFilterHidden']) {
        this.updateHiddenState(changes['luxFilterHidden'].currentValue);
      } else if (this.filterItem.component && changes && changes['luxFilterDisabled']) {
        this.updateDisabledState(changes['luxFilterDisabled'].currentValue);
      }
    }
  }

  renderLabelFn<T>(filterItem: LuxFilterItem<T>, value: T) {
    if (typeof value === 'string') {
      return value;
    } else if (
      typeof value === 'object' &&
      (filterItem.component instanceof LuxFormSelectableBase ||
        filterItem.component instanceof LuxAutocompleteAcComponent ||
        filterItem.component instanceof LuxRadioAcComponent)
    ) {
      return (value as any)[filterItem.component.luxOptionLabelProp!];
    } else if (filterItem.component instanceof LuxLookupComponent) {
      return filterItem.component.getLabel(value);
    } else {
      return value;
    }
  }

  renderDateFn<T>(filterItem: LuxFilterItem<T>) {
    return (filterItem.component as any).datepickerInput.nativeElement.value;
  }
  renderDateAcFn(filterItem: LuxFilterItem, value: any) {
    return (filterItem.component as any).datepickerInput.nativeElement.value;
  }

  renderDateTimeFn<T>(filterItem: LuxFilterItem<T>) {
    return (filterItem.component as any).dateTimePickerInputEl.nativeElement.value;
  }
  renderDateTimeAcFn(filterItem: LuxFilterItem, value: any) {
    return (filterItem.component as LuxDatetimepickerAcComponent).dateTimePickerInputEl.nativeElement.value;
  }

  renderToggleFn<T>(filterItem: LuxFilterItem<T>, value: any) {
    return value ? 'an' : 'aus';
  }

  renderIdentityFn<T>(filterItem: LuxFilterItem<T>, value: any) {
    return value;
  }
}
