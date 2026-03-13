import { Component, DestroyRef, inject, OnInit, output } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { LuxButtonComponent } from '../../../../lux-action/lux-button/lux-button.component';
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
  private readonly luxSessionTimerService = inject(LuxAppHeaderAcSessionTimerService);
  private readonly mediaQueryService = inject(LuxMediaQueryObserverService);
  private readonly tService = inject(TranslocoService);
  private readonly liveAnnouncer = inject(LiveAnnouncer);
  private readonly destroyRef = inject(DestroyRef);

  private luxLoading = false;
  private mobileView: boolean;

  luxLogoutEvent = output<void>();
  luxTimeoutEvent = output<void>();

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
    this.luxSessionTimerService.luxTimeoutEvent.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
      this.luxTimeoutEvent.emit();
    });

    this.luxSessionTimerService.luxLogoutEvent.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
      this.luxLogoutEvent.emit();
    });
  }

  protected isMobileView(): boolean {
    return this.mobileView;
  }

  protected isLuxLoading(): boolean {
    return this.luxLoading;
  }

  protected showSessionTimer(): boolean {
    return this.luxSessionTimerService.showSessionTimer();
  }

  extendTimer() {
    if (!this.luxSessionTimerService.canExtendSession) {
      this.luxSessionTimerService.openNotExtendableDialog();
      return;
    }
    const extendSessionTimer$ = this.luxSessionTimerService?.extendSessionTimer();
    if (!extendSessionTimer$) {
      this.luxSessionTimerService.logoutUser();
      return;
    }

    //Bei Langsamen Antworten soll die UI direkt anzeigen dass die Verlängerung läuft, damit der Nutzer weiß dass etwas passiert.
    this.luxLoading = true;

    extendSessionTimer$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: () => {
        this.luxLoading = true;
      },
      complete: () => {
        this.luxLoading = false;
      },
      error: (err) => {
        console.error('LuxAppHeaderAcSessionTimerComponent: Error while extending session timer: ', err);
        this.luxLoading = false;
        this.luxSessionTimerService.logoutUser();
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

  getTimerTooltip(): string {
    return this.tService.translate('luxc.app-header.session-timer.timer.button.tooltip');
  }
}
