import { Directive, input } from '@angular/core';
import { LuxAriaBase } from './lux-aria-base';

@Directive({
  selector: '[luxAriaLabelledby]'
})
export class LuxAriaLabelledbyDirective extends LuxAriaBase<string> {
  protected ariaTagName = 'aria-labelledby';

  readonly luxAriaLabelledbySelector = input<string>();
  readonly luxAriaLabelledby = input<string>();

  getSelector(): string | undefined {
    if (this.luxAriaLabelledbySelector()) {
      return this.luxAriaLabelledbySelector();
    }

    const tagName = this.elementRef.nativeElement.tagName.toLowerCase();
    if (tagName === 'lux-button' || tagName === 'lux-app-header-action-nav-item') {
      return 'button';
    }

    return undefined;
  }

  getValue(): string | undefined {
    return this.luxAriaLabelledby();
  }
}
