import type { Meta, StoryObj } from '@storybook/angular-vite';
import { moduleMetadata } from '@storybook/angular-vite';
import { LuxStepperComponent } from '../lux-stepper.component';
import { LuxStepComponent } from './lux-step.component';
import { LuxStepContentComponent } from './lux-step-content.component';
import { LuxStepHeaderComponent } from './lux-step-header.component';

const meta: Meta<LuxStepComponent> = {
  title: 'Layout/lux-step',
  component: LuxStepComponent,
  tags: ['autodocs'],
  decorators: [
    moduleMetadata({
      imports: [LuxStepperComponent, LuxStepHeaderComponent, LuxStepContentComponent]
    })
  ],
  args: {
    luxOptional: false,
    luxEditable: true
  }
};

export default meta;
type Story = StoryObj<LuxStepComponent>;

export const Default: Story = {
  render: (args) => ({
    props: args,
    template: `
      <lux-stepper [luxLinear]="false">
        <lux-step [luxOptional]="luxOptional" [luxEditable]="luxEditable">
          <lux-step-header>Schritt 1</lux-step-header>
          <lux-step-content>
            <p>Inhalt von Schritt 1</p>
          </lux-step-content>
        </lux-step>
        <lux-step>
          <lux-step-header>Schritt 2</lux-step-header>
          <lux-step-content>
            <p>Inhalt von Schritt 2</p>
          </lux-step-content>
        </lux-step>
      </lux-stepper>
    `
  })
};

export const Optional: Story = {
  args: {
    luxOptional: true
  },
  render: (args) => ({
    props: args,
    template: `
      <lux-stepper [luxLinear]="false">
        <lux-step [luxOptional]="luxOptional">
          <lux-step-header>Optionaler Schritt</lux-step-header>
          <lux-step-content>
            <p>Dieser Schritt kann übersprungen werden.</p>
          </lux-step-content>
        </lux-step>
      </lux-stepper>
    `
  })
};
