import type { Meta, StoryObj } from '@storybook/angular-vite';
import { LuxInputComponent } from './lux-input.component';

const meta: Meta<LuxInputComponent> = {
  title: 'Formular/lux-input',
  component: LuxInputComponent,
  tags: ['autodocs'],
  args: {
    luxLabel: 'Name',
    luxPlaceholder: 'Name eingeben',
    luxValue: ''
  }
};

export default meta;
type Story = StoryObj<LuxInputComponent>;

export const Default: Story = {};

export const WithCounterAndClear: Story = {
  args: {
    luxMaxLength: 20,
    luxClearable: true,
    luxClearAriaLabel: 'Eingabe löschen',
    luxValue: 'Max Mustermann'
  }
};

export const Number: Story = {
  args: {
    luxLabel: 'Anzahl',
    luxType: 'number',
    luxMin: 0,
    luxMax: 10,
    luxStep: 1,
    luxValue: 3
  }
};

export const Required: Story = {
  args: {
    luxRequired: true,
    luxHint: 'Pflichtfeld'
  }
};
