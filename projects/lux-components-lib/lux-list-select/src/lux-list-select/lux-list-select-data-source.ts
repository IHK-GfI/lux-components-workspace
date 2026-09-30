import { computed, DestroyRef, Injector, linkedSignal, Signal, signal, WritableSignal } from '@angular/core';
import { rxResource, takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { catchError, debounce, distinctUntilChanged, merge, skip, take, tap, throwError, timer } from 'rxjs';
import { ILuxListSelectHttpDao } from './lux-list-select-model/lux-list-select-http-dao.interface';

export interface LuxListSelectDataSourceConfig<T> {
  httpDao: Signal<ILuxListSelectHttpDao<T> | undefined>;
  pageSize: Signal<number>;
  pageIndex: WritableSignal<number>;
  showPagination: Signal<boolean>;
  infiniteScroll: Signal<boolean>;
  searchValue: Signal<string>;
  searchDelay: Signal<number>;
}

/**
 * Such-, Seiten- und Ladezustand von lux-list-select: entprellt die Suche, setzt den Seitenindex bei
 * Suche/Seitengrößen-/DAO-Wechsel zurück und lädt im Server-Modus (DAO gesetzt) über eine rxResource.
 */
export class LuxListSelectDataSource<T> {
  private readonly filterSignal = signal('');
  private readonly daoItemsSignal = signal<T[]>([]);
  private readonly daoTotalCountSignal = signal(0);

  /** Entprellter Suchbegriff; ein vorbelegter Startwert gilt sofort. */
  readonly filter = this.filterSignal.asReadonly();
  readonly daoItems = this.daoItemsSignal.asReadonly();
  readonly daoTotalCount = this.daoTotalCountSignal.asReadonly();
  readonly loading: Signal<boolean>;

  private readonly appendMode = computed(() => this.config.infiniteScroll() && !this.config.showPagination());

  // Nachladeseite des Infinite Scrolls; beginnt bei jedem Wechsel von DAO, Seitengröße oder Suchbegriff wieder bei 0.
  private readonly scrollPage = linkedSignal({
    source: () => ({ dao: this.config.httpDao(), pageSize: this.config.pageSize(), filter: this.filter() }),
    computation: () => 0
  });

  private readonly request = computed(() => {
    const dao = this.config.httpDao();
    if (!dao) {
      return undefined;
    }
    const page = this.appendMode() ? this.scrollPage() : this.config.pageIndex();
    return { dao, page, pageSize: this.config.pageSize(), filter: this.filter(), append: this.appendMode() && page > 0 };
  });

  constructor(
    private readonly config: LuxListSelectDataSourceConfig<T>,
    injector: Injector
  ) {
    // Die Seiten-Resets stehen vor der Resource: so laufen sie im selben Zyklus zuerst und die Resource lädt nur einmal.
    this.resetPageIndexOnChanges(injector);

    const resource = rxResource({
      params: this.request,
      stream: ({ params }) =>
        params.dao.loadData({ page: params.page, pageSize: params.pageSize, filter: params.filter }).pipe(
          tap((result) => {
            this.daoItemsSignal.update((current) => (params.append ? [...current, ...result.items] : result.items));
            this.daoTotalCountSignal.set(result.totalCount);
          }),
          catchError((error) => {
            console.error('lux-list-select: Fehler beim Laden der DAO-Daten.', error);
            return throwError(() => error);
          })
        ),
      injector
    });
    this.loading = resource.isLoading;
  }

  /** Infinite Scroll: fordert die nächste Seite an, solange noch nicht alles geladen ist. */
  loadNextPage(): void {
    if (this.config.httpDao() && !this.loading() && this.daoItems().length < this.daoTotalCount()) {
      this.scrollPage.set(Math.floor(this.daoItems().length / this.config.pageSize()));
    }
  }

  private resetPageIndexOnChanges(injector: Injector): void {
    const destroyRef = injector.get(DestroyRef);
    const searchValue$ = toObservable(this.config.searchValue, { injector });

    // Der Startwert gilt sofort und ohne Seiten-Reset, danach entprellt.
    let isStartValue = true;
    merge(searchValue$.pipe(take(1)), searchValue$.pipe(debounce(() => timer(this.config.searchDelay()))))
      .pipe(distinctUntilChanged(), takeUntilDestroyed(destroyRef))
      .subscribe((search) => {
        if (!isStartValue) {
          this.config.pageIndex.set(0);
        }
        isStartValue = false;
        this.filterSignal.set(search);
      });

    // Die Seitengröße zählt erst als Wechsel, wenn sie überhaupt wirkt (DAO, Paginierung oder Infinite Scroll aktiv).
    let pageSizeBaseline: number | null = null;
    const pageSizeState = computed(() => ({
      pageSize: this.config.pageSize(),
      relevant: !!this.config.httpDao() || this.config.showPagination() || this.config.infiniteScroll()
    }));
    toObservable(pageSizeState, { injector })
      .pipe(takeUntilDestroyed(destroyRef))
      .subscribe(({ pageSize, relevant }) => {
        if (!relevant) {
          return;
        }
        if (pageSizeBaseline !== null && pageSize !== pageSizeBaseline) {
          this.config.pageIndex.set(0);
        }
        pageSizeBaseline = pageSize;
      });

    // Ein beim Start gesetzter DAO respektiert einen vorbelegten luxPageIndex, jeder spätere DAO-Wechsel beginnt bei Seite 0.
    toObservable(this.config.httpDao, { injector })
      .pipe(skip(1), takeUntilDestroyed(destroyRef))
      .subscribe(() => this.config.pageIndex.set(0));
  }
}
