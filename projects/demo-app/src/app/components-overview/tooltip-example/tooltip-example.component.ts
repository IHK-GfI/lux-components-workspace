import { Component } from '@angular/core';
import { TooltipPosition } from '@angular/material/tooltip';
import { LuxInputAcComponent, LuxSelectAcComponent, LuxToggleAcComponent, LuxTooltipDirective } from '@ihk-gfi/lux-components';
import { ExampleBaseContentComponent } from '../../example-base/example-base-root/example-base-subcomponents/example-base-content/example-base-content.component';
import { ExampleBaseSimpleOptionsComponent } from '../../example-base/example-base-root/example-base-subcomponents/example-base-options/example-base-simple-options.component';
import { ExampleBaseStructureComponent } from '../../example-base/example-base-root/example-base-subcomponents/example-base-structure/example-base-structure.component';

@Component({
  selector: 'app-tooltip-example',
  templateUrl: './tooltip-example.component.html',
  imports: [
    LuxTooltipDirective,
    LuxToggleAcComponent,
    LuxSelectAcComponent,
    LuxInputAcComponent,
    ExampleBaseStructureComponent,
    ExampleBaseContentComponent,
    ExampleBaseSimpleOptionsComponent
  ]
})
export class TooltipExampleComponent {
  positionOptions = ['left', 'right', 'above', 'below', 'before', 'after'];

  message = 'Tooltip';
  disabled = false;
  hideDelay = 0;
  showDelay = 0;
  position: TooltipPosition = 'above';

  constructor() {}
}
