import { Directive, input } from '@angular/core';
import { LuxAriaBase } from './lux-aria-base';

@Directive({
  selector: '[luxAriaHidden]'
})
export class LuxAriaHiddenDirective extends LuxAriaBase<boolean> {
  protected ariaTagName = 'aria-hidden';

  readonly luxAriaHiddenSelector = input<string>();
  readonly luxAriaHidden = input<boolean>();

  getSelector(): string | undefined {
    return this.luxAriaHiddenSelector();
  }

  getValue(): boolean | undefined {
    return this.luxAriaHidden();
  }
}
