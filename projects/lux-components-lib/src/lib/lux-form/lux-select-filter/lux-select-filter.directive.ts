import { DestroyRef, Directive, ElementRef, EventEmitter, inject, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatOption } from '@angular/material/core';
import { MatSelect } from '@angular/material/select';
import { LuxSelectFilterUtils } from './lux-select-filter.utils';

@Directive({
  selector: 'mat-select[luxSelectFilter]',
  exportAs: 'luxSelectFilter',
  standalone: true
})
export class LuxSelectFilterDirective<T = any> implements OnInit, OnDestroy {
  private readonly matSelect = inject(MatSelect);
  private readonly destroyRef = inject(DestroyRef);
  private readonly internalSelect = this.matSelect as unknown as MatSelectInternal;
  private readonly timers: TimeoutMap = {};
  private panelElement?: HTMLElement;

  /**
   * Steuert den Close-Fokusfluss:
   * `default` = Trigger ggf. restaurieren,
   * `native-tab` = nativen Tabfluss nicht überschreiben,
   * `manual-tab-*` = preventDefault-Tab aus Filter-Input manuell fortsetzen.
   */
  private closeIntent: CloseIntent = 'default';

  private normalizedLabelCache: string[] = [];
  private itemCache: T[] = [];
  private readonly panelKeydownHandler = (event: KeyboardEvent) => this.handleOptionKeydown(event);

  @Input() luxSelectFilter = false;
  @Input() luxFilterLabelFn?: (item: T, index: number) => string;
  @Output() luxFilterActiveChange = new EventEmitter<boolean>();

  filterValue = '';
  filteredItems = new Set<T>();
  filteredIndexes = new Set<number>();
  filterInputRef?: ElementRef<HTMLInputElement>;

  ngOnInit(): void {
    this.matSelect.openedChange.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((open) => {
      if (open) {
        this.onPanelOpen();
      } else {
        this.onPanelClose();
      }
    });
  }

  ngOnDestroy(): void {
    this.removePanelKeydownListener();
    this.clearAllTimers();
  }

  setItems(items: readonly T[]): void {
    this.itemCache = [...items];
    this.rebuildCache();
    this.applyFilter();
  }

  onFilterInput(value: string): void {
    const wasActive = this.isFilterActive();
    this.filterValue = value;
    this.applyFilter();
    this.syncActiveItemToVisibleOptions();

    const isActive = this.isFilterActive();
    if (wasActive !== isActive) this.luxFilterActiveChange.emit(isActive);
  }

  setFilterInputRef(ref: ElementRef<HTMLInputElement>): void {
    this.filterInputRef = ref;
  }

  handleKeydown(event: KeyboardEvent): boolean {
    return this.handleKeyboard(event, 'input');
  }

  handleOptionKeydown(event: KeyboardEvent): boolean {
    return this.handleKeyboard(event, 'panel');
  }

  isItemVisible(item: T): boolean {
    return !this.isFilterActive() || this.filteredItems.has(item);
  }

  isIndexVisible(index: number): boolean {
    return !this.isFilterActive() || this.filteredIndexes.has(index);
  }

  isFilterActive(): boolean {
    return this.luxSelectFilter && this.filterValue.trim().length > 0;
  }

  isOptionFocused(): boolean {
    const activeElement = document.activeElement as HTMLElement | null;
    return !!this.panelElement && !!activeElement && this.panelElement.contains(activeElement) && !!activeElement.closest('.mat-mdc-option');
  }

  private onPanelOpen(): void {
    if (!this.luxSelectFilter) return;

    this.closeIntent = 'default';
    this.clearTimer('focusRestore');
    this.clearTimer('tabNavigation');
    this.rebuildCache();
    this.applyFilter();
    this.syncActiveItemToVisibleOptions();
    this.registerPanelKeydownListener();
    this.focusFilterInput();
  }

  private onPanelClose(): void {
    if (!this.luxSelectFilter) return;

    this.removePanelKeydownListener();
    this.clearFilter();

    const closeAction = this.consumeCloseIntent();
    if (closeAction === 'native-tab') return;
    if (closeAction === 'manual-tab-forward' || closeAction === 'manual-tab-backward') {
      this.scheduleManualTabNavigation(closeAction);
      return;
    }

    this.restoreTriggerFocusIfNeeded();
  }

  private consumeCloseIntent(): CloseIntent {
    const currentIntent = this.closeIntent;
    this.closeIntent = 'default';
    return currentIntent;
  }

  private rebuildCache(): void {
    const labelFn = this.luxFilterLabelFn;
    if (!labelFn) {
      this.normalizedLabelCache = [];
      return;
    }

    this.normalizedLabelCache = this.itemCache.map((item, index) => LuxSelectFilterUtils.normalize(labelFn(item, index)));
  }

  private applyFilter(): void {
    const normalizedFilter = LuxSelectFilterUtils.normalize(this.filterValue).trim();
    this.filteredItems.clear();
    this.filteredIndexes.clear();

    this.itemCache.forEach((item, index) => {
      const label = this.normalizedLabelCache[index] ?? '';
      if (!normalizedFilter || label.includes(normalizedFilter)) {
        this.filteredItems.add(item);
        this.filteredIndexes.add(index);
      }
    });
  }

  private clearFilter(): void {
    if (!this.filterValue) return;
    this.filterValue = '';
    this.applyFilter();
    this.luxFilterActiveChange.emit(false);
  }

  private focusFilterInput(): void {
    this.setTimer('focusInput', () => {
      const input = this.filterInputRef?.nativeElement;
      if (!this.matSelect.panelOpen || !input) return;
      input.focus();
      input.select();
    });
  }

  private setTimer(timerKey: TimerKey, callback: () => void): void {
    this.clearTimer(timerKey);
    this.timers[timerKey] = setTimeout(() => {
      this.timers[timerKey] = undefined;
      callback();
    });
  }

  private clearTimer(timerKey: TimerKey): void {
    const timer = this.timers[timerKey];
    if (!timer) return;
    clearTimeout(timer);
    this.timers[timerKey] = undefined;
  }

  private clearAllTimers(): void {
    this.clearTimer('focusInput');
    this.clearTimer('focusRestore');
    this.clearTimer('tabNavigation');
    this.clearTimer('panelAttach');
  }

  private registerPanelKeydownListener(): void {
    this.removePanelKeydownListener();

    const tryAttachListener = () => {
      if (!this.matSelect.panelOpen) return;

      const panel = this.matSelect.panel?.nativeElement as HTMLElement | undefined;
      if (!panel) {
        this.setTimer('panelAttach', tryAttachListener);
        return;
      }

      this.panelElement = panel;
      // Capture: eigene Sichtbarkeitsnavigation vor MatSelect-Handler ausführen.
      panel.addEventListener('keydown', this.panelKeydownHandler, true);
    };

    tryAttachListener();
  }

  private removePanelKeydownListener(): void {
    this.clearTimer('panelAttach');
    if (!this.panelElement) return;

    this.panelElement.removeEventListener('keydown', this.panelKeydownHandler, true);
    this.panelElement = undefined;
  }

  private handleKeyboard(event: KeyboardEvent, source: 'input' | 'panel'): boolean {
    if (!this.matSelect.panelOpen) return false;
    if (source === 'panel' && this.isEventFromFilterInput(event)) return false;

    if (event.key === 'Tab') {
      if (source === 'input') {
        event.preventDefault();
        event.stopPropagation();
        this.closeIntent = event.shiftKey ? 'manual-tab-backward' : 'manual-tab-forward';
        this.matSelect.close();
        return true;
      }

      this.closeIntent = 'native-tab';
      return false;
    }

    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();
      event.stopPropagation();
      this.moveActiveVisibleOption(event.key === 'ArrowDown' ? 1 : -1);
      return true;
    }

    if (event.key === 'Enter') {
      event.preventDefault();
      event.stopPropagation();
      this.selectActiveOrFirstVisibleOption();
      return true;
    }

    return false;
  }

  private restoreTriggerFocusIfNeeded(): void {
    this.setTimer('focusRestore', () => {
      if (this.shouldRestoreTriggerFocus()) this.matSelect.focus();
    });
  }

  private shouldRestoreTriggerFocus(): boolean {
    const activeElement = document.activeElement;
    if (!activeElement) return true;
    if (activeElement === document.body || activeElement === document.documentElement) return true;
    return activeElement instanceof HTMLElement && !activeElement.isConnected;
  }

  private scheduleManualTabNavigation(intent: ManualTabIntent): void {
    this.setTimer('tabNavigation', () => {
      const focusAnchor = this.getTabNavigationAnchorElement();
      if (!focusAnchor) return;

      if (intent === 'manual-tab-backward') {
        LuxSelectFilterUtils.focusPreviousFocusableElement(focusAnchor);
      } else {
        LuxSelectFilterUtils.focusNextFocusableElement(focusAnchor);
      }
    });
  }

  private getTabNavigationAnchorElement(): HTMLElement | undefined {
    const activeElement = document.activeElement;
    if (activeElement instanceof HTMLElement && activeElement !== document.body && activeElement !== document.documentElement) {
      return activeElement;
    }

    const selectHost = this.internalSelect._elementRef?.nativeElement;
    if (!selectHost) return undefined;

    const focusTarget = selectHost.querySelector<HTMLElement>('[tabindex], button, a[href], input, select, textarea');
    return focusTarget ?? selectHost;
  }

  private moveActiveVisibleOption(step: 1 | -1): void {
    const keyManager = this.getInternalKeyManager();
    if (!keyManager) return;

    const visibleOptionIndexes = this.getVisibleOptionIndexes();
    if (visibleOptionIndexes.length === 0) return;

    const currentActiveIndex = this.getActiveOptionIndex(keyManager);
    const currentVisiblePos = visibleOptionIndexes.indexOf(currentActiveIndex);
    const nextVisiblePos =
      currentVisiblePos < 0
        ? step === 1
          ? 0
          : visibleOptionIndexes.length - 1
        : (currentVisiblePos + step + visibleOptionIndexes.length) % visibleOptionIndexes.length;

    const targetIndex = visibleOptionIndexes[nextVisiblePos];
    keyManager.setActiveItem(targetIndex);
    this.scrollOptionIntoView(targetIndex);
  }

  private selectActiveOrFirstVisibleOption(): void {
    const keyManager = this.getInternalKeyManager();
    if (!keyManager) return;

    const visibleOptionIndexes = this.getVisibleOptionIndexes();
    if (visibleOptionIndexes.length === 0) return;

    const activeIndex = this.getActiveOptionIndex(keyManager);
    const targetIndex = visibleOptionIndexes.includes(activeIndex) ? activeIndex : visibleOptionIndexes[0];
    keyManager.setActiveItem(targetIndex);
    this.scrollOptionIntoView(targetIndex);

    const option = (this.matSelect.options?.toArray?.() ?? [])[targetIndex];
    if (!option) return;

    const internalOption = option as unknown as MatOptionInternal;
    if (typeof internalOption._selectViaInteraction === 'function') {
      internalOption._selectViaInteraction();
    } else {
      option.select();
    }

    if (!this.matSelect.multiple) {
      this.matSelect.close();
      return;
    }

    // Multi-Select bleibt offen; Fokus bleibt für weiteres Filtern im Input.
    this.focusFilterInput();
  }

  private syncActiveItemToVisibleOptions(): void {
    const keyManager = this.getInternalKeyManager();
    if (!keyManager) return;

    const visibleOptionIndexes = this.getVisibleOptionIndexes();
    if (visibleOptionIndexes.length === 0) {
      if (typeof keyManager.updateActiveItem === 'function') {
        keyManager.updateActiveItem(-1);
      } else {
        keyManager.activeItemIndex = -1;
      }
      return;
    }

    const activeIndex = this.getActiveOptionIndex(keyManager);
    if (activeIndex >= 0 && visibleOptionIndexes.includes(activeIndex)) return;

    keyManager.setActiveItem(visibleOptionIndexes[0]);
    this.scrollOptionIntoView(visibleOptionIndexes[0]);
  }

  private getVisibleOptionIndexes(): number[] {
    const options = this.matSelect.options?.toArray?.() ?? [];
    return options
      .map((option, index) => ({ option, index }))
      .filter(({ option }) => this.isOptionVisible(option))
      .map(({ index }) => index);
  }

  private isOptionVisible(option: MatOption): boolean {
    const hostElement = this.getOptionHostElement(option);
    if (!hostElement) return true;

    // Detached Test-Elemente liefern via getComputedStyle nicht zuverlässig `display:none`.
    if (hostElement.style.display === 'none' || hostElement.style.visibility === 'hidden') return false;

    const style = window.getComputedStyle(hostElement);
    return style.display !== 'none' && style.visibility !== 'hidden';
  }

  private getActiveOptionIndex(keyManager: InternalKeyManager): number {
    if (keyManager.activeItemIndex >= 0) return keyManager.activeItemIndex;

    const activeItem = keyManager.activeItem;
    if (!activeItem) return -1;

    const options = this.matSelect.options?.toArray?.() ?? [];
    return options.indexOf(activeItem as MatOption);
  }

  private scrollOptionIntoView(index: number): void {
    const scrollFn = this.internalSelect._scrollOptionIntoView;
    if (typeof scrollFn === 'function' && this.matSelect.panel?.nativeElement) {
      scrollFn.call(this.matSelect, index);
    }
  }

  private getInternalKeyManager(): InternalKeyManager | undefined {
    return this.internalSelect._keyManager;
  }

  private getOptionHostElement(option: MatOption): HTMLElement | null {
    const internalOption = option as unknown as MatOptionInternal;
    if (typeof internalOption._getHostElement === 'function') return internalOption._getHostElement();
    return internalOption._element?.nativeElement ?? null;
  }

  private isEventFromFilterInput(event: KeyboardEvent): boolean {
    const target = event.target as HTMLElement | null;
    return !!target?.closest('.lux-select-panel-filter, .lux-select-panel-filter-input');
  }
}

interface InternalKeyManager {
  activeItemIndex: number;
  activeItem?: { focus?: () => void } | null;
  setActiveItem(index: number): void;
  updateActiveItem?(index: number): void;
}

interface MatSelectInternal {
  _keyManager?: InternalKeyManager;
  _scrollOptionIntoView?(index: number): void;
  _elementRef?: ElementRef<HTMLElement>;
}

interface MatOptionInternal {
  _getHostElement?(): HTMLElement;
  _element?: ElementRef<HTMLElement>;
  _selectViaInteraction?(): void;
}

type CloseIntent = 'default' | 'native-tab' | ManualTabIntent;
type ManualTabIntent = 'manual-tab-forward' | 'manual-tab-backward';
type TimerKey = 'focusInput' | 'focusRestore' | 'tabNavigation' | 'panelAttach';
type TimeoutMap = Partial<Record<TimerKey, ReturnType<typeof setTimeout>>>;
