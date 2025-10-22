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
  LuxToggleAcComponent,
  LuxDividerComponent,
  LuxMenuPanelHeaderComponent,
  LuxMenuSectionTitleComponent
} from '@ihk-gfi/lux-components';
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
    ExampleBaseAdvancedOptionsComponent,
    LuxDividerComponent,
    LuxMenuPanelHeaderComponent,
    LuxMenuSectionTitleComponent
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

  menuSectionHeaderTitle = 'Username';
  menuSectionHeaderSubtitle = 'User@Email.com';
  menuSectionTitle = 'Überschrift';
  menuSectionTitle2 = 'Überschrift 2';
  menuSectionTitleLarge = 'Bereich Teil eins';
  menuSectionTitleLarge2 = 'Bereich Teil zwei';

  menuItemsSections: ExampleMenuItem[] = [
    {
      iconName: 'lux-atom',
      raised: false,
      color: 'primary',
      disabled: false,
      hidden: false,
      label: 'Labeltext 1',
      tooltip: '',
      tooltipMenu: '',
      alwaysVisible: false,
      round: false,
      hideLabelIfExtended: false,
      prio: 1,
      class: 'lux-test-class',
      buttonBadge: '13',
      buttonBadgeColor: 'primary',
      selected: false
    },
    {
      iconName: 'lux-atom',
      raised: false,
      color: 'primary',
      disabled: false,
      hidden: false,
      label: 'Labeltext 2',
      tooltip: '',
      tooltipMenu: '',
      alwaysVisible: false,
      round: false,
      hideLabelIfExtended: false,
      prio: 1,
      class: 'lux-test-class',
      buttonBadge: '13',
      buttonBadgeColor: 'accent',
      selected: false
    },
    {
      iconName: 'lux-atom',
      raised: false,
      color: 'primary',
      disabled: false,
      hidden: false,
      label: 'Labeltext 3',
      tooltip: '',
      tooltipMenu: '',
      alwaysVisible: false,
      round: false,
      hideLabelIfExtended: false,
      prio: 1,
      class: 'lux-test-class',
      buttonBadge: '15',
      buttonBadgeColor: 'warn',
      selected: false
    },
    {
      iconName: 'lux-atom',
      raised: false,
      color: 'primary',
      disabled: false,
      hidden: false,
      label: 'Labeltext 4',
      tooltip: '',
      tooltipMenu: '',
      alwaysVisible: false,
      round: false,
      hideLabelIfExtended: false,
      prio: 1,
      class: 'lux-test-class',
      buttonBadge: '',
      buttonBadgeColor: 'primary',
      selected: false
    },
    {
      iconName: 'lux-atom',
      raised: false,
      color: 'primary',
      disabled: false,
      hidden: false,
      label: 'Labeltext 5',
      tooltip: '',
      tooltipMenu: '',
      alwaysVisible: false,
      round: false,
      hideLabelIfExtended: false,
      prio: 1,
      class: 'lux-test-class',
      buttonBadge: '',
      buttonBadgeColor: 'primary',
      selected: false
    },
    {
      iconName: 'lux-interface-logout-circle',
      raised: false,
      color: 'primary',
      disabled: false,
      hidden: false,
      label: 'Abmelden',
      tooltip: '',
      tooltipMenu: '',
      alwaysVisible: false,
      round: false,
      hideLabelIfExtended: false,
      prio: 1,
      class: 'lux-test-class',
      buttonBadge: '',
      buttonBadgeColor: 'primary',
      selected: false
    }
  ];

  menuItemsLarge: ExampleLargeMenuItem[] = [
    {
      iconName: 'lux-components',
      color: 'primary',
      disabled: false,
      hidden: false,
      label: 'Menü-Item 1',
      subtitle: 'Mehr Informationen zum Menü-Item 1',
      tooltipMenu: '',
      class: '',
      buttonBadge: '',
      buttonBadgeColor: 'primary',
      selected: false
    },
    {
      iconName: 'lux-components',
      color: 'primary',
      disabled: false,
      hidden: false,
      label: 'Menü-Item 2',
      subtitle: 'Mehr Informationen zum Menü-Item 2',
      tooltipMenu: '',
      class: '',
      buttonBadge: '',
      buttonBadgeColor: 'primary',
      selected: false
    },
    {
      iconName: 'lux-components',
      color: 'primary',
      disabled: false,
      hidden: false,
      label: 'Menü-Item 3',
      subtitle: 'Mehr Informationen zum Menü-Item 3',
      tooltipMenu: '',
      class: '',
      buttonBadge: '',
      buttonBadgeColor: 'primary',
      selected: false
    },
    {
      iconName: 'lux-components',
      color: 'primary',
      disabled: false,
      hidden: false,
      label: 'Menü-Item 4',
      subtitle: 'Mehr Informationen zum Menü-Item 4',
      tooltipMenu: '',
      class: '',
      buttonBadge: '',
      buttonBadgeColor: 'primary',
      selected: false
    },
    {
      iconName: 'lux-components',
      color: 'primary',
      disabled: false,
      hidden: false,
      label: 'Menü-Item 5',
      subtitle: 'Mehr Informationen zum Menü-Item 5',
      tooltipMenu: '',
      class: '',
      buttonBadge: '',
      buttonBadgeColor: 'primary',
      selected: false
    },
    {
      iconName: 'lux-components',
      color: 'primary',
      disabled: false,
      hidden: false,
      label: 'Menü-Item 6',
      subtitle: 'Mehr Informationen zum Menü-Item 6',
      tooltipMenu: '',
      class: '',
      buttonBadge: '',
      buttonBadgeColor: 'primary',
      selected: false
    },
    {
      iconName: 'lux-components',
      color: 'primary',
      disabled: false,
      hidden: false,
      label: 'Menü-Item 7',
      subtitle: 'Mehr Informationen zum Menü-Item 7',
      tooltipMenu: '',
      class: '',
      buttonBadge: '',
      buttonBadgeColor: 'primary',
      selected: false
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
  selected?: boolean;
}

interface ExampleLargeMenuItem {
  iconName: string;
  color: LuxThemePalette;
  disabled: boolean;
  hidden: boolean;
  label: string;
  subtitle: string;
  tooltipMenu: string;
  class?: string | string[] | Set<string> | Record<string, any>;
  buttonBadge?: string;
  buttonBadgeColor?: LuxThemePalette;
  selected: boolean;
}
