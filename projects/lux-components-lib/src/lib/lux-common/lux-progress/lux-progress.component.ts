import { NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
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
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgClass, MatProgressBar, LuxTagIdDirective, LuxAriaLabelDirective, LuxCustomTagIdDirective, MatProgressSpinner, TranslocoPipe]
})
export class LuxProgressComponent {
  readonly DEFAULT_PROGRESS_COLOR: LuxProgressColor = 'blue';

  animDurationCSS = '';

  readonly luxValue = input(0);
  readonly luxAriaLabel = input('');
  // Nur für ProgressBar
  readonly luxSize = input<LuxProgressSizeType>('medium');
  readonly luxTagId = input<string | undefined>(undefined);

  readonly luxColor = input<LuxProgressColor, LuxProgressColor | undefined>(this.DEFAULT_PROGRESS_COLOR, {
    transform: (value) => LuxProgressColors.find((entry) => entry === value) ?? this.DEFAULT_PROGRESS_COLOR
  });

  readonly luxMode = input<LuxProgressModeType, LuxProgressModeType | undefined>('indeterminate', {
    transform: (value) => (value === 'determinate' ? 'determinate' : 'indeterminate')
  });

  readonly luxType = input<LuxProgressType, LuxProgressType | undefined>('Progressbar', {
    transform: (value) => (value === 'Spinner' ? 'Spinner' : 'Progressbar')
  });

  readonly typeCSS = computed(() => (this.luxType() === 'Spinner' ? 'lux-progress-spinner' : 'lux-progress-bar'));
}
