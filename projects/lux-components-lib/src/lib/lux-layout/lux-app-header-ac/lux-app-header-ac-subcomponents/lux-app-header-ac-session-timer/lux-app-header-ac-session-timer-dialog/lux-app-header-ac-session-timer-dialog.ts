import { Component, inject, signal } from '@angular/core';
import { LuxDialogRef } from '../../../../../lux-popups/lux-dialog/lux-dialog-model/lux-dialog-ref.class';
import { LuxDialogStructureComponent } from '../../../../../lux-popups/lux-dialog/lux-dialog-structure/lux-dialog-structure.component';
import { LuxProgressComponent } from '../../../../../lux-common/lux-progress/lux-progress.component';
import { LuxDialogContentComponent } from '../../../../../lux-popups/lux-dialog/lux-dialog-structure/lux-dialog-structure-subcomponents/lux-dialog-content.component';
import { LuxIconComponent } from '../../../../../lux-icon/lux-icon/lux-icon.component';
import { LuxButtonComponent } from '../../../../../lux-action/lux-button/lux-button.component';
import { LuxAppHeaderAcSessionTimerService } from '../lux-app-header-ac-session-timer-service/lux-app-header-ac-session-timer.service';
import { LuxDialogActionsComponent } from '../../../../../lux-popups/lux-dialog/lux-dialog-structure/lux-dialog-structure-subcomponents/lux-dialog-actions.component';
import { TranslocoPipe } from '@jsverse/transloco';
import { LuxAriaLabelDirective } from '../../../../../lux-directives/lux-aria/lux-aria-label.directive';

export enum LuxSessionTimerDialogType {
  INFO = 'info',
  WAIT = 'wait',
  LOGOUT = 'logout'
}

@Component({
  selector: 'lux-app-header-ac-session-timer-dialog',
  imports: [
    LuxDialogStructureComponent,
    LuxProgressComponent,
    LuxDialogContentComponent,
    LuxIconComponent,
    LuxButtonComponent,
    LuxDialogActionsComponent,
    TranslocoPipe,
    LuxAriaLabelDirective
  ],
  templateUrl: './lux-app-header-ac-session-timer-dialog.html'
})
export class LuxAppHeaderAcSessionTimerDialogComponent {
  timerService = inject(LuxAppHeaderAcSessionTimerService);
  luxDialogRef = inject(LuxDialogRef<any>);
  currentStep = signal<LuxSessionTimerDialogType>(LuxSessionTimerDialogType.INFO);

  constructor() {}

  extendSession() {
    const extendSessionTimer$ = this.timerService?.extendSessionTimer();
    if (!extendSessionTimer$) {
      this.currentStep.set(LuxSessionTimerDialogType.LOGOUT);
      return;
    }
    extendSessionTimer$.subscribe({
      next: () => {
        this.currentStep.set(LuxSessionTimerDialogType.WAIT);
      },
      complete: () => {
        this.luxDialogRef.closeDialog('confirmed');
      },
      error: () => {
        this.currentStep.set(LuxSessionTimerDialogType.LOGOUT);
      }
    });
  }

  logoutUser() {
    this.timerService.logoutUser();
    this.currentStep.set(LuxSessionTimerDialogType.LOGOUT);
  }

  setLogoutDialog() {
    this.currentStep.set(LuxSessionTimerDialogType.LOGOUT);
  }

  backToLogin() {
    this.timerService.backToLogin();
    this.luxDialogRef.closeDialog();
  }
}
