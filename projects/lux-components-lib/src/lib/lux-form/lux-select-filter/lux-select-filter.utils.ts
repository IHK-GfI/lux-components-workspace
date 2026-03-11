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
