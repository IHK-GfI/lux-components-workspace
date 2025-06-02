import type { Meta, StoryObj } from '@storybook/angular';
import { LuxMenuItemComponent } from './lux-menu-item.component';
import { moduleMetadata } from '@storybook/angular';
import { LuxIconComponent } from '../../../lux-icon/lux-icon/lux-icon.component';
import { LuxMenuComponent } from '../lux-menu.component';
import { LuxThemePalette } from '../../../lux-util/lux-colors.enum';
import { luxColor, luxMenuIconName } from '../../../../../.storybook/common-styles-args';

const meta: Meta<LuxMenuComponent> = {
  title: 'Lux Components/Action/LuxMenuItem',
  component: LuxMenuComponent,
  tags: ['autodocs'],
  decorators: [
    moduleMetadata({
      imports: [LuxMenuItemComponent, LuxIconComponent, LuxMenuComponent],
    }),
  ],
  argTypes: {
    ...luxColor,
    ...luxMenuIconName
  },
};

export default meta;
type Story = StoryObj<LuxMenuComponent>;


export const Prio: Story = {
  args: {
    luxDisplayExtended: true,
    luxMaximumExtended: 3,
    luxColor: luxColor,
    menuItems: [
      { luxLabel: 'Item 1', luxPrio: 2 },
      { luxLabel: 'Item 2', luxPrio: 1 },
      { luxLabel: 'Item 3', luxPrio: 3 },
    ],
  },
  render: (args) => ({
    props: args,
    template: `
      <lux-menu
      [luxMenuIconName]="luxMenuIconName"
        [luxDisplayMenuLeft]="luxDisplayMenuLeft"
        [luxDisplayExtended]="luxDisplayExtended"

        [luxMaximumExtended]="luxMaximumExtended"
      >
        @for (item of menuItems; track item) {
          <lux-menu-item
            [luxLabel]="item.luxLabel"
            [luxPrio]="item.luxPrio"
            [luxColor]="luxColor"
          ></lux-menu-item>
        }
      </lux-menu>
    `,
  }),
};

export const Tooltip: Story = {
  args: {
    luxDisplayExtended: true,
    luxMaximumExtended: 3,
    menuItems: [
      { luxLabel: 'Item 1', luxButtonTooltip: 'Button Tooltip', luxMenuTooltip: 'Menu Tooltip' },
      { luxLabel: 'Item 2', luxButtonTooltip: 'Another Button Tooltip', luxMenuTooltip: 'Another Menu Tooltip' },
    ],
  },
  render: (args) => ({
    props: args,
    template: `
      <lux-menu
        [luxDisplayMenuLeft]="luxDisplayMenuLeft"
        [luxDisplayExtended]="luxDisplayExtended"
        [luxMaximumExtended]="luxMaximumExtended"
      >
        @for (item of menuItems; track item) {
          <lux-menu-item
            [luxLabel]="item.luxLabel"
            [luxButtonTooltip]="item.luxButtonTooltip"
            [luxMenuTooltip]="item.luxMenuTooltip"
          ></lux-menu-item>
        }
      </lux-menu>
    `,
  }),
};

export const IconName: Story = {
  args: {
    luxDisplayExtended: true,
    luxMaximumExtended: 3,
    menuItems: [
      { luxLabel: 'Item 1', luxIconName: 'lux-phone-book' },
      { luxLabel: 'Item 2', luxIconName: 'lux-card' },
    ],
  },
  render: (args) => ({
    props: args,
    template: `
      <lux-menu
        [luxDisplayMenuLeft]="luxDisplayMenuLeft"
        [luxDisplayExtended]="luxDisplayExtended"
        [luxMaximumExtended]="luxMaximumExtended"
      >
        @for (item of menuItems; track item) {
          <lux-menu-item
            [luxLabel]="item.luxLabel"
            [luxIconName]="item.luxIconName"
          ></lux-menu-item>
        }
      </lux-menu>
    `,
  }),
};

export const Color: Story = {
  args: {
    luxDisplayExtended: true,
    luxMaximumExtended: 3,
    menuItems: [
      { luxLabel: 'Primary', luxColor: 'primary' as LuxThemePalette },
      { luxLabel: 'Accent', luxColor: 'accent' as LuxThemePalette },
    ],
  },
  render: (args) => ({
    props: args,
    template: `
      <lux-menu
        [luxDisplayMenuLeft]="luxDisplayMenuLeft"
        [luxDisplayExtended]="luxDisplayExtended"
        [luxMaximumExtended]="luxMaximumExtended"
      >
        @for (item of menuItems; track item) {
          <lux-menu-item
            [luxLabel]="item.luxLabel"
            [luxColor]="item.luxColor"
          ></lux-menu-item>
        }
      </lux-menu>
    `,
  }),
};

export const Raised: Story = {
  args: {
    luxDisplayExtended: true,
    luxMaximumExtended: 3,
    menuItems: [
      { luxLabel: 'Item 1', luxRaised: true },
      { luxLabel: 'Item 2', luxRaised: false },
    ],
  },
  render: (args) => ({
    props: args,
    template: `
      <lux-menu
        [luxDisplayMenuLeft]="luxDisplayMenuLeft"
        [luxDisplayExtended]="luxDisplayExtended"
        [luxMaximumExtended]="luxMaximumExtended"
      >
        @for (item of menuItems; track item) {
          <lux-menu-item
            [luxLabel]="item.luxLabel"
            [luxRaised]="item.luxRaised"
          ></lux-menu-item>
        }
      </lux-menu>
    `,
  }),
};

export const Disabled: Story = {
  args: {
    luxDisplayExtended: true,
    luxMaximumExtended: 3,
    menuItems: [
      { luxLabel: 'Item 1', luxDisabled: true },
      { luxLabel: 'Item 2', luxDisabled: false },
    ],
  },
  render: (args) => ({
    props: args,
    template: `
      <lux-menu
        [luxDisplayMenuLeft]="luxDisplayMenuLeft"
        [luxDisplayExtended]="luxDisplayExtended"
        [luxMaximumExtended]="luxMaximumExtended"
      >
        @for (item of menuItems; track item) {
          <lux-menu-item
            [luxLabel]="item.luxLabel"
            [luxDisabled]="item.luxDisabled"
          ></lux-menu-item>
        }
      </lux-menu>
    `,
  }),
};

export const Hidden: Story = {
  args: {
    luxDisplayExtended: true,
    luxMaximumExtended: 3,
    menuItems: [
      { luxLabel: 'Item 1', luxHidden: true },
      { luxLabel: 'Item 2', luxHidden: false },
    ],
  },
  render: (args) => ({
    props: args,
    template: `
      <lux-menu
        [luxDisplayMenuLeft]="luxDisplayMenuLeft"
        [luxDisplayExtended]="luxDisplayExtended"
        [luxMaximumExtended]="luxMaximumExtended"
      >
        @for (item of menuItems; track item) {
          <lux-menu-item
            [luxLabel]="item.luxLabel"
            [luxHidden]="item.luxHidden"
          ></lux-menu-item>
        }
      </lux-menu>
    `,
  }),
};

export const RoundedStory: Story = {
  args: {
    luxDisplayExtended: true,
    luxMaximumExtended: 3,
    menuItems: [
      {     luxRounded: true,
        luxIconName: 'lux-info',
        luxColor: 'primary',},
      { luxLabel: 'Item 2', luxRounded: false },
    ],
  },
  render: (args) => ({
    props: args,
    template: `
      <lux-menu
        [luxDisplayMenuLeft]="luxDisplayMenuLeft"
        [luxDisplayExtended]="luxDisplayExtended"
        [luxMaximumExtended]="luxMaximumExtended"
      >
        @for (item of menuItems; track item) {
          <lux-menu-item
            [luxLabel]="item.luxLabel"
            [luxRounded]="item.luxRounded"
            [luxIconName]="item.luxIconName"
            [luxColor]="item.luxColor"
          ></lux-menu-item>
        }
      </lux-menu>
    `,
  }),
};


export const ButtonBadgeStory: Story = {
  args: {
    luxDisplayExtended: true,
    luxMaximumExtended: 3,
    menuItems: [
      { luxLabel: 'Item 1', luxButtonBadge: 'New' },
      { luxLabel: 'Item 2', luxButtonBadge: 'Hot' },
    ],
  },
  render: (args) => ({
    props: args,
    template: `
      <lux-menu
        [luxDisplayMenuLeft]="luxDisplayMenuLeft"
        [luxDisplayExtended]="luxDisplayExtended"
        [luxMaximumExtended]="luxMaximumExtended"
      >
        @for (item of menuItems; track item) {
          <lux-menu-item
            [luxLabel]="item.luxLabel"
            [luxButtonBadge]="item.luxButtonBadge"
          ></lux-menu-item>
        }
      </lux-menu>
    `,
  }),
};
