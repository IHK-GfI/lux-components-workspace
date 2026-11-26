import type { Meta, StoryObj } from '@storybook/angular-vite';
import { LuxAppHeaderAcSessionTimerComponent } from './lux-app-header-ac-session-timer';

const meta: Meta<LuxAppHeaderAcSessionTimerComponent> = {
  title: 'Layout/lux-app-header-ac-session-timer',
  component: LuxAppHeaderAcSessionTimerComponent,
  tags: ['autodocs']
};

export default meta;
type Story = StoryObj<LuxAppHeaderAcSessionTimerComponent>;

export const Default: Story = {
  render: () => ({
    template: `
      <lux-app-header-ac-session-timer />
    `
  })
};
