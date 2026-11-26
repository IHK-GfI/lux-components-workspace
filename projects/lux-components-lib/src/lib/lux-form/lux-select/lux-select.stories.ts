import type { Meta, StoryObj } from '@storybook/angular-vite';
import { LuxSelectComponent } from './lux-select.component';

const meta: Meta<LuxSelectComponent> = {
  title: 'Formular/lux-select',
  component: LuxSelectComponent,
  tags: ['autodocs'],
  args: {
    luxLabel: 'Land',
    luxPlaceholder: 'Bitte auswählen',
    luxOptions: ['Deutschland', 'Frankreich', 'Italien', 'Spanien']
  }
};

export default meta;
type Story = StoryObj<LuxSelectComponent>;

export const Default: Story = {};

export const Multiple: Story = {
  args: {
    luxMultiple: true,
    luxSelected: ['Deutschland', 'Italien']
  }
};

export const WithFilter: Story = {
  args: {
    luxEnableFilter: true,
    luxFilterPlaceholder: 'Land suchen'
  }
};

export const Required: Story = {
  args: {
    luxRequired: true,
    luxHint: 'Pflichtfeld'
  }
};
