import type { Meta, StoryObj } from '@storybook/angular-vite';
import { moduleMetadata } from '@storybook/angular-vite';
import { LuxMenuItemComponent } from '../../lux-action/lux-menu/lux-menu-subcomponents/lux-menu-item.component';
import { LuxAppHeaderComponent } from './lux-app-header.component';
import { LuxAppHeaderRightNavComponent } from './lux-app-header-subcomponents/lux-app-header-right-nav/lux-app-header-right-nav.component';
import { LuxSideNavComponent } from './lux-app-header-subcomponents/lux-side-nav/lux-side-nav.component';
import { LuxSideNavFooterComponent } from './lux-app-header-subcomponents/lux-side-nav/lux-side-nav-subcomponents/lux-side-nav-footer.component';
import { LuxSideNavHeaderComponent } from './lux-app-header-subcomponents/lux-side-nav/lux-side-nav-subcomponents/lux-side-nav-header.component';
import { LuxSideNavItemComponent } from './lux-app-header-subcomponents/lux-side-nav/lux-side-nav-subcomponents/lux-side-nav-item.component';

const meta: Meta<LuxAppHeaderComponent> = {
  title: 'Layout/lux-app-header',
  component: LuxAppHeaderComponent,
  tags: ['autodocs'],
  decorators: [
    moduleMetadata({
      imports: [
        LuxSideNavComponent,
        LuxSideNavHeaderComponent,
        LuxSideNavItemComponent,
        LuxSideNavFooterComponent,
        LuxAppHeaderRightNavComponent,
        LuxMenuItemComponent
      ]
    })
  ],
  args: {
    luxAppTitle: 'Anwendungstitel',
    luxAppTitleShort: 'AT',
    luxUserName: 'Max Mustermann'
  }
};

export default meta;
type Story = StoryObj<LuxAppHeaderComponent>;

export const Default: Story = {
  render: (args) => ({
    props: args,
    template: `
      <lux-app-header [luxAppTitle]="luxAppTitle" [luxAppTitleShort]="luxAppTitleShort" [luxUserName]="luxUserName" />
    `
  })
};

export const WithSideNavAndRightNav: Story = {
  render: (args) => ({
    props: args,
    template: `
      <lux-app-header [luxAppTitle]="luxAppTitle" [luxAppTitleShort]="luxAppTitleShort" [luxUserName]="luxUserName">
        <lux-app-header-right-nav>
          <lux-menu-item luxLabel="Profil" />
          <lux-menu-item luxLabel="Abmelden" />
        </lux-app-header-right-nav>
        <lux-side-nav luxDashboardLink="/">
          <lux-side-nav-header>Navigation</lux-side-nav-header>
          <lux-side-nav-item luxLabel="Startseite" luxIconName="lux-interface-alert-information-circle" />
          <lux-side-nav-item luxLabel="Einstellungen" luxIconName="lux-interface-setting-tool-box" />
          <lux-side-nav-footer>Fußbereich</lux-side-nav-footer>
        </lux-side-nav>
      </lux-app-header>
    `
  })
};
