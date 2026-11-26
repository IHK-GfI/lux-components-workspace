import type { Meta, StoryObj } from '@storybook/angular-vite';
import { LuxHttpErrorComponent } from './lux-http-error.component';

const meta: Meta<LuxHttpErrorComponent> = {
  title: 'Fehler/lux-http-error',
  component: LuxHttpErrorComponent,
  tags: ['autodocs']
};

export default meta;
type Story = StoryObj<LuxHttpErrorComponent>;

export const Default: Story = {};
