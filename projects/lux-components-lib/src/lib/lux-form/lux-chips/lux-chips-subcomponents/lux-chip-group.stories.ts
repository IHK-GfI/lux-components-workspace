import type { Meta, StoryObj } from '@storybook/angular-vite';
import { LuxChipGroupComponent } from './lux-chip-group.component';

const meta: Meta<LuxChipGroupComponent> = {
  title: 'Formular/lux-chip-group',
  component: LuxChipGroupComponent,
  tags: ['autodocs'],
  args: {
    luxLabels: ['Berlin', 'Hamburg'],
    luxDisabled: false,
    luxRemovable: true,
    luxColor: 'primary'
  }
};

export default meta;
type Story = StoryObj<LuxChipGroupComponent>;

export const Default: Story = {};

export const Disabled: Story = {
  args: {
    luxDisabled: true
  }
};

export const NichtEntfernbar: Story = {
  args: {
    luxRemovable: false
  }
};
