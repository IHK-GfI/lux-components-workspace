// Storybook Story für LuxToggleAcComponent
import { Meta, StoryObj, moduleMetadata } from '@storybook/angular';
import { ReactiveFormsModule } from '@angular/forms';
import { LuxToggleAcComponent } from '@ihk-gfi/lux-components';
import {
  ToggleAuthenticExampleComponent
} from '../../../../../demo/components-overview/toggle-authentic-example/toggle-authentic-example.component';

const meta: Meta<LuxToggleAcComponent> = {
  title: 'Lux Components/Form/LuxToggleAc',
  component: LuxToggleAcComponent,
  tags: ['autodocs'],
  decorators: [
    moduleMetadata({
      imports: [ReactiveFormsModule, LuxToggleAcComponent, ToggleAuthenticExampleComponent],
    }),
  ],
};

export default meta;
type Story = StoryObj<LuxToggleAcComponent>;

export const Default: Story = {
  args: {
    luxLabel: 'Umschalten',
  },
};
export const Demo: Story = {
  render: () => ({
    template: `<lux-toggle-authentic-example></lux-toggle-authentic-example>`
  }),
  parameters: {
    controls: {
      disable: true,
    },
  },
};

