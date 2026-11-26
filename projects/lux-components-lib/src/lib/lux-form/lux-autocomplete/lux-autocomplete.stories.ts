import type { Meta, StoryObj } from '@storybook/angular-vite';
import { LuxAutocompleteComponent } from './lux-autocomplete.component';

const meta: Meta<LuxAutocompleteComponent> = {
  title: 'Formular/lux-autocomplete',
  component: LuxAutocompleteComponent,
  tags: ['autodocs'],
  args: {
    luxLabel: 'Stadt',
    luxHint: 'Bitte eine Stadt auswählen',
    luxOptions: [{ label: 'Berlin' }, { label: 'Bonn' }, { label: 'Hamburg' }, { label: 'München' }],
    luxOptionLabelProp: 'label'
  }
};

export default meta;
type Story = StoryObj<LuxAutocompleteComponent>;

export const Default: Story = {};

export const Required: Story = {
  args: {
    luxRequired: true,
    luxClearable: true
  }
};

export const Disabled: Story = {
  args: {
    luxDisabled: true,
    luxValue: { label: 'Berlin' }
  }
};
