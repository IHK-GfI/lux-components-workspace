import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@analogjs/storybook-angular';
import { LuxStepperLargeComponent } from './lux-stepper-large.component';
import { LuxStepperLargeStepComponent } from './lux-stepper-large-subcomponents/lux-stepper-large-step/lux-stepper-large-step.component';
import {
  StepperLargeExampleComponent
} from '../../../../../demo/components-overview/stepper-large-example/stepper-large-example.component';
import { getAttributes } from '../../../../../../.storybook/storybook-utils';

type LuxStepperLargeArgs = LuxStepperLargeComponent & { stepData?: { label: string; content: string; luxTitle: string }[] };

const stepData = [
  {
    label: 'Schritt 1',
    content: 'Inhalt für Schritt 1: Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    luxTitle: 'Benutzer',
  },
  {
    label: 'Schritt 2',
    content: 'Inhalt für Schritt 2: Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    luxTitle: 'Einstellungen',
  },
  {
    label: 'Schritt 3',
    content: 'Inhalt für Schritt 3: Ut enim ad minim veniam, quis nostrud exercitation ullamco.',
    luxTitle: 'Informationen',
  },
]

const meta: Meta<LuxStepperLargeArgs> = {
  title: 'Lux Components/Layout/LuxStepperLarge',
  component: LuxStepperLargeComponent,
  decorators: [
    moduleMetadata({
      imports: [LuxStepperLargeComponent, LuxStepperLargeStepComponent, StepperLargeExampleComponent],
    }),
  ],
  tags: ['autodocs'],

  render: (args) => {
    const { stepData, ...componentArgs } = args;
    const attributes = getAttributes(componentArgs);
    return {
      props: { ...args, stepData },
      template: `
          <lux-stepper-large ${attributes}>
          @for (step of stepData; track step) {
            <ng-container>
              <lux-stepper-large-step
                [luxTitle]="step.luxTitle"
                [luxTouched]="step.luxTouched"
                [luxCompleted]="step.luxCompleted"
                [luxDisabled]="step.luxDisabled"
              >
                <h2 class="example-lux-stepper-large-h2">{{ step.luxTitle }}</h2>
                <p>{{ step.content }}</p>
              </lux-stepper-large-step>
            </ng-container>
            }
          </lux-stepper-large>
      `,
    };
  },
};

export default meta;
type Story = StoryObj<LuxStepperLargeArgs>;

export const Default: Story = {
  args: {
    stepData: stepData,
  },
};

export const Demo: Story = {
  render: () => {
    return {
      template: `
        <app-stepper-large-example></app-stepper-large-example>
      `,
    };
  },
  parameters: {
    controls: {
      disable: true,
    },
  },
}
