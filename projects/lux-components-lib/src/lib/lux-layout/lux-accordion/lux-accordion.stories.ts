import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { LuxAccordionComponent } from './lux-accordion.component';
import { LuxPanelComponent } from '../lux-panel/lux-panel.component';
import { getAttributes } from '../../../../../../.storybook/storybook-utils';
import {
  LuxPanelHeaderDescriptionComponent
} from '../lux-panel/lux-panel-subcomponents/lux-panel-header-description.component';
import { LuxPanelHeaderTitleComponent } from '../lux-panel/lux-panel-subcomponents/lux-panel-header-title.component';
import { LuxPanelContentComponent } from '../lux-panel/lux-panel-subcomponents/lux-panel-content.component';
import { luxAccordionColor, luxModeType } from '../../../../../../.storybook/common-styles-args';
import {
  AccordionExampleComponent
} from '../../../../../demo/components-overview/accordion-example/accordion-example.component';

const meta: Meta<LuxAccordionComponent & { panels?: any[] }> = {
  title: 'Lux Components/Layout/LuxAccordion',
  component: LuxAccordionComponent,
  tags: ['autodocs'],
  decorators: [
    moduleMetadata({
      imports: [
        LuxAccordionComponent,
        LuxPanelComponent,
        LuxPanelHeaderTitleComponent,
        LuxPanelHeaderDescriptionComponent,
        LuxPanelContentComponent,
        AccordionExampleComponent
      ],
    }),
  ],
  argTypes: {
    ...luxModeType,
    ...luxAccordionColor
  },
};

export default meta;
type Story = StoryObj<LuxAccordionComponent & { panels?: any[] }>;

export const Default: Story = {
  args: {
    luxMode: 'default',
    luxMulti: false,
    luxTogglePosition: 'after',
    luxColor: 'primary',
    panels: [
      {
        title: 'Panel 1',
        description: 'Beschreibung 1',
        content: `Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua.\nAt vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren.`
      },
      {
        title: 'Panel 2',
        description: 'Beschreibung 2',
        content: `Duis autem vel eum iriure dolor in hendrerit in vulputate velit esse molestie consequat, vel illum dolore eu feugiat nulla facilisis.\nUt wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat.`
      },
      {
        title: 'Panel 3',
        description: 'Beschreibung 3',
        content: `Nam liber tempor cum soluta nobis eleifend option congue nihil imperdiet doming id quod mazim placerat facer possim assum.\nLorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat.`
      }
    ]
  },
  render: (args) => {
    const { panels, ...restArgs } = args;
    const attributes = getAttributes(restArgs);
    return {
      props: { panels },
      template: `
        <lux-accordion ${attributes}>
          @for(panel of panels; track panel) {
            <lux-panel style="width: 500px">
              <lux-panel-header-title>{{panel.title}}</lux-panel-header-title>
              <lux-panel-header-description>{{panel.description}}</lux-panel-header-description>
              <lux-panel-content>
                <p>{{panel.content}}</p>
              </lux-panel-content>
            </lux-panel>
          }
        </lux-accordion>
      `,
    };
  },
};

export const Demo: Story = {
  render: () => ({
    template: `<app-accordion-example></app-accordion-example>`,
  }),
  parameters: {
    controls: {
      disable: true,
    },
  },
}
