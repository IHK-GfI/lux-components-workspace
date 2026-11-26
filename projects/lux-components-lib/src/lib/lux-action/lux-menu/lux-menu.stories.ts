import type { Meta, StoryObj } from '@storybook/angular-vite';
import { LuxMenuComponent } from './lux-menu.component';

const meta: Meta<LuxMenuComponent> = {
  title: 'Aktion/lux-menu',
  component: LuxMenuComponent,
  tags: ['autodocs'],
  args: {
    luxMenuLabel: 'Benutzermenü',
    luxMenuIconName: 'lux-interface-user-single'
  },
  render: (args) => ({
    props: args,
    template: `
      <lux-menu [luxMenuLabel]="luxMenuLabel" [luxMenuIconName]="luxMenuIconName" [luxDisplayExtended]="luxDisplayExtended">
        <lux-menu-item luxLabel="Profil" luxIconName="lux-interface-user-single" />
        <lux-menu-item luxLabel="Einstellungen" luxIconName="lux-interface-setting-menu-1" />
        <lux-menu-item luxLabel="Abmelden" luxIconName="lux-interface-logout" />
      </lux-menu>
    `
  })
};

export default meta;
type Story = StoryObj<LuxMenuComponent>;

export const Default: Story = {};

export const Extended: Story = {
  args: {
    luxDisplayExtended: true
  }
};

export const WithSections: Story = {
  args: {
    luxShowSections: true,
    luxMenuPanelLarge: true
  },
  render: (args) => ({
    props: args,
    template: `
      <lux-menu [luxMenuLabel]="luxMenuLabel" [luxShowSections]="luxShowSections" [luxMenuPanelLarge]="luxMenuPanelLarge">
        <lux-menu-panel-header luxTitle="Max Mustermann" luxSubtitle="max.mustermann@example.com" />
        <lux-menu-item luxLabel="Profil" luxMenuItemSubtitle="Persönliche Daten" luxIconName="lux-interface-user-single" />
        <lux-menu-section-title luxTitle="Verwaltung" />
        <lux-menu-item luxLabel="Benachrichtigungen" luxButtonBadge="3" />
        <lux-menu-item luxLabel="Abmelden" luxIconName="lux-interface-logout" />
      </lux-menu>
    `
  })
};

export const WithCustomTrigger: Story = {
  render: (args) => ({
    props: args,
    template: `
      <lux-menu [luxMenuLabel]="luxMenuLabel">
        <lux-menu-trigger>
          <lux-button luxLabel="Aktionen" luxIconName="lux-interface-setting-menu-1" luxFlat="true" />
        </lux-menu-trigger>
        <lux-menu-item luxLabel="Bearbeiten" />
        <lux-menu-item luxLabel="Löschen" luxColor="warn" />
      </lux-menu>
    `
  })
};
