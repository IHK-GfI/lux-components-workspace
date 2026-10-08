import { computed, Injectable, signal } from '@angular/core';

/**
 * Globaler Ladezustand der Demo-App, der unter dem App-Header als Ladebalken angezeigt wird.
 *
 * Die API entspricht dem LuxLoadingService (Issue #322: busy/isBusy), damit die Beispiele
 * später ohne Umbau auf diesen umgestellt werden können.
 */
@Injectable({ providedIn: 'root' })
export class DemoGlobalLoadingService {
  private readonly count = signal(0);

  /** True, solange mindestens ein Vorgang läuft. */
  readonly isBusy = computed(() => this.count() > 0);

  /**
   * Markiert den Start eines Vorgangs.
   * Liefert eine idempotente Release-Funktion, die den Vorgang beendet.
   */
  busy(): () => void {
    this.count.update((count) => count + 1);
    let released = false;
    return () => {
      if (!released) {
        released = true;
        this.count.update((count) => Math.max(0, count - 1));
      }
    };
  }
}
