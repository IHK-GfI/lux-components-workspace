import type { Meta, StoryObj } from '@storybook/angular-vite';
import { moduleMetadata } from '@storybook/angular-vite';
import { LuxAppHeaderComponent } from '../../../lux-app-header.component';
import { LuxAppHeaderActionNavComponent } from '../lux-app-header-action-nav.component';
import { LuxAppHeaderActionNavItemComponent } from './lux-app-header-action-nav-item.component';
import { LuxAppHeaderActionNavItemCustomComponent } from './lux-app-header-action-nav-item-custom.component';

const meta: Meta<LuxAppHeaderActionNavItemCustomComponent> = {
  title: 'Layout/lux-app-header-action-nav-item-custom',
  component: LuxAppHeaderActionNavItemCustomComponent,
  tags: ['autodocs'],
  decorators: [
    moduleMetadata({
      imports: [LuxAppHeaderComponent, LuxAppHeaderActionNavComponent, LuxAppHeaderActionNavItemComponent]
    })
  ]
};

export default meta;
type Story = StoryObj<LuxAppHeaderActionNavItemCustomComponent>;

export const Default: Story = {
  render: () => ({
    template: `
      <lux-app-header luxAppTitle="Anwendungstitel" luxUserName="Max Mustermann">
        <lux-app-header-action-nav>
          <lux-app-header-action-nav-item luxLabel="Benutzerdefiniert">
            <lux-app-header-action-nav-item-custom>
              <span>Individueller Inhalt</span>
            </lux-app-header-action-nav-item-custom>
          </lux-app-header-action-nav-item>
        </lux-app-header-action-nav>
      </lux-app-header>
    `
  })
};
