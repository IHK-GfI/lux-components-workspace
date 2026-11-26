import type { Meta, StoryObj } from '@storybook/angular-vite';
import { moduleMetadata } from '@storybook/angular-vite';
import { LuxCardComponent } from '../lux-card.component';
import { LuxCardContentComponent } from './lux-card-content.component';
import { LuxCardInfoComponent } from './lux-card-info.component';

const meta: Meta<LuxCardInfoComponent> = {
  title: 'Layout/lux-card-info',
  component: LuxCardInfoComponent,
  tags: ['autodocs'],
  decorators: [moduleMetadata({ imports: [LuxCardComponent, LuxCardContentComponent] })]
};

export default meta;
type Story = StoryObj<LuxCardInfoComponent>;

export const Default: Story = {
  render: () => ({
    template: `
      <lux-card luxTitle="Titel der Karte">
        <lux-card-info>
          <p>Zusätzliche Informationen zur Karte.</p>
        </lux-card-info>
        <lux-card-content>
          <p>Hier steht der Inhalt der Karte.</p>
        </lux-card-content>
      </lux-card>
    `
  })
};
