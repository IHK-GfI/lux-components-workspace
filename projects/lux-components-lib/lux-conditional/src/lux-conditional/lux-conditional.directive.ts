import { Directive, effect, inject, input, TemplateRef, untracked, ViewContainerRef } from '@angular/core';
import { LuxConditionalAnnouncer } from './lux-conditional-announcer.service';
import { LuxConditionalHostComponent } from './lux-conditional-host.component';

/**
 * Rendert das Template nur, solange die Bedingung true ist, und blendet es nach dem
 * UX-Pattern "Bedingte Formularbereiche" animiert ein und aus. Mit `announce` werden
 * Erscheinen und Verschwinden Screenreadern angesagt; der initiale Zustand nicht.
 *
 * @example
 * ```html
 * <lux-input-ac *luxConditional="showDetails(); announce: 'Arbeitgeber'" luxLabel="Arbeitgeber"></lux-input-ac>
 * ```
 */
@Directive({
  selector: '[luxConditional]'
})
export class LuxConditionalDirective {
  /** Bedingung; bei true wird der Inhalt eingehängt, bei false nach der Leave-Animation entfernt. */
  readonly luxConditional = input.required<boolean>();
  /** Bezeichnung für die Screenreader-Ansage; ohne Angabe keine Ansage. */
  readonly luxConditionalAnnounce = input<string>();

  private readonly announcer = inject(LuxConditionalAnnouncer);
  private readonly host = inject(ViewContainerRef).createComponent(LuxConditionalHostComponent);

  constructor() {
    this.host.setInput('template', inject(TemplateRef<unknown>));

    let previous: boolean | undefined;
    effect(() => {
      const visible = this.luxConditional();
      this.host.setInput('visible', visible);

      // Der erste Lauf spiegelt den Startzustand: weder Animation noch Ansage.
      if (previous !== undefined && previous !== visible) {
        this.host.setInput('animateEnter', true);
        const label = untracked(this.luxConditionalAnnounce);
        if (label) {
          if (visible) {
            this.announcer.announceAdded(label);
          } else {
            this.announcer.announceRemoved(label);
          }
        }
      }
      previous = visible;
    });
  }
}
