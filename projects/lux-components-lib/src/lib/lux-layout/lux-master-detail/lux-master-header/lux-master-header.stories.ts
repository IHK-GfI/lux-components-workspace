import type { Meta, StoryObj } from '@storybook/angular-vite';
import { moduleMetadata } from '@storybook/angular-vite';
import { LuxMasterHeaderComponent } from './lux-master-header.component';
import { LuxMasterHeaderContentComponent } from './lux-master-header-content.component';

const meta: Meta<LuxMasterHeaderComponent> = {
  title: 'Layout/lux-master-header',
  component: LuxMasterHeaderComponent,
  tags: ['autodocs'],
  decorators: [moduleMetadata({ imports: [LuxMasterHeaderContentComponent] })],
  args: {
    luxToggleHidden: false
  }
};

export default meta;
type Story = StoryObj<LuxMasterHeaderComponent>;

export const Default: Story = {
  render: (args) => ({
    props: args,
    template: `
      <lux-master-header [luxToggleHidden]="luxToggleHidden">
        <lux-master-header-content>
          <p>Inhalt des Kopfbereichs der Master-Liste.</p>
        </lux-master-header-content>
      </lux-master-header>
    `
  })
};

export const ToggleHidden: Story = {
  args: {
    luxToggleHidden: true
  },
  render: (args) => ({
    props: args,
    template: `
      <lux-master-header [luxToggleHidden]="luxToggleHidden">
        <p>Der Toggle zum Ein- und Ausklappen ist ausgeblendet.</p>
      </lux-master-header>
    `
  })
};
