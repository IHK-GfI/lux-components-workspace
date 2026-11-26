import type { Meta, StoryObj } from '@storybook/angular-vite';
import { LuxMenuTriggerComponent } from './lux-menu-trigger.component';

const meta: Meta<LuxMenuTriggerComponent> = {
  title: 'Aktion/lux-menu-trigger',
  component: LuxMenuTriggerComponent,
  tags: ['autodocs'],
  render: (args) => ({
    props: args,
    template: `
      <lux-menu luxMenuLabel="Menü">
        <lux-menu-trigger>
          <lux-button luxLabel="Aktionen" luxIconName="lux-interface-setting-menu-1" luxFlat="true" />
        </lux-menu-trigger>
        <lux-menu-item luxLabel="Bearbeiten" />
        <lux-menu-item luxLabel="Löschen" luxColor="warn" />
      </lux-menu>
    `
  })
};

export default meta;
type Story = StoryObj<LuxMenuTriggerComponent>;

export const Default: Story = {};
