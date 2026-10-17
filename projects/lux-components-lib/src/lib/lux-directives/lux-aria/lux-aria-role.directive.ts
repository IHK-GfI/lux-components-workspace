import { Directive, input } from '@angular/core';
import { LuxAriaBase } from './lux-aria-base';

@Directive({
  selector: '[luxAriaRole]'
})
export class LuxAriaRoleDirective extends LuxAriaBase<string> {
  protected ariaTagName = 'role';

  readonly luxAriaRoleSelector = input<string>();
  readonly luxAriaRole = input<string>();

  getSelector(): string | undefined {
    return this.luxAriaRoleSelector();
  }

  getValue(): string | undefined {
    return this.luxAriaRole();
  }
}
