import { AfterViewInit, Directive, ElementRef, inject, Renderer2 } from '@angular/core';

@Directive()
export abstract class LuxAriaBase<T> implements AfterViewInit {
  protected init = false;
  protected elementRef = inject(ElementRef);
  protected renderer = inject(Renderer2);

  protected constructor(protected ariaTagName: string) {}

  ngAfterViewInit(): void {
    this.init = true;

    this.renderAria();
  }

  protected renderAria() {
    if (this.init) {
      const selector = this.getSelector();

      let el;
      if (selector) {
        el = this.elementRef.nativeElement.querySelector(selector);
      } else {
        el = this.elementRef.nativeElement;
      }

      if (el) {
        const value = this.getValue();
        if (value === null || value === undefined) {
          this.renderer.removeAttribute(el, this.ariaTagName);
        } else {
          this.renderer.setAttribute(el, this.ariaTagName, '' + value);
        }
      }
    }
  }

  abstract getSelector(): string | undefined;

  abstract getValue(): T | undefined;
}
