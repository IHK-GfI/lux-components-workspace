import type { Meta, StoryObj } from '@storybook/angular-vite';
import { moduleMetadata } from '@storybook/angular-vite';
import { LuxButtonComponent } from '../../lux-action/lux-button/lux-button.component';
import { LuxPanelComponent } from './lux-panel.component';
import { LuxPanelActionComponent } from './lux-panel-subcomponents/lux-panel-action.component';
import { LuxPanelContentComponent } from './lux-panel-subcomponents/lux-panel-content.component';
import { LuxPanelHeaderDescriptionComponent } from './lux-panel-subcomponents/lux-panel-header-description.component';
import { LuxPanelHeaderTitleComponent } from './lux-panel-subcomponents/lux-panel-header-title.component';

const meta: Meta<LuxPanelComponent> = {
  title: 'Layout/lux-panel',
  component: LuxPanelComponent,
  tags: ['autodocs'],
  decorators: [
    moduleMetadata({
      imports: [
        LuxButtonComponent,
        LuxPanelActionComponent,
        LuxPanelContentComponent,
        LuxPanelHeaderDescriptionComponent,
        LuxPanelHeaderTitleComponent
      ]
    })
  ],
  args: {
    luxExpanded: false,
    luxDisabled: false
  }
};

export default meta;
type Story = StoryObj<LuxPanelComponent>;

export const Default: Story = {
  render: (args) => ({
    props: args,
    template: `
      <lux-panel [(luxExpanded)]="luxExpanded" [luxDisabled]="luxDisabled">
        <lux-panel-header-title>Titel des Panels</lux-panel-header-title>
        <lux-panel-header-description>Kurze Beschreibung des Panels</lux-panel-header-description>
        <lux-panel-content>
          <p>Hier steht der Inhalt des Panels.</p>
        </lux-panel-content>
      </lux-panel>
    `
  })
};

export const Expanded: Story = {
  args: {
    luxExpanded: true
  },
  render: (args) => ({
    props: args,
    template: `
      <lux-panel [(luxExpanded)]="luxExpanded" [luxDisabled]="luxDisabled">
        <lux-panel-header-title>Titel des Panels</lux-panel-header-title>
        <lux-panel-header-description>Kurze Beschreibung des Panels</lux-panel-header-description>
        <lux-panel-content>
          <p>Hier steht der Inhalt des Panels.</p>
        </lux-panel-content>
      </lux-panel>
    `
  })
};

export const WithAction: Story = {
  render: (args) => ({
    props: args,
    template: `
      <lux-panel [(luxExpanded)]="luxExpanded" [luxDisabled]="luxDisabled">
        <lux-panel-header-title>Titel des Panels</lux-panel-header-title>
        <lux-panel-header-description>Kurze Beschreibung des Panels</lux-panel-header-description>
        <lux-panel-content>
          <p>Hier steht der Inhalt des Panels.</p>
          <lux-panel-action>
            <lux-button luxType="submit" luxLabel="Speichern" luxColor="primary" />
          </lux-panel-action>
        </lux-panel-content>
      </lux-panel>
    `
  })
};

export const Disabled: Story = {
  args: {
    luxDisabled: true
  },
  render: (args) => ({
    props: args,
    template: `
      <lux-panel [(luxExpanded)]="luxExpanded" [luxDisabled]="luxDisabled">
        <lux-panel-header-title>Titel des Panels</lux-panel-header-title>
        <lux-panel-header-description>Dieses Panel ist deaktiviert</lux-panel-header-description>
        <lux-panel-content>
          <p>Hier steht der Inhalt des Panels.</p>
        </lux-panel-content>
      </lux-panel>
    `
  })
};
