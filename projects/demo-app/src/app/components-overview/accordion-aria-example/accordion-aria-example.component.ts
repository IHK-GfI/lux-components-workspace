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
  LuxButtonComponent,
  LuxFormHintComponent,
  LuxRadioAcComponent,
  LuxInputAcComponent,
  LuxModeType,
  LuxPanelAriaHeaderCustomComponent,
  LuxAriaTogglePosition,
  LuxDatepickerAcComponent,
  LuxAriaLabelDirective
} from '@ihk-gfi/lux-components';
import { ExampleBaseContentComponent } from '../../example-base/example-base-root/example-base-subcomponents/example-base-content/example-base-content.component';
import { ExampleBaseAdvancedOptionsComponent } from '../../example-base/example-base-root/example-base-subcomponents/example-base-options/example-base-advanced-options.component';
import { ExampleBaseSimpleOptionsComponent } from '../../example-base/example-base-root/example-base-subcomponents/example-base-options/example-base-simple-options.component';
import { ExampleBaseStructureComponent } from '../../example-base/example-base-root/example-base-subcomponents/example-base-structure/example-base-structure.component';
import { logResult } from '../../example-base/example-base-util/example-base-helper';

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
    LuxButtonComponent,
    LuxFormHintComponent,
    LuxRadioAcComponent,
    LuxInputAcComponent,
    LuxDatepickerAcComponent,
    LuxAriaLabelDirective
  ]
})
export class AccordionAriaExampleComponent {
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
  dynamicHeaderHeight = false;
  expandedHeaderHeight1Panel: string | undefined = undefined;
  collapsedHeaderHeight1Panel: string | undefined = undefined;
  dynamicHeaderHeight1Panel = false;
  expandedHeaderHeight2Panel: string | undefined = undefined;
  collapsedHeaderHeight2Panel: string | undefined = undefined;
  dynamicHeaderHeight2Panel = false;
  _displayMode: LuxModeType = 'default';
  colorOptions = ['primary', 'accent', 'warn', 'neutral'];
  color: LuxAccordionColor = 'primary';
  togglePositions = ['after', 'before'];
  _togglePosition: LuxAriaTogglePosition = 'after';
  truncated = false;
  borderCheck = false;
  showHeaderButtons1Panel = true;
  showHeaderDatepicker2Panel = true;
  headerDate2Panel: Date | undefined = new Date();
  stickyHeader = false;
  stickyHeaderOffset = '';
  stickyLongContent = false;
  longContentArr = Array.from({ length: 15 }, (_, index) => index);

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

  set togglePosition(position: 'after' | 'before') {
    this._togglePosition = position;
  }

  get togglePosition() {
    return this._togglePosition ?? 'after';
  }

  onColorChanged(_color: LuxAccordionColor) {
    this.color = _color;
  }

  panelConfigShortLabelArr: { title: string; description: string }[] = [
    { title: 'Panel #1 - Hauptüberschrift im Panel', description: 'Optionale zusätzliche Beschreibung' },
    { title: 'Panel #2', description: 'Beschreibung Panel #2' }
  ];
  panelConfigLongLabelArr: { title: string; description: string }[] = [
    {
      title:
        'Panel #1 - Lorem ipsum, dolor sit amet consectetur adipisicing elit. Excepturi distinctio libero, ratione animi dolore esse porro mollitia nulla magnam et, modi doloribus',
      description:
        'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Excepturi distinctio libero, ratione animi dolore esse porro mollitia nulla magnam et, modi doloribus'
    },
    {
      title:
        'Panel #2 - Lorem ipsum, dolor sit amet consectetur adipisicing elit. Excepturi distinctio libero, ratione animi dolore esse porro mollitia nulla magnam et, modi doloribus',
      description:
        'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Excepturi distinctio libero, ratione animi dolore esse porro mollitia nulla magnam et, modi doloribus'
    }
  ];

  panelConfigArr: { title: string; description: string }[] = this.panelConfigShortLabelArr;

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

  get isLongLabels() {
    return this.panelConfigArr === this.panelConfigLongLabelArr;
  }

  constructor() {}

  onChangeLabels(longLabels: boolean) {
    this.panelConfigArr = longLabels ? this.panelConfigLongLabelArr : this.panelConfigShortLabelArr;

    if (longLabels) {
      this.dynamicHeaderHeight = true;
      this.dynamicHeaderHeight1Panel = true;
      this.dynamicHeaderHeight2Panel = true;
    }
  }

  onChangeDynamicHeaderHeight(value: boolean) {
    this.dynamicHeaderHeight1Panel = value;
    this.dynamicHeaderHeight2Panel = value;
  }
}
