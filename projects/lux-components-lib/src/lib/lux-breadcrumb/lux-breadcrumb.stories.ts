import { LuxBreadcrumbComponent } from './lux-breadcrumb.component';
import { Meta, moduleMetadata, StoryObj } from '@analogjs/storybook-angular';
import {
  BreadcrumbExampleComponent
} from '../../../../demo/components-overview/breadcrumb-example/breadcrumb-example.component';

const meta: Meta<LuxBreadcrumbComponent> = {
  title: 'Lux Components/Navigation/LuxBreadcrumb',
  component: LuxBreadcrumbComponent,
  tags: ['autodocs'],
  decorators: [
    moduleMetadata({
      imports: [LuxBreadcrumbComponent, BreadcrumbExampleComponent]
    })
  ],
  argTypes: {}
};

export default meta;
type Story = StoryObj<LuxBreadcrumbComponent>;

export const Default: Story = {
  args: {
    luxEntries: [
      {
        name: 'Home',
        url: '#'
      },
      {
        name: 'Products',
        url: '#'
      },
      {
        name: 'Details',
        url: '#'
      }
    ]
  }
};

export const Demo: Story = {
  render: () => ({
    template: `<lux-breadcrumb-example></lux-breadcrumb-example>`,
  }),
  parameters: {
    controls: {
      disable: true,
    },
  },
};
