import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { LuxDividerComponent } from './lux-divider.component';
import { getAttributes } from '../../../../../../.storybook/storybook-utils';
import {
  DividerExampleComponent
} from '../../../../../demo/components-overview/divider-example/divider-example.component';

const meta: Meta<LuxDividerComponent> = {
  title: 'Lux Components/Layout/LuxDivider',
  component: LuxDividerComponent,
  tags: ['autodocs'],
  decorators: [
    moduleMetadata({
      imports: [LuxDividerComponent, DividerExampleComponent],
    }),
  ],
};

export default meta;
type Story = StoryObj<LuxDividerComponent>;

export const Default: Story = {
  args: {
    luxVertical: false,
    luxInset: false
  },
  render: (args) => {
    const attributes = getAttributes(args);
    return {
      props: args,
      template: `
        <div style="padding: 24px;">
          <div>Text über dem Divider</div>
          <lux-divider ${attributes}></lux-divider>
          <div>Text unter dem Divider</div>
        </div>
      `,
    };
  },
};

export const Demo: Story = {
  render: () => ({
    template: `<app-divider-example></app-divider-example>`,
  }),
  parameters: {
    controls: {
      disable: true,
    },
  },
}
