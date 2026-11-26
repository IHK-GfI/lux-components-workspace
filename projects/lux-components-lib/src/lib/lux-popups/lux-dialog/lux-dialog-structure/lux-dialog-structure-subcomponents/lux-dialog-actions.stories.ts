import { Component, inject } from '@angular/core';
import type { Meta, StoryObj } from '@storybook/angular-vite';
import { moduleMetadata } from '@storybook/angular-vite';
import { LuxButtonComponent } from '../../../../lux-action/lux-button/lux-button.component';
import { LuxDialogService } from '../../lux-dialog.service';
import { LuxDialogStructureComponent } from '../lux-dialog-structure.component';
import { LuxDialogActionsComponent } from './lux-dialog-actions.component';
import { LuxDialogContentComponent } from './lux-dialog-content.component';
import { LuxDialogTitleComponent } from './lux-dialog-title.component';

@Component({
  selector: 'lux-dialog-actions-demo-content',
  imports: [LuxDialogStructureComponent, LuxDialogTitleComponent, LuxDialogContentComponent, LuxDialogActionsComponent, LuxButtonComponent],
  template: `
    <lux-dialog-structure>
      <lux-dialog-title>Dialogtitel</lux-dialog-title>
      <lux-dialog-content>
        <p>Möchten Sie fortfahren?</p>
      </lux-dialog-content>
      <lux-dialog-actions>
        <lux-button luxLabel="Abbrechen" luxType="reset" />
        <lux-button luxLabel="Bestätigen" luxType="submit" luxColor="primary" />
      </lux-dialog-actions>
    </lux-dialog-structure>
  `
})
class LuxDialogActionsDemoContentComponent {}

@Component({
  selector: 'lux-dialog-actions-demo-trigger',
  imports: [LuxButtonComponent],
  template: ` <lux-button luxLabel="Dialog öffnen" luxColor="primary" (click)="open()" /> `
})
class LuxDialogActionsDemoTriggerComponent {
  private readonly dialogService = inject(LuxDialogService);

  open(): void {
    this.dialogService.openComponent(LuxDialogActionsDemoContentComponent);
  }
}

const meta: Meta<LuxDialogActionsComponent> = {
  title: 'Popups/lux-dialog-actions',
  component: LuxDialogActionsComponent,
  tags: ['autodocs'],
  decorators: [moduleMetadata({ imports: [LuxDialogActionsDemoTriggerComponent] })]
};

export default meta;
type Story = StoryObj<LuxDialogActionsComponent>;

export const Default: Story = {
  render: () => ({
    template: `<lux-dialog-actions-demo-trigger />`
  })
};
