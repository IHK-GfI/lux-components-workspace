/**
 * Utility-Funktionen für Filter-Operationen.
 */
export const LuxSelectFilterUtils = {
  /**
   * Normalisiert einen Wert zu lowercase String.
   */
  normalize(value: unknown): string {
    return ('' + (value ?? '')).toLocaleLowerCase();
  },

  /**
   * Prüft, ob ein Text den Filter enthält (case-insensitive).
   */
  matches(text: string, filter: string): boolean {
    const normalizedText = this.normalize(text);
    const normalizedFilter = this.normalize(filter).trim();
    return !normalizedFilter || normalizedText.includes(normalizedFilter);
  },

  /**
   * Sortiert Items stabil: selektierte zuerst, dann rest.
   */
  sortWithSelectedFirst<T>(items: readonly T[], selectedSet: Set<T>): T[] {
    const selected: T[] = [];
    const unselected: T[] = [];

    for (const item of items) {
      if (selectedSet.has(item)) {
        selected.push(item);
      } else {
        unselected.push(item);
      }
    }

    return [...selected, ...unselected];
  },

  /**
   * Sortiert Indizes stabil: selektierte zuerst, dann rest.
   */
  sortIndexesWithSelectedFirst(itemCount: number, selectedIndexSet: Set<number>): number[] {
    const selectedIndexes = Array.from(selectedIndexSet).sort((a, b) => a - b);
    const unselectedIndexes: number[] = [];

    for (let i = 0; i < itemCount; i++) {
      if (!selectedIndexSet.has(i)) {
        unselectedIndexes.push(i);
      }
    }

    return [...selectedIndexes, ...unselectedIndexes];
  },

  /**
   * Findet selektierte Indizes basierend auf Vergleichsfunktion.
   */
  findSelectedIndexes<T>(items: readonly T[], selectedValues: any, compareFn: (a: T, b: any) => boolean): Set<number> {
    const selectedIndexes = new Set<number>();
    const selectedArray = Array.isArray(selectedValues) ? selectedValues : [selectedValues];

    for (const selectedValue of selectedArray) {
      if (selectedValue !== null && selectedValue !== undefined) {
        const index = items.findIndex((item) => compareFn(item, selectedValue));
        if (index >= 0) {
          selectedIndexes.add(index);
        }
      }
    }

    return selectedIndexes;
  },

  /**
   * Findet selektierte Indizes basierend auf Pick-Values.
   */
  findSelectedIndexesByPickValue(pickValues: readonly any[], selectedPickValues: any): Set<number> {
    const selectedIndexes = new Set<number>();
    const selectedArray = Array.isArray(selectedPickValues) ? selectedPickValues : [selectedPickValues];

    for (const selectedValue of selectedArray) {
      if (selectedValue !== null && selectedValue !== undefined) {
        const index = pickValues.findIndex((value) => value === selectedValue);
        if (index >= 0) {
          selectedIndexes.add(index);
        }
      }
    }

    return selectedIndexes;
  },

  /**
   * Fokussiert das nächste fokussierbare Element im Dokument.
   */
  focusNextFocusableElement(currentElement: HTMLElement): void {
    const focusableElements = this.getFocusableElements();
    const currentIndex = focusableElements.indexOf(currentElement);
    if (currentIndex < 0) {
      return;
    }

    focusableElements[currentIndex + 1]?.focus();
  },

  /**
   * Fokussiert das vorherige fokussierbare Element im Dokument.
   */
  focusPreviousFocusableElement(currentElement: HTMLElement): void {
    const focusableElements = this.getFocusableElements();
    const currentIndex = focusableElements.indexOf(currentElement);
    if (currentIndex <= 0) {
      return;
    }

    focusableElements[currentIndex - 1]?.focus();
  },

  /**
   * Liefert alle aktuell fokussierbaren Elemente in Dokument-Reihenfolge.
   */
  getFocusableElements(): HTMLElement[] {
    const candidates = Array.from(
      document.querySelectorAll(
        'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
      )
    ) as HTMLElement[];

    return candidates.filter((element) => this.isFocusableVisible(element));
  },

  /**
   * Prüft ob ein Fokusziel sichtbar und nutzbar ist.
   */
  isFocusableVisible(element: HTMLElement): boolean {
    if (!element.isConnected) {
      return false;
    }

    if (element.closest('[aria-hidden="true"], [hidden]')) {
      return false;
    }

    let currentElement: HTMLElement | null = element;
    while (currentElement) {
      const style = window.getComputedStyle(currentElement);
      if (style.display === 'none' || style.visibility === 'hidden') {
        return false;
      }
      currentElement = currentElement.parentElement;
    }

    return true;
  }
} as const;
