import { computed, DestroyRef, Injector, Signal, signal, WritableSignal } from '@angular/core';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { catchError, distinctUntilChanged, EMPTY, finalize, merge, Observable, skip, Subject, switchMap, take, tap } from 'rxjs';
import { ILuxListSelectHttpDao } from './lux-list-select-model/lux-list-select-http-dao.interface';

export interface LuxListSelectDataSourceConfig<T> {
  httpDao: Signal<ILuxListSelectHttpDao<T> | undefined>;
  pageSize: Signal<number>;
  pageIndex: WritableSignal<number>;
  showPagination: Signal<boolean>;
  infiniteScroll: Signal<boolean>;
  searchValue: Signal<string>;
  debouncedSearch: Signal<string>;
  debouncedSearch$: Observable<string>;
}

/**
 * Seiten- und Ladezustand von lux-list-select: setzt den Seitenindex bei Suche/Seitengrößenwechsel
 * zurück und lädt im Server-Modus (DAO gesetzt) die passenden Seiten. Hält Items, Gesamtzähler und
 * Ladezustand als Signale.
 */
export class LuxListSelectDataSource<T> {
  // switchMap verwirft veraltete Requests, catchError im inneren Stream hält den Trigger-Stream bei Fehlern am Leben.
  private readonly loadTrigger$ = new Subject<{ page: number; filter: string; append: boolean }>();

  private readonly loadingSignal = signal(false);
  private readonly daoItemsSignal = signal<T[]>([]);
  private readonly daoTotalCountSignal = signal(0);

  readonly loading = this.loadingSignal.asReadonly();
  readonly daoItems = this.daoItemsSignal.asReadonly();
  readonly daoTotalCount = this.daoTotalCountSignal.asReadonly();

  // Zuletzt angeforderte Seite: verhindert, dass die pageIndex-Subscription einen bereits ausgelösten Load wiederholt.
  private lastRequestedPage: number | null = null;
  private readonly destroyRef: DestroyRef;

  constructor(
    private readonly config: LuxListSelectDataSourceConfig<T>,
    private readonly injector: Injector
  ) {
    this.destroyRef = injector.get(DestroyRef);

    this.loadTrigger$
      .pipe(
        switchMap((trigger) => {
          const dao = this.config.httpDao();
          if (!dao) {
            return EMPTY;
          }
          this.loadingSignal.set(true);
          return dao.loadData({ page: trigger.page, pageSize: this.config.pageSize(), filter: trigger.filter }).pipe(
            tap((result) => {
              this.daoItemsSignal.update((current) => (trigger.append ? [...current, ...result.items] : result.items));
              this.daoTotalCountSignal.set(result.totalCount);
            }),
            catchError((error) => {
              console.error('lux-list-select: Fehler beim Laden der DAO-Daten.', error);
              return EMPTY;
            }),
            finalize(() => this.loadingSignal.set(false))
          );
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe();

    this.resetPageOnSearch();
    this.resetPageOnPageSizeChange();
    // Reihenfolge ist relevant: der DAO-Load merkt sich seine Seite, bevor die pageIndex-Subscription im selben Zyklus prüft.
    this.loadOnDaoChange();
    this.loadOnPageIndexChange();
  }

  /** Seitenwechsel über den Paginator. */
  loadPage(page: number): void {
    if (this.config.httpDao()) {
      this.triggerLoad(page, this.config.debouncedSearch());
    }
  }

  /** Infinite Scroll: hängt die nächste Seite an, solange noch nicht alles geladen ist. */
  loadNextPage(): void {
    if (this.config.httpDao() && !this.loading() && this.daoItems().length < this.daoTotalCount()) {
      const page = Math.floor(this.daoItems().length / this.config.pageSize());
      this.loadTrigger$.next({ page, filter: this.config.debouncedSearch(), append: true });
    }
  }

  private triggerLoad(page: number, filter: string): void {
    this.lastRequestedPage = page;
    this.loadTrigger$.next({ page, filter, append: false });
  }

  private resetPageOnSearch(): void {
    // skip(1) verwirft den Startwert samt entprelltem Nachzügler: ein vorbelegter Suchwert löst keinen zweiten Load aus.
    merge(toObservable(this.config.searchValue, { injector: this.injector }).pipe(take(1)), this.config.debouncedSearch$)
      .pipe(distinctUntilChanged(), skip(1), takeUntilDestroyed(this.destroyRef))
      .subscribe((search) => {
        this.config.pageIndex.set(0);
        if (this.config.httpDao()) {
          this.triggerLoad(0, search);
        }
      });
  }

  private resetPageOnPageSizeChange(): void {
    // Die Baseline zählt erst, wenn die Seitengröße überhaupt wirkt, sonst gilt eine vorbelegte Erstkonfiguration als Wechsel.
    let baseline: number | null = null;
    // Wechseln DAO und Seitengröße gleichzeitig, lädt bereits loadOnDaoChange neu.
    let lastSeenDao = this.config.httpDao();
    toObservable(
      computed(() => ({
        pageSize: this.config.pageSize(),
        dao: this.config.httpDao(),
        relevant: !!this.config.httpDao() || this.config.showPagination() || this.config.infiniteScroll()
      })),
      { injector: this.injector }
    )
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(({ pageSize, dao, relevant }) => {
        const daoChanged = dao !== lastSeenDao;
        lastSeenDao = dao;
        if (!relevant) {
          return;
        }
        if (baseline === null || pageSize === baseline) {
          baseline = pageSize;
          return;
        }
        baseline = pageSize;
        this.config.pageIndex.set(0);
        if (dao && !daoChanged) {
          this.daoItemsSignal.set([]);
          this.triggerLoad(0, this.config.debouncedSearch());
        }
      });
  }

  private loadOnDaoChange(): void {
    let isInitialDao = true;
    toObservable(this.config.httpDao, { injector: this.injector })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((dao) => {
        // Ein beim Start gesetzter DAO respektiert einen vorbelegten luxPageIndex, jeder spätere DAO-Wechsel beginnt bei Seite 0.
        const keepPage = isInitialDao && this.config.showPagination();
        isInitialDao = false;
        if (!dao) {
          return;
        }
        this.daoItemsSignal.set([]);
        if (!keepPage) {
          this.config.pageIndex.set(0);
        }
        this.triggerLoad(this.config.pageIndex(), this.config.searchValue());
      });
  }

  private loadOnPageIndexChange(): void {
    toObservable(computed(() => ({ page: this.config.pageIndex(), dao: this.config.httpDao() })), { injector: this.injector })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(({ page, dao }) => {
        if (dao && page !== this.lastRequestedPage) {
          this.triggerLoad(page, this.config.debouncedSearch());
        }
      });
  }
}
