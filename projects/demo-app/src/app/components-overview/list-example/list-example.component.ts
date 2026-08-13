import { Component, DestroyRef, inject } from '@angular/core';
import {
  LuxAccordionComponent,
  LuxAriaLabelDirective,
  LuxAutocompleteAcComponent,
  LuxBadgeColors,
  LuxButtonComponent,
  LuxCheckboxAcComponent,
  LuxChipAcGroupComponent,
  LuxChipsAcComponent,
  LuxFormHintComponent,
  LuxIconComponent,
  LuxInputAcComponent,
  LuxLinkComponent,
  LuxLinkPlainComponent,
  LuxListComponent,
  LuxListItemComponent,
  LuxListItemContentComponent,
  LuxListItemCustomHeaderComponent,
  LuxListItemIconComponent,
  LuxPanelComponent,
  LuxPanelContentComponent,
  LuxPanelHeaderTitleComponent,
  LuxRadioAcComponent,
  LuxSelectAcComponent,
  LuxToggleAcComponent
} from '@ihk-gfi/lux-components';
import { StatusMarkerComponent } from '../../base/status-marker/status-marker.component';
import { ExampleBaseContentComponent } from '../../example-base/example-base-root/example-base-subcomponents/example-base-content/example-base-content.component';
import { ExampleBaseAdvancedOptionsComponent } from '../../example-base/example-base-root/example-base-subcomponents/example-base-options/example-base-advanced-options.component';
import { ExampleBaseOptionsActionsComponent } from '../../example-base/example-base-root/example-base-subcomponents/example-base-options/example-base-options-actions.component';
import { ExampleBaseSimpleOptionsComponent } from '../../example-base/example-base-root/example-base-subcomponents/example-base-options/example-base-simple-options.component';
import { ExampleBaseStructureComponent } from '../../example-base/example-base-root/example-base-subcomponents/example-base-structure/example-base-structure.component';
import { logResult } from '../../example-base/example-base-util/example-base-helper';

interface ListItem {
  title: string;
  subTitle: string;
  lineBreak: boolean;
  selected: boolean;
  iconName: string;
  chips: string[];
}

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
    LuxCheckboxAcComponent,
    LuxRadioAcComponent,
    LuxFormHintComponent,
    ExampleBaseStructureComponent,
    ExampleBaseContentComponent,
    ExampleBaseSimpleOptionsComponent,
    ExampleBaseAdvancedOptionsComponent,
    ExampleBaseOptionsActionsComponent,
    LuxListItemCustomHeaderComponent,
    StatusMarkerComponent,
    LuxAutocompleteAcComponent,
    LuxChipsAcComponent,
    LuxChipAcGroupComponent,
    LuxLinkComponent,
    LuxLinkPlainComponent,
    LuxAriaLabelDirective
  ]
})
export class ListExampleComponent {
  private destroyRef = inject(DestroyRef);
  showCustomHeader = false;
  showOutputEvents = false;
  showInteractiveContent = false;
  showRow1 = true;
  showRow2 = true;
  showRow3 = true;
  log = logResult;
  items: ListItem[] = [];
  colors = LuxBadgeColors;
  emptyLabel = 'Lade Daten...';
  emptyIconName = 'lux-interface-page-controller-loading-3';
  emptyIconSize = '2x';
  selectedPosition = 0;

  constructor() {
    // setTimeout simuliert asynchrones Laden (z.B. aus einer API).
    const fillTimeout = setTimeout(() => {
      this.fill(30);
      this.emptyLabel = 'Keine Daten vorhanden';
      this.emptyIconName = 'lux-exclamation-mark';
      this.emptyIconSize = '5x';
    }, 2000);
    this.destroyRef.onDestroy(() => clearTimeout(fillTimeout));
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
        iconName: 'lux-interface-user-single',
        chips: ['Lorem ipsum', 'Dolor sit amet']
      });
    }
  }

  click(event: any) {
    this.log(this.showOutputEvents, 'luxClicked', event);
  }
}
