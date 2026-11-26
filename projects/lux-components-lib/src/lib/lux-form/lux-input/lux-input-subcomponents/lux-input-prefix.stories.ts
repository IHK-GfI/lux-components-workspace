import type { Meta, StoryObj } from '@storybook/angular-vite';
import { LuxInputPrefixComponent } from './lux-input-prefix.component';

const meta: Meta<LuxInputPrefixComponent> = {
  title: 'Formular/lux-input-prefix',
  component: LuxInputPrefixComponent,
  tags: ['autodocs'],
  render: () => ({
    template: `
      <lux-input luxLabel="Betrag" luxType="number" luxPlaceholder="0,00">
        <lux-input-prefix>€</lux-input-prefix>
      </lux-input>
    `
  })
};

export default meta;
type Story = StoryObj<LuxInputPrefixComponent>;

export const Default: Story = {};
