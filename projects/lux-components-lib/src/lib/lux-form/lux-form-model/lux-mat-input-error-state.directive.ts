import { Directive, inject, input, OnChanges } from '@angular/core';
import { MatInput } from '@angular/material/input';

/**
 * Überträgt den Fehlerzustand eines LUX-Formularfelds auf MatInput.
 *
 * MatInput leitet aria-invalid aus seinem errorState ab, aktualisiert diesen aber nur selbst, wenn am nativen
 * Element eine Forms-Direktive (NgControl) hängt. Die LUX-Felder binden ihren Wert ohne [formControl] an das
 * native Element; ohne diese Direktive bliebe aria-invalid deshalb immer "false".
 *
 * Gesetzt wird in ngOnChanges, also noch bevor Angular im selben Durchlauf die Host-Bindings von MatInput
 * auswertet.
 */
@Directive({
  selector: '[matInput][luxMatInputErrorState]'
})
export class LuxMatInputErrorStateDirective implements OnChanges {
  readonly luxMatInputErrorState = input(false);

  private readonly matInput = inject(MatInput);

  ngOnChanges(): void {
    this.matInput.errorState = this.luxMatInputErrorState();
  }
}
