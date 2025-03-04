import { Component } from '@angular/core';
import {
  LuxBadgeNotificationSize,
  LuxFormHintComponent,
  LuxIconComponent,
  LuxImageComponent,
  LuxInputAcComponent,
  LuxLinkPlainComponent,
  LuxRadioAcComponent,
  LuxSelectAcComponent,
  LuxTileAcComponent,
  LuxToggleAcComponent
} from 'lux-components-lib';
import { ExampleBaseContentComponent } from '../../example-base/example-base-root/example-base-subcomponents/example-base-content/example-base-content.component';
import { ExampleBaseAdvancedOptionsComponent } from '../../example-base/example-base-root/example-base-subcomponents/example-base-options/example-base-advanced-options.component';
import { ExampleBaseSimpleOptionsComponent } from '../../example-base/example-base-root/example-base-subcomponents/example-base-options/example-base-simple-options.component';
import { ExampleBaseStructureComponent } from '../../example-base/example-base-root/example-base-subcomponents/example-base-structure/example-base-structure.component';
import { logResult } from '../../example-base/example-base-util/example-base-helper';

@Component({
  selector: 'app-tile-authentic-example',
  templateUrl: './tile-authentic-example.component.html',
  styleUrls: ['./tile-authentic-example.component.scss'],
  imports: [
    LuxImageComponent,
    LuxIconComponent,
    LuxLinkPlainComponent,
    LuxTileAcComponent,
    LuxToggleAcComponent,
    LuxSelectAcComponent,
    LuxRadioAcComponent,
    LuxInputAcComponent,
    LuxFormHintComponent,
    ExampleBaseStructureComponent,
    ExampleBaseContentComponent,
    ExampleBaseSimpleOptionsComponent,
    ExampleBaseAdvancedOptionsComponent
  ]
})
export class TileAuthenticExampleComponent {
  showIcon = true;
  showOutputEvents = false;

  label = 'Wetter';
  subTitle = 'Vorschau auf die kommende Woche';
  log = logResult;

  badgeCap = 20;
  badgeSize: LuxBadgeNotificationSize = 'medium';
  badgeColor = 'primary';
  counter?: number;
  _showNotification = false;

  get showNotification() {
    return this._showNotification;
  }

  set showNotification(show: boolean) {
    this._showNotification = show;

    if (show && this.counter) {
      this.counter = undefined;
    }
  }

  constructor() {}
}
