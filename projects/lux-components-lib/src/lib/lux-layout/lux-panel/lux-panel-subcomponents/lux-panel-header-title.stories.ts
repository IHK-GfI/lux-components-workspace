import type { Meta, StoryObj } from '@storybook/angular-vite';
import { moduleMetadata } from '@storybook/angular-vite';
import { LuxPanelComponent } from '../lux-panel.component';
import { LuxPanelContentComponent } from './lux-panel-content.component';
import { LuxPanelHeaderDescriptionComponent } from './lux-panel-header-description.component';
import { LuxPanelHeaderTitleComponent } from './lux-panel-header-title.component';

const meta: Meta<LuxPanelHeaderTitleComponent> = {
  title: 'Layout/lux-panel-header-title',
  component: LuxPanelHeaderTitleComponent,
  tags: ['autodocs'],
  decorators: [moduleMetadata({ imports: [LuxPanelComponent, LuxPanelContentComponent, LuxPanelHeaderDescriptionComponent] })],
  args: {
    luxTruncated: false,
    luxTruncatedTooltip: ''
  }
};

export default meta;
type Story = StoryObj<LuxPanelHeaderTitleComponent>;

export const Default: Story = {
  render: (args) => ({
    props: args,
    template: `
      <lux-panel>
        <lux-panel-header-title [luxTruncated]="luxTruncated" [luxTruncatedTooltip]="luxTruncatedTooltip">
          Titel des Panels
        </lux-panel-header-title>
        <lux-panel-header-description>Kurze Beschreibung des Panels</lux-panel-header-description>
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
    luxTruncatedTooltip: 'Ein sehr langer Titel des Panels, der vollständig im Tooltip angezeigt wird'
  },
  render: (args) => ({
    props: args,
    template: `
      <lux-panel>
        <lux-panel-header-title [luxTruncated]="luxTruncated" [luxTruncatedTooltip]="luxTruncatedTooltip">
          Ein sehr langer Titel des Panels, der abgeschnitten wird
        </lux-panel-header-title>
        <lux-panel-content>
          <p>Hier steht der Inhalt des Panels.</p>
        </lux-panel-content>
      </lux-panel>
    `
  })
};
