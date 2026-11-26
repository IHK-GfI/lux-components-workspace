import type { Meta, StoryObj } from '@storybook/angular-vite';
import { LuxTextareaComponent } from './lux-textarea.component';

const meta: Meta<LuxTextareaComponent> = {
  title: 'Formular/lux-textarea',
  component: LuxTextareaComponent,
  tags: ['autodocs'],
  args: {
    luxLabel: 'Beschreibung',
    luxPlaceholder: 'Beschreibung eingeben'
  }
};

export default meta;
type Story = StoryObj<LuxTextareaComponent>;

export const Default: Story = {};

export const WithCounter: Story = {
  args: {
    luxMaxLength: 200,
    luxHint: 'Maximal 200 Zeichen'
  }
};

export const AutoGrow: Story = {
  args: {
    luxMinRows: 2,
    luxMaxRows: 6
  }
};
