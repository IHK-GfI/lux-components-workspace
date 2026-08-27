import { NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, effect, input, output, untracked, viewChild } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSlider, MatSliderThumb } from '@angular/material/slider';
import { LuxAriaDescribedbyDirective } from '../../lux-directives/lux-aria/lux-aria-describedby.directive';
import { LuxAriaInvalidDirective } from '../../lux-directives/lux-aria/lux-aria-invalid.directive';
import { LuxAriaLabelDirective } from '../../lux-directives/lux-aria/lux-aria-label.directive';
import { LuxAriaLabelledbyDirective } from '../../lux-directives/lux-aria/lux-aria-labelledby.directive';
import { LuxTabIndexDirective } from '../../lux-directives/lux-tabindex/lux-tab-index.directive';
import { LuxTagIdDirective } from '../../lux-directives/lux-tag-id/lux-tag-id.directive';
import { LuxFormControlWrapperComponent } from '../lux-form-control-wrapper/lux-form-control-wrapper.component';
import { LuxFormComponentBase } from '../lux-form-model/lux-form-component-base.class';

export declare type LuxDisplayWithAcFnType = (value: number) => string;
export declare type LuxSliderAcTickInterval = 'auto' | number;
export declare type LuxSliderAcColor = 'primary' | 'accent' | 'warn';

const defaultDisplayWithFn: LuxDisplayWithAcFnType = (value: number) => (value ? '' + value : '0');

@Component({
  selector: 'lux-slider-ac',
  templateUrl: './lux-slider-ac.component.html',
  styleUrls: ['./lux-slider-ac.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    LuxFormControlWrapperComponent,
    FormsModule,
    ReactiveFormsModule,
    MatSlider,
    MatSliderThumb,
    NgClass,
    LuxAriaLabelDirective,
    LuxAriaLabelledbyDirective,
    LuxAriaInvalidDirective,
    LuxAriaDescribedbyDirective,
    LuxTagIdDirective,
    LuxTabIndexDirective
  ]
})
export class LuxSliderAcComponent extends LuxFormComponentBase<number> {
  readonly matSlider = viewChild(MatSlider);

  readonly luxChange = output<number>();
  readonly luxInput = output<number>();
  readonly luxValuePercent = output<number>();

  readonly luxColor = input<LuxSliderAcColor>('primary');
  readonly luxShowThumbLabel = input(true);
  readonly luxTagId = input<string | undefined>(undefined);
  readonly luxMax = input(100);
  readonly luxMin = input(0);
  readonly luxStep = input(1);

  readonly luxDisplayWith = input<LuxDisplayWithAcFnType, LuxDisplayWithAcFnType | undefined>(defaultDisplayWithFn, {
    transform: (displayFn) => displayFn ?? defaultDisplayWithFn
  });

  /**
   * Der von außen gesetzte Wert. Die Quelle der Wahrheit bleibt das FormControl; den aktuellen
   * Wert liefern das Signal value() bzw. getValue().
   */
  readonly luxValue = input(0);
  readonly luxValueChange = output<number>();

  readonly describedBy = computed(() => {
    if (this.errorMessage()) {
      return this.uid() + '-error';
    }

    return this.formHintComponent() || this.luxHint() ? this.uid() + '-hint' : undefined;
  });

  constructor() {
    super();

    this.syncValueInputToFormControl(this.luxValue);

    effect(() => {
      if (this.luxRequired()) {
        untracked(() => this.logger.error('The LuxSlider cannot be marked as required.'));
      }
    });

    effect(() => {
      this.luxDisabled();
      untracked(() => this.redrawSliderWorkaround());
    });
  }

  override ngOnInit() {
    // Den gebundenen Startwert übernehmen, bevor das FormControl initialisiert wird. Dadurch
    // löst der Initialwert - wie bisher - noch kein luxValueChange aus.
    this._initialValue = this.luxValue();

    super.ngOnInit();

    this.formControl.statusChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((status: string) => {
      if (status === 'DISABLED') {
        this.redrawSliderWorkaround();
      }
    });
  }

  /**
   * Wird beim Ändern des Slider-Wertes aufgerufen.
   * @param value
   */
  onChange(value: number) {
    this.setValue(value);
    this.luxChange.emit(value);
  }

  /**
   * Wird beim Bewegen des Sliders aufgerufen.
   * @param value
   */
  onInput(value: number) {
    this.setValue(value);
    this.luxInput.emit(value);
    if (!this.formControl.touched) {
      this.formControl.markAsTouched();
    }
  }

  protected override applyValueInput(value: number) {
    // Im Readonly-/Disabled-Zustand darf ein von außen gesetzter Wert nicht übernommen werden.
    if (!this.luxReadonly() && !this.luxDisabled()) {
      super.applyValueInput(value);
    }
  }

  override notifyFormValueChanged(formValue: any) {
    const min = this.luxMin();
    const max = this.luxMax();
    const value = (formValue ?? 0) as number;

    if (value < min) {
      setTimeout(() => this.setValue(min));
    } else if (value > max) {
      setTimeout(() => this.setValue(max));
    } else {
      this.luxValueChange.emit(value);
      this.luxValuePercent.emit(((value - min) * 100) / (max - min));
    }
  }

  /**
   * Workaround, ohne den der Slider leider nicht beim Wechsel zum disabled-State den Gab
   * um den Thumb herum zeichnet.
   */
  private redrawSliderWorkaround() {
    const matSlider = this.matSlider();

    if (matSlider) {
      matSlider.step = this.luxStep() - 1;
      setTimeout(() => {
        const slider = this.matSlider();
        if (slider) {
          slider.step = this.luxStep();
        }
      });
    }
  }
}
