import type { Meta, StoryObj } from '@storybook/angular-vite';
import { moduleMetadata } from '@storybook/angular-vite';
import { LuxAppHeaderAcComponent } from './lux-app-header-ac.component';
import { LuxAppHeaderAcActionNavComponent } from './lux-app-header-ac-subcomponents/lux-app-header-ac-action-nav/lux-app-header-ac-action-nav.component';
import { LuxAppHeaderAcActionNavItemComponent } from './lux-app-header-ac-subcomponents/lux-app-header-ac-action-nav/lux-app-header-ac-action-nav-item/lux-app-header-ac-action-nav-item.component';
import { LuxAppHeaderAcNavMenuComponent } from './lux-app-header-ac-subcomponents/lux-app-header-ac-nav-menu/lux-app-header-ac-nav-menu.component';
import { LuxAppHeaderAcNavMenuItemComponent } from './lux-app-header-ac-subcomponents/lux-app-header-ac-nav-menu/lux-app-header-ac-nav-menu-item/lux-app-header-ac-nav-menu-item.component';
import { LuxAppHeaderAcUserMenuComponent } from './lux-app-header-ac-subcomponents/lux-app-header-ac-user-menu.component';

const meta: Meta<LuxAppHeaderAcComponent> = {
  title: 'Layout/lux-app-header-ac',
  component: LuxAppHeaderAcComponent,
  tags: ['autodocs'],
  decorators: [
    moduleMetadata({
      imports: [
        LuxAppHeaderAcActionNavComponent,
        LuxAppHeaderAcActionNavItemComponent,
        LuxAppHeaderAcNavMenuComponent,
        LuxAppHeaderAcNavMenuItemComponent,
        LuxAppHeaderAcUserMenuComponent
      ]
    })
  ],
  args: {
    luxUserName: 'Max Mustermann',
    luxUserEmail: 'max.mustermann@example.com',
    luxAppTitle: 'Anwendungstitel',
    luxHideTopBar: false,
    luxHideNavBar: false
  }
};

export default meta;
type Story = StoryObj<LuxAppHeaderAcComponent>;

export const Default: Story = {
  render: (args) => ({
    props: args,
    template: `
      <lux-app-header-ac
        [luxUserName]="luxUserName"
        [luxUserEmail]="luxUserEmail"
        [luxAppTitle]="luxAppTitle"
        [luxHideTopBar]="luxHideTopBar"
        [luxHideNavBar]="luxHideNavBar"
      >
        <lux-app-header-ac-nav-menu>
          <lux-app-header-ac-nav-menu-item luxLabel="Startseite" [luxSelected]="true" />
          <lux-app-header-ac-nav-menu-item luxLabel="Dokumente" />
          <lux-app-header-ac-nav-menu-item luxLabel="Berichte" />
        </lux-app-header-ac-nav-menu>
        <lux-app-header-ac-user-menu />
        <lux-app-header-ac-action-nav>
          <lux-app-header-ac-action-nav-item luxLabel="Hilfe" luxIconName="lux-interface-alert-information-circle" />
          <lux-app-header-ac-action-nav-item luxLabel="Einstellungen" luxIconName="lux-interface-setting-tool-box" />
        </lux-app-header-ac-action-nav>
      </lux-app-header-ac>
    `
  })
};

export const WithoutNavBar: Story = {
  args: {
    luxHideNavBar: true
  },
  render: (args) => ({
    props: args,
    template: `
      <lux-app-header-ac
        [luxUserName]="luxUserName"
        [luxUserEmail]="luxUserEmail"
        [luxAppTitle]="luxAppTitle"
        [luxHideNavBar]="luxHideNavBar"
      >
        <lux-app-header-ac-user-menu />
      </lux-app-header-ac>
    `
  })
};
