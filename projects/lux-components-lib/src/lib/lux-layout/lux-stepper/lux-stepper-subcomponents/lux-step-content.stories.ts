import type { Meta, StoryObj } from '@storybook/angular-vite';
import { moduleMetadata } from '@storybook/angular-vite';
import { LuxStepperComponent } from '../lux-stepper.component';
import { LuxStepComponent } from './lux-step.component';
import { LuxStepContentComponent } from './lux-step-content.component';
import { LuxStepHeaderComponent } from './lux-step-header.component';

const meta: Meta<LuxStepContentComponent> = {
  title: 'Layout/lux-step-content',
  component: LuxStepContentComponent,
  tags: ['autodocs'],
  decorators: [
    moduleMetadata({
      imports: [LuxStepperComponent, LuxStepComponent, LuxStepHeaderComponent]
    })
  ]
};

export default meta;
type Story = StoryObj<LuxStepContentComponent>;

export const Default: Story = {
  render: () => ({
    template: `
      <lux-stepper [luxLinear]="false">
        <lux-step>
          <lux-step-header>Schritt 1</lux-step-header>
          <lux-step-content>
            <p>Hier steht der Inhalt des Schritts.</p>
          </lux-step-content>
        </lux-step>
      </lux-stepper>
    `
  })
};
