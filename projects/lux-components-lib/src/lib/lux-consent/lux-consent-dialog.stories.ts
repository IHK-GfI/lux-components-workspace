import type { Meta, StoryObj } from '@storybook/angular-vite';
import { EMPTY } from 'rxjs';
import { LuxDialogRef } from '../lux-popups/lux-dialog/lux-dialog-model/lux-dialog-ref.class';
import { LuxConsentDialogComponent } from './lux-consent-dialog.component';

const meta: Meta<LuxConsentDialogComponent> = {
  title: 'Einwilligung/lux-consent-dialog',
  component: LuxConsentDialogComponent,
  tags: ['autodocs'],
  moduleMetadata: {
    providers: [
      {
        provide: LuxDialogRef,
        useValue: {
          data: undefined,
          showCloseButton: true,
          dialogClosed: EMPTY,
          closeDialog: () => undefined
        } as Partial<LuxDialogRef>
      }
    ]
  }
};

export default meta;
type Story = StoryObj<LuxConsentDialogComponent>;

export const Default: Story = {};
