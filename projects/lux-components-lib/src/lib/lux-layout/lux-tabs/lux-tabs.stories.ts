import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@analogjs/storybook-angular';
import { LuxTabsComponent } from './lux-tabs.component';
import { getAttributes } from '../../../../../../.storybook/storybook-utils';
import { LuxTabComponent } from './lux-tabs-subcomponents/lux-tab.component';
import { TabsExampleComponent } from '../../../../../demo/components-overview/tabs-example/tabs-example.component';

const tabData = [
  { label: 'Tab 1', content: 'Inhalt für Tab 1: Lorem ipsum dolor sit amet, consectetur adipiscing elit.', luxIconName: 'lux-interface-user-single', luxTitle: 'Benutzer' },
  { label: 'Tab 2', content: 'Inhalt für Tab 2: Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.', luxIconName: 'lux-cogs', luxTitle: 'Einstellungen' },
  { label: 'Tab 3', content: 'Inhalt für Tab 3: Ut enim ad minim veniam, quis nostrud exercitation ullamco.', luxIconName: 'lux-interface-help-question-circle', luxTitle: 'Informationen' }
];

const meta: Meta<LuxTabsComponent & { tabs?: { label: string; content: string }[] }> = {
  title: 'Lux Components/Layout/LuxTabs',
  component: LuxTabsComponent,
  decorators: [
    moduleMetadata({
      imports: [LuxTabsComponent, LuxTabComponent, TabsExampleComponent],
    }),
  ],
  tags: ['autodocs'],

  render: (args) => {
    const { tabs = tabData, ...componentArgs } = args;
    const attributes = getAttributes(componentArgs);
    return {
      props: { ...args, tabs },
      template: `
        <lux-tabs ${attributes}>
        @for (tab of tabs; track tab) {
          <lux-tab [luxTitle]="tab.luxTitle" [luxIconName]="tab.luxIconName">
            <ng-template>
            <h2>
            {{ tab.label }}
            </h2>
            {{ tab.content }}
            </ng-template>
          </lux-tab>
          }
        </lux-tabs>
      `,
    };
  },
};

export default meta;
type Story = StoryObj<LuxTabsComponent & { tabs?: { label: string; content: string }[] }>;

export const Default: Story = {
  args: {
    tabs: tabData,
  },
};

export const Demo: Story = {
  render: () => ({
    template: `<app-tabs></app-tabs>`,
  }),
  parameters: {
    controls: {
      disable: true,
    },
  },
}
