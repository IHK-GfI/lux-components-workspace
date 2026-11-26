import { Component, inject } from '@angular/core';
import type { Meta, StoryObj } from '@storybook/angular-vite';
import { moduleMetadata } from '@storybook/angular-vite';
import { LuxButtonComponent } from '../../../lux-action/lux-button/lux-button.component';
import { LuxDialogService } from '../lux-dialog.service';
import { LuxDialogPresetComponent } from './lux-dialog-preset.component';

@Component({
  selector: 'lux-dialog-preset-demo-trigger',
  imports: [LuxButtonComponent],
  template: ` <lux-button luxLabel="Dialog öffnen" luxColor="primary" (click)="open()" /> `
})
class LuxDialogPresetDemoTriggerComponent {
  private readonly dialogService = inject(LuxDialogService);

  open(): void {
    this.dialogService.open({
      title: 'Änderungen speichern?',
      content: 'Ihre Änderungen wurden noch nicht gespeichert.',
      iconName: 'lux-interface-alert-information-circle',
      confirmAction: { label: 'Speichern' },
      declineAction: { label: 'Verwerfen' }
    });
  }
}

const meta: Meta<LuxDialogPresetComponent> = {
  title: 'Popups/lux-dialog-preset',
  component: LuxDialogPresetComponent,
  tags: ['autodocs'],
  decorators: [moduleMetadata({ imports: [LuxDialogPresetDemoTriggerComponent] })]
};

export default meta;
type Story = StoryObj<LuxDialogPresetComponent>;

export const Default: Story = {
  render: () => ({
    template: `<lux-dialog-preset-demo-trigger />`
  })
};
