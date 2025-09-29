import { NgClass } from '@angular/common';
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, inject } from '@angular/core';
import { MatCard, MatCardContent } from '@angular/material/card';
import { Subscription } from 'rxjs';
import { LuxBadgeNotificationDirective } from '../../lux-directives/lux-badge-notification/lux-badge-notification.directive';
import { LuxTagIdDirective } from '../../lux-directives/lux-tag-id/lux-tag-id.directive';
import { LuxTooltipDirective } from '../../lux-directives/lux-tooltip/lux-tooltip.directive';
import { LuxMediaQueryObserverService } from '../../lux-util/lux-media-query-observer.service';

@Component({
  selector: 'lux-tile',
  templateUrl: './lux-tile.component.html',
  imports: [MatCard, LuxTagIdDirective, NgClass, LuxBadgeNotificationDirective, MatCardContent, LuxTooltipDirective]
})
export class LuxTileComponent implements OnInit, OnDestroy {
  private queryService = inject(LuxMediaQueryObserverService);

  private static _notificationNewClass = 'lux-notification-new';
  private static _notificationReadClass = 'lux-notification-read';

  @Input() luxLabel?: string;
  @Input() luxLabelTruncateAfterOneLine = false;
  @Input() luxLabelTruncateAfterTwoLines = false;
  @Input() luxTagId?: string;
  @Input() luxShowNotification?: boolean;
  @Input() luxCounter?: number;
  @Input() luxCounterCap = 10;
  @Input() luxShowShadow = true;

  @Output() luxClicked = new EventEmitter<Event>();

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

  getNotificationIconColorClass(): string {
    return this.luxShowNotification ? LuxTileComponent._notificationNewClass : LuxTileComponent._notificationReadClass;
  }
}
