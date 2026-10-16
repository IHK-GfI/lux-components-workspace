import { Directive, input } from '@angular/core';
import { LuxAriaBase } from './lux-aria-base';

@Directive({
  selector: '[luxAriaLabel]'
})
export class LuxAriaLabelDirective extends LuxAriaBase<string> {
  protected ariaTagName = 'aria-label';

  readonly luxAriaLabelSelector = input<string>();
  readonly luxAriaLabel = input<string>();

  getSelector(): string | undefined {
    if (this.luxAriaLabelSelector()) {
      return this.luxAriaLabelSelector();
    }

    const tagName = this.elementRef.nativeElement.tagName.toLowerCase();
    if (tagName === 'lux-button' || tagName === 'lux-app-header-action-nav-item') {
      return 'button';
    }

    return undefined;
  }

  getValue(): string | undefined {
    return this.luxAriaLabel();
  }
}
