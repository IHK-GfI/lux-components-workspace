import { Component, inject, input } from '@angular/core';
import { DatePipe, AsyncPipe } from '@angular/common';
import { LuxButtonComponent } from '../lux-action/lux-button/lux-button.component';
import { LuxDialogService } from '../lux-popups/lux-dialog/lux-dialog.service';
import { LuxSessionTimerService } from './lux-session-timer-service/lux-session-timer.service';

@Component({
  selector: 'lux-session-timer',
  imports: [LuxButtonComponent, AsyncPipe, DatePipe],
  templateUrl: './lux-session-timer.component.html'
})
export class LuxSessionTimerComponent {
  luxUrl = input('/session');
  luxDialogService = inject(LuxDialogService);
  luxSessionTimerService = inject(LuxSessionTimerService);
  luxLoading = false;

  constructor() {
    this.luxSessionTimerService.url = this.luxUrl();
  }

  extendTimer() {
    this.luxSessionTimerService.extendSessionTimer().subscribe({
      next: () => {
        this.luxLoading = true;
      },
      complete: () => {
        this.luxLoading = false;
      },
      error: () => {
        this.luxLoading = false;
        this.luxSessionTimerService.openErrorDialog();
      }
    });
  }
}
