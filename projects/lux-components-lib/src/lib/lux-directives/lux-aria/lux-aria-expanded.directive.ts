import { Directive, input } from '@angular/core';
import { LuxAriaBase } from './lux-aria-base';

@Directive({
  selector: '[luxAriaExpanded]'
})
export class LuxAriaExpandedDirective extends LuxAriaBase<boolean> {
  protected ariaTagName = 'aria-expanded';

  readonly luxAriaExpandedSelector = input<string>();
  readonly luxAriaExpanded = input<boolean>();

  getSelector(): string | undefined {
    if (this.luxAriaExpandedSelector()) {
      return this.luxAriaExpandedSelector();
    }

    const tagName = this.elementRef.nativeElement.tagName.toLowerCase();
    if (tagName === 'lux-button') {
      return 'button';
    }

    return undefined;
  }

  getValue(): boolean | undefined {
    return this.luxAriaExpanded();
  }
}
