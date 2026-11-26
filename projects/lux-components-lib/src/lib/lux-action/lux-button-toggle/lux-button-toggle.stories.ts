import type { Meta, StoryObj } from '@storybook/angular-vite';
import { LuxButtonToggleComponent } from './lux-button-toggle.component';

const meta: Meta<LuxButtonToggleComponent> = {
  title: 'Aktion/lux-button-toggle',
  component: LuxButtonToggleComponent,
  tags: ['autodocs'],
  args: {
    luxAriaLabel: 'Ansicht auswählen',
    luxOptions: [
      { label: 'Liste', value: 'list' },
      { label: 'Kacheln', value: 'tiles' },
      { label: 'Karte', value: 'map', disabled: true }
    ]
  }
};

export default meta;
type Story = StoryObj<LuxButtonToggleComponent>;

export const Default: Story = {};

export const Multiple: Story = {
  args: {
    luxMultiple: true
  }
};

export const DenseVertical: Story = {
  args: {
    luxDense: true,
    luxVertical: true
  }
};

export const WithHintAndError: Story = {
  args: {
    luxRequired: true,
    luxHint: 'Bitte wählen Sie eine Ansicht aus.',
    luxError: 'Eine Auswahl ist erforderlich.'
  }
};

export const Disabled: Story = {
  args: {
    luxDisabled: true,
    luxSelected: 'list'
  }
};
