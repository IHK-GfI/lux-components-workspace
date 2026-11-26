import type { Meta, StoryObj } from '@storybook/angular-vite';
import { LuxRadioComponent } from './lux-radio.component';

const meta: Meta<LuxRadioComponent> = {
  title: 'Formular/lux-radio',
  component: LuxRadioComponent,
  tags: ['autodocs'],
  args: {
    luxLabel: 'Anrede',
    luxOptions: ['Herr', 'Frau', 'Divers']
  }
};

export default meta;
type Story = StoryObj<LuxRadioComponent>;

export const Vertical: Story = {};

export const Horizontal: Story = {
  args: {
    luxOrientationVertical: false,
    luxSelected: 'Frau'
  }
};

export const Disabled: Story = {
  args: {
    luxDisabled: true,
    luxSelected: 'Herr'
  }
};
