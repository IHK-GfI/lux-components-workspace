import { Component, inject, signal } from '@angular/core';
import { LuxDialogRef } from '../../lux-popups/lux-dialog/lux-dialog-model/lux-dialog-ref.class';
import { LuxDialogStructureComponent } from '../../lux-popups/lux-dialog/lux-dialog-structure/lux-dialog-structure.component';
import { LuxProgressComponent } from '../../lux-common/lux-progress/lux-progress.component';
import { LuxDialogContentComponent } from '../../lux-popups/lux-dialog/lux-dialog-structure/lux-dialog-structure-subcomponents/lux-dialog-content.component';
import { LuxIconComponent } from '../../lux-icon/lux-icon/lux-icon.component';
import { LuxButtonComponent } from '../../lux-action/lux-button/lux-button.component';
import { LuxSessionTimerService } from '../lux-session-timer-service/lux-session-timer.service';
import { LuxDialogActionsComponent } from '../../lux-popups/lux-dialog/lux-dialog-structure/lux-dialog-structure-subcomponents/lux-dialog-actions.component';

export enum LuxSessionTimerDialogType {
  INFO = 'info',
  WAIT = 'wait',
  ERROR = 'error'
}

@Component({
  selector: 'lux-session-timer-dialog',
  imports: [
    LuxDialogStructureComponent,
    LuxProgressComponent,
    LuxDialogContentComponent,
    LuxIconComponent,
    LuxButtonComponent,
    LuxDialogActionsComponent
  ],
  templateUrl: './lux-session-timer-dialog.component.html'
})
export class LuxSessionTimerDialogComponent {
  timerService = inject(LuxSessionTimerService);
  currentStep = signal<LuxSessionTimerDialogType>(LuxSessionTimerDialogType.INFO);

  constructor(public luxDialogRef: LuxDialogRef<any>) {}

  extendSession() {
    this.timerService.extendSessionTimer().subscribe({
      next: () => {
        this.currentStep.set(LuxSessionTimerDialogType.WAIT);
      },
      complete: () => {
        this.luxDialogRef.closeDialog();
      },
      error: () => {
        this.currentStep.set(LuxSessionTimerDialogType.ERROR);
      }
    });
  }

  logOutUser() {
    this.luxDialogRef.closeDialog();
  }

  openErrorDialog() {
    this.currentStep.set(LuxSessionTimerDialogType.ERROR);
  }
}
