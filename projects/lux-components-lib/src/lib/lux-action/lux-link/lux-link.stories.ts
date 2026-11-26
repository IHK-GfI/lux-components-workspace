import type { Meta, StoryObj } from '@storybook/angular-vite';
import { LuxLinkComponent } from './lux-link.component';

const meta: Meta<LuxLinkComponent> = {
  title: 'Aktion/lux-link',
  component: LuxLinkComponent,
  tags: ['autodocs'],
  args: {
    luxLabel: 'Zur Startseite',
    luxHref: 'https://www.ihk.de'
  }
};

export default meta;
type Story = StoryObj<LuxLinkComponent>;

export const Default: Story = {};

export const OpenInNewTab: Story = {
  args: {
    luxBlank: true
  }
};

export const WithIcon: Story = {
  args: {
    luxIconName: 'lux-interface-arrow-right',
    luxIconShowRight: true
  }
};

export const Disabled: Story = {
  args: {
    luxDisabled: true
  }
};
