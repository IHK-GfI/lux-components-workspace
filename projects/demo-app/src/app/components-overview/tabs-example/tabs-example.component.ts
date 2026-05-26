import { NgStyle } from '@angular/common';
import { Component } from '@angular/core';
import { MatTabChangeEvent } from '@angular/material/tabs';
import {
  LuxAccordionComponent,
  LuxAutofocusDirective,
  LuxBadgeNotificationColor,
  LuxFormHintComponent,
  LuxInputAcComponent,
  LuxPanelComponent,
  LuxPanelContentComponent,
  LuxPanelHeaderTitleComponent,
  LuxSelectAcComponent,
  LuxTabComponent,
  LuxTabsComponent,
  LuxTextareaAcComponent,
  LuxToggleAcComponent
} from '@ihk-gfi/lux-components';
import { ExampleBaseContentComponent } from '../../example-base/example-base-root/example-base-subcomponents/example-base-content/example-base-content.component';
import { ExampleBaseAdvancedOptionsComponent } from '../../example-base/example-base-root/example-base-subcomponents/example-base-options/example-base-advanced-options.component';
import { ExampleBaseSimpleOptionsComponent } from '../../example-base/example-base-root/example-base-subcomponents/example-base-options/example-base-simple-options.component';
import { ExampleBaseStructureComponent } from '../../example-base/example-base-root/example-base-subcomponents/example-base-structure/example-base-structure.component';
import { logResult } from '../../example-base/example-base-util/example-base-helper';
import { CustomTabComponent } from './custom-tab/custom-tab.component';
import { TabsExampleContentComponent } from './tabs-example-content/tabs-example-content.component';

interface TabConfig {
  title: string;
  disabled: boolean;
  iconName: string;
  imageSrc: string;
  imageAlign: 'left' | 'center' | 'right';
  imageHeight: string;
  imageWidth: string;
  showNotification: boolean | undefined;
  notificationColor: LuxBadgeNotificationColor;
  counterCap: number;
  counter: number | undefined;
}

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs-example.component.html',
  imports: [
    LuxAccordionComponent,
    LuxPanelHeaderTitleComponent,
    LuxPanelContentComponent,
    LuxPanelComponent,
    LuxTabsComponent,
    LuxTabComponent,
    LuxToggleAcComponent,
    LuxTextareaAcComponent,
    LuxSelectAcComponent,
    LuxInputAcComponent,
    LuxFormHintComponent,
    LuxAutofocusDirective,
    ExampleBaseStructureComponent,
    ExampleBaseContentComponent,
    NgStyle,
    CustomTabComponent,
    TabsExampleContentComponent,
    ExampleBaseSimpleOptionsComponent,
    ExampleBaseAdvancedOptionsComponent
  ]
})
export class TabsExampleComponent {
  showOutputEvents = false;
  log = logResult;

  activeTab = 0;
  iconSize = '2x';
  displayDivider = true;
  lazyLoading = false;
  backgroundColor = '#ffffff';
  showBorder = false;

  notificationColors: LuxBadgeNotificationColor[] = ['primary', 'warn', 'accent', 'default'];

  tabs: TabConfig[] = [
    {
      title: 'Title #1',
      disabled: false,
      iconName: 'lux-interface-bookmark',
      imageSrc: 'assets/png/image-36x36.png',
      imageAlign: 'center',
      imageHeight: '36px',
      imageWidth: '36px',
      showNotification: true,
      notificationColor: 'accent',
      counterCap: 10,
      counter: 10
    },
    {
      title: 'Title #2',
      disabled: false,
      iconName: 'lux-interface-user-single',
      imageSrc: 'assets/png/image-36x36.png',
      imageHeight: '36px',
      imageWidth: '36px',
      imageAlign: 'center',
      showNotification: true,
      notificationColor: 'warn',
      counterCap: 10,
      counter: undefined
    },
    {
      title: 'Title #3',
      disabled: false,
      iconName: 'lux-interface-validation-check',
      imageSrc: 'assets/png/image-36x36.png',
      imageHeight: '36px',
      imageWidth: '36px',
      imageAlign: 'center',
      showNotification: false,
      notificationColor: 'primary',
      counterCap: 99,
      counter: 99
    }
  ];

  constructor() {}

  activeTabChanged(event: MatTabChangeEvent) {
    this.log(this.showOutputEvents, 'luxActiveTabChanged', event);
  }

  tabContentCreated(tab: TabConfig) {
    this.log(this.showOutputEvents, 'Tab-Content created', tab);
  }
}
