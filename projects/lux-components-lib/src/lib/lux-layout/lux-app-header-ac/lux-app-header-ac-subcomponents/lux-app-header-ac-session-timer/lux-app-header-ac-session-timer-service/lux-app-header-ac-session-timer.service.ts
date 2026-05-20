import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, Signal, signal, EventEmitter } from '@angular/core';
import { LuxStorageService } from '../../../../../lux-util/lux-storage.service';
import { LuxDialogService } from '../../../../../lux-popups/lux-dialog/lux-dialog.service';
import { LuxAppHeaderAcSessionTimerDialogComponent } from '../lux-app-header-ac-session-timer-dialog/lux-app-header-ac-session-timer-dialog';
import { ILuxDialogConfig } from '../../../../../lux-popups/lux-dialog/lux-dialog-model/lux-dialog-config.interface';
import { distinctUntilChanged, map, switchMap, takeWhile, timer } from 'rxjs';
import { takeUntilDestroyed, toObservable, toSignal } from '@angular/core/rxjs-interop';
import { LuxComponentsConfigService } from '../../../../../lux-components-config/lux-components-config.service';

@Injectable({
  providedIn: 'root'
})
export class LuxAppHeaderAcSessionTimerService {
  private readonly http = inject(HttpClient);
  private readonly dialogService = inject(LuxDialogService);
  private readonly configService = inject(LuxComponentsConfigService);
  private readonly storageService = inject(LuxStorageService);

  private static readonly STORAGE_KEY = 'lux-components-session-endtime';

  luxLogoutEvent = new EventEmitter<void>();
  luxTimeoutEvent = new EventEmitter<void>();

  private dialogIsOpen = false;
  private dialogWasClosed = false;
  private currentDialogRef: any = null;
  protected readonly startingSeconds = signal<number>(0);
  private endTime = 0;
  private urlValue = '';
  private canExtendSessionValue = true;

  get url(): string {
    return this.urlValue;
  }

  set url(value: string) {
    this.urlValue = value;
  }

  get canExtendSession(): boolean {
    return this.canExtendSessionValue;
  }

  set canExtendSession(value: boolean) {
    this.canExtendSessionValue = value;
  }



  // Observable for time remaining, based on synchronized endTime
  timeRemaining$ = toObservable(this.startingSeconds).pipe(
    switchMap((seconds) => {
      // Use endTime from LuxStorageService if available
      const storedEndTime = this.getStoredEndTime();
      if (storedEndTime && storedEndTime > Date.now()) {
        this.endTime = storedEndTime;
      } else {
        this.endTime = seconds > 0 ? Date.now() + seconds * 1000 : 0;
        this.setStoredEndTime(this.endTime);
      }
      return timer(0, 1000).pipe(
        map(() => Math.max(0, this.getStoredEndTime() - Date.now())),
        takeWhile((remaining) => remaining > 0, true)
      );
    })
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
    height: 'auto',
    width: 'auto',
    maxWidth: '90%',
    disableClose: false,
    panelClass: ['session-timer-dialog-panel-class']
  };

  constructor() {
    // Dialog-Status zurücksetzen wenn sich startingSeconds ändert
    toObservable(this.startingSeconds)
      .pipe(takeUntilDestroyed())
      .subscribe(() => {
        if (this.canExtendSession) {
          this.dialogWasClosed = false;
        }
      });

    this.timeRemaining$.pipe(takeUntilDestroyed()).subscribe((remainingMs: number) => {
      // Dialog öffnen wenn: Zeit < 120s, Dialog ist nicht offen, Timer wird angezeigt UND Dialog wurde noch nicht geschlossen
      if (remainingMs / 1000 < 120 && !this.dialogIsOpen && this.showSessionTimer() && !this.dialogWasClosed) {
        this.openDialog();
      }

      // Timer ist natürlich abgelaufen (nicht durch explizites Zurücksetzen auf 0)
      if (remainingMs <= 1000) {
        if (this.currentDialogRef) {
          this.currentDialogRef.closeDialog();
          this.currentDialogRef = null;
        }
        //Der Timeout ist notwendig, weil sonst der Fehler "Blocked aria-hidden in an element because its descendant retained focus...." auftritt.
        //Nachgestellt kann man das indem der normale Dialog geöffnet ist, dann der Timer ausläuft und der User abgemeldet wird. Weil die Dialoge kurz hintereinander geöffnet werden, taucht dieser Fehler auf.
        setTimeout(() => {
          this.dialogIsOpen = false;
          this.dialogWasClosed = false;
          this.timeoutUser();
        });
      }
    });

    // Listen for storage events to sync timer across tabs/apps using LuxStorageService observable
    this.storageService.getItemAsObservable(LuxAppHeaderAcSessionTimerService.STORAGE_KEY)
      .pipe(
        takeUntilDestroyed(),
        map((value) => (value ? parseInt(value, 10) : 0)),
        distinctUntilChanged()
      )
      .subscribe((newEndTime) => {
        if (newEndTime !== this.endTime) {
          this.endTime = newEndTime;
          const seconds = Math.max(0, Math.floor((this.endTime - Date.now()) / 1000));
          this.startingSeconds.set(seconds);
          // Nur Timeout auslösen wenn Zeit tatsächlich abgelaufen ist (nicht bei explizitem Reset auf 0 durch Logout)
          if (newEndTime > 0 && newEndTime <= Date.now()) {
            this.timeoutUser();
          }
        }
      });

    this.url = this.configService.currentConfig.sessionTimerConfig?.url ?? '';
  }

  extendSessionTimer() {
    if (!this.canExtendSession) {
      return;
    }

    // On successful extension, update endTime in LuxStorageService
    return this.http.post(this.url, null).pipe(
      map((res) => {
        const extensionSeconds = this.startingSeconds();
        const newEndTime = Date.now() + extensionSeconds * 1000;
        this.setStoredEndTime(newEndTime);
        this.endTime = newEndTime;
        this.startingSeconds.set(extensionSeconds);
        return res;
      })
    );
  }

  openDialog() {
    if (!this.canExtendSession) {
      this.openNotExtendableDialog();
      return;
    }

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

  openNotExtendableDialog() {
    this.dialogIsOpen = true;
    this.currentDialogRef = this.dialogService.openComponent(LuxAppHeaderAcSessionTimerDialogComponent, this.dialogConfig);
    this.currentDialogRef.componentInstance.setNotExtendableDialog();

    this.currentDialogRef.dialogClosed.subscribe((result: any) => {
      this.dialogIsOpen = false;
      this.dialogWasClosed = true;
    });
  }

  timeoutUser() {
    this.resetTimer(0);
    this.clearStoredEndTime();
    this.luxTimeoutEvent.emit();
  }

  logoutUser() {
    this.resetTimer(0);
    this.clearStoredEndTime();
    this.luxLogoutEvent.emit();
  }

  resetTimer(seconds: number) {
    this.startingSeconds.set(0);
    if (seconds > 0) {
      const newEndTime = Date.now() + seconds * 1000;
      this.setStoredEndTime(newEndTime);
      this.endTime = newEndTime;
    } else {
      this.clearStoredEndTime();
      this.endTime = 0;
    }
    this.startingSeconds.set(seconds);
  }

  /**
   * Get the shared endTime from LuxStorageService
   */
  private getStoredEndTime(): number {
    const value = this.storageService.getItem(LuxAppHeaderAcSessionTimerService.STORAGE_KEY);
    return value ? parseInt(value, 10) : 0;
  }

  /**
   * Set the shared endTime in LuxStorageService
   */
  private setStoredEndTime(endTime: number) {
    if (endTime > 0) {
      this.storageService.setItem(LuxAppHeaderAcSessionTimerService.STORAGE_KEY, endTime.toString(), false);
    }
  }

  /**
   * Remove the shared endTime from LuxStorageService
   */
  private clearStoredEndTime() {
    this.storageService.removeItem(LuxAppHeaderAcSessionTimerService.STORAGE_KEY);
  }
}
