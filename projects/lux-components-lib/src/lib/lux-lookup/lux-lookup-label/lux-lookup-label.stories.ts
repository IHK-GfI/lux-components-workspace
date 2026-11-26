import type { Meta, StoryObj } from '@storybook/angular-vite';
import { LuxLookupLabelComponent } from './lux-lookup-label.component';

const meta: Meta<LuxLookupLabelComponent> = {
  title: 'Lookup/lux-lookup-label',
  component: LuxLookupLabelComponent,
  tags: ['autodocs'],
  args: {
    luxLookupId: 'storybook-lookup-label',
    luxTableNo: '1002',
    luxTableKey: '4',
    luxBezeichnung: 'kurz'
  }
};

export default meta;
type Story = StoryObj<LuxLookupLabelComponent>;

export const Default: Story = {};

export const LangeBezeichnung: Story = {
  args: {
    luxBezeichnung: 'lang'
  }
};
