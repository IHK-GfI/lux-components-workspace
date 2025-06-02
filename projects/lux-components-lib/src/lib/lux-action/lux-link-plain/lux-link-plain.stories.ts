import type { Meta, StoryObj } from '@storybook/angular';
import { LuxLinkPlainComponent } from './lux-link-plain.component';
import { moduleMetadata } from '@storybook/angular';
import { LuxIconComponent } from '../../lux-icon/lux-icon/lux-icon.component';
const meta: Meta<LuxLinkPlainComponent> = {
  title: 'Lux Components/Action/LuxLinkPlain',
  component: LuxLinkPlainComponent,
  tags: ['autodocs'],
  decorators: [
    moduleMetadata({
      imports: [LuxLinkPlainComponent, LuxIconComponent],
    }),
  ],
  argTypes: {
  },
};

export default meta;
type Story = StoryObj<LuxLinkPlainComponent>;

export const Default: Story = {
  args: {
    luxLabel: 'Click me!',
    luxHref: '#',
  },
};

export const WithIcon: Story = {
  args: {
    luxLabel: 'Click me!',
    luxHref: '#',
    luxIconName: 'lux-interface-user-single',
  },

};
