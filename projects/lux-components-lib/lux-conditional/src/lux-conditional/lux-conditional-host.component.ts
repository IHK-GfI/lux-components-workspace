import { NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, input, TemplateRef, ViewEncapsulation } from '@angular/core';

/**
 * Interner Render-Host von `*luxConditional`. Trägt die Enter- und Leave-Animation,
 * weil eine strukturelle Direktive selbst keine Styles mitbringen kann.
 */
@Component({
  selector: 'lux-conditional',
  imports: [NgTemplateOutlet],
  styleUrl: './lux-conditional-host.component.scss',
  // Ohne Kapselung: Angular benennt @keyframes sonst um, aktualisiert aber Verweise innerhalb von @media nicht.
  // Der Fade-in bei reduzierter Bewegung liefe dann nie und die Enter-Klasse bliebe hängen.
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (visible()) {
      <div class="lux-conditional__panel" [animate.enter]="enterClass()" animate.leave="lux-conditional__panel--leave">
        <div class="lux-conditional__content">
          <ng-container *ngTemplateOutlet="template()" />
        </div>
      </div>
    }
  `
})
export class LuxConditionalHostComponent {
  readonly template = input.required<TemplateRef<unknown>>();
  readonly visible = input.required<boolean>();
  /** False beim initialen Rendern, damit ein bereits sichtbarer Bereich nicht animiert erscheint. */
  readonly animateEnter = input(false);

  protected readonly enterClass = computed(() => (this.animateEnter() ? 'lux-conditional__panel--enter' : ''));
}
