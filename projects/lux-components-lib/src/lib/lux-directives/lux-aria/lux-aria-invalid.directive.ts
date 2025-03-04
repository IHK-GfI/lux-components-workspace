import { Directive, Input } from '@angular/core';
import { LuxAriaBase } from './lux-aria-base';

@Directive({ selector: '[luxAriaInvalid]' })
export class LuxAriaInvalidDirective extends LuxAriaBase<string> {
  _luxAriaInvalid?: string;

  @Input() luxAriaInvalidSelector?: string;

  @Input()
  get luxAriaInvalid() {
    return this._luxAriaInvalid;
  }

  set luxAriaInvalid(invalid: string | undefined) {
    this._luxAriaInvalid = invalid;

    this.renderAria();
  }

  constructor() {
    super('aria-invalid');
  }

  getSelector(): string | undefined {
    return this.luxAriaInvalidSelector;
  }

  getValue(): string | undefined {
    return this._luxAriaInvalid;
  }
}
