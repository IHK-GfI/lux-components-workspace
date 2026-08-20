import { FocusKeyManager } from '@angular/cdk/a11y';
import { computed, effect, Injector, Signal, signal } from '@angular/core';
import { LuxUtil } from '../../lux-util/lux-util';
import { LuxListSelectItemComponent } from './lux-list-select-subcomponents/lux-list-select-item.component';

/**
 * Grid-Tastatur- und Fokuslogik von lux-list-select (Vorbild lux-list), losgelöst von der
 * Host-Komponente: kennt nur die Item-Komponenten (über ein Signal) und einen toggleItem-Callback,
 * keine Rückabhängigkeit auf die Host-Komponente. Später Kandidat für eine gemeinsame Direktive mit
 * lux-list (#205).
 */
export class LuxListSelectKeyboardController<T> {
  // FocusKeyManager (Vorbild lux-list) wird mit einem Signal konstruiert und passt sich dadurch
  // automatisch an Filterung/Paginierung/Infinite-Scroll an.
  private readonly keyManager: FocusKeyManager<LuxListSelectItemComponent<unknown>>;

  // Bearbeiten-Modus (Enter/F2 auf der Karte -> Detail-Button; ESC/F2 zurück). Außerhalb ist die
  // Liste ein einziger Tab-Stopp, innerhalb greift der Browser-Tab-Fokus auf die inneren Elemente.
  private readonly editModeSignal = signal(false);
  readonly editMode = this.editModeSignal.asReadonly();
  // Reaktiver Zugriff auf den internen Zustand des FocusKeyManagers, wird an das aktive Item als
  // luxEditMode durchgereicht, damit nur dessen innere Elemente im Edit-Modus einen Tab-Stopp erhalten.
  readonly activeItemIndex = computed(() => this.keyManager.activeItemIndex);

  // Merkt die Datenreferenz (luxItem()) des aktiven Items, aktualisiert bei jeder beabsichtigten
  // Änderung des aktiven Index (siehe syncActiveItemRef()). Grundlage des Stale-Guards unten:
  // mit track $index (statt track item) werden Item-Komponenteninstanzen bei Filter/Suche/
  // Seitenwechsel/Server-Reload wiederverwendet statt zerstört, nur ihre Inputs wechseln - der
  // alte instanzbasierte Guard (Instanz verschwindet aus items()) bemerkt einen reinen
  // Datentausch am gleichen Index daher nicht mehr.
  private activeItemDataRef: unknown = undefined;

  constructor(
    private readonly items: Signal<readonly LuxListSelectItemComponent<unknown>[]>,
    private readonly callbacks: { toggleItem: (item: T) => void },
    injector: Injector
  ) {
    this.keyManager = new FocusKeyManager<LuxListSelectItemComponent<unknown>>(this.items, injector).skipPredicate((item) =>
      item.luxDisabled()
    );

    // Setzt das aktive Item zurück, sobald
    //  a) es durch Suche/Seitenwechsel/DAO-Reload aus der items()-Liste verschwindet und damit
    //     zerstört ist - sonst würden onGridFocus/toggleActiveItem auf die zerstörte Instanz
    //     zugreifen (NG0951), oder
    //  b) die Instanz zwar noch existiert (track $index behält sie bei), ihr luxItem() aber nicht
    //     mehr referenzgleich zur zuletzt gemerkten Datenreferenz ist - ein reiner Datentausch am
    //     aktiven Index (Filter/Suche/Server-Reload bei gleicher Listenlänge), der sonst unbemerkt
    //     bliebe und Space/Enter/Detail auf das falsche Item wirken ließe.
    // Bewusst Referenzgleichheit statt luxCompareWith: Infinite-Scroll-Append behält die Referenz
    // am aktiven Index (kein Reset), jeder andere Datentausch an dieser Stelle löst einen Reset
    // aus, auch wenn er "eigentlich" dasselbe logische Item wäre - das ist hier in Kauf genommen,
    // da die Komponente keine stabile ID hat, an der sich das zuverlässig unterscheiden ließe.
    // Der Read von active.luxItem() registriert den effect zusätzlich als Abhängigen dieses
    // Input-Signals: bleibt die items()-Query selbst unverändert (gleiche Instanzen, gleiche
    // Reihenfolge, nur neue Inputs), ist das der einzige Trigger, der den effect erneut laufen lässt.
    // Der effect ist an den übergebenen Injector (den der Host-Komponente) gebunden und räumt sich
    // beim Zerstören der Host-Komponente selbst auf, ein explizites dispose() dieses Controllers entfällt.
    effect(
      () => {
        const currentItems = this.items();
        const active = this.keyManager.activeItem;
        if (!active) {
          return;
        }
        const isDestroyed = !currentItems.includes(active);
        const isStale = !isDestroyed && active.luxItem() !== this.activeItemDataRef;
        if (isDestroyed || isStale) {
          this.editModeSignal.set(false);
          this.keyManager.updateActiveItem(-1);
          this.activeItemDataRef = undefined;
        }
      },
      { injector }
    );
  }

  /** Merkt die Datenreferenz des jetzt aktiven Items für den Stale-Guard oben; nach jeder Änderung des aktiven Index aufzurufen. */
  private syncActiveItemRef(): void {
    this.activeItemDataRef = this.keyManager.activeItem?.luxItem();
  }

  /**
   * Fokus-Handler des Grid-Containers (Vorbild lux-list): Beim Betreten von außen wird das zuletzt
   * aktive (oder mangels Vorgeschichte das erste) Item fokussiert; kommt der Fokus aus dem aktiven
   * Item selbst zurück, springt er nur auf die Karte zurück, der Edit-Modus bleibt aktiv.
   */
  onGridFocus(event: FocusEvent): void {
    const relatedTarget = event.relatedTarget as Node | null;
    const active = this.keyManager.activeItem;

    if (this.editModeSignal() && active?.contains(relatedTarget)) {
      active.focus();
      return;
    }

    // Fokus kommt vom Grid-Container selbst zurück (Shift+Tab von der Karte, die tabindex=-1 hat):
    // außerhalb des Edit-Modus nichts tun, sonst würde active.focus() unten eine
    // Shift+Tab-Endlosschleife erzeugen und das Grid wäre rückwärts nicht verlassbar.
    if (!this.editModeSignal() && relatedTarget && (event.currentTarget as HTMLElement).contains(relatedTarget)) {
      return;
    }

    if (active) {
      active.focus();
    } else {
      this.keyManager.setFirstItemActive();
      this.syncActiveItemRef();
    }
  }

  /** Beendet den Edit-Modus, wenn der Fokus die aktive Karte verlässt, ohne zum Grid-Container zu wandern (siehe onGridFocus). */
  onGridFocusOut(event: FocusEvent): void {
    if (!this.editModeSignal()) {
      return;
    }
    const active = this.keyManager.activeItem;
    if (!active) {
      return;
    }
    const relatedTarget = event.relatedTarget as Node | null;
    const isMovingToGrid = relatedTarget === event.currentTarget;
    const isLeavingActiveItem = !active.contains(relatedTarget);
    if (isLeavingActiveItem && !isMovingToGrid) {
      this.exitEditMode(false);
    }
  }

  /** Tastatur-Handler des Grid-Containers; im Edit-Modus delegiert er an handleEditModeKeydown. */
  onGridKeydown(event: KeyboardEvent): void {
    if (this.editModeSignal()) {
      this.handleEditModeKeydown(event);
      return;
    }

    if (LuxUtil.isKeySpace(event)) {
      this.toggleActiveItem();
      event.preventDefault();
    } else if (LuxUtil.isKeyEnter(event)) {
      if (this.keyManager.activeItem?.luxShowDetailButton()) {
        this.enterEditMode();
      } else {
        this.toggleActiveItem();
      }
      event.preventDefault();
    } else if (event.key === 'F2') {
      this.enterEditMode();
      event.preventDefault();
    } else if (LuxUtil.isKeyArrowUp(event)) {
      this.keyManager.setPreviousItemActive();
      this.syncActiveItemRef();
      event.preventDefault();
    } else if (LuxUtil.isKeyArrowDown(event)) {
      this.keyManager.setNextItemActive();
      this.syncActiveItemRef();
      event.preventDefault();
    } else if (LuxUtil.isKeyHome(event)) {
      this.keyManager.setFirstItemActive();
      this.syncActiveItemRef();
      event.preventDefault();
    } else if (LuxUtil.isKeyEnd(event)) {
      this.keyManager.setLastItemActive();
      this.syncActiveItemRef();
      event.preventDefault();
    }
  }

  /** Synchronisiert bei Klick den FocusKeyManager-Zustand ohne DOM-Fokus zu ändern; disabled Items werden nicht übernommen, da updateActiveItem das skipPredicate umgeht. */
  onItemActivated(index: number): void {
    const item = this.items()[index];
    if (item?.luxDisabled()) {
      return;
    }
    this.keyManager.updateActiveItem(index);
    this.syncActiveItemRef();
  }

  /** Betritt den Edit-Modus auf dem aktiven Item und fokussiert dessen erstes inneres Element; ohne fokussierbare Elemente passiert nichts. */
  private enterEditMode(): void {
    const active = this.keyManager.activeItem;
    if (!active) {
      return;
    }
    const focusable = active.getFocusableElements();
    if (focusable.length === 0) {
      return;
    }
    this.editModeSignal.set(true);
    focusable[0].focus();
  }

  /**
   * Beendet den Edit-Modus.
   * @param moveFocusToRow Wenn true (Standard bei ESC/F2), wird der Fokus auf die Karte zurückgesetzt.
   */
  private exitEditMode(moveFocusToRow: boolean): void {
    if (!this.editModeSignal()) {
      return;
    }
    this.editModeSignal.set(false);
    if (moveFocusToRow) {
      this.keyManager.activeItem?.focus();
    }
  }

  /**
   * Tab-Zyklus- und ESC/F2-Logik im Edit-Modus (1:1 nach lux-list): Tab/Shift+Tab von der Karte
   * springt zum ersten/letzten inneren Element, Tab vom letzten Element zurück zur Karte (Edit-Modus
   * bleibt aktiv), ESC/F2 verlassen ihn vollständig.
   */
  private handleEditModeKeydown(event: KeyboardEvent): void {
    if (LuxUtil.isKeyEscape(event)) {
      this.exitEditMode(true);
      event.preventDefault();
      return;
    }
    if (event.key === 'F2') {
      this.exitEditMode(true);
      event.preventDefault();
      return;
    }

    const active = this.keyManager.activeItem;
    if (!active) {
      return;
    }
    const focusIsOnRow = (event.target as HTMLElement) === active.cardElementRef;

    if (event.key === 'Tab') {
      const focusableElements = active.getFocusableElements();
      if (focusIsOnRow) {
        if (focusableElements.length > 0) {
          (event.shiftKey ? focusableElements[focusableElements.length - 1] : focusableElements[0]).focus();
          event.preventDefault();
        }
      } else if (
        !event.shiftKey &&
        focusableElements.length > 0 &&
        document.activeElement === focusableElements[focusableElements.length - 1]
      ) {
        active.focus();
        event.preventDefault();
      }
      return;
    }

    if (!focusIsOnRow) {
      return;
    }
    if (LuxUtil.isKeySpace(event)) {
      this.toggleActiveItem();
      event.preventDefault();
    } else if (LuxUtil.isKeyArrowUp(event)) {
      this.editModeSignal.set(false);
      this.keyManager.setPreviousItemActive();
      this.syncActiveItemRef();
      event.preventDefault();
    } else if (LuxUtil.isKeyArrowDown(event)) {
      this.editModeSignal.set(false);
      this.keyManager.setNextItemActive();
      this.syncActiveItemRef();
      event.preventDefault();
    } else if (LuxUtil.isKeyHome(event)) {
      this.editModeSignal.set(false);
      this.keyManager.setFirstItemActive();
      this.syncActiveItemRef();
      event.preventDefault();
    } else if (LuxUtil.isKeyEnd(event)) {
      this.editModeSignal.set(false);
      this.keyManager.setLastItemActive();
      this.syncActiveItemRef();
      event.preventDefault();
    }
  }

  /** Toggelt die Selektion des aktuell im FocusKeyManager aktiven Items. */
  private toggleActiveItem(): void {
    const active = this.keyManager.activeItem;
    if (active) {
      this.callbacks.toggleItem(active.luxItem() as T);
    }
  }
}
