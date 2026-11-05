import { JsonPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, NgZone, inject, input } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { FormGroup } from '@angular/forms';
import { combineLatest, map, merge, startWith, switchMap } from 'rxjs';

@Component({
  selector: 'example-form-value',
  templateUrl: './example-form-value.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [JsonPipe]
})
export class ExampleFormValueComponent {
  readonly showValue = input(true);
  readonly form = input.required<FormGroup<any>>();
  readonly controlBinding = input.required<string>();
  readonly suffix = input('');

  private readonly ngZone = inject(NgZone);

  /**
   * Manche Form-Controls (z.B. lux-timepicker/lux-datepicker) schreiben ihren Wert bewusst mit
   * {emitEvent:false} (verhindert Rückkopplungsschleifen über formControl.valueChanges, siehe dort).
   * Ein reines form.events-Abonnement feuert dann nach der allerersten "lauten" Änderung (z.B. dem
   * ersten markAsDirty()) nie wieder - diese Anzeige fror danach dauerhaft auf dem letzten Stand
   * ein, obwohl der tatsächliche Wert längst weiter aktualisiert wurde. Deshalb zusätzlich bei jedem
   * "stable"-Tick der Zone (nach jeder abgeschlossenen Nutzerinteraktion, unabhängig von emitEvent)
   * neu lesen.
   */
  readonly formState = toSignal(
    combineLatest([toObservable(this.form), toObservable(this.controlBinding)]).pipe(
      switchMap(([form, controlBinding]) =>
        merge(form.events, this.ngZone.onStable).pipe(
          startWith(null),
          map(() => ({
            value: form.get(controlBinding)?.value,
            valid: form.valid,
            dirty: form.dirty,
            touched: form.touched
          }))
        )
      )
    ),
    { initialValue: { value: undefined, valid: false, dirty: false, touched: false } }
  );
}
