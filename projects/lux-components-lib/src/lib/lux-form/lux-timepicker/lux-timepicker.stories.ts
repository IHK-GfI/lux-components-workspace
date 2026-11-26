import type { Meta, StoryObj } from '@storybook/angular-vite';
import { LuxTimepickerComponent } from './lux-timepicker.component';

const meta: Meta<LuxTimepickerComponent> = {
  title: 'Formular/lux-timepicker',
  component: LuxTimepickerComponent,
  tags: ['autodocs'],
  args: {
    luxLabel: 'Uhrzeit',
    luxValue: '09:30'
  }
};

export default meta;
type Story = StoryObj<LuxTimepickerComponent>;

export const Default: Story = {};

export const Interval: Story = {
  args: {
    luxInterval: '15m',
    luxMinTime: '08:00',
    luxMaxTime: '18:00'
  }
};

export const WithoutToggle: Story = {
  args: {
    luxShowToggle: false
  }
};
