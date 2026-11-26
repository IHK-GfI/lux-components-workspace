import type { Meta, StoryObj } from '@storybook/angular-vite';
import { LuxInputSuffixComponent } from './lux-input-suffix.component';

const meta: Meta<LuxInputSuffixComponent> = {
  title: 'Formular/lux-input-suffix',
  component: LuxInputSuffixComponent,
  tags: ['autodocs'],
  render: () => ({
    template: `
      <lux-input luxLabel="Gewicht" luxType="number" luxPlaceholder="0">
        <lux-input-suffix>kg</lux-input-suffix>
      </lux-input>
    `
  })
};

export default meta;
type Story = StoryObj<LuxInputSuffixComponent>;

export const Default: Story = {};
