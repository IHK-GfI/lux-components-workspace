import { Directive, ElementRef, Input, Renderer2, inject } from '@angular/core';

@Directive({ selector: '[luxMaxLengthAttr]' })
export class LuxMaxLengthDirective {
  protected elementRef = inject(ElementRef);
  protected renderer = inject(Renderer2);

  _luxMaxLengthAttr = 0;

  @Input()
  get luxMaxLengthAttr() {
    return this._luxMaxLengthAttr;
  }

  set luxMaxLengthAttr(maxLength: number) {
    this._luxMaxLengthAttr = maxLength;

    if (this._luxMaxLengthAttr) {
      this.renderer.setAttribute(this.elementRef.nativeElement, 'maxlength', '' + this._luxMaxLengthAttr);
    } else {
      this.renderer.removeAttribute(this.elementRef.nativeElement, 'maxlength');
    }
  }
}
