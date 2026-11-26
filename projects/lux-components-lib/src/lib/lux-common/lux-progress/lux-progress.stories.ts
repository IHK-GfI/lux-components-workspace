import type { Meta, StoryObj } from '@storybook/angular-vite';
import { LuxProgressComponent } from './lux-progress.component';

const meta: Meta<LuxProgressComponent> = {
  title: 'Allgemein/lux-progress',
  component: LuxProgressComponent,
  tags: ['autodocs'],
  args: {
    luxType: 'Progressbar',
    luxMode: 'indeterminate',
    luxSize: 'medium',
    luxColor: 'blue',
    luxAriaLabel: 'Fortschritt',
    luxShowText: false
  }
};

export default meta;
type Story = StoryObj<LuxProgressComponent>;

export const Indeterminate: Story = {};

export const Determinate: Story = {
  args: {
    luxMode: 'determinate',
    luxValue: 60,
    luxShowText: true,
    luxText: '60 %',
    luxTextPosition: 'top'
  }
};

export const Spinner: Story = {
  args: {
    luxType: 'Spinner',
    luxSize: 'large'
  }
};

export const GedaempftGruen: Story = {
  args: {
    luxMode: 'determinate',
    luxValue: 25,
    luxColor: 'green',
    luxMuted: true
  }
};
