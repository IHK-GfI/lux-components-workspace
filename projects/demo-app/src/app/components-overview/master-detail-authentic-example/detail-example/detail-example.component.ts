import { Component, Input } from '@angular/core';
import {
    LuxCardComponent,
    LuxCardContentComponent,
    LuxDividerComponent,
    LuxInputAcComponent,
    LuxSelectAcComponent,
    LuxToggleAcComponent
} from '@ihk-gfi/lux-components';

@Component({
  selector: 'detail-example',
  templateUrl: './detail-example.component.html',
  imports: [LuxDividerComponent, LuxCardContentComponent, LuxCardComponent, LuxToggleAcComponent, LuxSelectAcComponent, LuxInputAcComponent]
})
export class DetailExampleComponent {
  @Input() selectedDetail?: any;
  @Input() masterDetailConfig?: {
    emptyIconDetail: string;
    emptyIconMaster: string;
    emptyIconDetailSize: string;
    emptyIconMasterSize: string;
    emptyLabelDetail: string;
    emptyLabelMaster: string;
    opened: boolean;
    lineBreak: boolean;
    masterIsReloading: boolean;
    ignoreScrollLoading: boolean;
    alignEmptyElements: boolean;
  };

  constructor() {}
}
