import { Directive, ElementRef, EventEmitter, inject, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { MatSelect } from '@angular/material/select';
import { Subject, takeUntil } from 'rxjs';

/**
 * Directive für Filter-Funktionalität auf MatSelect.
 * Übernimmt State-Management, Filter-Logik, Keyboard-Navigation und Focus-Management.
 *
 * Verwendung:
 * ```html
 * <mat-select [luxSelectFilter]="luxEnableFilter" [luxFilterLabelFn]="labelExtractor">
 *   <lux-select-panel-filter [filterDirective]="filterDirective"></lux-select-panel-filter>
 *   ...
 * </mat-select>
 * ```
 */
@Directive({
  selector: 'mat-select[luxSelectFilter]',
  exportAs: 'luxSelectFilter',
  standalone: true
})
export class LuxSelectFilterDirective<T = any> implements OnInit, OnDestroy {
  private matSelect = inject(MatSelect);
  private destroy$ = new Subject<void>();
  private focusTimeout?: ReturnType<typeof setTimeout>;
  private labelCache: string[] = [];
  private itemCache: T[] = [];

  // === INPUTS ===

  /**
   * Aktiviert/deaktiviert die Filter-Funktionalität.
   */
  @Input() luxSelectFilter = false;

  /**
   * Funktion zum Extrahieren des filterbaren Labels aus einem Item.
   * Wird für Cache-Aufbau und Filterung verwendet.
   */
  @Input() luxFilterLabelFn?: (item: T, index: number) => string;

  // === OUTPUTS ===

  /**
   * Emittiert wenn der Filter aktiv/inaktiv wird.
   * Nützlich für Lazy-Loading-Szenarien (alle Items nachladen bei Filter-Aktivierung).
   */
  @Output() luxFilterActiveChange = new EventEmitter<boolean>();

  // === PUBLIC STATE ===

  /**
   * Aktueller Filter-Wert.
   */
  filterValue = '';

  /**
   * Set der gefilterten Items.
   */
  filteredItems = new Set<T>();

  /**
   * Set der gefilterten Indizes.
   */
  filteredIndexes = new Set<number>();

  /**
   * Referenz auf das Filter-Input-Element (wird von LuxSelectPanelFilterComponent gesetzt).
   */
  filterInputRef?: ElementRef<HTMLInputElement>;

  // === LIFECYCLE ===

  ngOnInit(): void {
    // Subscribe auf Panel-Open/Close Events
    this.matSelect.openedChange.pipe(takeUntil(this.destroy$)).subscribe((open) => {
      if (open) {
        this.onPanelOpen();
      } else {
        this.onPanelClose();
      }
    });
  }

  ngOnDestroy(): void {
    this.clearFocusTimeout();
    this.destroy$.next();
    this.destroy$.complete();
  }

  // === PUBLIC API ===

  /**
   * Setzt die zu filternden Items und baut den Cache neu auf.
   * Muss aufgerufen werden, wenn sich die Items ändern.
   */
  setItems(items: readonly T[]): void {
    this.itemCache = [...items];
    this.rebuildCache();
    this.applyFilter();
  }

  /**
   * Wird vom Panel-Filter bei Eingabe aufgerufen.
   */
  onFilterInput(value: string): void {
    const wasActive = this.isFilterActive();
    this.filterValue = value;
    this.applyFilter();

    const isActive = this.isFilterActive();
    if (wasActive !== isActive) {
      this.luxFilterActiveChange.emit(isActive);
    }
  }

  /**
   * Setzt das Filter-Input-Element für Focus-Management.
   */
  setFilterInputRef(ref: ElementRef<HTMLInputElement>): void {
    this.filterInputRef = ref;
  }

  /**
   * Keyboard-Navigation für Filter-Input.
   *
   * Verhalten:
   * - Escape: Panel schließen
   * - ArrowDown/ArrowUp: Fokus auf Options-Liste verschieben und navigieren
   * - Tab: Fokus auf erste sichtbare Option
   * - Enter: NUR aktive Option selektieren wenn KeyManager bereits aktiv (activeItemIndex >= 0)
   * - Buchstaben/Zahlen: Filter-Eingabe fortsetzen (kein preventDefault!)
   */
  handleKeydown(event: KeyboardEvent): void {
    if (!this.matSelect?.panelOpen) {
      return;
    }

    // Escape: Panel schließen
    if (event.key === 'Escape') {
      event.preventDefault();
      event.stopPropagation();
      this.matSelect.close();
      return;
    }

    const keyManager = (this.matSelect as any)?._keyManager;

    // ArrowDown/ArrowUp: Fokus auf Options-Liste verschieben
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();
      event.stopPropagation();
      this.navigateToVisibleOption(event.key);
      return;
    }

    // Tab: Fokus auf erste sichtbare Option
    if (event.key === 'Tab') {
      event.preventDefault();
      event.stopPropagation();
      this.navigateToVisibleOption('ArrowDown');
      return;
    }

    // Enter: NUR wenn KeyManager bereits eine Option fokussiert hat
    if (event.key === 'Enter') {
      // Prüfen ob KeyManager aktiv ist (activeItemIndex >= 0)
      if (keyManager && keyManager.activeItemIndex >= 0) {
        event.preventDefault();
        event.stopPropagation();
        // MatSelect's normale Enter-Behandlung aufrufen
        (this.matSelect as any)?._handleKeydown(event);
      }
      // Sonst: Enter macht nichts (User tippt im Filter-Input)
      return;
    }

    // Alle anderen Tasten: Nicht preventDefault! → Filter-Eingabe fortsetzen
  }

  /**
   * Prüft, ob ein Item sichtbar (gefiltert) ist.
   */
  isItemVisible(item: T): boolean {
    return !this.isFilterActive() || this.filteredItems.has(item);
  }

  /**
   * Prüft, ob ein Index sichtbar (gefiltert) ist.
   */
  isIndexVisible(index: number): boolean {
    return !this.isFilterActive() || this.filteredIndexes.has(index);
  }

  /**
   * Prüft, ob der Filter aktiv ist (nicht-leerer Filter-Wert).
   */
  isFilterActive(): boolean {
    return this.luxSelectFilter && this.filterValue.trim().length > 0;
  }

  // === PRIVATE METHODS ===

  private onPanelOpen(): void {
    if (!this.luxSelectFilter) return;

    this.rebuildCache();
    this.applyFilter();
    this.focusFilterInput();
  }

  private onPanelClose(): void {
    if (!this.luxSelectFilter) return;

    this.clearFilter();
  }

  private rebuildCache(): void {
    if (!this.luxFilterLabelFn) {
      this.labelCache = [];
      return;
    }

    this.labelCache = this.itemCache.map((item, index) => this.normalize(this.luxFilterLabelFn!(item, index)));
  }

  private applyFilter(): void {
    const normalizedFilter = this.normalize(this.filterValue).trim();

    this.filteredItems.clear();
    this.filteredIndexes.clear();

    this.itemCache.forEach((item, index) => {
      const label = this.labelCache[index] ?? '';
      if (!normalizedFilter || label.includes(normalizedFilter)) {
        this.filteredItems.add(item);
        this.filteredIndexes.add(index);
      }
    });
  }

  private clearFilter(): void {
    if (this.filterValue) {
      this.filterValue = '';
      this.applyFilter();
      this.luxFilterActiveChange.emit(false);
    }
  }

  private focusFilterInput(): void {
    this.clearFocusTimeout();
    this.focusTimeout = setTimeout(() => {
      this.filterInputRef?.nativeElement?.focus();
      this.filterInputRef?.nativeElement?.select();
    });
  }

  private clearFocusTimeout(): void {
    if (this.focusTimeout) {
      clearTimeout(this.focusTimeout);
      this.focusTimeout = undefined;
    }
  }

  private normalize(value: unknown): string {
    return ('' + (value ?? '')).toLocaleLowerCase();
  }

  private navigateToVisibleOption(key: string): void {
    const keyManager = (this.matSelect as any)?._keyManager;
    const options = this.matSelect.options?.toArray?.() ?? [];

    const isOptionVisible = (option: any): boolean => {
      const el: HTMLElement | null = option?._getHostElement?.() ?? option?._element?.nativeElement ?? null;
      if (!el) return true;
      const style = window.getComputedStyle(el);
      return style.display !== 'none' && style.visibility !== 'hidden';
    };

    const visibleOptionIndexes = options
      .map((option: any, index: number) => ({ option, index }))
      .filter(({ option }) => isOptionVisible(option))
      .map(({ index }) => index);

    if (visibleOptionIndexes.length === 0 || !keyManager) {
      return;
    }

    const scrollIntoView = (index: number) => {
      const scrollFn = (this.matSelect as any)?._scrollOptionIntoView;
      if (typeof scrollFn === 'function') {
        scrollFn.call(this.matSelect, index);
      }
    };

    const activeIndex: number = keyManager.activeItemIndex;
    const currentPos = visibleOptionIndexes.indexOf(activeIndex);

    // Nur ArrowDown/ArrowUp Behandlung
    if (key === 'ArrowDown' || key === 'ArrowUp') {
      let nextIndex: number;
      if (currentPos === -1) {
        nextIndex = key === 'ArrowUp' ? visibleOptionIndexes[visibleOptionIndexes.length - 1] : visibleOptionIndexes[0];
      } else {
        const delta = key === 'ArrowUp' ? -1 : 1;
        const nextPos = (currentPos + delta + visibleOptionIndexes.length) % visibleOptionIndexes.length;
        nextIndex = visibleOptionIndexes[nextPos];
      }

      keyManager.setActiveItem(nextIndex);
      scrollIntoView(nextIndex);
    }
  }
}
