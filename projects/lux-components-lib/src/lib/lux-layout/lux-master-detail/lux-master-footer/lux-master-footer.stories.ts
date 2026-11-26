import type { Meta, StoryObj } from '@storybook/angular-vite';
import { LuxMasterFooterComponent } from './lux-master-footer.component';

const meta: Meta<LuxMasterFooterComponent> = {
  title: 'Layout/lux-master-footer',
  component: LuxMasterFooterComponent,
  tags: ['autodocs']
};

export default meta;
type Story = StoryObj<LuxMasterFooterComponent>;

export const Default: Story = {
  render: () => ({
    template: `
      <lux-master-footer>
        <p>Inhalt des Fußbereichs der Master-Liste.</p>
      </lux-master-footer>
    `
  })
};
