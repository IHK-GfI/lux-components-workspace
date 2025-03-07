import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, inject } from '@angular/core';
import { MatCard, MatCardSubtitle, MatCardTitle } from '@angular/material/card';
import { Subscription } from 'rxjs';
import {
  LuxBadgeNotificationColor,
  LuxBadgeNotificationDirective,
  LuxBadgeNotificationSize
} from '../../lux-directives/lux-badge-notification/lux-badge-notification.directive';
import { LuxTagIdDirective } from '../../lux-directives/lux-tag-id/lux-tag-id.directive';
import { LuxMediaQueryObserverService } from '../../lux-util/lux-media-query-observer.service';

@Component({
  selector: 'lux-tile-ac',
  templateUrl: './lux-tile-ac.component.html',
  imports: [MatCard, LuxTagIdDirective, LuxBadgeNotificationDirective, MatCardTitle, MatCardSubtitle]
})
export class LuxTileAcComponent implements OnInit, OnChanges, OnDestroy {
  private queryService = inject(LuxMediaQueryObserverService);

  @Input() luxLabel?: string;
  @Input() luxSubTitle?: string;
  @Input() luxTagId?: string;

  @Input() set luxShowNotification(value: boolean) {
    this._showNotification = value;
    this.updateBadgeContent();
  }
  get luxShowNotification() {
    return this._showNotification;
  }

  @Input() set luxCounter(counter: number | undefined) {
    this._counter = counter;
    this.updateBadgeContent();
  }
  get luxCounter() {
    return this._counter;
  }

  @Input() luxCounterCap = 10;
  @Input() luxNotificationColor: LuxBadgeNotificationColor = 'primary';
  @Input() luxNotificationSize: LuxBadgeNotificationSize = 'medium';

  private _showNotification = false;
  private _counter?: number;

  luxBadgeContent = '';

  @Output() luxClicked = new EventEmitter<Event>();

  mobileView?: boolean;
  subscription?: Subscription;

  ngOnInit() {
    this.subscription = this.queryService.getMediaQueryChangedAsObservable().subscribe((query) => {
      this.mobileView = query === 'xs' || query === 'sm';
    });
    this.updateBadgeContent();
  }

  ngOnChanges() {
    this.updateBadgeContent();
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  clicked() {
    this.luxClicked.emit();
  }

  getBadgeContent() {
    this.updateBadgeContent();
    return this.luxBadgeContent;
  }

  private updateBadgeContent() {
    if (!this.luxCounter) {
      if (this.luxShowNotification) {
        this.luxBadgeContent = ' ';
      } else {
        this.luxBadgeContent = '';
      }
    } else {
      this.luxBadgeContent = '' + this.luxCounter;
    }
  }
}
