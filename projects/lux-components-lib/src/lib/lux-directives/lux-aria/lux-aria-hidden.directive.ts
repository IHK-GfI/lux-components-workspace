import { Directive, Input } from '@angular/core';
import { LuxAriaBase } from './lux-aria-base';

@Directive({ selector: '[luxAriaHidden]' })
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
    super('aria-hidden');
  }

  getSelector(): string | undefined {
    return this.luxAriaHiddenSelector;
  }

  getValue(): boolean | undefined {
    return this._luxAriaHidden;
  }
}
