import type { Meta, StoryObj } from '@storybook/angular-vite';
import { LuxDetailWrapperComponent } from './lux-detail-wrapper.component';

const meta: Meta<LuxDetailWrapperComponent> = {
  title: 'Layout/lux-detail-wrapper',
  component: LuxDetailWrapperComponent,
  tags: ['autodocs'],
  args: {
    luxDetailContext: { $implicit: { title: 'Beispiel-Detail', subtitle: 'Kontext aus den Story-Argumenten' } }
  }
};

export default meta;
type Story = StoryObj<LuxDetailWrapperComponent>;

export const Default: Story = {
  render: (args) => ({
    props: args,
    template: `
      <ng-template #detailTemplate let-detail>
        <h3>{{ detail.title }}</h3>
        <p>{{ detail.subtitle }}</p>
      </ng-template>
      <lux-detail-wrapper [luxDetailTemplate]="detailTemplate" [luxDetailContext]="luxDetailContext" />
    `
  })
};
