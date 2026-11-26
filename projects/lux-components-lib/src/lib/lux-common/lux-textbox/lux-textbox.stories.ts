import type { Meta, StoryObj } from '@storybook/angular-vite';
import { moduleMetadata } from '@storybook/angular-vite';
import { LuxTextboxComponent } from './lux-textbox.component';

const meta: Meta<LuxTextboxComponent> = {
  title: 'Allgemein/lux-textbox',
  component: LuxTextboxComponent,
  tags: ['autodocs'],
  decorators: [moduleMetadata({ imports: [LuxTextboxComponent] })],
  args: {
    luxTitle: 'Hinweis',
    luxColor: 'blue',
    luxIcon: '',
    luxHeading: 3
  },
  render: (args) => ({
    props: args,
    template: `
      <lux-textbox [luxTitle]="luxTitle" [luxColor]="luxColor" [luxIcon]="luxIcon" [luxHeading]="luxHeading">
        <p>Hier steht der Inhalt des Textkastens.</p>
      </lux-textbox>
    `
  })
};

export default meta;
type Story = StoryObj<LuxTextboxComponent>;

export const Default: Story = {};

export const Rot: Story = {
  args: {
    luxTitle: 'Fehler',
    luxColor: 'red',
    luxIcon: 'lux-interface-alert-warning-circle'
  }
};

export const GelbMitUeberschriftEbene1: Story = {
  args: {
    luxTitle: 'Achtung',
    luxColor: 'yellow',
    luxIcon: 'lux-interface-alert-warning-triangle',
    luxHeading: 1
  }
};

export const Gruen: Story = {
  args: {
    luxTitle: 'Erfolgreich',
    luxColor: 'green',
    luxIcon: 'lux-interface-check-circle'
  }
};
