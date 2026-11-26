import type { Meta, StoryObj } from '@storybook/angular-vite';
import { LuxTourHintComponent } from './lux-tour-hint.component';

const meta: Meta<LuxTourHintComponent> = {
  title: 'Tour/lux-tour-hint',
  component: LuxTourHintComponent,
  tags: ['autodocs']
};

export default meta;
type Story = StoryObj<LuxTourHintComponent>;

export const Default: Story = {
  render: () => ({
    props: {},
    template: `
      <div class="lux-flex lux-flex-col lux-items-start lux-gap-4 lux-p-4" style="min-height: 320px">
        <div #tourTarget class="lux-flex lux-p-4 lux-rounded-md" style="border: 1px dashed currentColor">Zielelement</div>
        <lux-tour-hint [luxTarget]="tourTarget">
          <p>Hier können Sie zentrale Funktionen der Anwendung finden.</p>
        </lux-tour-hint>
      </div>
    `
  })
};
