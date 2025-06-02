import type { Meta, StoryObj } from '@storybook/angular';
import { LuxBreadcrumbComponent } from './lux-breadcrumb.component';
import { moduleMetadata } from '@storybook/angular';

const meta: Meta<LuxBreadcrumbComponent> = {
  title: 'Lux Components/Navigation/LuxBreadcrumb',
  component: LuxBreadcrumbComponent,
  tags: ['autodocs'],
  decorators: [
    moduleMetadata({
      imports: [LuxBreadcrumbComponent],
    }),
  ],
  argTypes: {
  },
};

export default meta;
type Story = StoryObj<LuxBreadcrumbComponent>;

export const Default: Story = {
  args: {
    luxEntries: [
      {
        name: 'Home',
        url: '#',
      },
      {
        name: 'Products',
        url: '#',
      },
      {
        name: 'Details',
        url: '#',
      },
    ],
  },
};
