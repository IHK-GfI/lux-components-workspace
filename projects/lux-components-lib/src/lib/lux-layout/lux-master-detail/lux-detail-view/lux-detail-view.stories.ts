import type { Meta, StoryObj } from '@storybook/angular-vite';
import { LuxDetailViewComponent } from './lux-detail-view.component';

const meta: Meta<LuxDetailViewComponent> = {
  title: 'Layout/lux-detail-view',
  component: LuxDetailViewComponent,
  tags: ['autodocs']
};

export default meta;
type Story = StoryObj<LuxDetailViewComponent>;

export const Default: Story = {
  render: (args) => ({
    props: args,
    template: `
      <lux-detail-view>
        <ng-template let-detail>
          <h3>Detail</h3>
          <p>Hier steht der Inhalt der Detailansicht.</p>
        </ng-template>
      </lux-detail-view>
    `
  })
};
