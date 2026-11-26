import type { Meta, StoryObj } from '@storybook/angular-vite';
import { moduleMetadata } from '@storybook/angular-vite';
import { LuxAppHeaderComponent } from '../../lux-app-header.component';
import { LuxSideNavComponent } from './lux-side-nav.component';
import { LuxSideNavFooterComponent } from './lux-side-nav-subcomponents/lux-side-nav-footer.component';
import { LuxSideNavHeaderComponent } from './lux-side-nav-subcomponents/lux-side-nav-header.component';
import { LuxSideNavItemComponent } from './lux-side-nav-subcomponents/lux-side-nav-item.component';

const meta: Meta<LuxSideNavComponent> = {
  title: 'Layout/lux-side-nav',
  component: LuxSideNavComponent,
  tags: ['autodocs'],
  decorators: [
    moduleMetadata({
      imports: [LuxAppHeaderComponent, LuxSideNavHeaderComponent, LuxSideNavItemComponent, LuxSideNavFooterComponent]
    })
  ],
  args: {
    luxDashboardLink: '/',
    luxDashboardLinkTitle: 'LUX Dashboard',
    luxOpenLinkBlank: false
  }
};

export default meta;
type Story = StoryObj<LuxSideNavComponent>;

export const Default: Story = {
  render: (args) => ({
    props: args,
    template: `
      <lux-app-header luxAppTitle="Anwendungstitel" luxUserName="Max Mustermann">
        <lux-side-nav [luxDashboardLink]="luxDashboardLink" [luxDashboardLinkTitle]="luxDashboardLinkTitle" [luxOpenLinkBlank]="luxOpenLinkBlank">
          <lux-side-nav-header>Navigation</lux-side-nav-header>
          <lux-side-nav-item luxLabel="Startseite" luxIconName="lux-interface-alert-information-circle" />
          <lux-side-nav-item luxLabel="Einstellungen" luxIconName="lux-interface-setting-tool-box" />
          <lux-side-nav-footer>Fußbereich</lux-side-nav-footer>
        </lux-side-nav>
      </lux-app-header>
    `
  })
};
