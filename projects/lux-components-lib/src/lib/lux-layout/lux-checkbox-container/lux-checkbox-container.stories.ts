import type { Meta, StoryObj } from '@storybook/angular-vite';
import { moduleMetadata } from '@storybook/angular-vite';
import { LuxCheckboxComponent } from '../../lux-form/lux-checkbox/lux-checkbox.component';
import { LuxCheckboxContainerComponent } from './lux-checkbox-container.component';

const meta: Meta<LuxCheckboxContainerComponent> = {
  title: 'Layout/lux-checkbox-container',
  component: LuxCheckboxContainerComponent,
  tags: ['autodocs'],
  decorators: [moduleMetadata({ imports: [LuxCheckboxComponent] })],
  args: {
    luxLabel: 'Auswahl',
    luxVertical: true,
    luxShowRequiredMarker: false
  },
  render: (args) => ({
    props: args,
    template: `
      <lux-checkbox-container [luxLabel]="luxLabel" [luxVertical]="luxVertical" [luxShowRequiredMarker]="luxShowRequiredMarker">
        <lux-checkbox luxLabel="Option A" />
        <lux-checkbox luxLabel="Option B" />
        <lux-checkbox luxLabel="Option C" />
      </lux-checkbox-container>
    `
  })
};

export default meta;
type Story = StoryObj<LuxCheckboxContainerComponent>;

export const Vertical: Story = {};

export const Horizontal: Story = {
  args: {
    luxVertical: false
  }
};

export const Required: Story = {
  args: {
    luxShowRequiredMarker: true
  }
};
