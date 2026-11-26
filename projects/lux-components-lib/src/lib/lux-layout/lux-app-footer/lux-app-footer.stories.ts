import type { Meta, StoryObj } from '@storybook/angular-vite';
import { LuxAppFooterComponent } from './lux-app-footer.component';

const meta: Meta<LuxAppFooterComponent> = {
  title: 'Layout/lux-app-footer',
  component: LuxAppFooterComponent,
  tags: ['autodocs'],
  args: {
    luxVersion: '1.0.0',
    luxAriaRoleFooterLabel: 'Fußzeile',
    luxCenteredView: false
  }
};

export default meta;
type Story = StoryObj<LuxAppFooterComponent>;

export const Standard: Story = {};

export const CenteredView: Story = {
  args: {
    luxCenteredView: true,
    luxCenteredWidth: '1024px'
  }
};
