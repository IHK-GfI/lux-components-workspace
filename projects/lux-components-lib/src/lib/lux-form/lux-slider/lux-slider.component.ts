import { NgClass } from '@angular/common';
import {
  afterRenderEffect,
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  effect,
  inject,
  input,
  output,
  untracked,
  viewChild
} from '@angular/core';
import { MatSlider, MatSliderThumb } from '@angular/material/slider';
import { LuxAriaDescribedbyDirective } from '../../lux-directives/lux-aria/lux-aria-describedby.directive';
import { LuxAriaInvalidDirective } from '../../lux-directives/lux-aria/lux-aria-invalid.directive';
import { LuxAriaLabelDirective } from '../../lux-directives/lux-aria/lux-aria-label.directive';
import { LuxAriaLabelledbyDirective } from '../../lux-directives/lux-aria/lux-aria-labelledby.directive';
import { LuxTabIndexDirective } from '../../lux-directives/lux-tabindex/lux-tab-index.directive';
import { LuxTagIdDirective } from '../../lux-directives/lux-tag-id/lux-tag-id.directive';
import { LuxFormControlWrapperComponent } from '../lux-form-control-wrapper/lux-form-control-wrapper.component';
import { provideLuxFormControl } from '../lux-form-model/lux-form-control-base.class';
import { LuxFormLegacyValueBase } from '../lux-form-model/lux-form-legacy/lux-form-legacy-value-base.class';

export declare type LuxDisplayWithFnType = (value: number) => string;
export declare type LuxSliderTickInterval = 'auto' | number;
export declare type LuxSliderColor = 'primary' | 'accent' | 'warn';

const defaultDisplayWithFn: LuxDisplayWithFnType = (value: number) => (value ? '' + value : '0');

@Component({
  selector: 'lux-slider, lux-slider-ac',
  templateUrl: './lux-slider.component.html',
  styleUrls: ['./lux-slider.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [provideLuxFormControl(() => LuxSliderComponent)],
  imports: [
    LuxFormControlWrapperComponent,
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
export class LuxSliderComponent extends LuxFormLegacyValueBase<number> {
  readonly luxColor = input<LuxSliderColor>('primary');
  readonly luxShowThumbLabel = input(true);
  readonly luxMax = input(100);
  readonly luxMin = input(0);
  readonly luxStep = input(1);

  readonly luxDisplayWith = input<LuxDisplayWithFnType, LuxDisplayWithFnType | undefined>(defaultDisplayWithFn, {
    transform: (displayFn) => displayFn ?? defaultDisplayWithFn
  });

  readonly luxChange = output<number>();
  readonly luxInput = output<number>();
  readonly luxValuePercent = output<number>();

  readonly matSlider = viewChild(MatSlider);

  private readonly destroyRef = inject(DestroyRef);
  private isDestroyed = false;
  private initialRedrawDone = false;

  constructor() {
    super();

    this.destroyRef.onDestroy(() => (this.isDestroyed = true));

    effect(() => {
      if (this.isRequired()) {
        untracked(() => this.logger.error('The LuxSlider cannot be marked as required.'));
      }
    });

    afterRenderEffect({
      mixedReadWrite: () => {
        this.isDisabled();
        untracked(() => {
          // Beim ersten Render darf der Workaround nicht laufen (Verhalten des früheren
          // Constructor-Effects, der die viewChild-Referenz zu dem Zeitpunkt noch nicht kannte).
          // Das temporäre Zurücksetzen von step würde den nativen Range-Input sonst neu
          // einrasten lassen und beim Start ein luxChange auslösen.
          if (this.initialRedrawDone) {
            this.redrawSliderWorkaround();
          } else {
            this.initialRedrawDone = true;
          }
        });
      }
    });
  }

  /**
   * Wird beim Ändern des Slider-Wertes aufgerufen.
   * @param value
   */
  onChange(value: number) {
    this.markAsDirty();
    this.value.set(value);
    this.luxChange.emit(value);
  }

  /**
   * Wird beim Bewegen des Sliders aufgerufen.
   * @param value
   */
  onInput(value: number) {
    this.markAsDirty();
    this.value.set(value);
    this.luxInput.emit(value);
    if (!this.isTouched()) {
      this.markAsTouched();
    }
  }

  override emitValueChange(value: number) {
    const min = this.luxMin();
    const max = this.luxMax();
    const numericValue = (value ?? 0) as number;

    if (numericValue < min) {
      this.clampValue(min);
    } else if (numericValue > max) {
      this.clampValue(max);
    } else {
      super.emitValueChange(numericValue);
      this.luxValuePercent.emit(((numericValue - min) * 100) / (max - min));
    }
  }

  /**
   * Korrigiert einen Wert außerhalb von [luxMin, luxMax] verzögert, damit nicht in den gerade
   * laufenden Änderungszyklus zurückgeschrieben wird. Nach dem Destroy darf nicht mehr in das
   * (ggf. weiterlebende) FormControl der Parent-FormGroup geschrieben werden.
   *
   * Bewusst this.setValue() (schreibt synchron über die Brücke in das FormControl) statt
   * this.value.set(): Letzteres bräuchte den asynchronen modelValue-Effect der Brücke, um den
   * korrigierten Wert überhaupt in das FormControl zurückzuspiegeln - ein zusätzlicher, in Tests
   * nicht zuverlässig abwartbarer Umweg.
   * @param value
   */
  private clampValue(value: number) {
    Promise.resolve().then(() => {
      if (!this.isDestroyed) {
        this.setValue(value);
      }
    });
  }

  /**
   * Workaround, ohne den der Slider leider nicht beim Wechsel zum disabled-State den Gab
   * um den Thumb herum zeichnet. Das kurzzeitige Umsetzen von step erzwingt ein Neuzeichnen.
   *
   * Der Aufruf erfolgt ausschließlich aus dem afterRenderEffect und damit erst, nachdem der
   * neue disabled-Zustand am MatSliderThumb angekommen ist. Ein zusätzliches Deferring
   * (setTimeout o. Ä.) ist deshalb nicht nötig.
   */
  private redrawSliderWorkaround() {
    const matSlider = this.matSlider();

    if (matSlider) {
      matSlider.step = this.luxStep() - 1;
      matSlider.step = this.luxStep();
    }
  }
}
