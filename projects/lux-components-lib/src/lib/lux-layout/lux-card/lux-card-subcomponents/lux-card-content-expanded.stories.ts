import type { Meta, StoryObj } from '@storybook/angular-vite';
import { moduleMetadata } from '@storybook/angular-vite';
import { LuxCardComponent } from '../lux-card.component';
import { LuxCardContentExpandedComponent } from './lux-card-content-expanded.component';
import { LuxCardContentComponent } from './lux-card-content.component';

const meta: Meta<LuxCardContentExpandedComponent> = {
  title: 'Layout/lux-card-content-expanded',
  component: LuxCardContentExpandedComponent,
  tags: ['autodocs'],
  decorators: [moduleMetadata({ imports: [LuxCardComponent, LuxCardContentComponent] })],
  args: {
    luxExpanded: false,
    luxExpandedLabelOpen: 'Mehr anzeigen',
    luxExpandedLabelClose: 'Weniger anzeigen'
  }
};

export default meta;
type Story = StoryObj<LuxCardContentExpandedComponent>;

export const Default: Story = {
  render: (args) => ({
    props: args,
    template: `
      <lux-card
        luxTitle="Titel der Karte"
        [luxExpandedLabelOpen]="luxExpandedLabelOpen"
        [luxExpandedLabelClose]="luxExpandedLabelClose"
        [(luxExpanded)]="luxExpanded"
      >
        <lux-card-content>
          <p>Dieser Inhalt ist immer sichtbar.</p>
        </lux-card-content>
        <lux-card-content-expanded>
          <p>Dieser Inhalt wird beim Aufklappen angezeigt.</p>
        </lux-card-content-expanded>
      </lux-card>
    `
  })
};
