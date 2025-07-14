import { Directive, Input } from '@angular/core';
import { LUX_ARIA_TAG_NAME, LuxAriaBase } from './lux-aria-base';

@Directive({ 
  selector: '[luxAriaRole]',
  providers: [{ provide: LUX_ARIA_TAG_NAME, useValue: 'role' }]
})
export class LuxAriaRoleDirective extends LuxAriaBase<string> {
  _luxAriaRole?: string;

  @Input() luxAriaRoleSelector?: string;

  @Input()
  get luxAriaRole() {
    return this._luxAriaRole;
  }

  set luxAriaRole(role: string | undefined) {
    this._luxAriaRole = role;

    this.renderAria();
  }

  constructor() {
    super();
  }

  getSelector(): string | undefined {
    return this.luxAriaRoleSelector;
  }

  getValue(): string | undefined {
    return this._luxAriaRole;
  }
}
