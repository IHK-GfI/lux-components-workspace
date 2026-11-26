import type { Meta, StoryObj } from '@storybook/angular-vite';
import { moduleMetadata } from '@storybook/angular-vite';
import { LuxAppHeaderAcComponent } from '../../../lux-app-header-ac.component';
import { LuxAppHeaderAcNavMenuComponent } from '../lux-app-header-ac-nav-menu.component';
import { LuxAppHeaderAcNavMenuItemComponent } from './lux-app-header-ac-nav-menu-item.component';

const meta: Meta<LuxAppHeaderAcNavMenuItemComponent> = {
  title: 'Layout/lux-app-header-ac-nav-menu-item',
  component: LuxAppHeaderAcNavMenuItemComponent,
  tags: ['autodocs'],
  decorators: [moduleMetadata({ imports: [LuxAppHeaderAcComponent, LuxAppHeaderAcNavMenuComponent] })],
  args: {
    luxLabel: 'Dokumente',
    luxSelected: false
  }
};

export default meta;
type Story = StoryObj<LuxAppHeaderAcNavMenuItemComponent>;

export const Default: Story = {
  render: (args) => ({
    props: args,
    template: `
      <lux-app-header-ac luxUserName="Max Mustermann" luxUserEmail="max.mustermann@example.com" luxAppTitle="Anwendungstitel">
        <lux-app-header-ac-nav-menu>
          <lux-app-header-ac-nav-menu-item luxLabel="Startseite" [luxSelected]="true" />
          <lux-app-header-ac-nav-menu-item [luxLabel]="luxLabel" [luxSelected]="luxSelected" />
          <lux-app-header-ac-nav-menu-item luxLabel="Berichte" />
        </lux-app-header-ac-nav-menu>
      </lux-app-header-ac>
    `
  })
};

export const Selected: Story = {
  args: {
    luxLabel: 'Dokumente',
    luxSelected: true
  },
  render: (args) => ({
    props: args,
    template: `
      <lux-app-header-ac luxUserName="Max Mustermann" luxUserEmail="max.mustermann@example.com" luxAppTitle="Anwendungstitel">
        <lux-app-header-ac-nav-menu>
          <lux-app-header-ac-nav-menu-item luxLabel="Startseite" />
          <lux-app-header-ac-nav-menu-item [luxLabel]="luxLabel" [luxSelected]="luxSelected" />
          <lux-app-header-ac-nav-menu-item luxLabel="Berichte" />
        </lux-app-header-ac-nav-menu>
      </lux-app-header-ac>
    `
  })
};
