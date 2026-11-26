import type { Meta, StoryObj } from '@storybook/angular-vite';
import { LuxTourHintRef } from '../lux-tour-hint-model/lux-tour-hint-ref.class';
import { LuxTourHintPresetComponent } from './lux-tour-hint-preset.component';

const meta: Meta<LuxTourHintPresetComponent> = {
  title: 'Tour/lux-tour-hint-preset',
  component: LuxTourHintPresetComponent,
  tags: ['autodocs'],
  moduleMetadata: {
    providers: [
      {
        provide: LuxTourHintRef,
        useValue: {
          data: {
            title: 'Willkommen',
            content: 'Mit dieser Schaltfläche starten Sie einen neuen Vorgang.'
          },
          optionDontShowAgain: true,
          close: () => undefined
        } as Partial<LuxTourHintRef>
      }
    ]
  }
};

export default meta;
type Story = StoryObj<LuxTourHintPresetComponent>;

export const Default: Story = {};
