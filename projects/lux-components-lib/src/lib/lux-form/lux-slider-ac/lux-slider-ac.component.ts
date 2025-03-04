import { NgClass } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSlider, MatSliderThumb } from '@angular/material/slider';
import { Subscription } from 'rxjs';
import { LuxAriaDescribedbyDirective } from '../../lux-directives/lux-aria/lux-aria-describedby.directive';
import { LuxAriaInvalidDirective } from '../../lux-directives/lux-aria/lux-aria-invalid.directive';
import { LuxAriaLabelDirective } from '../../lux-directives/lux-aria/lux-aria-label.directive';
import { LuxAriaRequiredDirective } from '../../lux-directives/lux-aria/lux-aria-required.directive';
import { LuxTabIndexDirective } from '../../lux-directives/lux-tabindex/lux-tab-index.directive';
import { LuxTagIdDirective } from '../../lux-directives/lux-tag-id/lux-tag-id.directive';
import { LuxFormControlWrapperComponent } from '../lux-form-control-wrapper/lux-form-control-wrapper.component';
import { LuxFormComponentBase } from '../lux-form-model/lux-form-component-base.class';

export declare type LuxDisplayWithAcFnType = (value: number) => string;
export declare type LuxSliderAcTickInterval = 'auto' | number;
export declare type LuxSliderAcColor = 'primary' | 'accent' | 'warn';

@Component({
  selector: 'lux-slider-ac',
  templateUrl: './lux-slider-ac.component.html',
  styleUrls: ['./lux-slider-ac.component.scss'],
  imports: [
    LuxFormControlWrapperComponent,
    FormsModule,
    ReactiveFormsModule,
    MatSlider,
    MatSliderThumb,
    NgClass,
    LuxAriaLabelDirective,
    LuxAriaRequiredDirective,
    LuxAriaInvalidDirective,
    LuxAriaDescribedbyDirective,
    LuxTagIdDirective,
    LuxTabIndexDirective
  ]
})
export class LuxSliderAcComponent extends LuxFormComponentBase<number> implements OnInit, OnChanges, OnDestroy {
  @ViewChild(MatSlider) matSlider?: MatSlider;

  @Output() luxChange = new EventEmitter<number>();
  @Output() luxInput = new EventEmitter<number>();
  @Output() luxValueChange = new EventEmitter<number>();
  @Output() luxValuePercent = new EventEmitter<number>();

  @Input() luxColor: LuxSliderAcColor = 'primary';
  @Input() luxShowThumbLabel = true;
  @Input() luxTagId?: string;
  @Input() luxNoLabels = false;
  @Input() luxNoTopLabel = false;
  @Input() luxNoBottomLabel = false;

  get luxValue(): number {
    const value = this.getValue();
    return value ?? 0;
  }

  @Input() set luxValue(value: number) {
    if (!this.luxReadonly && !this.luxDisabled) {
      this.setValue(value);
    }
  }

  _luxMax = 100;
  override _luxRequired = false;
  _luxMin = 0;
  _luxStep = 1;
  _luxDisplayWith: LuxDisplayWithAcFnType = (value: number) => (value ? '' + value : '0');

  subscription?: Subscription;

  get luxDisplayWith() {
    return this._luxDisplayWith;
  }

  @Input()
  set luxDisplayWith(displayFn: LuxDisplayWithAcFnType | undefined) {
    this._luxDisplayWith = displayFn ?? ((value) => (value ? '' + value : '0'));
  }

  get luxMax() {
    return this._luxMax;
  }

  @Input() set luxMax(value: number) {
    this._luxMax = value;

    if (value > 0 && value > this.luxMin) {
      this._luxMax = value;
    }
  }

  get luxMin() {
    return this._luxMin;
  }

  @Input() set luxMin(value: number) {
    this._luxMin = value;

    if (value >= 0 && value < this.luxMax) {
      this._luxMin = value;
    }
  }

  get luxStep() {
    return this._luxStep;
  }

  @Input() set luxStep(value: number) {
    this._luxStep = value;

    if (value <= this.luxMax - this.luxMin) {
      this._luxStep = value;
    }
  }

  override get luxRequired() {
    return this._luxRequired;
  }

  @Input() override set luxRequired(value: boolean) {
    this._luxRequired = value;

    if (value) {
      this.logger.error('The LuxSlider cannot be marked as required.');
    }
  }

  override ngOnInit() {
    super.ngOnInit();

    this.subscription = this.formControl.statusChanges.subscribe((status: string) => {
      if (status === 'DISABLED') {
        this.redrawSliderWorkaround();
      }
    });
  }

  override ngOnDestroy() {
    super.ngOnDestroy();

    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  ngOnChanges(simpleChanges: SimpleChanges) {
    if (simpleChanges['luxDisabled']) {
      this.redrawSliderWorkaround();
    }
  }

  /**
   * Wird beim Ändern des Slider-Wertes aufgerufen.
   * @param value
   */
  onChange(value: number) {
    this.luxValue = value;
    this.luxChange.emit(value);
  }

  /**
   * Wird beim Bewegen des Sliders aufgerufen.
   * @param value
   */
  onInput(value: number) {
    this.luxValue = value;
    this.luxInput.emit(value);
    if (!this.formControl.touched) {
      this.formControl.markAsTouched();
    }
  }

  descripedBy() {
    if (this.errorMessage) {
      return this.uid + '-error';
    } else {
      return this.formHintComponent || this.luxHint ? this.uid + '-hint' : undefined;
    }
  }

  override notifyFormValueChanged(formValue: any) {
    if (this.luxValue < this.luxMin) {
      setTimeout(() => {
        this.luxValue = this.luxMin;
      });
    } else if (this.luxValue > this.luxMax) {
      setTimeout(() => {
        this.luxValue = this.luxMax;
      });
    } else {
      this.luxValueChange.emit(formValue);
      this.luxValuePercent.emit(((formValue - this.luxMin) * 100) / (this.luxMax - this.luxMin));
    }
  }

  /**
   * Workaround, ohne den der Slider leider nicht beim Wechsel zum disabled-State den Gab
   * um den Thumb herum zeichnet.
   */
  private redrawSliderWorkaround() {
    if (this.matSlider) {
      this.matSlider.step = this.luxStep - 1;
      setTimeout(() => {
        if (this.matSlider) {
          this.matSlider.step = this.luxStep;
        }
      });
    }
  }
}
