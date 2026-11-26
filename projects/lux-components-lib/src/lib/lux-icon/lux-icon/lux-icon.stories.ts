import type { Meta, StoryObj } from '@storybook/angular-vite';
import { LuxIconComponent } from './lux-icon.component';

const meta: Meta<LuxIconComponent> = {
  title: 'Icon/lux-icon',
  component: LuxIconComponent,
  tags: ['autodocs'],
  args: {
    luxIconName: 'lux-interface-lighting-light-bulb',
    luxIconSize: '2rem'
  }
};

export default meta;
type Story = StoryObj<LuxIconComponent>;

export const Default: Story = {};

export const Colored: Story = {
  args: {
    luxColor: 'blue',
    luxRounded: true,
    luxPadding: '8px'
  }
};

export const Sizes: Story = {
  render: (args) => ({
    props: args,
    template: `
      <div class="lux-flex lux-items-center lux-gap-4">
        <lux-icon luxIconName="lux-interface-home-3" luxIconSize="1rem" />
        <lux-icon luxIconName="lux-interface-home-3" luxIconSize="2rem" />
        <lux-icon luxIconName="lux-interface-home-3" luxIconSize="3rem" />
      </div>
    `
  })
};
