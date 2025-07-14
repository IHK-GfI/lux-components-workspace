import { Component, Input } from '@angular/core';
import { LuxCardComponent, LuxCardContentComponent } from '@ihk-gfi/lux-components';

@Component({
  selector: 'text-example',
  templateUrl: './text-example.component.html',
  imports: [LuxCardContentComponent, LuxCardComponent]
})
export class TextExampleComponent {
  @Input() title = 'Lorem ipsum';

  constructor() {}
}
