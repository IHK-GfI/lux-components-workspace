import type { Meta, StoryObj } from '@storybook/angular-vite';
import { moduleMetadata } from '@storybook/angular-vite';
import { LuxAppHeaderComponent } from '../../../lux-app-header.component';
import { LuxSideNavComponent } from '../lux-side-nav.component';
import { LuxSideNavHeaderComponent } from './lux-side-nav-header.component';
import { LuxSideNavItemComponent } from './lux-side-nav-item.component';

const meta: Meta<LuxSideNavHeaderComponent> = {
  title: 'Layout/lux-side-nav-header',
  component: LuxSideNavHeaderComponent,
  tags: ['autodocs'],
  decorators: [moduleMetadata({ imports: [LuxAppHeaderComponent, LuxSideNavComponent, LuxSideNavItemComponent] })]
};

export default meta;
type Story = StoryObj<LuxSideNavHeaderComponent>;

export const Default: Story = {
  render: () => ({
    template: `
      <lux-app-header luxAppTitle="Anwendungstitel" luxUserName="Max Mustermann">
        <lux-side-nav>
          <lux-side-nav-header>Navigation</lux-side-nav-header>
          <lux-side-nav-item luxLabel="Startseite" luxIconName="lux-interface-alert-information-circle" />
        </lux-side-nav>
      </lux-app-header>
    `
  })
};
