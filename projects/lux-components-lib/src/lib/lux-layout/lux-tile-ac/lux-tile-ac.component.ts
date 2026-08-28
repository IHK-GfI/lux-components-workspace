import { ChangeDetectionStrategy, Component, computed, inject, input, OnDestroy, OnInit, output } from '@angular/core';
import { MatCard, MatCardHeader, MatCardSubtitle, MatCardTitle } from '@angular/material/card';
import { Subscription } from 'rxjs';
import {
  LuxBadgeNotificationColor,
  LuxBadgeNotificationDirective,
  LuxBadgeNotificationSize
} from '../../lux-directives/lux-badge-notification/lux-badge-notification.directive';
import { LuxTagIdDirective } from '../../lux-directives/lux-tag-id/lux-tag-id.directive';
import { LuxTooltipDirective } from '../../lux-directives/lux-tooltip/lux-tooltip.directive';
import { LuxMediaQueryObserverService } from '../../lux-util/lux-media-query-observer.service';

@Component({
  selector: 'lux-tile-ac',
  templateUrl: './lux-tile-ac.component.html',
  imports: [MatCard, LuxTagIdDirective, LuxBadgeNotificationDirective, MatCardTitle, MatCardSubtitle, LuxTooltipDirective, MatCardHeader],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'lux-flex' }
})
export class LuxTileAcComponent implements OnInit, OnDestroy {
  private queryService = inject(LuxMediaQueryObserverService);

  readonly luxLabel = input<string | undefined>();
  readonly luxLabelTruncateAfterOneLine = input(false);
  readonly luxLabelTruncateAfterTwoLines = input(false);
  readonly luxSubTitle = input<string | undefined>();
  readonly luxSubTitleTruncateAfterOneLine = input(false);
  readonly luxSubTitleTruncateAfterTwoLines = input(false);
  readonly luxTagId = input<string | undefined>();
  readonly luxShowNotification = input(false);
  readonly luxCounter = input<number | undefined>();
  readonly luxCounterCap = input(10);
  readonly luxNotificationColor = input<LuxBadgeNotificationColor>('primary');
  readonly luxNotificationSize = input<LuxBadgeNotificationSize>('medium');

  readonly luxBadgeContent = computed(() => {
    const counter = this.luxCounter();
    if (!counter) {
      return this.luxShowNotification() ? ' ' : '';
    }
    return '' + counter;
  });

  readonly luxClicked = output<void>();

  mobileView?: boolean;
  subscription?: Subscription;

  ngOnInit() {
    this.subscription = this.queryService.getMediaQueryChangedAsObservable().subscribe((query) => {
      this.mobileView = query === 'xs' || query === 'sm';
    });
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  clicked() {
    this.luxClicked.emit();
  }
}
