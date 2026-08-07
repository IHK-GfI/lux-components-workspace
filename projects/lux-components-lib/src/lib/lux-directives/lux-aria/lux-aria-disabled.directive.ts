import { AfterViewChecked, Directive, Input } from '@angular/core';
import { LuxAriaBase } from './lux-aria-base';

/**
 * Setzt "aria-disabled" per Renderer2 am Host- oder einem per Selector gewählten
 * Kindelement. Nötig statt eines [attr.aria-disabled]-Template-Bindings, weil
 * Material-Komponenten (z.B. MatButton, MatMenuItem) dasselbe Attribut per
 * Host-Binding verwalten und einen initial gesetzten Template-Wert im ersten
 * Change-Detection-Zyklus wieder überschreiben würden. MatButton bietet zwar
 * einen eigenen aria-disabled-Input an, MatMenuItem aber nicht; die Direktive
 * deckt beide Fälle einheitlich ab.
 */
@Directive({
  selector: '[luxAriaDisabled]'
})
export class LuxAriaDisabledDirective extends LuxAriaBase<string> implements AfterViewChecked {
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

  ngAfterViewChecked(): void {
    // Fremde Host-Bindings (z.B. MatMenuItem: aria-disabled = disabled) schreiben das
    // Attribut neu, sobald sich ihr eigener Wert ändert (etwa luxDisabled true -> false),
    // ohne dass sich der Wert dieser Direktive geändert hätte. Deshalb wird ein gesetzter
    // Zielwert nach jedem Check-Zyklus abgeglichen und bei Abweichung erneut gesetzt.
    // Ist kein Wert gesetzt, verwaltet das fremde Host-Binding das Attribut allein.
    if (!this.init || this._luxAriaDisabled === null || this._luxAriaDisabled === undefined) {
      return;
    }

    const selector = this.getSelector();
    const el = selector ? this.elementRef.nativeElement.querySelector(selector) : this.elementRef.nativeElement;
    if (el && el.getAttribute('aria-disabled') !== this._luxAriaDisabled) {
      this.renderer.setAttribute(el, 'aria-disabled', this._luxAriaDisabled);
    }
  }
}
