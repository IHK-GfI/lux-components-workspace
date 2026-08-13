import { ChangeDetectionStrategy, Component, computed, effect, model, untracked } from '@angular/core';
import {
  LuxCardComponent,
  LuxCardContentComponent,
  LuxInputAcComponent,
  LuxSelectAcComponent,
  LuxToggleAcComponent
} from '@ihk-gfi/lux-components';
import { LuxPageEvent, LuxPaginatorComponent, LuxRangeLabelFn } from '@ihk-gfi/lux-components/lux-paginator';
import { ExampleBaseContentComponent } from '../../example-base/example-base-root/example-base-subcomponents/example-base-content/example-base-content.component';
import { ExampleBaseAdvancedOptionsComponent } from '../../example-base/example-base-root/example-base-subcomponents/example-base-options/example-base-advanced-options.component';
import { ExampleBaseSimpleOptionsComponent } from '../../example-base/example-base-root/example-base-subcomponents/example-base-options/example-base-simple-options.component';
import { ExampleBaseStructureComponent } from '../../example-base/example-base-root/example-base-subcomponents/example-base-structure/example-base-structure.component';
import { logResult } from '../../example-base/example-base-util/example-base-helper';

@Component({
  selector: 'app-paginator-example',
  templateUrl: './paginator-example.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    LuxPaginatorComponent,
    LuxCardComponent,
    LuxCardContentComponent,
    ExampleBaseStructureComponent,
    ExampleBaseContentComponent,
    ExampleBaseSimpleOptionsComponent,
    LuxToggleAcComponent,
    LuxInputAcComponent,
    LuxSelectAcComponent,
    ExampleBaseAdvancedOptionsComponent
  ]
})
export class PaginatorExampleComponent {
  log = logResult;

  private readonly loremIpsumText = 'Lorem ipsum...';
  private readonly loremContent = Array.from({ length: 100 }, (_, i) => `(Item ${i + 1}): ${this.loremIpsumText}`);
  protected readonly rangeLabelOptions = [
    { label: 'Standard', value: 'default' as const },
    { label: 'Kurz', value: 'compact' as const },
    { label: 'Ausführlich', value: 'detailed' as const }
  ];
  private readonly pageSizeOptionValues = [
    { label: '[5, 10, 25, 50]', value: [5, 10, 25, 50] },
    { label: '[10, 20, 30, 40]', value: [10, 20, 30, 40] },
    { label: '[25, 50, 75, 100, 200]', value: [25, 50, 75, 100, 200] }
  ];

  // Paginator State
  pageIndex = model(0);
  pageSize = model(5);
  pageSizeOptions = model(this.pageSizeOptionValues);
  selectedPageSizeOption = model(this.pageSizeOptionValues[0].value);
  showFirstLastButtons = model(true);
  hidePageSize = model(false);
  disabled = model(false);
  denseFormat = model(true);
  selectedRangeLabelOption = model(this.rangeLabelOptions[0].value);
  noWrap = model(false);
  itemsPerPageLabel = model('');
  nextPageLabel = model('');
  previousPageLabel = model('');
  firstPageLabel = model('');
  lastPageLabel = model('');

  showOutputEvents = model(false);

  // Computed Signals
  length = computed(() => this.loremContent.length);
  maxPageIndex = computed(() => this.calculateMaxPageIndex());
  visibleItems = computed(() => this.getVisibleItems(this.loremContent, this.pageIndex(), this.pageSize()));
  rangeLabel = computed<LuxRangeLabelFn | undefined>(() => this.resolveRangeLabel(this.selectedRangeLabelOption()));

  private lastSelectedPageSizeOptions: number[] | null = null;

  constructor() {
    this.setupPageSizeOptionsEffect();
    this.setupPageIndexClampingEffect();
  }

  onPageChange(event: LuxPageEvent): void {
    this.pageIndex.set(event.pageIndex);
    this.pageSize.set(event.pageSize);
    this.log(this.showOutputEvents(), 'Pagination changed', event);
  }

  toOptionalLabel(label: string | null | undefined): string | undefined {
    return label && label !== '' ? label : undefined;
  }

  // ============================================================================
  // Effects
  // ============================================================================

  private setupPageSizeOptionsEffect(): void {
    effect(() => {
      const selectedOptions = this.selectedPageSizeOption();
      const optionsChanged = selectedOptions !== this.lastSelectedPageSizeOptions;

      if (!optionsChanged) {
        return;
      }

      this.lastSelectedPageSizeOptions = selectedOptions ?? null;
      const firstOption = selectedOptions?.[0];

      if (typeof firstOption === 'number' && untracked(() => this.pageSize()) !== firstOption) {
        this.pageSize.set(firstOption);
      }
    });
  }

  private setupPageIndexClampingEffect(): void {
    effect(() => {
      const clampedPageIndex = this.clampPageIndex(this.pageIndex());

      if (clampedPageIndex !== this.pageIndex()) {
        this.pageIndex.set(clampedPageIndex);
      }
    });
  }

  // ============================================================================
  // Private
  // ============================================================================

  private calculateMaxPageIndex(): number {
    const pageSize = this.pageSize();

    if (pageSize <= 0) {
      return 0;
    }

    return Math.max(0, Math.ceil(this.length() / pageSize) - 1);
  }

  private clampPageIndex(pageIndex: number): number {
    if (!Number.isFinite(pageIndex)) {
      return 0;
    }

    return Math.min(this.maxPageIndex(), Math.max(0, Math.trunc(pageIndex)));
  }

  private getVisibleItems(content: string[], pageIndex: number, pageSize: number): string[] {
    const start = pageIndex * pageSize;
    const end = start + pageSize;

    return content.slice(start, end);
  }

  private resolveRangeLabel(selectedOption: string): LuxRangeLabelFn | undefined {
    switch (selectedOption) {
      case 'compact':
        return (page, pageSize, length) => this.formatCompactRangeLabel(page, pageSize, length);
      case 'detailed':
        return (page, pageSize, length) => this.formatDetailedRangeLabel(page, pageSize, length);
      default:
        return undefined;
    }
  }

  private formatCompactRangeLabel(page: number, pageSize: number, length: number): string {
    const range = this.getRangeState(page, pageSize, length);

    return range.totalPages === 0 ? '0 / 0' : `${range.start}-${range.end} / ${length}`;
  }

  private formatDetailedRangeLabel(page: number, pageSize: number, length: number): string {
    const range = this.getRangeState(page, pageSize, length);

    return range.totalPages === 0 ? 'Keine Einträge' : `Elemente ${range.start} bis ${range.end} von ${length}`;
  }

  private getRangeState(
    page: number,
    pageSize: number,
    length: number
  ): {
    start: number;
    end: number;
    currentPage: number;
    totalPages: number;
  } {
    const safeLength = Math.max(0, length);
    const safePageSize = Math.max(0, pageSize);

    if (safeLength === 0 || safePageSize === 0) {
      return {
        start: 0,
        end: 0,
        currentPage: 0,
        totalPages: 0
      };
    }

    const totalPages = Math.ceil(safeLength / safePageSize);
    const safePage = Math.min(Math.max(0, page), totalPages - 1);
    const start = safePage * safePageSize + 1;
    const end = Math.min(start + safePageSize - 1, safeLength);

    return {
      start,
      end,
      currentPage: safePage + 1,
      totalPages
    };
  }
}
