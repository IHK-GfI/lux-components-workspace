import { NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnDestroy, Output, inject } from '@angular/core';
import { Subscription } from 'rxjs';
import { LuxIconComponent } from '../lux-icon/lux-icon/lux-icon.component';
import { LuxMediaQueryObserverService } from '../lux-util/lux-media-query-observer.service';
import { ILuxBreadcrumbEntry } from './lux-breadcrumb-model/lux-breadcrumb-entry.interface';

@Component({
  selector: 'lux-breadcrumb',
  templateUrl: './lux-breadcrumb.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgClass, LuxIconComponent]
})
export class LuxBreadcrumbComponent implements OnDestroy {
  private mediaQueryService = inject(LuxMediaQueryObserverService);

  @Input() luxEntries?: ILuxBreadcrumbEntry[] = [];

  @Output() luxClicked = new EventEmitter<ILuxBreadcrumbEntry>();

  mobileView: boolean;
  protected subscriptions: Subscription[] = [];

  constructor() {
    this.mobileView = this.mediaQueryService.activeMediaQuery === 'xs' || this.mediaQueryService.activeMediaQuery === 'sd';

    this.subscriptions.push(
      this.mediaQueryService.getMediaQueryChangedAsObservable().subscribe((query) => {
        this.mobileView = query === 'xs' || query === 'sd';
      })
    );
  }

  protected clicked(item: ILuxBreadcrumbEntry) {
    this.luxClicked.emit(item);
  }

  ngOnDestroy() {
    this.subscriptions.forEach((sub) => {
      sub.unsubscribe();
    });
  }

  protected getIconSize(): string {
    if (this.mobileView) {
      return '18px';
    }
    return '20px';
  }
}
