import type { Meta, StoryObj } from '@storybook/angular-vite';
import { moduleMetadata } from '@storybook/angular-vite';
import { LuxMenuItemComponent } from '../../../../lux-action/lux-menu/lux-menu-subcomponents/lux-menu-item.component';
import { LuxAppHeaderComponent } from '../../lux-app-header.component';
import { LuxAppHeaderRightNavComponent } from './lux-app-header-right-nav.component';

const meta: Meta<LuxAppHeaderRightNavComponent> = {
  title: 'Layout/lux-app-header-right-nav',
  component: LuxAppHeaderRightNavComponent,
  tags: ['autodocs'],
  decorators: [moduleMetadata({ imports: [LuxAppHeaderComponent, LuxMenuItemComponent] })]
};

export default meta;
type Story = StoryObj<LuxAppHeaderRightNavComponent>;

export const Default: Story = {
  render: () => ({
    template: `
      <lux-app-header luxAppTitle="Anwendungstitel" luxUserName="Max Mustermann">
        <lux-app-header-right-nav>
          <lux-menu-item luxLabel="Profil" />
          <lux-menu-item luxLabel="Einstellungen" />
          <lux-menu-item luxLabel="Abmelden" />
        </lux-app-header-right-nav>
      </lux-app-header>
    `
  })
};
