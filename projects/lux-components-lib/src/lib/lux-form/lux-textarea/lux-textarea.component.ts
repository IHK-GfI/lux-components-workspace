import { LiveAnnouncer } from '@angular/cdk/a11y';
import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import { ChangeDetectionStrategy, Component, computed, effect, inject, input, untracked } from '@angular/core';
import { MatInput } from '@angular/material/input';
import { LuxAriaDescribedbyDirective } from '../../lux-directives/lux-aria/lux-aria-describedby.directive';
import { LuxAriaLabelDirective } from '../../lux-directives/lux-aria/lux-aria-label.directive';
import { LuxAriaLabelledbyDirective } from '../../lux-directives/lux-aria/lux-aria-labelledby.directive';
import { LuxTagIdDirective } from '../../lux-directives/lux-tag-id/lux-tag-id.directive';
import { LuxFormControlWrapperComponent } from '../lux-form-control-wrapper/lux-form-control-wrapper.component';
import { LuxMaxLengthDirective } from '../lux-form-control/lux-form-directives/lux-maxlength/lux-max-length.directive';
import { LuxNameDirective } from '../lux-form-control/lux-form-directives/lux-name/lux-name-directive.directive';
import { provideLuxFormControl } from '../lux-form-model/lux-form-control-base.class';
import { LuxFormLegacyValueBase } from '../lux-form-model/lux-form-legacy/lux-form-legacy-value-base.class';

@Component({
  selector: 'lux-textarea, lux-textarea-ac',
  templateUrl: './lux-textarea.component.html',
  styleUrls: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [provideLuxFormControl(() => LuxTextareaComponent)],
  imports: [
    LuxFormControlWrapperComponent,
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
export class LuxTextareaComponent<T = string> extends LuxFormLegacyValueBase<T> {
  readonly luxMaxRows = input(-1);
  readonly luxMinRows = input(0);
  readonly luxHideCounterLabel = input(false);
  readonly luxMaxLength = input(0);

  private liveAnnouncer = inject(LiveAnnouncer);

  /**
   * Zeichenzähler, der unterhalb des Feldes angezeigt wird.
   */
  readonly counterLabel = computed(() => {
    const maxLength = this.luxMaxLength();

    if (maxLength <= 0) {
      return '';
    }

    const value = this.value();
    return (typeof value === 'string' ? value.length : 0) + '/' + maxLength;
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

  onInput(event: Event) {
    this.markAsDirty();
    this.value.set((event.target as HTMLTextAreaElement).value as T);
  }

  onNativeBlur(e: FocusEvent) {
    this.onBlur();
    this.luxBlur.emit(e);
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
