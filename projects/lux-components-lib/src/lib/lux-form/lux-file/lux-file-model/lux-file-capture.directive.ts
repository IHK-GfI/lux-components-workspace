import { Directive, ElementRef, Input, Renderer2, inject } from '@angular/core';

@Directive({ selector: '[luxFileCapture]' })
export class LuxFileCaptureDirective {
  protected elementRef = inject(ElementRef);
  protected renderer = inject(Renderer2);

  _luxFileCapture = '';

  @Input()
  get luxFileCapture() {
    return this._luxFileCapture;
  }

  set luxFileCapture(label: string) {
    this._luxFileCapture = label;

    if (this._luxFileCapture) {
      this.renderer.setAttribute(this.elementRef.nativeElement, 'capture', this._luxFileCapture);
    } else {
      this.renderer.removeAttribute(this.elementRef.nativeElement, 'capture');
    }
  }
}
