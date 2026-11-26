import type { Meta, StoryObj } from '@storybook/angular-vite';
import { moduleMetadata } from '@storybook/angular-vite';
import { LuxCardComponent } from '../lux-card.component';
import { LuxCardCustomHeaderComponent } from './lux-card-custom-header.component';

const meta: Meta<LuxCardCustomHeaderComponent> = {
  title: 'Layout/lux-card-custom-header',
  component: LuxCardCustomHeaderComponent,
  tags: ['autodocs'],
  decorators: [moduleMetadata({ imports: [LuxCardComponent] })]
};

export default meta;
type Story = StoryObj<LuxCardCustomHeaderComponent>;

export const Default: Story = {
  render: () => ({
    template: `
      <lux-card>
        <lux-card-custom-header>
          <h3>Individueller Kopfbereich</h3>
        </lux-card-custom-header>
        <lux-card-content>
          <p>Hier steht der Inhalt der Karte.</p>
        </lux-card-content>
      </lux-card>
    `
  })
};
