import type { Meta, StoryObj } from '@storybook/angular-vite';
import { moduleMetadata } from '@storybook/angular-vite';
import { LuxDividerComponent } from './lux-divider.component';

const meta: Meta<LuxDividerComponent> = {
  title: 'Layout/lux-divider',
  component: LuxDividerComponent,
  tags: ['autodocs'],
  decorators: [moduleMetadata({ imports: [LuxDividerComponent] })],
  args: {
    luxInset: false,
    luxVertical: false
  }
};

export default meta;
type Story = StoryObj<LuxDividerComponent>;

export const Standard: Story = {};

export const Inset: Story = {
  args: {
    luxInset: true
  }
};

export const Vertical: Story = {
  render: (args) => ({
    props: args,
    template: `
      <div style="display: flex; align-items: stretch; height: 80px; gap: 8px;">
        <span>Links</span>
        <lux-divider [luxVertical]="luxVertical" [luxInset]="luxInset" />
        <span>Rechts</span>
      </div>
    `
  }),
  args: {
    luxVertical: true
  }
};
