import type { Meta, StoryObj } from '@storybook/angular-vite';
import { moduleMetadata } from '@storybook/angular-vite';
import { LuxStepperLargeComponent } from '../../lux-stepper-large.component';
import { LuxStepperLargeStepComponent } from './lux-stepper-large-step.component';

const meta: Meta<LuxStepperLargeStepComponent> = {
  title: 'Layout/lux-stepper-large-step',
  component: LuxStepperLargeStepComponent,
  tags: ['autodocs'],
  decorators: [moduleMetadata({ imports: [LuxStepperLargeComponent] })],
  args: {
    luxTitle: 'Schritt',
    luxCompleted: false,
    luxDisabled: false
  }
};

export default meta;
type Story = StoryObj<LuxStepperLargeStepComponent>;

export const Default: Story = {
  render: (args) => ({
    props: args,
    template: `
      <lux-stepper-large>
        <lux-stepper-large-step [luxTitle]="luxTitle" [luxCompleted]="luxCompleted" [luxDisabled]="luxDisabled">
          <p>Inhalt des Schritts</p>
        </lux-stepper-large-step>
        <lux-stepper-large-step luxTitle="Nächster Schritt">
          <p>Inhalt des nächsten Schritts</p>
        </lux-stepper-large-step>
      </lux-stepper-large>
    `
  })
};

export const Completed: Story = {
  args: {
    luxCompleted: true
  },
  render: (args) => ({
    props: args,
    template: `
      <lux-stepper-large>
        <lux-stepper-large-step [luxTitle]="luxTitle" [luxCompleted]="luxCompleted">
          <p>Dieser Schritt ist abgeschlossen.</p>
        </lux-stepper-large-step>
        <lux-stepper-large-step luxTitle="Nächster Schritt">
          <p>Inhalt des nächsten Schritts</p>
        </lux-stepper-large-step>
      </lux-stepper-large>
    `
  })
};
