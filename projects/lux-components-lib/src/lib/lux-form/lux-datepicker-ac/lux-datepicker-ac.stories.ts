import type { Meta, StoryObj } from '@storybook/angular';
import { LuxDatepickerAcComponent } from './lux-datepicker-ac.component';
import { moduleMetadata } from '@storybook/angular';
import { ReactiveFormsModule } from '@angular/forms';

const meta: Meta<LuxDatepickerAcComponent> = {
  title: 'Lux Components/Form/LuxDatepickerAc',
  component: LuxDatepickerAcComponent,
  tags: ['autodocs'],
  decorators: [
    moduleMetadata({
      imports: [ReactiveFormsModule, LuxDatepickerAcComponent],
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

export const MinMaxDates: Story = {
  args: {
    ...Default.args,
    luxMinDate: '10.02.2025',
    luxMaxDate: '08.06.2025',
    luxLabel: 'Datum auswählen',
  },
};

export const StartViewYear: Story = {
  args: {
    ...Default.args,
    luxStartView: 'year',
    luxLabel: 'Startansicht Jahr',
  },
};

export const DisabledDate: Story = {
  args: {
    ...Default.args,
    luxCustomFilter: (date: Date | null): boolean => {
      const day = (date || new Date()).getDay();
      return day !== 0 && day !== 6;
    },
    luxLabel: 'Wochenende deaktiviert',
  },
};


export const NoToggle: Story = {
  args: {
    ...Default.args,
    luxShowToggle: false,
    luxLabel: 'Kein Toggle',
  },
}
