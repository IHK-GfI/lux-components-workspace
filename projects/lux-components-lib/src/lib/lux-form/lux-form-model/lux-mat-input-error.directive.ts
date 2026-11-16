import { Directive, OnChanges, inject, input } from '@angular/core';
import { MatInput } from '@angular/material/input';

/**
 * Überträgt den angezeigten Fehler eines LUX-FormControls auf MatInput, das daraus aria-invalid setzt.
 *
 * MatInput ermittelt seinen errorState nur über ein NgControl am Eingabeelement. Das gibt es bei den LUX-FormControls
 * nicht, aria-invalid stünde sonst auch bei einem angezeigten Fehler auf "false". Bei einem leeren Pflichtfeld lässt
 * MatInput das Attribut bewusst weg.
 */
@Directive({
  selector: '[luxMatInputError]'
})
export class LuxMatInputErrorDirective implements OnChanges {
  readonly luxMatInputError = input(false);

  private readonly matInput = inject(MatInput, { self: true });

  // Bewusst kein effect(): ngOnChanges läuft sicher vor den Host-Bindings von MatInput im selben Durchlauf.
  ngOnChanges() {
    this.matInput.errorState = this.luxMatInputError();
  }
}
