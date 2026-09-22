import { Directive, input } from '@angular/core';
import { LuxAriaBase } from './lux-aria-base';

@Directive({
  selector: '[luxAriaInvalid]'
})
export class LuxAriaInvalidDirective extends LuxAriaBase<string> {
  protected ariaTagName = 'aria-invalid';

  readonly luxAriaInvalidSelector = input<string>();
  readonly luxAriaInvalid = input<string>();

  getSelector(): string | undefined {
    return this.luxAriaInvalidSelector();
  }

  getValue(): string | undefined {
    return this.luxAriaInvalid();
  }
}
