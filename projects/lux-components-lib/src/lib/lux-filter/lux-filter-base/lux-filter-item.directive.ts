import { Directive, ElementRef, OnInit, Renderer2, effect, inject, input, untracked } from '@angular/core';
import { FormControl } from '@angular/forms';
import { FormField } from '@angular/forms/signals';
import { LuxAutocompleteComponent } from '../../lux-form/lux-autocomplete/lux-autocomplete.component';
import { LuxCheckboxComponent } from '../../lux-form/lux-checkbox/lux-checkbox.component';
import { LuxDatepickerComponent } from '../../lux-form/lux-datepicker/lux-datepicker.component';
import { LuxDatetimepickerComponent } from '../../lux-form/lux-datetimepicker/lux-datetimepicker.component';
import { LuxInputComponent } from '../../lux-form/lux-input/lux-input.component';
import { LuxRadioComponent } from '../../lux-form/lux-radio/lux-radio.component';
import { LuxSelectComponent } from '../../lux-form/lux-select/lux-select.component';
import { LuxTimepickerComponent } from '../../lux-form/lux-timepicker/lux-timepicker.component';
import { LuxToggleComponent } from '../../lux-form/lux-toggle/lux-toggle.component';
import { LuxLookupAutocompleteComponent } from '../../lux-lookup/lux-lookup-autocomplete/lux-lookup-autocomplete.component';
import { LuxLookupComboboxComponent } from '../../lux-lookup/lux-lookup-combobox/lux-lookup-combobox.component';
import { LuxLookupComponent } from '../../lux-lookup/lux-lookup-model/lux-lookup-component';
import { LuxThemePalette } from '../../lux-util/lux-colors.enum';
import { LuxFilterableFormComponent, LuxFilterItem } from './lux-filter-item';

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
  formComponent!: LuxFilterableFormComponent;
  filterItem!: LuxFilterItem<any>;

  private elRef = inject(ElementRef);
  private renderer = inject(Renderer2);
  private readonly formField = inject(FormField, { optional: true, self: true });

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

      // untracked() ist zwingend: updateHiddenState()/updateDisabledState() lesen und schreiben
      // formControl.disabled, das im Signal-Forms-Betrieb selbst signalgestützt ist. Ohne untracked()
      // würde dieser Read den Effect an formControl.disabled koppeln - jeder darauf folgende
      // disable()/enable()-Aufruf (auch der eigene) würde den Effect dann erneut anstoßen und nie zur
      // Ruhe kommen (siehe Endlosschleife in der Filter-Demo, wenn luxFilterDisabled aktiviert wird).
      untracked(() => {
        this.updateHiddenState(hidden);
        this.updateDisabledState(disabled);
      });
    });
  }

  ngOnInit(): void {
    const field = this.formField?.field();
    const controlBinding = field ? String(field().keyInParent()) : this.formComponent.luxControlBinding?.();

    if (!controlBinding) {
      throw Error(`Die Formularkomponente "${this.formComponent.luxLabel()}" hat kein Binding!`);
    }

    this.filterItem = new LuxFilterItem<any>(
      this.luxFilterLabel() ? this.luxFilterLabel() : this.formComponent.luxLabel(),
      controlBinding,
      this.formComponent
    );
    this.filterItem.field = field;
    this.filterItem.color = this.luxFilterColor();
    this.filterItem.defaultValues = this.luxFilterDefaultValues();
    this.filterItem.value = this.luxFilterDefaultValues()[0];
    this.filterItem.resetValue = field && this.luxFilterDefaultValues()[0] === undefined ? field().value() : this.filterItem.value;
    this.legacyFormControl()?.setValue(this.filterItem.value);
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
      (filterItem.component instanceof LuxSelectComponent ||
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
      this.filterItem.hidden = hidden;
      // Wenn ein Filterelement ausgeblendet wird, wird es zusätzlich deaktiviert,
      // um es in der Filterkomponente leichter behandeln zu können. An die CSS-Klasse 'lux-display-none'
      // kommt man dynamisch nicht so einfach heran.
      if (hidden) {
        this.renderer.addClass(this.elRef.nativeElement, 'lux-display-none-important');

        // Nur deaktivieren, wenn nicht schon deaktiviert: Ein formControl.disable()/enable() feuert
        // IMMER statusChanges, unabhängig vom bisherigen Zustand. Die LuxLegacyFormBridge der
        // FormComponent spiegelt DISABLED/VALID/INVALID-Statuswechsel in ihr luxDisabled-Model, deren
        // eigener Effect bei einer Änderung wiederum handleFormDisabledState() aufruft - ein
        // unbedingter Aufruf hier würde also bei jedem Effect-Lauf erneut disable()/enable() auslösen
        // und nie zur Ruhe kommen (siehe Endlosschleife in der Filter-Demo).
        //
        // Im Signal-Modus gibt es kein FormControl: Wert und Chips blendet die Filter-Form über
        // filterItem.hidden aus, aus der Validierung nimmt das Schema das Feld per hidden(path, ...).
        const formControl = this.legacyFormControl();
        if (formControl && !formControl.disabled) {
          formControl.disable();
        }
      } else {
        this.renderer.removeClass(this.elRef.nativeElement, 'lux-display-none-important');

        const formControl = this.legacyFormControl();
        if (formControl && formControl.disabled) {
          formControl.enable();
        }
      }
    }
  }

  private updateDisabledState(disabled: boolean) {
    if (this.filterItem) {
      if (this.filterItem.field) {
        if (disabled) {
          throw new Error('luxFilterDisabled wird mit [formField] nicht unterstützt. Das Feld im Signal-Form-Schema deaktivieren.');
        }
        return;
      }
      // Guard aus demselben Grund wie in updateHiddenState().
      const formControl = this.legacyFormControl();
      if (disabled && formControl && !formControl.disabled) {
        formControl.disable();
      } else if (!disabled && formControl && formControl.disabled) {
        formControl.enable();
      }
    }
  }

  private legacyFormControl(): FormControl | undefined {
    return this.filterItem.field ? undefined : this.filterItem.component.formControl;
  }
}
