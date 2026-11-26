import type { Meta, StoryObj } from '@storybook/angular-vite';
import { moduleMetadata } from '@storybook/angular-vite';
import { LuxButtonComponent } from '../../lux-action/lux-button/lux-button.component';
import { LuxPopupActionsDirective } from './lux-popup-actions.directive';
import { LuxPopupTriggerDirective } from './lux-popup-trigger.directive';
import { LuxPopupComponent } from './lux-popup.component';

const meta: Meta<LuxPopupComponent> = {
  title: 'Popups/lux-popup',
  component: LuxPopupComponent,
  tags: ['autodocs'],
  decorators: [
    moduleMetadata({
      imports: [LuxButtonComponent, LuxPopupTriggerDirective, LuxPopupActionsDirective]
    })
  ],
  args: {
    luxTitle: 'Information',
    luxPersistent: false,
    luxMinWidth: 220,
    luxMaxWidth: 360
  }
};

export default meta;
type Story = StoryObj<LuxPopupComponent>;

export const Default: Story = {
  render: (args) => ({
    props: args,
    template: `
      <lux-popup #popup [luxTitle]="luxTitle" [luxPersistent]="luxPersistent" [luxMinWidth]="luxMinWidth" [luxMaxWidth]="luxMaxWidth">
        <p>Hier steht der Inhalt des Popups.</p>
      </lux-popup>
      <lux-button luxLabel="Popup öffnen" [luxPopupTriggerFor]="popup" />
    `
  })
};

export const WithActions: Story = {
  args: {
    luxTitle: 'Änderungen speichern?',
    luxPersistent: true
  },
  render: (args) => ({
    props: args,
    template: `
      <lux-popup #popup [luxTitle]="luxTitle" [luxPersistent]="luxPersistent">
        <p>Ihre Änderungen wurden noch nicht gespeichert.</p>
        <ng-template luxPopupActions>
          <lux-button luxLabel="Verwerfen" luxType="reset" />
          <lux-button luxLabel="Speichern" luxType="submit" luxColor="primary" />
        </ng-template>
      </lux-popup>
      <lux-button luxLabel="Popup mit Aktionen öffnen" [luxPopupTriggerFor]="popup" />
    `
  })
};
