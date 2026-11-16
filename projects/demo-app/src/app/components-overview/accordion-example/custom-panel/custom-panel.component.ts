import { AfterViewInit, ChangeDetectionStrategy, Component, input, viewChild } from '@angular/core';
import {
  LuxPanelComponent,
  LuxPanelContentComponent,
  LuxPanelHeaderDescriptionComponent,
  LuxPanelHeaderTitleComponent
} from '@ihk-gfi/lux-components';
import { logResult } from '../../../example-base/example-base-util/example-base-helper';

@Component({
  selector: 'app-custom-panel',
  templateUrl: './custom-panel.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [LuxPanelHeaderDescriptionComponent, LuxPanelHeaderTitleComponent, LuxPanelContentComponent, LuxPanelComponent]
})
export class CustomPanelComponent extends LuxPanelComponent implements AfterViewInit {
  readonly showOutputEvents = input(false);

  log = logResult;

  readonly luxPanel = viewChild.required(LuxPanelComponent);

  protected override getMatExpansionPanel() {
    return this.luxPanel().matExpansionPanel();
  }
}
