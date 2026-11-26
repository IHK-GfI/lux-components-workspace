import type { Meta, StoryObj } from '@storybook/angular-vite';
import { LuxTenantLogoComponent } from './lux-tenant-logo.component';

const meta: Meta<LuxTenantLogoComponent> = {
  title: 'Mandant/lux-tenant-logo',
  component: LuxTenantLogoComponent,
  tags: ['autodocs'],
  args: {
    luxTenantKey: 'demo',
    luxTenantLogoHeight: '40px'
  }
};

export default meta;
type Story = StoryObj<LuxTenantLogoComponent>;

export const Default: Story = {};

export const WithVariant: Story = {
  args: {
    luxTenantVariant: 'kurz'
  }
};
