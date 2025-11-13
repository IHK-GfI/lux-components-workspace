import { LiveAnnouncer } from '@angular/cdk/a11y';
import { NgClass, NgTemplateOutlet } from '@angular/common';
import { Component, ContentChild, Input, QueryList, TemplateRef, ViewChild, ViewChildren, inject } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatOption } from '@angular/material/core';
import { MatSelect } from '@angular/material/select';
import { LuxAriaDescribedbyDirective } from '../../lux-directives/lux-aria/lux-aria-describedby.directive';
import { LuxAriaLabelledbyDirective } from '../../lux-directives/lux-aria/lux-aria-labelledby.directive';
import { LuxTagIdDirective } from '../../lux-directives/lux-tag-id/lux-tag-id.directive';
import { LuxRenderPropertyPipe } from '../../lux-pipes/lux-render-property/lux-render-property.pipe';
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
    LuxRenderPropertyPipe
  ]
})
export class LuxSelectAcComponent<O = any, V = any, P = any> extends LuxFormSelectableBase<O, V, P> {
  private liveAnnouncer = inject(LiveAnnouncer);

  // Potenziell eingebettetes Template für Darstellung der Labels
  @ContentChild(TemplateRef) tempRef?: TemplateRef<any>;
  @ViewChildren(MatOption) matOptions?: QueryList<MatOption>;
  @ViewChild('select', { read: MatSelect }) matSelect?: MatSelect;

  @Input() luxPlaceholder = '';
  @Input() luxMultiple = false;
  @Input() luxNoLabels = false;
  @Input() luxNoTopLabel = false;
  @Input() luxNoBottomLabel = false;

  displayedViewValue?: string;
  focused = false;

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
      if (!this.matSelect!.panelOpen) {
        this.matSelect!.open();
      }
    }
  }
}
