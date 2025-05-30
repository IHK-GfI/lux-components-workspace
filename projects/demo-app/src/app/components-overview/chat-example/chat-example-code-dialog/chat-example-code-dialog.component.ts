import { Component, inject } from '@angular/core';
import { LuxButtonComponent, LuxDialogActionsComponent, LuxDialogContentComponent, LuxDialogRef, LuxDialogStructureComponent, LuxDialogTitleComponent, LuxSnackbarService } from '@ihk-gfi/lux-components';

@Component({
  selector: 'app-chat-example-code-dialog',
  imports: [
    LuxDialogStructureComponent,
    LuxDialogTitleComponent,
    LuxDialogContentComponent,
    LuxDialogActionsComponent,

    LuxButtonComponent
],
  templateUrl: './chat-example-code-dialog.component.html',
  styleUrl: './chat-example-code-dialog.component.scss'
})
export class ChatExampleCodeDialogComponent {

  public luxDialogRef = inject(LuxDialogRef<any>);
  private luxSnackbarService = inject(LuxSnackbarService);


  public copyToClipboard(){
    navigator.clipboard.writeText(this.luxDialogRef.data);
    this.luxSnackbarService.openText("Code in die Zwischenablage kopiert!", 3000);
  }

}
