import { Component, signal, ChangeDetectionStrategy } from '@angular/core';
import { LuxInputAcComponent, LuxRippleDirective, LuxToggleAcComponent } from '@ihk-gfi/lux-components';
import { ExampleBaseContentComponent } from '../../example-base/example-base-root/example-base-subcomponents/example-base-content/example-base-content.component';
import { ExampleBaseSimpleOptionsComponent } from '../../example-base/example-base-root/example-base-subcomponents/example-base-options/example-base-simple-options.component';
import { ExampleBaseStructureComponent } from '../../example-base/example-base-root/example-base-subcomponents/example-base-structure/example-base-structure.component';

@Component({
  selector: 'app-ripple-example',
  templateUrl: './ripple-example.component.html',
  styleUrls: ['./ripple-example.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    LuxRippleDirective,
    LuxToggleAcComponent,
    LuxInputAcComponent,
    ExampleBaseStructureComponent,
    ExampleBaseContentComponent,
    ExampleBaseSimpleOptionsComponent
  ]
})
export class RippleExampleComponent {
  readonly color = signal('');
  readonly unbounded = signal(false);
  readonly centered = signal(false);
  readonly radius = signal(0);
  readonly disabled = signal(false);
  readonly enterDuration = signal(0);
  readonly exitDuration = signal(0);
}
