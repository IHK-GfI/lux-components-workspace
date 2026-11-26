import type { Meta, StoryObj } from '@storybook/angular-vite';
import { LuxFormLabelComponent } from './lux-form-label.component';

const meta: Meta<LuxFormLabelComponent> = {
  title: 'Formular/lux-form-label',
  component: LuxFormLabelComponent,
  tags: ['autodocs'],
  render: () => ({
    template: `
      <lux-input luxType="text" luxPlaceholder="Vorname">
        <lux-form-label>Vorname <strong>(Pflichtfeld)</strong></lux-form-label>
      </lux-input>
    `
  })
};

export default meta;
type Story = StoryObj<LuxFormLabelComponent>;

export const Default: Story = {};
