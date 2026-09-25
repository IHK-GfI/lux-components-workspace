import { FocusKeyManager } from '@angular/cdk/a11y';
import { computed, Injector, Signal, signal } from '@angular/core';
import { LuxUtil } from '@ihk-gfi/lux-components';
import { LuxListSelectItemComponent } from './lux-list-select-subcomponents/lux-list-select-item.component';

/**
 * Grid-Tastatur- und Fokuslogik von lux-list-select (W3C-Grid-Pattern). Zwei Ebenen:
 * Grid-Navigation (Pfeiltasten wechseln die Karte, die Liste ist ein einziger Tab-Stopp) und
 * Innennavigation (Enter/F2 steigt in die aktive Karte ab, Tab erreicht deren innere Elemente,
 * ESC/F2 steigt wieder auf). Später Kandidat für eine gemeinsame Direktive mit lux-list (#205).
 */
export class LuxListSelectKeyboardController<T> {
  private readonly keyManager: FocusKeyManager<LuxListSelectItemComponent<unknown>>;

  private readonly innerNavigationRequested = signal(false);
  private readonly activeItemData = signal<unknown>(undefined);

  // Unter track $index bleiben Item-Instanzen erhalten und wechseln nur ihre Daten. Das aktive Item
  // gilt daher nur, solange es noch gerendert ist und dieselbe Datenreferenz trägt wie bei der Aktivierung.
  private readonly validActiveItem = computed(() => {
    const active = this.keyManager.activeItem;
    return active && this.items().includes(active) && active.luxItem() === this.activeItemData() ? active : null;
  });

  readonly activeItemIndex = computed(() => (this.validActiveItem() ? (this.keyManager.activeItemIndex ?? -1) : -1));
  readonly innerNavigation = computed(() => this.innerNavigationRequested() && !!this.validActiveItem());

  constructor(
    private readonly items: Signal<readonly LuxListSelectItemComponent<unknown>[]>,
    private readonly callbacks: { toggleItem: (item: T) => void },
    injector: Injector
  ) {
    this.keyManager = new FocusKeyManager<LuxListSelectItemComponent<unknown>>(this.items, injector).skipPredicate((item) =>
      item.luxDisabled()
    );
  }

  /** Fokussiert beim Betreten des Grids von außen das zuletzt aktive (sonst erste) Item. */
  onGridFocus(event: FocusEvent): void {
    this.dropStaleActiveItem();
    const relatedTarget = event.relatedTarget as Node | null;
    const active = this.keyManager.activeItem;

    if (this.innerNavigation() && active?.contains(relatedTarget)) {
      active.focus();
      return;
    }

    // Fokus kommt per Shift+Tab von der Karte zum Grid-Container: active.focus() würde eine Endlosschleife erzeugen.
    if (!this.innerNavigation() && relatedTarget && (event.currentTarget as HTMLElement).contains(relatedTarget)) {
      return;
    }

    if (active) {
      active.focus();
    } else {
      this.activate(() => this.keyManager.setFirstItemActive());
    }
  }

  /** Beendet die Innennavigation, wenn der Fokus die aktive Karte verlässt, ohne zum Grid-Container zu wandern. */
  onGridFocusOut(event: FocusEvent): void {
    const active = this.keyManager.activeItem;
    if (!this.innerNavigation() || !active) {
      return;
    }
    const relatedTarget = event.relatedTarget as Node | null;
    const isMovingToGrid = relatedTarget === event.currentTarget;
    if (!active.contains(relatedTarget) && !isMovingToGrid) {
      this.innerNavigationRequested.set(false);
    }
  }

  onGridKeydown(event: KeyboardEvent): void {
    this.dropStaleActiveItem();
    if (this.innerNavigation()) {
      this.handleInnerNavigationKeydown(event);
    } else {
      this.handleGridNavigationKeydown(event);
    }
  }

  /** Übernimmt das angeklickte Item als aktiv, ohne den DOM-Fokus zu ändern. updateActiveItem umgeht das skipPredicate, daher der Disabled-Check. */
  onItemActivated(index: number): void {
    if (this.items()[index]?.luxDisabled()) {
      return;
    }
    this.activate(() => this.keyManager.updateActiveItem(index));
  }

  private handleGridNavigationKeydown(event: KeyboardEvent): void {
    if (this.moveActiveItem(event)) {
      event.preventDefault();
      return;
    }
    switch (true) {
      case LuxUtil.isKeySpace(event):
        this.toggleActiveItem();
        break;
      case LuxUtil.isKeyEnter(event):
        // Enter steigt in die Karte ab, sobald sie innere interaktive Elemente hat, sonst schaltet es die Auswahl um.
        if (this.keyManager.activeItem?.getFocusableElements().length) {
          this.enterInnerNavigation();
        } else {
          this.toggleActiveItem();
        }
        break;
      case LuxUtil.isKeyF2(event):
        this.enterInnerNavigation();
        break;
      default:
        return;
    }
    event.preventDefault();
  }

  private handleInnerNavigationKeydown(event: KeyboardEvent): void {
    const active = this.keyManager.activeItem;
    if (!active) {
      return;
    }
    const focusIsOnCard = event.target === active.cardElementRef;

    switch (true) {
      case LuxUtil.isKeyEscape(event):
      case LuxUtil.isKeyF2(event):
        this.innerNavigationRequested.set(false);
        active.focus();
        break;
      case LuxUtil.isKeyTab(event):
        if (!this.cycleTabFocus(event, active, focusIsOnCard)) {
          return;
        }
        break;
      case focusIsOnCard && LuxUtil.isKeySpace(event):
        this.toggleActiveItem();
        break;
      default:
        // Pfeiltasten/Home/End auf der Karte wechseln das Item und steigen damit aus der Innennavigation aus.
        if (!focusIsOnCard || !this.moveActiveItem(event)) {
          return;
        }
        this.innerNavigationRequested.set(false);
    }
    event.preventDefault();
  }

  /** Pfeiltasten/Home/End wechseln das aktive Item; liefert true, wenn die Taste verarbeitet wurde. */
  private moveActiveItem(event: KeyboardEvent): boolean {
    switch (true) {
      case LuxUtil.isKeyArrowUp(event):
        this.activate(() => this.keyManager.setPreviousItemActive());
        return true;
      case LuxUtil.isKeyArrowDown(event):
        this.activate(() => this.keyManager.setNextItemActive());
        return true;
      case LuxUtil.isKeyHome(event):
        this.activate(() => this.keyManager.setFirstItemActive());
        return true;
      case LuxUtil.isKeyEnd(event):
        this.activate(() => this.keyManager.setLastItemActive());
        return true;
      default:
        return false;
    }
  }

  /** Hält Tab innerhalb der Karte: von der Karte zum ersten/letzten inneren Element, vom letzten zurück zur Karte. */
  private cycleTabFocus(event: KeyboardEvent, active: LuxListSelectItemComponent<unknown>, focusIsOnCard: boolean): boolean {
    const focusable = active.getFocusableElements();
    if (focusable.length === 0) {
      return false;
    }
    const last = focusable[focusable.length - 1];
    if (focusIsOnCard) {
      (event.shiftKey ? last : focusable[0]).focus();
      return true;
    }
    if (!event.shiftKey && document.activeElement === last) {
      active.focus();
      return true;
    }
    return false;
  }

  private enterInnerNavigation(): void {
    const first = this.keyManager.activeItem?.getFocusableElements()[0];
    if (first) {
      this.innerNavigationRequested.set(true);
      first.focus();
    }
  }

  private toggleActiveItem(): void {
    const active = this.keyManager.activeItem;
    if (active) {
      this.callbacks.toggleItem(active.luxItem() as T);
    }
  }

  /** Führt einen Wechsel des aktiven Items aus und merkt sich dessen Datenreferenz für validActiveItem. */
  private activate(change: () => void): void {
    change();
    this.activeItemData.set(this.keyManager.activeItem?.luxItem());
  }

  /** Verwirft ein ungültig gewordenes aktives Item, bevor ein Handler damit arbeitet (zerstörte Instanz: NG0951, getauschte Daten: falsches Item). */
  private dropStaleActiveItem(): void {
    if (this.keyManager.activeItem && !this.validActiveItem()) {
      this.innerNavigationRequested.set(false);
      this.keyManager.updateActiveItem(-1);
    }
  }
}
