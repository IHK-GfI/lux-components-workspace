import type { Meta, StoryObj } from '@storybook/angular-vite';
import { LuxImageComponent } from './lux-image.component';

const imageSrc =
  'data:image/svg+xml;charset=utf-8,' +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="120" height="80" viewBox="0 0 120 80"><rect width="120" height="80" fill="#4a90d9"/><circle cx="60" cy="40" r="22" fill="#ffffff"/></svg>'
  );

const meta: Meta<LuxImageComponent> = {
  title: 'Icon/lux-image',
  component: LuxImageComponent,
  tags: ['autodocs'],
  argTypes: {
    luxClicked: { action: 'luxClicked' },
    luxImageError: { action: 'luxImageError' }
  },
  args: {
    luxImageSrc: imageSrc,
    luxRawSrc: true,
    luxAlt: 'Beispielbild',
    luxImageWidth: '120px',
    luxImageHeight: '80px'
  }
};

export default meta;
type Story = StoryObj<LuxImageComponent>;

export const Default: Story = {};

export const Clickable: Story = {
  args: {
    luxAlt: 'Klickbares Beispielbild'
  }
};
