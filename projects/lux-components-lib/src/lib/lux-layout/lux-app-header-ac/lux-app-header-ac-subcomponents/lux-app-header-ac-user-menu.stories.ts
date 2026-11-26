import type { Meta, StoryObj } from '@storybook/angular-vite';
import { moduleMetadata } from '@storybook/angular-vite';
import { LuxAppHeaderAcComponent } from '../lux-app-header-ac.component';
import { LuxAppHeaderAcUserMenuComponent } from './lux-app-header-ac-user-menu.component';

const meta: Meta<LuxAppHeaderAcUserMenuComponent> = {
  title: 'Layout/lux-app-header-ac-user-menu',
  component: LuxAppHeaderAcUserMenuComponent,
  tags: ['autodocs'],
  decorators: [moduleMetadata({ imports: [LuxAppHeaderAcComponent] })],
  args: {
    luxUseSectionsAndHeaderPanel: false
  }
};

export default meta;
type Story = StoryObj<LuxAppHeaderAcUserMenuComponent>;

export const Default: Story = {
  render: (args) => ({
    props: args,
    template: `
      <lux-app-header-ac luxUserName="Max Mustermann" luxUserEmail="max.mustermann@example.com" luxAppTitle="Anwendungstitel">
        <lux-app-header-ac-user-menu [luxUseSectionsAndHeaderPanel]="luxUseSectionsAndHeaderPanel" />
      </lux-app-header-ac>
    `
  })
};

export const WithSectionsAndHeaderPanel: Story = {
  args: {
    luxUseSectionsAndHeaderPanel: true
  },
  render: (args) => ({
    props: args,
    template: `
      <lux-app-header-ac luxUserName="Max Mustermann" luxUserEmail="max.mustermann@example.com" luxAppTitle="Anwendungstitel">
        <lux-app-header-ac-user-menu [luxUseSectionsAndHeaderPanel]="luxUseSectionsAndHeaderPanel" />
      </lux-app-header-ac>
    `
  })
};
