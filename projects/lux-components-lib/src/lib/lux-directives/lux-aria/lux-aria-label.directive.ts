import { Directive, Input } from '@angular/core';
import { LUX_ARIA_TAG_NAME, LuxAriaBase } from './lux-aria-base';

@Directive({ 
  selector: '[luxAriaLabel]',
  providers: [{ provide: LUX_ARIA_TAG_NAME, useValue: 'aria-label' }]
})
export class LuxAriaLabelDirective extends LuxAriaBase<string> {
  _luxAriaLabel?: string;

  @Input() luxAriaLabelSelector?: string;

  @Input()
  get luxAriaLabel() {
    return this._luxAriaLabel;
  }

  set luxAriaLabel(label: string | undefined) {
    this._luxAriaLabel = label;

    this.renderAria();
  }

  constructor() {
    super();

    if (!this.luxAriaLabelSelector) {
      const tagName = this.elementRef.nativeElement.tagName.toLowerCase();
      if (tagName === 'lux-button') {
        this.luxAriaLabelSelector = 'button';
      } else if (tagName === 'lux-app-header-action-nav-item') {
        this.luxAriaLabelSelector = 'button';
      }
    }
  }

  getSelector(): string | undefined {
    return this.luxAriaLabelSelector;
  }

  getValue(): string | undefined {
    return this._luxAriaLabel;
  }
}
