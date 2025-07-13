// Storybook Story für LuxRadioAcComponent
import { Meta, StoryObj, moduleMetadata } from '@storybook/angular';
import { ReactiveFormsModule } from '@angular/forms';
import { LuxRadioAcComponent } from './lux-radio-ac.component';
import {
  RadioAuthenticExampleComponent
} from '../../../../../demo/components-overview/radio-authentic-example/radio-authentic-example.component';

const meta: Meta<LuxRadioAcComponent> = {
  title: 'Lux Components/Form/LuxRadioAc',
  component: LuxRadioAcComponent,
  tags: ['autodocs'],
  decorators: [
    moduleMetadata({
      imports: [ReactiveFormsModule, LuxRadioAcComponent, RadioAuthenticExampleComponent],
    }),
  ],
};

export default meta;
type Story = StoryObj<LuxRadioAcComponent>;

export const Default: Story = {
  args: {
    luxLabel: 'Drei Lieblingsfrüchte',
    luxOptions: [
      'Melone',
      'Pfirsich',
      'Kiwi'
    ]
  },
};
export const Demo: Story = {
  render: () => ({
    template: `<lux-radio-authentic-example></lux-radio-authentic-example>`
  }),
  parameters: {
    controls: {
      disable: true,
    },
  },
};

