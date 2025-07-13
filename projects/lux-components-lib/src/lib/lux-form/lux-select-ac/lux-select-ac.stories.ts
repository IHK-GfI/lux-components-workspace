import { Meta, StoryObj, moduleMetadata } from '@storybook/angular';
import { ReactiveFormsModule } from '@angular/forms';
import { LuxSelectAcComponent } from './lux-select-ac.component';
import {
  SelectAuthenticExampleComponent
} from '../../../../../demo/components-overview/select-authentic-example/select-authentic-example.component';

const meta: Meta<LuxSelectAcComponent> = {
  title: 'Lux Components/Form/LuxSelectAc',
  component: LuxSelectAcComponent,
  tags: ['autodocs'],
  decorators: [
    moduleMetadata({
      imports: [ReactiveFormsModule, LuxSelectAcComponent, SelectAuthenticExampleComponent],
    }),
  ],
};

export default meta;
type Story = StoryObj<LuxSelectAcComponent>;

export const Default: Story = {
  args: {
    luxLabel: 'Option auswählen',
    luxPlaceholder: 'Option',
    luxSelected: 'Option mit sehr langem Namen zwei',
    luxOptions: [
      'Option mit sehr langem Namen eins',
      'Option mit sehr langem Namen zwei',
      'Option mit sehr langem Namen drei',
    ],
  },
};
export const Demo: Story = {
  render: () => ({
    template: `<lux-select-authentic-example></lux-select-authentic-example>`
  }),
  parameters: {
    controls: {
      disable: true,
    },
  },
};
