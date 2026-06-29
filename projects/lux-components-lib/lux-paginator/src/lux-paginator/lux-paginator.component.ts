import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  effect,
  inject,
  input,
  model,
  output,
  Signal,
  signal,
  viewChild
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  MAT_PAGINATOR_DEFAULT_OPTIONS,
  MatPaginator,
  MatPaginatorDefaultOptions,
  MatPaginatorIntl,
  MatPaginatorModule,
  PageEvent
} from '@angular/material/paginator';
import { LuxPaginatorIntl } from './lux-paginator-intl';
import { LuxPageEvent, LuxRangeLabelFn } from './lux-paginator-model/lux-page-event';

const customPaginatorOptions: MatPaginatorDefaultOptions = {
  formFieldAppearance: 'fill'
};

@Component({
  selector: 'lux-paginator',
  templateUrl: './lux-paginator.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatPaginatorModule],
  providers: [
    { provide: MatPaginatorIntl, useClass: LuxPaginatorIntl },
    { provide: MAT_PAGINATOR_DEFAULT_OPTIONS, useValue: customPaginatorOptions }
  ],
  host: {
    class: 'lux-flex lux-flex-auto lux-justify-end'
  }
})
export class LuxPaginatorComponent {
  private readonly intlLabelKeys = ['itemsPerPageLabel', 'nextPageLabel', 'previousPageLabel', 'firstPageLabel', 'lastPageLabel'] as const;

  private readonly defaultIntlLabels: Record<(typeof this.intlLabelKeys)[number], string> = {
    itemsPerPageLabel: '',
    nextPageLabel: '',
    previousPageLabel: '',
    firstPageLabel: '',
    lastPageLabel: ''
  };

  private internalIntlChange = false;
  private defaultRangeLabel: LuxRangeLabelFn = () => '';

  private readonly matPaginator = viewChild(MatPaginator);
  private readonly paginatorIntl = inject(MatPaginatorIntl);
  private readonly destroyRef = inject(DestroyRef);

  readonly luxLength = input(0);
  readonly luxPageSize = input(50);
  readonly luxPageSizeOptions = input<number[]>([10, 25, 50, 100]);
  readonly luxPageIndex = model(0);
  readonly luxShowFirstLastButtons = input(true);
  readonly luxHidePageSize = input(false);
  readonly luxDisabled = input(false);
  readonly luxNoWrap = input(false);
  readonly luxDense = input(true);
  readonly luxItemsPerPageLabel = input<string | undefined>(undefined);
  readonly luxNextPageLabel = input<string | undefined>(undefined);
  readonly luxPreviousPageLabel = input<string | undefined>(undefined);
  readonly luxFirstPageLabel = input<string | undefined>(undefined);
  readonly luxLastPageLabel = input<string | undefined>(undefined);
  readonly luxGetRangeLabel = input<LuxRangeLabelFn | undefined>(undefined);
  readonly luxPageChange = output<LuxPageEvent>();

  private readonly _luxInitialized = signal(false);
  readonly luxInitialized: Signal<boolean> = this._luxInitialized.asReadonly();

  constructor() {
    afterNextRender(() => {
      this._luxInitialized.set(true);
    });

    this.captureDefaultIntlLabels();

    effect(() => {
      if (!this.matPaginator()) return;

      this.applyIntlLabelOverrides();
    });

    this.paginatorIntl.changes.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
      if (this.internalIntlChange) {
        this.internalIntlChange = false;
        return;
      }

      this.captureDefaultIntlLabels();
      this.applyIntlLabelOverrides();
    });
  }

  onPageChange(event: PageEvent): void {
    this.luxPageIndex.set(event.pageIndex);

    const luxEvent: LuxPageEvent = {
      pageIndex: event.pageIndex,
      previousPageIndex: event.previousPageIndex,
      pageSize: event.pageSize,
      length: event.length
    };
    this.luxPageChange.emit(luxEvent);
  }

  firstPage(): void {
    this.matPaginator()?.firstPage();
  }

  lastPage(): void {
    this.matPaginator()?.lastPage();
  }

  nextPage(): void {
    this.matPaginator()?.nextPage();
  }

  previousPage(): void {
    this.matPaginator()?.previousPage();
  }

  getNumberOfPages(): number {
    return this.matPaginator()?.getNumberOfPages() ?? 0;
  }

  hasNextPage(): boolean {
    return this.matPaginator()?.hasNextPage() ?? false;
  }

  hasPreviousPage(): boolean {
    return this.matPaginator()?.hasPreviousPage() ?? false;
  }

  getMatPaginator(): MatPaginator | undefined {
    return this.matPaginator();
  }

  private captureDefaultIntlLabels(): void {
    for (const key of this.intlLabelKeys) {
      this.defaultIntlLabels[key] = this.paginatorIntl[key] as string;
    }

    this.defaultRangeLabel = this.paginatorIntl.getRangeLabel;
  }

  private applyIntlLabelOverrides(): void {
    let changed = false;

    changed = this.updateIntlLabel(this.luxItemsPerPageLabel(), 'itemsPerPageLabel') || changed;
    changed = this.updateIntlLabel(this.luxNextPageLabel(), 'nextPageLabel') || changed;
    changed = this.updateIntlLabel(this.luxPreviousPageLabel(), 'previousPageLabel') || changed;
    changed = this.updateIntlLabel(this.luxFirstPageLabel(), 'firstPageLabel') || changed;
    changed = this.updateIntlLabel(this.luxLastPageLabel(), 'lastPageLabel') || changed;
    changed = this.updateIntlRangeLabel(this.luxGetRangeLabel()) || changed;

    if (changed) {
      this.internalIntlChange = true;
      this.paginatorIntl.changes.next();
    }
  }

  private updateIntlLabel(label: string | undefined, key: (typeof this.intlLabelKeys)[number]): boolean {
    const targetLabel = label === undefined ? this.defaultIntlLabels[key] : label;

    if (this.paginatorIntl[key] === targetLabel) {
      return false;
    }

    this.paginatorIntl[key] = targetLabel;
    return true;
  }

  private updateIntlRangeLabel(rangeLabel: LuxRangeLabelFn | undefined): boolean {
    const targetRangeLabel = rangeLabel ?? this.defaultRangeLabel;

    if (this.paginatorIntl.getRangeLabel === targetRangeLabel) {
      return false;
    }

    this.paginatorIntl.getRangeLabel = targetRangeLabel;
    return true;
  }
}
