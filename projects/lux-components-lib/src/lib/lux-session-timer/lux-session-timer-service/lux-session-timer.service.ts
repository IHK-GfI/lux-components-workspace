import { HttpClient } from '@angular/common/http';
import { effect, inject, Injectable, signal } from '@angular/core';
import { LuxDialogService } from '../../lux-popups/lux-dialog/lux-dialog.service';
import { LuxSessionTimerDialogComponent } from '../lux-session-timer-dialog/lux-session-timer-dialog.component';
import { ILuxDialogConfig } from '../../lux-popups/lux-dialog/lux-dialog-model/lux-dialog-config.interface';
import { map, switchMap, takeWhile, timer } from 'rxjs';
import { toObservable } from '@angular/core/rxjs-interop';

@Injectable({
  providedIn: 'root'
})
export class LuxSessionTimerService {
  private http = inject(HttpClient);
  private dialogService = inject(LuxDialogService);
  private dialogIsOpen = false;
  startingSeconds = signal<number>(1800);
  dontShowDialog = false;
  url = '';

  dialogConfig: ILuxDialogConfig = {
    disableClose: true,
    width: 'auto',
    height: 'auto',
    panelClass: []
  };

  timeRemaining$ = toObservable(this.startingSeconds).pipe(
    switchMap((seconds) =>
      timer(0, 1000).pipe(
        map((n) => (seconds - n) * 1000),
        takeWhile((n) => n >= 0)
      )
    )
  );

  constructor() {
    this.timeRemaining$.subscribe((remainingMs: number) => {
      if (remainingMs / 1000 < 120 && !this.dialogIsOpen && !this.dontShowDialog) {
        this.openDialog();
      }
    });
  }

  extendSessionTimer() {
    return this.http.post(this.url, { headers: { 'X-GfI-Session-Prolongation': 'true' } });
  }

  openDialog() {
    this.dialogIsOpen = true;
    const dialogRef = this.dialogService.openComponent(LuxSessionTimerDialogComponent, this.dialogConfig);

    dialogRef.dialogClosed.subscribe(() => {
      this.dialogIsOpen = false;
    });

    dialogRef.dialogDeclined.subscribe(() => {
      this.dialogIsOpen = false;
    });

    dialogRef.dialogConfirmed.subscribe(() => {
      this.dialogIsOpen = false;
    });
  }

  openErrorDialog() {
    this.dialogIsOpen = true;
    const dialogRef = this.dialogService.openComponent(LuxSessionTimerDialogComponent, this.dialogConfig);
    dialogRef.componentInstance.openErrorDialog();
    dialogRef.dialogClosed.subscribe(() => {
      this.dialogIsOpen = false;
    });
  }
}
