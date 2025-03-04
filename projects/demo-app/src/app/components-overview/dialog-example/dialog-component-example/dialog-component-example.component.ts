import { Component, inject } from '@angular/core';
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
  LuxTextareaAcComponent,
  LuxToggleAcComponent
} from 'lux-components-lib';

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
  luxDialogRef = inject<LuxDialogRef<void>>(LuxDialogRef);
  private dialogService = inject(LuxDialogService);

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
    // Die Referenz des aktuell angezeigten Dialogs wird gespeichert.
    this.dialogService.storeDialogRef();

    // Jetzt kann der Hilfedialog innerhalb des bereits geöffneten
    // Dialogs angezeigt werden.
    this.dialogConfig.disableClose = this.luxDialogRef._matDialogRef.disableClose;
    const dialogRef = this.dialogService.open(this.dialogConfig);

    dialogRef.dialogClosed.subscribe(() => {
      // Nach dem Schließen des Hilfedialogs wird die Referenz
      // des ursprünglichen Dialogs wiederhergestellt.
      this.dialogService.restoreDialogRef();
    });
  }
}
