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

  constructor(
    private readonly items: Signal<readonly LuxListSelectItemComponent<unknown>[]>,
    private readonly callbacks: { toggleItem: (item: T) => void },
    injector: Injector
  ) {
    this.keyManager = new FocusKeyManager<LuxListSelectItemComponent<unknown>>(this.items, injector).skipPredicate((item) =>
      item.luxDisabled()
    );

    // Setzt das aktive Item zurück, sobald es durch Suche/Seitenwechsel/DAO-Reload aus der
    // items()-Liste verschwindet und damit zerstört ist - sonst würden onGridFocus/toggleActiveItem
    // auf die zerstörte Instanz zugreifen (NG0951). Der Signal-basierte FocusKeyManager synchronisiert
    // sich danach selbst mit der neuen Liste, ein Neu-Erzeugen wie bei lux-list ist nicht nötig.
    // Der effect ist an den übergebenen Injector (den der Host-Komponente) gebunden und räumt sich
    // beim Zerstören der Host-Komponente selbst auf, ein explizites dispose() dieses Controllers entfällt.
    effect(
      () => {
        const currentItems = this.items();
        const active = this.keyManager.activeItem;
        if (active && !currentItems.includes(active)) {
          this.editModeSignal.set(false);
          this.keyManager.updateActiveItem(-1);
        }
      },
      { injector }
    );
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
      event.preventDefault();
    } else if (LuxUtil.isKeyArrowDown(event)) {
      this.keyManager.setNextItemActive();
      event.preventDefault();
    } else if (LuxUtil.isKeyHome(event)) {
      this.keyManager.setFirstItemActive();
      event.preventDefault();
    } else if (LuxUtil.isKeyEnd(event)) {
      this.keyManager.setLastItemActive();
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
      event.preventDefault();
    } else if (LuxUtil.isKeyArrowDown(event)) {
      this.editModeSignal.set(false);
      this.keyManager.setNextItemActive();
      event.preventDefault();
    } else if (LuxUtil.isKeyHome(event)) {
      this.editModeSignal.set(false);
      this.keyManager.setFirstItemActive();
      event.preventDefault();
    } else if (LuxUtil.isKeyEnd(event)) {
      this.editModeSignal.set(false);
      this.keyManager.setLastItemActive();
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
