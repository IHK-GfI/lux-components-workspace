import { Meta, StoryObj, moduleMetadata } from '@storybook/angular';
import { ReactiveFormsModule } from '@angular/forms';
import { LuxSliderAcComponent } from './lux-slider-ac.component';
import {
  SliderAuthenticExampleComponent
} from '../../../../../demo/components-overview/slider-authentic-example/slider-authentic-example.component';

const meta: Meta<LuxSliderAcComponent> = {
  title: 'Lux Components/Form/LuxSliderAc',
  component: LuxSliderAcComponent,
  tags: ['autodocs'],
  decorators: [
    moduleMetadata({
      imports: [ReactiveFormsModule, LuxSliderAcComponent, SliderAuthenticExampleComponent],
    }),
  ],
};

export default meta;
type Story = StoryObj<LuxSliderAcComponent>;

export const Default: Story = {
  args: {
    luxLabel: 'Wert auswählen',
    luxHint: 'Bewege den Slider, um einen Wert zu wählen',
    luxValue: 50,
  },
};
export const Demo: Story = {
  render: () => ({
    template: `<lux-slider-authentic-example></lux-slider-authentic-example>`
  }),
  parameters: {
    controls: {
      disable: true,
    },
  },
};

