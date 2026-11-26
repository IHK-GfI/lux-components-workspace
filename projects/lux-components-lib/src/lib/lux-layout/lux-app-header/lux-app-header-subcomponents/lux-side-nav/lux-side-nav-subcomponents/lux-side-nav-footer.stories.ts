import type { Meta, StoryObj } from '@storybook/angular-vite';
import { moduleMetadata } from '@storybook/angular-vite';
import { LuxAppHeaderComponent } from '../../../lux-app-header.component';
import { LuxSideNavComponent } from '../lux-side-nav.component';
import { LuxSideNavFooterComponent } from './lux-side-nav-footer.component';
import { LuxSideNavItemComponent } from './lux-side-nav-item.component';

const meta: Meta<LuxSideNavFooterComponent> = {
  title: 'Layout/lux-side-nav-footer',
  component: LuxSideNavFooterComponent,
  tags: ['autodocs'],
  decorators: [moduleMetadata({ imports: [LuxAppHeaderComponent, LuxSideNavComponent, LuxSideNavItemComponent] })]
};

export default meta;
type Story = StoryObj<LuxSideNavFooterComponent>;

export const Default: Story = {
  render: () => ({
    template: `
      <lux-app-header luxAppTitle="Anwendungstitel" luxUserName="Max Mustermann">
        <lux-side-nav>
          <lux-side-nav-item luxLabel="Startseite" luxIconName="lux-interface-alert-information-circle" />
          <lux-side-nav-footer>Fußbereich der Navigation</lux-side-nav-footer>
        </lux-side-nav>
      </lux-app-header>
    `
  })
};
