import { ElementRef } from '@angular/core';
import { MatOption } from '@angular/material/core';
import { MatSelect } from '@angular/material/select';
import { VisibleBoundary } from './lux-select-filter-keyboard';

const PAGE_NAVIGATION_DELTA = 10;

export class LuxSelectFilterNavigator {
  constructor(
    private readonly matSelect: MatSelect,
    private readonly internalSelect: MatSelectInternal,
    private readonly getFilterHeight: (panel: HTMLElement) => number
  ) {}

  syncActiveItemToVisibleOptions(): void {
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

    this.activateVisibleOptionByPosition(keyManager, visibleOptionIndexes, 0);
  }

  moveActiveVisibleOption(step: 1 | -1): void {
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
    const nextVisiblePos = currentVisiblePos < 0 ? (step === 1 ? 0 : visibleOptionIndexes.length - 1) : clampVisiblePosition(currentVisiblePos + step, visibleOptionIndexes.length);

    this.activateVisibleOptionByPosition(keyManager, visibleOptionIndexes, nextVisiblePos);
  }

  moveActiveVisibleOptionByPage(direction: 1 | -1): void {
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
    const targetVisiblePos =
      currentVisiblePos < 0
        ? clampVisiblePosition(direction === 1 ? PAGE_NAVIGATION_DELTA - 1 : 0, visibleOptionIndexes.length)
        : clampVisiblePosition(currentVisiblePos + direction * PAGE_NAVIGATION_DELTA, visibleOptionIndexes.length);

    this.activateVisibleOptionByPosition(keyManager, visibleOptionIndexes, targetVisiblePos);
  }

  moveToVisibleBoundary(boundary: VisibleBoundary): void {
    const keyManager = this.getInternalKeyManager();
    if (!keyManager) {
      return;
    }

    const visibleOptionIndexes = this.getVisibleOptionIndexes();
    if (visibleOptionIndexes.length === 0) {
      return;
    }

    this.activateVisibleOptionByPosition(keyManager, visibleOptionIndexes, boundary === 'start' ? 0 : visibleOptionIndexes.length - 1);
  }

  selectActiveOrFirstVisibleOption(onContinueFiltering: () => void): void {
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

    onContinueFiltering();
  }

  updatePanelFilterOffset(panel: HTMLElement): void {
    panel.style.setProperty('--lux-select-filter-offset', `${this.getFilterHeight(panel)}px`);
  }

  clearPanelFilterOffset(panel?: HTMLElement): void {
    panel?.style.removeProperty('--lux-select-filter-offset');
  }

  private activateVisibleOptionByPosition(
    keyManager: InternalKeyManager,
    visibleOptionIndexes: number[],
    targetVisiblePos: number
  ): void {
    const targetIndex = visibleOptionIndexes[clampVisiblePosition(targetVisiblePos, visibleOptionIndexes.length)];
    keyManager.setActiveItem(targetIndex);
    this.scrollOptionIntoView(targetIndex);
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
    if (!hostElement) {
      return true;
    }

    if (hostElement.style.display === 'none' || hostElement.style.visibility === 'hidden') {
      return false;
    }

    const style = window.getComputedStyle(hostElement);
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

  private scrollOptionIntoView(index: number): void {
    const panel = this.matSelect.panel?.nativeElement as HTMLElement | undefined;
    const option = (this.matSelect.options?.toArray?.() ?? [])[index];
    if (!panel || !option) {
      return;
    }

    const scrollFn = this.internalSelect._scrollOptionIntoView;
    if (typeof scrollFn === 'function') {
      scrollFn.call(this.matSelect, index);
    }

    this.ensureOptionVisibleBelowFilter(panel, option);
  }

  private ensureOptionVisibleBelowFilter(panel: HTMLElement, option: MatOption): void {
    const optionHost = this.getOptionHostElement(option);
    if (!optionHost) {
      return;
    }

    const filterHeight = this.getFilterHeight(panel);
    if (filterHeight <= 0) {
      return;
    }

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

  private getInternalKeyManager(): InternalKeyManager | undefined {
    return this.internalSelect._keyManager;
  }

  private getOptionHostElement(option: MatOption): HTMLElement | null {
    const internalOption = option as unknown as MatOptionInternal;
    if (typeof internalOption._getHostElement === 'function') {
      return internalOption._getHostElement();
    }

    return internalOption._element?.nativeElement ?? null;
  }
}

function clampVisiblePosition(position: number, visibleCount: number): number {
  return Math.max(0, Math.min(position, visibleCount - 1));
}

export interface InternalKeyManager {
  activeItemIndex: number;
  activeItem?: { focus?: () => void } | null;
  setActiveItem(index: number): void;
  updateActiveItem?(index: number): void;
}

export interface MatSelectInternal {
  _keyManager?: InternalKeyManager;
  _scrollOptionIntoView?(index: number): void;
  _elementRef?: ElementRef<HTMLElement>;
}

interface MatOptionInternal {
  _getHostElement?(): HTMLElement;
  _element?: ElementRef<HTMLElement>;
  _selectViaInteraction?(): void;
}
