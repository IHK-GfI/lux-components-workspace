import { Component } from '@angular/core';
import {
    LuxAccordionColor,
    LuxAccordionComponent,
    LuxCardComponent,
    LuxCardContentComponent,
    LuxFormHintComponent,
    LuxInputAcComponent,
    LuxModeType,
    LuxPanelComponent,
    LuxPanelContentComponent,
    LuxPanelHeaderDescriptionComponent,
    LuxPanelHeaderTitleComponent,
    LuxRadioAcComponent,
    LuxSelectAcComponent,
    LuxToggleAcComponent,
    LuxTogglePosition
} from '@ihk-gfi/lux-components';
import { ExampleBaseContentComponent } from '../../example-base/example-base-root/example-base-subcomponents/example-base-content/example-base-content.component';
import { ExampleBaseAdvancedOptionsComponent } from '../../example-base/example-base-root/example-base-subcomponents/example-base-options/example-base-advanced-options.component';
import { ExampleBaseSimpleOptionsComponent } from '../../example-base/example-base-root/example-base-subcomponents/example-base-options/example-base-simple-options.component';
import { ExampleBaseStructureComponent } from '../../example-base/example-base-root/example-base-subcomponents/example-base-structure/example-base-structure.component';
import { logResult } from '../../example-base/example-base-util/example-base-helper';
import { CustomPanelComponent } from './custom-panel/custom-panel.component';

@Component({
  selector: 'app-accordion-example',
  templateUrl: './accordion-example.component.html',
  styleUrls: ['./accordion-example.component.scss'],
  imports: [
    LuxAccordionComponent,
    LuxPanelHeaderDescriptionComponent,
    LuxPanelHeaderTitleComponent,
    LuxPanelContentComponent,
    LuxPanelComponent,
    ExampleBaseStructureComponent,
    ExampleBaseContentComponent,
    CustomPanelComponent,
    ExampleBaseSimpleOptionsComponent,
    ExampleBaseAdvancedOptionsComponent,
    LuxFormHintComponent,
    LuxInputAcComponent,
    LuxRadioAcComponent,
    LuxToggleAcComponent,
    LuxSelectAcComponent,
    LuxCardComponent,
    LuxCardContentComponent
  ]
})
export class AccordionExampleComponent {
  showOutputEvents = false;
  log = logResult;
  displayModes = ['flat', 'default'];
  disabled = false;
  disabled1Panel = false;
  disabled2Panel = false;
  hideToggle = false;
  hideToggle1Panel = false;
  hideToggle2Panel = false;
  expanded = true;
  expandedHeaderHeight = '4em';
  collapsedHeaderHeight = '4em';
  expandedHeaderHeight1Panel = '4em';
  collapsedHeaderHeight1Panel = '4em';
  expandedHeaderHeight2Panel = '4em';
  collapsedHeaderHeight2Panel = '4em';
  _displayMode: LuxModeType = 'default';
  colorOptions = ['primary', 'accent', 'warn', 'neutral'];
  color: LuxAccordionColor = 'primary';
  togglePositions = ['after', 'before'];
  _togglePosition: LuxTogglePosition = 'after';

  set displayMode(mode: LuxModeType) {
    // Der Multimode muss auf true gesetzt werden damit immer alle Panels aufgeklappt werden. Sonst wird nur das Custom Panel aufgeklappt wenn der Multimode vorher deaktiviert wurde.
    this.multiMode = true;
    this.expanded = false;
    this._displayMode = mode;
    setTimeout(() => (this.expanded = true));
  }

  get displayMode() {
    return this._displayMode;
  }

  set togglePosition(position: LuxTogglePosition) {
    this._togglePosition = position;
  }

  get togglePosition() {
    return this._togglePosition;
  }

  onColorChanged(_color: LuxAccordionColor) {
    this.color = _color;
  }

  panelConfigArr: { title: string; description: string }[] = [
    { title: 'Panel #1 -  Hauptüberschrift im Panel', description: 'Optionale zusätzliche Beschreibung' },
    { title: 'Panel #2', description: 'Beschreibung Panel #2' }
  ];
  _multiMode = true;

  get multiMode() {
    return this._multiMode;
  }

  set multiMode(multiMode: boolean) {
    this._multiMode = multiMode;

    if (!multiMode) {
      this.expanded = false;
    }
  }

  constructor() {}
}
