import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { LuxProgressComponent, LuxProgressModeType } from '../../../../lux-common/lux-progress/lux-progress.component';

/**
 * Diese Component ist nur eine leichte Ergänzung zu LuxProgress und wird nicht vom Modul exportiert.
 */
@Component({
  selector: 'lux-file-progress',
  templateUrl: './lux-file-progress.component.html',
  styleUrls: ['./lux-file-progress.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [LuxProgressComponent]
})
export class LuxFileProgressComponent {
  readonly luxProgress = input(0);
  readonly luxMode = input<LuxProgressModeType>('indeterminate');
}
