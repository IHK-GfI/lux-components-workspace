import type { Meta, StoryObj } from '@storybook/angular-vite';
import { moduleMetadata } from '@storybook/angular-vite';
import { LuxDialogRef } from '../../../../lux-popups/lux-dialog/lux-dialog-model/lux-dialog-ref.class';
import { LuxFileReplaceDialogComponent } from './lux-file-replace-dialog.component';

const meta: Meta<LuxFileReplaceDialogComponent> = {
  title: 'Formular/lux-file-replace-dialog',
  component: LuxFileReplaceDialogComponent,
  tags: ['autodocs'],
  decorators: [
    moduleMetadata({
      providers: [
        {
          provide: LuxDialogRef,
          useValue: { data: { multiple: false, deleteProtection: false }, closeDialog: () => undefined }
        }
      ]
    })
  ]
};

export default meta;
type Story = StoryObj<LuxFileReplaceDialogComponent>;

export const Default: Story = {};

export const Multiple: Story = {
  decorators: [
    moduleMetadata({
      providers: [
        {
          provide: LuxDialogRef,
          useValue: { data: { multiple: true, deleteProtection: false }, closeDialog: () => undefined }
        }
      ]
    })
  ]
};

export const DeleteProtection: Story = {
  decorators: [
    moduleMetadata({
      providers: [
        {
          provide: LuxDialogRef,
          useValue: { data: { multiple: false, deleteProtection: true }, closeDialog: () => undefined }
        }
      ]
    })
  ]
};
