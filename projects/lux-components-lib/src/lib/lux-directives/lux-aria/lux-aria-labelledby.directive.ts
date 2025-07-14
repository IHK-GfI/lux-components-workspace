import { Directive, Input } from '@angular/core';
import { LUX_ARIA_TAG_NAME, LuxAriaBase } from './lux-aria-base';

@Directive({ 
  selector: '[luxAriaLabelledby]',
  providers: [{ provide: LUX_ARIA_TAG_NAME, useValue: 'aria-labelledby' }]
})
export class LuxAriaLabelledbyDirective extends LuxAriaBase<string> {
  _luxAriaLabelledby?: string;

  @Input() luxAriaLabelledbySelector?: string;

  @Input()
  get luxAriaLabelledby() {
    return this._luxAriaLabelledby;
  }

  set luxAriaLabelledby(labelledby: string | undefined) {
    this._luxAriaLabelledby = labelledby;

    this.renderAria();
  }

  constructor() {
    super();

    if (!this.luxAriaLabelledbySelector) {
      const tagName = this.elementRef.nativeElement.tagName.toLowerCase();
      if (tagName === 'lux-button') {
        this.luxAriaLabelledbySelector = 'button';
      } else if (tagName === 'lux-app-header-action-nav-item') {
        this.luxAriaLabelledbySelector = 'button';
      }
    }
  }

  getSelector(): string | undefined {
    return this.luxAriaLabelledbySelector;
  }

  getValue(): string | undefined {
    return this._luxAriaLabelledby;
  }
}
