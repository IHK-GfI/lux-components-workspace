import type { Meta, StoryObj } from '@storybook/angular-vite';
import { moduleMetadata } from '@storybook/angular-vite';
import { LuxStepperLargeComponent } from './lux-stepper-large.component';
import { LuxStepperLargeStepComponent } from './lux-stepper-large-subcomponents/lux-stepper-large-step/lux-stepper-large-step.component';

const meta: Meta<LuxStepperLargeComponent> = {
  title: 'Layout/lux-stepper-large',
  component: LuxStepperLargeComponent,
  tags: ['autodocs'],
  decorators: [moduleMetadata({ imports: [LuxStepperLargeStepComponent] })],
  args: {
    luxStepValidationActive: false,
    luxA11YMode: false,
    luxPrevButtonConfig: { label: 'Zurück', color: 'primary', iconName: 'lux-arrow-left-1', iconShowRight: false },
    luxNextButtonConfig: { label: 'Weiter', color: 'primary', iconName: 'lux-arrow-right-1', iconShowRight: true },
    luxFinButtonConfig: { label: 'Fertigstellen', color: 'primary', iconName: 'lux-interface-check', iconShowRight: false }
  }
};

export default meta;
type Story = StoryObj<LuxStepperLargeComponent>;

export const Default: Story = {
  render: (args) => ({
    props: args,
    template: `
      <lux-stepper-large
        [luxStepValidationActive]="luxStepValidationActive"
        [luxA11YMode]="luxA11YMode"
        [luxPrevButtonConfig]="luxPrevButtonConfig"
        [luxNextButtonConfig]="luxNextButtonConfig"
        [luxFinButtonConfig]="luxFinButtonConfig">
        <lux-stepper-large-step luxTitle="Persönliche Daten">
          <p>Bitte geben Sie Ihre persönlichen Daten an.</p>
        </lux-stepper-large-step>
        <lux-stepper-large-step luxTitle="Adresse">
          <p>Bitte geben Sie Ihre Adresse an.</p>
        </lux-stepper-large-step>
        <lux-stepper-large-step luxTitle="Zusammenfassung">
          <p>Prüfen Sie Ihre Angaben.</p>
        </lux-stepper-large-step>
      </lux-stepper-large>
    `
  })
};

export const WithStepValidation: Story = {
  args: {
    luxStepValidationActive: true
  },
  render: (args) => ({
    props: args,
    template: `
      <lux-stepper-large
        [luxStepValidationActive]="luxStepValidationActive"
        [luxPrevButtonConfig]="luxPrevButtonConfig"
        [luxNextButtonConfig]="luxNextButtonConfig"
        [luxFinButtonConfig]="luxFinButtonConfig">
        <lux-stepper-large-step luxTitle="Schritt 1">
          <p>Die Validierung verhindert das Weitergehen, solange der Schritt nicht vollständig ist.</p>
        </lux-stepper-large-step>
        <lux-stepper-large-step luxTitle="Schritt 2">
          <p>Inhalt von Schritt 2</p>
        </lux-stepper-large-step>
      </lux-stepper-large>
    `
  })
};
