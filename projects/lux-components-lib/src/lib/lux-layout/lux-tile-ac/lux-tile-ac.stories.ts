// Storybook Story für LuxTileAcComponent
import { Meta, StoryObj, moduleMetadata } from '@storybook/angular';
import { MatCardModule } from '@angular/material/card';
import { LuxTileAcComponent } from './lux-tile-ac.component';
import { LuxBadgeNotificationDirective } from '../../lux-directives/lux-badge-notification/lux-badge-notification.directive';
import { LuxTagIdDirective } from '../../lux-directives/lux-tag-id/lux-tag-id.directive';
import { TileAuthenticExampleComponent } from '../../../../../demo/components-overview/tile-authentic-example/tile-authentic-example.component';
import {
  OverviewExampleComponent
} from '../../../../../demo/components-overview/tile-authentic-example/overview-example/overview-example.component';

const meta: Meta<LuxTileAcComponent> = {
  title: 'Lux Components/Layout/LuxTileAc',
  component: LuxTileAcComponent,
  tags: ['autodocs'],
  decorators: [
    moduleMetadata({
      imports: [TileAuthenticExampleComponent, OverviewExampleComponent, MatCardModule, LuxTileAcComponent, LuxBadgeNotificationDirective, LuxTagIdDirective, TileAuthenticExampleComponent],
    }),
  ],
};

export default meta;
type Story = StoryObj<LuxTileAcComponent>;

export const Default: Story = {
  args: {
    luxLabel: 'Tile Label',
    luxSubTitle: 'Tile Subtitle',
    luxShowNotification: true,
    luxCounter: 2,
    luxCounterCap: 10,
    luxNotificationColor: 'primary',
    luxNotificationSize: 'medium',
    luxTagId: 'tile-1',
  },
};

export const Demo: Story = {
  render: () => ({
    template: `<app-tile-authentic-example></app-tile-authentic-example>`
  }),
  parameters: {
    controls: {
      disable: true,
    },
  },
};

export const Grid: Story = {
  render: () => ({
    template: `<lux-overview-example></lux-overview-example>`
  }),
  parameters: {
    controls: {
      disable: true,
    },
  },
};
