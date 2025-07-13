import type { Meta, StoryObj } from '@storybook/angular';
import { LuxBadgeComponent } from './lux-badge.component';
import { moduleMetadata } from '@storybook/angular';
import { LuxIconComponent } from '../../lux-icon/lux-icon/lux-icon.component';
import { BadgeExampleComponent } from '../../../../../demo-app/src/app/components-overview/badge-example/badge-example.component';
import { LuxLabelComponent } from '../lux-label/lux-label.component';
type LuxBadgeForStory = LuxBadgeComponent & { content: string };

const meta: Meta<LuxBadgeForStory> = {
  title: 'Lux Components/Common/LuxBadge',
  component: LuxBadgeComponent,
  tags: ['autodocs'],
  argTypes: {
    luxColor: {
      options: [
        'gray',
        'blue',
        'lightblue',
        'red',
        'green',
        'yellow',
        'purple',
        'darkblue',
      ],
      control: {
        type: 'select',
      },
    },
    content: {
      control: 'text',
    },
  },
};

export default meta;
type Story = StoryObj<LuxBadgeForStory>;

export const Default: Story = {
  render: (args) => ({
    props: args,
    moduleMetadata: {
      imports: [LuxBadgeComponent, LuxIconComponent, LuxLabelComponent],
    },
    template: `
        <lux-badge
          [luxColor]="'${args.luxColor}'"
          [luxIconName]="'${args.luxIconName}'"
          [luxUppercase]="${args.luxUppercase}">
            <lux-label>${args.content}</lux-label>
        </lux-badge>
    `,
  }),
  args: {
    luxColor: "yellow",
    luxIconName: '',
    luxUppercase: false,
    content: 'Badge',
  },
};

export const Demo: Story = {
  render: () => ({
    template: `<app-badge-example></app-badge-example>`,
  }),
  decorators: [
    moduleMetadata({
      imports: [BadgeExampleComponent],
    }),
  ],
  parameters: {
    controls: {
      disable: true,
    },
  },
};
