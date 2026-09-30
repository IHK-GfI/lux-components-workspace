import { LiveAnnouncer } from '@angular/cdk/a11y';
import { effect, Injector, Signal } from '@angular/core';
import { TranslocoService } from '@jsverse/transloco';

export interface LuxListSelectSearchAnnouncement {
  active: Signal<boolean>;
  term: Signal<string>;
  count: Signal<number>;
  loading: Signal<boolean>;
}

/** Sagt Screenreadern die Trefferzahl einer Suche an: einmal pro Suchbegriff und erst, wenn das Ergebnis vorliegt. */
export function announceSearchResults(state: LuxListSelectSearchAnnouncement, injector: Injector): void {
  const liveAnnouncer = injector.get(LiveAnnouncer);
  const tService = injector.get(TranslocoService);
  // Der Begriff gehört zum Vergleich dazu: zwei Suchen können zufällig dieselbe Trefferzahl liefern.
  let lastAnnounced: { term: string; message: string } | null = null;

  effect(
    () => {
      const term = state.term();
      const count = state.count();
      if (!state.active() || term === '') {
        lastAnnounced = null;
        return;
      }
      // Während des Ladens bleibt der Stand erhalten, sonst käme die Ansage nach jedem Seitenwechsel erneut.
      if (state.loading()) {
        return;
      }
      const message = tService.translate('luxc.list-select.search_results', { count });
      if (lastAnnounced?.term !== term || lastAnnounced.message !== message) {
        lastAnnounced = { term, message };
        liveAnnouncer.announce(message, 'polite');
      }
    },
    { injector }
  );
}
