import type { Meta, StoryObj } from '@storybook/angular-vite';
import { LuxChipComponent } from './lux-chip.component';

const meta: Meta<LuxChipComponent> = {
  title: 'Formular/lux-chip',
  component: LuxChipComponent,
  tags: ['autodocs'],
  args: {
    luxDisabled: false,
    luxRemovable: true,
    luxColor: 'primary'
  },
  render: (args) => ({
    props: args,
    template: `
      <lux-chip [luxDisabled]="luxDisabled" [luxRemovable]="luxRemovable" [luxColor]="luxColor">Berlin</lux-chip>
    `
  })
};

export default meta;
type Story = StoryObj<LuxChipComponent>;

export const Default: Story = {};

export const Disabled: Story = {
  args: {
    luxDisabled: true
  }
};
