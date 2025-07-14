import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { LuxMenuComponent } from './lux-menu.component';
import { MenuExampleComponent } from '../../../../../demo/components-overview/menu-example/menu-example.component';
import {  getAttributes } from '../../../../../../.storybook/storybook-utils';
import { LuxMenuItemComponent } from './lux-menu-subcomponents/lux-menu-item.component';
import { LuxIconComponent } from '../../lux-icon/lux-icon/lux-icon.component';
import { LuxMenuTriggerComponent } from './lux-menu-subcomponents/lux-menu-trigger.component';
import { LuxThemeService } from '../../lux-theme/lux-theme.service';
import { Control } from '@storybook/addon-docs/blocks';
import { of } from 'rxjs';
import { LuxTooltipDirective } from '../../lux-directives/lux-tooltip/lux-tooltip.directive';

type LuxMenuStoryArgs = Omit<LuxMenuComponent, 'menuItems'> & { menuItems?: LuxMenuItemComponent[] | string };
export const menuItemsArgType = {
  control: 'select' as Control,
  options: ['Default', 'Full Menu', 'Badge Menu'],
  mapping: {
    'Default': [
      { luxLabel: 'Home', luxIconName: 'lux-info'},
      { luxLabel: 'Settings', luxIconName: 'lux-cogs', luxHiddenChange: of(null), luxAlwaysVisibleChange: of(null), luxHideLabelIfExtendedChange: of(null) },
      { luxLabel: 'Home', luxIconName: 'lux-info', luxHiddenChange: of(null), luxAlwaysVisibleChange: of(null), luxHideLabelIfExtendedChange: of(null) },
      { luxLabel: 'Settings', luxIconName: 'lux-cogs', luxHiddenChange: of(null), luxAlwaysVisibleChange: of(null), luxHideLabelIfExtendedChange: of(null) },
    ],
    'Full Menu': [
      { luxLabel: 'Dashboard', luxIconName: 'lux-desktop', luxHiddenChange: of(null), luxAlwaysVisibleChange: of(null), luxHideLabelIfExtendedChange: of(null) },
      { luxLabel: 'Users', luxIconName: 'lux-bluetooth', luxHiddenChange: of(null), luxAlwaysVisibleChange: of(null), luxHideLabelIfExtendedChange: of(null) },
      { luxLabel: 'Logs', luxIconName: 'lux-info', luxHiddenChange: of(null), luxAlwaysVisibleChange: of(null), luxHideLabelIfExtendedChange: of(null) },
      { luxLabel: 'Dashboard', luxIconName: 'lux-desktop', luxHiddenChange: of(null), luxAlwaysVisibleChange: of(null), luxHideLabelIfExtendedChange: of(null) },
      { luxLabel: 'Users', luxIconName: 'lux-bluetooth', luxHiddenChange: of(null), luxAlwaysVisibleChange: of(null), luxHideLabelIfExtendedChange: of(null) },
      { luxLabel: 'Logs', luxIconName: 'lux-info', luxHiddenChange: of(null), luxAlwaysVisibleChange: of(null), luxHideLabelIfExtendedChange: of(null) },
    ],
    'Badge Menu': [
      { luxLabel: 'Profil', luxIconName: 'lux-id-badge', luxHiddenChange: of(null), luxAlwaysVisibleChange: of(null), luxHideLabelIfExtendedChange: of(null) },
      { luxLabel: 'Postfach', luxButtonBadge: '3', luxHiddenChange: of(null), luxAlwaysVisibleChange: of(null), luxHideLabelIfExtendedChange: of(null) },
      { luxLabel: 'Druckauftrag', luxButtonBadge: '5', luxHiddenChange: of(null), luxAlwaysVisibleChange: of(null), luxHideLabelIfExtendedChange: of(null) },
    ],
  },
  description: 'Choose a preset of menu items',
};

const meta: Meta<LuxMenuStoryArgs> = {
  title: 'Lux Components/Action/LuxMenu',
  tags: ['autodocs'],
  component: LuxMenuComponent,
  decorators: [
    moduleMetadata({
      imports: [LuxMenuItemComponent,  LuxIconComponent, LuxMenuComponent, LuxMenuTriggerComponent, LuxTooltipDirective],
      providers: [LuxThemeService, LuxIconComponent],
    }),
  ],
  parameters: {
    layout: 'fullscreen',
  },
  argTypes: {
    menuItems: menuItemsArgType,
  },
};

export default meta;
type Story = StoryObj<LuxMenuStoryArgs>;

export const Default: Story = {
  render: (args) => {
    const { menuItems, ...restArgs } = args;
    const attributes = getAttributes(restArgs);
    return {
      props: {
        ...restArgs,
        menuItems,
      },
      template: `
        <lux-menu ${attributes}>
          @for(item of menuItems; track item; let i = $index){
          <lux-menu-item
            [luxLabel]="item.luxLabel"
            [luxIconName]="item.luxIconName"
            [luxButtonBadge]="item.luxButtonBadge"
            [luxPrio]="item.luxPrio">
          </lux-menu-item>
          }
        </lux-menu>
      `
    };
  },
  args: {
    menuItems: 'Default',
    luxDisplayExtended: true,
    luxMaximumExtended: 2
  },
};

export const Demo: Story = {
  render: () => ({
    template: `<app-menu-example></app-menu-example>`,
  }),
  decorators: [
    moduleMetadata({
      imports: [
        MenuExampleComponent,
      ],
    }),
  ]
};
