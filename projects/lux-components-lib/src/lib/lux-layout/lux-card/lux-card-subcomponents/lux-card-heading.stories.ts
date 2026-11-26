import type { Meta, StoryObj } from '@storybook/angular-vite';
import { moduleMetadata } from '@storybook/angular-vite';
import { LuxCardComponent } from '../lux-card.component';
import { LuxCardHeadingComponent } from './lux-card-heading.component';

const meta: Meta<LuxCardHeadingComponent> = {
  title: 'Layout/lux-card-heading',
  component: LuxCardHeadingComponent,
  tags: ['autodocs'],
  decorators: [moduleMetadata({ imports: [LuxCardComponent] })],
  args: {
    luxLevel: 2,
    luxText: 'Überschrift der Karte'
  }
};

export default meta;
type Story = StoryObj<LuxCardHeadingComponent>;

export const Default: Story = {
  render: (args) => ({
    props: args,
    template: `
      <lux-card>
        <lux-card-heading [luxLevel]="luxLevel" [luxText]="luxText" />
        <lux-card-content>
          <p>Hier steht der Inhalt der Karte.</p>
        </lux-card-content>
      </lux-card>
    `
  })
};
