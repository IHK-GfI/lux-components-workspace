import { JsonPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'example-value',
  templateUrl: './example-value.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [JsonPipe]
})
export class ExampleValueComponent {
  readonly value = input<unknown>();
  readonly suffix = input('');
}
