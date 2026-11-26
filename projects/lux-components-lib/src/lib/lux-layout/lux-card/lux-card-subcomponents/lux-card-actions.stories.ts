import type { Meta, StoryObj } from '@storybook/angular-vite';
import { moduleMetadata } from '@storybook/angular-vite';
import { LuxCardComponent } from '../lux-card.component';
import { LuxCardActionsComponent } from './lux-card-actions.component';

const meta: Meta<LuxCardActionsComponent> = {
  title: 'Layout/lux-card-actions',
  component: LuxCardActionsComponent,
  tags: ['autodocs'],
  decorators: [moduleMetadata({ imports: [LuxCardComponent] })],
  args: {
    luxAlign: 'right'
  }
};

export default meta;
type Story = StoryObj<LuxCardActionsComponent>;

export const Default: Story = {
  render: (args) => ({
    props: args,
    template: `
      <lux-card luxTitle="Titel der Karte">
        <lux-card-content>
          <p>Hier steht der Inhalt der Karte.</p>
        </lux-card-content>
        <lux-card-actions [luxAlign]="luxAlign">
          <p>Aktionsbereich</p>
        </lux-card-actions>
      </lux-card>
    `
  })
};
