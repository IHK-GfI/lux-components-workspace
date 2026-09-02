import { Component, signal, ChangeDetectionStrategy } from '@angular/core';
import {
  LuxAutofocusDirective,
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
} from '@ihk-gfi/lux-components';
import { ExampleBaseContentComponent } from '../../example-base/example-base-root/example-base-subcomponents/example-base-content/example-base-content.component';
import { ExampleBaseAdvancedOptionsComponent } from '../../example-base/example-base-root/example-base-subcomponents/example-base-options/example-base-advanced-options.component';
import { ExampleBaseSimpleOptionsComponent } from '../../example-base/example-base-root/example-base-subcomponents/example-base-options/example-base-simple-options.component';
import { ExampleBaseStructureComponent } from '../../example-base/example-base-root/example-base-subcomponents/example-base-structure/example-base-structure.component';
import { logResult } from '../../example-base/example-base-util/example-base-helper';

@Component({
  selector: 'app-tile-authentic-example',
  templateUrl: './tile-authentic-example.component.html',
  styleUrls: ['./tile-authentic-example.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
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
    LuxAutofocusDirective,
    ExampleBaseStructureComponent,
    ExampleBaseContentComponent,
    ExampleBaseSimpleOptionsComponent,
    ExampleBaseAdvancedOptionsComponent
  ]
})
export class TileAuthenticExampleComponent {
  readonly showIcon = signal(true);
  readonly showOutputEvents = signal(false);

  readonly label = signal('Wetter');
  readonly labelTruncateAfterOneLine = signal(true);
  readonly labelTruncateAfterTwoLines = signal(false);
  readonly subTitle = signal('Vorschau auf die kommende Woche');
  readonly subTitleTruncateAfterOneLine = signal(false);
  readonly subTitleTruncateAfterTwoLines = signal(true);
  log = logResult;

  readonly badgeCap = signal(20);
  readonly badgeSize = signal<LuxBadgeNotificationSize>('medium');
  readonly badgeColor = signal('primary');
  readonly counter = signal<number | undefined>(undefined);
  private readonly _showNotification = signal(false);

  get showNotification() {
    return this._showNotification();
  }

  set showNotification(show: boolean) {
    this._showNotification.set(show);

    if (show && this.counter()) {
      this.counter.set(undefined);
    }
  }
}
