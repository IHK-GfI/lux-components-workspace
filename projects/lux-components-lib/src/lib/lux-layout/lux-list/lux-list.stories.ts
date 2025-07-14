import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { LuxListComponent } from './lux-list.component';
import { LuxListItemComponent } from './lux-list-subcomponents/lux-list-item.component';
import { getAttributes } from '../../../../../../.storybook/storybook-utils';
import { ListExampleComponent } from '../../../../../demo/components-overview/list-example/list-example.component';
import { LuxListItemIconComponent } from './lux-list-subcomponents/lux-list-item-icon.component';
import { LuxListItemContentComponent } from './lux-list-subcomponents/lux-list-item-content.component';
import { LuxIconComponent } from '../../lux-icon/lux-icon/lux-icon.component';

type LuxListStoryArgs = LuxListComponent & { luxItems?: { title: string, subtitle: string, content: string, iconName: string }[] };

const meta: Meta<LuxListStoryArgs> = {
  title: 'Lux Components/Layout/LuxList',
  component: LuxListComponent,
  tags: ['autodocs'],
  decorators: [
    moduleMetadata({
      imports: [LuxListComponent, LuxListItemComponent, ListExampleComponent, LuxListItemIconComponent, LuxListItemContentComponent, LuxIconComponent],
    }),
  ],
};

export default meta;
type Story = StoryObj<LuxListStoryArgs>;

export const Default: Story = {
  render: (args) => {
    const attributes = getAttributes(args);
    const items = [
      { title: 'Titel 1', subtitle: 'Untertitel 1', content: 'Inhalt des Lux-List-Item für das erste Element', iconName: 'lux-interface-user-single', tooltip: 'Tooltip für Titel 1' },
      { title: 'Titel 2', subtitle: 'Untertitel 2', content: 'Inhalt des Lux-List-Item für das zweite Element', iconName: 'lux-interface-user-single', tooltip: 'Tooltip für Titel 2' },
      { title: 'Titel 3', subtitle: 'Untertitel 3', content: 'Inhalt des Lux-List-Item für das dritte Element', iconName: 'lux-interface-user-single', tooltip: 'Tooltip für Titel 3' },
    ];
    return {
      props: { ...args, items },
      template: `
        <lux-list ${attributes}>
          @for(item of items; track item; let i = $index) {
          <lux-list-item [luxTitle]="item.title" [luxSubTitle]="item.subtitle" [luxTitleTooltip]="item.tooltip">
            <lux-list-item-icon><lux-icon [luxIconName]="item.iconName"></lux-icon></lux-list-item-icon>
            <lux-list-item-content>
              <div>{{item.content}}</div>
            </lux-list-item-content>
          </lux-list-item>
          }
        </lux-list>
      `,
    };
  },
};


export const Demo: Story = {
  render: () => ({
    template: `<app-list-example></app-list-example>`,
  }),
  parameters: {
    controls: {
      disable: true,
    },
  },
}
