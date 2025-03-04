import { Component, Input } from '@angular/core';
import { LuxProgressComponent, LuxProgressModeType } from '../../../../lux-common/lux-progress/lux-progress.component';

/**
 * Diese Component ist nur eine leichte Ergänzung zu LuxProgress und wird nicht vom Modul exportiert.
 */
@Component({
  selector: 'lux-file-progress',
  templateUrl: './lux-file-progress.component.html',
  styleUrls: ['./lux-file-progress.component.scss'],
  imports: [LuxProgressComponent]
})
export class LuxFileProgressComponent {
  @Input() luxProgress = 0;
  @Input() luxMode: LuxProgressModeType = 'indeterminate';

  constructor() {}
}
