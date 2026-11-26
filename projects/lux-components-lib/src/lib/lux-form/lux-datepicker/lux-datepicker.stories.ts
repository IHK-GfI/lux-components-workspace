import type { Meta, StoryObj } from '@storybook/angular-vite';
import { LuxDatepickerComponent } from './lux-datepicker.component';

const meta: Meta<LuxDatepickerComponent> = {
  title: 'Formular/lux-datepicker',
  component: LuxDatepickerComponent,
  tags: ['autodocs'],
  args: {
    luxLabel: 'Datum',
    luxValue: '2027-03-28'
  }
};

export default meta;
type Story = StoryObj<LuxDatepickerComponent>;

export const Default: Story = {};

export const MinMax: Story = {
  args: {
    luxMinDate: '2027-01-01',
    luxMaxDate: '2027-12-31'
  }
};

export const StartViewYear: Story = {
  args: {
    luxStartView: 'year',
    luxValue: null
  }
};

export const Disabled: Story = {
  args: {
    luxDisabled: true
  }
};
