import { Directive, ElementRef, Input, Renderer2, inject } from '@angular/core';
import { LuxAriaBase } from './lux-aria-base';

@Directive({ selector: '[luxAriaRequired]' })
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
    super('aria-required');
  }

  getSelector(): string | undefined {
    return this.luxAriaRequiredSelector;
  }

  getValue(): boolean | undefined {
    return this._luxAriaRequired;
  }
}
