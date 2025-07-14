import { Directive, Input } from '@angular/core';
import { LUX_ARIA_TAG_NAME, LuxAriaBase } from './lux-aria-base';

@Directive({ 
  selector: '[luxAriaInvalid]',
  providers: [{ provide: LUX_ARIA_TAG_NAME, useValue: 'aria-invalid' }]
})
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
    super();
  }

  getSelector(): string | undefined {
    return this.luxAriaInvalidSelector;
  }

  getValue(): string | undefined {
    return this._luxAriaInvalid;
  }
}
