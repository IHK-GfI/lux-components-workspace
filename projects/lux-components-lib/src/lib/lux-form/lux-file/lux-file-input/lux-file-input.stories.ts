import type { Meta, StoryObj } from '@storybook/angular-vite';
import { LuxFileInputComponent } from './lux-file-input.component';

const meta: Meta<LuxFileInputComponent> = {
  title: 'Formular/lux-file-input',
  component: LuxFileInputComponent,
  tags: ['autodocs'],
  args: {
    luxLabel: 'Dokument',
    luxPlaceholder: 'Datei auswählen'
  }
};

export default meta;
type Story = StoryObj<LuxFileInputComponent>;

export const Default: Story = {};

export const WithFile: Story = {
  args: {
    luxSelected: { name: 'Bericht.pdf', type: 'application/pdf', size: 204800 }
  }
};

export const Required: Story = {
  args: {
    luxRequired: true,
    luxHint: 'Pflichtfeld'
  }
};

export const Disabled: Story = {
  args: {
    luxDisabled: true
  }
};
