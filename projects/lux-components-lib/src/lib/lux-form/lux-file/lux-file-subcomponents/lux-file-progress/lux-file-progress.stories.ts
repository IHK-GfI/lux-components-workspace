import type { Meta, StoryObj } from '@storybook/angular-vite';
import { LuxFileProgressComponent } from './lux-file-progress.component';

const meta: Meta<LuxFileProgressComponent> = {
  title: 'Formular/lux-file-progress',
  component: LuxFileProgressComponent,
  tags: ['autodocs'],
  args: {
    luxProgress: 60,
    luxMode: 'determinate'
  }
};

export default meta;
type Story = StoryObj<LuxFileProgressComponent>;

export const Determinate: Story = {};

export const Indeterminate: Story = {
  args: {
    luxMode: 'indeterminate'
  }
};
