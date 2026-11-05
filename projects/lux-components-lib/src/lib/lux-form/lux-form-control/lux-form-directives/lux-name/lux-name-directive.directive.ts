import { Directive, ElementRef, Renderer2, effect, inject, input } from '@angular/core';

@Directive({ selector: '[luxNameAttr]' })
export class LuxNameDirective {
  readonly luxNameAttr = input<string | undefined>('');

  protected elementRef = inject(ElementRef);
  protected renderer = inject(Renderer2);

  constructor() {
    effect(() => {
      const name = this.luxNameAttr();

      if (name) {
        this.renderer.setAttribute(this.elementRef.nativeElement, 'name', name);
      } else {
        this.renderer.removeAttribute(this.elementRef.nativeElement, 'name');
      }
    });
  }
}
