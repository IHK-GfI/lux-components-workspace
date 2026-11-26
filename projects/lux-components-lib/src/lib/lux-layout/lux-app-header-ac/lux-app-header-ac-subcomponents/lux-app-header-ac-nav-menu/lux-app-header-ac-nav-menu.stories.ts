import type { Meta, StoryObj } from '@storybook/angular-vite';
import { moduleMetadata } from '@storybook/angular-vite';
import { LuxAppHeaderAcComponent } from '../../lux-app-header-ac.component';
import { LuxAppHeaderAcNavMenuComponent } from './lux-app-header-ac-nav-menu.component';
import { LuxAppHeaderAcNavMenuItemComponent } from './lux-app-header-ac-nav-menu-item/lux-app-header-ac-nav-menu-item.component';

const meta: Meta<LuxAppHeaderAcNavMenuComponent> = {
  title: 'Layout/lux-app-header-ac-nav-menu',
  component: LuxAppHeaderAcNavMenuComponent,
  tags: ['autodocs'],
  decorators: [moduleMetadata({ imports: [LuxAppHeaderAcComponent, LuxAppHeaderAcNavMenuItemComponent] })],
  args: {
    luxNavMenuMaximumExtended: 5
  }
};

export default meta;
type Story = StoryObj<LuxAppHeaderAcNavMenuComponent>;

export const Default: Story = {
  render: (args) => ({
    props: args,
    template: `
      <lux-app-header-ac luxUserName="Max Mustermann" luxUserEmail="max.mustermann@example.com" luxAppTitle="Anwendungstitel">
        <lux-app-header-ac-nav-menu [luxNavMenuMaximumExtended]="luxNavMenuMaximumExtended">
          <lux-app-header-ac-nav-menu-item luxLabel="Startseite" [luxSelected]="true" />
          <lux-app-header-ac-nav-menu-item luxLabel="Dokumente" />
          <lux-app-header-ac-nav-menu-item luxLabel="Berichte" />
          <lux-app-header-ac-nav-menu-item luxLabel="Archiv" />
          <lux-app-header-ac-nav-menu-item luxLabel="Verwaltung" />
          <lux-app-header-ac-nav-menu-item luxLabel="Hilfe" />
        </lux-app-header-ac-nav-menu>
      </lux-app-header-ac>
    `
  })
};

export const FewerExtendedItems: Story = {
  args: {
    luxNavMenuMaximumExtended: 2
  },
  render: (args) => ({
    props: args,
    template: `
      <lux-app-header-ac luxUserName="Max Mustermann" luxUserEmail="max.mustermann@example.com" luxAppTitle="Anwendungstitel">
        <lux-app-header-ac-nav-menu [luxNavMenuMaximumExtended]="luxNavMenuMaximumExtended">
          <lux-app-header-ac-nav-menu-item luxLabel="Startseite" [luxSelected]="true" />
          <lux-app-header-ac-nav-menu-item luxLabel="Dokumente" />
          <lux-app-header-ac-nav-menu-item luxLabel="Berichte" />
          <lux-app-header-ac-nav-menu-item luxLabel="Archiv" />
        </lux-app-header-ac-nav-menu>
      </lux-app-header-ac>
    `
  })
};
