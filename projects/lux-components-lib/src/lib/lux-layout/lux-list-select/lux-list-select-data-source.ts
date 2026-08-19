import { DestroyRef, Injector, Signal, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { catchError, EMPTY, finalize, Subject, switchMap, tap } from 'rxjs';
import { ILuxListSelectHttpDao } from './lux-list-select-model/lux-list-select-http-dao.interface';

/**
 * DAO-Orchestrierung von lux-list-select im Server-Modus (Hausmuster lux-table-data-source):
 * lädt Seiten über den übergebenen DAO nach, hält die geladenen Items/den Gesamtzähler/den
 * Ladezustand als Signale und schützt per lastRequestedPage gegen doppelt ausgelöste Loads.
 * Die Wiring-Effects (DAO-Wechsel, Suche, pageIndex) bleiben in der Host-Komponente und rufen
 * nur triggerLoad/loadMore/reset auf.
 */
export class LuxListSelectDataSource<T> {
  // switchMap verwirft veraltete Requests (Race-Schutz), catchError im inneren Stream hält den
  // Trigger-Stream bei Fehlern am Leben.
  private readonly loadTrigger$ = new Subject<{ page: number; filter: string; append: boolean }>();

  private readonly loadingSignal = signal(false);
  private readonly daoItemsSignal = signal<T[]>([]);
  private readonly daoTotalCountSignal = signal(0);

  readonly loading = this.loadingSignal.asReadonly();
  readonly daoItems = this.daoItemsSignal.asReadonly();
  readonly daoTotalCount = this.daoTotalCountSignal.asReadonly();

  // Verhindert, dass der luxPageIndex-Effect der Host-Komponente einen Load erneut auslöst, der
  // bereits synchron durch onPageChange oder einen anderen Effect (Suche/DAO-Wechsel) angestoßen
  // wurde. Bewusst kein Signal: wird nur synchron/untracked von der Host-Komponente gelesen.
  lastRequestedPage: number | null = null;

  constructor(
    private readonly httpDao: Signal<ILuxListSelectHttpDao<T> | undefined>,
    private readonly pageSize: Signal<number>,
    injector: Injector
  ) {
    this.loadTrigger$
      .pipe(
        switchMap((trigger) => {
          const dao = this.httpDao();
          if (!dao) {
            return EMPTY;
          }
          this.loadingSignal.set(true);
          return dao.loadData({ page: trigger.page, pageSize: this.pageSize(), filter: trigger.filter }).pipe(
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
        takeUntilDestroyed(injector.get(DestroyRef))
      )
      .subscribe();
  }

  /** Einziger Ort, der einen DAO-Load anstößt; merkt sich die Seite in lastRequestedPage gegen doppelte Loads durch den luxPageIndex-Effect. */
  triggerLoad(page: number, filter: string, append: boolean): void {
    this.lastRequestedPage = page;
    this.loadTrigger$.next({ page, filter, append });
  }

  /** Lädt beim Infinite Scroll die nächste Seite nach, ohne den lastRequestedPage-Guard zu berühren (kein Paginator-Seitenwechsel). */
  loadMore(page: number, filter: string): void {
    this.loadTrigger$.next({ page, filter, append: true });
  }

  /** Leert die bereits geladenen Items, z.B. bei einem DAO-Wechsel, bevor die neue Seite 0 nachgeladen wird. */
  reset(): void {
    this.daoItemsSignal.set([]);
  }
}
