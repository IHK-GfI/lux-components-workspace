import { NgClass, NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, input, signal } from '@angular/core';
import { MatError, MatHint } from '@angular/material/form-field';
import { TranslocoPipe } from '@jsverse/transloco';
import { LuxAriaLabelDirective } from '../../lux-directives/lux-aria/lux-aria-label.directive';
import { LuxIconComponent } from '../../lux-icon/lux-icon/lux-icon.component';
import { LuxFormComponentBase } from '../lux-form-model/lux-form-component-base.class';

export const luxFormControlSelektor = 'lux-form-control-wrapper';

@Component({
  selector: 'lux-form-control-wrapper',
  templateUrl: './lux-form-control-wrapper.component.html',
  host: {
    '[class.lux-form-control-no-top-label]': 'luxNoTopLabel()',
    '[class.lux-form-control-no-labels]': 'luxNoLabels()',
    '[class.lux-form-control-no-bottom-label]': 'luxNoBottomLabel()'
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgClass, NgTemplateOutlet, MatError, MatHint, LuxIconComponent, LuxAriaLabelDirective, TranslocoPipe]
})
export class LuxFormControlWrapperComponent {
  readonly focused = signal(false);

  /**
   * Die zugrunde liegende FormComponent
   */
  readonly luxFormComponent = input.required<LuxFormComponentBase>();
  readonly luxIgnoreDefaultLabel = input(false);
  readonly luxCounterLabel = input('');
  readonly luxHideCounterLabel = input(false);
  readonly luxLabelLongFormat = input(false);
  readonly luxNoInputRow = input(false);
  readonly luxDisplayClearErrorButton = input(false);

  /**
   * Dient dazu, bei einer Component den Label-Container auszublenden.
   */
  readonly luxNoTopLabel = input(false);

  /**
   * Dient dazu, bei einer Component den Label-Container und den Misc-Container auszublenden.
   */
  readonly luxNoLabels = input(false);

  /**
   * Dient dazu, bei einer Component den Misc-Container auszublenden.
   */
  readonly luxNoBottomLabel = input(false);

  /**
   * Gibt wieder, ob der Fehler für diese FormComponent dargestellt werden soll.
   */
  readonly shouldDisplayError = computed(
    () => !!this.luxFormComponent().errorMessage() && this.luxFormComponent().touched() && !this.luxFormComponent().luxReadonly()
  );

  readonly shouldDisplayMisc = computed(() => !this.luxNoBottomLabel() && !this.luxNoLabels());

  readonly shouldDisplayLabelByProperty = computed(
    () => !this.luxFormComponent().formLabelComponent() && !!this.luxFormComponent().luxLabel()
  );

  readonly shouldDisplayHintByProperty = computed(
    () => !!this.luxFormComponent().formHintComponent() && !this.luxFormComponent().luxHint()
  );

  /**
   * Aktiviert den Fokus dieser Component.
   */
  focusin() {
    this.focused.set(true);
  }

  /**
   * Deaktiviert den Fokus dieser Component.
   */
  focusout() {
    this.focused.set(false);
  }

  onCloseErrorMessage() {
    this.luxFormComponent().errorMessage.set(undefined);
    this.luxFormComponent().formControl.updateValueAndValidity();
  }
}
