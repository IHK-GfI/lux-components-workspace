import type { Meta, StoryObj } from '@storybook/angular-vite';
import { moduleMetadata } from '@storybook/angular-vite';
import { LuxAppHeaderComponent } from '../../lux-app-header.component';
import { LuxAppHeaderActionNavComponent } from './lux-app-header-action-nav.component';
import { LuxAppHeaderActionNavItemComponent } from './lux-app-header-action-nav-item/lux-app-header-action-nav-item.component';

const meta: Meta<LuxAppHeaderActionNavComponent> = {
  title: 'Layout/lux-app-header-action-nav',
  component: LuxAppHeaderActionNavComponent,
  tags: ['autodocs'],
  decorators: [moduleMetadata({ imports: [LuxAppHeaderComponent, LuxAppHeaderActionNavItemComponent] })]
};

export default meta;
type Story = StoryObj<LuxAppHeaderActionNavComponent>;

export const Default: Story = {
  render: () => ({
    template: `
      <lux-app-header luxAppTitle="Anwendungstitel" luxUserName="Max Mustermann">
        <lux-app-header-action-nav>
          <lux-app-header-action-nav-item luxLabel="Hilfe" luxIconName="lux-interface-alert-information-circle" />
          <lux-app-header-action-nav-item luxLabel="Einstellungen" luxIconName="lux-interface-setting-tool-box" />
        </lux-app-header-action-nav>
      </lux-app-header>
    `
  })
};
