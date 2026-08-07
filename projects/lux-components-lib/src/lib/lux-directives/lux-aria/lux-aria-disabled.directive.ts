import { Directive, Input } from '@angular/core';
import { LuxAriaBase } from './lux-aria-base';

/**
 * Setzt "aria-disabled" per Renderer2 am Host- oder einem per Selector gewählten
 * Kindelement. Nötig statt eines [attr.aria-disabled]-Template-Bindings, weil
 * Material-Komponenten (z.B. MatButton, MatMenuItem) dasselbe Attribut per
 * Host-Binding verwalten und einen initial gesetzten Template-Wert im ersten
 * Change-Detection-Zyklus wieder überschreiben würden.
 */
@Directive({
  selector: '[luxAriaDisabled]'
})
export class LuxAriaDisabledDirective extends LuxAriaBase<string> {
  protected ariaTagName = 'aria-disabled';
  _luxAriaDisabled?: string;

  @Input() luxAriaDisabledSelector?: string;

  @Input()
  get luxAriaDisabled() {
    return this._luxAriaDisabled;
  }

  set luxAriaDisabled(value: string | undefined) {
    this._luxAriaDisabled = value;

    this.renderAria();
  }

  getSelector(): string | undefined {
    return this.luxAriaDisabledSelector;
  }

  getValue(): string | undefined {
    return this._luxAriaDisabled;
  }
}
