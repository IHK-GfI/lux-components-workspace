import type { Meta, StoryObj } from '@storybook/angular-vite';
import { moduleMetadata } from '@storybook/angular-vite';
import { LuxPanelComponent } from '../lux-panel.component';
import { LuxPanelContentComponent } from './lux-panel-content.component';
import { LuxPanelHeaderTitleComponent } from './lux-panel-header-title.component';

const meta: Meta<LuxPanelContentComponent> = {
  title: 'Layout/lux-panel-content',
  component: LuxPanelContentComponent,
  tags: ['autodocs'],
  decorators: [moduleMetadata({ imports: [LuxPanelComponent, LuxPanelHeaderTitleComponent] })]
};

export default meta;
type Story = StoryObj<LuxPanelContentComponent>;

export const Default: Story = {
  render: () => ({
    template: `
      <lux-panel [luxExpanded]="true">
        <lux-panel-header-title>Titel des Panels</lux-panel-header-title>
        <lux-panel-content>
          <p>Hier steht der Inhalt des Panels, der beim Aufklappen sichtbar wird.</p>
        </lux-panel-content>
      </lux-panel>
    `
  })
};
