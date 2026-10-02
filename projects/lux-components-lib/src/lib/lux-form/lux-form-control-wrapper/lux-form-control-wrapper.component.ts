import { NgClass, NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, Signal, computed, input, signal } from '@angular/core';
import { MatError, MatHint } from '@angular/material/form-field';
import { TranslocoPipe } from '@jsverse/transloco';
import { LuxAriaLabelDirective } from '../../lux-directives/lux-aria/lux-aria-label.directive';
import { LuxIconComponent } from '../../lux-icon/lux-icon/lux-icon.component';
import { LuxFormHintComponent } from '../lux-form-control/lux-form-control-subcomponents/lux-form-hint.component';
import { LuxFormLabelComponent } from '../lux-form-control/lux-form-control-subcomponents/lux-form-label.component';
import type { LuxFormControlWrapperState } from '../lux-form-model/lux-form-control-base.class';

export const luxFormControlSelektor = 'lux-form-control-wrapper';

/**
 * Die Schnittstelle, die eine FormComponent dem Wrapper bieten muss.
 *
 * Bewusst ein Interface statt einer konkreten Basisklasse: Der Wrapper bedient sowohl die neuen
 * Signal-Forms-Komponenten (LuxFormControlBase) als auch die noch nicht migrierten
 * (LuxFormComponentBase). Beide erfüllen diesen Vertrag.
 */
export interface LuxFormControlWrapperHost {
  readonly uid: Signal<string>;
  readonly luxLabel: Signal<string>;
  readonly luxHint: Signal<string>;
  readonly luxHintShowOnlyOnFocus: Signal<boolean>;
  readonly luxDense: Signal<boolean>;
  readonly errorMessage: Signal<string | undefined>;
  readonly formLabelComponent: Signal<LuxFormLabelComponent | undefined>;
  readonly formHintComponent: Signal<LuxFormHintComponent | undefined>;
  readonly wrapperState: Signal<LuxFormControlWrapperState>;
  dismissError(): void;
}

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
  /**
   * Die zugrunde liegende FormComponent
   */
  readonly luxFormComponent = input.required<LuxFormControlWrapperHost>();
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

  readonly focused = signal(false);

  /**
   * Gibt wieder, ob der Fehler für diese FormComponent dargestellt werden soll.
   */
  readonly shouldDisplayError = computed(() => this.luxFormComponent().wrapperState().showError);

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
    this.luxFormComponent().dismissError();
  }
}
