import { Meta, StoryObj, moduleMetadata } from '@storybook/angular';
import { TileExampleComponent } from '../../../../../demo/components-overview/tile-example/tile-example.component';
import { LuxTileComponent } from './lux-tile.component';

const meta: Meta<LuxTileComponent> = {
  title: 'Lux Components/Layout/LuxTile',
  component: LuxTileComponent,
  tags: ['autodocs'],
  decorators: [
    moduleMetadata({
      imports: [LuxTileComponent, TileExampleComponent]
    })
  ]
};

export default meta;
type Story = StoryObj<LuxTileComponent>;

export const Default: Story = {
  args: {
    luxLabel: 'Tile Example',
    luxShowShadow: true
  },
  render: (args) => ({
    props: args,
  })
};

export const Demo: Story = {
  render: () => ({
    template: `<lux-tile-example></lux-tile-example>`
  }),
  parameters: {
    controls: {
      disable: true,
    },
  },
};

