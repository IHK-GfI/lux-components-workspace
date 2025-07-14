import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@analogjs/storybook-angular';
import { LuxStepperComponent } from './lux-stepper.component';
import { getAttributes } from '../../../../../../.storybook/storybook-utils';
import { LuxStepComponent } from './lux-stepper-subcomponents/lux-step.component';
import { LuxStepContentComponent } from './lux-stepper-subcomponents/lux-step-content.component';
import { LuxStepHeaderComponent } from './lux-stepper-subcomponents/lux-step-header.component';
import {
  StepperExampleComponent
} from '../../../../../demo/components-overview/stepper-example/stepper-example.component';

type LuxStepperArgs = LuxStepperComponent & { steps?: { label: string; content: string; luxTitle: string }[] };

const stepData = [
  {
    label: 'Schritt 1',
    content:
      'Inhalt für Schritt 1: Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    luxIconName: 'lux-interface-user',
    luxTitle: 'Benutzer',
  },
  {
    label: 'Schritt 2',
    content:
      'Inhalt für Schritt 2: Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    luxIconName: 'lux-interface-settings',
    luxTitle: 'Einstellungen',
  },
  {
    label: 'Schritt 3',
    content:
      'Inhalt für Schritt 3: Ut enim ad minim veniam, quis nostrud exercitation ullamco.',
    luxIconName: 'lux-interface-info',
    luxTitle: 'Informationen',
  },
];

const meta: Meta<LuxStepperArgs> = {
  title: 'Lux Components/Layout/LuxStepper',
  component: LuxStepperComponent,
  decorators: [
    moduleMetadata({
      imports: [LuxStepperComponent, LuxStepComponent, LuxStepContentComponent, LuxStepHeaderComponent, StepperExampleComponent],
    }),
  ],
  tags: ['autodocs'],
  render: (args) => {
    const { steps = stepData, ...componentArgs } = args;
    const attributes = getAttributes(componentArgs);
    return {
      props: { ...args, steps },
      template: `
        <form [formGroup]="stepperForm0">
          <lux-stepper ${attributes}>
            @for (step of steps; track step) {
              <lux-step [luxStepControl]="stepperForm0"
                [luxIconName]="step.luxIconName"
                [luxTitle]="step.luxTitle"
                [luxEditable]="step.luxEditable"
                [luxCompleted]="step.luxCompleted"
                >
                <lux-step-header>{{ step.label }}</lux-step-header>
                <lux-step-content>
                  <h1>{{ step.label }}</h1>
                  {{ step.content }}
                </lux-step-content>
              </lux-step>
            }
          </lux-stepper>
        </form>
      `,
    };
  },
};

export default meta;
type Story = StoryObj<LuxStepperArgs>;

export const Default: Story = {
  args: {
    steps: stepData,
  },
};

export const Demo: Story = {
  render: () => ({
    template: `<app-stepper-example></app-stepper-example>`,
  }),
  parameters: {
    controls: {
      disable: true,
    },
  },
}
