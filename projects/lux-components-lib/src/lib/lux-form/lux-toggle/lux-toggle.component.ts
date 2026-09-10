import { NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatSlideToggle, MatSlideToggleChange } from '@angular/material/slide-toggle';
import { LuxAriaDescribedbyDirective } from '../../lux-directives/lux-aria/lux-aria-describedby.directive';
import { LuxAriaInvalidDirective } from '../../lux-directives/lux-aria/lux-aria-invalid.directive';
import { LuxAriaLabelDirective } from '../../lux-directives/lux-aria/lux-aria-label.directive';
import { LuxAriaLabelledbyDirective } from '../../lux-directives/lux-aria/lux-aria-labelledby.directive';
import { LuxAriaRequiredDirective } from '../../lux-directives/lux-aria/lux-aria-required.directive';
import { LuxTagIdDirective } from '../../lux-directives/lux-tag-id/lux-tag-id.directive';
import { LuxFormControlWrapperComponent } from '../lux-form-control-wrapper/lux-form-control-wrapper.component';
import { provideLuxFormControl } from '../lux-form-model/lux-form-control-base.class';
import { LuxFormLegacyCheckableBase } from '../lux-form-model/lux-form-legacy/lux-form-legacy-checkable-base.class';

@Component({
  selector: 'lux-toggle, lux-toggle-ac',
  templateUrl: './lux-toggle.component.html',
  styleUrls: ['./lux-toggle.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [provideLuxFormControl(() => LuxToggleComponent)],
  imports: [
    LuxFormControlWrapperComponent,
    MatSlideToggle,
    NgTemplateOutlet,
    LuxAriaDescribedbyDirective,
    LuxAriaRequiredDirective,
    LuxAriaInvalidDirective,
    LuxAriaLabelDirective,
    LuxAriaLabelledbyDirective,
    LuxTagIdDirective
  ]
})
export class LuxToggleComponent<T = boolean> extends LuxFormLegacyCheckableBase<T> {
  onToggleChange(event: MatSlideToggleChange) {
    this.markAsDirty();
    this.checked.set(event.checked);
  }

  onFocusIn(e: FocusEvent) {
    this.focused.set(true);
    this.luxFocusIn.emit(e);
  }

  onFocusOut(e: FocusEvent) {
    this.focused.set(false);
    this.luxFocusOut.emit(e);
    this.onBlur();
  }
}
