import { NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, input, output } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { LuxIconComponent } from '../lux-icon/lux-icon/lux-icon.component';
import { LuxMediaQueryObserverService } from '../lux-util/lux-media-query-observer.service';
import { ILuxBreadcrumbEntry } from './lux-breadcrumb-model/lux-breadcrumb-entry.interface';

@Component({
  selector: 'lux-breadcrumb',
  templateUrl: './lux-breadcrumb.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgClass, LuxIconComponent]
})
export class LuxBreadcrumbComponent {
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

  private readonly mediaQueryService = inject(LuxMediaQueryObserverService);
  private readonly activeMediaQuery = toSignal(this.mediaQueryService.getMediaQueryChangedAsObservable(), {
    initialValue: this.mediaQueryService.activeMediaQuery
  });

  readonly mobileView = computed(() => this.activeMediaQuery() === 'xs' || this.activeMediaQuery() === 'sm');

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
}
