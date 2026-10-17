import { NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnDestroy, inject, input, output } from '@angular/core';
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

  readonly luxEntries = input<ILuxBreadcrumbEntry[] | undefined>([]);

  /**
   * Aktiviert eine mehrzeilige Darstellung (Umbruch). Standard: einzeilig mit Truncation.
   */
  readonly luxWrap = input(false);

  /**
   * Zeigt nur den ersten und den letzten Eintrag an. Alle dazwischenliegenden Einträge werden als Platzhalter ("...") dargestellt.
   */
  readonly luxShowOnlyFirstAndLast = input(false);

  luxClicked = output<ILuxBreadcrumbEntry>();

  mobileView: boolean;
  subscriptions: Subscription[] = [];

  constructor() {
    this.mobileView = this.mediaQueryService.activeMediaQuery === 'xs' || this.mediaQueryService.activeMediaQuery === 'sm';

    this.subscriptions.push(
      this.mediaQueryService.getMediaQueryChangedAsObservable().subscribe((query) => {
        this.mobileView = query === 'xs' || query === 'sm';
      })
    );
  }

  isCollapsedMode(): boolean {
    return this.luxShowOnlyFirstAndLast() && (this.luxEntries()?.length ?? 0) > 2;
  }

  isDottedEntry(isFirst: boolean, isLast: boolean): boolean {
    return this.isCollapsedMode() && !isFirst && !isLast;
  }

  onEntryClick(event: Event, item: ILuxBreadcrumbEntry) {
    event.preventDefault();
    this.clicked(item);
  }

  clicked(item: ILuxBreadcrumbEntry) {
    this.luxClicked.emit(item);
  }

  ngOnDestroy() {
    this.subscriptions.forEach((sub) => {
      sub.unsubscribe();
    });
  }
}
