import type { Meta, StoryObj } from '@storybook/angular-vite';
import { moduleMetadata } from '@storybook/angular-vite';
import { LuxStepperComponent } from './lux-stepper.component';
import { LuxStepComponent } from './lux-stepper-subcomponents/lux-step.component';
import { LuxStepContentComponent } from './lux-stepper-subcomponents/lux-step-content.component';
import { LuxStepHeaderComponent } from './lux-stepper-subcomponents/lux-step-header.component';

const meta: Meta<LuxStepperComponent> = {
  title: 'Layout/lux-stepper',
  component: LuxStepperComponent,
  tags: ['autodocs'],
  decorators: [
    moduleMetadata({
      imports: [LuxStepComponent, LuxStepHeaderComponent, LuxStepContentComponent]
    })
  ],
  args: {
    luxLinear: false,
    luxShowNavigationButtons: true
  }
};

export default meta;
type Story = StoryObj<LuxStepperComponent>;

export const Default: Story = {
  render: (args) => ({
    props: args,
    template: `
      <lux-stepper [luxLinear]="luxLinear" [luxShowNavigationButtons]="luxShowNavigationButtons">
        <lux-step>
          <lux-step-header>Persönliche Daten</lux-step-header>
          <lux-step-content>
            <p>Bitte geben Sie Ihre persönlichen Daten an.</p>
          </lux-step-content>
        </lux-step>
        <lux-step>
          <lux-step-header>Adresse</lux-step-header>
          <lux-step-content>
            <p>Bitte geben Sie Ihre Adresse an.</p>
          </lux-step-content>
        </lux-step>
        <lux-step>
          <lux-step-header>Zusammenfassung</lux-step-header>
          <lux-step-content>
            <p>Prüfen Sie Ihre Angaben.</p>
          </lux-step-content>
        </lux-step>
      </lux-stepper>
    `
  })
};

export const Vertical: Story = {
  args: {
    luxVerticalStepper: true
  },
  render: (args) => ({
    props: args,
    template: `
      <lux-stepper [luxVerticalStepper]="luxVerticalStepper" [luxLinear]="luxLinear">
        <lux-step>
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
