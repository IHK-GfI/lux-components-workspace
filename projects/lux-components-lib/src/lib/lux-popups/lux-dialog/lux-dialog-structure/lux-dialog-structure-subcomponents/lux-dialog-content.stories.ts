import { Component, inject } from '@angular/core';
import type { Meta, StoryObj } from '@storybook/angular-vite';
import { moduleMetadata } from '@storybook/angular-vite';
import { LuxButtonComponent } from '../../../../lux-action/lux-button/lux-button.component';
import { LuxDialogService } from '../../lux-dialog.service';
import { LuxDialogStructureComponent } from '../lux-dialog-structure.component';
import { LuxDialogContentComponent } from './lux-dialog-content.component';
import { LuxDialogTitleComponent } from './lux-dialog-title.component';

@Component({
  selector: 'lux-dialog-content-demo-content',
  imports: [LuxDialogStructureComponent, LuxDialogTitleComponent, LuxDialogContentComponent],
  template: `
    <lux-dialog-structure>
      <lux-dialog-title>Dialogtitel</lux-dialog-title>
      <lux-dialog-content>
        <p>Hier steht der Inhalt des Dialogs.</p>
      </lux-dialog-content>
    </lux-dialog-structure>
  `
})
class LuxDialogContentDemoContentComponent {}

@Component({
  selector: 'lux-dialog-content-demo-trigger',
  imports: [LuxButtonComponent],
  template: ` <lux-button luxLabel="Dialog öffnen" luxColor="primary" (click)="open()" /> `
})
class LuxDialogContentDemoTriggerComponent {
  private readonly dialogService = inject(LuxDialogService);

  open(): void {
    this.dialogService.openComponent(LuxDialogContentDemoContentComponent);
  }
}

const meta: Meta<LuxDialogContentComponent> = {
  title: 'Popups/lux-dialog-content',
  component: LuxDialogContentComponent,
  tags: ['autodocs'],
  decorators: [moduleMetadata({ imports: [LuxDialogContentDemoTriggerComponent] })]
};

export default meta;
type Story = StoryObj<LuxDialogContentComponent>;

export const Default: Story = {
  render: () => ({
    template: `<lux-dialog-content-demo-trigger />`
  })
};
