import type { Meta, StoryObj } from '@storybook/angular-vite';
import { LuxLookupComboboxComponent } from './lux-lookup-combobox.component';

const meta: Meta<LuxLookupComboboxComponent> = {
  title: 'Lookup/lux-lookup-combobox',
  component: LuxLookupComboboxComponent,
  tags: ['autodocs'],
  args: {
    luxLabel: 'Lookup Combobox',
    luxLookupId: 'storybook-lookup-combobox',
    luxTableNo: '1002',
    luxRenderProp: 'kurzText',
    luxPlaceholder: 'Bitte auswählen'
  }
};

export default meta;
type Story = StoryObj<LuxLookupComboboxComponent>;

export const Default: Story = {};

export const Multiple: Story = {
  args: {
    luxMultiple: true
  }
};

export const WithFilter: Story = {
  args: {
    luxEnableFilter: true,
    luxFilterPlaceholder: 'Filter',
    luxFilterClearAriaLabel: 'Filter löschen'
  }
};
