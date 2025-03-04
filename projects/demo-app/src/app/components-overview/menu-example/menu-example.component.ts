import { Component } from '@angular/core';
import {
  LuxAccordionComponent,
  LuxFormHintComponent,
  LuxInputAcComponent,
  LuxMenuComponent,
  LuxMenuItemComponent,
  LuxPanelComponent,
  LuxPanelContentComponent,
  LuxPanelHeaderDescriptionComponent,
  LuxSelectAcComponent,
  LuxThemePalette,
  LuxToggleAcComponent
} from 'lux-components-lib';
import { ExampleBaseContentComponent } from '../../example-base/example-base-root/example-base-subcomponents/example-base-content/example-base-content.component';
import { ExampleBaseAdvancedOptionsComponent } from '../../example-base/example-base-root/example-base-subcomponents/example-base-options/example-base-advanced-options.component';
import { ExampleBaseSimpleOptionsComponent } from '../../example-base/example-base-root/example-base-subcomponents/example-base-options/example-base-simple-options.component';
import { ExampleBaseStructureComponent } from '../../example-base/example-base-root/example-base-subcomponents/example-base-structure/example-base-structure.component';
import { logResult } from '../../example-base/example-base-util/example-base-helper';

@Component({
  selector: 'app-menu-example',
  templateUrl: './menu-example.component.html',
  imports: [
    LuxMenuComponent,
    LuxMenuItemComponent,
    LuxAccordionComponent,
    LuxPanelHeaderDescriptionComponent,
    LuxPanelContentComponent,
    LuxPanelComponent,
    LuxToggleAcComponent,
    LuxSelectAcComponent,
    LuxInputAcComponent,
    LuxFormHintComponent,
    ExampleBaseStructureComponent,
    ExampleBaseContentComponent,
    ExampleBaseSimpleOptionsComponent,
    ExampleBaseAdvancedOptionsComponent
  ]
})
export class MenuExampleComponent {
  showOutputEvents = false;
  log = logResult;
  menuItems: ExampleMenuItem[] = [
    {
      iconName: 'lux-interface-login-circle',
      raised: false,
      color: 'primary',
      disabled: false,
      hidden: false,
      label: 'Registrierung',
      tooltip: '',
      tooltipMenu: '',
      alwaysVisible: false,
      round: false,
      hideLabelIfExtended: false,
      prio: 1,
      class: 'lux-test-class',
      buttonBadge: '',
      buttonBadgeColor: 'primary'
    },
    {
      iconName: 'lux-interface-help-question-message',
      raised: false,
      color: 'primary',
      disabled: false,
      hidden: false,
      label: 'FAQ´s',
      tooltip: '',
      tooltipMenu: '',
      alwaysVisible: false,
      round: false,
      hideLabelIfExtended: false,
      prio: 2,
      buttonBadge: '',
      buttonBadgeColor: 'primary'
    },
    {
      iconName: 'lux-interface-download-button-2',
      raised: false,
      color: 'primary',
      disabled: false,
      hidden: false,
      label: 'Downloads',
      tooltip: '',
      tooltipMenu: '',
      alwaysVisible: false,
      round: false,
      hideLabelIfExtended: false,
      prio: 3,
      buttonBadge: '',
      buttonBadgeColor: 'primary'
    },
    {
      iconName: 'lux-programming-bug',
      raised: false,
      color: 'primary',
      disabled: false,
      hidden: false,
      label: 'Extralanges Beispiellabel zum Testen',
      tooltip: '',
      tooltipMenu: '',
      alwaysVisible: false,
      round: false,
      hideLabelIfExtended: false,
      buttonBadge: '+99999',
      buttonBadgeColor: 'warn',
      prio: 4
    },
    {
      iconName: 'lux-programming-bug',
      raised: false,
      color: 'primary',
      disabled: false,
      hidden: false,
      label: 'Extralanges Beispiellabel zum Testen 2',
      tooltip: '',
      tooltipMenu: '',
      alwaysVisible: false,
      round: false,
      hideLabelIfExtended: false,
      prio: 4
    }
  ];

  displayExtended = true;
  displayMenuLeft = true;
  maximumExtended = 5;
  iconName = 'lux-interface-setting-menu-1';
  menuTriggerIconShowRight = false;
  menuLabel = '';
  className = '';

  badgeColors: any[] = [
    { value: 'primary', label: 'primary' },
    { value: 'warn', label: 'warn' },
    { value: 'accent', label: 'accent' }
  ];

  constructor() {}
}

interface ExampleMenuItem {
  iconName: string;
  raised: boolean;
  color: LuxThemePalette;
  disabled: boolean;
  hidden: boolean;
  label: string;
  tooltip: string;
  tooltipMenu: string;
  alwaysVisible: boolean;
  round: boolean;
  hideLabelIfExtended: boolean;
  prio: number;
  class?: string | string[] | Set<string> | Record<string, any>;
  buttonBadge?: string;
  buttonBadgeColor?: LuxThemePalette;
}
