import { AccordionGroup, AccordionPanel, AccordionTrigger, AccordionContent } from '@angular/aria/accordion';
import { ScrollDispatcher } from '@angular/cdk/scrolling';
import {
  afterRenderEffect,
  Component,
  DestroyRef,
  computed,
  effect,
  input,
  output,
  inject,
  signal,
  untracked,
  viewChild
} from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { LuxAccordionColor, LuxIconComponent, LuxMediaQueryObserverService, LuxThemeService } from '@ihk-gfi/lux-components';
import { LuxAccordionAriaBase, LuxAccordionAriaTogglePosition } from '../lux-accordion-aria/lux-accordion-aria-base';

@Component({
  selector: 'lux-panel-aria',
  templateUrl: './lux-panel-aria.component.html',
  styleUrls: ['./lux-panel-aria.component.scss'],
  standalone: true,
  imports: [AccordionPanel, AccordionTrigger, LuxIconComponent, AccordionContent],
  hostDirectives: [AccordionGroup]
})
export class LuxPanelAriaComponent {
  private static panelIdCounter = 0;

  protected readonly panelId = `lux-panel-aria-${LuxPanelAriaComponent.panelIdCounter++}`;
  protected readonly headerId = `${this.panelId}-header`;

  protected mediaQuery = inject(LuxMediaQueryObserverService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly scrollDispatcher = inject(ScrollDispatcher);
  private readonly themeService = inject(LuxThemeService);
  protected parent = inject(LuxAccordionAriaBase, { optional: true, host: true, skipSelf: true });
  protected readonly accordionPanel = viewChild.required(AccordionPanel);
  protected readonly accordionTrigger = viewChild.required(AccordionTrigger);

  private readonly theme = toSignal(this.themeService.getThemeAsObservable(), { initialValue: this.themeService.getTheme() });

  // Im Green-Theme werden Plus-/Minus- statt Pfeil-Icons für den Toggle-Indikator verwendet.
  protected toggleIconName = computed(() => {
    const expanded = this.accordionTrigger().expanded();

    if (this.theme().name === 'green') {
      return expanded ? 'lux-interface-remove-1' : 'lux-interface-add-1';
    }

    return 'lux-interface-arrows-button-down';
  });

  luxDisabled = input<boolean | undefined>(undefined);
  luxColor = input<LuxAccordionColor | undefined>(undefined);
  luxExpanded = input<boolean>(false);
  luxHideToggle = input<boolean | undefined>(undefined);
  luxTogglePosition = input<LuxAccordionAriaTogglePosition>(undefined);
  luxCollapsedHeaderHeight = input<string | undefined>(undefined);
  luxExpandedHeaderHeight = input<string | undefined>(undefined);
  luxDynamicHeaderHeight = input<boolean | undefined>(undefined);
  luxStickyHeader = input<boolean | undefined>();
  luxStickyHeaderOffset = input<string | undefined>();
  luxSecondRowForMobile = input<boolean | undefined>(undefined);

  protected effectiveTogglePosition = computed<Exclude<LuxAccordionAriaTogglePosition, undefined>>(
    () => this.luxTogglePosition() ?? this.parent?.effectiveLuxTogglePosition() ?? 'after'
  );
  protected effectiveLuxColor = computed(() => this.luxColor() ?? this.parent?.luxColor() ?? 'primary');
  protected effectiveDisabled = computed(() => !!this.luxDisabled() || !!this.parent?.luxDisabled());
  protected effectiveHideToggle = computed(() => this.luxHideToggle() ?? this.parent?.luxHideToggle() ?? false);
  protected effectiveDynamicHeaderHeight = computed(() => this.luxDynamicHeaderHeight() ?? this.parent?.luxDynamicHeaderHeight() ?? false);
  protected stickyHeader = computed(() => this.luxStickyHeader() ?? this.parent?.luxStickyHeader());
  protected stickyHeaderOffset = computed(() => this.luxStickyHeaderOffset() ?? this.parent?.luxStickyHeaderOffset());
  protected readonly hasScrolled = signal(false);

  headerHeightCacheActive = false;
  expandedHeaderHeightCache?: string;
  collapsedHeaderHeightCache?: string;

  luxOpened = output<void>();
  luxClosed = output<void>();
  luxExpandedChange = output<boolean>();
  luxClickNotAllowed = output<Event>();

  mobile = false;

  constructor() {
    this.parent?.registerPanel(this);
    this.destroyRef.onDestroy(() => this.parent?.unregisterPanel(this));

    this.mobile = this.mediaQuery.isSmallerOrEqual('sm');

    this.scrollDispatcher
      .scrolled(0)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((scrollable) => {
        this.hasScrolled.set(scrollable ? scrollable.measureScrollOffset('top') > 0 : window.scrollY > 0);
      });

    this.mediaQuery
      .getMediaQueryChangedAsObservable()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.mobile = this.mediaQuery.isSmallerOrEqual('sm');
      });

    // Handle luxDynamicHeaderHeight caching logic
    effect(() => {
      const isDynamic = this.effectiveDynamicHeaderHeight();
      if (isDynamic) {
        this.headerHeightCacheActive = true;
        this.expandedHeaderHeightCache = this.getExpandedHeaderHeight();
        this.collapsedHeaderHeightCache = this.getCollapsedHeaderHeight();
      } else if (this.headerHeightCacheActive) {
        // Reset to cached values
        this.headerHeightCacheActive = false;
      }
    });

    let previousExpanded: boolean | undefined;
    effect(() => {
      const expanded = this.accordionTrigger().expanded();
      if (previousExpanded !== undefined && previousExpanded !== expanded) {
        this.onExpandedChange(expanded);
        if (expanded) {
          this.parent?.notifyPanelExpanded(this);
        }
      }
      previousExpanded = expanded;
    });

    afterRenderEffect(() => {
      const expanded = this.luxExpanded();
      const trigger = this.accordionTrigger();

      untracked(() => {
        if (trigger.expanded() !== expanded) {
          if (expanded) {
            trigger.expand();
          } else {
            trigger.collapse();
          }
        }
      });
    });
  }

  collapse(): void {
    this.accordionTrigger().collapse();
  }

  protected onHeaderClick(event: Event): void {
    if (this.effectiveDisabled()) {
      this.luxClickNotAllowed.emit(event);
      return;
    }

    this.accordionTrigger().toggle();
  }

  protected toggleFromKeyboard(event: KeyboardEvent): void {
    if (event.key !== 'Enter' && event.key !== ' ' && event.key !== 'Spacebar') {
      return;
    }

    event.preventDefault();
    event.stopPropagation();
    this.onHeaderClick(event);
  }

  protected getCurrentHeaderHeight(expanded: boolean) {
    return expanded ? this.getExpandedHeaderHeight() : this.getCollapsedHeaderHeight();
  }

  private getExpandedHeaderHeight() {
    return this.luxExpandedHeaderHeight() ?? this.parent?.luxExpandedHeaderHeight() ?? '4em';
  }

  private getCollapsedHeaderHeight() {
    return this.luxCollapsedHeaderHeight() ?? this.parent?.luxCollapsedHeaderHeight() ?? '4em';
  }

  protected onExpandedChange(expanded: boolean) {
    this.luxExpandedChange.emit(expanded);
    (expanded ? this.luxOpened : this.luxClosed).emit();
  }
}
