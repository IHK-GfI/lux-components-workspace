import {
  moduleMetadata,
  type Meta,
  type StoryObj,
} from '@storybook/angular';
import { ReactiveFormsModule } from '@angular/forms';
import { LuxDatepickerAcComponent } from './lux-datepicker-ac.component';
import {
  DatepickerAuthenticExampleComponent
} from '../../../../../demo/components-overview/datepicker-authentic-example/datepicker-authentic-example.component';

const meta: Meta<LuxDatepickerAcComponent> = {
  title: 'Lux Components/Form/LuxDatepickerAc',
  component: LuxDatepickerAcComponent,
  tags: ['autodocs'],
  decorators: [
    moduleMetadata({
      imports: [ReactiveFormsModule, LuxDatepickerAcComponent, DatepickerAuthenticExampleComponent],
    }),
  ],
}

export default meta;
type Story = StoryObj<LuxDatepickerAcComponent>;

export const Default: Story = {
  args: {
    luxLabel: 'Datum auswählen',
    luxPlaceholder: 'Datum',
  },
};
export const Demo: Story = {
  render: () => ({
    template: `<lux-datepicker-authentic-example></lux-datepicker-authentic-example>`,
  }),
  parameters: {
    controls: {
      disable: true,
    },
  },
};
