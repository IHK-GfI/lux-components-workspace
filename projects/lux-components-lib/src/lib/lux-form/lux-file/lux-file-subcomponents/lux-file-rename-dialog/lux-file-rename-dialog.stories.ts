import type { Meta, StoryObj } from '@storybook/angular-vite';
import { moduleMetadata } from '@storybook/angular-vite';
import { LuxDialogRef } from '../../../../lux-popups/lux-dialog/lux-dialog-model/lux-dialog-ref.class';
import { LuxFileRenameDialogComponent } from './lux-file-rename-dialog.component';

const meta: Meta<LuxFileRenameDialogComponent> = {
  title: 'Formular/lux-file-rename-dialog',
  component: LuxFileRenameDialogComponent,
  tags: ['autodocs'],
  decorators: [
    moduleMetadata({
      providers: [
        {
          provide: LuxDialogRef,
          useValue: { data: { name: 'Bericht.pdf', type: 'application/pdf' }, closeDialog: () => undefined }
        }
      ]
    })
  ]
};

export default meta;
type Story = StoryObj<LuxFileRenameDialogComponent>;

export const Default: Story = {};
