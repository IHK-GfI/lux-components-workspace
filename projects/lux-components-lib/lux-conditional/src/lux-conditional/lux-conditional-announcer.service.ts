import { LiveAnnouncer } from '@angular/cdk/a11y';
import { inject, Injectable } from '@angular/core';
import { TranslocoService } from '@jsverse/transloco';

/**
 * Sammelt die Bezeichnungen bedingter Bereiche, die innerhalb eines Ticks erscheinen oder verschwinden,
 * und sagt sie gebündelt als eine polite Live-Region-Meldung an (erst hinzugekommen, dann entfernt).
 */
@Injectable({ providedIn: 'root' })
export class LuxConditionalAnnouncer {
  private readonly liveAnnouncer = inject(LiveAnnouncer);
  private readonly tService = inject(TranslocoService);
  private readonly added: string[] = [];
  private readonly removed: string[] = [];
  private flushScheduled = false;

  /** Merkt eine Bezeichnung für die Ansage "hinzugekommen" des aktuellen Ticks vor. */
  announceAdded(label: string): void {
    this.added.push(label);
    this.scheduleFlush();
  }

  /** Merkt eine Bezeichnung für die Ansage "entfernt" des aktuellen Ticks vor. */
  announceRemoved(label: string): void {
    this.removed.push(label);
    this.scheduleFlush();
  }

  private scheduleFlush(): void {
    if (this.flushScheduled) {
      return;
    }
    this.flushScheduled = true;
    queueMicrotask(() => this.flush());
  }

  private flush(): void {
    this.flushScheduled = false;
    const added = this.added.splice(0);
    const removed = this.removed.splice(0);
    const parts: string[] = [];

    if (added.length > 0) {
      parts.push(this.translate('shown', added));
    }
    if (removed.length > 0) {
      parts.push(this.translate('hidden', removed));
    }
    // Eine einzige Meldung: ein zweiter announce()-Aufruf würde die noch ausstehende erste verdrängen.
    if (parts.length > 0) {
      this.liveAnnouncer.announce(parts.join('. '), 'polite');
    }
  }

  private translate(key: string, labels: string[]): string {
    return this.tService.translate(`luxc.conditional.${key}`, { labels: labels.join(', ') });
  }
}
