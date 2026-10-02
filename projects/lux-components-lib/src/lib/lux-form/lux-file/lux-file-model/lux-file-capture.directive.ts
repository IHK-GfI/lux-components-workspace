import { Directive, ElementRef, Renderer2, effect, inject, input } from '@angular/core';

@Directive({ selector: '[luxFileCapture]' })
export class LuxFileCaptureDirective {
  readonly luxFileCapture = input('');

  protected elementRef = inject(ElementRef);
  protected renderer = inject(Renderer2);

  constructor() {
    effect(() => {
      const capture = this.luxFileCapture();

      if (capture) {
        this.renderer.setAttribute(this.elementRef.nativeElement, 'capture', capture);
      } else {
        this.renderer.removeAttribute(this.elementRef.nativeElement, 'capture');
      }
    });
  }
}
