import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, Signal, signal, EventEmitter } from '@angular/core';
import { LuxDialogService } from '../../../../../lux-popups/lux-dialog/lux-dialog.service';
import { LuxAppHeaderAcSessionTimerDialogComponent } from '../lux-app-header-ac-session-timer-dialog/lux-app-header-ac-session-timer-dialog';
import { ILuxDialogConfig } from '../../../../../lux-popups/lux-dialog/lux-dialog-model/lux-dialog-config.interface';
import { map, switchMap, takeWhile, timer } from 'rxjs';
import { takeUntilDestroyed, toObservable, toSignal } from '@angular/core/rxjs-interop';
import { LuxComponentsConfigService } from '../../../../../lux-components-config/lux-components-config.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class LuxAppHeaderAcSessionTimerService {
  http = inject(HttpClient);
  dialogService = inject(LuxDialogService);
  configService = inject(LuxComponentsConfigService);
  router = inject(Router);

  luxLogoutEvent = new EventEmitter<void>();
  luxLoginEvent = new EventEmitter<void>();

  private dialogIsOpen = false;
  private dialogWasClosed = false;
  private currentDialogRef: any = null;
  startingSeconds = signal<number>(0);
  url = '';
  canExtendSession = false;

  timeRemaining$ = toObservable(this.startingSeconds).pipe(
    switchMap((seconds) =>
      timer(0, 1000).pipe(
        map((n) => (seconds - n) * 1000),
        takeWhile((n) => n >= 0)
      )
    )
  );

  timeRemaining = toSignal(this.timeRemaining$, { initialValue: 0 });

  formattedMinutes = computed(() => {
    const totalMinutes = Math.floor(this.timeRemaining() / 1000);
    return Math.floor(totalMinutes / 60);
  });

  formattedSeconds = computed(() => {
    const totalSeconds = Math.floor(this.timeRemaining() / 1000);
    return totalSeconds % 60;
  });

  showSessionTimer: Signal<boolean> = computed(() => {
    return this.timeRemaining() > 0;
  });

  showSeconds: Signal<boolean> = computed(() => {
    return this.timeRemaining() > 0 && this.timeRemaining() / 1000 < 60;
  });

  showHours: Signal<boolean> = computed(() => {
    return this.timeRemaining() / 1000 >= 3600;
  });

  dialogConfig: ILuxDialogConfig = {
    disableClose: false,
    panelClass: ['session-timer-dialog-panel-class']
  };

  constructor() {
    // Dialog-Status zurücksetzen wenn sich startingSeconds ändert
    toObservable(this.startingSeconds)
      .pipe(takeUntilDestroyed())
      .subscribe(() => {
        this.dialogWasClosed = false;
      });

    const timerSub = this.timeRemaining$.pipe(takeUntilDestroyed()).subscribe((remainingMs: number) => {
      // Dialog öffnen wenn: Zeit < 120s, Dialog ist nicht offen, Timer wird angezeigt UND Dialog wurde noch nicht geschlossen
      if (remainingMs / 1000 < 120 && !this.dialogIsOpen && this.showSessionTimer() && !this.dialogWasClosed) {
        this.openDialog();
      }

      // 1 Sekunde vor Ablauf damit der Dialog nicht geöffnet wird wenn keine Zeit gesetzt wurde
      if (remainingMs / 1000 == 1) {
        if (this.currentDialogRef) {
          this.currentDialogRef.closeDialog();
          this.currentDialogRef = null;
        }
        //Der Timeout ist notwendig, weil sonst der Fehler "Blocked aria-hidden in an element because its descendant retained focus...." auftritt.
        //Nachgestellt kann man das indem der normale Dialog geöffnet ist, dann der Timer ausläuft und der User abgemeldet wird. Weil die Dialoge kurz hintereinander geöffnet werden, taucht dieser Fehler auf.
        setTimeout(() => {
          this.dialogIsOpen = false;
          this.dialogWasClosed = false;
          this.openLogoutDialog();
        });
      }
    });

    this.url = this.configService.currentConfig.sessionTimerConfig?.url ?? '';
  }

  extendSessionTimer() {
    if (!this.canExtendSession) {
      return;
    }

    return this.http.post(this.url, null);
  }

  openDialog() {
    this.dialogIsOpen = true;
    this.currentDialogRef = this.dialogService.openComponent(LuxAppHeaderAcSessionTimerDialogComponent, this.dialogConfig);

    this.currentDialogRef.dialogClosed.subscribe((result: any) => {
      this.dialogIsOpen = false;
      this.dialogWasClosed = result !== 'confirmed';
    });

    this.currentDialogRef.dialogDeclined.subscribe(() => {
      this.dialogIsOpen = false;
      this.dialogWasClosed = true;
    });
  }

  openLogoutDialog() {
    this.dialogIsOpen = true;
    this.logoutUser();
    this.currentDialogRef = this.dialogService.openComponent(LuxAppHeaderAcSessionTimerDialogComponent, this.dialogConfig);
    this.currentDialogRef.componentInstance.setLogoutDialog();
    this.currentDialogRef.dialogClosed.subscribe(() => {
      this.dialogIsOpen = false;
    });
  }

  logoutUser() {
    this.resetTimer(0);
    this.luxLogoutEvent.emit();
  }

  backToLogin() {
    this.luxLoginEvent.emit();
  }

  resetTimer(seconds: number) {
    this.startingSeconds.set(0);
    this.startingSeconds.set(seconds);
  }
}
