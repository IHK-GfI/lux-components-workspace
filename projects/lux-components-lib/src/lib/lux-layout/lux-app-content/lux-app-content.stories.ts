import type { Meta, StoryObj } from '@storybook/angular-vite';
import { moduleMetadata } from '@storybook/angular-vite';
import { LuxAppContentComponent } from './lux-app-content.component';

const meta: Meta<LuxAppContentComponent> = {
  title: 'Layout/lux-app-content',
  component: LuxAppContentComponent,
  tags: ['autodocs'],
  decorators: [moduleMetadata({ imports: [LuxAppContentComponent] })],
  args: {
    luxAriaRoleMainLabel: 'Hauptinhalt'
  },
  render: (args) => ({
    props: args,
    template: `
      <lux-app-content [luxAriaRoleMainLabel]="luxAriaRoleMainLabel">
        <h1>Seiteninhalt</h1>
        <p>Dies ist der Hauptinhalt der Anwendung. Er wird innerhalb des App-Layouts dargestellt.</p>
      </lux-app-content>
    `
  })
};

export default meta;
type Story = StoryObj<LuxAppContentComponent>;

export const Standard: Story = {};

export const WithoutAriaLabel: Story = {
  args: {
    luxAriaRoleMainLabel: ''
  }
};
