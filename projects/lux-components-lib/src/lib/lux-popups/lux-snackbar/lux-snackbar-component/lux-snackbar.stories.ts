import { Component, inject } from '@angular/core';
import type { Meta, StoryObj } from '@storybook/angular-vite';
import { moduleMetadata } from '@storybook/angular-vite';
import { LuxButtonComponent } from '../../../lux-action/lux-button/lux-button.component';
import { LuxSnackbarService } from '../lux-snackbar.service';
import { LuxSnackbarComponent } from './lux-snackbar.component';

@Component({
  selector: 'lux-snackbar-demo-trigger',
  imports: [LuxButtonComponent],
  template: ` <lux-button luxLabel="Snackbar anzeigen" luxColor="primary" (click)="show()" /> `
})
class LuxSnackbarDemoTriggerComponent {
  private readonly snackbarService = inject(LuxSnackbarService);

  show(): void {
    this.snackbarService.openText('Die Daten wurden gespeichert.', 5000, 'Rückgängig');
  }
}

const meta: Meta<LuxSnackbarComponent> = {
  title: 'Popups/lux-snackbar',
  component: LuxSnackbarComponent,
  tags: ['autodocs'],
  decorators: [moduleMetadata({ imports: [LuxSnackbarDemoTriggerComponent] })]
};

export default meta;
type Story = StoryObj<LuxSnackbarComponent>;

export const Default: Story = {
  render: () => ({
    template: `<lux-snackbar-demo-trigger />`
  })
};
