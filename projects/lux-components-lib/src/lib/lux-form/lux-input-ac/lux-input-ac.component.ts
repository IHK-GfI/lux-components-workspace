import { LiveAnnouncer } from '@angular/cdk/a11y';
import { NgClass } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  computed,
  contentChild,
  effect,
  inject,
  input,
  signal,
  untracked,
  viewChild
} from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatPrefix, MatSuffix } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { TranslocoPipe } from '@jsverse/transloco';
import { LuxAriaDescribedbyDirective } from '../../../lib/lux-directives/lux-aria/lux-aria-describedby.directive';
import { LuxAriaLabelDirective } from '../../../lib/lux-directives/lux-aria/lux-aria-label.directive';
import { LuxAriaLabelledbyDirective } from '../../../lib/lux-directives/lux-aria/lux-aria-labelledby.directive';
import { LuxTagIdDirective } from '../../../lib/lux-directives/lux-tag-id/lux-tag-id.directive';
import { LuxButtonComponent } from '../../lux-action/lux-button/lux-button.component';
import { LuxFormControlWrapperComponent } from '../lux-form-control-wrapper/lux-form-control-wrapper.component';
import { LuxMaxLengthDirective } from '../lux-form-control/lux-form-directives/lux-maxlength/lux-max-length.directive';
import { LuxNameDirective } from '../lux-form-control/lux-form-directives/lux-name/lux-name-directive.directive';
import { LuxFormInputBaseClass } from '../lux-form-model/lux-form-input-base.class';
import { LuxInputAcPrefixComponent } from '../lux-input-ac/lux-input-ac-subcomponents/lux-input-ac-prefix.component';
import { LuxInputAcSuffixComponent } from '../lux-input-ac/lux-input-ac-subcomponents/lux-input-ac-suffix.component';

@Component({
  selector: 'lux-input-ac',
  templateUrl: './lux-input-ac.component.html',
  styleUrls: ['./lux-input-ac.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    LuxFormControlWrapperComponent,
    FormsModule,
    ReactiveFormsModule,
    MatPrefix,
    MatInput,
    LuxNameDirective,
    LuxMaxLengthDirective,
    NgClass,
    MatSuffix,
    TranslocoPipe,
    LuxButtonComponent,
    LuxTagIdDirective,
    LuxAriaDescribedbyDirective,
    LuxAriaLabelDirective,
    LuxAriaLabelledbyDirective
  ]
})
export class LuxInputAcComponent<T = string> extends LuxFormInputBaseClass<T> {
  readonly luxType = input('text');
  readonly luxNumberAlignLeft = input(false);
  readonly luxHideCounterLabel = input(false);
  readonly luxClearable = input(false);
  readonly luxClearAriaLabel = input('');
  readonly luxMaxLength = input(0);

  readonly inputPrefix = contentChild(LuxInputAcPrefixComponent);
  readonly inputSuffix = contentChild(LuxInputAcSuffixComponent);
  readonly inputElement = viewChild<ElementRef>('input');

  readonly focused = signal(false);

  private readonly symbolRegExp = /[,.]/;

  private liveAnnouncer = inject(LiveAnnouncer);

  /**
   * Zeichenzähler, der unterhalb des Feldes angezeigt wird. Basiert auf dem luxValue-Model,
   * das den FormControl-Wert spiegelt.
   */
  readonly counterLabel = computed(() => {
    const maxLength = this.luxMaxLength();

    if (maxLength <= 0 || this.luxType() !== 'text') {
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

  /**
   * Wird bei jedem Tastendruck auf dem Inputfeld aufgerufen.
   * @param keyboardEvent
   */
  onKeyDown(keyboardEvent: KeyboardEvent) {
    // Soll nur für number-Inputs greifen
    const inputElement = this.inputElement();
    if (inputElement) {
      const value = inputElement.nativeElement.value;
      // Doppelte Punkt-/Komma-Setzung und E's vermeiden
      if (value && this.symbolRegExp.test(keyboardEvent.key) && (value.match(this.symbolRegExp) || []).length > 0) {
        keyboardEvent.preventDefault();
      }
    }
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

  onWrapperClick(event: MouseEvent) {
    if (this.luxDisabled() || this.luxReadonly()) {
      return;
    }

    if (this.ignoreWrapperClick(event)) {
      return;
    }

    this.inputElement()?.nativeElement?.focus();
  }

  showClearButton(): boolean {
    if (!this.luxClearable() || this.luxReadonly() || this.luxDisabled()) {
      return false;
    }

    const value = this.value();
    return value !== null && value !== undefined && (value as unknown) !== '';
  }

  onClearMouseDown(event: MouseEvent) {
    event.preventDefault();
    event.stopPropagation();
  }

  clearInputValue(event: Event) {
    event.preventDefault();
    event.stopPropagation();

    const inputElement = this.inputElement()?.nativeElement as HTMLInputElement | undefined;

    if (this.inForm) {
      this.formControl.setValue(null as T);
    } else {
      this.setValue(null as T);
    }

    try {
      inputElement?.focus({ preventScroll: true });
    } catch {
      // Ignorieren
    }
  }

  private ignoreWrapperClick(event: MouseEvent): boolean {
    const target = event.target as HTMLElement | null;
    if (!target) {
      return false;
    }

    return !!target.closest('.lux-input-clear-btn-container, .lux-input-clear-btn');
  }
}
