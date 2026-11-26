import { Component, DestroyRef, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import { LuxDialogRef } from '../../../../../lux-popups/lux-dialog/lux-dialog-model/lux-dialog-ref.class';
import { LuxDialogStructureComponent } from '../../../../../lux-popups/lux-dialog/lux-dialog-structure/lux-dialog-structure.component';
import { LuxProgressComponent } from '../../../../../lux-common/lux-progress/lux-progress.component';
import { LuxDialogContentComponent } from '../../../../../lux-popups/lux-dialog/lux-dialog-structure/lux-dialog-structure-subcomponents/lux-dialog-content.component';
import { LuxIconComponent } from '../../../../../lux-icon/lux-icon/lux-icon.component';
import { LuxButtonComponent } from '../../../../../lux-action/lux-button/lux-button.component';
import { LuxDialogActionsComponent } from '../../../../../lux-popups/lux-dialog/lux-dialog-structure/lux-dialog-structure-subcomponents/lux-dialog-actions.component';
import { TranslocoPipe } from '@jsverse/transloco';
import { LuxAriaLabelDirective } from '../../../../../lux-directives/lux-aria/lux-aria-label.directive';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Observable } from 'rxjs';

export enum LuxSessionTimerDialogType {
  INFO = 'info',
  WAIT = 'wait',
  NOTEXTENDABLE = 'notextendable'
}

/**
 * Die Aktionen des LuxAppHeaderAcSessionTimerService, die der Dialog auslöst. Sie werden als Dialog-Daten
 * übergeben, damit der Dialog den Service nicht importieren muss (der Service importiert den Dialog zum Öffnen).
 */
export interface LuxSessionTimerDialogData {
  /** Verlängert die Sitzung. Liefert undefined, wenn die Sitzung nicht verlängert werden kann. */
  extendSession: () => Observable<unknown> | undefined;
  logout: () => void;
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
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './lux-app-header-ac-session-timer-dialog.html'
})
export class LuxAppHeaderAcSessionTimerDialogComponent {
  readonly currentStep = signal<LuxSessionTimerDialogType>(LuxSessionTimerDialogType.INFO);

  private readonly luxDialogRef = inject<LuxDialogRef<LuxSessionTimerDialogData>>(LuxDialogRef);
  private readonly destroyRef = inject(DestroyRef);

  extendSession() {
    const extendSessionTimer$ = this.luxDialogRef.data?.extendSession();
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
    this.luxDialogRef.data?.logout();
    this.luxDialogRef.closeDialog('logout');
  }

  setNotExtendableDialog() {
    this.currentStep.set(LuxSessionTimerDialogType.NOTEXTENDABLE);
  }

  confirmDialog() {
    this.luxDialogRef.closeDialog('confirmed');
  }
}
