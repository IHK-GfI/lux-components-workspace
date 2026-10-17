import { Directive, input } from '@angular/core';
import { LuxAriaBase } from './lux-aria-base';

@Directive({
  selector: '[luxAriaHasPopup]'
})
export class LuxAriaHaspopupDirective extends LuxAriaBase<boolean> {
  protected ariaTagName = 'aria-haspopup';

  readonly luxAriaHasPopupSelector = input<string>();
  readonly luxAriaHasPopup = input<boolean>();

  getSelector(): string | undefined {
    if (this.luxAriaHasPopupSelector()) {
      return this.luxAriaHasPopupSelector();
    }

    const tagName = this.elementRef.nativeElement.tagName.toLowerCase();
    if (tagName === 'lux-button' || tagName === 'lux-app-header-action-nav-item') {
      return 'button';
    }

    return undefined;
  }

  getValue(): boolean | undefined {
    return this.luxAriaHasPopup();
  }
}
