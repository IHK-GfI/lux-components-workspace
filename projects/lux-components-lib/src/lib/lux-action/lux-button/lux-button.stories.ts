import type { Meta, StoryObj } from '@storybook/angular';
import { LuxButtonComponent } from './lux-button.component';
import {
  ButtonExampleComponent
} from '../../../../../demo/components-overview/button-example/button-example.component';
import { moduleMetadata } from '@analogjs/storybook-angular';
import { luxButtonBadgeColor } from '../../../../../../.storybook/common-styles-args';

const meta: Meta<LuxButtonComponent> = {
  title: 'Lux Components/Action/LuxButton',
  component: LuxButtonComponent,
  argTypes: {
    ...luxButtonBadgeColor,
  },
  parameters: {
    design: {
      type: 'figma',
      url: 'Link to Figma design'
    }
  },
  decorators: [
    moduleMetadata({
      imports: [ButtonExampleComponent]
    })
  ]
};
export default meta;
type Story = StoryObj<LuxButtonComponent>;

export const Default: Story = {
  args: {
    luxLabel: "Klick Mich",
    luxRaised: true,
    luxIconName: "lux-interface-arrows-vertical-left-right",
    luxType: "button",
    luxSpinnerMode: "indeterminate",
    luxLoading: false,
    luxColor: "accent",
    luxRounded: false,
    luxStroked: false
  }
};

export const Demo: Story = {
  render: () => ({
    template: `<app-button-example></app-button-example>`
  }),
  parameters: {
    controls: {
      disable: true,
    },
  },
};


export const AbbrechenKonfig: Story = {
  args: {
    luxLabel: "Abbrechen",
    luxRaised: true,
    luxIconName: "lux-interface-arrows-vertical-left-right",
    luxType: "button",
    luxSpinnerMode: "indeterminate",
    luxLoading: false,
    luxColor: "warn",
    luxRounded: false,
    luxStroked: false
  }
};


