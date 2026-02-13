import { ElementRef } from '@angular/core';
import { MatSelect } from '@angular/material/select';

export class LuxSelectFilterHelper {
  filterValue = '';
  private filterFocusTimeout?: ReturnType<typeof setTimeout>;

  clearFilter(): void {
    if (this.filterValue.length > 0) {
      this.filterValue = '';
    }
  }

  isFilterActive(): boolean {
    return this.filterValue.trim().length > 0;
  }

  focusFilterInput(elementRef?: ElementRef<HTMLInputElement>): void {
    this.clearFocusTimeout();
    this.filterFocusTimeout = setTimeout(() => {
      elementRef?.nativeElement.focus();
      elementRef?.nativeElement.select();
    });
  }

  clearFocus(): void {
    this.clearFocusTimeout();
  }

  handleFilterKeydown(event: KeyboardEvent, matSelect?: MatSelect): void {
    if (!matSelect?.panelOpen) {
      return;
    }

    if (event.key === 'Escape') {
      event.preventDefault();
      event.stopPropagation();
      matSelect.close();
      return;
    }

    if (event.key === 'ArrowDown' || event.key === 'ArrowUp' || event.key === 'Enter') {
      event.preventDefault();
      event.stopPropagation();
      (matSelect as any)?._handleKeydown(event);
    }
  }

  matchesFilter(label: string, filterValue = this.filterValue): boolean {
    const normalizedLabel = this.normalizeValue(label);
    const normalizedFilter = this.normalizeValue(filterValue).trim();

    if (normalizedFilter.length === 0) {
      return true;
    }

    return normalizedLabel.includes(normalizedFilter);
  }

  buildFilteredIndexSet<T>(options: readonly T[], labelFn: (option: T, index: number) => string, filterValue = this.filterValue): Set<number> {
    const filteredIndexes = new Set<number>();
    const normalizedFilter = this.normalizeValue(filterValue).trim();

    if (normalizedFilter.length === 0) {
      for (let i = 0; i < options.length; i++) {
        filteredIndexes.add(i);
      }
      return filteredIndexes;
    }

    for (let i = 0; i < options.length; i++) {
      if (this.matchesFilter(labelFn(options[i], i), normalizedFilter)) {
        filteredIndexes.add(i);
      }
    }

    return filteredIndexes;
  }

  handleWrapperClick(matSelect: MatSelect | undefined, luxDisabled: boolean | undefined, luxReadonly: boolean | undefined): void {
    if (luxDisabled || luxReadonly || !matSelect) {
      return;
    }

    try {
      matSelect.focus();
    } catch {
      // Ignore focus errors from underlying control.
    }

    if (!matSelect.panelOpen) {
      matSelect.open();
    }
  }

  private clearFocusTimeout(): void {
    if (this.filterFocusTimeout) {
      clearTimeout(this.filterFocusTimeout);
      this.filterFocusTimeout = undefined;
    }
  }

  private normalizeValue(value: unknown): string {
    return ('' + (value ?? '')).toLocaleLowerCase();
  }
}
