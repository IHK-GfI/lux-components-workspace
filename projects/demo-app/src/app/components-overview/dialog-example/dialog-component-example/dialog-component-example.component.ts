import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import {
  ILuxDialogPresetConfig,
  LuxAriaLabelDirective,
  LuxButtonComponent,
  LuxCardComponent,
  LuxCardContentComponent,
  LuxDialogActionsComponent,
  LuxDialogContentComponent,
  LuxDialogRef,
  LuxDialogService,
  LuxDialogStructureComponent,
  LuxDialogTitleComponent,
  LuxFileUploadComponent,
  LuxTextareaComponent,
  LuxToggleComponent
} from '@ihk-gfi/lux-components';
import { logResult } from '../../../example-base/example-base-util/example-base-helper';
import { DIALOG_EXAMPLE_LOCAL_TOKEN } from '../dialog-example-local.token';

@Component({
  selector: 'app-dialog-component-example',
  templateUrl: './dialog-component-example.component.html',
  styleUrls: ['./dialog-component-example.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    LuxDialogActionsComponent,
    LuxDialogContentComponent,
    LuxDialogTitleComponent,
    LuxDialogStructureComponent,
    LuxButtonComponent,
    LuxCardContentComponent,
    LuxCardComponent,
    LuxAriaLabelDirective,
    LuxToggleComponent,
    LuxTextareaComponent,
    LuxFileUploadComponent
  ]
})
export class DialogComponentExampleComponent {
  luxDialogRef = inject<LuxDialogRef<{ showOutputEvents: boolean }>>(LuxDialogRef);
  log = logResult;

  /**
   * Demo für Issue #305: Nur auflösbar, wenn 'LuxDialogService.openComponent' mit
   * 'config.injector' (Injector der aufrufenden Komponente) geöffnet wurde.
   */
  localProviderValue = inject(DIALOG_EXAMPLE_LOCAL_TOKEN, { optional: true });

  dialogConfig: ILuxDialogPresetConfig = {
    title: 'Info',
    content: 'Hier könnte ein Hilfetext stehen. ',
    disableClose: true,
    width: 'auto',
    height: 'auto',
    panelClass: [],
    confirmAction: {
      label: 'Ok',
      raised: true,
      color: 'primary'
    }
  };

  private dialogService = inject(LuxDialogService);

  openInfoDialog() {
    const dialogRef = this.dialogService.open({ ...this.dialogConfig, disableClose: this.luxDialogRef._matDialogRef.disableClose });

    dialogRef.dialogClosed.subscribe((result) => {
      this.log(this.luxDialogRef.data.showOutputEvents, 'Hilfedialog dialogConfirmed', result);
    });
  }
}
