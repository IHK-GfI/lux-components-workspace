import type { Meta, StoryObj } from '@storybook/angular-vite';
import { LuxFileListComponent } from './lux-file-list.component';

const meta: Meta<LuxFileListComponent> = {
  title: 'Formular/lux-file-list',
  component: LuxFileListComponent,
  tags: ['autodocs'],
  args: {
    luxLabel: 'Anhänge',
    luxSelected: [
      { name: 'Bericht.pdf', type: 'application/pdf', size: 204800 },
      { name: 'Tabelle.xlsx', type: 'application/vnd.ms-excel', size: 51200 }
    ]
  }
};

export default meta;
type Story = StoryObj<LuxFileListComponent>;

export const Default: Story = {};

export const SingleFile: Story = {
  args: {
    luxMultiple: false,
    luxSelected: [{ name: 'Bericht.pdf', type: 'application/pdf', size: 204800 }]
  }
};

export const WithoutPreview: Story = {
  args: {
    luxShowPreview: false
  }
};
