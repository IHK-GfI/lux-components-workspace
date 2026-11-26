import type { Meta, StoryObj } from '@storybook/angular-vite';
import { LuxDetailHeaderComponent } from './lux-detail-header.component';

const meta: Meta<LuxDetailHeaderComponent> = {
  title: 'Layout/lux-detail-header',
  component: LuxDetailHeaderComponent,
  tags: ['autodocs']
};

export default meta;
type Story = StoryObj<LuxDetailHeaderComponent>;

export const Default: Story = {
  render: () => ({
    template: `
      <lux-detail-header>
        <h2>Detailansicht</h2>
        <p>Individueller Inhalt im Kopfbereich der Detailansicht.</p>
      </lux-detail-header>
    `
  })
};
