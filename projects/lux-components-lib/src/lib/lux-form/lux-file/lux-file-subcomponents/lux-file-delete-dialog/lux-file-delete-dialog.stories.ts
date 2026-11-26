import type { Meta, StoryObj } from '@storybook/angular-vite';
import { moduleMetadata } from '@storybook/angular-vite';
import { LuxDialogRef } from '../../../../lux-popups/lux-dialog/lux-dialog-model/lux-dialog-ref.class';
import { LuxFileDeleteDialogComponent } from './lux-file-delete-dialog.component';

const meta: Meta<LuxFileDeleteDialogComponent> = {
  title: 'Formular/lux-file-delete-dialog',
  component: LuxFileDeleteDialogComponent,
  tags: ['autodocs'],
  decorators: [
    moduleMetadata({
      providers: [{ provide: LuxDialogRef, useValue: { data: undefined, closeDialog: () => undefined } }]
    })
  ]
};

export default meta;
type Story = StoryObj<LuxFileDeleteDialogComponent>;

export const Default: Story = {};
