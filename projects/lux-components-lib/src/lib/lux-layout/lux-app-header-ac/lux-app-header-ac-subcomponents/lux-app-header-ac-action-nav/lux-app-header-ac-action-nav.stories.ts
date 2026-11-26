import type { Meta, StoryObj } from '@storybook/angular-vite';
import { moduleMetadata } from '@storybook/angular-vite';
import { LuxAppHeaderAcComponent } from '../../lux-app-header-ac.component';
import { LuxAppHeaderAcActionNavComponent } from './lux-app-header-ac-action-nav.component';
import { LuxAppHeaderAcActionNavItemComponent } from './lux-app-header-ac-action-nav-item/lux-app-header-ac-action-nav-item.component';

const meta: Meta<LuxAppHeaderAcActionNavComponent> = {
  title: 'Layout/lux-app-header-ac-action-nav',
  component: LuxAppHeaderAcActionNavComponent,
  tags: ['autodocs'],
  decorators: [moduleMetadata({ imports: [LuxAppHeaderAcComponent, LuxAppHeaderAcActionNavItemComponent] })]
};

export default meta;
type Story = StoryObj<LuxAppHeaderAcActionNavComponent>;

export const Default: Story = {
  render: () => ({
    template: `
      <lux-app-header-ac luxUserName="Max Mustermann" luxUserEmail="max.mustermann@example.com" luxAppTitle="Anwendungstitel">
        <lux-app-header-ac-action-nav>
          <lux-app-header-ac-action-nav-item luxLabel="Hilfe" luxIconName="lux-interface-alert-information-circle" />
          <lux-app-header-ac-action-nav-item luxLabel="Einstellungen" luxIconName="lux-interface-setting-tool-box" />
        </lux-app-header-ac-action-nav>
      </lux-app-header-ac>
    `
  })
};
