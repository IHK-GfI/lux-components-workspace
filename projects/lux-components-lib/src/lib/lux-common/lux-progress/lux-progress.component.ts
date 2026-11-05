import { NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, effect, input, signal, untracked } from '@angular/core';
import { MatProgressBar } from '@angular/material/progress-bar';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { TranslocoPipe } from '@jsverse/transloco';
import { LuxAriaLabelDirective } from '../../lux-directives/lux-aria/lux-aria-label.directive';
import { LuxCustomTagIdDirective } from '../../lux-directives/lux-tag-id/lux-custom-tag-id.directive';
import { LuxTagIdDirective } from '../../lux-directives/lux-tag-id/lux-tag-id.directive';
import { LuxProgressColor, LuxProgressColors } from '../../lux-util/lux-colors.enum';

export declare type LuxProgressModeType = 'determinate' | 'indeterminate';
export declare type LuxProgressType = 'Progressbar' | 'Spinner';
export declare type LuxProgressSizeType = 'small' | 'medium' | 'large';
export declare type LuxProgressTextPositionType = 'bottom' | 'left' | 'top';

// Entspricht BASE_STROKE_WIDTH in MatProgressSpinner (Radius = (diameter - 10) / 2).
const MAT_SPINNER_BASE_STROKE_WIDTH = 10;
// Verzögerung, damit die Live-Region erst leer im DOM steht und die Ansage als Änderung erkannt wird (analog CDK LiveAnnouncer).
const ANNOUNCE_DELAY_MS = 100;

let nextProgressId = 0;

@Component({
  selector: 'lux-progress',
  templateUrl: './lux-progress.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgClass, MatProgressBar, LuxTagIdDirective, LuxAriaLabelDirective, LuxCustomTagIdDirective, MatProgressSpinner, TranslocoPipe]
})
export class LuxProgressComponent {
  readonly DEFAULT_PROGRESS_COLOR: LuxProgressColor = 'blue';

  animDurationCSS = '';

  readonly luxValue = input(0);
  readonly luxAriaLabel = input('');
  readonly luxMuted = input(false);
  readonly luxShowText = input(false);
  readonly luxText = input<string | undefined>(undefined);
  readonly luxTextPosition = input<LuxProgressTextPositionType>('bottom');
  // Steuert die Höhe der Progressbar und den Durchmesser des Spinners.
  readonly luxSize = input<LuxProgressSizeType>('medium');
  readonly luxTagId = input<string | undefined>(undefined);

  // Ohne Binding bleibt die Farbe undefined, damit die Standardfarben des Themes greifen (keine lux-color-*-Klasse).
  readonly luxColor = input<LuxProgressColor | undefined, LuxProgressColor | undefined>(undefined, {
    transform: (value) => LuxProgressColors.find((entry) => entry === value) ?? this.DEFAULT_PROGRESS_COLOR
  });

  readonly luxMode = input<LuxProgressModeType, LuxProgressModeType | undefined>('indeterminate', {
    transform: (value) => (value === 'determinate' ? 'determinate' : 'indeterminate')
  });

  readonly luxType = input<LuxProgressType, LuxProgressType | undefined>('Progressbar', {
    transform: (value) => (value === 'Spinner' ? 'Spinner' : 'Progressbar')
  });

  readonly textId = `lux-progress-text-${nextProgressId++}`;
  readonly indeterminateAnnounced = signal(false);

  readonly typeCSS = computed(() => (this.luxType() === 'Spinner' ? 'lux-progress-spinner' : 'lux-progress-bar'));

  readonly luxColorCSS = computed(() => {
    const color = this.luxColor();
    return color ? 'lux-color-' + color : '';
  });

  readonly luxTextVisible = computed(() => this.luxShowText() && this.luxMode() === 'determinate');

  readonly luxProgressPercent = computed(() => {
    const value = Number(this.luxValue());
    return Number.isFinite(value) ? Math.min(100, Math.max(0, Math.round(value))) : 0;
  });

  readonly luxSpinnerDiameter = computed(() => {
    switch (this.luxSize()) {
      case 'small':
        return 24;
      case 'large':
        return 96;
      default:
        return 48;
    }
  });

  readonly luxSpinnerStrokeWidth = computed(() => {
    switch (this.luxSize()) {
      case 'small':
        return 2;
      case 'large':
        return 10;
      default:
        return 5;
    }
  });

  /**
   * Abstand des Track-Rings zum Rand des Spinners. MatProgressSpinner skaliert die viewBox
   * ((diameter - 10) + strokeWidth) auf den Durchmesser, dadurch endet der Bogen bei kleinen
   * Spinnern minimal vor dem Rand.
   */
  readonly luxSpinnerTrackInset = computed(() => {
    const diameter = this.luxSpinnerDiameter();
    const strokeWidth = this.luxSpinnerStrokeWidth();
    const viewBox = diameter - MAT_SPINNER_BASE_STROKE_WIDTH + strokeWidth;
    return (strokeWidth / 2) * (diameter / viewBox - 1);
  });

  constructor() {
    effect((onCleanup) => {
      if (this.luxMode() !== 'indeterminate') {
        this.indeterminateAnnounced.set(false);
        return;
      }

      if (!untracked(this.indeterminateAnnounced)) {
        const announceTimer = setTimeout(() => this.indeterminateAnnounced.set(true), ANNOUNCE_DELAY_MS);
        onCleanup(() => clearTimeout(announceTimer));
      }
    });
  }
}
