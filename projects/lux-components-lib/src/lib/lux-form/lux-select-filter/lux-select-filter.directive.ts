import { DestroyRef, Directive, ElementRef, EventEmitter, inject, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatSelect } from '@angular/material/select';
import { handleSelectFilterKeyboard } from './lux-select-filter-keyboard';
import { LuxSelectFilterFocusController, ManualTabIntent } from './lux-select-filter-focus';
import { LuxSelectFilterNavigator, MatSelectInternal } from './lux-select-filter-navigator';
import { LuxSelectFilterState } from './lux-select-filter-state';
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
  private readonly filterState = new LuxSelectFilterState<T>(() => this.luxSelectFilter, () => this.luxFilterLabelFn);
  private readonly focusController = new LuxSelectFilterFocusController();
  private readonly navigator = new LuxSelectFilterNavigator(this.matSelect, this.internalSelect, (panel) => this.getFilterHeight(panel));
  private panelElement?: HTMLElement;
  private lastPanelElement?: HTMLElement;

  private readonly panelKeydownHandler = (event: KeyboardEvent) => this.handleOptionKeydown(event);
  private readonly documentPointerdownHandler = (event: PointerEvent) => this.handleDocumentPointerdown(event);
  private readonly panelClickHandler = (event: MouseEvent) => this.handlePanelClick(event);

  @Input() luxSelectFilter = false;
  @Input() luxFilterLabelFn?: (item: T, index: number) => string;
  @Output() luxFilterActiveChange = new EventEmitter<boolean>();
  filterInputRef?: ElementRef<HTMLInputElement>;

  get filterValue(): string {
    return this.filterState.filterValue;
  }

  set filterValue(value: string) {
    this.filterState.filterValue = value;
  }

  get filteredItems(): Set<T> {
    return this.filterState.filteredItems;
  }

  get filteredIndexes(): Set<number> {
    return this.filterState.filteredIndexes;
  }

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
    this.filterState.setItems(items);
  }

  onFilterInput(value: string): void {
    if (this.filterState.setFilterValue(value)) {
      this.luxFilterActiveChange.emit(this.filterState.isFilterActive());
    }

    this.navigator.syncActiveItemToVisibleOptions();
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
    return this.filterState.isItemVisible(item);
  }

  isIndexVisible(index: number): boolean {
    return this.filterState.isIndexVisible(index);
  }

  isFilterActive(): boolean {
    return this.filterState.isFilterActive();
  }

  isOptionFocused(): boolean {
    return this.navigator.isOptionFocused(this.panelElement);
  }

  private onPanelOpen(): void {
    if (!this.luxSelectFilter) {
      return;
    }

    this.focusController.reset();
    this.clearTimer('focusRestore');
    this.clearTimer('tabNavigation');
    this.filterState.refresh();
    this.navigator.syncActiveItemToVisibleOptions();
    this.registerPanelKeydownListener();
    this.focusFilterInput();
  }

  private onPanelClose(): void {
    if (!this.luxSelectFilter) {
      return;
    }

    this.removePanelKeydownListener();
    this.removeDocumentPointerdownListener();
    this.navigator.clearPanelFilterOffset(this.matSelect.panel?.nativeElement as HTMLElement | undefined);
    if (this.filterState.clear()) {
      this.luxFilterActiveChange.emit(false);
    }

    const closeAction = this.focusController.consumeCloseAction();
    if (closeAction === 'manual-tab-forward' || closeAction === 'manual-tab-backward') {
      this.scheduleManualTabNavigation(closeAction);
      return;
    }

    if (closeAction === 'preserve-external-focus') {
      return;
    }

    this.restoreTriggerFocusIfNeeded();
  }

  private focusFilterInput(): void {
    this.setTimer('focusInput', () => {
      const input = this.filterInputRef?.nativeElement;
      if (!this.matSelect.panelOpen || !input) {
        return;
      }

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

    this.runAfterPanelAttached((panel) => {
      this.panelElement = panel;
      this.lastPanelElement = panel;
      this.navigator.updatePanelFilterOffset(panel);
      panel.addEventListener('keydown', this.panelKeydownHandler, true);
      panel.addEventListener('click', this.panelClickHandler, true);
      document.addEventListener('pointerdown', this.documentPointerdownHandler, true);
    });
  }

  private runAfterPanelAttached(callback: (panel: HTMLElement) => void): void {
    const tryAttach = () => {
      if (!this.matSelect.panelOpen) return;

      const panel = this.matSelect.panel?.nativeElement as HTMLElement | undefined;
      if (!panel) {
        this.setTimer('panelAttach', tryAttach);
        return;
      }

      callback(panel);
    };

    tryAttach();
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
    const outcome = handleSelectFilterKeyboard(event, source, {
      isPanelOpen: () => this.matSelect.panelOpen,
      isEventFromFilterInput: (keyboardEvent) => this.isEventFromFilterInput(keyboardEvent),
      isListNavigationModifierAllowed: (keyboardEvent) => this.isListNavigationModifierAllowed(keyboardEvent),
      moveActiveVisibleOption: (step) => this.navigator.moveActiveVisibleOption(step),
      moveActiveVisibleOptionByPage: (direction) => this.navigator.moveActiveVisibleOptionByPage(direction),
      moveToVisibleBoundary: (boundary) => this.navigator.moveToVisibleBoundary(boundary),
      selectActiveOrFirstVisibleOption: () => this.navigator.selectActiveOrFirstVisibleOption(() => this.focusFilterInput())
    });

    if (outcome === 'manual-tab-forward' || outcome === 'manual-tab-backward') {
      this.focusController.queueManualTabNavigation(outcome === 'manual-tab-backward');
      this.matSelect.close();
      return true;
    }

    if (outcome === 'preserve-external-focus') {
      this.focusController.preserveExternalFocus();
      return false;
    }

    return outcome === 'handled';
  }

  private restoreTriggerFocusIfNeeded(): void {
    this.setTimer('focusRestore', () => {
      const selectHost = this.getSelectHostElement();
      if (!this.focusController.shouldRestoreTriggerFocus(document.activeElement, selectHost, this.lastPanelElement)) {
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
    if (activeElement instanceof HTMLElement && activeElement !== document.body && activeElement !== document.documentElement) {
      return activeElement;
    }

    const selectHost = this.getSelectHostElement();
    if (!selectHost) return undefined;

    const focusTarget = selectHost.querySelector<HTMLElement>('[tabindex], button, a[href], input, select, textarea');
    return focusTarget ?? selectHost;
  }

  private isEventFromFilterInput(event: KeyboardEvent): boolean {
    const target = event.target as HTMLElement | null;
    return !!target?.closest('.lux-select-panel-filter, .lux-select-panel-filter-input');
  }

  private isListNavigationModifierAllowed(event: KeyboardEvent): boolean {
    return !event.altKey && !event.ctrlKey && !event.metaKey;
  }

  private handleDocumentPointerdown(event: PointerEvent): void {
    this.focusController.handleDocumentPointerdown(event.target, this.getSelectHostElement(), this.panelElement);
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

type TimerKey = 'focusInput' | 'focusRestore' | 'tabNavigation' | 'panelAttach';
type TimeoutMap = Partial<Record<TimerKey, ReturnType<typeof setTimeout>>>;
