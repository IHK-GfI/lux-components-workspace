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
import { LuxFormLegacyValueBase } from '../lux-form-model/lux-form-legacy/lux-form-legacy-value-base.class';
import { provideLuxFormControl } from '../lux-form-model/lux-form-control-base.class';
import { LuxInputPrefixComponent } from '../lux-input/lux-input-subcomponents/lux-input-prefix.component';
import { LuxInputSuffixComponent } from '../lux-input/lux-input-subcomponents/lux-input-suffix.component';

@Component({
  selector: 'lux-input, lux-input-ac',
  templateUrl: './lux-input.component.html',
  styleUrls: ['./lux-input.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [provideLuxFormControl(() => LuxInputComponent)],
  imports: [
    LuxFormControlWrapperComponent,
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
export class LuxInputComponent<T = string> extends LuxFormLegacyValueBase<T> {
  readonly luxType = input('text');
  readonly luxNumberAlignLeft = input(false);
  readonly luxHideCounterLabel = input(false);
  readonly luxClearable = input(false);
  readonly luxClearAriaLabel = input('');
  readonly luxMaxLength = input(0);

  readonly inputPrefix = contentChild(LuxInputPrefixComponent);
  readonly inputSuffix = contentChild(LuxInputSuffixComponent);
  readonly inputElement = viewChild<ElementRef>('input');

  private readonly symbolRegExp = /[,.]/;
  private readonly liveAnnouncer = inject(LiveAnnouncer);
  /**
   * Der zuletzt getippte Rohtext. Nötig, weil ohne [formControl] der Wert über ein [value]-Binding
   * ins DOM zurückfliesst: Bei type="number" würde "1." beim Tippen sofort zu "1" zusammenfallen,
   * weil der geparste Wert 1 ist. Solange der Rohtext denselben Wert ergibt, bleibt er stehen.
   */
  private readonly lastRawInput = signal<string | undefined>(undefined);

  readonly isNumber = computed(() => this.luxType() === 'number');

  readonly nativeValue = computed(() => {
    const value = this.value();

    if (value === null || value === undefined) {
      return '';
    }

    if (this.isNumber()) {
      const raw = this.lastRawInput();
      if (raw !== undefined && LuxInputComponent.parseNumber(raw) === (value as unknown)) {
        return raw;
      }
    }

    return String(value);
  });

  /**
   * Zeichenzähler, der unterhalb des Feldes angezeigt wird.
   */
  readonly counterLabel = computed(() => {
    const maxLength = this.luxMaxLength();

    if (maxLength <= 0 || this.luxType() !== 'text') {
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
    const raw = (event.target as HTMLInputElement).value;
    this.lastRawInput.set(raw);
    this.value.set((this.isNumber() ? LuxInputComponent.parseNumber(raw) : raw) as T);
  }

  /**
   * Wird bei jedem Tastendruck auf dem Inputfeld aufgerufen.
   * @param keyboardEvent
   */
  onKeyDown(keyboardEvent: KeyboardEvent) {
    // Soll nur für number-Inputs greifen.
    if (!this.isNumber()) {
      return;
    }

    const inputElement = this.inputElement();
    if (inputElement) {
      const value = inputElement.nativeElement.value;
      // Doppelte Punkt-/Komma-Setzung und E's vermeiden
      if (value && this.symbolRegExp.test(keyboardEvent.key) && (value.match(this.symbolRegExp) || []).length > 0) {
        keyboardEvent.preventDefault();
      }
    }
  }

  onNativeBlur(e: FocusEvent) {
    // Markiert das Control als berührt (touch-Output im Formular, interner Zustand ohne Formular).
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

  onWrapperClick(event: MouseEvent) {
    if (this.isDisabled() || this.isReadonly()) {
      return;
    }

    if (this.ignoreWrapperClick(event)) {
      return;
    }

    this.inputElement()?.nativeElement?.focus();
  }

  showClearButton(): boolean {
    if (!this.luxClearable() || this.isReadonly() || this.isDisabled()) {
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

    this.lastRawInput.set(undefined);
    this.value.set(null as T);

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

  /** Entspricht dem Parse-Verhalten von Angulars NumberValueAccessor. */
  private static parseNumber(raw: string): number | null {
    return raw === '' ? null : parseFloat(raw);
  }
}
