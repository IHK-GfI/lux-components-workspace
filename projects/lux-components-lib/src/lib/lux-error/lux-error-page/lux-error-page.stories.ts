import type { Meta, StoryObj } from '@storybook/angular-vite';
import { LuxErrorPageComponent } from './lux-error-page.component';

const meta: Meta<LuxErrorPageComponent> = {
  title: 'Fehler/lux-error-page',
  component: LuxErrorPageComponent,
  tags: ['autodocs']
};

export default meta;
type Story = StoryObj<LuxErrorPageComponent>;

export const Default: Story = {};
