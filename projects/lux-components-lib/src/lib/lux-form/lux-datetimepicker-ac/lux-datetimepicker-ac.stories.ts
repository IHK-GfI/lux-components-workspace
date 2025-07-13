// Storybook Story für LuxDatetimepickerAcComponent
import { Meta, StoryObj, moduleMetadata } from '@storybook/angular';
import { ReactiveFormsModule } from '@angular/forms';
import { LuxDatetimepickerAcComponent } from './lux-datetimepicker-ac.component';
import {
  DatetimepickerAuthenticExampleComponent
} from '../../../../../demo/components-overview/datetimepicker-authentic-example/datetimepicker-authentic-example.component';

const meta: Meta<LuxDatetimepickerAcComponent> = {
  title: 'Lux Components/Form/LuxDatetimepickerAc',
  component: LuxDatetimepickerAcComponent,
  tags: ['autodocs'],
  decorators: [
    moduleMetadata({
      imports: [ReactiveFormsModule, LuxDatetimepickerAcComponent, DatetimepickerAuthenticExampleComponent],
    }),
  ],
};

export default meta;
type Story = StoryObj<LuxDatetimepickerAcComponent>;

export const Default: Story = {
  args: {
    luxLabel: 'Datum & Uhrzeit auswählen',
    luxPlaceholder: 'Datum & Uhrzeit',
  },
};
export const Demo: Story = {
  render: () => ({
    template: `<lux-datetimepicker-authentic-example></lux-datetimepicker-authentic-example>`,
  }),
  parameters: {
    controls: {
      disable: true,
    },
  },
};

