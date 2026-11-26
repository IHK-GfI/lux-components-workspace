import type { Meta, StoryObj } from '@storybook/angular-vite';
import { moduleMetadata } from '@storybook/angular-vite';
import { LuxPanelComponent } from '../lux-panel/lux-panel.component';
import { LuxPanelContentComponent } from '../lux-panel/lux-panel-subcomponents/lux-panel-content.component';
import { LuxPanelHeaderDescriptionComponent } from '../lux-panel/lux-panel-subcomponents/lux-panel-header-description.component';
import { LuxPanelHeaderTitleComponent } from '../lux-panel/lux-panel-subcomponents/lux-panel-header-title.component';
import { LuxAccordionComponent } from './lux-accordion.component';

const meta: Meta<LuxAccordionComponent> = {
  title: 'Layout/lux-accordion',
  component: LuxAccordionComponent,
  tags: ['autodocs'],
  decorators: [
    moduleMetadata({
      imports: [LuxPanelComponent, LuxPanelContentComponent, LuxPanelHeaderDescriptionComponent, LuxPanelHeaderTitleComponent]
    })
  ],
  args: {
    luxMode: 'default',
    luxMulti: false,
    luxColor: 'primary',
    luxDisabled: false,
    luxHideToggle: false
  },
  render: (args) => ({
    props: args,
    template: `
      <lux-accordion
        [luxMode]="luxMode"
        [luxMulti]="luxMulti"
        [luxColor]="luxColor"
        [luxDisabled]="luxDisabled"
        [luxHideToggle]="luxHideToggle"
      >
        <lux-panel>
          <lux-panel-header-title>Erster Bereich</lux-panel-header-title>
          <lux-panel-header-description>Beschreibung des ersten Bereichs</lux-panel-header-description>
          <lux-panel-content>
            <p>Inhalt des ersten Bereichs.</p>
          </lux-panel-content>
        </lux-panel>
        <lux-panel>
          <lux-panel-header-title>Zweiter Bereich</lux-panel-header-title>
          <lux-panel-header-description>Beschreibung des zweiten Bereichs</lux-panel-header-description>
          <lux-panel-content>
            <p>Inhalt des zweiten Bereichs.</p>
          </lux-panel-content>
        </lux-panel>
      </lux-accordion>
    `
  })
};

export default meta;
type Story = StoryObj<LuxAccordionComponent>;

export const Default: Story = {};

export const Multi: Story = {
  args: {
    luxMulti: true
  }
};

export const FlatMode: Story = {
  args: {
    luxMode: 'flat',
    luxTogglePosition: 'before'
  }
};

export const Disabled: Story = {
  args: {
    luxDisabled: true
  }
};
