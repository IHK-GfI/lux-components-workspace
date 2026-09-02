import { Component } from '@angular/core';
import {
  LuxAccordionAriaComponent,
  LuxAccordionColor,
  LuxCardComponent,
  LuxCardContentComponent,
  LuxPanelAriaComponent,
  LuxPanelAriaContentComponent,
  LuxPanelAriaHeaderDescriptionComponent,
  LuxPanelAriaHeaderTitleComponent,
  LuxSelectAcComponent,
  LuxToggleAcComponent,
  LuxButtonComponent
} from '@ihk-gfi/lux-components';
import { ExampleBaseContentComponent } from '../../example-base/example-base-root/example-base-subcomponents/example-base-content/example-base-content.component';
import { ExampleBaseAdvancedOptionsComponent } from '../../example-base/example-base-root/example-base-subcomponents/example-base-options/example-base-advanced-options.component';
import { ExampleBaseSimpleOptionsComponent } from '../../example-base/example-base-root/example-base-subcomponents/example-base-options/example-base-simple-options.component';
import { ExampleBaseStructureComponent } from '../../example-base/example-base-root/example-base-subcomponents/example-base-structure/example-base-structure.component';
import { LuxPanelAriaHeaderCustomComponent } from '../../../../../lux-components-lib/src/public_api';

interface PanelConfig {
  title: string;
  description: string;
}

@Component({
  selector: 'app-accordion-aria-example',
  templateUrl: './accordion-aria-example.component.html',
  styleUrls: ['./accordion-aria-example.component.scss'],
  standalone: true,
  imports: [
    LuxAccordionAriaComponent,
    LuxPanelAriaHeaderDescriptionComponent,
    LuxPanelAriaHeaderTitleComponent,
    LuxPanelAriaContentComponent,
    LuxPanelAriaComponent,
    ExampleBaseStructureComponent,
    ExampleBaseContentComponent,
    ExampleBaseSimpleOptionsComponent,
    ExampleBaseAdvancedOptionsComponent,
    LuxToggleAcComponent,
    LuxSelectAcComponent,
    LuxCardComponent,
    LuxCardContentComponent,
    LuxPanelAriaHeaderCustomComponent,
    LuxButtonComponent
  ]
})
export class AccordionAriaExampleComponent {
  showOutputEvents = false;
  disabled = false;
  multiMode = false;
  expanded = false;
  color: LuxAccordionColor = 'primary';
  isLongLabels = false;
  truncated = false;
  borderCheck = false;

  hideToggle1Panel = false;
  disabled1Panel = false;

  hideToggle2Panel = false;
  disabled2Panel = false;

  panelConfigArr: PanelConfig[] = [
    { title: 'Panel #1', description: 'Beschreibung Panel #1' },
    { title: 'Panel #2', description: 'Beschreibung Panel #2' }
  ];

  log(show: boolean, ...args: any[]) {
    if (show) {
      console.log(...args);
    }
  }
}
