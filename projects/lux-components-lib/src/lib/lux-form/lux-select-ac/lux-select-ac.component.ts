import { LiveAnnouncer } from '@angular/cdk/a11y';
import { NgClass, NgTemplateOutlet } from '@angular/common';
import {
  Component,
  ContentChild,
  Input,
  OnDestroy,
  QueryList,
  TemplateRef,
  ViewChild,
  ViewChildren,
  inject
} from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatOption } from '@angular/material/core';
import { MatSelect } from '@angular/material/select';
import { LuxAriaDescribedbyDirective } from '../../lux-directives/lux-aria/lux-aria-describedby.directive';
import { LuxAriaLabelledbyDirective } from '../../lux-directives/lux-aria/lux-aria-labelledby.directive';
import { LuxTagIdDirective } from '../../lux-directives/lux-tag-id/lux-tag-id.directive';
import { LuxRenderPropertyPipe } from '../../lux-pipes/lux-render-property/lux-render-property.pipe';
import { LuxSelectFilterHelper } from '../lux-select-filter/lux-select-filter.helper';
import { LuxSelectPanelFilterComponent } from '../lux-select-filter/lux-select-panel-filter.component';
import { LuxFormControlWrapperComponent } from '../lux-form-control-wrapper/lux-form-control-wrapper.component';
import { LuxFormSelectableBase } from '../lux-form-model/lux-form-selectable-base.class';

/**
 * @param O Optionstyp (z.B Land)
 * @param V Werttyp (z.B. Land, Land[], string, string[],...)
 * @param P PickValueFn-Typ (z.B. string, number,...)
 */
@Component({
  selector: 'lux-select-ac',
  templateUrl: './lux-select-ac.component.html',
  styleUrls: ['./lux-select-ac.component.scss'],
  imports: [
    LuxFormControlWrapperComponent,
    FormsModule,
    ReactiveFormsModule,
    NgClass,
    MatSelect,
    MatOption,
    NgTemplateOutlet,
    LuxAriaDescribedbyDirective,
    LuxAriaLabelledbyDirective,
    LuxTagIdDirective,
    LuxRenderPropertyPipe,
    LuxSelectPanelFilterComponent
  ]
})
export class LuxSelectAcComponent<O = any, V = any, P = any> extends LuxFormSelectableBase<O, V, P> implements OnDestroy {
  private liveAnnouncer = inject(LiveAnnouncer);
  private filterHelper = new LuxSelectFilterHelper();
  private optionFilterCache: string[] = [];

  // Potenziell eingebettetes Template für Darstellung der Labels
  @ContentChild(TemplateRef) tempRef?: TemplateRef<any>;
  @ViewChildren(MatOption) matOptions?: QueryList<MatOption>;
  @ViewChild('select', { read: MatSelect }) matSelect?: MatSelect;
  @ViewChild(LuxSelectPanelFilterComponent) panelFilter?: LuxSelectPanelFilterComponent;

  @Input() luxPlaceholder = '';
  @Input() luxMultiple = false;
  @Input() luxEnableFilter = false;
  @Input() luxFilterPlaceholder = 'Filter';
  @Input() luxNoLabels = false;
  @Input() luxNoTopLabel = false;
  @Input() luxNoBottomLabel = false;

  displayedViewValue?: string;
  focused = false;
  filteredOptionIndexSet = new Set<number>();

  get filterValue(): string {
    return this.filterHelper.filterValue;
  }

  set filterValue(value: string) {
    this.filterHelper.filterValue = value;
  }

  override ngOnDestroy() {
    super.ngOnDestroy();
    this.filterHelper.clearFocus();
  }

  override notifyFormValueChanged(formValue: any) {
    super.notifyFormValueChanged(formValue);

    const matOption = this.matOptions?.find((option: MatOption) => option.value === formValue);
    if (matOption) {
      this.displayedViewValue = matOption.viewValue;
      this.liveAnnouncer.announce(matOption.viewValue, 'assertive');
    }
  }

  onFocusIn(e: FocusEvent) {
    this.focused = true;
    this.luxFocusIn.emit(e);
  }

  onFocusOut(e: FocusEvent) {
    this.focused = false;
    this.luxFocusOut.emit(e);
  }

  onFilterInput(value: string) {
    this.filterValue = value;
    this.refreshFilteredOptions();
  }

  onFilterKeydown(event: KeyboardEvent) {
    this.filterHelper.handleFilterKeydown(event, this.matSelect);
  }

  onOpenedChange(open: boolean) {
    if (open) {
      this.rebuildOptionFilterCache();

      if (this.luxEnableFilter) {
        this.filterHelper.focusFilterInput(this.panelFilter?.filterInput);
      }
    } else {
      this.clearFilter();
    }
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

  /**
   * Wrapper-Klick: Fokus setzen und Panel öffnen (falls erlaubt).
   * Vermeidet komplexe Template-Ausdrücke, verbessert Lesbarkeit.
   */
  onWrapperClick() {
    this.filterHelper.handleWrapperClick(this.matSelect, this.luxDisabled, this.luxReadonly);
  }

  private clearFilter() {
    this.filterHelper.clearFilter();
    this.refreshFilteredOptions();
  }

  private rebuildOptionFilterCache() {
    this.optionFilterCache = (this.luxOptions ?? []).map((option) => this.getNormalizedLabel(option));
    this.refreshFilteredOptions();
  }

  private refreshFilteredOptions() {
    const options = this.luxOptions ?? [];
    if (!this.luxEnableFilter) {
      this.filteredOptionIndexSet = this.filterHelper.buildFilteredIndexSet(options, () => '', '');
      return;
    }

    this.filteredOptionIndexSet = this.filterHelper.buildFilteredIndexSet(
      options,
      (_option, index) => this.optionFilterCache[index] ?? '',
      this.filterValue
    );
  }

  private getNormalizedLabel(option: any): string {
    if (option === null || option === undefined) {
      return '';
    }

    if (this.luxOptionLabelProp && Object.hasOwn(option, this.luxOptionLabelProp) && option[this.luxOptionLabelProp] !== undefined) {
      return ('' + option[this.luxOptionLabelProp]).toLocaleLowerCase();
    }

    return ('' + option).toLocaleLowerCase();
  }
}
