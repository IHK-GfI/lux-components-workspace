import { JsonPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { FormGroup } from '@angular/forms';
import { combineLatest, map, startWith, switchMap } from 'rxjs';

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
  readonly formState = toSignal(
    combineLatest([toObservable(this.form), toObservable(this.controlBinding)]).pipe(
      switchMap(([form, controlBinding]) =>
        form.events.pipe(
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
