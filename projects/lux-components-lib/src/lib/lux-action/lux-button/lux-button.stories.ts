
import type { Meta, StoryObj } from '@storybook/angular';
import { LuxButtonComponent } from './lux-button.component';
import { luxButtonBadgeColor, luxColor, luxIconName } from '../../../../.storybook/common-styles-args';

const meta: Meta<LuxButtonComponent> = {
  title: 'Lux Components/Action/LuxButton',
  component: LuxButtonComponent,
  tags: ['autodocs'],
  argTypes: {
    ...luxButtonBadgeColor,
    ...luxIconName,
    ...luxColor
  },
  parameters: {
    design: {
      type: 'figma',
      url: 'Link to Figma design',
    }
  }
}
export default meta;
type Story = StoryObj<LuxButtonComponent>;

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

export const Stroked: Story = {
  args: {
    luxLabel: 'Stroked Button',
    luxStroked: true,
  },
};

export const Flat: Story = {
  args: {
    luxLabel: 'Flat Button',
    luxFlat: true,
  },
};


export const Primary: Story = {
  args: {
    luxRaised: true,
    luxLabel: 'Primary Button',
    luxColor: 'primary',
  },
};

export const Accent: Story = {
  args: {
    luxRaised: true,
    luxLabel: 'Accent Button',
    luxColor: 'accent',
  },
};

export const Warn: Story = {
  args: {
    luxRaised: true,
    luxLabel: 'Warn Button',
    luxColor: 'warn',
  },
};

export const Disabled: Story = {
  args: {
    luxRaised: true,
    luxLabel: 'Disabled Button',
    luxDisabled: true,
  },
};

export const Loading: Story = {
  args: {
    luxRaised: true,
    luxLabel: 'Loading Button',
    luxLoading: true,
  },
};

export const WithBadge: Story = {
  args: {
    luxRaised: true,
    luxLabel: 'Button with Badge',
    luxButtonBadge: 'New',
    luxButtonBadgeColor: 'accent',
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


