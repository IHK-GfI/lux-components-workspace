import { Component, input, ChangeDetectionStrategy } from '@angular/core';
import { LuxCardComponent, LuxCardContentComponent } from '@ihk-gfi/lux-components';

@Component({
  selector: 'text-example',
  templateUrl: './text-example.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [LuxCardContentComponent, LuxCardComponent]
})
export class TextExampleComponent {
  readonly title = input('Lorem ipsum');
}
