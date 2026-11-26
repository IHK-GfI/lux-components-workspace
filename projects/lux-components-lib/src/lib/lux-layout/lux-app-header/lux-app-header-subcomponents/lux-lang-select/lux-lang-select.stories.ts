import type { Meta, StoryObj } from '@storybook/angular-vite';
import { moduleMetadata } from '@storybook/angular-vite';
import { LuxAppHeaderComponent } from '../../lux-app-header.component';
import { LuxLangSelectComponent } from './lux-lang-select.component';

const meta: Meta<LuxLangSelectComponent> = {
  title: 'Layout/lux-lang-select',
  component: LuxLangSelectComponent,
  tags: ['autodocs'],
  decorators: [moduleMetadata({ imports: [LuxAppHeaderComponent] })],
  args: {
    luxLocaleSupported: ['de', 'en'],
    luxLocaleBaseHref: ''
  }
};

export default meta;
type Story = StoryObj<LuxLangSelectComponent>;

export const Default: Story = {
  render: (args) => ({
    props: args,
    template: `
      <lux-app-header luxAppTitle="Anwendungstitel" luxUserName="Max Mustermann">
        <lux-lang-select [luxLocaleSupported]="luxLocaleSupported" [luxLocaleBaseHref]="luxLocaleBaseHref" />
      </lux-app-header>
    `
  })
};
