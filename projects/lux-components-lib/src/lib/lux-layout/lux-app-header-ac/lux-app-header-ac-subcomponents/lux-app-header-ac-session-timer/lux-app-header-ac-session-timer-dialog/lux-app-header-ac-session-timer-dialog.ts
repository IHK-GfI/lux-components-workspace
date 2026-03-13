import { Component, DestroyRef, inject, signal } from '@angular/core';
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
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

export enum LuxSessionTimerDialogType {
  INFO = 'info',
  WAIT = 'wait',
  NOTEXTENDABLE = 'notextendable'
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
  private readonly timerService = inject(LuxAppHeaderAcSessionTimerService);
  private readonly luxDialogRef = inject(LuxDialogRef<any>);
  private readonly destroyRef = inject(DestroyRef);
  currentStep = signal<LuxSessionTimerDialogType>(LuxSessionTimerDialogType.INFO);

  extendSession() {
    const extendSessionTimer$ = this.timerService?.extendSessionTimer();
    if (!extendSessionTimer$) {
      this.currentStep.set(LuxSessionTimerDialogType.NOTEXTENDABLE);
      return;
    }
    //Bei Langsamen Antworten soll die UI direkt anzeigen dass die Verlängerung läuft, damit der Nutzer weiß dass etwas passiert.
    this.currentStep.set(LuxSessionTimerDialogType.WAIT);
    extendSessionTimer$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      complete: () => {
        this.confirmDialog();
      },
      error: () => {
        this.luxDialogRef.closeDialog('error');
      }
    });
  }

  logoutUser() {
    this.timerService.logoutUser();
    this.luxDialogRef.closeDialog('logout');
  }

  setNotExtendableDialog() {
    this.currentStep.set(LuxSessionTimerDialogType.NOTEXTENDABLE);
  }

  confirmDialog() {
    this.luxDialogRef.closeDialog('confirmed');
  }
}
