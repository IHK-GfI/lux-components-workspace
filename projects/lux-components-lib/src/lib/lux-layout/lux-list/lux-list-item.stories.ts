import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { LuxListItemComponent } from './lux-list-subcomponents/lux-list-item.component';
import { LuxListItemIconComponent } from './lux-list-subcomponents/lux-list-item-icon.component';
import { LuxListItemContentComponent } from './lux-list-subcomponents/lux-list-item-content.component';
import { LuxIconComponent } from '../../lux-icon/lux-icon/lux-icon.component';
import { getAttributes } from '../../../../../../.storybook/storybook-utils';
import { ListExampleComponent } from '../../../../../demo/components-overview/list-example/list-example.component';

type LuxListItemStoryArgs = LuxListItemComponent & {
  iconName?: string;
  content?: string;
};

const meta: Meta<LuxListItemStoryArgs> = {
  title: 'Lux Components/Layout/LuxListItem',
  component: LuxListItemComponent,
  tags: ['autodocs'],
  decorators: [
    moduleMetadata({
      imports: [LuxListItemComponent, LuxListItemIconComponent, LuxListItemContentComponent, LuxIconComponent, ListExampleComponent],
    }),
  ],
};

export default meta;
type Story = StoryObj<LuxListItemStoryArgs>;

export const Default: Story = {
  args: {
    luxTitle: 'Titel',
    luxSubTitle: 'Untertitel',
    luxSubTitleTooltip: 'Tooltip für Untertitel',
    luxTitleTooltip: 'Tooltip für Titel',
    iconName: 'lux-interface-user-single',
    content: 'Inhalt des Lux-List-Item'
  },
  render: (args) => {
    const { iconName, content, ...restArgs } = args;
    const attributesRest = getAttributes(restArgs);
    return {
      props: { iconName, content },
      template: `
        <lux-list-item ${attributesRest}>
          <lux-list-item-icon><lux-icon luxIconName="${iconName}" ></lux-icon></lux-list-item-icon>
          <lux-list-item-content>
            ${content}
          </lux-list-item-content>
        </lux-list-item>
      `,
    };
  },
};

export const Demo: Story = {
  render: () => ({
    template: `
      <app-list-example></app-list-example>
    `,
  }),
  parameters: {
    controls: {
      disable: true,
    },
  },
};
