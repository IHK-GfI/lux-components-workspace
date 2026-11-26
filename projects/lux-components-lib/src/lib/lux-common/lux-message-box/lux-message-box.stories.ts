import type { Meta, StoryObj } from '@storybook/angular-vite';
import { LuxMessageBoxComponent } from './lux-message-box.component';
import { ILuxMessage } from './lux-message-box-model/lux-message.interface';

const beispielNachrichten: ILuxMessage[] = [
  { text: 'Die Daten wurden erfolgreich gespeichert.', iconName: 'lux-interface-check-circle', color: 'green' },
  { text: 'Bitte prüfen Sie Ihre Eingaben.', iconName: 'lux-interface-alert-warning-triangle', color: 'orange' },
  { text: 'Die Verbindung zum Server ist fehlgeschlagen.', iconName: 'lux-interface-alert-warning-circle', color: 'red' }
];

const meta: Meta<LuxMessageBoxComponent> = {
  title: 'Allgemein/lux-message-box',
  component: LuxMessageBoxComponent,
  tags: ['autodocs'],
  args: {
    luxMessages: beispielNachrichten,
    luxMaximumDisplayed: 3,
    luxIndex: 0,
    luxGrabFocus: false
  }
};

export default meta;
type Story = StoryObj<LuxMessageBoxComponent>;

export const Default: Story = {};

export const MitPaginierung: Story = {
  args: {
    luxMaximumDisplayed: 1
  }
};

export const MitFokus: Story = {
  args: {
    luxGrabFocus: true
  }
};

export const Leer: Story = {
  args: {
    luxMessages: []
  }
};
