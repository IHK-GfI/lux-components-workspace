import { LiveAnnouncer } from '@angular/cdk/a11y';
import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import { ChangeDetectionStrategy, Component, computed, effect, inject, input, signal, untracked } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInput } from '@angular/material/input';
import { LuxAriaDescribedbyDirective } from '../../lux-directives/lux-aria/lux-aria-describedby.directive';
import { LuxAriaLabelDirective } from '../../lux-directives/lux-aria/lux-aria-label.directive';
import { LuxAriaLabelledbyDirective } from '../../lux-directives/lux-aria/lux-aria-labelledby.directive';
import { LuxTagIdDirective } from '../../lux-directives/lux-tag-id/lux-tag-id.directive';
import { LuxFormControlWrapperComponent } from '../lux-form-control-wrapper/lux-form-control-wrapper.component';
import { LuxMaxLengthDirective } from '../lux-form-control/lux-form-directives/lux-maxlength/lux-max-length.directive';
import { LuxNameDirective } from '../lux-form-control/lux-form-directives/lux-name/lux-name-directive.directive';
import { LuxFormInputBaseClass } from '../lux-form-model/lux-form-input-base.class';

@Component({
  selector: 'lux-textarea, lux-textarea-ac',
  templateUrl: './lux-textarea.component.html',
  styleUrls: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    LuxFormControlWrapperComponent,
    FormsModule,
    ReactiveFormsModule,
    MatInput,
    CdkTextareaAutosize,
    LuxNameDirective,
    LuxMaxLengthDirective,
    LuxTagIdDirective,
    LuxAriaDescribedbyDirective,
    LuxAriaLabelDirective,
    LuxAriaLabelledbyDirective
  ]
})
export class LuxTextareaComponent<T = string> extends LuxFormInputBaseClass<T> {
  readonly luxMaxRows = input(-1);
  readonly luxMinRows = input(0);
  readonly luxHideCounterLabel = input(false);
  readonly luxMaxLength = input(0);

  readonly focused = signal(false);

  private liveAnnouncer = inject(LiveAnnouncer);

  /**
   * Zeichenzähler, der unterhalb des Feldes angezeigt wird. Basiert auf dem luxValue-Model,
   * das den FormControl-Wert spiegelt.
   */
  readonly counterLabel = computed(() => {
    const maxLength = this.luxMaxLength();

    if (maxLength <= 0) {
      return '';
    }

    const value = this.value();
    return (typeof value === 'string' ? value.length : 0) + '/' + maxLength;
  });

  readonly describedBy = computed(() => {
    if (this.errorMessage()) {
      return this.uid() + '-error';
    }

    const hasHint = !!this.formHintComponent() || !!this.luxHint();
    return hasHint && (!this.luxHintShowOnlyOnFocus() || this.focused()) ? this.uid() + '-hint' : undefined;
  });

  constructor() {
    super();

    effect(() => {
      const counterLabel = this.counterLabel();

      if (counterLabel) {
        untracked(() => this.liveAnnouncer.announce(counterLabel));
      }
    });
  }

  onFocus(e: FocusEvent) {
    this.focused.set(true);
    this.luxFocus.emit(e);
  }

  onFocusIn(e: FocusEvent) {
    this.focused.set(true);
    this.luxFocusIn.emit(e);
  }

  onFocusOut(e: FocusEvent) {
    this.focused.set(false);
    this.luxFocusOut.emit(e);
  }
}
