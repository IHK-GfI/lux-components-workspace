import type { Meta, StoryObj } from '@storybook/angular-vite';
import { LuxFileUploadComponent } from './lux-file-upload.component';

const meta: Meta<LuxFileUploadComponent> = {
  title: 'Formular/lux-file-upload',
  component: LuxFileUploadComponent,
  tags: ['autodocs'],
  args: {
    luxLabel: 'Dateien hochladen',
    luxLabelLink: 'Dateien auswählen',
    luxLabelLinkShort: 'Auswählen',
    luxMultiple: true
  }
};

export default meta;
type Story = StoryObj<LuxFileUploadComponent>;

export const Default: Story = {};

export const SingleFile: Story = {
  args: {
    luxMultiple: false
  }
};

export const ListOnly: Story = {
  args: {
    luxListOnly: true,
    luxSelected: [{ name: 'Bericht.pdf', type: 'application/pdf', size: 204800 }]
  }
};
