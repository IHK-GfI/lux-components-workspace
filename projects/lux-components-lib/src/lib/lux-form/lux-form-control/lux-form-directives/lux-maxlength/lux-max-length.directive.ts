import { Directive, ElementRef, Renderer2, effect, inject, input } from '@angular/core';

@Directive({ selector: '[luxMaxLengthAttr]' })
export class LuxMaxLengthDirective {
  readonly luxMaxLengthAttr = input(0);

  protected elementRef = inject(ElementRef);
  protected renderer = inject(Renderer2);

  constructor() {
    effect(() => {
      const maxLength = this.luxMaxLengthAttr();

      if (maxLength) {
        this.renderer.setAttribute(this.elementRef.nativeElement, 'maxlength', '' + maxLength);
      } else {
        this.renderer.removeAttribute(this.elementRef.nativeElement, 'maxlength');
      }
    });
  }
}
