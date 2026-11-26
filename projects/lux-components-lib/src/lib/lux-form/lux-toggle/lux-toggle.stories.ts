import type { Meta, StoryObj } from '@storybook/angular-vite';
import { LuxToggleComponent } from './lux-toggle.component';

const meta: Meta<LuxToggleComponent> = {
  title: 'Formular/lux-toggle',
  component: LuxToggleComponent,
  tags: ['autodocs'],
  args: {
    luxLabel: 'Benachrichtigungen',
    luxChecked: false
  }
};

export default meta;
type Story = StoryObj<LuxToggleComponent>;

export const Default: Story = {};

export const Checked: Story = {
  args: {
    luxChecked: true
  }
};

export const Disabled: Story = {
  args: {
    luxDisabled: true,
    luxChecked: true
  }
};
