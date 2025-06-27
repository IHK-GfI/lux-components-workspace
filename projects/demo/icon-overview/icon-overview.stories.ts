import type { Meta, StoryObj } from '@storybook/angular';
import { IconOverviewComponent } from './icon-overview.component';

const meta: Meta<IconOverviewComponent> = {
  title: 'Allgemein/Iconsuche',
  component: IconOverviewComponent

};

export default meta;
type Story = StoryObj<IconOverviewComponent>;
export const Default: Story = {
  parameters: {}
};
