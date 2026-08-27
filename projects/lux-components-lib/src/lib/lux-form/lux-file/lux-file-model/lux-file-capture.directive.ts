import { Directive, ElementRef, Renderer2, effect, inject, input } from '@angular/core';

@Directive({ selector: '[luxFileCapture]' })
export class LuxFileCaptureDirective {
  protected elementRef = inject(ElementRef);
  protected renderer = inject(Renderer2);

  readonly luxFileCapture = input('');

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
