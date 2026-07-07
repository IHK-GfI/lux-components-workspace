/**
 * Beobachtet ein Host-Element und meldet, ob dessen Text visuell gekürzt ist
 * (`scrollWidth > clientWidth`, z.B. durch `text-overflow: ellipsis`).
 *
 * Die Klasse ist bewusst framework-agnostisch (kein Angular), damit die reine
 * DOM-Beobachtungs-Mechanik aus der {@link LuxTooltipDirective} herausgelöst und
 * isoliert testbar ist. Die Direktive besitzt weiterhin die fachliche Logik
 * ("wann ist der Tooltip disabled"), dieser Watcher nur das "ist gekürzt?".
 */
export class LuxTooltipTruncationWatcher {
  // Größenänderungen des Elements (Layout, Fenster) → Kürzung kann sich ändern.
  private resizeObserver?: ResizeObserver;
  // Textänderungen bei gleichbleibender Box (gleiche Breite, längerer/kürzerer
  // Inhalt) lösen keinen ResizeObserver aus, dafür greift der MutationObserver.
  private mutationObserver?: MutationObserver;
  // Messungen werden in einen Makrotask verschoben: Das Lesen von scrollWidth
  // direkt im ResizeObserver-Callback triggert sonst die Browser-Warnung
  // "ResizeObserver loop completed with undelivered notifications".
  private checkTimeout?: ReturnType<typeof setTimeout>;
  private truncated = false;

  /** Ob der Host-Text aktuell visuell gekürzt ist (Stand der letzten Messung). */
  get isTruncated(): boolean {
    return this.truncated;
  }

  /**
   * @param element Das zu beobachtende Host-Element.
   * @param onTruncationChange Callback, der nur bei tatsächlichem Wechsel des
   *   Kürzungs-Zustands aufgerufen wird (spart unnötige Change-Detection).
   */
  constructor(
    private readonly element: HTMLElement,
    private readonly onTruncationChange: () => void
  ) {}

  /** Startet die Beobachtung. Mehrfachaufrufe sind idempotent (No-op). */
  connect(): void {
    if (this.resizeObserver || this.mutationObserver) {
      return;
    }

    // typeof-Prüfungen: SSR/Non-DOM-Umgebungen kennen diese Globals nicht.
    if (typeof ResizeObserver !== 'undefined') {
      this.resizeObserver = new ResizeObserver(() => this.scheduleCheck());
      this.resizeObserver.observe(this.element);
    }
    if (typeof MutationObserver !== 'undefined') {
      this.mutationObserver = new MutationObserver(() => this.scheduleCheck());
      this.mutationObserver.observe(this.element, {
        characterData: true,
        childList: true,
        subtree: true
      });
    }

    // Erste Messung, sobald das Layout steht (auch ohne ResizeObserver).
    this.scheduleCheck();
  }

  /** Beendet die Beobachtung und gibt alle Ressourcen frei. */
  disconnect(): void {
    this.clearCheck();
    this.resizeObserver?.disconnect();
    this.resizeObserver = undefined;
    this.mutationObserver?.disconnect();
    this.mutationObserver = undefined;
    // Zustand zurücksetzen, damit ein späteres connect() nicht mit einem veralteten
    // Wert startet und syncDisabledState() bis zur ersten Neumessung sicher deaktiviert.
    this.truncated = false;
  }

  /**
   * Misst den Kürzungs-Zustand synchron und meldet einen Wechsel.
   * Als öffentliche Methode gehalten, damit Tests deterministisch messen können.
   */
  refresh(): void {
    const wasTruncated = this.truncated;
    this.truncated = this.element.scrollWidth > this.element.clientWidth;
    if (this.truncated !== wasTruncated) {
      this.onTruncationChange();
    }
  }

  private scheduleCheck(): void {
    this.clearCheck();
    this.checkTimeout = setTimeout(() => {
      this.checkTimeout = undefined;
      this.refresh();
    }, 0);
  }

  private clearCheck(): void {
    if (this.checkTimeout !== undefined) {
      clearTimeout(this.checkTimeout);
      this.checkTimeout = undefined;
    }
  }
}
