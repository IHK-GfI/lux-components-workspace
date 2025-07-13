import { Meta, StoryObj, moduleMetadata } from '@storybook/angular';
import { ReactiveFormsModule } from '@angular/forms';
import { LuxTextareaAcComponent } from './lux-textarea-ac.component';
import {
  TextareaAuthenticExampleComponent
} from '../../../../../demo/components-overview/textarea-authentic-example/textarea-authentic-example.component';

const meta: Meta<LuxTextareaAcComponent> = {
  title: 'Lux Components/Form/LuxTextareaAc',
  component: LuxTextareaAcComponent,
  tags: ['autodocs'],
  decorators: [
    moduleMetadata({
      imports: [ReactiveFormsModule, LuxTextareaAcComponent, TextareaAuthenticExampleComponent],
    }),
  ],
};

export default meta;
type Story = StoryObj<LuxTextareaAcComponent>;

export const Default: Story = {
  args: {
    luxLabel: 'Text eingeben',
    luxPlaceholder: 'Text',
  },
};
export const Demo: Story = {
  render: () => ({
    template: `<lux-textarea-authentic-example></lux-textarea-authentic-example>`
  }),
  parameters: {
    controls: {
      disable: true,
    },
  },
};

