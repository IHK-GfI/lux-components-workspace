import { Directive, ElementRef, OnInit, Renderer2, effect, inject, input } from '@angular/core';
import { LuxAutocompleteComponent } from '../../lux-form/lux-autocomplete/lux-autocomplete.component';
import { LuxCheckboxComponent } from '../../lux-form/lux-checkbox/lux-checkbox.component';
import { LuxDatepickerComponent } from '../../lux-form/lux-datepicker/lux-datepicker.component';
import { LuxDatetimepickerComponent } from '../../lux-form/lux-datetimepicker/lux-datetimepicker.component';
import { LuxFormComponentBase } from '../../lux-form/lux-form-model/lux-form-component-base.class';
import { LuxFormSelectableBase } from '../../lux-form/lux-form-model/lux-form-selectable-base.class';
import { LuxInputComponent } from '../../lux-form/lux-input/lux-input.component';
import { LuxRadioComponent } from '../../lux-form/lux-radio/lux-radio.component';
import { LuxSelectComponent } from '../../lux-form/lux-select/lux-select.component';
import { LuxTimepickerComponent } from '../../lux-form/lux-timepicker/lux-timepicker.component';
import { LuxToggleComponent } from '../../lux-form/lux-toggle/lux-toggle.component';
import { LuxLookupAutocompleteComponent } from '../../lux-lookup/lux-lookup-autocomplete/lux-lookup-autocomplete.component';
import { LuxLookupComboboxComponent } from '../../lux-lookup/lux-lookup-combobox/lux-lookup-combobox.component';
import { LuxLookupComponent } from '../../lux-lookup/lux-lookup-model/lux-lookup-component';
import { LuxThemePalette } from '../../lux-util/lux-colors.enum';
import { LuxFilterItem } from './lux-filter-item';

export declare type LuxFilterRenderFnType<T = any> = (filter: LuxFilterItem<T>, value: T) => string;

@Directive({ selector: '[luxFilterItem]' })
export class LuxFilterItemDirective implements OnInit {
  readonly luxFilterLabel = input('');
  readonly luxFilterColor = input<LuxThemePalette>('primary');
  readonly luxFilterDefaultValues = input([...LuxFilterItem.DEFAULT_VALUES]);
  readonly luxFilterRenderFn = input<LuxFilterRenderFnType | undefined>(undefined);
  readonly luxFilterHidden = input(false);
  readonly luxFilterDisabled = input(false);

  inputAuthentic = inject(LuxInputComponent, { optional: true });
  autoCompleteAuthentic = inject(LuxAutocompleteComponent, { optional: true });
  autoCompleteLookupAuthentic = inject(LuxLookupAutocompleteComponent, { optional: true });
  datepickerAuthentic = inject(LuxDatepickerComponent, { optional: true });
  datetimepickerAuthentic = inject(LuxDatetimepickerComponent, { optional: true });
  timepickerAuthentic = inject(LuxTimepickerComponent, { optional: true });
  toggleAuthentic = inject(LuxToggleComponent, { optional: true });
  checkboxAuthentic = inject(LuxCheckboxComponent, { optional: true });
  selectAuthentic = inject(LuxSelectComponent, { optional: true });
  selectLookupAuthentic = inject(LuxLookupComboboxComponent, { optional: true });
  radioAuthentic = inject(LuxRadioComponent, { optional: true });
  formComponent!: LuxFormComponentBase;
  filterItem!: LuxFilterItem<any>;

  private elRef = inject(ElementRef);
  private renderer = inject(Renderer2);

  constructor() {
    if (this.inputAuthentic) {
      this.formComponent = this.inputAuthentic;
    } else if (this.datepickerAuthentic) {
      this.formComponent = this.datepickerAuthentic;
    } else if (this.datetimepickerAuthentic) {
      this.formComponent = this.datetimepickerAuthentic;
    } else if (this.timepickerAuthentic) {
      this.formComponent = this.timepickerAuthentic;
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

    // Erster (deferred) Effect-Lauf spiegelt nur den Initialzustand, den ngOnInit() bereits synchron anwendet - siehe [[feedback-effect-vs-lifecycle-timing]].
    let isFirstRun = true;
    effect(() => {
      const hidden = this.luxFilterHidden();
      const disabled = this.luxFilterDisabled();

      if (isFirstRun) {
        isFirstRun = false;
        return;
      }

      this.updateHiddenState(hidden);
      this.updateDisabledState(disabled);
    });
  }

  ngOnInit(): void {
    const controlBinding = this.formComponent.luxControlBinding();

    if (!controlBinding) {
      throw Error(`Die Formularkomponente "${this.formComponent.luxLabel()}" hat kein Binding!`);
    }

    this.filterItem = new LuxFilterItem<any>(
      this.luxFilterLabel() ? this.luxFilterLabel() : this.formComponent.luxLabel(),
      controlBinding,
      this.formComponent
    );
    this.filterItem.color = this.luxFilterColor();
    this.filterItem.defaultValues = this.luxFilterDefaultValues();
    this.filterItem.value = this.luxFilterDefaultValues()[0];
    this.filterItem.component.formControl.setValue(this.filterItem.value);
    this.filterItem.hidden = this.luxFilterHidden();
    this.filterItem.disabled = this.luxFilterDisabled();

    const luxFilterRenderFn = this.luxFilterRenderFn();
    if (luxFilterRenderFn) {
      this.filterItem.renderFn = luxFilterRenderFn;
    } else {
      if (this.filterItem.component instanceof LuxToggleComponent || this.filterItem.component instanceof LuxCheckboxComponent) {
        this.filterItem.renderFn = this.renderToggleFn;
      } else if (this.filterItem.component instanceof LuxDatepickerComponent) {
        this.filterItem.renderFn = this.renderDateAcFn;
      } else if (this.filterItem.component instanceof LuxDatetimepickerComponent) {
        this.filterItem.renderFn = this.renderDateTimeAcFn;
      } else if (this.filterItem.component instanceof LuxTimepickerComponent) {
        this.filterItem.renderFn = this.renderTimeAcFn;
      } else if (
        this.filterItem.component instanceof LuxSelectComponent ||
        this.filterItem.component instanceof LuxAutocompleteComponent ||
        this.filterItem.component instanceof LuxLookupComboboxComponent ||
        this.filterItem.component instanceof LuxLookupAutocompleteComponent ||
        this.filterItem.component instanceof LuxRadioComponent
      ) {
        this.filterItem.renderFn = this.renderLabelFn;
      } else {
        this.filterItem.renderFn = this.renderIdentityFn;
      }
    }

    this.updateHiddenState(this.luxFilterHidden());
    this.updateDisabledState(this.luxFilterDisabled());
  }

  renderLabelFn<T>(filterItem: LuxFilterItem<T>, value: T) {
    if (typeof value === 'string') {
      return value;
    } else if (
      typeof value === 'object' &&
      (filterItem.component instanceof LuxFormSelectableBase ||
        filterItem.component instanceof LuxAutocompleteComponent ||
        filterItem.component instanceof LuxRadioComponent)
    ) {
      return (value as any)[filterItem.component.luxOptionLabelProp()];
    } else if (filterItem.component instanceof LuxLookupComponent) {
      return filterItem.component.getLabel(value);
    } else {
      return value;
    }
  }

  renderDateAcFn(filterItem: LuxFilterItem, value: any) {
    return (filterItem.component as LuxDatepickerComponent).datepickerInput()?.nativeElement.value;
  }

  renderDateTimeAcFn(filterItem: LuxFilterItem, value: any) {
    return (filterItem.component as LuxDatetimepickerComponent).dateTimePickerInputEl()?.nativeElement.value;
  }

  renderTimeAcFn(filterItem: LuxFilterItem, value: any) {
    return (filterItem.component as LuxTimepickerComponent).timepickerInput()?.nativeElement.value;
  }

  renderToggleFn<T>(filterItem: LuxFilterItem<T>, value: any) {
    return value ? 'an' : 'aus';
  }

  renderIdentityFn<T>(filterItem: LuxFilterItem<T>, value: any) {
    return value;
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
}
