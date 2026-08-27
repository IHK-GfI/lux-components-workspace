import { AfterViewInit, Directive, effect, ElementRef, inject, input, Renderer2, untracked } from '@angular/core';

@Directive({ selector: '[luxTabIndex]' })
export class LuxTabIndexDirective implements AfterViewInit {
  private elementRef = inject(ElementRef);
  private renderer = inject(Renderer2);

  private viewInitialized = false;

  readonly luxTabIndex = input('0');
  readonly luxApplyToParent = input(false);
  readonly luxApplyToChildren = input(true);
  readonly luxPotentialChildren = input<string[]>(['input', 'textarea', 'a', 'button', 'mat-select']);

  constructor() {
    effect(() => {
      this.luxTabIndex();
      // Nur luxTabIndex-Änderungen lösen ein erneutes Update aus (wie zuvor via ngOnChanges).
      // Die übrigen Inputs werden untracked gelesen, damit sie kein eigenes Update auslösen.
      untracked(() => {
        if (this.viewInitialized) {
          this.updateElementsWithTabIndex();
        }
      });
    });
  }

  ngAfterViewInit() {
    this.viewInitialized = true;
    this.updateElementsWithTabIndex();
  }

  /**
   * Aktualisiert den Tabindex für
   *  - das Zielelement, wenn luxApplyToParent === true (default = false) ist
   *  - potentielle Kindelemente, wenn luxApplyToChildren === true (default) ist
   */
  private updateElementsWithTabIndex() {
    if (this.luxApplyToParent()) {
      this.setTabIndexForElement(this.elementRef.nativeElement);
    }

    if (this.luxApplyToChildren()) {
      this.luxPotentialChildren().forEach((childQuery: string) => this.setTabIndexByQuery(childQuery));
    }
  }

  private setTabIndexByQuery(elementQuery: string) {
    const elements = this.elementRef.nativeElement.querySelectorAll(elementQuery);
    for (const element of elements) {
      this.setTabIndexForElement(element);
    }
  }

  private setTabIndexForElement(element: HTMLElement) {
    this.renderer.setAttribute(element, 'tabIndex', this.luxTabIndex());
  }
}
