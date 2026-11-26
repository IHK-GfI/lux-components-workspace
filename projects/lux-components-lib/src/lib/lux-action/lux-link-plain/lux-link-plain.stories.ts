import type { Meta, StoryObj } from '@storybook/angular-vite';
import { LuxLinkPlainComponent } from './lux-link-plain.component';

const meta: Meta<LuxLinkPlainComponent> = {
  title: 'Aktion/lux-link-plain',
  component: LuxLinkPlainComponent,
  tags: ['autodocs'],
  args: {
    luxLabel: 'Datenschutzerklärung',
    luxHref: 'https://www.ihk.de'
  }
};

export default meta;
type Story = StoryObj<LuxLinkPlainComponent>;

export const Default: Story = {};

export const OpenInNewTab: Story = {
  args: {
    luxBlank: true
  }
};

export const Disabled: Story = {
  args: {
    luxDisabled: true
  }
};
