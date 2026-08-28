import { FocusableOption, FocusKeyManager } from '@angular/cdk/a11y';
import { isPlatformBrowser } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  computed,
  contentChildren,
  effect,
  ElementRef,
  HostBinding,
  HostListener,
  inject,
  input,
  OnDestroy,
  OnInit,
  output,
  PLATFORM_ID
} from '@angular/core';
import { TranslocoPipe, TranslocoService } from '@jsverse/transloco';
import { LuxIconComponent } from '../../lux-icon/lux-icon/lux-icon.component';
import { LuxUtil } from '../../lux-util/lux-util';
import { LuxListItemComponent } from './lux-list-subcomponents/lux-list-item.component';

/**
 * Selektiert alle aktuell fokussierbaren Elemente zum Deaktivieren der Tab-Stops.
 * Enthält [tabindex]:not([tabindex="-1"]), um auch benutzerdefinierte
 * fokussierbare Elemente (z.B. <div tabindex="0">) zu erfassen.
 */
const FOCUSABLE_SELECTORS =
  'a[href]:not([disabled]), button:not([disabled]), input:not([disabled]), select:not([disabled]):not([style*="display: none"]), mat-select:not([disabled]), mat-chip-grid:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * Selektiert interaktive native Elemente sowie zuvor per disableInnerTabStops()
 * deaktivierte Custom-Elemente ([data-lux-focusable]) für die Grid-Navigation.
 * Native Elemente (button, input …) sind per Typ-Selektor auffindbar – unabhängig
 * vom aktuellen tabindex-Wert. Custom fokussierbare Elemente (<div tabindex="0">)
 * werden per Datenattribut wiederhergestellt, das disableInnerTabStops() setzt.
 */
const NAVIGABLE_SELECTORS =
  'a[href]:not([disabled]), button:not([disabled]), input:not([disabled]), select:not([disabled]):not([style*="display: none"]), mat-select:not([disabled]), mat-chip-grid:not([disabled]), textarea:not([disabled]), [data-lux-focusable]:not([disabled])';

const KEY_F2 = 'F2';

@Component({
  selector: 'lux-list',
  templateUrl: './lux-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [LuxIconComponent, TranslocoPipe]
})
export class LuxListComponent implements AfterViewInit, OnInit, OnDestroy {
  private tService = inject(TranslocoService);
  private elementRef = inject(ElementRef);
  private platformId = inject(PLATFORM_ID);
  private cdr = inject(ChangeDetectorRef);
  private _selectedPosition: number | undefined = 0;

  private previousFocusedPosition?: number;
  private clickSubscriptions: { unsubscribe(): void }[] = [];
  private tabStopObserver?: MutationObserver;
  private tabStopObserverDebounce?: ReturnType<typeof setTimeout>;
  private keyManager: FocusKeyManager<LuxListItemComponent> = new FocusKeyManager<LuxListItemComponent>([]);
  private isFirstItemsRun = true;
  private previousItemsSnapshot: readonly LuxListItemComponent[] = [];

  /**
   * Gibt an, ob sich die Liste im Bearbeiten-Modus befindet.
   *
   * Invariante:
   *   editMode === false  Alle Sub-Elemente aller Kacheln haben tabindex="-1".
   *                       Die Liste ist ein einziger Tab-Stopp.
   *   editMode === true   Alle Sub-Elemente der aktiven Kachel haben tabindex="0".
   *                       Der Browser verwaltet die Tab-Reihenfolge innerhalb der Kachel selbst.
   */
  private editMode = false;

  readonly luxItems = contentChildren(LuxListItemComponent);

  readonly luxFocusedItemChange = output<LuxListItemComponent>();
  readonly luxFocusedPositionChange = output<number>();
  readonly luxSelectedPositionChange = output<number>();

  readonly luxEmptyIconName = input('lux-interface-alert-information-circle');
  readonly luxEmptyIconSize = input('5x');
  readonly luxEmptyLabel = input('');
  readonly luxLabel = input<string | undefined>();
  readonly luxSelectedPosition = input<number | undefined>(0);

  readonly effectiveLabel = computed(() => this.luxLabel() || this.tService.translate('luxc.list.arialabel'));

  @HostBinding('attr.role') role = 'grid';
  @HostBinding('attr.tabindex') tabindex = '0';

  @HostBinding('attr.aria-label') get label() {
    return this.effectiveLabel();
  }

  @HostListener('focus', ['$event']) onFocus(event: FocusEvent) {
    const relatedTarget = event.relatedTarget as HTMLElement | null;
    const activeItem = this.keyManager.activeItem;

    // Im editMode: Fokus kommt aus dem aktiven Item (z.B. Shift+Tab vom ersten Element).
    // Nur zur Zeile zurückspringen, editMode bleibt aktiv.
    if (this.editMode && activeItem && relatedTarget && activeItem.elementRef.nativeElement.contains(relatedTarget)) {
      this.focusNow(activeItem);
      return;
    }

    if (event.relatedTarget === null || 'lux-list-item' !== this.getTagName(event)) {
      // Wenn die Liste den Focus erhält, soll direkt das selektierte Element (bzw. das erste Element) focussiert werden.
      if (this.luxItems().length > 0) {
        if (this._selectedPosition != null && this._selectedPosition >= 0) {
          this.focus(this._selectedPosition);
        } else {
          this.focus(0);
        }
      }
    }
  }

  @HostListener('keydown', ['$event']) onKeydown(keyboardEvent: KeyboardEvent) {
    this.keydown(keyboardEvent);
  }

  @HostListener('focusout', ['$event']) onFocusOut(event: FocusEvent) {
    if (this.editMode) {
      const activeItem = this.keyManager.activeItem;
      if (activeItem) {
        const relatedTarget = event.relatedTarget as HTMLElement | null;
        // Fokus wandert zum lux-list-Host selbst (z.B. Shift+Tab vom ersten interaktiven Element):
        // Das ist eine Zwischenstation auf dem Weg zurück zur Zeile – editMode bleibt aktiv.
        const isMovingToListHost = relatedTarget === this.elementRef.nativeElement;
        const isLeavingActiveItem = !relatedTarget || !activeItem.elementRef.nativeElement.contains(relatedTarget);
        if (isLeavingActiveItem && !isMovingToListHost) {
          this.exitEditMode(false);
        }
      }
    }
  }

  constructor() {
    effect(() => {
      const items = this.luxItems();

      // Der erste automatische Lauf entspricht der initialen Auflösung der ContentChildren
      // (kein "echter" Wechsel wie früher bei QueryList.changes, das initial nie feuert)
      // und wird daher übersprungen – die Erstinitialisierung übernimmt ngAfterViewInit synchron.
      if (this.isFirstItemsRun) {
        this.isFirstItemsRun = false;
        this.previousItemsSnapshot = items;
        return;
      }

      // contentChildren() kann erneut auslösen, ohne dass sich die Menge der Content-Children
      // tatsächlich geändert hat (z.B. wenn sich nur interner State einer Kind-Komponente wie
      // luxSelected ändert). Ohne diesen Vergleich würde das markForCheck() am Ende dieses Effects
      // eine neue Change-Detection auslösen, die die Query erneut auffrischt und den Effect erneut
      // feuert – eine Endlosschleife, die den Browser-Tab dauerhaft einfriert (reproduziert z.B.
      // durch mehrfaches Selektieren verschiedener lux-list-items in lux-master-detail-ac).
      const itemsChanged =
        items.length !== this.previousItemsSnapshot.length || items.some((item, index) => item !== this.previousItemsSnapshot[index]);
      this.previousItemsSnapshot = items;
      if (!itemsChanged) {
        return;
      }

      if (this.editMode) {
        this.exitEditMode(false);
      }
      this.listenForClicks();
      this.keyManager = new FocusKeyManager<LuxListItemComponent>(items);
      if (this.previousFocusedPosition != null) {
        this.keyManager.setActiveItem(this.previousFocusedPosition);
      }
      if (isPlatformBrowser(this.platformId)) {
        this.disableInnerTabStops();
      }

      // Content-Kinder ändern sich unabhängig von normalen Input-Bindings (Content-Projection).
      // Unter OnPush muss daher explizit markForCheck() aufgerufen werden, damit z.B. isEmpty()
      // im Template neu ausgewertet wird.
      this.cdr.markForCheck();
    });

    effect(() => {
      const requested = this.luxSelectedPosition();
      if (requested === this._selectedPosition) {
        return;
      }

      this.focus(requested);
      this.select(requested);
      this.scroll(requested);
    });
  }

  isEmpty() {
    return this.luxItems().length === 0;
  }

  ngOnInit() {
    const defaultLabel = this.tService.translate('luxc.list.arialabel');
    if (this.label === defaultLabel) {
      console.warn(
        'lux-list:\n' +
          'Die Property "luxLabel" wurde nicht gesetzt.\n' +
          'Bitte ein sprechendes Label setzen, damit dieses von Screenreadern vorgelesen werden kann.\n' +
          `Es wird das Standardlabel "${defaultLabel}" verwendet.`
      );
    }
  }

  ngAfterViewInit() {
    this.listenForClicks();
    this.keyManager = new FocusKeyManager<LuxListItemComponent>(this.luxItems());
    if (this._selectedPosition != null) {
      this.keyManager.setActiveItem(this._selectedPosition);
    }

    // Initiales Setzen von tabindex="-1" auf alle interaktiven Elemente sowie
    // MutationObserver für dynamische DOM-Änderungen nur im Browser-Kontext:
    // disableInnerTabStops() greift auf nativeElement.querySelectorAll() zu –
    // in SSR nicht benötigt (kein Tab-Fokus) und von isPlatformBrowser abgesichert.
    // Nur childList/subtree wird beobachtet, keine Attribut-Änderungen:
    // disableInnerTabStops() setzt tabindex- und data-lux-focusable-Attribute –
    // würde auch attributes: true beobachtet, könnte der Observer sich selbst rekursiv auslösen.
    if (isPlatformBrowser(this.platformId)) {
      this.disableInnerTabStops();

      this.tabStopObserver = new MutationObserver(() => {
        // luxItems (contentChildren) wird nur aufgefrischt, wenn diese Komponente selbst
        // durchlaufen wird. Wird der projizierte Inhalt (lux-list-item) von einem Vorfahren
        // mit einer anderen ChangeDetectionStrategy (z.B. Default/Eager) asynchron befüllt
        // (z.B. nach einem setTimeout), wird diese OnPush-Komponente sonst nie als
        // "dirty" markiert und luxItems() bleibt dauerhaft veraltet (Liste lädt nie).
        // Der bereits vorhandene MutationObserver dient hier als zuverlässiger, von der
        // Angular-Traversierung unabhängiger Trigger.
        this.cdr.markForCheck();
        clearTimeout(this.tabStopObserverDebounce);
        this.tabStopObserverDebounce = setTimeout(() => this.disableInnerTabStops(), 0);
      });
      this.tabStopObserver.observe(this.elementRef.nativeElement, { childList: true, subtree: true });
    }
  }

  ngOnDestroy() {
    clearTimeout(this.tabStopObserverDebounce);
    this.tabStopObserver?.disconnect();

    this.clickSubscriptions.forEach((sub) => sub.unsubscribe());
  }

  /**
   * Wird beim Drücken einer Taste ausgeführt und handelt die Aktionen bei speziellen Tasten
   * (UP_ARROW || DOWN_ARROW werden vom KeyManager selbstständig gepflegt)
   * @param keyboardEvent
   */
  keydown(keyboardEvent: KeyboardEvent) {
    if (this.editMode) {
      if (LuxUtil.isKeyEscape(keyboardEvent) && !keyboardEvent.defaultPrevented && !this.hasOpenOverlayInActiveItem()) {
        this.exitEditMode(true);
        keyboardEvent.preventDefault();
      } else {
        const activeItem = this.keyManager.activeItem;
        const focusIsOnRow = activeItem && (keyboardEvent.target as HTMLElement) === activeItem.elementRef.nativeElement;

        if (activeItem && keyboardEvent.key === 'Tab') {
          const focusableElements = this.getFocusableElements(activeItem);
          if (focusIsOnRow) {
            if (focusableElements.length > 0) {
              // Shift+Tab auf Zeilenebene → letztes fokussierbares Element; Tab → erstes
              this.focusNow(keyboardEvent.shiftKey ? focusableElements[focusableElements.length - 1] : focusableElements[0]);
              keyboardEvent.preventDefault();
            }
          } else if (
            !keyboardEvent.shiftKey &&
            focusableElements.length > 0 &&
            document.activeElement === focusableElements[focusableElements.length - 1]
          ) {
            // Tab auf dem letzten fokussierbaren Element → Fokus zurück auf die Zeile (symmetrisch zu Shift+Tab auf dem ersten Element)
            this.focusNow(activeItem);
            keyboardEvent.preventDefault();
          }
        } else if (focusIsOnRow) {
          if (LuxUtil.isKeyArrowUp(keyboardEvent)) {
            this.keyManager.setPreviousItemActive();
            this.focusActiveItem();
            keyboardEvent.preventDefault();
          } else if (LuxUtil.isKeyArrowDown(keyboardEvent)) {
            this.keyManager.setNextItemActive();
            this.focusActiveItem();
            keyboardEvent.preventDefault();
          } else if (LuxUtil.isKeyHome(keyboardEvent)) {
            this.keyManager.setFirstItemActive();
            this.focusActiveItem();
            keyboardEvent.preventDefault();
          } else if (LuxUtil.isKeyEnd(keyboardEvent)) {
            this.keyManager.setLastItemActive();
            this.focusActiveItem();
            keyboardEvent.preventDefault();
          }
        }
      }
      return;
    }

    if (LuxUtil.isKeySpace(keyboardEvent) || LuxUtil.isKeyEnter(keyboardEvent) || keyboardEvent.key === KEY_F2) {
      this.selectAndEnterEditMode();
      keyboardEvent.preventDefault();
    } else if (LuxUtil.isKeyHome(keyboardEvent)) {
      this.keyManager.setFirstItemActive();
      this.focusActiveItem();
      keyboardEvent.preventDefault();
    } else if (LuxUtil.isKeyEnd(keyboardEvent)) {
      this.keyManager.setLastItemActive();
      this.focusActiveItem();
      keyboardEvent.preventDefault();
    } else if (LuxUtil.isKeyArrowUp(keyboardEvent)) {
      this.keyManager.setPreviousItemActive();
      this.focusActiveItem();
      keyboardEvent.preventDefault();
    } else if (LuxUtil.isKeyArrowDown(keyboardEvent)) {
      this.keyManager.setNextItemActive();
      this.focusActiveItem();
      keyboardEvent.preventDefault();
    } else {
      this.keyManager.onKeydown(keyboardEvent);
    }
  }

  /**
   * Auf Click-Events der hier bekannten LuxListItems hören und entsprechend das selektierte ListItem aktualisieren.
   */
  private listenForClicks() {
    this.clickSubscriptions.forEach((sub) => sub.unsubscribe());
    this.clickSubscriptions = [];

    this.luxItems().forEach((listItem: LuxListItemComponent, index: number) => {
      this.clickSubscriptions.push(
        listItem.luxClicked.subscribe((event: Event) => {
          const clickTarget = (event.target as HTMLElement).closest<HTMLElement>(NAVIGABLE_SELECTORS);
          const isFocusableTarget = !!clickTarget && listItem.elementRef.nativeElement.contains(clickTarget);

          if (isFocusableTarget) {
            // Item selektieren, Edit-Modus betreten und geklicktes Element fokussieren
            if (index !== this._selectedPosition) {
              this.focus(index);
              this.select(index);
            }
            if (!this.editMode) {
              this.editMode = true;
              const activeItem = this.keyManager.activeItem;
              if (activeItem) {
                this.enableItemTabStops(activeItem);
              }
            }
            this.focusNow(clickTarget);
          } else if (index !== this._selectedPosition) {
            this.focus(index);
            this.select(index);
          }
        })
      );
    });
  }

  /**
   * Merkt sich die Position als Selektionsposition und aktualisiert den luxSelected-Wert
   * aller luxItems, die hier bekannt sind.
   * @param position
   */
  private select(position: number | undefined) {
    this._selectedPosition = position;
    this.previousFocusedPosition = position;
    this.luxSelectedPositionChange.emit(position!);

    this.luxItems().forEach((listItem: LuxListItemComponent) => {
      listItem.luxSelected.set(false);
    });

    const selectedListItem = this.findListItem(position);
    if (selectedListItem) {
      selectedListItem.luxSelected.set(true);
    }
  }

  /**
   * Setzt tabindex="0" auf alle navigierbaren Elemente des angegebenen List-Items.
   */
  private enableItemTabStops(item: LuxListItemComponent): void {
    const elements = item.elementRef.nativeElement.querySelectorAll(NAVIGABLE_SELECTORS);
    (Array.from(elements) as HTMLElement[]).forEach((el) => {
      el.tabIndex = 0;
      el.removeAttribute('data-lux-focusable');
    });
  }

  private hasOpenOverlayInActiveItem(): boolean {
    const activeItem = this.keyManager.activeItem;
    if (!activeItem) return false;

    const el = activeItem.elementRef.nativeElement;
    return (
      !!el.querySelector('[aria-expanded="true"]') ||
      !!el.querySelector('[aria-haspopup]:not([aria-expanded="false"]):not([aria-expanded])')
    );
  }

  private focusNow(el: HTMLElement | FocusableOption | null): void {
    if (el) {
      el.focus();
    }
  }

  /**
   * Gibt alle fokussierbaren interaktiven Elemente innerhalb des List-Items zurück.
   */
  private getFocusableElements(listItem: LuxListItemComponent): HTMLElement[] {
    const elements = listItem.elementRef.nativeElement.querySelectorAll(NAVIGABLE_SELECTORS);
    return Array.from(elements) as HTMLElement[];
  }

  /**
   * Selektiert das aktive Item und aktiviert anschließend den Bearbeiten-Modus,
   * sofern das Item interaktive Elemente enthält.
   * Hinweis: Die Selektion erfolgt bewusst immer – auch wenn kein Edit-Modus
   * aktiviert wird (kein interaktiver Inhalt).
   */
  private selectAndEnterEditMode(): void {
    const activeIndex = this.keyManager.activeItemIndex;
    if (activeIndex == null || activeIndex < 0) return;
    this.select(activeIndex);
    const activeItem = this.keyManager.activeItem;
    if (activeItem && this.getFocusableElements(activeItem).length > 0) {
      this.enterEditMode();
    }
  }

  /**
   * Aktiviert den Bearbeiten-Modus: Setzt tabindex="0" auf alle navigierbaren Elemente
   * der aktiven Kachel und fokussiert das Element an focusIndex (Standard: 0).
   */
  private enterEditMode(focusIndex = 0): void {
    if (!this.editMode) {
      const activeItem = this.keyManager.activeItem;
      if (!activeItem) return;

      this.editMode = true;
      this.enableItemTabStops(activeItem);

      const focusableElements = this.getFocusableElements(activeItem);
      if (focusableElements.length > 0) {
        const idx = focusIndex >= 0 && focusIndex < focusableElements.length ? focusIndex : 0;
        this.focusNow(focusableElements[idx]);
      }
    }
  }

  /**
   * Beendet den Bearbeiten-Modus: Setzt tabindex="-1" auf alle navigierbaren Elemente
   * der aktiven Kachel.
   * @param moveFocusToRow Wenn true (Standard), wird der Fokus auf die Zeilenebene verschoben.
   */
  private exitEditMode(moveFocusToRow = true): void {
    if (this.editMode) {
      const activeItem = this.keyManager.activeItem;
      this.editMode = false;
      this.disableInnerTabStops();
      if (moveFocusToRow && activeItem) {
        this.focusNow(activeItem);
      }
    }
  }

  /**
   * Ruft focus(activeItemIndex) auf, sofern der Index nicht null ist.
   */
  private focusActiveItem(): void {
    const idx = this.keyManager.activeItemIndex;
    if (idx != null) {
      this.focus(idx);
    }
  }

  /**
   * Merkt sich die position als Fokus-Position und aktualisiert die CSS-Klassen der ListItems.
   * @param position
   */
  private focus(position: number | undefined) {
    if (this.editMode) {
      this.exitEditMode(false);
    }
    this.keyManager.setActiveItem(position!);

    this.luxFocusedPositionChange.emit(position!);
    this.luxFocusedItemChange.emit(this.keyManager.activeItem!);

    this.previousFocusedPosition = position;
  }

  /**
   * Scrollt zu dem Element an der position.
   * @param position
   */
  private scroll(position: number | undefined) {
    const listItem = this.keyManager.activeItem;

    if (listItem) {
      listItem.elementRef.nativeElement.scrollIntoView(true);
    }
  }

  /**
   * Gibt das ListItem an der position zurück bzw. "null" wenn es nicht gefunden wurde.
   * @param position
   */
  private findListItem(position: number | undefined): LuxListItemComponent | null {
    return this.luxItems().find((listItem: LuxListItemComponent, index: number) => index === position) ?? null;
  }

  private getTagName(event: FocusEvent) {
    let tagName = '';

    if (event.relatedTarget && event.relatedTarget instanceof HTMLElement && (event.relatedTarget as HTMLElement).tagName) {
      tagName = (event.relatedTarget as HTMLElement).tagName.toLocaleLowerCase();
    }

    return tagName;
  }

  /**
   * Setzt tabindex="-1" auf alle interaktiven Elemente innerhalb aller Kacheln.
   * Dadurch ist die Liste ein einziger Tab-Stopp; interaktive Elemente sind nur
   * im Bearbeiten-Modus (Enter/F2/Mausklick) per programmatischem focus() erreichbar.
   * Der if-Guard (tabIndex !== -1) verhindert unnötige DOM-Schreibzugriffe, wenn
   * die Elemente bereits korrekt gesetzt sind.
   */
  private disableInnerTabStops(): void {
    const activeItem = this.editMode ? this.keyManager.activeItem : null;

    this.luxItems().forEach((item) => {
      // Im Bearbeiten-Modus die aktive Kachel überspringen – ihre Tab-Stops sind bewusst aktiv.
      if (item === activeItem) return;

      const elements = item.elementRef.nativeElement.querySelectorAll(FOCUSABLE_SELECTORS);
      (Array.from(elements) as HTMLElement[]).forEach((el) => {
        if (el.tabIndex !== -1) {
          el.dataset['luxFocusable'] = 'true';
          el.tabIndex = -1;
        }
      });
    });
  }
}
