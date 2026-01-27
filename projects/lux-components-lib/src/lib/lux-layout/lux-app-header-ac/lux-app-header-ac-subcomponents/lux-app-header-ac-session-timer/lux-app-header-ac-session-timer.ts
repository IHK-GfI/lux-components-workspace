import { Component, inject, OnInit, output } from '@angular/core';
import { LuxButtonComponent } from '../../../../lux-action/lux-button/lux-button.component';
import { LuxDialogService } from '../../../../lux-popups/lux-dialog/lux-dialog.service';
import { LuxAppHeaderAcSessionTimerService } from './lux-app-header-ac-session-timer-service/lux-app-header-ac-session-timer.service';
import { LuxTooltipDirective } from '../../../../lux-directives/lux-tooltip/lux-tooltip.directive';
import { LuxMediaQueryObserverService } from '../../../../lux-util/lux-media-query-observer.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'lux-app-header-ac-session-timer',
  imports: [LuxButtonComponent, LuxTooltipDirective],
  templateUrl: './lux-app-header-ac-session-timer.html'
})
export class LuxAppHeaderAcSessionTimerComponent implements OnInit {
  luxDialogService = inject(LuxDialogService);
  luxSessionTimerService = inject(LuxAppHeaderAcSessionTimerService);
  private mediaQueryService = inject(LuxMediaQueryObserverService);
  luxLoading = false;

  mobileView: boolean;
  subscription: Subscription;

  luxLogoutEvent = output<void>();
  luxLoginEvent = output<void>();

  constructor() {
    this.mobileView = this.mediaQueryService.activeMediaQuery === 'xs';

    this.subscription = this.mediaQueryService.getMediaQueryChangedAsObservable().subscribe((query: string) => {
      this.mobileView = query === 'xs';
    });
  }

  ngOnInit(): void {
    this.luxSessionTimerService.luxLoginEvent.subscribe(() => {
      this.luxLoginEvent.emit();
    });

    this.luxSessionTimerService.luxLogoutEvent.subscribe(() => {
      this.luxLogoutEvent.emit();
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
