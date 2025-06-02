import type { Meta, StoryObj } from '@storybook/angular';
import { LuxLinkComponent } from './lux-link.component';
import { luxColor, luxIconName } from '../../../../.storybook/common-styles-args';

const meta: Meta<LuxLinkComponent> = {
  title: 'Lux Components/Action/LuxLink',
  component: LuxLinkComponent,
  tags: ['autodocs'],
  argTypes: {
    ...luxColor,
    ...luxIconName,
  },
};

export default meta;
type Story = StoryObj<LuxLinkComponent>;

export const IconButton: Story = {
  args: {
    luxLabel: 'Lux Button',
    luxRaised: true,
    luxIconName: 'lux-interface-user-single',
  }
}
export const Raised: Story = {
  args: {
    luxLabel: 'Raised Button',
    luxRaised: true,
  },
};

export const Flat: Story = {
  args: {
    luxLabel: 'Flat Button',
    luxFlat: true,
  },
};

export const Rounded: Story =
{
  args: {
    luxRounded: true,
    luxIconName: 'lux-interface-user-single',
    luxColor: 'primary',
  },
};

export const Primary: Story = {
  args: {
    ...Raised.args,
    luxLabel: 'Primary Button',
    luxColor: 'primary',
  },
};

export const Accent: Story = {
  args: {
    ...Raised.args,
    luxLabel: 'Accent Button',
    luxColor: 'accent',
  },
};

export const Warn: Story = {
  args: {
    ...Raised.args,
    luxLabel: 'Warn Button',
    luxColor: 'warn',
  },
};

export const Disabled: Story = {
  args: {
    ...Raised.args,
    luxLabel: 'Disabled Button',
    luxDisabled: true,
  },
};


