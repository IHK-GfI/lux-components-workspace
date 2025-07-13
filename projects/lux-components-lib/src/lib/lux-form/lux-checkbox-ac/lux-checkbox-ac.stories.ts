import type { Meta, StoryObj } from '@storybook/angular';
import { LuxCheckboxAcComponent } from './lux-checkbox-ac.component';
import { ReactiveFormsModule } from '@angular/forms';
import { moduleMetadata } from '@storybook/angular';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
  CheckboxAuthenticExampleComponent
} from '../../../../../demo/components-overview/checkbox-authentic-example/checkbox-authentic-example.component';

const meta: Meta<LuxCheckboxAcComponent> = {
  title: 'Lux Components/Form/LuxCheckboxAc',
  component: LuxCheckboxAcComponent,
  decorators: [
    moduleMetadata({
      imports: [
        ReactiveFormsModule,
        BrowserAnimationsModule,
        CheckboxAuthenticExampleComponent,
      ],
    }),
  ],
};
export default meta;
type Story = StoryObj<LuxCheckboxAcComponent>;

export const Default: Story = {
  args: {
    luxLabel: 'Ich akzeptiere die YOLO-AGB',
    luxChecked: false,
    luxDisabled: false,
  },
};

export const Demo: Story = {
  render: () => ({
    template: `<lux-checkbox-authentic-example></lux-checkbox-authentic-example>`,
  }),
  parameters: {
    controls: {
      disable: true,
    },
  },
};

