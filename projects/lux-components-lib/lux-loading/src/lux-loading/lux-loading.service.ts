import { LiveAnnouncer } from '@angular/cdk/a11y';
import { computed, effect, inject, Injectable, signal, WritableSignal } from '@angular/core';
import { TranslocoService } from '@jsverse/transloco';
import { defer, finalize, MonoTypeOperatorFunction } from 'rxjs';

/**
 * Zentrale Zustandsquelle für den globalen Ladezustand einer Seite (Pattern "Global Blocking State").
 *
 * Vorgänge werden in zwei Stufen erfasst:
 * - Blockierend (`block()`/`trackBlocking()`): Die Seite gilt als gesperrt (`isLoading`).
 *   Der Leave-Guard (`luxLeaveGuard`, `LuxLeaveGuardBase`) hängt an diesem Zustand; Übergänge
 *   werden per LiveAnnouncer für Screenreader angesagt.
 * - Anzeigend (`busy()`/`trackBusy()`): Nur der Fortschrittsindikator läuft (`isBusy`),
 *   die Seite bleibt bedienbar. Für überschreibbare Vorgänge wie Filter-Requests.
 */
@Injectable({ providedIn: 'root' })
export class LuxLoadingService {
  /** True, solange mindestens ein blockierender Vorgang läuft. */
  readonly isLoading = computed(() => this.blockingCount() > 0);

  /** True, solange irgendein Vorgang läuft (blockierend oder anzeigend). */
  readonly isBusy = computed(() => this.blockingCount() > 0 || this.indicatingCount() > 0);

  private readonly liveAnnouncer = inject(LiveAnnouncer);
  private readonly tService = inject(TranslocoService);
  private readonly blockingCount = signal(0);
  private readonly indicatingCount = signal(0);

  constructor() {
    let wasLoading = false;
    effect(() => {
      const loading = this.isLoading();
      if (loading) {
        this.announce('luxc.loading.busy');
      } else if (wasLoading) {
        this.announce('luxc.loading.done');
      }
      wasLoading = loading;
    });
  }

  /**
   * Markiert den Start eines blockierenden Vorgangs.
   * Liefert eine idempotente Release-Funktion, die den Vorgang beendet.
   */
  block(): () => void {
    return this.acquire(this.blockingCount);
  }

  /**
   * Markiert den Start eines rein anzeigenden Vorgangs: Der Fortschrittsindikator läuft,
   * die Seite bleibt bedienbar. Liefert eine idempotente Release-Funktion.
   */
  busy(): () => void {
    return this.acquire(this.indicatingCount);
  }

  /**
   * RxJS-Operator, der ein Observable (z. B. einen HTTP-Request) als blockierenden Vorgang markiert.
   * Die Freigabe erfolgt garantiert bei Complete, Error und Unsubscribe.
   *
   * @example
   * this.api.save(dto).pipe(this.loading.trackBlocking()).subscribe();
   */
  trackBlocking<T>(): MonoTypeOperatorFunction<T> {
    return this.trackWith(() => this.block());
  }

  /**
   * RxJS-Operator, der ein Observable als rein anzeigenden Vorgang markiert.
   * Geeignet für überschreibbare Requests, z. B. Filtern mit `switchMap`:
   * Das Unsubscribe des überholten Requests gibt dessen Anteil automatisch frei.
   *
   * @example
   * trigger$.pipe(switchMap((f) => this.api.search(f).pipe(this.loading.trackBusy())))
   */
  trackBusy<T>(): MonoTypeOperatorFunction<T> {
    return this.trackWith(() => this.busy());
  }

  /** Erhöht den Zähler blockierender Vorgänge (Fassade über block() für einfache Fälle). */
  show(): void {
    this.blockingCount.update((count) => count + 1);
  }

  /** Beendet einen mit show() gestarteten Vorgang. */
  hide(): void {
    this.blockingCount.update((count) => Math.max(0, count - 1));
  }

  private acquire(counter: WritableSignal<number>): () => void {
    counter.update((count) => count + 1);
    let released = false;
    return () => {
      if (!released) {
        released = true;
        counter.update((count) => Math.max(0, count - 1));
      }
    };
  }

  private trackWith<T>(acquire: () => () => void): MonoTypeOperatorFunction<T> {
    return (source) =>
      defer(() => {
        const release = acquire();
        return source.pipe(finalize(release));
      });
  }

  private announce(key: string): void {
    this.liveAnnouncer.announce(this.tService.translate(key), 'polite');
  }
}
