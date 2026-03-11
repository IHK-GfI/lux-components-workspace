import { LuxSelectFilterUtils } from './lux-select-filter.utils';

export class LuxSelectFilterState<T> {
  private itemCache: T[] = [];
  private normalizedLabelCache: string[] = [];

  readonly filteredItems = new Set<T>();
  readonly filteredIndexes = new Set<number>();
  filterValue = '';

  constructor(
    private readonly isEnabled: () => boolean,
    private readonly getLabelFn: () => ((item: T, index: number) => string) | undefined
  ) {}

  setItems(items: readonly T[]): void {
    this.itemCache = [...items];
    this.refresh();
  }

  setFilterValue(value: string): boolean {
    const wasActive = this.isFilterActive();
    this.filterValue = value;
    this.applyFilter();
    return wasActive !== this.isFilterActive();
  }

  clear(): boolean {
    if (!this.filterValue) {
      return false;
    }

    this.filterValue = '';
    this.applyFilter();
    return true;
  }

  refresh(): void {
    this.rebuildCache();
    this.applyFilter();
  }

  isFilterActive(): boolean {
    return this.isEnabled() && this.filterValue.trim().length > 0;
  }

  isItemVisible(item: T): boolean {
    return !this.isFilterActive() || this.filteredItems.has(item);
  }

  isIndexVisible(index: number): boolean {
    return !this.isFilterActive() || this.filteredIndexes.has(index);
  }

  private rebuildCache(): void {
    const labelFn = this.getLabelFn();
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
}
