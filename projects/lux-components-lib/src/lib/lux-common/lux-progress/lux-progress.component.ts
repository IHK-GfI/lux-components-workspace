import { NgClass } from '@angular/common';
import { Component, Input } from '@angular/core';
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

@Component({
  selector: 'lux-progress',
  templateUrl: './lux-progress.component.html',
  imports: [NgClass, MatProgressBar, LuxTagIdDirective, LuxAriaLabelDirective, LuxCustomTagIdDirective, MatProgressSpinner, TranslocoPipe]
})
export class LuxProgressComponent {
  readonly DEFAULT_PROGRESS_COLOR: LuxProgressColor = 'blue';

  private _luxMode?: LuxProgressModeType;
  private _luxType?: LuxProgressType;
  private _luxColor?: LuxProgressColor;

  animDurationCSS = '';
  typeCSS = '';

  @Input() luxValue = 0;
  @Input() luxAriaLabel = ''
  // Nur für ProgressBar
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

  constructor() {
    this.luxMode = 'indeterminate';
    this.luxType = 'Progressbar';
  }
}
