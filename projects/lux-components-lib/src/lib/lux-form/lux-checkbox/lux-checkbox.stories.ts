import type { Meta, StoryObj } from '@storybook/angular-vite';
import { LuxCheckboxComponent } from './lux-checkbox.component';

const meta: Meta<LuxCheckboxComponent> = {
  title: 'Formular/lux-checkbox',
  component: LuxCheckboxComponent,
  tags: ['autodocs'],
  args: {
    luxLabel: 'Datenschutzerklärung akzeptieren',
    luxChecked: false
  }
};

export default meta;
type Story = StoryObj<LuxCheckboxComponent>;

export const Default: Story = {};

export const Checked: Story = {
  args: {
    luxChecked: true
  }
};

export const Required: Story = {
  args: {
    luxRequired: true,
    luxHint: 'Pflichtfeld'
  }
};

export const Disabled: Story = {
  args: {
    luxDisabled: true,
    luxChecked: true
  }
};
