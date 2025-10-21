import { Directive, Input } from '@angular/core';
import { LuxAriaBase } from './lux-aria-base';

@Directive({
  selector: '[luxAriaExpanded]'
})
export class LuxAriaExpandedDirective extends LuxAriaBase<boolean> {
  protected ariaTagName = 'aria-expanded';
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
