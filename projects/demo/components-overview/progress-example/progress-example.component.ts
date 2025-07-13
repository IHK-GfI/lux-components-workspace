import { NgStyle } from '@angular/common';
import { Component } from '@angular/core';
import {
    LuxAriaLabelDirective,
    LuxButtonComponent,
    LuxFormHintComponent,
    LuxInputAcComponent,
    LuxProgressColors,
    LuxProgressComponent,
    LuxProgressModeType,
    LuxProgressSizeType,
    LuxSelectAcComponent
} from '@ihk-gfi/lux-components';
import {
  ExampleBaseStructureComponent
} from '../../example-base/example-base-root/example-base-subcomponents/example-base-structure/example-base-structure.component';
import {
  ExampleBaseContentComponent
} from '../../example-base/example-base-root/example-base-subcomponents/example-base-content/example-base-content.component';
import {
  ExampleBaseSimpleOptionsComponent
} from '../../example-base/example-base-root/example-base-subcomponents/example-base-options/example-base-simple-options.component';

@Component({
  selector: 'app-progress-example',
  templateUrl: './progress-example.component.html',
  imports: [
    LuxProgressComponent,
    LuxButtonComponent,
    LuxAriaLabelDirective,
    LuxSelectAcComponent,
    LuxInputAcComponent,
    LuxFormHintComponent,
    ExampleBaseStructureComponent,
    ExampleBaseContentComponent,
    NgStyle,
    ExampleBaseSimpleOptionsComponent
  ]
})
export class ProgressBarExampleComponent {
  sizes = ['small', 'medium', 'large'];
  colors = LuxProgressColors;
  backgroundColor = '';
  modes = ['determinate', 'indeterminate'];

  size: LuxProgressSizeType = 'medium';
  mode: LuxProgressModeType = 'determinate';
  value = 70;

  constructor() {}

  addBarProgress() {
    this.value = this.value + 10 > 100 ? 100 : this.value + 10;
  }

  subtractBarProgress() {
    this.value = this.value - 10 < 0 ? 0 : this.value - 10;
  }
}
