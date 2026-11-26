import type { Meta, StoryObj } from '@storybook/angular-vite';
import { LuxMenuSectionTitleComponent } from './lux-menu-section-title.component';

const meta: Meta<LuxMenuSectionTitleComponent> = {
  title: 'Aktion/lux-menu-section-title',
  component: LuxMenuSectionTitleComponent,
  tags: ['autodocs'],
  args: {
    luxTitle: 'Verwaltung'
  },
  render: (args) => ({
    props: args,
    template: `
      <lux-menu luxMenuLabel="Menü" [luxShowSections]="true">
        <lux-menu-item luxLabel="Profil" />
        <lux-menu-section-title [luxTitle]="luxTitle" />
        <lux-menu-item luxLabel="Benachrichtigungen" />
      </lux-menu>
    `
  })
};

export default meta;
type Story = StoryObj<LuxMenuSectionTitleComponent>;

export const Default: Story = {};
