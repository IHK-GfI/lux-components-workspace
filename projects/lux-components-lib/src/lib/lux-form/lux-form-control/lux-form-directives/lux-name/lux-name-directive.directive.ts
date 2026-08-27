import { Directive, ElementRef, Renderer2, effect, inject, input } from '@angular/core';

@Directive({ selector: '[luxNameAttr]' })
export class LuxNameDirectiveDirective {
  protected elementRef = inject(ElementRef);
  protected renderer = inject(Renderer2);

  readonly luxNameAttr = input<string | undefined>('');

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
