import type { Meta, StoryObj } from '@storybook/angular-vite';
import { LuxTileComponent } from './lux-tile.component';

const meta: Meta<LuxTileComponent> = {
  title: 'Layout/lux-tile',
  component: LuxTileComponent,
  tags: ['autodocs'],
  args: {
    luxLabel: 'Kachel',
    luxLabelTruncateAfterOneLine: false,
    luxLabelTruncateAfterTwoLines: false,
    luxShowNotification: false,
    luxCounterCap: 10,
    luxShowShadow: true
  }
};

export default meta;
type Story = StoryObj<LuxTileComponent>;

export const Standard: Story = {};

export const WithCounter: Story = {
  args: {
    luxCounter: 4,
    luxShowNotification: true
  }
};

export const TruncatedLabel: Story = {
  args: {
    luxLabel: 'Ein sehr langer Kachel-Titel, der auf zwei Zeilen gekürzt werden soll',
    luxLabelTruncateAfterTwoLines: true
  }
};

export const WithoutShadow: Story = {
  args: {
    luxShowShadow: false
  }
};
