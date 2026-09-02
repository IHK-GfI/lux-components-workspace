import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
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
  changeDetection: ChangeDetectionStrategy.OnPush,
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
  readonly showOutputEvents = signal(false);
  readonly log = logResult;
  readonly displayModes = ['flat', 'default'];
  readonly disabled = signal(false);
  readonly disabled1Panel = signal(false);
  readonly disabled2Panel = signal(false);
  readonly hideToggle = signal(false);
  readonly hideToggle1Panel = signal(false);
  readonly hideToggle2Panel = signal(false);
  readonly expanded = signal(true);
  readonly expandedHeaderHeight = signal('4em');
  readonly collapsedHeaderHeight = signal('4em');
  readonly dynamicHeaderHeight = signal(false);
  readonly expandedHeaderHeight1Panel = signal('4em');
  readonly collapsedHeaderHeight1Panel = signal('4em');
  readonly dynamicHeaderHeight1Panel = signal(false);
  readonly expandedHeaderHeight2Panel = signal('4em');
  readonly collapsedHeaderHeight2Panel = signal('4em');
  readonly dynamicHeaderHeight2Panel = signal(false);
  readonly displayMode = signal<LuxModeType>('default');
  readonly colorOptions = ['primary', 'accent', 'warn', 'neutral'];
  readonly color = signal<LuxAccordionColor>('primary');
  readonly togglePositions = ['after', 'before'];
  readonly togglePosition = signal<LuxTogglePosition>('after');
  readonly truncated = signal(false);
  readonly borderCheck = signal(false);
  readonly stickyHeader = signal(false);
  readonly stickyHeaderOffset = signal('');
  readonly stickyLongContent = signal(false);
  readonly longContentArr = Array.from({ length: 15 }, (_, index) => index);

  onDisplayModeChange(mode: LuxModeType) {
    // Der Multimode muss auf true gesetzt werden damit immer alle Panels aufgeklappt werden. Sonst wird nur das Custom Panel aufgeklappt wenn der Multimode vorher deaktiviert wurde.
    this.multiMode.set(true);
    this.expanded.set(false);
    this.displayMode.set(mode);
    setTimeout(() => this.expanded.set(true));
  }

  onColorChanged(color: LuxAccordionColor) {
    this.color.set(color);
  }

  readonly panelConfigShortLabelArr: { title: string; description: string }[] = [
    { title: 'Panel #1 - Hauptüberschrift im Panel', description: 'Optionale zusätzliche Beschreibung' },
    { title: 'Panel #2', description: 'Beschreibung Panel #2' }
  ];
  readonly panelConfigLongLabelArr: { title: string; description: string }[] = [
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

  readonly panelConfigArr = signal(this.panelConfigShortLabelArr);

  readonly multiMode = signal(true);
  readonly isLongLabels = computed(() => this.panelConfigArr() === this.panelConfigLongLabelArr);

  onMultiModeChange(multiMode: boolean) {
    this.multiMode.set(multiMode);

    if (!multiMode) {
      this.expanded.set(false);
    }
  }

  onChangeLabels(longLabels: boolean) {
    this.panelConfigArr.set(longLabels ? this.panelConfigLongLabelArr : this.panelConfigShortLabelArr);

    if (longLabels) {
      this.dynamicHeaderHeight.set(true);
      this.dynamicHeaderHeight1Panel.set(true);
      this.dynamicHeaderHeight2Panel.set(true);
    }
  }

  onChangeDynamicHeaderHeight(value: boolean) {
    this.dynamicHeaderHeight1Panel.set(value);
    this.dynamicHeaderHeight2Panel.set(value);
  }
}
