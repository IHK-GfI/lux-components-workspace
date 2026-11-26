import type { Meta, StoryObj } from '@storybook/angular-vite';
import { moduleMetadata } from '@storybook/angular-vite';
import { LuxButtonComponent } from '../../lux-action/lux-button/lux-button.component';
import { LuxCardComponent } from './lux-card.component';
import { LuxCardActionsComponent } from './lux-card-subcomponents/lux-card-actions.component';
import { LuxCardContentComponent } from './lux-card-subcomponents/lux-card-content.component';
import { LuxCardContentExpandedComponent } from './lux-card-subcomponents/lux-card-content-expanded.component';

const meta: Meta<LuxCardComponent> = {
  title: 'Layout/lux-card',
  component: LuxCardComponent,
  tags: ['autodocs'],
  decorators: [
    moduleMetadata({
      imports: [LuxButtonComponent, LuxCardActionsComponent, LuxCardContentComponent, LuxCardContentExpandedComponent]
    })
  ],
  args: {
    luxTitle: 'Titel der Karte',
    luxSubTitle: 'Untertitel der Karte'
  }
};

export default meta;
type Story = StoryObj<LuxCardComponent>;

export const Default: Story = {
  render: (args) => ({
    props: args,
    template: `
      <lux-card [luxTitle]="luxTitle" [luxSubTitle]="luxSubTitle">
        <lux-card-content>
          <p>Hier steht der Inhalt der Karte.</p>
        </lux-card-content>
      </lux-card>
    `
  })
};

export const WithActions: Story = {
  render: (args) => ({
    props: args,
    template: `
      <lux-card [luxTitle]="luxTitle" [luxSubTitle]="luxSubTitle">
        <lux-card-content>
          <p>Hier steht der Inhalt der Karte.</p>
        </lux-card-content>
        <lux-card-actions luxAlign="right">
          <lux-button luxType="reset" luxLabel="Abbrechen" />
          <lux-button luxType="submit" luxLabel="Speichern" luxColor="primary" />
        </lux-card-actions>
      </lux-card>
    `
  })
};

export const Expandable: Story = {
  args: {
    luxExpanded: false,
    luxExpandedLabelOpen: 'Mehr anzeigen',
    luxExpandedLabelClose: 'Weniger anzeigen'
  },
  render: (args) => ({
    props: args,
    template: `
      <lux-card
        [luxTitle]="luxTitle"
        [luxSubTitle]="luxSubTitle"
        [luxExpandedLabelOpen]="luxExpandedLabelOpen"
        [luxExpandedLabelClose]="luxExpandedLabelClose"
        [(luxExpanded)]="luxExpanded"
      >
        <lux-card-content>
          <p>Dieser Inhalt ist immer sichtbar.</p>
        </lux-card-content>
        <lux-card-content-expanded>
          <p>Dieser Inhalt wird beim Aufklappen angezeigt.</p>
        </lux-card-content-expanded>
      </lux-card>
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
      <lux-card [luxTitle]="luxTitle" [luxSubTitle]="luxSubTitle" [luxDisabled]="luxDisabled">
        <lux-card-content>
          <p>Diese Karte ist deaktiviert.</p>
        </lux-card-content>
      </lux-card>
    `
  })
};
