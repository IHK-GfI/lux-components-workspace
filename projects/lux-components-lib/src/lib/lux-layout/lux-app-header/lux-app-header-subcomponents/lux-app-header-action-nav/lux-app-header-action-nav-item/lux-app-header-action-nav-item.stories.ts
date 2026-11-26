import type { Meta, StoryObj } from '@storybook/angular-vite';
import { moduleMetadata } from '@storybook/angular-vite';
import { LuxAppHeaderComponent } from '../../../lux-app-header.component';
import { LuxAppHeaderActionNavComponent } from '../lux-app-header-action-nav.component';
import { LuxAppHeaderActionNavItemComponent } from './lux-app-header-action-nav-item.component';

const meta: Meta<LuxAppHeaderActionNavItemComponent> = {
  title: 'Layout/lux-app-header-action-nav-item',
  component: LuxAppHeaderActionNavItemComponent,
  tags: ['autodocs'],
  decorators: [moduleMetadata({ imports: [LuxAppHeaderComponent, LuxAppHeaderActionNavComponent] })],
  args: {
    luxLabel: 'Hilfe',
    luxIconName: 'lux-interface-alert-information-circle',
    luxDisabled: false
  }
};

export default meta;
type Story = StoryObj<LuxAppHeaderActionNavItemComponent>;

export const Default: Story = {
  render: (args) => ({
    props: args,
    template: `
      <lux-app-header luxAppTitle="Anwendungstitel" luxUserName="Max Mustermann">
        <lux-app-header-action-nav>
          <lux-app-header-action-nav-item [luxLabel]="luxLabel" [luxIconName]="luxIconName" [luxDisabled]="luxDisabled" />
          <lux-app-header-action-nav-item luxLabel="Deaktiviert" luxIconName="lux-interface-setting-tool-box" [luxDisabled]="true" />
        </lux-app-header-action-nav>
      </lux-app-header>
    `
  })
};
