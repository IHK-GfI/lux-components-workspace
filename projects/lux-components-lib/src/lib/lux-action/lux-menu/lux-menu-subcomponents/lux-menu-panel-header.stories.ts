import type { Meta, StoryObj } from '@storybook/angular-vite';
import { LuxMenuPanelHeaderComponent } from './lux-menu-panel-header.component';

const meta: Meta<LuxMenuPanelHeaderComponent> = {
  title: 'Aktion/lux-menu-panel-header',
  component: LuxMenuPanelHeaderComponent,
  tags: ['autodocs'],
  args: {
    luxTitle: 'Max Mustermann',
    luxSubtitle: 'max.mustermann@example.com'
  },
  render: (args) => ({
    props: args,
    template: `
      <lux-menu luxMenuLabel="Menü" [luxShowSections]="true">
        <lux-menu-panel-header [luxTitle]="luxTitle" [luxSubtitle]="luxSubtitle" />
        <lux-menu-item luxLabel="Profil" />
      </lux-menu>
    `
  })
};

export default meta;
type Story = StoryObj<LuxMenuPanelHeaderComponent>;

export const Default: Story = {};

export const WithoutSubtitle: Story = {
  args: {
    luxSubtitle: undefined
  }
};
