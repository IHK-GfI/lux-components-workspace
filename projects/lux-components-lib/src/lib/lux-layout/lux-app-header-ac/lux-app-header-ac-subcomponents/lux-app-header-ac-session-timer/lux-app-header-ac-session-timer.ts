import { Component, DestroyRef, inject, OnInit, output } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { LuxButtonComponent } from '../../../../lux-action/lux-button/lux-button.component';
import { LuxDialogService } from '../../../../lux-popups/lux-dialog/lux-dialog.service';
import { LuxAppHeaderAcSessionTimerService } from './lux-app-header-ac-session-timer-service/lux-app-header-ac-session-timer.service';
import { LuxTooltipDirective } from '../../../../lux-directives/lux-tooltip/lux-tooltip.directive';
import { LuxMediaQueryObserverService } from '../../../../lux-util/lux-media-query-observer.service';
import { TranslocoService } from '@jsverse/transloco';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { LuxAriaLabelDirective } from '../../../../lux-directives/lux-aria/lux-aria-label.directive';

@Component({
  selector: 'lux-app-header-ac-session-timer',
  imports: [LuxButtonComponent, LuxTooltipDirective, LuxAriaLabelDirective],
  templateUrl: './lux-app-header-ac-session-timer.html'
})
export class LuxAppHeaderAcSessionTimerComponent implements OnInit {
  luxDialogService = inject(LuxDialogService);
  luxSessionTimerService = inject(LuxAppHeaderAcSessionTimerService);
  private mediaQueryService = inject(LuxMediaQueryObserverService);
  tService = inject(TranslocoService);
  private liveAnnouncer = inject(LiveAnnouncer);
  private destroyRef = inject(DestroyRef);
  luxLoading = false;

  mobileView: boolean;

  luxLogoutEvent = output<void>();
  luxLoginEvent = output<void>();

  constructor() {
    this.mobileView = this.mediaQueryService.activeMediaQuery === 'xs';

    this.mediaQueryService
      .getMediaQueryChangedAsObservable()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((query: string) => {
        this.mobileView = query === 'xs';
      });
  }

  ngOnInit(): void {
    this.luxSessionTimerService.luxLoginEvent.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
      this.luxLoginEvent.emit();
    });

    this.luxSessionTimerService.luxLogoutEvent.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
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
      error: (err) => {
        console.error('LuxAppHeaderAcSessionTimerComponent: Error while extending session timer: ', err);
        this.luxLoading = false;
        this.luxSessionTimerService.openLogoutDialog();
      }
    });
  }

  getTimerLabel(): string {
    if (this.luxSessionTimerService.showHours()) {
      return `${this.tService.translate('luxc.app-header.session-timer.timer.button.lbl.hours')}`;
    } else if (this.luxSessionTimerService.showSeconds()) {
      return `${this.luxSessionTimerService.formattedSeconds()} ${this.tService.translate('luxc.app-header.session-timer.timer.button.lbl.seconds')}`;
    } else {
      return `${this.luxSessionTimerService.formattedMinutes()} ${this.tService.translate('luxc.app-header.session-timer.timer.button.lbl.minutes')}`;
    }
  }

  announceSessionTimer(): void {
    this.liveAnnouncer.announce(`${this.tService.translate('luxc.app-header.session-timer.timer.button.announcer')}`);
  }
}
