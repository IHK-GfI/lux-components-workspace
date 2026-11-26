import type { Meta, StoryObj } from '@storybook/angular-vite';
import { EMPTY } from 'rxjs';
import { LuxDialogRef } from '../../../lux-popups/lux-dialog/lux-dialog-model/lux-dialog-ref.class';
import { LuxFilterSaveDialogComponent } from './lux-filter-save-dialog.component';

const storedFilters = [
  { id: '1', name: 'Aktive Kunden', data: {} },
  { id: '2', name: 'Offene Vorgänge', data: {} }
];

const meta: Meta<LuxFilterSaveDialogComponent> = {
  title: 'Filter/lux-filter-save-dialog',
  component: LuxFilterSaveDialogComponent,
  tags: ['autodocs'],
  moduleMetadata: {
    providers: [
      {
        provide: LuxDialogRef,
        useValue: {
          data: {
            luxStoredFilters: () => storedFilters,
            onSave: () => undefined
          },
          showCloseButton: true,
          dialogClosed: EMPTY,
          closeDialog: () => undefined
        } as Partial<LuxDialogRef>
      }
    ]
  }
};

export default meta;
type Story = StoryObj<LuxFilterSaveDialogComponent>;

export const Default: Story = {};
