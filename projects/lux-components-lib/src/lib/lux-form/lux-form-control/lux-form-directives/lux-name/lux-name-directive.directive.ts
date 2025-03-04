import { Directive, ElementRef, Input, Renderer2, inject } from '@angular/core';

@Directive({ selector: '[luxNameAttr]' })
export class LuxNameDirectiveDirective {
  protected elementRef = inject(ElementRef);
  protected renderer = inject(Renderer2);

  _luxNameAttr? = '';

  @Input()
  get luxNameAttr() {
    return this._luxNameAttr;
  }

  set luxNameAttr(name: string | undefined) {
    this._luxNameAttr = name;

    if (this._luxNameAttr) {
      this.renderer.setAttribute(this.elementRef.nativeElement, 'name', this._luxNameAttr);
    } else {
      this.renderer.removeAttribute(this.elementRef.nativeElement, 'name');
    }
  }
}
