import type { Meta, StoryObj } from '@storybook/angular-vite';
import { LuxFormHintComponent } from './lux-form-hint.component';

const meta: Meta<LuxFormHintComponent> = {
  title: 'Formular/lux-form-hint',
  component: LuxFormHintComponent,
  tags: ['autodocs'],
  render: () => ({
    template: `
      <lux-input luxLabel="E-Mail-Adresse" luxType="email">
        <lux-form-hint>Bitte gib deine geschäftliche E-Mail-Adresse an.</lux-form-hint>
      </lux-input>
    `
  })
};

export default meta;
type Story = StoryObj<LuxFormHintComponent>;

export const Default: Story = {};
