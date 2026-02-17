import { LiveAnnouncer } from '@angular/cdk/a11y';
import { NgClass, NgTemplateOutlet } from '@angular/common';
import { Component, ContentChild, Input, OnInit, QueryList, TemplateRef, ViewChild, ViewChildren, inject } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatOption } from '@angular/material/core';
import { MatSelect } from '@angular/material/select';
import { LuxAriaDescribedbyDirective } from '../../lux-directives/lux-aria/lux-aria-describedby.directive';
import { LuxAriaLabelledbyDirective } from '../../lux-directives/lux-aria/lux-aria-labelledby.directive';
import { LuxTagIdDirective } from '../../lux-directives/lux-tag-id/lux-tag-id.directive';
import { LuxRenderPropertyPipe } from '../../lux-pipes/lux-render-property/lux-render-property.pipe';
import { LuxSelectFilterDirective } from '../lux-select-filter/lux-select-filter.directive';
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
    LuxSelectPanelFilterComponent,
    LuxSelectFilterDirective
  ]
})
export class LuxSelectAcComponent<O = any, V = any, P = any> extends LuxFormSelectableBase<O, V, P> implements OnInit {
  private liveAnnouncer = inject(LiveAnnouncer);

  // Potenziell eingebettetes Template für Darstellung der Labels
  @ContentChild(TemplateRef) tempRef?: TemplateRef<any>;
  @ViewChildren(MatOption) matOptions?: QueryList<MatOption>;
  @ViewChild('select', { read: MatSelect }) matSelect?: MatSelect;


  /**
   * Platzhalter-Text, der angezeigt wird, wenn kein Wert ausgewählt ist.
   */
  @Input() luxPlaceholder = '';

  /**
   * Aktiviert die Mehrfachauswahl (Mehrfachselektion) im Select.
   */
  @Input() luxMultiple = false;

  /**
   * Aktiviert das Filterfeld im Auswahl-Panel.
   */
  @Input() luxEnableFilter = false;

  /**
   * Platzhalter-Text, der im Filtereingabefeld angezeigt wird.
   */
  @Input() luxFilterPlaceholder = 'Filter';

  /**
   * Vorbelegter Filterwert für das Filtereingabefeld.
   */
  @Input() luxFilterValue = '';

  /**
   * ARIA-Label für die Schaltfläche zum Löschen des Filterwertes.
   */
  @Input() luxFilterClearAriaLabel = 'Clear filter';

  /**
   * Blendet alle Standard-Labels des Formularfeldes aus.
   */
  @Input() luxNoLabels = false;

  /**
   * Blendet das obere Label (z.B. Feldbezeichnung) aus.
   */
  @Input() luxNoTopLabel = false;

  /**
   * Blendet das untere Label (z.B. Fehlermeldungen/Hinweise) aus.
   */
  @Input() luxNoBottomLabel = false;

  displayedViewValue?: string;
  focused = false;

  /**
   * Indizes in der Reihenfolge, wie die Optionen gerendert werden sollen.
   * Selektierte Optionen werden nach oben sortiert.
   */
  renderOptionIndexes: number[] = [];

  /**
   * Label-Extractor für Filter-Directive.
   * Wird als Arrow-Function definiert um this-Kontext zu erhalten.
   */
  filterLabelFn = (option: O, _index: number): string => {
    if (option === null || option === undefined) {
      return '';
    }

    if (this.luxOptionLabelProp && Object.hasOwn(option, this.luxOptionLabelProp) && (option as any)[this.luxOptionLabelProp] !== undefined) {
      return '' + (option as any)[this.luxOptionLabelProp];
    }

    return '' + option;
  };

  override ngOnInit() {
    super.ngOnInit();
    this.refreshRenderOptionIndexes();
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

  /**
   * Wird aufgerufen wenn das Panel geöffnet/geschlossen wird.
   * Übergibt Items an die Filter-Directive und sortiert Optionen.
   */
  onOpenedChange(open: boolean, filterDirective?: LuxSelectFilterDirective) {
    if (open) {
      // Selektierte Optionen nach oben sortieren
      this.refreshRenderOptionIndexes();
      // Items an Filter-Directive übergeben
      if (filterDirective) {
        filterDirective.setItems(this.luxOptions ?? []);
      }
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
    if (this.luxDisabled || this.luxReadonly) {
      return;
    }

    // Fokus setzen über das zugrunde liegende MatSelect
    try {
      this.matSelect?.focus();
    } catch {
      // Ignorieren, falls nicht möglich
    }

    // Panel nur öffnen, wenn noch nicht offen
    if (this.matSelect && !this.matSelect.panelOpen) {
      this.matSelect.open();
    }
  }

  /**
   * Sortiert die Optionen: selektierte zuerst, dann rest.
   * Wird beim Öffnen des Panels aufgerufen.
   */
  private refreshRenderOptionIndexes(): void {
    const options = this.luxOptions ?? [];
    const selectedIndexes: number[] = [];
    const unselectedIndexes: number[] = [];

    for (let i = 0; i < options.length; i++) {
      if (this.isOptionSelected(options[i], i)) {
        selectedIndexes.push(i);
      } else {
        unselectedIndexes.push(i);
      }
    }

    this.renderOptionIndexes = [...selectedIndexes, ...unselectedIndexes];
  }

  /**
   * Prüft ob eine Option selektiert ist.
   */
  private isOptionSelected(option: O, index: number): boolean {
    const value = this.luxPickValue ? this._luxOptionsPickValue[index] : option;
    const selected = this.luxSelected;

    if (selected === null || selected === undefined) {
      return false;
    }

    if (Array.isArray(selected)) {
      return selected.some((s) => this.compareObjects(value as any, s as any));
    }

    return this.compareObjects(value as any, selected as any);
  }
}
