import { Directive, input } from '@angular/core';
import { LuxAriaBase } from './lux-aria-base';

@Directive({
  selector: '[luxAriaRequired]'
})
export class LuxAriaRequiredDirective extends LuxAriaBase<boolean> {
  protected ariaTagName = 'aria-required';

  readonly luxAriaRequiredSelector = input<string>();
  readonly luxAriaRequired = input<boolean>();

  getSelector(): string | undefined {
    return this.luxAriaRequiredSelector();
  }

  getValue(): boolean | undefined {
    return this.luxAriaRequired();
  }
}
