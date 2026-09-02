import { CdkAccordionItem } from '@angular/cdk/accordion';
import { Component, OnDestroy, computed, effect, input, output, inject } from '@angular/core';
import { Subscription } from 'rxjs';
import { LuxMediaQueryObserverService } from '../lux-util/lux-media-query-observer.service';
import { LuxTogglePosition } from '../lux-layout/lux-accordion/lux-accordion.component';
import { LuxIconComponent } from '../lux-icon/lux-icon/lux-icon.component';
import { LuxAccordionAriaComponent } from '../lux-accordion-aria/lux-accordion-aria.component';

@Component({
  selector: 'lux-panel-aria',
  templateUrl: './lux-panel-aria.component.html',
  styleUrls: ['./lux-panel-aria.component.scss'],
  standalone: true,
  imports: [CdkAccordionItem, LuxIconComponent]
})
export class LuxPanelAriaComponent implements OnDestroy {
  private static panelIdCounter = 0;

  protected readonly panelId = `lux-panel-aria-${LuxPanelAriaComponent.panelIdCounter++}`;
  protected readonly contentId = `${this.panelId}-content`;
  protected readonly headerId = `${this.panelId}-header`;

  protected mediaQuery = inject(LuxMediaQueryObserverService);
  protected parent = inject(LuxAccordionAriaComponent, { optional: true, host: true, skipSelf: true });

  luxDisabled = input<boolean | undefined>(undefined);
  luxExpanded = input<boolean>(false);
  luxHideToggle = input<boolean | undefined>(undefined);
  luxTogglePosition = input<LuxTogglePosition | undefined>(undefined);
  luxCollapsedHeaderHeight = input<string | undefined>(undefined);
  luxExpandedHeaderHeight = input<string | undefined>(undefined);
  luxDynamicHeaderHeight = input<boolean | undefined>(undefined);

  protected resolvedTogglePosition = computed<LuxTogglePosition>(
    () => this.luxTogglePosition() ?? this.parent?.luxTogglePosition() ?? 'after'
  );

  headerHeightCacheActive = false;
  expandedHeaderHeightCache?: string;
  collapsedHeaderHeightCache?: string;

  luxOpened = output<void>();
  luxClosed = output<void>();
  luxExpandedChange = output<boolean>();

  subscriptions: Subscription[] = [];
  mobile: boolean;

  constructor() {
    this.mobile = this.mediaQuery.isSmallerOrEqual('sm');

    this.subscriptions.push(
      this.mediaQuery.getMediaQueryChangedAsObservable().subscribe(() => {
        this.mobile = this.mediaQuery.isSmallerOrEqual('sm');
      })
    );

    // Handle luxDynamicHeaderHeight caching logic
    effect(() => {
      const isDynamic = this.luxDynamicHeaderHeight();
      if (isDynamic) {
        this.headerHeightCacheActive = true;
        this.expandedHeaderHeightCache = this.luxExpandedHeaderHeight();
        this.collapsedHeaderHeightCache = this.luxCollapsedHeaderHeight();
      } else if (this.headerHeightCacheActive) {
        // Reset to cached values
        this.headerHeightCacheActive = false;
      }
    });
  }

  ngOnDestroy() {
    this.subscriptions.forEach((sub: Subscription) => sub.unsubscribe());
  }

  protected onHeaderClick(item: CdkAccordionItem) {
    if (!this.luxDisabled()) {
      item.toggle();
    }
  }

  protected getCurrentHeaderHeight(expanded: boolean) {
    return expanded ? (this.luxExpandedHeaderHeight() ?? '4em') : (this.luxCollapsedHeaderHeight() ?? '4em');
  }

  onOpened() {
    this.luxOpened.emit();
    this.luxExpandedChange.emit(true);
  }

  onClosed() {
    this.luxClosed.emit();
    this.luxExpandedChange.emit(false);
  }
}
