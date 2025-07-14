import { Directive, Input } from '@angular/core';
import { LUX_ARIA_TAG_NAME, LuxAriaBase } from './lux-aria-base';

@Directive({ 
  selector: '[luxAriaRequired]',
  providers: [{ provide: LUX_ARIA_TAG_NAME, useValue: 'aria-required' }]
})
export class LuxAriaRequiredDirective extends LuxAriaBase<boolean> {
  _luxAriaRequired?: boolean;

  @Input() luxAriaRequiredSelector?: string;

  @Input()
  get luxAriaRequired() {
    return this._luxAriaRequired;
  }

  set luxAriaRequired(required: boolean | undefined) {
    this._luxAriaRequired = required;

    this.renderAria();
  }

  constructor() {
    super();
  }

  getSelector(): string | undefined {
    return this.luxAriaRequiredSelector;
  }

  getValue(): boolean | undefined {
    return this._luxAriaRequired;
  }
}
