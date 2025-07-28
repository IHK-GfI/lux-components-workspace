import { Component, inject } from '@angular/core';
import { DatePipe, AsyncPipe } from '@angular/common';
import { LuxButtonComponent } from '../../../../lux-action/lux-button/lux-button.component';
import { LuxDialogService } from '../../../../lux-popups/lux-dialog/lux-dialog.service';
import { LuxAppHeaderAcSessionTimerService } from './lux-app-header-ac-session-timer-service/lux-app-header-ac-session-timer.service';
import { LuxTooltipDirective } from '../../../../lux-directives/lux-tooltip/lux-tooltip.directive';
import { LuxMediaQueryObserverService } from '../../../../lux-util/lux-media-query-observer.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'lux-app-header-ac-session-timer',
  imports: [LuxButtonComponent, AsyncPipe, DatePipe, LuxTooltipDirective],
  templateUrl: './lux-app-header-ac-session-timer.component.html'
})
export class LuxAppHeaderAcSessionTimerComponent {
  luxDialogService = inject(LuxDialogService);
  luxSessionTimerService = inject(LuxAppHeaderAcSessionTimerService);
  private mediaQueryService = inject(LuxMediaQueryObserverService);
  luxLoading = false;

  mobileView: boolean;
  subscription: Subscription;

  constructor() {
    this.mobileView = this.mediaQueryService.activeMediaQuery === 'xs';

    this.subscription = this.mediaQueryService.getMediaQueryChangedAsObservable().subscribe((query: string) => {
      this.mobileView = query === 'xs';
    });
  }

  extendTimer() {
    const extendSessionTimer$ = this.luxSessionTimerService?.extendSessionTimer();
    if (!extendSessionTimer$) {
      this.luxSessionTimerService.openLogoutDialog();
      return;
    }
    extendSessionTimer$.subscribe({
      next: () => {
        this.luxLoading = true;
      },
      complete: () => {
        this.luxLoading = false;
      },
      error: () => {
        this.luxLoading = false;
        this.luxSessionTimerService.openLogoutDialog();
      }
    });
  }
}
