import { MAT_DATE_FORMATS, MAT_NATIVE_DATE_FORMATS, provideNativeDateAdapter } from '@angular/material/core';
import { MatCalendar } from '@angular/material/datepicker';
import type { Meta, StoryObj } from '@storybook/angular-vite';
import { moduleMetadata } from '@storybook/angular-vite';
import { EMPTY } from 'rxjs';
import { LuxDatepickerCustomHeaderComponent } from './lux-datepicker-custom-header.component';

const meta: Meta<LuxDatepickerCustomHeaderComponent<Date>> = {
  title: 'Formular/lux-datepicker-custom-header',
  component: LuxDatepickerCustomHeaderComponent,
  tags: ['autodocs'],
  decorators: [
    moduleMetadata({
      providers: [
        ...provideNativeDateAdapter(),
        { provide: MAT_DATE_FORMATS, useValue: MAT_NATIVE_DATE_FORMATS },
        {
          provide: MatCalendar,
          useValue: {
            stateChanges: EMPTY,
            activeDate: new Date(2025, 0, 15),
            currentView: 'month',
            minDate: null,
            maxDate: null
          }
        }
      ]
    })
  ]
};

export default meta;
type Story = StoryObj<LuxDatepickerCustomHeaderComponent<Date>>;

export const Default: Story = {};
