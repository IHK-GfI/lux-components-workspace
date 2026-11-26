import { Component, inject } from '@angular/core';
import type { Meta, StoryObj } from '@storybook/angular-vite';
import { moduleMetadata } from '@storybook/angular-vite';
import { LuxButtonComponent } from '../../../lux-action/lux-button/lux-button.component';
import { LuxDialogService } from '../lux-dialog.service';
import { LuxDialogActionsComponent } from './lux-dialog-structure-subcomponents/lux-dialog-actions.component';
import { LuxDialogContentComponent } from './lux-dialog-structure-subcomponents/lux-dialog-content.component';
import { LuxDialogTitleComponent } from './lux-dialog-structure-subcomponents/lux-dialog-title.component';
import { LuxDialogStructureComponent } from './lux-dialog-structure.component';

@Component({
  selector: 'lux-dialog-structure-demo-content',
  imports: [LuxDialogStructureComponent, LuxDialogTitleComponent, LuxDialogContentComponent, LuxDialogActionsComponent, LuxButtonComponent],
  template: `
    <lux-dialog-structure luxDialogIcon="lux-interface-alert-information-circle">
      <lux-dialog-title>Dialogtitel</lux-dialog-title>
      <lux-dialog-content>
        <p>Hier steht der Inhalt des Dialogs.</p>
      </lux-dialog-content>
      <lux-dialog-actions>
        <lux-button luxLabel="Abbrechen" luxType="reset" />
        <lux-button luxLabel="Bestätigen" luxType="submit" luxColor="primary" />
      </lux-dialog-actions>
    </lux-dialog-structure>
  `
})
class LuxDialogStructureDemoContentComponent {}

@Component({
  selector: 'lux-dialog-structure-demo-trigger',
  imports: [LuxButtonComponent],
  template: ` <lux-button luxLabel="Dialog öffnen" luxColor="primary" (click)="open()" /> `
})
class LuxDialogStructureDemoTriggerComponent {
  private readonly dialogService = inject(LuxDialogService);

  open(): void {
    this.dialogService.openComponent(LuxDialogStructureDemoContentComponent);
  }
}

const meta: Meta<LuxDialogStructureComponent> = {
  title: 'Popups/lux-dialog-structure',
  component: LuxDialogStructureComponent,
  tags: ['autodocs'],
  decorators: [moduleMetadata({ imports: [LuxDialogStructureDemoTriggerComponent] })]
};

export default meta;
type Story = StoryObj<LuxDialogStructureComponent>;

export const Default: Story = {
  render: () => ({
    template: `<lux-dialog-structure-demo-trigger />`
  })
};
