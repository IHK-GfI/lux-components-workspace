import { NgClass } from '@angular/common';
import {
  afterRenderEffect,
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  input,
  output,
  untracked,
  viewChild
} from '@angular/core';
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

export declare type LuxDisplayWithFnType = (value: number) => string;
export declare type LuxSliderTickInterval = 'auto' | number;
export declare type LuxSliderColor = 'primary' | 'accent' | 'warn';

const defaultDisplayWithFn: LuxDisplayWithFnType = (value: number) => (value ? '' + value : '0');

@Component({
  selector: 'lux-slider, lux-slider-ac',
  templateUrl: './lux-slider.component.html',
  styleUrls: ['./lux-slider.component.scss'],
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
export class LuxSliderComponent extends LuxFormComponentBase<number> {
  readonly luxColor = input<LuxSliderColor>('primary');
  readonly luxShowThumbLabel = input(true);
  readonly luxTagId = input<string | undefined>(undefined);
  readonly luxMax = input(100);
  readonly luxMin = input(0);
  readonly luxStep = input(1);

  readonly luxDisplayWith = input<LuxDisplayWithFnType, LuxDisplayWithFnType | undefined>(defaultDisplayWithFn, {
    transform: (displayFn) => displayFn ?? defaultDisplayWithFn
  });

  /**
   * Der von außen gesetzte Wert. Die Quelle der Wahrheit bleibt das FormControl; den aktuellen
   * Wert liefern das Signal value() bzw. getValue().
   */
  readonly luxValue = input(0);

  readonly luxChange = output<number>();
  readonly luxInput = output<number>();
  readonly luxValuePercent = output<number>();
  readonly luxValueChange = output<number>();

  readonly matSlider = viewChild(MatSlider);

  private isDestroyed = false;
  private initialRedrawDone = false;

  readonly describedBy = computed(() => {
    if (this.errorMessage()) {
      return this.uid() + '-error';
    }

    return this.formHintComponent() || this.luxHint() ? this.uid() + '-hint' : undefined;
  });

  constructor() {
    super();

    this.syncValueInputToFormControl(this.luxValue);

    this.destroyRef.onDestroy(() => (this.isDestroyed = true));

    effect(() => {
      if (this.luxRequired()) {
        untracked(() => this.logger.error('The LuxSlider cannot be marked as required.'));
      }
    });

    afterRenderEffect({
      mixedReadWrite: () => {
        this.luxDisabled();
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

  override ngOnInit() {
    // Den gebundenen Startwert übernehmen, bevor das FormControl initialisiert wird. Dadurch
    // löst der Initialwert - wie bisher - noch kein luxValueChange aus.
    this._initialValue = this.luxValue();

    super.ngOnInit();
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

  override notifyFormValueChanged(formValue: any) {
    const min = this.luxMin();
    const max = this.luxMax();
    const value = (formValue ?? 0) as number;

    if (value < min) {
      this.clampValue(min);
    } else if (value > max) {
      this.clampValue(max);
    } else {
      this.luxValueChange.emit(value);
      this.luxValuePercent.emit(((value - min) * 100) / (max - min));
    }
  }

  protected override applyValueInput(value: number) {
    // Im Readonly-/Disabled-Zustand darf ein von außen gesetzter Wert nicht übernommen werden.
    if (!this.luxReadonly() && !this.luxDisabled()) {
      super.applyValueInput(value);
    }
  }

  /**
   * Korrigiert einen Wert außerhalb von [luxMin, luxMax] verzögert, damit nicht in den gerade
   * laufenden valueChanges-Zyklus zurückgeschrieben wird. Nach dem Destroy darf nicht mehr in
   * das (ggf. weiterlebende) FormControl der Parent-FormGroup geschrieben werden.
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
