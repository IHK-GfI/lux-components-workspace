import { Meta, moduleMetadata, StoryObj } from '@storybook/angular';
import { LuxLinkComponent } from './lux-link.component';
import { LinkExampleComponent } from '../../../../../demo/components-overview/link-example/link-example.component';
import { luxColor } from '../../../../../../.storybook/common-styles-args';

const meta: Meta<LuxLinkComponent> = {
  title: 'Lux Components/Action/LuxLink',
  component: LuxLinkComponent,
  decorators: [
    moduleMetadata({
      imports: [LinkExampleComponent],
    }),
  ],
  tags: ['autodocs'],
  argTypes: {
    ...luxColor,
  },
};

export default meta;
type Story = StoryObj<LuxLinkComponent>;

export const Default: Story = {
  args: {
    luxLabel: "Klick mich",
    luxRaised: true,
    luxIconName: 'lux-interface-user-single',
    luxColor: "primary"
  }
}

export const Demo: Story = {
  render: () => ({
    template: `<app-link-example></app-link-example>`
  }),
  parameters: {
    controls: {
      disable: true,
    },
  },
};




