import { AfterViewInit, ChangeDetectionStrategy, Component, Input, ViewChild } from '@angular/core';
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
  @Input() showOutputEvents = false;

  log = logResult;

  @ViewChild(LuxPanelComponent, { static: true }) luxPanel!: LuxPanelComponent;

  protected override getMatExpansionPanel() {
    return this.luxPanel.matExpansionPanel;
  }
}
