import { JsonPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { Field } from '@angular/forms/signals';

@Component({
  selector: 'example-signal-form-value',
  templateUrl: './example-signal-form-value.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [JsonPipe]
})
export class ExampleSignalFormValueComponent {
  readonly showValue = input(true);
  readonly field = input.required<Field<any>>();
  readonly suffix = input('');
  readonly formState = computed(() => {
    const state = this.field()();
    return {
      value: state.value(),
      valid: state.valid(),
      dirty: state.dirty(),
      touched: state.touched()
    };
  });
}
