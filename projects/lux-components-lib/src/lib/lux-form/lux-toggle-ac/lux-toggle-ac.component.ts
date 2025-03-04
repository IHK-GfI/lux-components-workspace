import { NgTemplateOutlet } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSlideToggle } from '@angular/material/slide-toggle';
import { LuxAriaDescribedbyDirective } from '../../lux-directives/lux-aria/lux-aria-describedby.directive';
import { LuxAriaInvalidDirective } from '../../lux-directives/lux-aria/lux-aria-invalid.directive';
import { LuxAriaRequiredDirective } from '../../lux-directives/lux-aria/lux-aria-required.directive';
import { LuxTagIdDirective } from '../../lux-directives/lux-tag-id/lux-tag-id.directive';
import { LuxFormControlWrapperComponent } from '../lux-form-control-wrapper/lux-form-control-wrapper.component';
import { LuxFormCheckableBaseClass } from '../lux-form-model/lux-form-checkable-base.class';

@Component({
  selector: 'lux-toggle-ac',
  templateUrl: './lux-toggle-ac.component.html',
  styleUrls: ['./lux-toggle-ac.component.scss'],
  imports: [
    LuxFormControlWrapperComponent,
    FormsModule,
    ReactiveFormsModule,
    MatSlideToggle,
    NgTemplateOutlet,
    LuxAriaDescribedbyDirective,
    LuxAriaRequiredDirective,
    LuxAriaInvalidDirective,
    LuxTagIdDirective
  ]
})
export class LuxToggleAcComponent<T = boolean> extends LuxFormCheckableBaseClass<T> implements OnInit {
  @Input() luxNoLabels = false;
  @Input() luxNoTopLabel = false;
  @Input() luxNoBottomLabel = false;

  focused = false;

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
}
