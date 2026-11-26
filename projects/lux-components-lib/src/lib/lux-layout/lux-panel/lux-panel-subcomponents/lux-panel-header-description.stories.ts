import type { Meta, StoryObj } from '@storybook/angular-vite';
import { moduleMetadata } from '@storybook/angular-vite';
import { LuxPanelComponent } from '../lux-panel.component';
import { LuxPanelContentComponent } from './lux-panel-content.component';
import { LuxPanelHeaderDescriptionComponent } from './lux-panel-header-description.component';
import { LuxPanelHeaderTitleComponent } from './lux-panel-header-title.component';

const meta: Meta<LuxPanelHeaderDescriptionComponent> = {
  title: 'Layout/lux-panel-header-description',
  component: LuxPanelHeaderDescriptionComponent,
  tags: ['autodocs'],
  decorators: [moduleMetadata({ imports: [LuxPanelComponent, LuxPanelContentComponent, LuxPanelHeaderTitleComponent] })],
  args: {
    luxTruncated: false,
    luxTruncatedTooltip: ''
  }
};

export default meta;
type Story = StoryObj<LuxPanelHeaderDescriptionComponent>;

export const Default: Story = {
  render: (args) => ({
    props: args,
    template: `
      <lux-panel>
        <lux-panel-header-title>Titel des Panels</lux-panel-header-title>
        <lux-panel-header-description [luxTruncated]="luxTruncated" [luxTruncatedTooltip]="luxTruncatedTooltip">
          Kurze Beschreibung des Panels
        </lux-panel-header-description>
        <lux-panel-content>
          <p>Hier steht der Inhalt des Panels.</p>
        </lux-panel-content>
      </lux-panel>
    `
  })
};

export const Truncated: Story = {
  args: {
    luxTruncated: true,
    luxTruncatedTooltip: 'Eine sehr lange Beschreibung, die vollständig im Tooltip angezeigt wird'
  },
  render: (args) => ({
    props: args,
    template: `
      <lux-panel>
        <lux-panel-header-title>Titel des Panels</lux-panel-header-title>
        <lux-panel-header-description [luxTruncated]="luxTruncated" [luxTruncatedTooltip]="luxTruncatedTooltip">
          Eine sehr lange Beschreibung des Panels, die abgeschnitten wird
        </lux-panel-header-description>
      </lux-panel>
    `
  })
};
