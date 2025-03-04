import { Component } from '@angular/core';
import {
  LuxAccordionComponent,
  LuxBadgeColors,
  LuxButtonComponent,
  LuxFormHintComponent,
  LuxIconComponent,
  LuxInputAcComponent,
  LuxListComponent,
  LuxListItemComponent,
  LuxListItemContentComponent,
  LuxListItemIconComponent,
  LuxPanelComponent,
  LuxPanelContentComponent,
  LuxPanelHeaderTitleComponent,
  LuxSelectAcComponent,
  LuxToggleAcComponent
} from 'lux-components-lib';
import { ExampleBaseContentComponent } from '../../example-base/example-base-root/example-base-subcomponents/example-base-content/example-base-content.component';
import { ExampleBaseAdvancedOptionsComponent } from '../../example-base/example-base-root/example-base-subcomponents/example-base-options/example-base-advanced-options.component';
import { ExampleBaseOptionsActionsComponent } from '../../example-base/example-base-root/example-base-subcomponents/example-base-options/example-base-options-actions.component';
import { ExampleBaseSimpleOptionsComponent } from '../../example-base/example-base-root/example-base-subcomponents/example-base-options/example-base-simple-options.component';
import { ExampleBaseStructureComponent } from '../../example-base/example-base-root/example-base-subcomponents/example-base-structure/example-base-structure.component';
import { logResult } from '../../example-base/example-base-util/example-base-helper';

@Component({
  selector: 'app-list-example',
  templateUrl: './list-example.component.html',
  styleUrls: ['./list-example.component.scss'],
  imports: [
    LuxIconComponent,
    LuxButtonComponent,
    LuxAccordionComponent,
    LuxPanelHeaderTitleComponent,
    LuxPanelContentComponent,
    LuxPanelComponent,
    LuxListComponent,
    LuxListItemContentComponent,
    LuxListItemIconComponent,
    LuxListItemComponent,
    LuxToggleAcComponent,
    LuxSelectAcComponent,
    LuxInputAcComponent,
    LuxFormHintComponent,
    ExampleBaseStructureComponent,
    ExampleBaseContentComponent,
    ExampleBaseSimpleOptionsComponent,
    ExampleBaseAdvancedOptionsComponent,
    ExampleBaseOptionsActionsComponent
  ]
})
export class ListExampleComponent {
  showOutputEvents = false;
  log = logResult;
  items: any[] = [];
  colors = LuxBadgeColors;
  emptyLabel = 'Keine Daten!';
  emptyIconName = 'lux-exclamation-mark';
  emptyIconSize = '5x';
  selectedPosition = 0;

  constructor() {
    this.clear();
    this.fill(10);
  }

  clear() {
    this.items = [];
    this.selectedPosition = -1;
  }

  fill(amount: number) {
    this.clear();
    for (let i = 0; i < amount; i++) {
      this.items.push({
        title: `Item #${i + 1}`,
        subTitle: `Untertitel Item #${i + 1}`,
        lineBreak: false,
        selected: false,
        iconName: 'lux-interface-user-single'
      });
    }
  }

  click(event: any) {
    this.log(this.showOutputEvents, 'luxClicked', event);
  }
}
