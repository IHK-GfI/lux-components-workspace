import { Component, Input } from '@angular/core';
import { LuxCardComponent, LuxCardContentComponent, LuxDividerComponent, LuxInputAcComponent, LuxSelectAcComponent, LuxToggleAcComponent } from '@ihk-gfi/lux-components';
import { NewMarkerComponent } from "../../../base/new-marker/new-marker.component";

@Component({
  selector: 'detail-example',
  templateUrl: './detail-example.component.html',
  imports: [LuxDividerComponent, LuxCardContentComponent, LuxCardComponent, LuxToggleAcComponent, LuxSelectAcComponent, LuxInputAcComponent, NewMarkerComponent]
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
    showCustomCardHeader: boolean;
  };

  constructor() {}
}
