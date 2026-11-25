import { computed, Injector, signal, Type, untracked } from '@angular/core';
import { LuxSnackbarType } from '@ihk-gfi/lux-components';
import { LuxSnackbarLimits } from './lux-snackbar-limits';
import { LuxSnackbarRef } from './lux-snackbar-ref';

/**
 * Eine Nachricht im Snackbar-Stack (intern).
 */
export interface LuxSnackbarMessage {
  readonly id: number;
  readonly ref: LuxSnackbarRef;
  readonly type?: LuxSnackbarType;
  /** Anzeigedauer in Millisekunden; 0 = bleibt stehen. */
  readonly duration: number;
  readonly component: Type<unknown>;
  readonly injector: Injector;
  readonly panelClasses: string[];
}

interface LuxSnackbarTimer {
  remaining: number;
  startedAt: number;
  timeoutId?: ReturnType<typeof setTimeout>;
}

/** setTimeout läuft bei größeren Werten sofort ab (32-Bit-Grenze). */
const MAX_TIMEOUT = Math.pow(2, 31) - 1;

/**
 * Zustand des Snackbar-Stacks: Nachrichten (neueste zuerst), Limits, Aufklappen und die Timer je Nachricht.
 *
 * Ein Timer läuft nur, solange seine Nachricht innerhalb der Limits sichtbar ist und der Stack weder aufgeklappt
 * noch per Maus oder Fokus aktiv ist. Danach läuft er mit der Restzeit weiter.
 *
 * Die ändernden Methoden lesen Signale nur untracked: Sie werden auch aus effect() oder computed() der Anwendung
 * aufgerufen (z.B. LuxSnackbarService.setLimits() in einem effect). Sonst hinge der Aufrufer von Signalen ab,
 * die die Methode selbst schreibt, und würde sich endlos neu auslösen.
 */
export class LuxSnackbarStack {
  readonly messages = signal<LuxSnackbarMessage[]>([]);
  readonly limits = signal<LuxSnackbarLimits>({});
  readonly expanded = signal(false);
  /** Maximale Höhe der aufgeklappten Liste in Pixeln (wird vom LuxSnackbarService anhand der Position gesetzt). */
  readonly maxListHeight = signal(400);

  /** Die Nachrichten innerhalb der Limits (neueste zuerst). */
  readonly limitedMessages = computed(() => LuxSnackbarStack.applyLimits(this.messages(), this.limits()));
  /** Die angezeigten Nachrichten: aufgeklappt alle, sonst nur die innerhalb der Limits. */
  readonly visibleMessages = computed(() => (this.expanded() ? this.messages() : this.limitedMessages()));
  /** Anzahl der Nachrichten, die über den Limits liegen. */
  readonly hiddenCount = computed(() => this.messages().length - this.limitedMessages().length);

  private hovered = false;
  private focused = false;
  private readonly timers = new Map<number, LuxSnackbarTimer>();
  private readonly revealedIds = new Set<number>();

  /**
   * Wendet die Limits auf die Nachrichten an (neueste zuerst) und liefert die sichtbaren Nachrichten.
   */
  static applyLimits(messages: LuxSnackbarMessage[], limits: LuxSnackbarLimits): LuxSnackbarMessage[] {
    const maxVisible = LuxSnackbarStack.normalizeLimit(limits.maxVisible);
    const perType = limits.maxVisiblePerType;

    if (!perType) {
      return messages.slice(0, maxVisible);
    }

    const counts = new Map<LuxSnackbarType | undefined, number>();
    return messages.filter((message) => {
      const typeLimit = message.type ? perType[message.type] : undefined;
      const limit = typeLimit !== undefined ? LuxSnackbarStack.normalizeLimit(typeLimit) : maxVisible;
      const count = counts.get(message.type) ?? 0;

      if (count >= limit) {
        return false;
      }

      counts.set(message.type, count + 1);
      return true;
    });
  }

  private static normalizeLimit(value: number | undefined): number {
    if (value === undefined || !Number.isFinite(value)) {
      return 1;
    }

    return Math.max(1, Math.floor(value));
  }

  add(message: LuxSnackbarMessage) {
    untracked(() => {
      this.timers.set(message.id, { remaining: Math.min(message.duration, MAX_TIMEOUT), startedAt: 0 });
      this.messages.update((messages) => [message, ...messages]);
      this.syncTimers();
    });
  }

  remove(id: number) {
    untracked(() => {
      this.stopTimer(id);
      this.timers.delete(id);
      this.revealedIds.delete(id);
      this.trackRevealed(() => {
        this.messages.update((messages) => messages.filter((message) => message.id !== id));
        this.collapseIfNothingHidden();
      });
      // Verschwindet die letzte Nachricht unter der Maus, kommt mouseleave erst mit der nächsten Mausbewegung.
      // Bis dahin blieben die Timer neuer Nachrichten pausiert.
      if (this.messages().length === 0) {
        this.hovered = false;
      }
      this.syncTimers();
    });
  }

  /**
   * Liefert true, wenn die Nachricht schon vorhanden war und erst nachträglich sichtbar wurde
   * (z.B. nachgerückt, weil eine andere geschlossen wurde). Sie wird dann nur eingeblendet statt
   * wie eine neue Nachricht hereinzuspringen.
   */
  isRevealed(id: number): boolean {
    return this.revealedIds.has(id);
  }

  /**
   * Schließt alle Nachrichten über ihre Ref (damit afterDismissed() jeweils benachrichtigt).
   */
  dismissAll() {
    untracked(() => [...this.messages()].forEach((message) => message.ref.dismiss()));
  }

  setLimits(limits: LuxSnackbarLimits) {
    untracked(() => {
      this.trackRevealed(() => {
        this.limits.set({ ...limits });
        this.collapseIfNothingHidden();
      });
      this.syncTimers();
    });
  }

  toggleExpanded() {
    untracked(() => {
      this.trackRevealed(() => this.expanded.update((expanded) => !expanded));
      this.syncTimers();
    });
  }

  setHovered(hovered: boolean) {
    this.hovered = hovered;
    untracked(() => this.syncTimers());
  }

  setFocused(focused: boolean) {
    this.focused = focused;
    untracked(() => this.syncTimers());
  }

  destroy() {
    this.timers.forEach((_timer, id) => this.stopTimer(id));
    this.timers.clear();
  }

  /**
   * Merkt sich die Nachrichten, die durch die Änderung sichtbar werden, obwohl sie schon vorhanden waren.
   */
  private trackRevealed(change: () => void) {
    const visibleBefore = new Set(this.visibleMessages().map((message) => message.id));
    change();
    this.visibleMessages()
      .filter((message) => !visibleBefore.has(message.id))
      .forEach((message) => this.revealedIds.add(message.id));
  }

  private collapseIfNothingHidden() {
    if (this.expanded() && this.hiddenCount() === 0) {
      this.expanded.set(false);
    }
  }

  private syncTimers() {
    const paused = this.hovered || this.focused || this.expanded();
    const visibleIds = new Set(this.limitedMessages().map((message) => message.id));

    for (const message of this.messages()) {
      const timer = this.timers.get(message.id);
      if (!timer || message.duration <= 0) {
        continue;
      }

      const shouldRun = !paused && visibleIds.has(message.id);
      if (shouldRun && timer.timeoutId === undefined) {
        timer.startedAt = Date.now();
        timer.timeoutId = setTimeout(() => message.ref.dismiss(), timer.remaining);
      } else if (!shouldRun) {
        this.stopTimer(message.id);
      }
    }
  }

  private stopTimer(id: number) {
    const timer = this.timers.get(id);
    if (timer?.timeoutId === undefined) {
      return;
    }

    clearTimeout(timer.timeoutId);
    timer.timeoutId = undefined;
    timer.remaining = Math.max(0, timer.remaining - (Date.now() - timer.startedAt));
  }
}
