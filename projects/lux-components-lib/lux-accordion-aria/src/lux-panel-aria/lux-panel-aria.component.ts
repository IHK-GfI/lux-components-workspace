import { AccordionContent, AccordionGroup, AccordionPanel, AccordionTrigger } from '@angular/aria/accordion';
import { ScrollDispatcher } from '@angular/cdk/scrolling';
import {
  afterNextRender,
  afterRenderEffect,
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  effect,
  ElementRef,
  inject,
  input,
  output,
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
  imports: [AccordionPanel, AccordionTrigger, AccordionGroup, LuxIconComponent, AccordionContent],
  changeDetection: ChangeDetectionStrategy.OnPush
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
  private readonly panelHeader = viewChild.required<ElementRef<HTMLElement>>('panelHeader');
  private readonly triggerButton = viewChild.required<ElementRef<HTMLButtonElement>>('triggerButton');

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

  luxOpened = output<void>();
  luxClosed = output<void>();
  luxExpandedChange = output<boolean>();
  luxClickNotAllowed = output<Event>();

  mobile = signal(this.mediaQuery.isSmallerOrEqual('sm'));

  constructor() {
    this.parent?.registerPanel(this);
    this.destroyRef.onDestroy(() => this.parent?.unregisterPanel(this));

    // Klick und Enter/Leertaste auf dem Trigger schon in der Capture-Phase am Header abfangen: ngAccordionGroup
    // sitzt auf dem Trigger-Button selbst und schaltet seit @angular/aria 22 bei click/keydown ebenfalls um.
    // Ein stopPropagation() im Listener am Button käme zu spät (gleiches Element), das Panel würde doppelt
    // umgeschaltet. Aus der Capture-Phase erreicht das Event den Button gar nicht erst.
    afterNextRender(() => {
      const header = this.panelHeader().nativeElement;
      const onClick = (event: MouseEvent) => {
        if (this.isTriggerEvent(event)) {
          this.onHeaderClick(event);
        }
      };
      const onKeydown = (event: KeyboardEvent) => {
        if (this.isTriggerEvent(event)) {
          this.toggleFromKeyboard(event);
        }
      };
      header.addEventListener('click', onClick, true);
      header.addEventListener('keydown', onKeydown, true);
      this.destroyRef.onDestroy(() => {
        header.removeEventListener('click', onClick, true);
        header.removeEventListener('keydown', onKeydown, true);
      });
    });

    this.scrollDispatcher
      .scrolled(0)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((scrollable) => {
        this.hasScrolled.set(scrollable ? scrollable.getElementRef().nativeElement.scrollTop > 0 : window.scrollY > 0);
      });

    this.mediaQuery
      .getMediaQueryChangedAsObservable()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.mobile.set(this.mediaQuery.isSmallerOrEqual('sm')));

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
    // Das Umschalten übernimmt diese Komponente selbst (wie in toggleFromKeyboard). Aufgerufen aus der
    // Capture-Phase am Header, stopPropagation hält das Event von ngAccordionGroup am Button fern.
    event.stopPropagation();

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

  private isTriggerEvent(event: Event): boolean {
    return event.target instanceof Node && this.triggerButton().nativeElement.contains(event.target);
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
