import { Component, ChangeDetectionStrategy, input, model } from '@angular/core';
import {
  LuxCardComponent,
  LuxCardContentComponent,
  LuxDividerComponent,
  LuxInputComponent,
  LuxSelectComponent,
  LuxToggleComponent
} from '@ihk-gfi/lux-components';
import { StatusMarkerComponent } from '../../../base/status-marker/status-marker.component';

@Component({
  selector: 'detail-example',
  templateUrl: './detail-example.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    LuxDividerComponent,
    LuxCardContentComponent,
    LuxCardComponent,
    LuxToggleComponent,
    LuxSelectComponent,
    LuxInputComponent,
    StatusMarkerComponent
  ]
})
export class DetailExampleComponent {
  readonly selectedDetail = input<any>();
  readonly masterDetailConfig = input<{
    emptyIconDetail: string;
    emptyIconMaster: string;
    emptyIconDetailSize: string;
    emptyIconMasterSize: string;
    emptyLabelDetail: string;
    emptyLabelMaster: string;
    opened: boolean;
    lineBreak: boolean;
    ignoreScrollLoading: boolean;
    alignEmptyElements: boolean;
    showCustomCardHeader: boolean;
  }>();

  readonly masterIsReloading = model(false);
}
