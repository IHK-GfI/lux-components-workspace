import type { Meta, StoryObj } from '@storybook/angular-vite';
import { moduleMetadata } from '@storybook/angular-vite';
import { LuxStepperComponent } from '../lux-stepper.component';
import { LuxStepComponent } from './lux-step.component';
import { LuxStepHeaderComponent } from './lux-step-header.component';
import { LuxStepContentComponent } from './lux-step-content.component';

const meta: Meta<LuxStepHeaderComponent> = {
  title: 'Layout/lux-step-header',
  component: LuxStepHeaderComponent,
  tags: ['autodocs'],
  decorators: [
    moduleMetadata({
      imports: [LuxStepperComponent, LuxStepComponent, LuxStepContentComponent]
    })
  ]
};

export default meta;
type Story = StoryObj<LuxStepHeaderComponent>;

export const Default: Story = {
  render: () => ({
    template: `
      <lux-stepper [luxLinear]="false">
        <lux-step>
          <lux-step-header>Schritt mit Kopfbereich</lux-step-header>
          <lux-step-content>
            <p>Inhalt des Schritts</p>
          </lux-step-content>
        </lux-step>
      </lux-stepper>
    `
  })
};
