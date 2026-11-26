import type { Meta, StoryObj } from '@storybook/angular-vite';
import { moduleMetadata } from '@storybook/angular-vite';
import { LuxCardComponent } from '../lux-card.component';
import { LuxCardContentComponent } from './lux-card-content.component';

const meta: Meta<LuxCardContentComponent> = {
  title: 'Layout/lux-card-content',
  component: LuxCardContentComponent,
  tags: ['autodocs'],
  decorators: [moduleMetadata({ imports: [LuxCardComponent] })]
};

export default meta;
type Story = StoryObj<LuxCardContentComponent>;

export const Default: Story = {
  render: () => ({
    template: `
      <lux-card luxTitle="Titel der Karte">
        <lux-card-content>
          <p>Hier steht der Inhalt der Karte.</p>
        </lux-card-content>
      </lux-card>
    `
  })
};
