import { Component } from '@angular/core';
import { LuxInputAcComponent, LuxRippleDirective, LuxToggleAcComponent } from 'lux-components-lib';
import { ExampleBaseContentComponent } from '../../example-base/example-base-root/example-base-subcomponents/example-base-content/example-base-content.component';
import { ExampleBaseSimpleOptionsComponent } from '../../example-base/example-base-root/example-base-subcomponents/example-base-options/example-base-simple-options.component';
import { ExampleBaseStructureComponent } from '../../example-base/example-base-root/example-base-subcomponents/example-base-structure/example-base-structure.component';

@Component({
  selector: 'app-ripple-example',
  templateUrl: './ripple-example.component.html',
  styleUrls: ['./ripple-example.component.scss'],
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
  color = '';
  unbounded = false;
  centered = false;
  radius = 0;
  disabled = false;
  enterDuration = 0;
  exitDuration = 0;

  constructor() {}
}
