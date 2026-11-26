import type { Meta, StoryObj } from '@storybook/angular-vite';
import { moduleMetadata } from '@storybook/angular-vite';
import { LuxPanelComponent } from '../lux-panel.component';
import { LuxPanelActionComponent } from './lux-panel-action.component';
import { LuxPanelHeaderTitleComponent } from './lux-panel-header-title.component';
import { LuxPanelContentComponent } from './lux-panel-content.component';
import { LuxButtonComponent } from '../../../lux-action/lux-button/lux-button.component';

const meta: Meta<LuxPanelActionComponent> = {
  title: 'Layout/lux-panel-action',
  component: LuxPanelActionComponent,
  tags: ['autodocs'],
  decorators: [
    moduleMetadata({
      imports: [LuxPanelComponent, LuxPanelHeaderTitleComponent, LuxPanelContentComponent, LuxButtonComponent]
    })
  ]
};

export default meta;
type Story = StoryObj<LuxPanelActionComponent>;

export const Default: Story = {
  render: () => ({
    template: `
      <lux-panel [luxExpanded]="true">
        <lux-panel-header-title>Titel des Panels</lux-panel-header-title>
        <lux-panel-content>
          <p>Hier steht der Inhalt des Panels.</p>
        </lux-panel-content>
        <lux-panel-action>
          <lux-button luxLabel="Abbrechen" luxType="reset" />
          <lux-button luxLabel="Speichern" luxType="submit" luxColor="primary" />
        </lux-panel-action>
      </lux-panel>
    `
  })
};
