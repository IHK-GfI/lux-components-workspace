import type { Meta, StoryObj } from '@storybook/angular-vite';
import { LuxMenuItemComponent } from './lux-menu-item.component';

const meta: Meta<LuxMenuItemComponent> = {
  title: 'Aktion/lux-menu-item',
  component: LuxMenuItemComponent,
  tags: ['autodocs'],
  args: {
    luxLabel: 'Profil',
    luxIconName: 'lux-interface-user-single'
  },
  render: (args) => ({
    props: args,
    template: `
      <lux-menu luxMenuLabel="Menü">
        <lux-menu-item
          [luxLabel]="luxLabel"
          [luxIconName]="luxIconName"
          [luxDisabled]="luxDisabled"
          [luxButtonBadge]="luxButtonBadge"
          [luxMenuItemSubtitle]="luxMenuItemSubtitle"
        />
      </lux-menu>
    `
  })
};

export default meta;
type Story = StoryObj<LuxMenuItemComponent>;

export const Default: Story = {};

export const WithBadge: Story = {
  args: {
    luxButtonBadge: '5',
    luxButtonBadgeColor: 'warn'
  }
};

export const WithSubtitle: Story = {
  args: {
    luxMenuItemSubtitle: 'Persönliche Daten bearbeiten'
  }
};

export const Disabled: Story = {
  args: {
    luxDisabled: true
  }
};
