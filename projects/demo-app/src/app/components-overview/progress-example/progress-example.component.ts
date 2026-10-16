import { NgStyle } from '@angular/common';
import { Component } from '@angular/core';
import {
  LuxButtonComponent,
  LuxFormHintComponent,
  LuxInputAcComponent,
  LuxProgressColors,
  LuxProgressComponent,
  LuxProgressModeType,
  LuxProgressSizeType,
  LuxProgressTextPositionType,
  LuxSelectAcComponent,
  LuxToggleAcComponent
} from '@ihk-gfi/lux-components';
import { StatusMarkerComponent } from '../../base/status-marker/status-marker.component';
import { DemoMarkerType } from '../../base/status-marker/status-marker.model';
import { ExampleBaseContentComponent } from '../../example-base/example-base-root/example-base-subcomponents/example-base-content/example-base-content.component';
import { ExampleBaseSimpleOptionsComponent } from '../../example-base/example-base-root/example-base-subcomponents/example-base-options/example-base-simple-options.component';
import { ExampleBaseStructureComponent } from '../../example-base/example-base-root/example-base-subcomponents/example-base-structure/example-base-structure.component';

@Component({
  selector: 'app-progress-example',
  templateUrl: './progress-example.component.html',
  imports: [
    LuxProgressComponent,
    LuxButtonComponent,
    LuxSelectAcComponent,
    LuxToggleAcComponent,
    LuxInputAcComponent,
    LuxFormHintComponent,
    StatusMarkerComponent,
    ExampleBaseStructureComponent,
    ExampleBaseContentComponent,
    NgStyle,
    ExampleBaseSimpleOptionsComponent
  ]
})
export class ProgressBarExampleComponent {
  readonly markerTypeNew = DemoMarkerType.New;

  sizes = ['small', 'medium', 'large'];
  colors = LuxProgressColors;
  backgroundColor = '';
  modes = ['determinate', 'indeterminate'];

  size: LuxProgressSizeType = 'medium';
  mode: LuxProgressModeType = 'determinate';
  value = 70;
  muted = false;
  showText = false;
  text = '';
  textPositions: LuxProgressTextPositionType[] = ['bottom', 'left', 'top'];
  textPosition: LuxProgressTextPositionType = 'bottom';

  constructor() {}

  addBarProgress() {
    this.value = this.value + 10 > 100 ? 100 : this.value + 10;
  }

  subtractBarProgress() {
    this.value = this.value - 10 < 0 ? 0 : this.value - 10;
  }
}
