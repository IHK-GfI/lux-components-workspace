import { JsonPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'example-value',
  templateUrl: './example-value.component.html',
  changeDetection: ChangeDetectionStrategy.Default,
  imports: [JsonPipe]
})
export class ExampleValueComponent {
  @Input() value: any;
  @Input() suffix = '';
}
