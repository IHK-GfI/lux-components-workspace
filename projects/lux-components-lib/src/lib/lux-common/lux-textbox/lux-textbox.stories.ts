import type { Meta, StoryObj } from '@storybook/angular';
import { LuxTextboxComponent } from './lux-textbox.component';
import { moduleMetadata } from '@analogjs/storybook-angular';
import { TextboxExampleComponent } from '../../../../../demo/components-overview/textbox-example/textbox-example.component';
import { getAttributes } from '../../../../../../.storybook/storybook-utils';
import { luxTextboxColor } from '../../../../../../.storybook/common-styles-args';

type LuxTextboxComponentForStory = LuxTextboxComponent & { content: string };
const meta: Meta<LuxTextboxComponentForStory> = {
  title: 'Lux Components/Common/LuxTextbox',
  component: LuxTextboxComponent,
  decorators: [
    moduleMetadata({
      imports: [TextboxExampleComponent]
    }),
],
  tags: ['autodocs'],
  argTypes: {
    ...luxTextboxColor,
    content: {
      control: 'text',
    },
  },
  render: (args ) => {
    const { content, ...componentArgs } = args;
    const attributes = getAttributes(componentArgs);
    return {
      props: args,
      template: `
      <lux-textbox
        ${attributes}
      >
        {{ content }}
      </lux-textbox>
    `,
    };
  },
};

export default meta;
type Story = StoryObj<LuxTextboxComponentForStory>;

export const Default: Story = {
  args: {
    luxTitle: 'Lies mich',
    luxIcon: 'lux-book-readme',
    luxHeading: 1,
    content:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
  },
};

export const Info: Story = {
  args: {
    luxTitle: 'Information',
    luxIcon: 'lux-info',
    luxHeading: 1,
    luxColor: 'blue',
    content:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
  },
};

export const Erfolg: Story = {
  args: {
    luxTitle: 'Erfolg',
    luxIcon: 'lux-interface-favorite-like-1',
    luxHeading: 1,
    luxColor: 'green',
    content:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
  },
};
export const Warnung: Story = {
  args: {
    luxTitle: 'Hinweis',
    luxIcon: 'lux-interface-alert-warning-triangle',
    luxHeading: 1,
    luxColor: 'yellow',
    content:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
  },
};
export const Fehler: Story = {
  args: {
    luxTitle: 'Fehler',
    luxIcon: 'lux-interface-alert-warning-triangle',
    luxHeading: 1,
    luxColor: 'red',
    content:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
  },
};
export const Demo: Story = {
  render: () => ({
    template: `<lux-textbox-example></lux-textbox-example>`,
  }),
  parameters: {
    controls: {
      disable: true,
    },
  },
};
