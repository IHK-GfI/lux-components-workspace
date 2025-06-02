import type { Meta, StoryContext, StoryObj } from '@storybook/angular';
import { LuxTextboxComponent } from './lux-textbox.component';
import { luxTextboxColor } from '../../../../.storybook/common-styles-args';

const meta: Meta<LuxTextboxComponent> = {
  title: 'Lux Components/Common/Textbox',
  component: LuxTextboxComponent,
  tags: ['autodocs'],
  argTypes: {
    ...luxTextboxColor
  },
  render: (args: LuxTextboxComponent) => ({
    props: args,
    template: `
      <lux-textbox
        [luxTitle]="luxTitle"
        [luxIcon]="luxIcon"
        [luxHeading]="luxHeading"
        [luxColor]="luxColor"
      >
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
      </lux-textbox>
    `
  })
};

export default meta;
type Story = StoryObj<LuxTextboxComponent>;

export const Default: Story = {
  args: {
    luxTitle: 'Lies mich',
    luxIcon: 'lux-book-readme',
    luxHeading: 1
  }
};

export const Info: Story = {
  args: {
    luxTitle: 'Information',
    luxIcon: 'lux-info',
    luxHeading: 1,
    luxColor: 'blue'
  }
};

export const Erfolg: Story = {
  args: {
    luxTitle: 'Erfolg',
    luxIcon: 'lux-interface-favorite-like-1',
    luxHeading: 1,
    luxColor: 'green'
  }

};
export const Warnung: Story = {
  args: {
    luxTitle: 'Hinweis',
    luxIcon: 'lux-interface-alert-warning-triangle',
    luxHeading: 1,
    luxColor: 'yellow'
  }
};
export const Fehler: Story = {
  args: {
    luxTitle: 'Fehler',
    luxIcon: 'lux-interface-alert-warning-triangle',
    luxHeading: 1,
    luxColor: 'red'
  }
};
