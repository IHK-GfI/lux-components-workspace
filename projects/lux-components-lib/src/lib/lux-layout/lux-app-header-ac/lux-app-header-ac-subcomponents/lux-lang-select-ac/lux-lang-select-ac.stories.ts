import type { Meta, StoryObj } from '@storybook/angular-vite';
import { LuxLangSelectAcComponent } from './lux-lang-select-ac.component';

const meta: Meta<LuxLangSelectAcComponent> = {
  title: 'Layout/lux-lang-select-ac',
  component: LuxLangSelectAcComponent,
  tags: ['autodocs'],
  args: {
    luxLocaleSupported: ['de', 'en'],
    luxLocaleBaseHref: '',
    mobileView: false
  }
};

export default meta;
type Story = StoryObj<LuxLangSelectAcComponent>;

export const Default: Story = {
  render: (args) => ({
    props: args,
    template: `
      <lux-lang-select-ac [luxLocaleSupported]="luxLocaleSupported" [luxLocaleBaseHref]="luxLocaleBaseHref" [mobileView]="mobileView" />
    `
  })
};

export const MobileView: Story = {
  args: {
    mobileView: true
  },
  render: (args) => ({
    props: args,
    template: `
      <lux-lang-select-ac [luxLocaleSupported]="luxLocaleSupported" [luxLocaleBaseHref]="luxLocaleBaseHref" [mobileView]="mobileView" />
    `
  })
};
