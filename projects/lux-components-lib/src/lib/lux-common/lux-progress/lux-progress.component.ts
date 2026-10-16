import { NgClass } from '@angular/common';
import { Component, Input, OnDestroy, signal } from '@angular/core';
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
  imports: [NgClass, MatProgressBar, LuxTagIdDirective, LuxAriaLabelDirective, LuxCustomTagIdDirective, MatProgressSpinner, TranslocoPipe]
})
export class LuxProgressComponent implements OnDestroy {
  readonly DEFAULT_PROGRESS_COLOR: LuxProgressColor = 'blue';

  private _luxMode?: LuxProgressModeType;
  private _luxType?: LuxProgressType;
  private _luxColor?: LuxProgressColor;
  private announceTimer?: ReturnType<typeof setTimeout>;

  readonly textId = `lux-progress-text-${nextProgressId++}`;
  readonly indeterminateAnnounced = signal(false);

  animDurationCSS = '';
  typeCSS = '';

  @Input() luxValue = 0;
  @Input() luxAriaLabel = '';
  @Input() luxMuted = false;
  @Input() luxShowText = false;
  @Input() luxText?: string;
  @Input() luxTextPosition: LuxProgressTextPositionType = 'bottom';
  // Steuert die Höhe der Progressbar und den Durchmesser des Spinners.
  @Input() luxSize: LuxProgressSizeType = 'medium';
  @Input() luxTagId?: string;

  @Input()
  set luxColor(value: LuxProgressColor | undefined) {
    this._luxColor = LuxProgressColors.find((entry) => entry === value) ?? this.DEFAULT_PROGRESS_COLOR;
  }

  get luxColor(): LuxProgressColor | undefined {
    return this._luxColor;
  }

  @Input() set luxMode(mode: LuxProgressModeType) {
    this._luxMode = mode;
    this.updateIndeterminateAnnouncement();
  }

  get luxMode() {
    if (this._luxMode !== 'determinate' && this._luxMode !== 'indeterminate') {
      return 'indeterminate';
    }
    return this._luxMode;
  }

  @Input() set luxType(type: LuxProgressType | undefined) {
    this._luxType = type;
    if (this._luxType === 'Progressbar') {
      this.typeCSS = 'lux-progress-bar';
    } else if (this._luxType === 'Spinner') {
      this.typeCSS = 'lux-progress-spinner';
    } else {
      this.luxType = 'Progressbar';
    }
  }

  get luxType(): LuxProgressType | undefined {
    return this._luxType;
  }

  get luxColorCSS(): string {
    return this.luxColor ? 'lux-color-' + this.luxColor : '';
  }

  get luxTextVisible(): boolean {
    return this.luxShowText && this.luxMode === 'determinate';
  }

  get luxProgressPercent(): number {
    const value = Number(this.luxValue);
    return Number.isFinite(value) ? Math.min(100, Math.max(0, Math.round(value))) : 0;
  }

  get luxSpinnerDiameter(): number {
    switch (this.luxSize) {
      case 'small':
        return 24;
      case 'large':
        return 96;
      default:
        return 48;
    }
  }

  get luxSpinnerStrokeWidth(): number {
    switch (this.luxSize) {
      case 'small':
        return 2;
      case 'large':
        return 10;
      default:
        return 5;
    }
  }

  /**
   * Abstand des Track-Rings zum Rand des Spinners. MatProgressSpinner skaliert die viewBox
   * ((diameter - 10) + strokeWidth) auf den Durchmesser, dadurch endet der Bogen bei kleinen
   * Spinnern minimal vor dem Rand.
   */
  get luxSpinnerTrackInset(): number {
    const diameter = this.luxSpinnerDiameter;
    const strokeWidth = this.luxSpinnerStrokeWidth;
    const viewBox = diameter - MAT_SPINNER_BASE_STROKE_WIDTH + strokeWidth;
    return (strokeWidth / 2) * (diameter / viewBox - 1);
  }

  constructor() {
    this.luxMode = 'indeterminate';
    this.luxType = 'Progressbar';
  }

  ngOnDestroy(): void {
    clearTimeout(this.announceTimer);
  }

  private updateIndeterminateAnnouncement() {
    clearTimeout(this.announceTimer);

    if (this.luxMode === 'indeterminate') {
      if (!this.indeterminateAnnounced()) {
        this.announceTimer = setTimeout(() => this.indeterminateAnnounced.set(true), ANNOUNCE_DELAY_MS);
      }
    } else {
      this.indeterminateAnnounced.set(false);
    }
  }
}
