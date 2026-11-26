import type { Meta, StoryObj } from '@storybook/angular-vite';
import { moduleMetadata } from '@storybook/angular-vite';
import { LuxAppHeaderAcComponent } from '../../../lux-app-header-ac.component';
import { LuxAppHeaderAcActionNavComponent } from '../lux-app-header-ac-action-nav.component';
import { LuxAppHeaderAcActionNavItemComponent } from './lux-app-header-ac-action-nav-item.component';
import { LuxAppHeaderAcActionNavItemCustomComponent } from './lux-app-header-ac-action-nav-item-custom.component';

const meta: Meta<LuxAppHeaderAcActionNavItemCustomComponent> = {
  title: 'Layout/lux-app-header-ac-action-nav-item-custom',
  component: LuxAppHeaderAcActionNavItemCustomComponent,
  tags: ['autodocs'],
  decorators: [
    moduleMetadata({
      imports: [LuxAppHeaderAcComponent, LuxAppHeaderAcActionNavComponent, LuxAppHeaderAcActionNavItemComponent]
    })
  ]
};

export default meta;
type Story = StoryObj<LuxAppHeaderAcActionNavItemCustomComponent>;

export const Default: Story = {
  render: () => ({
    template: `
      <lux-app-header-ac luxUserName="Max Mustermann" luxUserEmail="max.mustermann@example.com" luxAppTitle="Anwendungstitel">
        <lux-app-header-ac-action-nav>
          <lux-app-header-ac-action-nav-item luxLabel="Benutzerdefiniert">
            <lux-app-header-ac-action-nav-item-custom>
              <span>Individueller Inhalt</span>
            </lux-app-header-ac-action-nav-item-custom>
          </lux-app-header-ac-action-nav-item>
        </lux-app-header-ac-action-nav>
      </lux-app-header-ac>
    `
  })
};
