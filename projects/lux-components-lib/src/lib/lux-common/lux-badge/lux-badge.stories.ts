import type { Meta, StoryObj } from '@storybook/angular-vite';
import { moduleMetadata } from '@storybook/angular-vite';
import { LuxLabelComponent } from '../lux-label/lux-label.component';
import { LuxBadgeComponent } from './lux-badge.component';

const meta: Meta<LuxBadgeComponent> = {
  title: 'Allgemein/lux-badge',
  component: LuxBadgeComponent,
  tags: ['autodocs'],
  decorators: [moduleMetadata({ imports: [LuxBadgeComponent, LuxLabelComponent] })],
  args: {
    luxColor: 'blue',
    luxUppercase: true,
    luxMuted: false,
    luxIconName: '',
    luxSize: ''
  },
  render: (args) => ({
    props: args,
    template: `
      <lux-badge [luxColor]="luxColor" [luxUppercase]="luxUppercase" [luxMuted]="luxMuted" [luxIconName]="luxIconName" [luxSize]="luxSize">
        <lux-label luxId="badge-label">Neu</lux-label>
      </lux-badge>
    `
  })
};

export default meta;
type Story = StoryObj<LuxBadgeComponent>;

export const Default: Story = {};

export const MitIcon: Story = {
  args: {
    luxColor: 'green',
    luxIconName: 'lux-interface-check-circle'
  }
};

export const Gedaempft: Story = {
  args: {
    luxColor: 'red',
    luxMuted: true,
    luxUppercase: false,
    luxSize: 'large'
  }
};
