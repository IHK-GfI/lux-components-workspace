import type { Meta, StoryObj } from '@storybook/angular-vite';
import { LuxChipsComponent } from './lux-chips.component';

const meta: Meta<LuxChipsComponent> = {
  title: 'Formular/lux-chips',
  component: LuxChipsComponent,
  tags: ['autodocs'],
  args: {
    luxLabel: 'Schlagworte',
    luxPlaceholder: 'Schlagwort eingeben',
    luxValue: ['Angular', 'Storybook']
  }
};

export default meta;
type Story = StoryObj<LuxChipsComponent>;

export const Default: Story = {};

export const InputAllowed: Story = {
  args: {
    luxInputAllowed: true,
    luxAutocompleteOptions: ['Angular', 'Storybook', 'Vitest', 'Playwright']
  }
};

export const Vertical: Story = {
  args: {
    luxOrientation: 'vertical',
    luxInputAllowed: true
  }
};
