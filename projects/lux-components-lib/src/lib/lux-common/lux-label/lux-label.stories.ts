import type { Meta, StoryObj } from '@storybook/angular-vite';
import { moduleMetadata } from '@storybook/angular-vite';
import { LuxLabelComponent } from './lux-label.component';

const meta: Meta<LuxLabelComponent> = {
  title: 'Allgemein/lux-label',
  component: LuxLabelComponent,
  tags: ['autodocs'],
  decorators: [moduleMetadata({ imports: [LuxLabelComponent] })],
  args: {
    luxId: 'beispiel-label'
  },
  render: (args) => ({
    props: args,
    template: `<lux-label [luxId]="luxId">Beschriftung</lux-label>`
  })
};

export default meta;
type Story = StoryObj<LuxLabelComponent>;

export const Default: Story = {};

export const MitLangemText: Story = {
  args: {
    luxId: 'beispiel-label-lang'
  },
  render: (args) => ({
    props: args,
    template: `<lux-label [luxId]="luxId">Dies ist eine etwas längere Beschriftung, die auch über mehrere Zeilen umbrochen werden kann.</lux-label>`
  })
};
