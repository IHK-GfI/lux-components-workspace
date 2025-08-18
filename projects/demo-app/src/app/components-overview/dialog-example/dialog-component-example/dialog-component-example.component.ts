import { Component, inject } from '@angular/core';
import {
  ILuxDialogPresetConfig,
  LuxAriaLabelDirective,
  LuxButtonComponent,
  LuxCardComponent,
  LuxCardContentComponent,
  LuxConsoleService,
  LuxDialogActionsComponent,
  LuxDialogContentComponent,
  LuxDialogRef,
  LuxDialogService,
  LuxDialogStructureComponent,
  LuxDialogTitleComponent,
  LuxFileUploadComponent,
  LuxTextareaAcComponent,
  LuxToggleAcComponent
} from '@ihk-gfi/lux-components';
import { logResult } from '../../../example-base/example-base-util/example-base-helper';

@Component({
  selector: 'app-dialog-component-example',
  templateUrl: './dialog-component-example.component.html',
  styleUrls: ['./dialog-component-example.component.scss'],
  imports: [
    LuxDialogActionsComponent,
    LuxDialogContentComponent,
    LuxDialogTitleComponent,
    LuxDialogStructureComponent,
    LuxButtonComponent,
    LuxCardContentComponent,
    LuxCardComponent,
    LuxAriaLabelDirective,
    LuxToggleAcComponent,
    LuxTextareaAcComponent,
    LuxFileUploadComponent
  ]
})
export class DialogComponentExampleComponent {
  luxDialogRef = inject<LuxDialogRef<{ showOutputEvents: boolean }>>(LuxDialogRef);
  consoleLogger = inject(LuxConsoleService);
  private dialogService = inject(LuxDialogService);
  log = logResult;

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

  openInfoDialog() {
    const dialogRef = this.dialogService.open({ ...this.dialogConfig, disableClose: this.luxDialogRef._matDialogRef.disableClose });

    dialogRef.dialogClosed.subscribe((result) => {
      this.log(this.luxDialogRef.data.showOutputEvents, 'Hilfedialog dialogConfirmed', result);
    });
  }
}
