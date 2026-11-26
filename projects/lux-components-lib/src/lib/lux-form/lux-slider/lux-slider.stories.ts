import type { Meta, StoryObj } from '@storybook/angular-vite';
import { LuxSliderComponent } from './lux-slider.component';

const meta: Meta<LuxSliderComponent> = {
  title: 'Formular/lux-slider',
  component: LuxSliderComponent,
  tags: ['autodocs'],
  args: {
    luxLabel: 'Lautstärke',
    luxValue: 40,
    luxMin: 0,
    luxMax: 100,
    luxStep: 5
  }
};

export default meta;
type Story = StoryObj<LuxSliderComponent>;

export const Default: Story = {};

export const Accent: Story = {
  args: {
    luxColor: 'accent',
    luxShowThumbLabel: false
  }
};

export const Disabled: Story = {
  args: {
    luxDisabled: true
  }
};
