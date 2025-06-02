import type { Meta, StoryObj } from '@storybook/angular';
import { LuxMenuComponent } from './lux-menu.component';
import { LuxMenuItemComponent } from './lux-menu-subcomponents/lux-menu-item.component';
import { moduleMetadata } from '@storybook/angular';
import { LuxButtonComponent } from '../lux-button/lux-button.component';
import { LuxIconComponent } from '../../lux-icon/lux-icon/lux-icon.component';
import { LuxThemeService } from '../../lux-theme/lux-theme.service';
import { LuxMenuTriggerComponent } from '../../../public_api';
import { Control } from '@storybook/blocks';

const menuItemsArgType = {
  control: 'select' as Control,
  options: ['Default', 'Full Menu', 'Badge Menu'],
  mapping: {
    'Default': [
      { luxLabel: 'Home', luxIconName: 'lux-info' },
      { luxLabel: 'Settings', luxIconName: 'lux-cogs' },
      { luxLabel: 'Home', luxIconName: 'lux-info' },
      { luxLabel: 'Settings', luxIconName: 'lux-cogs' },
    ],
    'Full Menu': [
      { luxLabel: 'Dashboard', luxIconName: 'lux-desktop'},
      { luxLabel: 'Users', luxIconName: 'lux-bluetooth'},
      { luxLabel: 'Logs', luxIconName: 'lux-info' },
      { luxLabel: 'Dashboard', luxIconName: 'lux-desktop'},
      { luxLabel: 'Users', luxIconName: 'lux-bluetooth'},
      { luxLabel: 'Logs', luxIconName: 'lux-info' },
    ],
    'Badge Menu': [
      { luxLabel: 'Profil', luxIconName: 'lux-id-badge'},
      { luxLabel: 'Postfach', luxButtonBadge: '3'},
      { luxLabel: 'Druckauftrag', luxButtonBadge: '5'},
    ],
  },
  description: 'Choose a preset of menu items',
};

const meta: Meta<LuxMenuComponent> = {
  title: 'Lux Components/Action/LuxMenu',
  component: LuxMenuComponent,
  tags: ['autodocs'],
  decorators: [
    moduleMetadata({
      imports: [LuxMenuItemComponent, LuxButtonComponent, LuxIconComponent, LuxMenuComponent, LuxMenuTriggerComponent],
      providers: [LuxThemeService, LuxIconComponent],
    }),
  ],
  argTypes: {
    menuItems: menuItemsArgType,
  },
};

export default meta;
type Story = StoryObj<LuxMenuComponent>;


export const DisplayMenuRight: Story = {
  args: {
    luxDisplayExtended: true,
    luxDisplayMenuLeft: true,
    luxMaximumExtended: 2,
    menuItems: 'Default'
  },
  render: (args) => {
    const menuItems = args.menuItems ?? [];
    return {
      props: {
        ...args,
        menuItems: menuItems
      },
      template: `
        <lux-menu
          [luxMenuLabel]="luxMenuLabel"
          [luxTagId]="luxTagId"
          [luxDisplayMenuLeft]="luxDisplayMenuLeft"
          [luxDisplayExtended]="luxDisplayExtended"
          [luxMaximumExtended]="luxMaximumExtended"
        >
          @for (item of menuItems; track item) {
            <lux-menu-item
              [luxLabel]="item.luxLabel"
              [luxDisabled]="item.luxDisabled"
              [luxIconName]="item.luxIconName"
              [luxButtonBadge]="item.luxButtonBadge"
            ></lux-menu-item>
          }
        </lux-menu>
      `,
    };
  },
};


export const DisplayNotExtended: Story = {
  args: {
  },
  render: (args) => ({
    props: args,
    template: `
      <lux-menu>
        <lux-menu-item luxLabel="Item 1"></lux-menu-item>
        <lux-menu-item luxLabel="Item 2"></lux-menu-item>
        <lux-menu-item luxLabel="Item 3"></lux-menu-item>
        <lux-menu-item luxLabel="Item 4"></lux-menu-item>
        <lux-menu-item luxLabel="Item 5"></lux-menu-item>
      </lux-menu>
    `,
  }),
}
