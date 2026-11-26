import type { Meta, StoryObj } from '@storybook/angular-vite';
import { moduleMetadata } from '@storybook/angular-vite';
import { LuxAppHeaderAcComponent } from '../../../lux-app-header-ac.component';
import { LuxAppHeaderAcActionNavComponent } from '../lux-app-header-ac-action-nav.component';
import { LuxAppHeaderAcActionNavItemComponent } from './lux-app-header-ac-action-nav-item.component';

const meta: Meta<LuxAppHeaderAcActionNavItemComponent> = {
  title: 'Layout/lux-app-header-ac-action-nav-item',
  component: LuxAppHeaderAcActionNavItemComponent,
  tags: ['autodocs'],
  decorators: [moduleMetadata({ imports: [LuxAppHeaderAcComponent, LuxAppHeaderAcActionNavComponent] })],
  args: {
    luxLabel: 'Hilfe',
    luxIconName: 'lux-interface-alert-information-circle',
    luxDisabled: false
  }
};

export default meta;
type Story = StoryObj<LuxAppHeaderAcActionNavItemComponent>;

export const Default: Story = {
  render: (args) => ({
    props: args,
    template: `
      <lux-app-header-ac luxUserName="Max Mustermann" luxUserEmail="max.mustermann@example.com" luxAppTitle="Anwendungstitel">
        <lux-app-header-ac-action-nav>
          <lux-app-header-ac-action-nav-item [luxLabel]="luxLabel" [luxIconName]="luxIconName" [luxDisabled]="luxDisabled" />
          <lux-app-header-ac-action-nav-item luxLabel="Deaktiviert" luxIconName="lux-interface-setting-tool-box" [luxDisabled]="true" />
        </lux-app-header-ac-action-nav>
      </lux-app-header-ac>
    `
  })
};
