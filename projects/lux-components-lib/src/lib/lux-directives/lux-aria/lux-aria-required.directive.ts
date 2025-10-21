import { Directive, Input } from '@angular/core';
import { LuxAriaBase } from './lux-aria-base';

@Directive({ 
  selector: '[luxAriaRequired]'
})
export class LuxAriaRequiredDirective extends LuxAriaBase<boolean> {
  protected ariaTagName = 'aria-required';
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

  getSelector(): string | undefined {
    return this.luxAriaRequiredSelector;
  }

  getValue(): boolean | undefined {
    return this._luxAriaRequired;
  }
}
