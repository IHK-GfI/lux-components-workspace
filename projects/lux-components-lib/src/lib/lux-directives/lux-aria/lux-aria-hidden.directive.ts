import { Directive, Input } from '@angular/core';
import { LUX_ARIA_TAG_NAME, LuxAriaBase } from './lux-aria-base';

@Directive({ 
  selector: '[luxAriaHidden]',
  providers: [{ provide: LUX_ARIA_TAG_NAME, useValue: 'aria-hidden' }]
})
export class LuxAriaHiddenDirective extends LuxAriaBase<boolean> {
  _luxAriaHidden?: boolean;

  @Input() luxAriaHiddenSelector?: string;

  @Input()
  get luxAriaHidden() {
    return this._luxAriaHidden;
  }

  set luxAriaHidden(hidden: boolean | undefined) {
    this._luxAriaHidden = hidden;

    this.renderAria();
  }

  constructor() {
    super();
  }

  getSelector(): string | undefined {
    return this.luxAriaHiddenSelector;
  }

  getValue(): boolean | undefined {
    return this._luxAriaHidden;
  }
}
