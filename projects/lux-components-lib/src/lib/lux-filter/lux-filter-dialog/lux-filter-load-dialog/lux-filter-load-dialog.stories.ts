import type { Meta, StoryObj } from '@storybook/angular-vite';
import { EMPTY } from 'rxjs';
import { LuxDialogRef } from '../../../lux-popups/lux-dialog/lux-dialog-model/lux-dialog-ref.class';
import { LuxFilterLoadDialogComponent } from './lux-filter-load-dialog.component';

const storedFilters = [
  { id: '1', name: 'Aktive Kunden', data: {} },
  { id: '2', name: 'Offene Vorgänge', data: {} }
];

const meta: Meta<LuxFilterLoadDialogComponent> = {
  title: 'Filter/lux-filter-load-dialog',
  component: LuxFilterLoadDialogComponent,
  tags: ['autodocs'],
  moduleMetadata: {
    providers: [
      {
        provide: LuxDialogRef,
        useValue: {
          data: {
            luxStoredFilters: () => storedFilters,
            onLoad: () => undefined,
            onDelete: () => undefined
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
type Story = StoryObj<LuxFilterLoadDialogComponent>;

export const Default: Story = {};
