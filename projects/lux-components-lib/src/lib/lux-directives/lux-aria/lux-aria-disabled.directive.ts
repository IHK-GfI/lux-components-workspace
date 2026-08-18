import { AfterViewChecked, Directive, input } from '@angular/core';
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

  luxAriaDisabledSelector = input<string | undefined>();
  luxAriaDisabled = input<string | undefined>();

  // Merker, ob diese Direktive das Attribut aktuell gesetzt hat. Nur dann darf es
  // beim Zurücksetzen des Inputs entfernt werden; ein von einem fremden
  // Host-Binding geschriebenes Attribut wird nicht angetastet.
  private applied = false;

  getSelector(): string | undefined {
    return this.luxAriaDisabledSelector();
  }

  getValue(): string | undefined {
    return this.luxAriaDisabled();
  }

  ngAfterViewChecked(): void {
    // Fremde Host-Bindings (z.B. MatMenuItem: aria-disabled = disabled) schreiben das
    // Attribut neu, sobald sich ihr eigener Wert ändert (etwa luxDisabled true -> false),
    // ohne dass sich der Wert dieser Direktive geändert hätte. Deshalb wird ein gesetzter
    // Zielwert nach jedem Check-Zyklus abgeglichen und bei Abweichung erneut gesetzt.
    // Ist kein Wert gesetzt, verwaltet das fremde Host-Binding das Attribut allein;
    // nur ein zuvor von dieser Direktive gesetzter Wert wird dann einmalig entfernt.
    if (!this.init) {
      return;
    }

    const value = this.luxAriaDisabled();
    const selector = this.getSelector();
    const el = selector ? this.elementRef.nativeElement.querySelector(selector) : this.elementRef.nativeElement;
    if (!el) {
      return;
    }

    if (value === null || value === undefined) {
      if (this.applied) {
        this.renderer.removeAttribute(el, 'aria-disabled');
        this.applied = false;
      }
      return;
    }

    if (el.getAttribute('aria-disabled') !== value) {
      this.renderer.setAttribute(el, 'aria-disabled', value);
    }
    this.applied = true;
  }
}
