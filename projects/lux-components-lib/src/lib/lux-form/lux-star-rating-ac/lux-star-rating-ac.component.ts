import { NgClass } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LuxAriaDescribedbyDirective } from '../../lux-directives/lux-aria/lux-aria-describedby.directive';
import { LuxAriaInvalidDirective } from '../../lux-directives/lux-aria/lux-aria-invalid.directive';
import { LuxAriaRequiredDirective } from '../../lux-directives/lux-aria/lux-aria-required.directive';
import { LuxTabIndexDirective } from '../../lux-directives/lux-tabindex/lux-tab-index.directive';
import { LuxTagIdDirective } from '../../lux-directives/lux-tag-id/lux-tag-id.directive';
import { LuxIconComponent } from '../../lux-icon/lux-icon/lux-icon.component';
import { LuxFormControlWrapperComponent } from '../lux-form-control-wrapper/lux-form-control-wrapper.component';
import { LuxFormComponentBase } from '../lux-form-model/lux-form-component-base.class';

export declare type LuxStarRatingSize = 'small' | 'large';

@Component({
  selector: 'lux-star-rating-ac',
  templateUrl: './lux-star-rating-ac.component.html',
  styleUrls: ['./lux-star-rating-ac.component.scss'],
  imports: [
    LuxFormControlWrapperComponent,
    FormsModule,
    ReactiveFormsModule,
    LuxIconComponent,
    NgClass,
    LuxAriaDescribedbyDirective,
    LuxAriaRequiredDirective,
    LuxAriaInvalidDirective,
    LuxTagIdDirective,
    LuxTabIndexDirective
  ]
})
export class LuxStarRatingAcComponent extends LuxFormComponentBase<number> implements OnInit {
  @Output() luxChange = new EventEmitter<number>();

  @Input() luxMaxStars = 5;
  @Input() luxSize: LuxStarRatingSize = 'large';
  @Input() luxShowResetButton = false;
  @Input() luxTagId?: string;
  @Input() luxNoLabels = false;
  @Input() luxNoTopLabel = false;
  @Input() luxNoBottomLabel = false;

  focused = false;
  hoveredStar = 0;

  get luxValue(): number {
    const value = this.getValue();
    return value ?? 0;
  }

  @Input() set luxValue(value: number) {
    if (!this.luxReadonly && !this.luxDisabled) {
      this.setValue(value);
    }
  }

  get stars(): number[] {
    return Array.from({ length: this.luxMaxStars }, (_, i) => i + 1);
  }

  get currentRatingText(): string {
    const rating = this.luxValue;
    if (rating === 0) {
      return 'Keine Bewertung';
    } else if (rating === 1) {
      return '1 Stern';
    } else {
      return `${rating} Sterne`;
    }
  }

  isStarFilled(starNumber: number): boolean {
    const rating = this.hoveredStar > 0 ? this.hoveredStar : this.luxValue;
    return starNumber <= rating;
  }

  onStarClick(starNumber: number) {
    if (this.luxReadonly || this.luxDisabled) {
      return;
    }

    const newValue = starNumber === this.luxValue ? 0 : starNumber;
    this.luxValue = newValue;
    this.luxChange.emit(newValue);
    this.formControl.markAsTouched();
  }

  onStarHover(starNumber: number) {
    if (this.luxReadonly || this.luxDisabled) {
      return;
    }
    this.hoveredStar = starNumber;
  }

  onStarLeave() {
    this.hoveredStar = 0;
  }

  onReset() {
    if (this.luxReadonly || this.luxDisabled) {
      return;
    }

    this.luxValue = 0;
    this.luxChange.emit(0);
    this.formControl.markAsTouched();
  }

  onFocusIn(event: FocusEvent) {
    this.focused = true;
    this.luxFocusIn.emit(event);
  }

  onFocusOut(event: FocusEvent) {
    this.focused = false;
    this.luxFocusOut.emit(event);
  }

  onKeyDown(event: KeyboardEvent) {
    if (this.luxReadonly || this.luxDisabled) {
      return;
    }

    let newValue = this.luxValue;
    const maxStars = this.luxMaxStars;

    switch (event.code) {
      case 'ArrowRight':
      case 'ArrowUp':
        event.preventDefault();
        newValue = Math.min(maxStars, this.luxValue + 1);
        break;
      case 'ArrowLeft':
      case 'ArrowDown':
        event.preventDefault();
        newValue = Math.max(0, this.luxValue - 1);
        break;
      case 'Home':
        event.preventDefault();
        newValue = 1;
        break;
      case 'End':
        event.preventDefault();
        newValue = maxStars;
        break;
      case 'Digit0':
      case 'Delete':
      case 'Backspace':
        event.preventDefault();
        newValue = 0;
        break;
      case 'Digit1':
      case 'Digit2':
      case 'Digit3':
      case 'Digit4':
      case 'Digit5':
      case 'Digit6':
      case 'Digit7':
      case 'Digit8':
      case 'Digit9':
        event.preventDefault();
        const numberValue = parseInt(event.code.slice(-1));
        if (numberValue >= 1 && numberValue <= maxStars) {
          newValue = numberValue;
        }
        break;
    }

    if (newValue !== this.luxValue) {
      this.luxValue = newValue;
      this.luxChange.emit(newValue);
      this.formControl.markAsTouched();
    }
  }

  descripedBy(): string | undefined {
    if (this.errorMessage) {
      return this.uid + '-error';
    } else {
      return (this.formHintComponent || this.luxHint) && (!this.luxHintShowOnlyOnFocus || (this.luxHintShowOnlyOnFocus && this.focused))
        ? this.uid + '-hint'
        : undefined;
    }
  }

  override notifyFormValueChanged(formValue: any) {
    this.luxChange.emit(formValue);
  }
}