import { Directive, input } from '@angular/core';
import { LuxAriaBase } from './lux-aria-base';

@Directive({
  selector: '[luxAriaDescribedby]'
})
export class LuxAriaDescribedbyDirective extends LuxAriaBase<string> {
  protected ariaTagName = 'aria-describedby';

  readonly luxAriaDescribedbySelector = input<string>();
  readonly luxAriaDescribedby = input<string>();

  getSelector(): string | undefined {
    if (this.luxAriaDescribedbySelector()) {
      return this.luxAriaDescribedbySelector();
    }

    const tagName = this.elementRef.nativeElement.tagName.toLowerCase();
    if (tagName === 'lux-button' || tagName === 'lux-app-header-action-nav-item') {
      return 'button';
    }

    return undefined;
  }

  getValue(): string | undefined {
    return this.luxAriaDescribedby();
  }
}
