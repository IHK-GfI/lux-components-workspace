import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'example-base-content',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class.example-content-centered]': 'exampleCentered()'
  },
  template: '<ng-content></ng-content>'
})
export class ExampleBaseContentComponent {
  readonly exampleCentered = input(false);
}
