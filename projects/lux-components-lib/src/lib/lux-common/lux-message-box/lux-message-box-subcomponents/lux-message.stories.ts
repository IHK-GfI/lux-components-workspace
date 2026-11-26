import type { Meta, StoryObj } from '@storybook/angular-vite';
import { LuxMessageComponent } from './lux-message.component';

const meta: Meta<LuxMessageComponent> = {
  title: 'Allgemein/lux-message',
  component: LuxMessageComponent,
  tags: ['autodocs'],
  args: {
    luxMessage: {
      text: 'Die Daten wurden erfolgreich gespeichert.',
      iconName: 'lux-interface-check-circle',
      color: 'green'
    }
  }
};

export default meta;
type Story = StoryObj<LuxMessageComponent>;

export const Default: Story = {};

export const OhneIcon: Story = {
  args: {
    luxMessage: {
      text: 'Hinweis ohne Icon.',
      color: 'blue'
    }
  }
};

export const Fehler: Story = {
  args: {
    luxMessage: {
      text: 'Die Verbindung zum Server ist fehlgeschlagen.',
      iconName: 'lux-interface-alert-warning-circle',
      color: 'red'
    }
  }
};
