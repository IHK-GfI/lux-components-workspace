// Storybook Story für LuxInputAcComponent
import { Meta, StoryObj, moduleMetadata } from '@storybook/angular';
import { ReactiveFormsModule } from '@angular/forms';
import { LuxInputAcComponent } from './lux-input-ac.component';
import {
  InputAuthenticExampleComponent
} from '../../../../../demo/components-overview/input-authentic-example/input-authentic-example.component';

const meta: Meta<LuxInputAcComponent> = {
  title: 'Lux Components/Form/LuxInputAc',
  component: LuxInputAcComponent,
  tags: ['autodocs'],
  decorators: [
    moduleMetadata({
      imports: [ReactiveFormsModule, LuxInputAcComponent, InputAuthenticExampleComponent],
    }),
  ],
};

export default meta;
type Story = StoryObj<LuxInputAcComponent>;

export const Default: Story = {
  args: {
    luxLabel: 'Text eingeben',
    luxPlaceholder: 'Text',
  },
};
export const Demo: Story = {
  render: () => ({
    template: `<lux-input-authentic-example></lux-input-authentic-example>`
  }),
  parameters: {
    controls: {
      disable: true,
    },
  },
};
