import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, Signal, signal, EventEmitter, Output } from '@angular/core';
import { LuxDialogService } from '../../../../../lux-popups/lux-dialog/lux-dialog.service';
import { LuxAppHeaderAcSessionTimerDialogComponent } from '../lux-app-header-ac-session-timer-dialog/lux-app-header-ac-session-timer-dialog.component';
import { ILuxDialogConfig } from '../../../../../lux-popups/lux-dialog/lux-dialog-model/lux-dialog-config.interface';
import { map, switchMap, takeWhile, timer } from 'rxjs';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
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

  luxLogoutEvent = new EventEmitter<boolean>();

  private dialogIsOpen = false;
  startingSeconds = signal<number>(0);
  url = '';
  logoutUrl = '';
  loginUrl = '';
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

  showSessionTimer: Signal<boolean> = computed(() => {
    return this.timeRemaining() > 0 && this.timeRemaining() / 1000 < 3600;
  });

  dialogConfig: ILuxDialogConfig = {
    disableClose: false,
    width: '744px',
    height: '375px',
    panelClass: []
  };

  constructor() {
    const timerDialogSub = this.timeRemaining$.subscribe((remainingMs: number) => {
      if (remainingMs / 1000 < 120 && !this.dialogIsOpen && this.showSessionTimer()) {
        this.openDialog();
        timerDialogSub.unsubscribe();
      }
    });

    const timerLogoutSub = this.timeRemaining$.subscribe((remainingMs: number) => {
      // 1 Sekunde vor Ablauf damit der Dialog nicht geöffnet wird wenn keine Zeit gesetzt wurde
      if (remainingMs / 1000 == 1 && !this.dialogIsOpen) {
        this.openLogoutDialog();
        timerLogoutSub.unsubscribe();
      }
    });

    this.url = this.configService.currentConfig.sessionTimerConfig?.url ?? '';
    this.logoutUrl = this.configService.currentConfig.sessionTimerConfig?.logoutUrl ?? '';
    this.loginUrl = this.configService.currentConfig.sessionTimerConfig?.loginUrl ?? '/';
  }

  extendSessionTimer() {
    if (!this.canExtendSession) {
      return;
    }

    return this.http.post(this.url, null);
  }

  openDialog() {
    // Workaround: https://github.com/IHK-GfI/lux-components-workspace/issues/3
    // Blocked aria-hidden on an element because its descendant retained focus.
    // The focus must not be hidden from assistive technology users.
    // Avoid using aria-hidden on a focused element or its ancestor.
    // Consider using the inert attribute instead, which will also prevent focus.
    // For more details, see the aria-hidden section of the WAI-ARIA specification at https://w3c.github.io/aria/#aria-hidden.
    // Element with focus: ...
    // Ancestor with aria-hidden: <app-root>
    //
    //Musste hier nochmal extra implimentiert werden, da der Fehler sonst wieder auftritt.
    const activeElement = document.activeElement as HTMLElement;
    if (activeElement) {
      activeElement.blur();
    }

    this.dialogIsOpen = true;
    const dialogRef = this.dialogService.openComponent(LuxAppHeaderAcSessionTimerDialogComponent, this.dialogConfig);

    dialogRef.dialogClosed.subscribe(() => {
      if (activeElement) {
        activeElement.focus();
      }
      this.dialogIsOpen = false;
    });

    dialogRef.dialogDeclined.subscribe(() => {
      this.dialogIsOpen = false;
    });

    dialogRef.dialogConfirmed.subscribe(() => {
      this.dialogIsOpen = false;
    });
  }

  openLogoutDialog() {
    this.dialogIsOpen = true;
    this.logout();
    const dialogRef = this.dialogService.openComponent(LuxAppHeaderAcSessionTimerDialogComponent, this.dialogConfig);
    dialogRef.componentInstance.setLogoutDialog();
    dialogRef.dialogClosed.subscribe(() => {
      this.dialogIsOpen = false;
    });
  }

  logout() {
    this.startingSeconds.set(0);
    this.luxLogoutEvent.emit(true);
    return this.http.post(this.logoutUrl, null);
  }

  backToLogin() {
    this.router.navigate([this.loginUrl]);
  }
}
