import { Directive, Input } from '@angular/core';
import { LUX_ARIA_TAG_NAME, LuxAriaBase } from './lux-aria-base';

@Directive({
  selector: '[luxAriaExpanded]',
  providers: [{ provide: LUX_ARIA_TAG_NAME, useValue: 'aria-expanded' }]
})
export class LuxAriaExpandedDirective extends LuxAriaBase<boolean> {
  _luxAriaExpanded?: boolean;

  @Input() luxAriaExpandedSelector?: string;

  @Input()
  get luxAriaExpanded() {
    return this._luxAriaExpanded;
  }

  set luxAriaExpanded(expanded: boolean | undefined) {
    this._luxAriaExpanded = expanded;

    this.renderAria();
  }

  constructor() {
    super();

    if (!this.luxAriaExpandedSelector) {
      const tagName = this.elementRef.nativeElement.tagName.toLowerCase();
      if (tagName === 'lux-button') {
        this.luxAriaExpandedSelector = 'button';
      }
    }
  }

  getSelector(): string | undefined {
    return this.luxAriaExpandedSelector;
  }

  getValue(): boolean | undefined {
    return this._luxAriaExpanded;
  }
}
