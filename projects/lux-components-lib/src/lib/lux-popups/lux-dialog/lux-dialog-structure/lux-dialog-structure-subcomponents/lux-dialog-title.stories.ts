import { Component, inject } from '@angular/core';
import type { Meta, StoryObj } from '@storybook/angular-vite';
import { moduleMetadata } from '@storybook/angular-vite';
import { LuxButtonComponent } from '../../../../lux-action/lux-button/lux-button.component';
import { LuxDialogService } from '../../lux-dialog.service';
import { LuxDialogStructureComponent } from '../lux-dialog-structure.component';
import { LuxDialogTitleComponent } from './lux-dialog-title.component';

@Component({
  selector: 'lux-dialog-title-demo-content',
  imports: [LuxDialogStructureComponent, LuxDialogTitleComponent],
  template: `
    <lux-dialog-structure>
      <lux-dialog-title>Dialogtitel</lux-dialog-title>
    </lux-dialog-structure>
  `
})
class LuxDialogTitleDemoContentComponent {}

@Component({
  selector: 'lux-dialog-title-demo-trigger',
  imports: [LuxButtonComponent],
  template: ` <lux-button luxLabel="Dialog öffnen" luxColor="primary" (click)="open()" /> `
})
class LuxDialogTitleDemoTriggerComponent {
  private readonly dialogService = inject(LuxDialogService);

  open(): void {
    this.dialogService.openComponent(LuxDialogTitleDemoContentComponent);
  }
}

const meta: Meta<LuxDialogTitleComponent> = {
  title: 'Popups/lux-dialog-title',
  component: LuxDialogTitleComponent,
  tags: ['autodocs'],
  decorators: [moduleMetadata({ imports: [LuxDialogTitleDemoTriggerComponent] })]
};

export default meta;
type Story = StoryObj<LuxDialogTitleComponent>;

export const Default: Story = {
  render: () => ({
    template: `<lux-dialog-title-demo-trigger />`
  })
};
