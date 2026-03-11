import { DestroyRef, Directive, ElementRef, EventEmitter, inject, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatOption } from '@angular/material/core';
import { MatSelect } from '@angular/material/select';
import { LuxUtil } from '../../lux-util/lux-util';
import {
  isMeaningfullyFocusedElement,
  isOutsideSelectContext,
  ManualTabIntent,
  PendingCloseFocusAction,
  shouldRestoreTriggerFocus
} from './lux-select-filter-close-focus';
import {
  getAdjacentVisiblePosition,
  getBoundaryVisiblePosition,
  getPageVisiblePosition,
  VisibleBoundary
} from './lux-select-filter-navigation';
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
  private lastPanelElement?: HTMLElement;

  /**
   * Beschreibt nur die gewünschte Fokus-Aktion nach dem Schließen des Panels.
   */
  private pendingCloseFocusAction: PendingCloseFocusAction = 'restore-trigger';

  private normalizedLabelCache: string[] = [];
  private itemCache: T[] = [];
  private readonly panelKeydownHandler = (event: KeyboardEvent) => this.handleOptionKeydown(event);
  private readonly documentPointerdownHandler = (event: PointerEvent) => this.handleDocumentPointerdown(event);
  private readonly panelClickHandler = (event: MouseEvent) => this.handlePanelClick(event);

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
    this.removeDocumentPointerdownListener();
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

    this.pendingCloseFocusAction = 'restore-trigger';
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
    this.removeDocumentPointerdownListener();
    this.clearPanelFilterOffset();
    this.clearFilter();

    const closeAction = this.consumePendingCloseFocusAction();
    if (closeAction === 'manual-tab-forward' || closeAction === 'manual-tab-backward') {
      this.scheduleManualTabNavigation(closeAction);
      return;
    }

    if (closeAction === 'preserve-external-focus') return;

    this.restoreTriggerFocusIfNeeded();
  }

  private consumePendingCloseFocusAction(): PendingCloseFocusAction {
    const currentAction = this.pendingCloseFocusAction;
    this.pendingCloseFocusAction = 'restore-trigger';
    return currentAction;
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
    this.removeDocumentPointerdownListener();

    const tryAttachListener = () => {
      if (!this.matSelect.panelOpen) return;

      const panel = this.matSelect.panel?.nativeElement as HTMLElement | undefined;
      if (!panel) {
        this.setTimer('panelAttach', tryAttachListener);
        return;
      }

      this.panelElement = panel;
      this.lastPanelElement = panel;
      this.updatePanelFilterOffset(panel);
      // Capture: eigene Sichtbarkeitsnavigation vor MatSelect-Handler ausführen.
      panel.addEventListener('keydown', this.panelKeydownHandler, true);
      panel.addEventListener('click', this.panelClickHandler, true);
      document.addEventListener('pointerdown', this.documentPointerdownHandler, true);
    };

    tryAttachListener();
  }

  private removePanelKeydownListener(): void {
    this.clearTimer('panelAttach');
    if (!this.panelElement) return;

    this.panelElement.removeEventListener('keydown', this.panelKeydownHandler, true);
    this.panelElement.removeEventListener('click', this.panelClickHandler, true);
    this.panelElement = undefined;
  }

  private removeDocumentPointerdownListener(): void {
    document.removeEventListener('pointerdown', this.documentPointerdownHandler, true);
  }

  private handleKeyboard(event: KeyboardEvent, source: 'input' | 'panel'): boolean {
    if (!this.matSelect.panelOpen) return false;
    if (source === 'panel' && this.isEventFromFilterInput(event)) return false;

    if (LuxUtil.isKeyTab(event)) {
      return source === 'input' ? this.handleTabFromInput(event) : this.handleTabFromPanel();
    }

    if ((LuxUtil.isKeyPageDown(event) || LuxUtil.isKeyPageUp(event)) && this.isListNavigationModifierAllowed(event)) {
      event.preventDefault();
      event.stopPropagation();
      this.moveActiveVisibleOptionByPage(LuxUtil.isKeyPageDown(event) ? 1 : -1);
      return true;
    }

    // Home/End intentionally navigate the filtered option list even while the input keeps focus.
    if ((LuxUtil.isKeyHome(event) || LuxUtil.isKeyEnd(event)) && this.isListNavigationModifierAllowed(event)) {
      event.preventDefault();
      event.stopPropagation();
      this.moveToVisibleBoundary(LuxUtil.isKeyHome(event) ? 'start' : 'end');
      return true;
    }

    if (LuxUtil.isKeyArrowDown(event) || LuxUtil.isKeyArrowUp(event)) {
      event.preventDefault();
      event.stopPropagation();
      this.moveActiveVisibleOption(LuxUtil.isKeyArrowDown(event) ? 1 : -1);
      return true;
    }

    if (LuxUtil.isKeyEnter(event)) {
      event.preventDefault();
      event.stopPropagation();
      this.selectActiveOrFirstVisibleOption();
      return true;
    }

    return false;
  }

  private handleTabFromInput(event: KeyboardEvent): boolean {
    event.preventDefault();
    event.stopPropagation();
    this.pendingCloseFocusAction = event.shiftKey ? 'manual-tab-backward' : 'manual-tab-forward';
    this.matSelect.close();
    return true;
  }

  private handleTabFromPanel(): boolean {
    this.pendingCloseFocusAction = 'preserve-external-focus';
    return false;
  }

  private restoreTriggerFocusIfNeeded(): void {
    this.setTimer('focusRestore', () => {
      const selectHost = this.getSelectHostElement();
      if (!shouldRestoreTriggerFocus(document.activeElement, selectHost, this.lastPanelElement)) {
        return;
      }

      this.matSelect.focus();
    });
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
    if (isMeaningfullyFocusedElement(activeElement)) {
      return activeElement;
    }

    const selectHost = this.getSelectHostElement();
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
    const nextVisiblePos = getAdjacentVisiblePosition(currentVisiblePos, visibleOptionIndexes.length, step);

    this.activateVisibleOptionByPosition(keyManager, visibleOptionIndexes, nextVisiblePos);
  }

  private moveActiveVisibleOptionByPage(direction: 1 | -1): void {
    const keyManager = this.getInternalKeyManager();
    if (!keyManager) return;

    const visibleOptionIndexes = this.getVisibleOptionIndexes();
    if (visibleOptionIndexes.length === 0) return;

    const currentActiveIndex = this.getActiveOptionIndex(keyManager);
    const currentVisiblePos = visibleOptionIndexes.indexOf(currentActiveIndex);
    const targetVisiblePos = getPageVisiblePosition(currentVisiblePos, visibleOptionIndexes.length, direction);

    this.activateVisibleOptionByPosition(keyManager, visibleOptionIndexes, targetVisiblePos);
  }

  private moveToVisibleBoundary(boundary: VisibleBoundary): void {
    const keyManager = this.getInternalKeyManager();
    if (!keyManager) return;

    const visibleOptionIndexes = this.getVisibleOptionIndexes();
    if (visibleOptionIndexes.length === 0) return;

    const targetVisiblePos = getBoundaryVisiblePosition(visibleOptionIndexes.length, boundary);
    this.activateVisibleOptionByPosition(keyManager, visibleOptionIndexes, targetVisiblePos);
  }

  private activateVisibleOptionByPosition(
    keyManager: InternalKeyManager,
    visibleOptionIndexes: number[],
    targetVisiblePos: number
  ): void {
    const clampedVisiblePos = Math.max(0, Math.min(targetVisiblePos, visibleOptionIndexes.length - 1));
    const targetIndex = visibleOptionIndexes[clampedVisiblePos];
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
    const panel = this.matSelect.panel?.nativeElement as HTMLElement | undefined;
    const option = (this.matSelect.options?.toArray?.() ?? [])[index];
    if (!panel || !option) return;

    const scrollFn = this.internalSelect._scrollOptionIntoView;
    if (typeof scrollFn === 'function') {
      scrollFn.call(this.matSelect, index);
    }

    this.ensureOptionVisibleBelowFilter(panel, option);
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

  private isListNavigationModifierAllowed(event: KeyboardEvent): boolean {
    return !event.altKey && !event.ctrlKey && !event.metaKey;
  }

  private ensureOptionVisibleBelowFilter(panel: HTMLElement, option: MatOption): void {
    const optionHost = this.getOptionHostElement(option);
    if (!optionHost) return;

    const filterHeight = this.getFilterHeight(panel);
    if (filterHeight <= 0) return;

    const panelRect = panel.getBoundingClientRect();
    const optionRect = optionHost.getBoundingClientRect();
    const visibleTop = panelRect.top + filterHeight;
    const visibleBottom = panelRect.bottom;

    if (optionRect.top < visibleTop) {
      panel.scrollTop -= visibleTop - optionRect.top;
      return;
    }

    if (optionRect.bottom > visibleBottom) {
      panel.scrollTop += optionRect.bottom - visibleBottom;
    }
  }

  private updatePanelFilterOffset(panel: HTMLElement): void {
    const filterHeight = this.getFilterHeight(panel);
    panel.style.setProperty('--lux-select-filter-offset', `${filterHeight}px`);
  }

  private clearPanelFilterOffset(): void {
    const panel = this.matSelect.panel?.nativeElement as HTMLElement | undefined;
    if (!panel) return;

    panel.style.removeProperty('--lux-select-filter-offset');
  }

  private handleDocumentPointerdown(event: PointerEvent): void {
    if (!isOutsideSelectContext(event.target, this.getSelectHostElement(), this.panelElement)) {
      return;
    }

    this.pendingCloseFocusAction = 'preserve-external-focus';
  }

  private handlePanelClick(event: MouseEvent): void {
    if (!this.matSelect.multiple) {
      return;
    }

    const target = event.target;
    if (!(target instanceof HTMLElement) || !target.closest('.mat-mdc-option')) {
      return;
    }

    this.focusFilterInput();
  }

  private getSelectHostElement(): HTMLElement | undefined {
    return this.internalSelect._elementRef?.nativeElement;
  }

  private getFilterHeight(panel: HTMLElement): number {
    const filterHost = panel.querySelector<HTMLElement>('lux-select-panel-filter');
    if (!filterHost) return 0;

    const style = window.getComputedStyle(filterHost);
    if (style.display === 'none' || style.visibility === 'hidden') {
      return 0;
    }

    return filterHost.getBoundingClientRect().height;
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

type TimerKey = 'focusInput' | 'focusRestore' | 'tabNavigation' | 'panelAttach';
type TimeoutMap = Partial<Record<TimerKey, ReturnType<typeof setTimeout>>>;
