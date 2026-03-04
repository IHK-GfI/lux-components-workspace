import { DestroyRef, Directive, ElementRef, EventEmitter, inject, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatOption } from '@angular/material/core';
import { MatSelect } from '@angular/material/select';
import { LuxSelectFilterUtils } from './lux-select-filter.utils';

/**
 * Directive für Filter-Funktionalität auf MatSelect.
 * Übernimmt State-Management, Filter-Logik, Keyboard-Navigation und Focus-Management.
 */
@Directive({
  selector: 'mat-select[luxSelectFilter]',
  exportAs: 'luxSelectFilter',
  standalone: true
})
export class LuxSelectFilterDirective<T = any> implements OnInit, OnDestroy {
  private readonly matSelect = inject(MatSelect);
  private readonly destroyRef = inject(DestroyRef);

  private focusTimeout?: ReturnType<typeof setTimeout>;
  private focusRestoreTimeout?: ReturnType<typeof setTimeout>;
  private tabNavigationTimeout?: ReturnType<typeof setTimeout>;
  private panelAttachTimeout?: ReturnType<typeof setTimeout>;
  private panelElement?: HTMLElement;
  /**
   * Modelliert, warum das Panel geschlossen wurde.
   * Damit bleibt der Fokus-Flow deterministisch:
   * - `default`: Trigger-Fokus ggf. restaurieren
   * - `native-tab`: nativen Tab-Flow nicht überschreiben
   * - `manual-tab-*`: Tab aus Filter-Input wurde preventDefault behandelt
   *   und muss nach dem Schließen manuell fortgesetzt werden.
   */
  private closeIntent: CloseIntent = 'default';
  private normalizedLabelCache: string[] = [];
  private itemCache: T[] = [];
  private readonly panelKeydownHandler = (event: KeyboardEvent) => {
    this.handleOptionKeydown(event);
  };

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
    this.clearFocusTimeout();
    this.clearFocusRestoreTimeout();
    this.clearTabNavigationTimeout();
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
    if (wasActive !== isActive) {
      this.luxFilterActiveChange.emit(isActive);
    }
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
    const panelElement = this.panelElement;
    const activeElement = document.activeElement as HTMLElement | null;
    if (!panelElement || !activeElement) {
      return false;
    }
    return panelElement.contains(activeElement) && !!activeElement.closest('.mat-mdc-option');
  }

  private onPanelOpen(): void {
    if (!this.luxSelectFilter) {
      return;
    }
    this.closeIntent = 'default';
    this.clearFocusRestoreTimeout();
    this.clearTabNavigationTimeout();
    this.rebuildCache();
    this.applyFilter();
    this.syncActiveItemToVisibleOptions();
    this.registerPanelKeydownListener();
    this.focusFilterInput();
  }

  private onPanelClose(): void {
    if (!this.luxSelectFilter) {
      return;
    }
    this.removePanelKeydownListener();
    this.clearFilter();

    if (this.closeIntent === 'manual-tab-forward' || this.closeIntent === 'manual-tab-backward') {
      this.executePendingTabNavigation();
      return;
    }

    if (this.closeIntent === 'native-tab') {
      this.closeIntent = 'default';
      return;
    }

    this.restoreTriggerFocusIfNeeded();
  }

  private rebuildCache(): void {
    if (!this.luxFilterLabelFn) {
      this.normalizedLabelCache = [];
      return;
    }
    this.normalizedLabelCache = this.itemCache.map((item, index) => LuxSelectFilterUtils.normalize(this.luxFilterLabelFn!(item, index)));
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
    if (this.filterValue) {
      this.filterValue = '';
      this.applyFilter();
      this.luxFilterActiveChange.emit(false);
    }
  }

  private focusFilterInput(): void {
    this.clearFocusTimeout();
    this.focusTimeout = setTimeout(() => {
      const input = this.filterInputRef?.nativeElement;
      if (!this.matSelect.panelOpen || !input) {
        return;
      }
      input.focus();
      input.select();
    });
  }

  private clearFocusTimeout(): void {
    if (this.focusTimeout) {
      clearTimeout(this.focusTimeout);
      this.focusTimeout = undefined;
    }
  }

  private clearFocusRestoreTimeout(): void {
    if (this.focusRestoreTimeout) {
      clearTimeout(this.focusRestoreTimeout);
      this.focusRestoreTimeout = undefined;
    }
  }

  private clearTabNavigationTimeout(): void {
    if (this.tabNavigationTimeout) {
      clearTimeout(this.tabNavigationTimeout);
      this.tabNavigationTimeout = undefined;
    }
  }

  private registerPanelKeydownListener(): void {
    this.removePanelKeydownListener();
    const tryAttachListener = () => {
      if (!this.matSelect.panelOpen) {
        return;
      }
      const panel = this.matSelect.panel?.nativeElement as HTMLElement | undefined;
      if (!panel) {
        this.panelAttachTimeout = setTimeout(() => {
          this.panelAttachTimeout = undefined;
          tryAttachListener();
        });
        return;
      }
      this.panelElement = panel;
      // Capture ist notwendig, damit die eigene sichtbarkeitsbasierte Navigation
      // vor dem MatSelect-Handler greift und nicht doppelt verarbeitet wird.
      panel.addEventListener('keydown', this.panelKeydownHandler, true);
    };
    tryAttachListener();
  }

  private removePanelKeydownListener(): void {
    if (this.panelAttachTimeout) {
      clearTimeout(this.panelAttachTimeout);
      this.panelAttachTimeout = undefined;
    }
    if (this.panelElement) {
      this.panelElement.removeEventListener('keydown', this.panelKeydownHandler, true);
    }
    this.panelElement = undefined;
  }

  private handleKeyboard(event: KeyboardEvent, source: 'input' | 'panel'): boolean {
    if (!this.matSelect.panelOpen) {
      return false;
    }

    if (source === 'input' && event.key === 'Tab') {
      event.preventDefault();
      event.stopPropagation();
      this.closeIntent = event.shiftKey ? 'manual-tab-backward' : 'manual-tab-forward';

      this.matSelect.close();

      return true;
    }

    if (source === 'panel' && event.key === 'Tab') {
      // Nativer Tab-Flow darf beim Schließen nicht durch Trigger-Restore überschrieben werden.
      this.closeIntent = 'native-tab';
      return false;
    }

    if (source === 'panel' && this.isEventFromFilterInput(event)) {
      return false;
    }

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        event.stopPropagation();
        this.moveActiveVisibleOption(1);
        return true;
      case 'ArrowUp':
        event.preventDefault();
        event.stopPropagation();
        this.moveActiveVisibleOption(-1);
        return true;
      case 'Enter':
        event.preventDefault();
        event.stopPropagation();
        this.selectActiveOrFirstVisibleOption();
        return true;
    }

    return false;
  }

  private restoreTriggerFocusIfNeeded(): void {
    this.closeIntent = 'default';
    this.clearFocusRestoreTimeout();
    this.focusRestoreTimeout = setTimeout(() => {
      this.focusRestoreTimeout = undefined;
      if (!this.shouldRestoreTriggerFocus()) {
        return;
      }
      this.matSelect.focus();
    });
  }

  private shouldRestoreTriggerFocus(): boolean {
    const activeElement = document.activeElement;
    if (!activeElement) {
      return true;
    }

    if (activeElement === document.body || activeElement === document.documentElement) {
      return true;
    }

    return activeElement instanceof HTMLElement && !activeElement.isConnected;
  }

  private moveActiveVisibleOption(step: 1 | -1): void {
    const keyManager = this.getInternalKeyManager();
    if (!keyManager) {
      return;
    }

    const visibleOptionIndexes = this.getVisibleOptionIndexes();
    if (visibleOptionIndexes.length === 0) {
      return;
    }

    const currentActiveIndex = this.getActiveOptionIndex(keyManager);
    const currentVisiblePos = visibleOptionIndexes.indexOf(currentActiveIndex);
    let nextVisiblePos: number;

    if (currentVisiblePos < 0) {
      nextVisiblePos = step === 1 ? 0 : visibleOptionIndexes.length - 1;
    } else {
      nextVisiblePos = (currentVisiblePos + step + visibleOptionIndexes.length) % visibleOptionIndexes.length;
    }

    const targetIndex = visibleOptionIndexes[nextVisiblePos];
    keyManager.setActiveItem(targetIndex);
    this.scrollOptionIntoView(targetIndex);
  }

  private selectActiveOrFirstVisibleOption(): void {
    const keyManager = this.getInternalKeyManager();
    if (!keyManager) {
      return;
    }
    const visibleOptionIndexes = this.getVisibleOptionIndexes();
    if (visibleOptionIndexes.length === 0) {
      return;
    }
    const activeIndex = this.getActiveOptionIndex(keyManager);
    const targetIndex = visibleOptionIndexes.includes(activeIndex) ? activeIndex : visibleOptionIndexes[0];
    keyManager.setActiveItem(targetIndex);
    this.scrollOptionIntoView(targetIndex);
    const option = (this.matSelect.options?.toArray?.() ?? [])[targetIndex];
    if (!option) {
      return;
    }

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

    // Im Multi-Select bleibt das Panel offen; Fokus bleibt für weiteres Filtern im Input.
    this.focusFilterInput();
  }

  private syncActiveItemToVisibleOptions(): void {
    const keyManager = this.getInternalKeyManager();
    if (!keyManager) {
      return;
    }

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
    if (activeIndex >= 0 && visibleOptionIndexes.includes(activeIndex)) {
      return;
    }

    keyManager.setActiveItem(visibleOptionIndexes[0]);
    this.scrollOptionIntoView(visibleOptionIndexes[0]);
  }

  private getVisibleOptionIndexes(): number[] {
    const options = this.matSelect.options?.toArray?.() ?? [];
    return options
      .map((option, index: number) => ({ option, index }))
      .filter(({ option }) => this.isOptionVisible(option))
      .map(({ index }) => index);
  }

  private isOptionVisible(option: MatOption): boolean {
    const el = this.getOptionHostElement(option);
    if (!el) return true;

    // Detached Test-Elemente liefern via getComputedStyle nicht zuverlässig `display:none`.
    if (el.style.display === 'none' || el.style.visibility === 'hidden') {
      return false;
    }

    const style = window.getComputedStyle(el);
    return style.display !== 'none' && style.visibility !== 'hidden';
  }

  private getActiveOptionIndex(keyManager: InternalKeyManager): number {
    if (keyManager.activeItemIndex >= 0) {
      return keyManager.activeItemIndex;
    }

    const activeItem = keyManager.activeItem;
    if (!activeItem) {
      return -1;
    }

    const options = this.matSelect.options?.toArray?.() ?? [];
    return options.indexOf(activeItem as MatOption);
  }

  private executePendingTabNavigation(): void {
    const intent = this.closeIntent;
    this.closeIntent = 'default';

    if (intent !== 'manual-tab-forward' && intent !== 'manual-tab-backward') {
      return;
    }

    this.clearTabNavigationTimeout();
    this.tabNavigationTimeout = setTimeout(() => {
      this.tabNavigationTimeout = undefined;
      const focusAnchor = this.getTabNavigationAnchorElement();
      if (!focusAnchor) {
        return;
      }

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

    const selectHost = this.getInternalSelect()._elementRef?.nativeElement;
    if (!selectHost) {
      return undefined;
    }

    const focusTarget = selectHost.querySelector<HTMLElement>('[tabindex], button, a[href], input, select, textarea');
    return focusTarget ?? selectHost;
  }

  private scrollOptionIntoView(index: number): void {
    const scrollFn = this.getInternalSelect()._scrollOptionIntoView;
    if (typeof scrollFn === 'function' && this.matSelect.panel?.nativeElement) {
      scrollFn.call(this.matSelect, index);
    }
  }

  private getInternalKeyManager(): InternalKeyManager | undefined {
    return this.getInternalSelect()._keyManager;
  }

  private getInternalSelect(): MatSelectInternal {
    return this.matSelect as unknown as MatSelectInternal;
  }

  private getOptionHostElement(option: MatOption): HTMLElement | null {
    const internalOption = option as unknown as MatOptionInternal;

    if (typeof internalOption._getHostElement === 'function') {
      return internalOption._getHostElement();
    }

    return internalOption._element?.nativeElement ?? null;
  }

  private isEventFromFilterInput(event: KeyboardEvent): boolean {
    const target = event.target as HTMLElement | null;
    if (!target) {
      return false;
    }

    return !!target.closest('.lux-select-panel-filter, .lux-select-panel-filter-input');
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
  _handleKeydown?(event: KeyboardEvent): void;
  _scrollOptionIntoView?(index: number): void;
  _elementRef?: ElementRef<HTMLElement>;
}

interface MatOptionInternal {
  _getHostElement?(): HTMLElement;
  _element?: ElementRef<HTMLElement>;
  _selectViaInteraction?(): void;
}

type CloseIntent = 'default' | 'native-tab' | 'manual-tab-forward' | 'manual-tab-backward';
