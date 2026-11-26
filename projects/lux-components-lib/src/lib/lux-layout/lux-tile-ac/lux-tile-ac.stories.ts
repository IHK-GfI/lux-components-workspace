import type { Meta, StoryObj } from '@storybook/angular-vite';
import { LuxTileAcComponent } from './lux-tile-ac.component';

const meta: Meta<LuxTileAcComponent> = {
  title: 'Layout/lux-tile-ac',
  component: LuxTileAcComponent,
  tags: ['autodocs'],
  args: {
    luxLabel: 'Kachel',
    luxSubTitle: 'Untertitel',
    luxLabelTruncateAfterOneLine: false,
    luxLabelTruncateAfterTwoLines: false,
    luxSubTitleTruncateAfterOneLine: false,
    luxSubTitleTruncateAfterTwoLines: false,
    luxShowNotification: false,
    luxCounterCap: 10,
    luxNotificationColor: 'primary',
    luxNotificationSize: 'medium'
  }
};

export default meta;
type Story = StoryObj<LuxTileAcComponent>;

export const Standard: Story = {};

export const WithCounter: Story = {
  args: {
    luxCounter: 12,
    luxCounterCap: 10,
    luxShowNotification: true,
    luxNotificationColor: 'accent'
  }
};

export const TruncatedTexts: Story = {
  args: {
    luxLabel: 'Ein sehr langer Kachel-Titel, der auf zwei Zeilen gekürzt wird',
    luxLabelTruncateAfterTwoLines: true,
    luxSubTitle: 'Ein sehr langer Untertitel, der nach einer Zeile abgeschnitten wird',
    luxSubTitleTruncateAfterOneLine: true
  }
};
