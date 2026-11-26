import type { Meta, StoryObj } from '@storybook/angular-vite';
import { LuxButtonComponent } from './lux-button.component';

const meta: Meta<LuxButtonComponent> = {
  title: 'Aktion/lux-button',
  component: LuxButtonComponent,
  tags: ['autodocs'],
  args: {
    luxLabel: 'Schaltfläche',
    luxRaised: true
  }
};

export default meta;
type Story = StoryObj<LuxButtonComponent>;

export const Raised: Story = {};

export const Flat: Story = {
  args: {
    luxRaised: false,
    luxFlat: true
  }
};

export const Stroked: Story = {
  args: {
    luxRaised: false,
    luxStroked: true
  }
};

export const Loading: Story = {
  args: {
    luxLoading: true
  }
};
