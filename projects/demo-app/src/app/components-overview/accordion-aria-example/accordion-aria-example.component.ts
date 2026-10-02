import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import {
  LuxAccordionColor,
  LuxAriaLabelDirective,
  LuxButtonComponent,
  LuxCardComponent,
  LuxCardContentComponent,
  LuxDatepickerComponent,
  LuxFormHintComponent,
  LuxInputComponent,
  LuxMenuComponent,
  LuxMenuItemComponent,
  LuxModeType,
  LuxRadioComponent,
  LuxSelectComponent,
  LuxSnackbarService,
  LuxToggleComponent
} from '@ihk-gfi/lux-components';
import {
  LuxAccordionAriaComponent,
  LuxAriaTogglePosition,
  LuxPanelAriaComponent,
  LuxPanelAriaContentComponent,
  LuxPanelAriaHeaderCustomComponent,
  LuxPanelAriaHeaderDescriptionComponent,
  LuxPanelAriaHeaderTitleComponent
} from '@ihk-gfi/lux-components/lux-accordion-aria';
import { ExampleBaseContentComponent } from '../../example-base/example-base-root/example-base-subcomponents/example-base-content/example-base-content.component';
import { ExampleBaseAdvancedOptionsComponent } from '../../example-base/example-base-root/example-base-subcomponents/example-base-options/example-base-advanced-options.component';
import { ExampleBaseSimpleOptionsComponent } from '../../example-base/example-base-root/example-base-subcomponents/example-base-options/example-base-simple-options.component';
import { ExampleBaseStructureComponent } from '../../example-base/example-base-root/example-base-subcomponents/example-base-structure/example-base-structure.component';
import { logResult } from '../../example-base/example-base-util/example-base-helper';

@Component({
  selector: 'app-accordion-aria-example',
  templateUrl: './accordion-aria-example.component.html',
  styleUrls: ['./accordion-aria-example.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
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
    LuxToggleComponent,
    LuxSelectComponent,
    LuxCardComponent,
    LuxCardContentComponent,
    LuxPanelAriaHeaderCustomComponent,
    LuxButtonComponent,
    LuxFormHintComponent,
    LuxRadioComponent,
    LuxInputComponent,
    LuxDatepickerComponent,
    LuxAriaLabelDirective,
    LuxMenuComponent,
    LuxMenuItemComponent
  ]
})
export class AccordionAriaExampleComponent {
  private readonly snackbar = inject(LuxSnackbarService);

  readonly showOutputEvents = signal(false);
  readonly log = logResult;
  readonly displayModes = ['flat', 'default'];
  readonly disabled = signal(false);
  readonly disabled1Panel = signal(false);
  readonly disabled2Panel = signal(false);
  readonly disabled3Panel = signal(false);
  readonly hideToggle = signal(false);
  readonly hideToggle1Panel = signal(false);
  readonly hideToggle2Panel = signal(false);
  readonly hideToggle3Panel = signal(false);
  readonly hideLabelIfExtended3Panel = signal(false);
  readonly showHeaderMenu4Panel = signal(true);
  readonly hideAllCustomHeaders = signal(false);
  readonly expanded = signal(true);
  readonly expandedHeaderHeight = signal('4em');
  readonly collapsedHeaderHeight = signal('4em');
  readonly dynamicHeaderHeight = signal(false);
  readonly expandedHeaderHeight1Panel = signal<string | undefined>(undefined);
  readonly collapsedHeaderHeight1Panel = signal<string | undefined>(undefined);
  readonly dynamicHeaderHeight1Panel = signal(false);
  readonly secondRowForMobile1Panel = signal(false);
  readonly expandedHeaderHeight2Panel = signal<string | undefined>(undefined);
  readonly collapsedHeaderHeight2Panel = signal<string | undefined>(undefined);
  readonly dynamicHeaderHeight2Panel = signal(false);
  readonly secondRowForMobile2Panel = signal(false);
  readonly dynamicHeaderHeight3Panel = signal(false);
  readonly secondRowForMobile3Panel = signal(false);
  readonly displayMode = signal<LuxModeType>('default');
  readonly colorOptions = ['primary', 'accent', 'warn', 'neutral'];
  readonly color = signal<LuxAccordionColor>('primary');
  readonly togglePositions = ['after', 'before'];
  readonly togglePosition = signal<LuxAriaTogglePosition>('after');
  readonly truncated = signal(false);
  readonly borderCheck = signal(false);
  readonly showHeaderButtons1Panel = signal(true);
  readonly showHeaderDatepicker2Panel = signal(true);
  readonly headerDate2Panel = signal<string | null>(new Date().toISOString());
  readonly stickyHeader = signal(false);
  readonly stickyHeaderOffset = signal('');
  readonly stickyLongContent = signal(false);
  readonly longContentArr = Array.from({ length: 15 }, (_, index) => index);

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

  onDisplayModeChange(mode: LuxModeType) {
    // Der Multimode muss auf true gesetzt werden damit immer alle Panels aufgeklappt werden. Sonst wird nur das Custom Panel aufgeklappt wenn der Multimode vorher deaktiviert wurde.
    this.multiMode.set(true);
    this.expanded.set(false);
    this.displayMode.set(mode);
    setTimeout(() => this.expanded.set(true));
  }

  onMultiModeChange(multiMode: boolean) {
    this.multiMode.set(multiMode);

    if (!multiMode) {
      this.expanded.set(false);
    }
  }

  onPanelClickNotAllowed() {
    this.snackbar.open(3000, {
      text: 'Panel ist deaktiviert und kann nicht geöffnet werden. Deaktivierte Panels bitte ausblenden.',
      iconName: 'lux-info'
    });
  }

  onChangeLabels(longLabels: boolean) {
    this.panelConfigArr.set(longLabels ? this.panelConfigLongLabelArr : this.panelConfigShortLabelArr);

    if (longLabels) {
      this.dynamicHeaderHeight.set(true);
      this.dynamicHeaderHeight1Panel.set(true);
      this.dynamicHeaderHeight2Panel.set(true);
      this.dynamicHeaderHeight3Panel.set(true);
    }
  }

  onChangeDynamicHeaderHeight(value: boolean) {
    this.dynamicHeaderHeight1Panel.set(value);
    this.dynamicHeaderHeight2Panel.set(value);
    this.dynamicHeaderHeight3Panel.set(value);
  }
}
