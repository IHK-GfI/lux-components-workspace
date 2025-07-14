import type { Meta, StoryObj } from '@storybook/angular';
import { LuxLinkPlainComponent } from './lux-link-plain.component';
import { moduleMetadata } from '@storybook/angular';
import { LuxIconComponent } from '../../lux-icon/lux-icon/lux-icon.component';
import {
  LinkPlainExampleComponent
} from '../../../../../demo/components-overview/link-plain-example/link-plain-example.component';
const meta: Meta<LuxLinkPlainComponent> = {
  title: 'Lux Components/Action/LuxLinkPlain',
  component: LuxLinkPlainComponent,
  tags: ['autodocs'],
  decorators: [
    moduleMetadata({
      imports: [LuxLinkPlainComponent, LuxIconComponent, LuxLinkPlainComponent, LinkPlainExampleComponent],
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

export const Demo: Story = {
  render: () => ({
    template: `<app-link-plain-example></app-link-plain-example>`
  }),
  parameters: {
    controls: {
      disable: true,
    },
  },
};
