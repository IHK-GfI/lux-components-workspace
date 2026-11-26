import type { Meta, StoryObj } from '@storybook/angular-vite';
import { moduleMetadata } from '@storybook/angular-vite';
import { LuxMasterHeaderComponent } from './lux-master-header.component';
import { LuxMasterHeaderContentComponent } from './lux-master-header-content.component';

const meta: Meta<LuxMasterHeaderContentComponent> = {
  title: 'Layout/lux-master-header-content',
  component: LuxMasterHeaderContentComponent,
  tags: ['autodocs'],
  decorators: [moduleMetadata({ imports: [LuxMasterHeaderComponent] })]
};

export default meta;
type Story = StoryObj<LuxMasterHeaderContentComponent>;

export const Default: Story = {
  render: () => ({
    template: `
      <lux-master-header>
        <lux-master-header-content>
          <p>Inhalt des Kopfbereichs der Master-Liste, z. B. Filter.</p>
        </lux-master-header-content>
      </lux-master-header>
    `
  })
};
